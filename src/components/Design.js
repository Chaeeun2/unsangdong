import React, { useState, useEffect } from 'react';
import './Design.css';

function Design({ onNavigate }) {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState('gallery');
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const projects = [
    {
      id: 301,
      title: "Design Project A",
      titleEn: "Design Project A",
      year: "2024",
      type: "Interior",
      image: "./images/Architecture/arch-1.jpg"
    },
    {
      id: 302,
      title: "Design Project B",
      titleEn: "Design Project B",
      year: "2023",
      type: "Furniture",
      image: "./images/Architecture/arch-2.jpg"
    },
    {
      id: 303,
      title: "Design Project C",
      titleEn: "Design Project C",
      year: "2022",
      type: "Graphic",
      image: "./images/Architecture/arch-3.jpg"
    },
  ];

  const filteredProjects = projects.filter(project => {
    const yearMatch = selectedYear === '' || project.year === selectedYear;
    const typeMatch = selectedType === '' || project.type === selectedType;
    return yearMatch && typeMatch;
  });

  const years = [...new Set(projects.map(project => project.year))].sort((a, b) => b - a);
  const types = [...new Set(projects.map(project => project.type))].sort();

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

  return (
    <div className="design-container">
      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <div className="no-projects">No projects found.</div>
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
    </div>
  );
}

export default Design; 