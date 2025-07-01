import React, { useState } from 'react';
import './Press.css';

const Press = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 샘플 프레스 데이터
  const pressData = [
    {
      id: 1,
      title: `미술 전시 연 건축가 장윤규 "사람이 만들어가는 풍경 그렸죠", '인간산수' 장윤규 개인전`,
      created_at: "2024-01-20",
      link: "https://www.joongang.co.kr/article/25251334#home",
      newspaper: "중앙일보"
    },
    {
      id: 2,
      title: `투명한 'ㅅ' 빌리지, 삼송1957`,
      created_at: "2024-01-18",
      link: "https://www.c3ka.com/samsong-bakery-by-unsangdong-architects/",
      newspaper: "C3"
      },
    {
      id: 3,
      title: `미술 전시 연 건축가 장윤규 "사람이 만들어가는 풍경 그렸죠", '인간산수' 장윤규 개인전`,
      created_at: "2023-01-20",
      link: "https://www.joongang.co.kr/article/25251334#home",
      newspaper: "중앙일보"
    },
    {
      id: 4,
      title: `투명한 'ㅅ' 빌리지, 삼송1957`,
      created_at: "2023-01-18",
      link: "https://www.c3ka.com/samsong-bakery-by-unsangdong-architects/",
      newspaper: "C3"
      },
    {
      id: 5,
      title: `미술 전시 연 건축가 장윤규 "사람이 만들어가는 풍경 그렸죠", '인간산수' 장윤규 개인전`,
      created_at: "2022-01-20",
      link: "https://www.joongang.co.kr/article/25251334#home",
      newspaper: "중앙일보"
    },
    {
      id: 6,
      title: `투명한 'ㅅ' 빌리지, 삼송1957`,
      created_at: "2022-01-18",
      link: "https://www.c3ka.com/samsong-bakery-by-unsangdong-architects/",
      newspaper: "C3"
    }
  ];

  const totalCount = pressData.length;
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

  const formatYear = (dateString) => {
    const date = new Date(dateString);
    return date.getFullYear().toString(); // 4자리 연도
  };

  const truncateTitle = (title, maxLength = 40) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const handlePressClick = (press) => {
    console.log('프레스 클릭:', press.title);
    window.open(press.link, '_blank', 'noopener,noreferrer');
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
      style={{ cursor: 'pointer' }}
    >
      <td className="press-year">{formatYear(press.created_at)}</td>
      <td className="press-title">
        {truncateTitle(press.title)}
      </td>
      <td className="press-newspaper">{press.newspaper}</td>
    </tr>
  );

  // 현재 페이지에 해당하는 프레스 가져오기
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPress = pressData.slice(startIndex, endIndex);

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