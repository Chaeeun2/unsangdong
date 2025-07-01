import React, { useState, useEffect } from 'react';
import './NewsDetail.css';

const NewsDetail = ({ newsId, onNavigate }) => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  // 샘플 뉴스 데이터 (실제로는 API에서 가져올 데이터)
  const newsData = [
    {
      id: 1,
      title: "2023 운생동건축사사무소 신입사원 공개채용",
      created_at: "2024-01-20",
      content: `
        <p>1.구인내용</p>
        <p>• 회사명 : 운생동건축사사무소</p>
        <p>• 구인분야 : 건축설계</p>
        <p>• 모집구분 : 신입</p>
        <p>• 지원자격 : – 건축디자인 관련 전공 졸업자 및 2023년 건축대학 졸업예정자</p>
        <p>• 해외여행에 결격 사유가 없는 자</p>
        <p>• 회사주소 : 서울 성북구 창경궁로 43길 41 (성북동1가)</p>
        <p>• 홈페이지 : http://www.usdspace.com</p>
        <p>• 성별 : 무관</p>
        <p>• 모집인원 : 0명</p>
        <br/>
        <p>2. 전형방법</p>
        <p>• 1차전형 : 서류 및 포트폴리오 심사 (이메일 접수)</p>
        <p>• 2차전형 : INTERVIEW (개별면접)</p>
        <br/>
        <p>3. 전형일정</p>
        <p>• 접수일자 : 2022년 09월 01(목)~ 2022년 09월 08일(목) 18:00 이전 도착분에 한함</p>
        <p>• 1차 면접대상발표 : 2022년 09월 중 면접 대상자에게 전화 개별 통보</p>
        <p>• 2차 INTERVIEW (개별면접) : 면접일시는 대상자에게 개별 통보</p>
        <p>• 입사지원 메일 : usdspace@hanmail.net</p>
        <br/>
        <p>4. 제출서류</p>
        <p>• 이력서 (서식자유)</p>
        <p>• 졸업증명서 또는 졸업예정증명서</p>
        <p>• 공모전 수상 증빙자료 및 자격증 사본 (해당자에 한함)</p>
        <p>• 포트폴리오</p>
        <p>※ 표지포함 A4 10장 이내 PDF 파일 제출 (*본인 작업 내용 명기)</p>
        <p>• 그 외 자기소개를 충분히 표현할 수 있는 자료 (면접 시 지참)</p>
        <p>• 이메일 제목에 반드시 신입지원 표기할 것 (이메일 제목 예시 : [신입사원지원] 홍길동)</p>
        <p>• 포트폴리오 제외 나머지 파일은 PDF형식으로 묶어서 하나의 파일로 제출</p>
        <br/>
        <p>5. 기타사항</p>
        <p>• 이력서 내 이동전화번호 및 이메일 주소 표기</p>
        <p>• 합격자발표 및 전형 일정은 회사사정에 따라 변경될 수 있습니다.</p>
        <p>• 제출 서류의 내용이 허위일 경우 합격이 취소될 수 있습니다.</p>
      `,
      image_urls: [],
      files: [
        {
          name: "예시입니다",
          url: "#"
        }
      ]
      },
      {
      id: 2,
      title: "국립디자인박물관 국제설계 공모 당선작 발표",
      created_at: "2024-01-20",
      content: `
        <p>이미지 삽입 예시입니다.</p>
      `,
      image_urls: ["https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/main-logo.png"],
    },
      {
      id: 3,
      title: "종로구 통합청사 설계공모(리모델링 및 증축) 당선작 발표",
      created_at: "2024-01-20",
      content: `
        <p>예시 게시글입니다.</p>
      `,
      image_urls: [],
      },
          {
      id: 4,
      title: "2023 운생동건축사사무소 신입사원 공개채용",
      created_at: "2024-01-20",
      content: `
        <p>예시 게시글입니다.</p>
      `,
      image_urls: [],
      },
      {
      id: 5,
      title: "국립디자인박물관 국제설계 공모 당선작 발표",
      created_at: "2024-01-20",
      content: `
        <p>예시 게시글입니다.</p>
      `,
      image_urls: [],
    },
      {
      id: 6,
      title: "종로구 통합청사 설계공모(리모델링 및 증축) 당선작 발표",
      created_at: "2024-01-20",
      content: `
        <p>예시 게시글입니다.</p>
      `,
      image_urls: [],
      },
          {
      id: 7,
      title: "2023 운생동건축사사무소 신입사원 공개채용",
      created_at: "2024-01-20",
      content: `
        <p>예시 게시글입니다.</p>
      `,
      image_urls: [],
      },
      {
      id: 8,
      title: "국립디자인박물관 국제설계 공모 당선작 발표",
      created_at: "2024-01-20",
      content: `
        <p>예시 게시글입니다.</p>
      `,
      image_urls: [],
    },
      {
      id: 9,
      title: "종로구 통합청사 설계공모(리모델링 및 증축) 당선작 발표",
      created_at: "2024-01-20",
      content: `
        <p>예시 게시글입니다.</p>
      `,
      image_urls: [],
      },
          {
      id: 10,
      title: "2023 운생동건축사사무소 신입사원 공개채용",
      created_at: "2024-01-20",
      content: `
        <p>예시 게시글입니다.</p>
      `,
      image_urls: [],
      },
      {
      id: 11,
      title: "국립디자인박물관 국제설계 공모 당선작 발표",
      created_at: "2024-01-20",
      content: `
        <p>예시 게시글입니다.</p>
      `,
      image_urls: [],
    },
      {
      id: 12,
      title: "종로구 통합청사 설계공모(리모델링 및 증축) 당선작 발표",
      created_at: "2024-01-20",
      content: `
        <p>예시 게시글입니다.</p>
      `,
      image_urls: [],
      }
  ];

  useEffect(() => {
    const fetchNews = () => {
      setLoading(true);
      // 실제로는 API 호출
      const foundNews = newsData.find(item => item.id === parseInt(newsId));
      setNews(foundNews);
      setLoading(false);
    };

    if (newsId) {
      fetchNews();
    }
  }, [newsId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); // 년도 뒤 2자리
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 2자리
    const day = String(date.getDate()).padStart(2, '0'); // 일 2자리
    return `${year}/${month}/${day}`;
  };

  const handleFileDownload = async (fileUrl, fileName) => {
    try {
      // 실제 구현에서는 실제 파일 URL을 사용
      if (fileUrl === "#") {
        alert(`${fileName} 파일 다운로드 기능입니다. (실제 파일 URL이 필요합니다)`);
        return;
      }
      
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  const handleBack = () => {
    onNavigate('news');
  };

  if (loading) {
    return (
      <div className="news-container">
        <h1 className="newsdetail-page-title">NEWS</h1>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="news-container">
        <h1 className="newsdetail-page-title">NEWS</h1>
        <div className="news-not-found">뉴스를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="news-container">
      <h1 className="newsdetail-page-title">NEWS</h1>
      <div className="news-detail-board">
        <h2>{news.title}</h2>
        
        <div className="news-detail-meta">
          <p>{formatDate(news.created_at)}</p>
        </div>

        {/* 이미지 배열이 있으면 본문 위에 모두 렌더링 */}
        {Array.isArray(news.image_urls) && news.image_urls.length > 0 && (
          <div style={{ marginBottom: 50 }}>
            {news.image_urls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`뉴스 이미지 ${idx + 1}`}
                style={{ maxWidth: '100%', marginBottom: 20, display: 'block' }}
              />
            ))}
          </div>
        )}

        <div className="news-content" dangerouslySetInnerHTML={{ __html: news.content }} />

        {news.files && news.files.length > 0 && (
          <div className="news-files">
            <h3>첨부파일</h3>
            <ul>
              {news.files.map((file, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleFileDownload(file.url, file.name)}
                    className="file-download-button"
                  >
                    {file.name} {file.size && `(${file.size})`}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default NewsDetail; 