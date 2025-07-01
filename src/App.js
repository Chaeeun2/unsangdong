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

function App() {
  // URL 기반 초기 페이지 설정
  const getInitialPageFromURL = () => {
    const path = window.location.pathname;
    console.log('Getting initial page from URL:', path);
    
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
      console.log('=== POPSTATE EVENT ===');
      console.log('event.state:', event.state);
      console.log('current location:', window.location.pathname);
      console.log('current page before change:', currentPage);
      console.log('current projectId before change:', selectedProjectId);
      
      if (event.state) {
        console.log('Setting page to:', event.state.page);
        console.log('Setting projectId to:', event.state.projectId);
        setCurrentPage(event.state.page);
        setSelectedProjectId(event.state.projectId || null);
      } else {
        console.log('No state found, going to main');
        // 초기 상태로 돌아감
        setCurrentPage('main');
        setSelectedProjectId(null);
      }
      console.log('=== END POPSTATE ===');
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPage, selectedProjectId]);

  // 초기 로드 시 현재 페이지의 히스토리 상태 설정
  useEffect(() => {
    console.log('=== INITIAL LOAD CHECK ===');
    console.log('window.history.state:', window.history.state);
    console.log('currentPage:', currentPage);
    console.log('selectedProjectId:', selectedProjectId);
    console.log('window.location.pathname:', window.location.pathname);
    
    if (!window.history.state) {
      console.log('No history state, setting initial state');
      const initialState = selectedProjectId 
        ? { page: currentPage, projectId: selectedProjectId }
        : { page: currentPage };
      window.history.replaceState(initialState, '', window.location.pathname);
      console.log('Set initial state:', initialState);
    }
    console.log('=== END INITIAL LOAD ===');
  }, []); // 빈 의존성 배열로 변경하여 한 번만 실행

  // 히스토리 정리 함수 추가
  const cleanupHistory = () => {
    console.log('=== CLEANUP HISTORY ===');
    console.log('Current history length:', window.history.length);
    
    // 현재 상태 백업
    const currentState = {
      page: currentPage,
      projectId: selectedProjectId
    };
    
    // 현재 URL 백업
    const currentUrl = window.location.pathname;
    
    console.log('Backing up current state:', currentState, 'URL:', currentUrl);
    
    // 히스토리를 현재 상태로 교체
    window.history.replaceState(currentState, '', currentUrl);
    
    console.log('After cleanup - history length:', window.history.length);
    console.log('=== END CLEANUP HISTORY ===');
  };

  const handleNavigate = (page, projectId = null, query = null) => {
    console.log('=== HANDLE NAVIGATE ===');
    console.log('handleNavigate called with page:', page, 'projectId:', projectId);
    console.log('current page before change:', currentPage);
    console.log('current projectId before change:', selectedProjectId);
    console.log('history.length before:', window.history.length);
    
    // 같은 페이지로의 중복 네비게이션 방지 (검색 페이지는 제외)
    if (page === currentPage && projectId === selectedProjectId && page !== 'search') {
      console.log('Same page and projectId, skipping navigation');
      console.log('=== END HANDLE NAVIGATE (SKIPPED) ===');
      return;
    }
    
    setCurrentPage(page);
    
    if (page === 'search') {
      console.log('App: Setting searchQuery to:', query);
      setSearchQuery(query);
    }
    setSelectedProjectId(projectId);
    
    // URL 업데이트 및 히스토리 상태 설정
    if (page === 'project-detail' && projectId) {
      const newState = { page, projectId };
      const newUrl = `/project/${projectId}`;
      console.log('Pushing project detail state:', newState, 'URL:', newUrl);
      
      // 현재 상태가 이미 같은 프로젝트 상세 페이지인 경우 replace 사용
      const currentState = window.history.state;
      if (currentState && currentState.page === 'project-detail' && currentState.projectId === projectId) {
        console.log('Replacing current project detail state instead of pushing');
        window.history.replaceState(newState, '', newUrl);
      } else {
        window.history.pushState(newState, '', newUrl);
      }
    } else if (page === 'news-detail' && projectId) {
      const newState = { page, projectId };
      const newUrl = `/news/${projectId}`;
      console.log('Pushing news detail state:', newState, 'URL:', newUrl);
      
      // 현재 상태가 이미 같은 뉴스 상세 페이지인 경우 replace 사용
      const currentState = window.history.state;
      if (currentState && currentState.page === 'news-detail' && currentState.projectId === projectId) {
        console.log('Replacing current news detail state instead of pushing');
        window.history.replaceState(newState, '', newUrl);
      } else {
        window.history.pushState(newState, '', newUrl);
      }
    } else {
      const url = page === 'main' ? '/' : `/${page}`;
      const newState = { page };
      console.log('Pushing page state:', newState, 'URL:', url);
      window.history.pushState(newState, '', url);
    }
    
    console.log('After state change - history.state:', window.history.state);
    console.log('history.length after:', window.history.length);
    
    // 페이지 이동 시 최상단으로 스크롤
    window.scrollTo(0, 0);
    
    console.log('=== END HANDLE NAVIGATE ===');
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

  return (
    <Router>
      <div className="App">
        <Header 
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        {renderPage()}
      </div>
    </Router>
  );
}

export default App; 