import React, { useState, useEffect } from 'react';
import './SearchResults.css';

function SearchResults({ searchQuery, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 모든 프로젝트 데이터 (Architecture, Art, Design)
  const allProjects = [
    // Architecture 프로젝트 (100-199)
    {
      id: 101,
      title: "오동숲속도서관",
      titleEn: "Odong Public Library",
      year: "2024",
      location: "서울 성북구 Seoul Seongbuk-gu",
      type: "HOUSE",
      client: "Client name",
      director: "Yoongyoo Jang, Changhoon Shin",
      status: "Completed",
      category: "Architecture",
      image: "./images/Architecture/arch-1.jpg"
    },
    {
      id: 102,
      title: "이상봉 타워",
      titleEn: "Lie Sang Bong Tower",
      year: "2023",
      location: "서울 성북구 Seoul Seongbuk-gu",
      type: "Cultural",
      client: "Client name",
      director: "Yoongyoo Jang, Changhoon Shin",
      status: "Completed",
      category: "Architecture",
      image: "./images/Architecture/arch-2.jpg"
    },
    {
      id: 103,
      title: "헤이리, 코스미코",
      titleEn: "Heyri COSMICO",
      year: "2022",
      location: "서울 성북구 Seoul Seongbuk-gu",
      type: "Museum",
      client: "Client name",
      director: "Yoongyoo Jang, Changhoon Shin",
      status: "Completed",
      category: "Architecture",
      image: "./images/Architecture/arch-3.jpg"
    },
    {
      id: 104,
      title: "오동숲속도서관",
      titleEn: "Odong Public Library",
      year: "2024",
      location: "서울 성북구 Seoul Seongbuk-gu",
      type: "House",
      client: "Client name",
      director: "Yoongyoo Jang, Changhoon Shin",
      status: "Completed",
      category: "Architecture",
      image: "./images/Architecture/arch-1.jpg"
    },
    {
      id: 105,
      title: "이상봉 타워",
      titleEn: "Lie Sang Bong Tower",
      year: "2023",
      location: "서울 성북구 Seoul Seongbuk-gu",
      type: "Cultural",
      client: "Client name",
      director: "Yoongyoo Jang, Changhoon Shin",
      status: "Completed",
      category: "Architecture",
      image: "./images/Architecture/arch-2.jpg"
    },
    {
      id: 106,
      title: "헤이리, 코스미코",
      titleEn: "Heyri COSMICO",
      year: "2022",
      location: "서울 성북구 Seoul Seongbuk-gu",
      type: "Museum",
      client: "Client name",
      director: "Yoongyoo Jang, Changhoon Shin",
      status: "Completed",
      category: "Architecture",
      image: "./images/Architecture/arch-3.jpg"
    },
    // Art 프로젝트 (200-299)
    {
      id: 201,
      title: "인간산수",
      titleEn: "Human, Space, Mountain, Water",
      year: "2024",
      location: "서울 성북구 Seoul Seongbuk-gu",
      type: "HOUSE",
      client: "Client name",
      director: "Yoongyoo Jang, Changhoon Shin",
      status: "Completed",
      category: "Art",
      image: "./images/Art/art-1.jpg"
    },
    {
      id: 202,
      title: "인간산수",
      titleEn: "Human, Space, Mountain, Water",
      year: "2024",
      location: "서울 성북구 Seoul Seongbuk-gu",
      type: "HOUSE",
      client: "Client name",
      director: "Yoongyoo Jang, Changhoon Shin",
      status: "Completed",
      category: "Art",
      image: "./images/Art/art-2.jpg"
    },
    {
      id: 203,
      title: "인간산수",
      titleEn: "Human, Space, Mountain, Water",
      year: "2024",
      location: "서울 성북구 Seoul Seongbuk-gu",
      type: "EXHIBITION",
      client: "Client name",
      director: "Yoongyoo Jang, Changhoon Shin",
      status: "Completed",
      category: "Art",
      image: "./images/Art/art-3.jpg"
    }
  ];

  // 검색 필터링 함수
  const filterProjects = (query) => {
    if (!query || query.trim() === '') {
      return [];
    }

    const searchTermLower = query.toLowerCase().trim();
    
    return allProjects.filter(project => {
      return (
        project.title.toLowerCase().includes(searchTermLower) ||
        project.titleEn.toLowerCase().includes(searchTermLower) ||
        project.type.toLowerCase().includes(searchTermLower) ||
        project.category.toLowerCase().includes(searchTermLower) ||
        project.year.includes(searchTermLower) ||
        project.location.toLowerCase().includes(searchTermLower) ||
        project.client.toLowerCase().includes(searchTermLower) ||
        project.director.toLowerCase().includes(searchTermLower) ||
        project.status.toLowerCase().includes(searchTermLower)
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
    console.log('SearchResults: searchQuery changed to:', searchQuery);
    const newSearchTerm = searchQuery || '';
    setSearchTerm(newSearchTerm);
    const newFilteredProjects = filterProjects(newSearchTerm);
    console.log('SearchResults: filtered projects count:', newFilteredProjects.length);
    setFilteredProjects(newFilteredProjects);
  }, [searchQuery]);

  const handleProjectClick = (projectId) => {
    onNavigate('project-detail', projectId);
  };

  const handleProjectHover = (project) => {
    setHoveredProject(project);
  };

  const handleProjectLeave = () => {
    setHoveredProject(null);
  };



  return (
    <div className="search-results-container">
        <h1 className="search-page-title">SEARCH<br/>RESULTS</h1>

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
                  <div className="list-project-title">
                    {project.title}
                  </div>
                  <div className="list-project-title-en">
                    {project.titleEn}
                  </div>
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
            top: mousePosition.y - 100,
          }}
        >
          <img 
            src={hoveredProject.image} 
            alt={hoveredProject.title}
            className="hover-thumbnail-image"
          />
        </div>
      )}
    </div>
  );
}

export default SearchResults;
