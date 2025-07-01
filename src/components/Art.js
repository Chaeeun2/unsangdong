import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Art.css';

function Art({ onNavigate }) {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState('gallery');
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const projects = [
    {
      id: 201,
      title: "Art Project A",
      titleEn: "Art Project A",
      year: "2022",
      type: "ARTWORK",
      image: "./images/Art/art-1.jpg"
    },
    {
      id: 202,
      title: "Art Project B",
      titleEn: "Art Project B",
      year: "2023",
      type: "ARTWORK",
      image: "./images/Art/art-2.jpg"
    },
    {
      id: 203,
      title: "인간산수",
      titleEn: "Human, Space, Mountain, Water",
      year: "2024",
      type: "EXHIBITION",
      image: "./images/Art/art-3.jpg"
    },
  ];

  const filteredProjects = projects.filter(project => {
    const yearMatch = selectedYear === '' || project.year === selectedYear;
    const typeMatch = selectedType === '' || project.type === selectedType;
    return yearMatch && typeMatch;
  });

  const years = [...new Set(projects.map(project => project.year))].sort((a, b) => b - a);
  const types = [...new Set(projects.map(project => project.type))].sort();

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
    console.log('=== ART PROJECT CLICK ===');
    console.log('Clicked project ID:', projectId);
    console.log('About to call onNavigate with project-detail and projectId:', projectId);
    onNavigate('project-detail', projectId);
    console.log('=== END ART PROJECT CLICK ===');
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
  };

  return (
    <div className="art-container">
      <div className="controls-bar">
        <div className="art-type-options">
          <button 
            className={`art-type-btn all ${selectedType === '' ? 'active' : ''}`}
            onClick={() => handleTypeFilter('')}
          >
            ALL
          </button>
          <span className="art-type-separator">/</span>
          <button 
            className={`art-type-btn exhibition ${selectedType === 'EXHIBITION' ? 'active' : ''}`}
            onClick={() => handleTypeFilter('EXHIBITION')}
          >
            EXHIBITION
          </button>
          <span className="art-type-separator">/</span>
          <button 
            className={`art-type-btn artwork ${selectedType === 'ARTWORK' ? 'active' : ''}`}
            onClick={() => handleTypeFilter('ARTWORK')}
          >
            ARTWORK
          </button>
        </div>
      </div>

        <div className="art-projects-grid">
          {filteredProjects.length === 0 ? (
            <div className="no-projects">프로젝트가 없습니다.</div>
          ) : (
            filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="project-item"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="art-project-image-wrapper">
                  <img 
                    src={project.image} 
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