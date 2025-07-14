import React, { useState, useEffect } from 'react';
import { bookService } from '../services/dataService';
import './Book.css';

const Book = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const booksData = await bookService.getBooks();
      
      // 데이터 구조 변환 (어드민 형태 → 홈페이지 형태)
      const transformedBooks = booksData.map(book => ({
        id: book.id,
        title: book.title,
        image: book.thumbnailImage,
        link: book.externalLink,
        size: transformSizeToEnglish(book.size)
      }));
      
      setBooks(transformedBooks);
    } catch (err) {
      console.error('Books 로딩 실패:', err);
      setError('Books를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 한국어 크기를 영어로 변환 (기존 CSS 클래스와 호환성 유지)
  const transformSizeToEnglish = (koreanSize) => {
    switch (koreanSize) {
      case '작게': return 'small';
      case '중간': return 'medium';
      case '크게': return 'large';
      default: return 'medium';
    }
  };

  const handleBookClick = (link) => {
    if (link && link.trim() !== '') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  // 책을 3개씩 묶어서 row로 구성 (데스크톱용)
  const createRows = (books, itemsPerRow = 4) => {
    const rows = [];
    for (let i = 0; i < books.length; i += itemsPerRow) {
      rows.push(books.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  // 모바일용 2개씩 묶어서 row로 구성
  const createMobileRows = (books, itemsPerRow = 2) => {
    const rows = [];
    for (let i = 0; i < books.length; i += itemsPerRow) {
      rows.push(books.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  const bookRows = createRows(books);
  const mobileBookRows = createMobileRows(books);

  // 데스크톱용 그리드 렌더링
  const renderDesktopGrid = () => (
    <div className="book-grid">
      {bookRows.map((row, rowIndex) => (
        <div key={rowIndex} className="book-row">
          <div className="book-images">
            {row.map((book) => (
              <div 
                key={book.id} 
                className={`book-item book-item-${book.size}`}
              >
                <div className="book-image-wrapper">
                  {book.link && book.link.trim() !== '' ? (
                    <a href={book.link} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={book.image} 
                        alt={book.title}
                        className="book-image"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvb2sgSW1hZ2U8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </a>
                  ) : (
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="book-image"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvb2sgSW1hZ2U8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="book-infos">
            {row.map((book) => (
              <div key={`info-${book.id}`} className="book-info">
                <h3 className="book-title">{book.title}</h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // 모바일용 그리드 렌더링 (PC와 동일한 구조, 2열로만)
  const renderMobileGrid = () => (
    <div className="book-grid">
      {mobileBookRows.map((row, rowIndex) => (
        <div key={rowIndex} className="book-row">
          <div className="book-images">
            {row.map((book) => (
              <div 
                key={book.id} 
                className={`book-item book-item-${book.size}`}
              >
                <div className="book-image-wrapper">
                  {book.link && book.link.trim() !== '' ? (
                    <a href={book.link} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={book.image} 
                        alt={book.title}
                        className="book-image"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvb2sgSW1hZ2U8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </a>
                  ) : (
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="book-image"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvb2sgSW1hZ2U8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="book-infos">
            {row.map((book) => (
              <div key={`info-${book.id}`} className="book-info">
                <h3 className="book-title">{book.title}</h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <div className="book-container">
        <div className="book-loading">
          <p>Books를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className="book-container">
        <div className="book-error">
          <p>{error}</p>
          <button onClick={loadBooks}>다시 시도</button>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (books.length === 0) {
    return (
      <div className="book-container">
        <div className="book-empty">
          <p>등록된 책이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-container">
      {isMobile ? renderMobileGrid() : renderDesktopGrid()}
    </div>
  );
};

export default Book; 