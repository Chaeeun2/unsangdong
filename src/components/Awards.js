import React, { useState, useEffect } from 'react';
import './Awards.css';
import { awardsService } from '../admin/services/dataService';

function Awards() {
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const [loading, setLoading] = useState(true);
  const [awardsData, setAwardsData] = useState([]);

  // Firebase에서 Awards 데이터 로드
  useEffect(() => {
    async function loadAwardsData() {
      try {
        setLoading(true);
        const data = await awardsService.getAwardsData();
        
        if (data.awardsData) {
          setAwardsData(data.awardsData);
        } else if (Array.isArray(data)) {
          setAwardsData(data);
        }
      } catch (error) {
        console.error('Awards 데이터 로딩 실패:', error);
        setAwardsData([]);
      } finally {
        setLoading(false);
      }
    }

    loadAwardsData();
  }, []);

  if (loading) {
    return (
      <div className="awards-container">
        <div className="awards-header">
          <div className="awards-title">AWARDS</div>
        </div>
      </div>
    );
  }

  // 연도별로 그룹화된 데이터 사용
  const dataToDisplay = awardsData || [];

  return (
    <div className="awards-container">
      <div className="awards-header">
        <div className="awards-title">AWARDS</div>
        <div className="awards-lang-options">
          <button 
            className={`awards-lang-btn ${currentLanguage === 'KO' ? 'active' : ''}`}
            onClick={() => setCurrentLanguage('KO')}
          >
            KO
          </button>
          <span className="awards-lang-separator">/</span>
          <button 
            className={`awards-lang-btn ${currentLanguage === 'EN' ? 'active' : ''}`}
            onClick={() => setCurrentLanguage('EN')}
          >
            EN
          </button>
        </div>
      </div>
      
      <div className="awards-content">
        {dataToDisplay.length === 0 ? (
          <div className="no-awards">수상 내역이 없습니다.</div>
        ) : (
          dataToDisplay.map((yearData, yearIndex) => (
            <div key={yearIndex} className="awards-year-section">
              <div className="awards-year">{yearData.year}</div>
              <div className="awards-items">
                {yearData.awards.map((award, awardIndex) => (
                  <div key={awardIndex} className="award-item">
                    <div className="award-main">
                      <div className={`award-title ${currentLanguage === 'KO' ? 'title-ko' : ''}`}>{award.title[currentLanguage]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Awards; 