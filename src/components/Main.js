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

  // Firebase에서 이미지 로드
  const loadImages = async () => {
    try {
      setLoading(true);
      const [vertical, horizontal] = await Promise.all([
        mainImageService.getMainImagesByType('vertical'),
        mainImageService.getMainImagesByType('horizontal')
      ]);
      
      setAllVerticalImages(vertical);
      setAllHorizontalImages(horizontal);
      
      // 이미지가 있으면 랜덤 선택
      if (vertical.length > 0) {
        setSelectedVerticalImages(getRandomImages(vertical, Math.min(2, vertical.length)));
      }
      if (horizontal.length > 0) {
        setSelectedHorizonImages(getRandomImages(horizontal, Math.min(5, horizontal.length)));
      }
    } catch (error) {
      console.error('이미지 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 이미지 랜덤 선택 함수
  const refreshImages = () => {
    if (allVerticalImages.length > 0) {
      setSelectedVerticalImages(getRandomImages(allVerticalImages, Math.min(2, allVerticalImages.length)));
    }
    if (allHorizontalImages.length > 0) {
      setSelectedHorizonImages(getRandomImages(allHorizontalImages, Math.min(5, allHorizontalImages.length)));
    }
  };

  // 로고 클릭 핸들러 - 이미지 재선택
  const handleLogoClick = () => {
    refreshImages();
  };

  // 컴포넌트 마운트 시 이미지 로드
  useEffect(() => {
    loadImages();
  }, []);

  // 5초마다 이미지 랜덤 변경
  useEffect(() => {
    if (allVerticalImages.length === 0 && allHorizontalImages.length === 0) {
      return; // 이미지가 로드되지 않았으면 인터벌 설정 안함
    }

    const interval = setInterval(() => {
      refreshImages();
    }, 5000);

    // 컴포넌트 언마운트 시 인터벌 클리어
    return () => clearInterval(interval);
  }, [allVerticalImages, allHorizontalImages]);

  // 로딩 중이거나 이미지가 없으면 기본 상태 표시
  if (loading) {
    return (
      <main className="main-container">
        <div className="main-logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
          <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/main-logo.png"/>
        </div>
        <div className="main-image-wrap">
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
            <img src={image.imageUrl} alt={`메인 세로 이미지 ${index + 1}`}/>
          </div>
        ))}
        {selectedHorizonImages.map((image, index) => (
          <div key={`horizon-${image.id}`} className={`main-image-hor main-image${index + 3}`}>
            <img src={image.imageUrl} alt={`메인 가로 이미지 ${index + 1}`}/>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Main; 