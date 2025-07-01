import React, { useState } from 'react';
import './Book.css';

const Book = () => {
  // 책 데이터 (이미지의 책들을 참고)
  const books = [
    {
      id: 1,
      title: "건축 재료의 새로운 사고",
      image: "/images/book/book1.jpg", // 실제 이미지 경로로 변경 필요
      link: "https://www.amazon.com/Unsangdong-Architects-Jang-Yoon-Chang/dp/8996513695",
      size: "large"
    },
    {
      id: 2,
      title: "체인지업그라운드 포항 CHANGeUP GROUND",
      image: "/images/book/book2.jpg", // 실제 이미지 경로로 변경 필요
      link: "https://www.amazon.com/Unsangdong-Architects-Jang-Yoon-Chang/dp/8996513695",
      size: "small"
    },
    {
      id: 3,
      title: "Compound Body",
      image: "/images/book/book3.jpg", // 실제 이미지 경로로 변경 필요
      link: "https://www.amazon.com/Unsangdong-Architects-Jang-Yoon-Chang/dp/8996513695",
      size: "medium"
    },
    {
      id: 4,
      title: "Compound Body",
      image: "/images/book/book3.jpg", // 실제 이미지 경로로 변경 필요
      link: "https://www.amazon.com/Unsangdong-Architects-Jang-Yoon-Chang/dp/8996513695",
      size: "medium"
    },
    {
      id: 5,
      title: "건축 재료의 새로운 사고",
      image: "/images/book/book1.jpg", // 실제 이미지 경로로 변경 필요
      link: "https://www.amazon.com/Unsangdong-Architects-Jang-Yoon-Chang/dp/8996513695",
      size: "large"
    },
    {
      id: 6,
      title: "체인지업그라운드 포항 CHANGeUP GROUND",
      image: "/images/book/book2.jpg", // 실제 이미지 경로로 변경 필요
      link: "https://www.amazon.com/Unsangdong-Architects-Jang-Yoon-Chang/dp/8996513695",
      size: "small"
    }
  ];

  const handleBookClick = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  // 책을 3개씩 묶어서 row로 구성
  const createRows = (books, itemsPerRow = 3) => {
    const rows = [];
    for (let i = 0; i < books.length; i += itemsPerRow) {
      rows.push(books.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  const bookRows = createRows(books);

  return (
    <div className="book-container">
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
    </div>
  );
};

export default Book; 