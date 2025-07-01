import React, { useState } from 'react';
import './Main.css';

function Main() {
  // 랜덤 선택 함수
  const getRandomImages = (imageList, count) => {
    const shuffled = [...imageList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // 세로 이미지 리스트 (실제 파일명으로 수정 필요)
  const verticalImages = [
    'main1.jpg',
    'main2.jpg', 
    'main3.jpg',
    'main4.jpg'
    // 필요에 따라 더 추가
  ];

  // 가로 이미지 리스트 (실제 파일명으로 수정 필요)
  const horizonImages = [
    'main1.jpg',
    'main2.jpg',
    'main3.jpg',
    'main4.jpg',
    'main5.jpg',
    'main6.jpg'
    // 필요에 따라 더 추가
  ];

  // 상태로 선택된 이미지들 관리
  const [selectedVerticalImages, setSelectedVerticalImages] = useState(
    () => getRandomImages(verticalImages, 2)
  );
  const [selectedHorizonImages, setSelectedHorizonImages] = useState(
    () => getRandomImages(horizonImages, 5)
  );

  // 로고 클릭 핸들러 - 이미지 재선택
  const handleLogoClick = () => {
    setSelectedVerticalImages(getRandomImages(verticalImages, 2));
    setSelectedHorizonImages(getRandomImages(horizonImages, 5));
  };

  return (
    <main className="main-container">
      <div className="main-logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
        <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/main-logo.png"/>
      </div>
      <div className="main-image-wrap">
        {selectedVerticalImages.map((image, index) => (
          <div key={`vertical-${index}`} className={`main-image-ver main-image${index + 1}`}>
            <img src={`/images/main/vertical/${image}`}/>
          </div>
        ))}
        {selectedHorizonImages.map((image, index) => (
          <div key={`horizon-${index}`} className={`main-image-hor main-image${index + 3}`}>
            <img src={`/images/main/horizon/${image}`}/>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Main; 