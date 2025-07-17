import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Art.css';
import { contentService, projectTypeService } from '../services/dataService';

function Art({ onNavigate }) {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState('gallery');
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firebase에서 프로젝트 데이터 로드
  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const [projectsData, typesData, yearsData] = await Promise.all([
          contentService.getContents('Art'),
          projectTypeService.getProjectTypes(),
          projectTypeService.getYearsByCategory('Art')
        ]);
        
        setProjects(projectsData);
        setTypeOptions(typesData.Art || []);
        setYears(yearsData);
      } catch (error) {
        console.error('프로젝트 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const yearMatch = selectedYear === '' || project.year === selectedYear;
    const typeMatch = selectedType === '' || project.type === selectedType;
    return yearMatch && typeMatch;
  });

  const navigate = useNavigate();

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

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setIsTypeDropdownOpen(false);
  };

  const toggleTypeDropdown = () => {
    setIsTypeDropdownOpen(!isTypeDropdownOpen);
    setIsYearDropdownOpen(false);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false);
  };

  const toggleYearDropdown = () => {
    setIsYearDropdownOpen(!isYearDropdownOpen);
    setIsTypeDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="art-container">
      </div>
    );
  }

  return (
    <div className="art-container">
      <div className="controls-bar">
        <div className="filters">
          {/* Year 필터 (드롭다운) */}
          <div className="filter-group">
            <div className="custom-select" onClick={toggleYearDropdown}>
              <div className="select-header">
                <span className="select-value">
                  {selectedYear || 'Year'}
                </span>
                <span className={`select-arrow ${isYearDropdownOpen ? 'open' : ''}`}>▼</span>
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
          {/* Type 필터 (드롭다운) */}
          <div className="filter-group">
            <div className="custom-select" onClick={toggleTypeDropdown}>
              <div className="select-header">
                <span className="select-value">
                  {selectedType || 'Type'}
                </span>
                <span className={`select-arrow ${isTypeDropdownOpen ? 'open' : ''}`}>▼</span>
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
                  {typeOptions.map(type => (
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
      </div>

        <div className="art-projects-grid">
          {filteredProjects.length === 0 ? (
            <div className="no-projects">조건에 해당하는 프로젝트가 없습니다.</div>
          ) : (
            filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="project-item"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="art-project-image-wrapper">
                  <img 
                    src={project.thumbnailImage || project.mainImage} 
                    alt={project.title}
                    className="art-project-image"
                    onClick={() => handleProjectClick(project.id)}
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
    </div>
  );
}

export default Art; 