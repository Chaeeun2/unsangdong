import React, { useState, useEffect } from 'react';
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
  const [selectedVerticalImages, setSelectedVerticalImages] = useState([]);
  const [selectedHorizonImages, setSelectedHorizonImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextImageSet, setNextImageSet] = useState(null);

  // 이미지 preload 함수
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Firebase에서 이미지 로드 (점진적 로딩)
  const loadImages = async () => {
    try {
      setLoading(true);
      
      // 먼저 세로 이미지만 로드 (더 중요)
      const vertical = await mainImageService.getMainImagesByType('vertical');
      setAllVerticalImages(vertical);
      
      if (vertical.length > 0) {
        const selectedVertical = getRandomImages(vertical, Math.min(2, vertical.length));
        setSelectedVerticalImages(selectedVertical);
      }
      
      // 세로 이미지 로드 후 가로 이미지 로드
      const horizontal = await mainImageService.getMainImagesByType('horizontal');
      setAllHorizontalImages(horizontal);
      
      if (horizontal.length > 0) {
        const selectedHorizontal = getRandomImages(horizontal, Math.min(5, horizontal.length));
        setSelectedHorizonImages(selectedHorizontal);
      }

      // 선택된 이미지들 우선순위별 preload
      const priorityImages = [
        ...selectedVerticalImages.map(img => img.optimizedImageUrl || img.imageUrl),
        ...selectedHorizonImages.slice(0, 2).map(img => img.optimizedImageUrl || img.imageUrl) // 처음 2개만 우선
      ];
      
      // 우선순위 이미지 먼저 preload
      await Promise.allSettled(priorityImages.map(preloadImage));
      
      // 나머지 이미지 백그라운드에서 preload
      const remainingImages = selectedHorizonImages.slice(2).map(img => img.optimizedImageUrl || img.imageUrl);
      if (remainingImages.length > 0) {
        Promise.allSettled(remainingImages.map(preloadImage));
      }
        
    } catch (error) {
      console.error('이미지 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 다음 이미지 세트 미리 로드 (2장만)
  const preloadNextImageSet = () => {
    if (allVerticalImages.length === 0 && allHorizontalImages.length === 0) return;
    
    // 랜덤으로 2장의 이미지만 선택
    const allImages = [...allVerticalImages, ...allHorizontalImages];
    const nextImages = getRandomImages(allImages, 2);
    
    // 선택된 이미지들 preload
    const imageUrls = nextImages.map(img => img.optimizedImageUrl || img.imageUrl);
    Promise.allSettled(imageUrls.map(preloadImage))
      .then(() => {
        setNextImageSet(nextImages);
      });
  };

  // 이미지 랜덤 선택 함수 (미리 로드된 이미지 사용)
  const refreshImages = () => {
    // 미리 로드된 이미지가 있으면 사용
    if (nextImageSet && nextImageSet.length > 0) {
      // 미리 로드된 이미지들로 교체
      const verticalFromNext = nextImageSet.filter(img => img.type === 'vertical').slice(0, 2);
      const horizontalFromNext = nextImageSet.filter(img => img.type === 'horizontal').slice(0, 5);
      
      if (verticalFromNext.length > 0) {
        setSelectedVerticalImages(verticalFromNext);
      } else if (allVerticalImages.length > 0) {
        setSelectedVerticalImages(getRandomImages(allVerticalImages, Math.min(2, allVerticalImages.length)));
      }
      
      if (horizontalFromNext.length > 0) {
        setSelectedHorizonImages(horizontalFromNext);
      } else if (allHorizontalImages.length > 0) {
        setSelectedHorizonImages(getRandomImages(allHorizontalImages, Math.min(5, allHorizontalImages.length)));
      }
      
      setNextImageSet(null);
    } else {
      // 기존 방식으로 랜덤 선택
      if (allVerticalImages.length > 0) {
        setSelectedVerticalImages(getRandomImages(allVerticalImages, Math.min(2, allVerticalImages.length)));
      }
      if (allHorizontalImages.length > 0) {
        setSelectedHorizonImages(getRandomImages(allHorizontalImages, Math.min(5, allHorizontalImages.length)));
      }
    }
    
    // 다음 이미지 세트 미리 로드
    preloadNextImageSet();
  };

  // 로고 클릭 핸들러 - 이미지 재선택
  const handleLogoClick = () => {
    refreshImages();
  };

  // 컴포넌트 마운트 시 이미지 로드
  useEffect(() => {
    loadImages();
  }, []);

  // 5초마다 이미지 랜덤 변경 (미리 로드된 이미지 사용)
  useEffect(() => {
    if (allVerticalImages.length === 0 && allHorizontalImages.length === 0) {
      return; // 이미지가 로드되지 않았으면 인터벌 설정 안함
    }

    // 초기 로드 후 3초 뒤에 다음 이미지 2장 미리 로드
    const preloadTimer = setTimeout(() => {
      preloadNextImageSet();
    }, 3000);

    // 5초마다 이미지 변경
    const interval = setInterval(() => {
      refreshImages();
    }, 5000);

    // 컴포넌트 언마운트 시 타이머들 클리어
    return () => {
      clearTimeout(preloadTimer);
      clearInterval(interval);
    };
  }, [allVerticalImages, allHorizontalImages]);

  // 로딩 중이거나 이미지가 없으면 기본 상태 표시
  if (loading) {
    return (
      <main className="main-container">
        <div className="main-logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
          <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/main-logo.png"/>
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
        <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/main-logo.png"/>
      </div>
      <div className="main-image-wrap">
        {selectedVerticalImages.map((image, index) => (
          <div key={`vertical-${image.id}`} className={`main-image-ver main-image${index + 1}`}>
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
        {selectedHorizonImages.map((image, index) => (
          <div key={`horizon-${image.id}`} className={`main-image-hor main-image${index + 3}`}>
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