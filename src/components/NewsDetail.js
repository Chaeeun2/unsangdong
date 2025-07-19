import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from '@firebase/firestore';
import './NewsDetail.css';

const NewsDetail = ({ newsId, onNavigate }) => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        const docRef = doc(db, 'news', newsId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const newsData = docSnap.data();
          
          // 기존 구조에 맞게 데이터 변환
          const formattedNews = {
            id: docSnap.id,
            title: newsData.title,
            content: newsData.content,
            created_at: newsData.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
            image_urls: newsData.images || [],
            files: newsData.files || []
          };
          
          setNews(formattedNews);
        } else {
          setNews(null);
        }
      } catch (error) {
        console.error('뉴스 불러오기 실패:', error);
        setNews(null);
      } finally {
        setLoading(false);
      }
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
        <h1 className="news-page-title">NEWS</h1>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="news-container">
        <h1 className="news-page-title">NEWS</h1>
        <div className="news-not-found">뉴스를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="news-container">
      <h1 className="news-page-title">NEWS</h1>
      <div className="news-detail-board">
        <h2>{news.title}</h2>
        
        <div className="news-detail-meta">
          <p>{formatDate(news.created_at)}</p>
        </div>

        {/* 이미지 배열이 있으면 본문 위에 모두 렌더링 */}
        {Array.isArray(news.image_urls) && news.image_urls.length > 0 && (
          <div style={{ marginBottom:30 }}>
            {news.image_urls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`뉴스 이미지 ${idx + 1}`}
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