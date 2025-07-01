import React, { useState, useEffect } from 'react';
import './About.css';

function About() {
  const [selectedCeo, setSelectedCeo] = useState(null);
  const [langMode, setLangMode] = useState('KO');
  
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

  const handleLangModeChange = (mode) => {
    setLangMode(mode);
  };
  
  // CEO 데이터
  const ceoData = {
    jang: {
      nameEn: 'Yoongyoo Jang',
      nameKo: '장윤규',
      title: '건축가그룹 운생동 대표, 국민대 건축대학 교수, 갤러리 정미소 대표',
      titleEn: 'Principal of Unsangdong Architects Cooperation, Professor of Kookmin University, Representative of Gallery Jungmiso, Seoul, Korea',
      description: `장윤규는 건축과 관련된 현상들을 탐구하고 건축의 개념에서 건축의 물리적 실체가 비롯된다고 생각하는 진보적 건축가다. 서울대학교 건축학과와 동 대학원을 졸업하고 장윤규건축실험아뜰리에를 세웠다. 건축사사무소 아르텍, 희림종합건축사사무소 등에서 소장과 이사를 역임하며 현상설계를 통해 특출한 성과를 냈다. 이후 실험적 건축가집단을 주창하는 운생동건축사사무소를 설립해 '플로팅(floating)', '스킨스케이프(skinscape)', '트랜스프로그래밍(trans-programming)', '인간이 동물 되기(becoming an animal)' 등의 주제로 변화하고 움직이는, 새로운 시대의 건축에 주력했다. <br/>초창기작 예화랑, 크링 등으로 해외 유수 건축매체와 어워드에 이름을 올리는 등 국제적 명성을 얻고 서울대학교 건축대학, 홍익대학교 대학로캠퍼스, 청심 물문화관, 광주 디자인센터 등 교육문화시설과 도화서길, 생능출판사 사옥, 미동전자 사옥, 오토웨이타워, 몽유도원도 이상봉타워 등 도심의 오피스 빌딩으로 많이 알려져 있으나 주거와 중소규모 공공건축 작업도 꾸준히 지속하고 있다. AR 이머징 어워드, 한국건축문화대상, 서울시건축상, 한국건축가협회상 등을 다수 수상했고 인천 검단 박물관·도서관 복합문화시설, 국립디자인박물관, 잠실종합운동장 주경기장, 신내 컴팩트시티, 대구 중구 공공도서관, 광주비엔날레전시관 등 국제 현상설계공모에서 당선했다. 국민대학교 건축대학 교수로 재직하고 있다.`,
      descriptionEn: `Jang Yoon Gyoo is a progressive architect who believes that architecture's physical form arises from its conceptual foundations. He studied architecture at Seoul National University and later founded the Jang Yoon-Gyoo Architecture Experiment Atelier. After serving as director at Artech Architects and Heerim Architects & Planners, he co-founded Unsangdong Architects, an experimental collective known for themes like "floating," "skinscape," and "becoming an animal," exploring architecture as a dynamic, evolving entity.<br/>His early projects, such as Gallery Yeh and Kring, gained international recognition, and he has designed various cultural, educational, residential, and office buildings including the Seoul National University Architecture College, Gwangju Design Center, and Autoway Tower. He has won multiple awards, including the AR Emerging Architecture Award and the Korean Architecture Award, and secured victories in international competitions for projects like the National Design Museum and the Jamsil Main Stadium. He is currently a professor at Kookmin University's School of Architecture.`
    },
    shin: {
      nameEn: 'Changhoon Shin',
      nameKo: '신창훈',
      title: '건축가그룹 운생동 공동대표',
      titleEn: 'Principal of Unsangdong Architects Cooperation',
      description: `운생동의 공동대표 신창훈은 1970년생으로 영남대학교 건축공학과와 서울시립대학교 건축대학원을 졸업했다. 아르텍건축, 범건축, 힘마건축에서 실무 경험을 쌓고 장윤규와 함께 실험건축, 개념적 건축을 실현하기 위해서 건축가그룹 운생동을 결성했다.<br/>현 시대의 주요 관심사들을 놓치지 않고 연구하면서 '실험'과 '아이디어'를 뛰어 넘어 건축적 구축을 실현하기 위한 작업을 진행한다. '스페이스 코디네이터'와 '건축공감'을 기획, 운영하며 한국 건축의 아카이브와 소개에 힘쓰고 있다. 한국건축가협회 젊은 건축가위원회 위원장, 문화체육관광부 한국문화예술 위원회 및 국제건축문화교류 프로그램 총괄큐레이터, 대한민국 건축문화제 위원장 등으로 활동하며 젊은 건축가 저변 확대와 건축계 교류, 전시기획과 출간 등을 통한 대중 건축문화 발전을 위해 노력했다. 서울시 공공건축가를 역임했고 대구 지역 최초 총괄건축가로서 수성국제비엔날레 부위원장을 맡고 있다.`,
      descriptionEn: `Shin Chang Hoon, co-principal of Unsangdong Architects, was born in 1970 and studied architectural engineering at Yeungnam University and architecture at the University of Seoul. After working at Artech Architects, BAUM Architects, and HIMMA Architects, he co-founded Unsangdong with Jang Yoongyoo to pursue experimental and conceptual architecture.<br/>Shin focuses on turning contemporary issues into built form, going beyond ideas to architectural realization. He also promotes Korean architecture through projects like 'Space Coordinator' and 'Architectural Empathy'. He has held key roles in architectural organizations, including the Korean Institute of Architects and the Korea Arts Council, and served as Vice Chair of the Suseong International Biennale as Daegu’s first Chief Architect.`
    }
  };

  const openModal = (ceoKey) => {
    setSelectedCeo(ceoKey);
  };

  const closeModal = () => {
    setSelectedCeo(null);
  };
  return (
    <div className="about-container">
          <div className="about-title">ABOUT</div>
          <div className="about-content">
              <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/about.jpg" />
              <div className="ceo-wrap">
                  <div className="ceo ceo1" onClick={() => openModal('jang')}>
                      <div className="ceo-name">
                          <div className="ceo-name-en">Yoongyoo Jang</div>
                          <div className="ceo-name-ko">장윤규</div>
                      </div>
                      <div className="ceo-arrow">→</div>
                      <div className="ceo-line"></div>
                  </div>
                  <div className="ceo ceo2" onClick={() => openModal('shin')}>
                      <div className="ceo-name">
                          <div className="ceo-name-en">Changhoon Shin</div>
                          <div className="ceo-name-ko">신창훈</div>
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
                      건축가그룹 운생동은 개념적 건축에 뿌리를 두고, 건축의 가능성을 다각적으로 발현해 내는 건축가들의 '협력집단체'다. 진보적 건축 유형의 개발, 건축과 예술의 통합, 브랜드 가치를 만들어내는 디자인, 공공 건축을 통한 사회적 기여를 목표로 50인의 전문가가 소속되어 건축설계, 건축기획, 프로그래밍, 도시설계, 단지계획 등의 분야를 주력으로 수행한다. 
                        <br/><br/>
                        지난 24년간 공공과 사회에 대한 깊은 책임감을 지니고 한국 건축을 이끌어 나간다는 선구자적 사명감으로 새로운 시도와 실험을 멈추지 않았다. 완전하게 결합되어 종속되거나 섞이는 것이 아니라 각 요소 본연의 성질을 가진 채 병치되고 공존하는 '복합체'의 건축론을 토대로 '신화적 상상력'을 건축과 도시의 디자인으로 풀어내기 위해 부단히 노력해왔다.
                        <br/><br/>
                        갤러리정미소와 건축문화 온라인 플랫폼 스페이스 코디네이터를 통해 젊은 건축가 및 예술인들의 작업을 소개하고, 교류와 협업을 도우며, 도시 및 지역사회의 문제 해결을 위한 사회문화적 활동을 하고 있다. 시대의 이슈를 담은 전시와 공모전, 강연, 답사 및 포럼 등을 통해 접점을 넓히고 한국 건축문화 발전에 기여해왔다.
                  </div>
                  <div className={`about-description-en ${langMode === 'EN' ? 'active' : ''}`}>
                      <div dangerouslySetInnerHTML={{ __html: `Unsangdong, an architect group, is a "cooperative group" rooted in conceptual architecture. It explores the possibilities of architecture in multifaceted ways, integrating art and design, and generating cultural and public value. The group, composed of 50 experts, works across architectural design, urban planning, public projects, and more, engaging in both practical and experimental efforts.
                        <br/><br/>
                        For over 23 years, Unsangdong has led innovative architectural practices with a deep commitment to the public and social good. Their work is grounded in the theory of the "compound body," where each element coexists without losing its essence—rather than being mixed or subordinated, they maintain their nature and form new relationships. This concept is expressed through "mythical imagination," a tool for envisioning new urban and architectural possibilities.
                        <br/><br/>
                        Through Gallery Jungmiso and the online platform Space Coordinator, the group introduces the work of young architects and artists, encouraging collaboration and exchange. They actively participate in exhibitions, competitions, lectures, and forums that address current urban and cultural issues, contributing to the ongoing evolution of Korean architectural culture.` }}></div>
                   </div>
              </div>
                             <div className="organization">
                   <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/organization.png" />
        </div>
        <div className="organization-mo">
                   <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/organization-mo.png" />
               </div>
           </div>
           
           {/* CEO 모달 */}
           {selectedCeo && (
               <div className="modal-overlay" onClick={closeModal}>
                   <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                       <button className="modal-close" onClick={closeModal}><img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/close.png" /></button>
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