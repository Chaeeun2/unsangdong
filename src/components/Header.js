import React, { useState, useEffect } from 'react';
import './Header.css';

function Header({ currentPage, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    closeSearch();
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchTerm(''); // 검색창 열 때 검색어 초기화
    }
    closeMenu();
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  // 전체 닫기 (검색창 + 메뉴)
  const closeAll = () => {
    closeSearch();
    closeMenu();
  };

  // 메뉴 항목 클릭 핸들러
  const handleMenuClick = (e, page) => {
    e.preventDefault(); // 기본 링크 동작 방지
    onNavigate(page);
    closeMenu();
  };

  // 검색 실행
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('검색어:', searchTerm);
      // 검색 결과 페이지로 이동
      onNavigate('search', null, searchTerm);
      closeSearch();
    }
  };

  // 로고 클릭 핸들러
  const handleLogoClick = () => {
    closeAll(); // 메뉴와 검색창 닫기
    onNavigate('main');
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <img 
            className="logo" 
            src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/logo.png" 
            alt="로고" 
            onClick={handleLogoClick}
            style={{
              cursor: 'pointer',
              opacity: currentPage === 'main' ? 0 : 1
            }}
          />
          <div className="search-menu">
            {/* 검색 오버레이 */}
            <div className={`search-container ${isSearchOpen ? 'open' : ''}`}>
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search for project information"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  autoFocus
                />
              </form>
            </div>
            <button className="search-btn" onClick={toggleSearch}>
              <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/search.png" alt="검색" />
            </button>
            <button className="menu-btn" onClick={toggleMenu}>
              <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/hamburger.png" alt="메뉴" />
            </button>
          </div>
        </div>

        <div className="header-content-mo">
          <button className="search-btn" onClick={toggleSearch}>
              <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/search.png" alt="검색" />
            </button>
          <img 
            className="logo" 
            src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/logo.png" 
            alt="로고" 
            onClick={handleLogoClick}
            style={{
              cursor: 'pointer',
              opacity: currentPage === 'main' ? 0 : 1
            }}
          />

            <button className="menu-btn" onClick={toggleMenu}>
              <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/hamburger.png" alt="메뉴" />
            </button>
        </div>
      </header>

              <div className={`search-menu-mo ${isSearchOpen ? 'open' : ''}`}>
            {/* 검색 오버레이 */}
            <div className="search-container">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search for project information"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  autoFocus
            />
          </form>
          <button className="search-btn" onClick={toggleSearch}>
              <img src="https://pub-1331f8c46b8d4b71aa752849b530c45e.r2.dev/search-black.png" alt="검색" />
            </button>
          </div>
          </div>

      {/* 전체 오버레이 - 검색창이나 메뉴가 열려있을 때 화면 전체 덮음 */}
      {(isSearchOpen || isMenuOpen) && (
        <div className="global-overlay" onClick={closeAll}></div>
      )}

      {/* 슬라이드 메뉴 */}
      <nav className={`slide-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-content">
          <div className="menu-section">
            <h3 className="menu-title">ABOUT</h3>
            <ul className="menu-list">
              <li>
                <a 
                  href="about" 
                  className={currentPage === 'about' ? 'current' : ''}
                  onClick={(e) => handleMenuClick(e, 'about')}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="awards" 
                  className={currentPage === 'awards' ? 'current' : ''}
                  onClick={(e) => handleMenuClick(e, 'awards')}
                >
                  Awards
                </a>
              </li>
              <li>
                <a 
                  href="contact" 
                  className={currentPage === 'contact' ? 'current' : ''}
                  onClick={(e) => handleMenuClick(e, 'contact')}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div className="menu-section">
            <h3 className="menu-title">PROJECTS</h3>
            <ul className="menu-list">
              <li>
                <a 
                  href="architecture" 
                  className={currentPage === 'architecture' ? 'current' : ''}
                  onClick={(e) => handleMenuClick(e, 'architecture')}
                >
                  Architecture
                </a>
              </li>
              <li>
                <a 
                  href="art" 
                  className={currentPage === 'art' ? 'current' : ''}
                  onClick={(e) => handleMenuClick(e, 'art')}
                >
                  Art
                </a>
              </li>
              <li>
                <a 
                  href="design" 
                  className={currentPage === 'design' ? 'current' : ''}
                  onClick={(e) => handleMenuClick(e, 'design')}
                >
                  Design
                </a>
              </li>
            </ul>
          </div>
          
          <div className="menu-section">
                <a 
                  href="news" 
                  className={currentPage === 'news' ? 'current' : ''}
                  onClick={(e) => handleMenuClick(e, 'news')}
                >
                 <h3 className="menu-title">NEWS</h3>
                </a>
          </div>

<div className="menu-section">
            <h3 className="menu-title">PUBLICATION</h3>
            <ul className="menu-list">
              <li>
                <a 
                  href="book" 
                  className={currentPage === 'book' ? 'current' : ''}
                  onClick={(e) => handleMenuClick(e, 'book')}
                >
                  Book
                </a>
              </li>
              <li>
                <a 
                  href="press" 
                  className={currentPage === 'press' ? 'current' : ''}
                  onClick={(e) => handleMenuClick(e, 'press')}
                >
                  Press
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header; 