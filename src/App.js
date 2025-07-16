import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import About from './components/About';
import Awards from './components/Awards';
import Contact from './components/Contact';
import Architecture from './components/Architecture';
import ProjectDetail from './components/ProjectDetail';
import Art from './components/Art';
import Design from './components/Design';
import News from './components/News';
import NewsDetail from './components/NewsDetail';
import Book from './components/Book';
import Press from './components/Press';
import SearchResults from './components/SearchResults';
import AdminApp from './admin/Admin';

function App() {
  // URL 기반 초기 페이지 설정
  const getInitialPageFromURL = () => {
    const path = window.location.pathname;
    
    if (path === '/' || path === '') {
      return { page: 'main', projectId: null };
    } else if (path.startsWith('/project/')) {
      const projectId = parseInt(path.split('/')[2]);
      return { page: 'project-detail', projectId };
    } else if (path.startsWith('/news/')) {
      const newsId = parseInt(path.split('/')[2]);
      return { page: 'news-detail', projectId: newsId };
    } else if (path.startsWith('/')) {
      const page = path.substring(1);
      return { page, projectId: null };
    }
    return { page: 'main', projectId: null };
  };

  const initialState = getInitialPageFromURL();
  const [currentPage, setCurrentPage] = useState(initialState.page);
  const [selectedProjectId, setSelectedProjectId] = useState(initialState.projectId);
  const [searchQuery, setSearchQuery] = useState('');


  // 브라우저 뒤로가기/앞으로가기 처리
  useEffect(() => {
    const handlePopState = (event) => {
      
      if (event.state) {
        const newPage = event.state.page;
        setCurrentPage(newPage);
        setSelectedProjectId(event.state.projectId || null);
        
        // 브라우저 뒤로가기/앞으로가기 시 스크롤을 최상단으로 이동
        window.scrollTo(0, 0);
      } else {
        // 초기 상태로 돌아감
        setCurrentPage('main');
        setSelectedProjectId(null);
        
        // 초기 상태로 돌아갈 때도 스크롤을 최상단으로 이동
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPage, selectedProjectId]);

  // 초기 로드 시 현재 페이지의 히스토리 상태 설정
  useEffect(() => {
    
    if (!window.history.state) {
      const initialState = selectedProjectId 
        ? { page: currentPage, projectId: selectedProjectId }
        : { page: currentPage };
      window.history.replaceState(initialState, '', window.location.pathname);
    }
  }, []); // 빈 의존성 배열로 변경하여 한 번만 실행



  // 히스토리 정리 함수 추가
  const cleanupHistory = () => {

    // 현재 상태 백업
    const currentState = {
      page: currentPage,
      projectId: selectedProjectId
    };
    
    // 현재 URL 백업
    const currentUrl = window.location.pathname;
    
    // 히스토리를 현재 상태로 교체
    window.history.replaceState(currentState, '', currentUrl);
    
  };

  const handleNavigate = (page, projectId = null, query = null) => {
    
    // 같은 페이지로의 중복 네비게이션 방지 (검색 페이지는 제외)
    if (page === currentPage && projectId === selectedProjectId && page !== 'search') {
      return;
    }
    
    setCurrentPage(page);
    
    if (page === 'search') {
      setSearchQuery(query);
    }
    setSelectedProjectId(projectId);
    
    // URL 업데이트 및 히스토리 상태 설정
    if (page === 'project-detail' && projectId) {
      const newState = { page, projectId };
      const newUrl = `/project/${projectId}`;
      
      // 현재 상태가 이미 같은 프로젝트 상세 페이지인 경우 replace 사용
      const currentState = window.history.state;
      if (currentState && currentState.page === 'project-detail' && currentState.projectId === projectId) {
        window.history.replaceState(newState, '', newUrl);
      } else {
        window.history.pushState(newState, '', newUrl);
      }
    } else if (page === 'news-detail' && projectId) {
      const newState = { page, projectId };
      const newUrl = `/news/${projectId}`;
      
      // 현재 상태가 이미 같은 뉴스 상세 페이지인 경우 replace 사용
      const currentState = window.history.state;
      if (currentState && currentState.page === 'news-detail' && currentState.projectId === projectId) {
        window.history.replaceState(newState, '', newUrl);
      } else {
        window.history.pushState(newState, '', newUrl);
      }
    } else {
      const url = page === 'main' ? '/' : `/${page}`;
      const newState = { page };
      window.history.pushState(newState, '', url);
    }
    
    // 모든 페이지 접근 시 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);
    
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'about':
        return <About />;
      case 'awards':
        return <Awards />;
      case 'contact':
        return <Contact />;
      case 'architecture':
        return <Architecture onNavigate={handleNavigate} />;
      case 'project-detail':
        return <ProjectDetail projectId={selectedProjectId} onNavigate={handleNavigate} />;
      case 'art':
        return <Art onNavigate={handleNavigate} />;
      case 'design':
        return <Design onNavigate={handleNavigate} />;
      case 'news':
        return <News onNavigate={handleNavigate} />;
      case 'news-detail':
        return <NewsDetail newsId={selectedProjectId} onNavigate={handleNavigate} />;
      case 'book':
        return <Book />;
      case 'press':
        return <Press />;
      case 'search':
        return <SearchResults key={searchQuery} searchQuery={searchQuery} onNavigate={handleNavigate} />;
      case 'main':
      default:
        return <Main />;
    }
  };

  // Admin 경로인지 확인
  const isAdminPath = window.location.pathname.startsWith('/admin');

  return (
    <Router>
      <div className="App">
        {/* Admin 경로가 아닐 때만 헤더 표시 */}
        {!isAdminPath && (
          <Header 
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />
        )}
        {/* Admin 경로일 때는 AdminApp, 아니면 일반 페이지 */}
        {isAdminPath ? <AdminApp /> : renderPage()}
      </div>
    </Router>
  );
}

export default App; 