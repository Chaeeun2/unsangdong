import React, { useState, useEffect } from 'react';
import './SearchResults.css';
import { contentService } from '../services/dataService';

function SearchResults({ searchQuery, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firebase에서 모든 프로젝트 데이터 로드
  useEffect(() => {
    async function loadAllProjects() {
      try {
        setLoading(true);
        const [archProjects, artProjects, designProjects] = await Promise.all([
          contentService.getContents('Architecture'),
          contentService.getContents('Art'),
          contentService.getContents('Design')
        ]);
        
        // 모든 프로젝트를 하나의 배열로 합치기
        const allProjectsData = [
          ...(archProjects || []),
          ...(artProjects || []),
          ...(designProjects || [])
        ];
        
        setAllProjects(allProjectsData);
      } catch (error) {
        console.error('프로젝트 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAllProjects();
  }, []);

  // 검색 필터링 함수
  const filterProjects = (query) => {
    if (!query || query.trim() === '') {
      return [];
    }

    const searchTermLower = query.toLowerCase().trim();
    
    return allProjects.filter(project => {
      return (
        project.title?.toLowerCase().includes(searchTermLower) ||
        project.titleEn?.toLowerCase().includes(searchTermLower) ||
        project.type?.toLowerCase().includes(searchTermLower) ||
        project.category?.toLowerCase().includes(searchTermLower) ||
        project.year?.toString().includes(searchTermLower) ||
        project.location?.toLowerCase().includes(searchTermLower) ||
        project.client?.toLowerCase().includes(searchTermLower) ||
        project.director?.toLowerCase().includes(searchTermLower) ||
        project.status?.toLowerCase().includes(searchTermLower)
      );
    });
  };

  const [filteredProjects, setFilteredProjects] = useState([]);

  // 마우스 위치 추적
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (hoveredProject) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoveredProject]);

  // 컴포넌트 마운트 시와 searchQuery가 변경될 때마다 필터링 업데이트
  useEffect(() => {
    const newSearchTerm = searchQuery || '';
    setSearchTerm(newSearchTerm);
    const newFilteredProjects = filterProjects(newSearchTerm);
    setFilteredProjects(newFilteredProjects);
  }, [searchQuery, allProjects]);

  const handleProjectClick = (projectId) => {
    onNavigate('project-detail', projectId);
  };

  const handleProjectHover = (project) => {
    setHoveredProject(project);
  };

  const handleProjectLeave = () => {
    setHoveredProject(null);
  };

  if (loading) {
    return (
      <div className="search-results-container">
        <div className="loading-message">검색 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <h1 className="search-page-title">SEARCH<br />RESULTS</h1>
      <h1 className="search-page-title-mo">SEARCH RESULTS</h1>

      {/* 검색 결과 */}
      <div className="search-results-content">
        {/* 검색 결과 정보 */}
        <div className="search-info">
          {searchTerm && (
            <p className="search-query">
              '{searchTerm}'이(가) 포함된 프로젝트 {filteredProjects.length}건
            </p>
          )}
        </div>
        <div className="search-line"></div>

        {!searchTerm || searchTerm.trim() === '' ? (
          <div className="no-search-term">
            <p>검색어를 입력해주세요.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="no-results">
            <p>"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="search-projects-list">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="list-item"
                onClick={() => handleProjectClick(project.id)}
                onMouseEnter={() => handleProjectHover(project)}
                onMouseLeave={handleProjectLeave}
                data-year={project.year}
                data-type={project.type}
              >
                <div className="list-col-title">
                  <div className="list-project-title">{project.title}<span className="list-project-title-en">{project.titleEn}</span></div>
                </div>
                <div className="list-col-year">{project.year}</div>
                <div className="list-col-type">{project.type}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 호버 썸네일 */}
      {hoveredProject && (
        <div 
          className="hover-thumbnail"
          style={{
            left: mousePosition.x + 20,
            top: mousePosition.y +20,
          }}
        >
          <img 
            src={hoveredProject.thumbnailImage || hoveredProject.mainImage} 
            alt={hoveredProject.title}
            className="hover-thumbnail-image"
          />
        </div>
      )}
    </div>
  );
}

export default SearchResults;
