import React, { useState } from 'react';
import './News.css';

const News = ({ onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 샘플 뉴스 데이터
  const newsData = [
    {
      id: 1,
      title: "2023 운생동건축사사무소 신입사원 공개채용",
      created_at: "2024-01-20"
    },
    {
      id: 2,
      title: "국립디자인박물관 국제설계 공모 당선작 발표",
      created_at: "2024-01-18"
    },
    {
      id: 3,
      title: "종로구 통합청사 설계공모(리모델링 및 증축) 당선작 발표",
      created_at: "2024-01-16"
      },
    {
      id: 4,
      title: "2023 운생동건축사사무소 신입사원 공개채용",
      created_at: "2024-01-20"
    },
    {
      id: 5,
      title: "국립디자인박물관 국제설계 공모 당선작 발표",
      created_at: "2024-01-18"
    },
    {
      id: 6,
      title: "종로구 통합청사 설계공모(리모델링 및 증축) 당선작 발표",
      created_at: "2024-01-16"
      },
    {
      id: 7,
      title: "2023 운생동건축사사무소 신입사원 공개채용",
      created_at: "2024-01-20"
    },
    {
      id: 8,
      title: "국립디자인박물관 국제설계 공모 당선작 발표",
      created_at: "2024-01-18"
    },
    {
      id: 9,
      title: "종로구 통합청사 설계공모(리모델링 및 증축) 당선작 발표",
      created_at: "2024-01-16"
      },
    {
      id: 10,
      title: "2023 운생동건축사사무소 신입사원 공개채용",
      created_at: "2024-01-20"
    },
    {
      id: 11,
      title: "국립디자인박물관 국제설계 공모 당선작 발표",
      created_at: "2024-01-18"
    },
    {
      id: 12,
      title: "종로구 통합청사 설계공모(리모델링 및 증축) 당선작 발표",
      created_at: "2024-01-16"
    }
  ];

  const totalCount = newsData.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const pageGroupSize = 5;
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); // 년도 뒤 2자리
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 2자리
    const day = String(date.getDate()).padStart(2, '0'); // 일 2자리
    return `${year}/${month}/${day}`;
  };

  const formatDateMo = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 2자리
    const day = String(date.getDate()).padStart(2, '0'); // 일 2자리
    return `${month}/${day}`;
  };


  const handleNewsClick = (news) => {
    console.log('뉴스 클릭:', news.title);
    onNavigate('news-detail', news.id);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        {totalPages > pageGroupSize && currentGroup > 0 && (
          <button 
            onClick={() => handlePageChange(startPage - 1)}
          >
            ←
          </button>
        )}
        {Array.from(
          { length: endPage - startPage + 1 }, 
          (_, i) => startPage + i
        ).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
        {totalPages > pageGroupSize && endPage < totalPages && (
          <button 
            onClick={() => handlePageChange(endPage + 1)}
          >
            →
          </button>
        )}
      </div>
    );
  };

  const renderNewsRow = (news) => (
    <tr 
      key={news.id} 
      onClick={() => handleNewsClick(news)} 
      style={{ cursor: 'pointer' }}
    >
            <td className="news-title">
        {news.title}
      </td>
      <td className="news-date">{formatDate(news.created_at)}</td>
      <td className="news-date-mo">{formatDateMo(news.created_at)}</td>
    </tr>
  );

  // 현재 페이지에 해당하는 뉴스 가져오기
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = newsData.slice(startIndex, endIndex);

  return (
    <div className="news-container">
      <h1 className="news-page-title">NEWS</h1>
      <div className="news-board">
        <table className="news-table">
          <tbody>
            {currentNews.length > 0 ? (
              currentNews.map(news => renderNewsRow(news))
            ) : (
              <tr>
                <td colSpan="2" className="no-data">등록된 뉴스가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        {renderPagination()}
      </div>
    </div>
  );
};

export default News; 