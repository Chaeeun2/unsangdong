import React, { useState, useEffect } from 'react';
import './About.css';
import { aboutService } from '../admin/services/dataService';

function About() {
  const [selectedCeo, setSelectedCeo] = useState(null);
  const [langMode, setLangMode] = useState('KO');
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState({
    mainImage: '',
    descriptionKo: '',
    descriptionEn: '',
    organizationImage: '',
    organizationImageMo: ''
  });
  const [ceoData, setCeoData] = useState({
    jang: {
      nameEn: '',
      nameKo: '',
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: ''
    },
    shin: {
      nameEn: '',
      nameKo: '',
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: ''
    }
  });
  
  // 모달이 열릴 때 body 스크롤 비활성화
  useEffect(() => {
    if (selectedCeo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedCeo]);

  // Firebase에서 About 데이터 로드
  useEffect(() => {
    async function loadAboutData() {
      try {
        setLoading(true);
        const aboutData = await aboutService.getAboutData();
        
        if (aboutData.companyInfo) {
          setCompanyInfo(aboutData.companyInfo);
        }
        
        if (aboutData.ceoData) {
          setCeoData(aboutData.ceoData);
        }
      } catch (error) {
        console.error('About 데이터 로딩 실패:', error);
        // 실패 시 기본값 사용 (이미 state에 설정됨)
      } finally {
        setLoading(false);
      }
    }

    loadAboutData();
  }, []);

  const handleLangModeChange = (mode) => {
    setLangMode(mode);
  };

  const openModal = (ceoKey) => {
    setSelectedCeo(ceoKey);
  };

  const closeModal = () => {
    setSelectedCeo(null);
  };

  if (loading) {
    return (
      <div className="about-container">
        <div className="about-title">ABOUT</div>
        <div className="about-content">
        <div className="loading-message"></div>
      </div>
      </div>
    );
  }

  return (
    <div className="about-container">
      <div className="about-title">ABOUT</div>
      <div className="about-content">
        <img src={companyInfo.mainImage} alt="About" />
        <div className="ceo-wrap">
          <div className="ceo ceo1" onClick={() => openModal('jang')}>
            <div className="ceo-name">
              <div className="ceo-name-en">{ceoData.jang.nameEn}</div>
              <div className="ceo-name-ko">{ceoData.jang.nameKo}</div>
            </div>
            <div className="ceo-arrow">→</div>
            <div className="ceo-line"></div>
          </div>
          <div className="ceo ceo2" onClick={() => openModal('shin')}>
            <div className="ceo-name">
              <div className="ceo-name-en">{ceoData.shin.nameEn}</div>
              <div className="ceo-name-ko">{ceoData.shin.nameKo}</div>
            </div>
            <div className="ceo-arrow">→</div>
            <div className="ceo-line"></div>
          </div>
        </div>
        <div className="about-description-wrap">
          <div className="lang-options">
            <button 
              className={`lang-btn ${langMode === 'KO' ? 'active' : ''}`}
              onClick={() => handleLangModeChange('KO')}
            >
              KO
            </button>
            <span className="lang-separator">/</span>
            <button 
              className={`lang-btn ${langMode === 'EN' ? 'active' : ''}`}
              onClick={() => handleLangModeChange('EN')}
            >
              EN
            </button>
          </div>

          <div className={`about-description-ko ${langMode === 'KO' ? 'active' : ''}`}>
            {companyInfo.descriptionKo && (
              <div dangerouslySetInnerHTML={{ __html: companyInfo.descriptionKo.replace(/\n/g, '<br/>') }}></div>
            )}
          </div>
          <div className={`about-description-en ${langMode === 'EN' ? 'active' : ''}`}>
            {companyInfo.descriptionEn && (
              <div dangerouslySetInnerHTML={{ __html: companyInfo.descriptionEn.replace(/\n/g, '<br/>') }}></div>
            )}
          </div>
        </div>
        <div className="organization">
          <img src={companyInfo.organizationImage} alt="Organization" />
        </div>
        <div className="organization-mo">
          <img src={companyInfo.organizationImageMo} alt="Organization Mobile" />
        </div>
      </div>
      
      {/* CEO 모달 */}
      {selectedCeo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/close.png" alt="Close" />
            </button>
            <div className="modal-header">
              <div className="modal-name-wrap">
                <h2 className="modal-name-ko">{ceoData[selectedCeo].nameKo}</h2>
                <h2 className="modal-name-en">{ceoData[selectedCeo].nameEn}</h2>
              </div>
              <div className="modal-title-contaner">
                <div className="modal-title-line"></div>
                <div className="modal-title-wrap">
                  <p className="modal-title">{ceoData[selectedCeo].title}</p>
                  <p className="modal-title-en">{ceoData[selectedCeo].titleEn}</p>
                </div>
              </div>
              <div className="modal-line"></div>
            </div>
            <div className="modal-body">
              <div className="modal-description">
                <p dangerouslySetInnerHTML={{ __html: ceoData[selectedCeo].description }}></p>
              </div>
              <div className="modal-description-en">
                <p dangerouslySetInnerHTML={{ __html: ceoData[selectedCeo].descriptionEn }}></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default About; 