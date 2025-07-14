import React, { useState, useEffect } from 'react';
import { pressService } from '../services/dataService';
import './Press.css';

const Press = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pressData, setPressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  // 컴포넌트 마운트 시 Press 데이터 로드
  useEffect(() => {
    const loadPressData = async () => {
      try {
        setLoading(true);
        const data = await pressService.getPress();
        setPressData(data);
      } catch (error) {
        console.error('Press 데이터 로딩 실패:', error);
        setPressData([]);
      } finally {
        setLoading(false);
      }
    };

    loadPressData();
  }, []);

  const totalCount = pressData.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const pageGroupSize = 5;
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const formatYear = (year) => {
    return year ? year.toString() : '';
  };

  const truncateTitle = (title, maxLength = 40) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const handlePressClick = (press) => {
    if (press.url) {
      window.open(press.url, '_blank', 'noopener,noreferrer');
    }
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

  const renderPressRow = (press) => (
    <tr 
      key={press.id} 
      onClick={() => handlePressClick(press)} 
      style={{ cursor: press.url ? 'pointer' : 'default' }}
    >
      <td className="press-year">{formatYear(press.year)}</td>
      <td className="press-title">
        {truncateTitle(press.title)}
      </td>
      <td className="press-newspaper">{press.media}</td>
    </tr>
  );

  // 현재 페이지에 해당하는 프레스 가져오기
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPress = pressData.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="press-container">
        <h1 className="press-page-title">PRESS</h1>
        <div className="press-board">
          <div className="loading-message"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="press-container">
      <h1 className="press-page-title">PRESS</h1>
      <div className="press-board">
        <table className="press-table">
          <tbody>
            {currentPress.length > 0 ? (
              currentPress.map(press => renderPressRow(press))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">등록된 프레스가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        {renderPagination()}
      </div>
    </div>
  );
};

export default Press; 