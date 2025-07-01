import React, { useState, useEffect } from 'react';
import './Architecture.css';

function Architecture({ onNavigate }) {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState('gallery');
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const projects = [
    {
      id: 101,
      title: "오동숲속도서관",
      titleEn: "Odong Public Library",
      year: "2024",
      type: "House",
      image: "./images/Architecture/arch-1.jpg"
    },
    {
      id: 102,
      title: "이상봉 타워",
      titleEn: "Lie Sang Bong Tower",
      year: "2023",
      type: "Cultural",
      image: "./images/Architecture/arch-2.jpg"
    },
    {
      id: 103,
      title: "헤이리, 코스미코",
      titleEn: "Heyri COSMICO",
      year: "2022",
      type: "Museum",
      image: "./images/Architecture/arch-3.jpg"
    },
    {
      id: 104,
      title: "오동숲속도서관",
      titleEn: "Odong Public Library",
      year: "2024",
      type: "House",
      image: "./images/Architecture/arch-1.jpg"
    },
    {
      id: 105,
      title: "이상봉 타워",
      titleEn: "Lie Sang Bong Tower",
      year: "2023",
      type: "Cultural",
      image: "./images/Architecture/arch-2.jpg"
    },
    {
      id: 106,
      title: "헤이리, 코스미코",
      titleEn: "Heyri COSMICO",
      year: "2022",
      type: "Museum",
      image: "./images/Architecture/arch-3.jpg"
    }
    
  ];

  // 필터링된 프로젝트 목록
  const filteredProjects = projects.filter(project => {
    const yearMatch = selectedYear === '' || project.year === selectedYear;
    const typeMatch = selectedType === '' || project.type === selectedType;
    return yearMatch && typeMatch;
  });

  // 유니크한 년도와 타입 추출
  const years = [...new Set(projects.map(project => project.year))].sort((a, b) => b - a);
  const types = [...new Set(projects.map(project => project.type))].sort();

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

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-select')) {
        setIsYearDropdownOpen(false);
        setIsTypeDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleProjectClick = (projectId) => {
    onNavigate('project-detail', projectId);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setIsTypeDropdownOpen(false);
  };

  const toggleYearDropdown = () => {
    setIsYearDropdownOpen(!isYearDropdownOpen);
    setIsTypeDropdownOpen(false);
  };

  const toggleTypeDropdown = () => {
    setIsTypeDropdownOpen(!isTypeDropdownOpen);
    setIsYearDropdownOpen(false);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleProjectHover = (project) => {
    setHoveredProject(project);
  };

  const handleProjectLeave = () => {
    setHoveredProject(null);
  };

  return (
    <div className="architecture-container">
      {/* 필터와 뷰 옵션 */}
      <div className="controls-bar">
        <div className="filters">
          {/* Year 필터 */}
          <div className="filter-group">
            <div className="custom-select" onClick={toggleYearDropdown}>
              <div className="select-header">
                <span className="select-value">
                  {selectedYear || 'Year'}
                </span>
                <span className={`select-arrow ${isYearDropdownOpen ? 'open' : ''}`}>
                  ▼
                </span>
              </div>
              {isYearDropdownOpen && (
                <div className="select-dropdown">
                  <div 
                    className="select-option"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleYearChange('');
                    }}
                  >
                    Year
                  </div>
                  {years.map(year => (
                    <div 
                      key={year}
                      className={`select-option ${selectedYear === year ? 'selected-option' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleYearChange(year);
                      }}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Type 필터 */}
          <div className="filter-group">
            <div className="custom-select" onClick={toggleTypeDropdown}>
              <div className="select-header">
                <span className="select-value">
                  {selectedType || 'Type'}
                </span>
                <span className={`select-arrow ${isTypeDropdownOpen ? 'open' : ''}`}>
                  ▼
                </span>
              </div>
              {isTypeDropdownOpen && (
                <div className="select-dropdown">
                  <div 
                    className="select-option"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTypeChange('');
                    }}
                  >
                    Type
                  </div>
                  {types.map(type => (
                    <div 
                      key={type}
                      className={`select-option ${selectedType === type ? 'selected-option' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTypeChange(type);
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="view-options">
          <button 
            className={`view-btn ${viewMode === 'gallery' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('gallery')}
          >
            GALLERY
          </button>
          <span className="view-separator">/</span>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('list')}
          >
            LIST
          </button>
        </div>
      </div>

      {/* Gallery 뷰 */}
      {viewMode === 'gallery' && (
        <div className="projects-grid">
          {filteredProjects.length === 0 ? (
            <div className="no-projects" style={{padding: '4rem'}}>프로젝트가 없습니다.</div>
          ) : (
            filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="project-item"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="project-image-wrapper">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="project-image"
                  />
                  <div className="project-overlay">
                    <div className="project-info">
                      <div className="project-title-wrap">
                        <h3 className="project-title">{project.title}</h3>
                        <h2 className="project-title-en">{project.titleEn}</h2>
                      </div>
                      <div className="project-meta">
                        <span className="project-year">{project.year}</span>
                        <span className="project-type">{project.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* List 뷰 */}
      {viewMode === 'list' && (
        <div className="projects-list">
          {filteredProjects.length === 0 ? (
            <div className="no-projects" style={{ padding: '0rem' }}>프로젝트가 없습니다.</div>
          ) : (
            filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="list-item"
                onClick={() => handleProjectClick(project.id)}
                onMouseEnter={() => handleProjectHover(project)}
                onMouseLeave={handleProjectLeave}
              >
                <div className="list-col-title">
                  <div className="list-project-title">
                    {project.title}
                  <span className="list-project-title-en">
                    {project.titleEn}
                    </span>
                    </div>
                </div>
                <div className="list-col-year">{project.year}</div>
                <div className="list-col-type">{project.type}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 호버 썸네일 */}
      {hoveredProject && viewMode === 'list' && (
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

export default Architecture; 