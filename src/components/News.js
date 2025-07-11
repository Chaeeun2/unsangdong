import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import './News.css';

const News = ({ onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // Firebase에서 뉴스 데이터 가져오기
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 모든 뉴스 가져오기
        const q = query(
          collection(db, 'news'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const newsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Firestore Timestamp를 JavaScript Date로 변환
          created_at: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
        }));
        
        setNewsData(newsArray);
      } catch (err) {
        console.error('뉴스 데이터 로딩 실패:', err);
        setError('뉴스를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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

  if (loading) {
    return (
      <div className="news-container">
        <h1 className="news-page-title">NEWS</h1>
        <div className="news-board">
          <div className="loading-message">뉴스를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-container">
        <h1 className="news-page-title">NEWS</h1>
        <div className="news-board">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

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