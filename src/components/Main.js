import React, { useState, useEffect, useRef } from 'react';
import './Main.css';
import { mainImageService } from '../services/mainImageService';

function Main() {
  // 랜덤 선택 함수
  const getRandomImages = (imageList, count) => {
    const shuffled = [...imageList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // 상태 관리
  const [allVerticalImages, setAllVerticalImages] = useState([]);
  const [allHorizontalImages, setAllHorizontalImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 이중 버퍼링을 위한 두 세트의 이미지 상태
  const [imageSetA, setImageSetA] = useState({ vertical: [], horizontal: [] });
  const [imageSetB, setImageSetB] = useState({ vertical: [], horizontal: [] });
  const [activeSet, setActiveSet] = useState('A'); // 현재 표시 중인 세트

  // 다음 세트 로딩 완료 여부
  const nextSetLoadedRef = useRef(false);
  const preloadingRef = useRef(false);
  const intervalRef = useRef(null);
  const [resetTimer, setResetTimer] = useState(0); // 타이머 리셋 트리거

  // 이미지 preload 함수
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // 이미지 세트 프리로드 (정확히 7장)
  const preloadImageSet = async (verticalImages, horizontalImages) => {
    const urls = [
      ...verticalImages.map(img => img.optimizedImageUrl || img.imageUrl),
      ...horizontalImages.map(img => img.optimizedImageUrl || img.imageUrl)
    ];

    try {
      await Promise.all(urls.map(preloadImage));
      return true;
    } catch (error) {
      console.error('이미지 프리로드 실패:', error);
      return false;
    }
  };

  // Firebase에서 이미지 로드
  const loadImages = async () => {
    try {
      setLoading(true);

      // 이미지 데이터 로드
      const [vertical, horizontal] = await Promise.all([
        mainImageService.getMainImagesByType('vertical'),
        mainImageService.getMainImagesByType('horizontal')
      ]);

      setAllVerticalImages(vertical);
      setAllHorizontalImages(horizontal);

      if (vertical.length > 0 && horizontal.length > 0) {
        // 첫 번째 세트 설정
        const initialVertical = getRandomImages(vertical, Math.min(2, vertical.length));
        const initialHorizontal = getRandomImages(horizontal, Math.min(5, horizontal.length));

        // 첫 번째 세트 프리로드 후 표시
        await preloadImageSet(initialVertical, initialHorizontal);

        setImageSetA({
          vertical: initialVertical,
          horizontal: initialHorizontal
        });

        // 1초 후 두 번째 세트 미리 준비 (더 빠르게 준비)
        setTimeout(() => {
          prepareNextSet();
        }, 1000);
      }
    } catch (error) {
      console.error('이미지 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 다음 이미지 세트 준비 (백그라운드에서)
  const prepareNextSet = async () => {
    if (preloadingRef.current || nextSetLoadedRef.current || allVerticalImages.length === 0 || allHorizontalImages.length === 0) {
      return;
    }

    preloadingRef.current = true;

    try {
      // 정확히 7장 선택 (세로 2, 가로 5)
      const nextVertical = getRandomImages(allVerticalImages, Math.min(2, allVerticalImages.length));
      const nextHorizontal = getRandomImages(allHorizontalImages, Math.min(5, allHorizontalImages.length));

      // 이미지 프리로드 (브라우저 유휴 시간 활용)
      if (window.requestIdleCallback) {
        window.requestIdleCallback(async () => {
          const success = await preloadImageSet(nextVertical, nextHorizontal);

          if (success) {
            // 비활성 세트에 저장
            if (activeSet === 'A') {
              setImageSetB({
                vertical: nextVertical,
                horizontal: nextHorizontal
              });
            } else {
              setImageSetA({
                vertical: nextVertical,
                horizontal: nextHorizontal
              });
            }
            nextSetLoadedRef.current = true;
          }
          preloadingRef.current = false;
        });
      } else {
        // requestIdleCallback이 없으면 setTimeout 사용
        setTimeout(async () => {
          const success = await preloadImageSet(nextVertical, nextHorizontal);

          if (success) {
            if (activeSet === 'A') {
              setImageSetB({
                vertical: nextVertical,
                horizontal: nextHorizontal
              });
            } else {
              setImageSetA({
                vertical: nextVertical,
                horizontal: nextHorizontal
              });
            }
            nextSetLoadedRef.current = true;
          }
          preloadingRef.current = false;
        }, 100);
      }
    } catch (error) {
      console.error('다음 세트 준비 실패:', error);
      preloadingRef.current = false;
    }
  };

  // 이미지 세트 전환
  const switchImageSet = async () => {
    if (!nextSetLoadedRef.current) {
      // 다음 세트가 준비되지 않았으면 새로운 이미지 선택 후 프리로드
      const newVertical = getRandomImages(allVerticalImages, Math.min(2, allVerticalImages.length));
      const newHorizontal = getRandomImages(allHorizontalImages, Math.min(5, allHorizontalImages.length));

      // 로고 클릭 시에도 이미지 프리로드 수행
      const success = await preloadImageSet(newVertical, newHorizontal);

      if (success) {
        if (activeSet === 'A') {
          setImageSetB({ vertical: newVertical, horizontal: newHorizontal });
          setActiveSet('B');
        } else {
          setImageSetA({ vertical: newVertical, horizontal: newHorizontal });
          setActiveSet('A');
        }
      }
    } else {
      // 준비된 세트로 즉시 전환
      setActiveSet(activeSet === 'A' ? 'B' : 'A');
      nextSetLoadedRef.current = false;
    }

    // 다음 세트 미리 준비 (2초 후)
    setTimeout(() => {
      prepareNextSet();
    }, 2000);
  };

  // 로고 클릭 핸들러
  const handleLogoClick = () => {
    switchImageSet();
    // 타이머 리셋
    setResetTimer(prev => prev + 1);
  };

  // 컴포넌트 마운트 시 이미지 로드
  useEffect(() => {
    loadImages();
  }, []);

  // 5초마다 이미지 전환 (타이머 리셋 가능)
  useEffect(() => {
    if (allVerticalImages.length === 0 || allHorizontalImages.length === 0) {
      return;
    }

    // 이전 인터벌 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 새로운 인터벌 설정
    intervalRef.current = setInterval(() => {
      switchImageSet();
    }, 5000);

    // 클린업
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [allVerticalImages, allHorizontalImages, resetTimer]); // resetTimer 추가로 로고 클릭 시 타이머 리셋

  // 현재 표시할 이미지 세트 결정
  const currentImages = activeSet === 'A' ? imageSetA : imageSetB;
  const selectedVerticalImages = currentImages.vertical;
  const selectedHorizontalImages = currentImages.horizontal;

  // 로딩 중
  if (loading) {
    return (
      <main className="main-container">
        <div className="main-logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
          <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/main-logo.png" alt="메인 로고"/>
        </div>
        <div className="main-image-wrap">
          {/* 스켈레톤 로딩 */}
          <div className="skeleton-image skeleton-vertical skeleton-1"></div>
          <div className="skeleton-image skeleton-vertical skeleton-2"></div>
          <div className="skeleton-image skeleton-horizontal skeleton-3"></div>
          <div className="skeleton-image skeleton-horizontal skeleton-4"></div>
          <div className="skeleton-image skeleton-horizontal skeleton-5"></div>
          <div className="skeleton-image skeleton-horizontal skeleton-6"></div>
          <div className="skeleton-image skeleton-horizontal skeleton-7"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="main-container">
      <div className="main-logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
        <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/main-logo.png" alt="메인 로고"/>
      </div>
      <div className="main-image-wrap">
        {selectedVerticalImages.map((image, index) => (
          <div key={`${activeSet}-vertical-${index}`} className={`main-image-ver main-image${index + 1}`}>
            <img
              src={image.optimizedImageUrl || image.imageUrl}
              alt={`메인 세로 이미지 ${index + 1}`}
              loading="eager"
              onError={(e) => {
                // 최적화된 이미지 로드 실패시 원본으로 fallback
                if (e.target.src !== image.imageUrl) {
                  e.target.src = image.imageUrl;
                }
              }}
            />
          </div>
        ))}
        {selectedHorizontalImages.map((image, index) => (
          <div key={`${activeSet}-horizontal-${index}`} className={`main-image-hor main-image${index + 3}`}>
            <img
              src={image.optimizedImageUrl || image.imageUrl}
              alt={`메인 가로 이미지 ${index + 1}`}
              loading="eager"
              onError={(e) => {
                // 최적화된 이미지 로드 실패시 원본으로 fallback
                if (e.target.src !== image.imageUrl) {
                  e.target.src = image.imageUrl;
                }
              }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

export default Main;