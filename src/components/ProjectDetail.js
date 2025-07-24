import React, { useState, useEffect, useRef, useCallback } from "react";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import "./ProjectDetail.css";
import { contentService } from '../services/dataService';
import { imageOptimizationService } from '../services/imageOptimizationService';

function ProjectDetail({ projectId, onNavigate }) {
  const glideRef = useRef(null);
  const glideInstanceRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [langMode, setLangMode] = useState("KO");
  const [imageAspectRatios, setImageAspectRatios] = useState({});
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase에서 프로젝트 데이터 로드
  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        const projectData = await contentService.getContent(projectId);
        // 이미지 최적화 적용
        const optimizedProject = imageOptimizationService.optimizeProject(projectData);
        setProject(optimizedProject);
      } catch (error) {
        console.error('프로젝트 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const handleLangModeChange = (mode) => {
    setLangMode(mode);
  };

  // 모달 관련 함수들
  const openImgModal = (imageIndex) => {
    let imageSrc = '';
    
    if (project?.media) {
      const media = project.media[imageIndex];
      if (media && media.type === 'image') {
        imageSrc = media.src;
      }
    } else if (project?.images) {
      imageSrc = project.images[imageIndex] || '';
    }
    
    setModalImageIndex(imageIndex);
    setModalImageSrc(imageSrc);
    setIsModalOpen(true);
  };

  const closeImgModal = () => {
    setIsModalOpen(false);
    setModalImageSrc("");
  };

  // 모달이 열릴 때 body 스크롤 비활성화
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // 페이지 첫 로드 시에만 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 이미지 비율을 미리 계산하는 함수
  const preloadImageAspectRatios = useCallback(() => {
    if (!project) return;

    const images = [];
    
    if (project.media) {
      project.media.forEach((media, index) => {
        if (media.type === 'image') {
          images.push({ src: media.src, index });
        }
      });
    } else if (project.images) {
      project.images.forEach((imageSrc, index) => {
        images.push({ src: imageSrc, index });
      });
    }

    const ratios = {};
    let loadedCount = 0;

    images.forEach(({ src, index }) => {
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const aspectRatio = width / height;
        
        let orientation;
        if (aspectRatio > 1) {
          orientation = 'landscape';
        } else if (aspectRatio < 1) {
          orientation = 'portrait';
        } else {
          orientation = 'square';
        }

        ratios[index] = orientation;
        loadedCount++;

        if (loadedCount === images.length) {
          setImageAspectRatios(ratios);
        }
      };
      img.src = src;
    });
  }, [project]);

  // 이미지 클래스 가져오기 함수
  const getImageClass = (index, baseClass) => {
    const orientation = imageAspectRatios[index];
    return orientation ? `${baseClass} ${orientation}` : baseClass;
  };

  // 프로젝트 로드시 이미지 비율 미리 계산
  useEffect(() => {
    if (project) {
      preloadImageAspectRatios();
    }
  }, [project, preloadImageAspectRatios]);

  // Glide.js 초기화
  useEffect(() => {
    const totalSlides = project?.media
      ? project.media.length
      : (project?.images?.length || 0) + (project?.videos?.length || 0);
    
    if (glideRef.current && project && totalSlides > 1 && !glideInstanceRef.current) {
      const glide = new Glide(glideRef.current, {
        type: "carousel",
        startAt: 0,
        perView: 1,
        gap: 0,
        keyboard: true,
        animationDuration: 1200,
        animationTimingFunc: "ease",
        dragThreshold: 120,
        touchRatio: 0.5,
      });

      glide.on('run.after', () => {
        const currentIndex = glide.index;
      });

      glide.mount();
      glideInstanceRef.current = glide;
    }

    return () => {
      if (glideInstanceRef.current) {
        glideInstanceRef.current.destroy();
        glideInstanceRef.current = null;
      }
    };
  }, [project?.id]);

  // 조건부 렌더링
  if (loading) {
    return (
      <div className="project-detail-container">
        <div className="loading-message">프로젝트를 불러오는 중...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-container">
        <div className="project-not-found">
          <h2>프로젝트를 찾을 수 없습니다</h2>
          <button onClick={() => window.history.back()}>
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      {/* 프로젝트 헤더 */}
      <div className="project-header">
        <div className="project-header-info">
          <h1 className="project-detail-title">{project.title}</h1>
          <h2 className="project-detail-title-en">{project.titleEn}</h2>
        </div>
      </div>

      {/* 메인 이미지 갤러리 */}
      <div className="project-gallery">
        {(() => {
          // media 배열이 있으면 우선 사용
          const totalSlides = project.media
            ? project.media.length
            : (project.images?.length || 0) + (project.videos?.length || 0);

          if (totalSlides === 1) {
            // 단일 미디어인 경우
            if (project.media) {
              const media = project.media[0];
              return (
                <div className="single-image-container">
                  {media.type === "image" ? (
                    <img
                      src={media.optimizedSrc || media.src}
                      alt={project.title}
                      className={getImageClass(0, "single-image")}
                      data-slide-index="0"
                      onClick={() => openImgModal(0)}
                      style={{ cursor: "pointer" }}
                      onError={(e) => {
                        // 최적화된 이미지 로드 실패시 원본으로 fallback
                        if (e.target.src !== media.src) {
                          e.target.src = media.src;
                        }
                      }}
                    />
                  ) : (
                    (() => {
                      const video = media.src;
                      let embedUrl = video;
                      if (video.includes("youtube.com/watch?v=")) {
                        const videoId = video.split("v=")[1].split("&")[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                      } else if (video.includes("youtu.be/")) {
                        const videoId = video
                          .split("youtu.be/")[1]
                          .split("?")[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                      }

                      return (
                        <iframe
                          src={embedUrl}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ width: "100%", height: "100%" }}
                        ></iframe>
                      );
                    })()
                  )}
                </div>
              );
            } else {
              // 기존 방식 (하위 호환성)
              return (
                <div className="single-image-container">
                  {project.images?.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className={getImageClass(0, "single-image")}
                      data-slide-index="0"
                      onClick={() => openImgModal(0)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    (() => {
                      const video = project.videos[0];
                      let embedUrl = video;
                      if (video.includes("youtube.com/watch?v=")) {
                        const videoId = video.split("v=")[1].split("&")[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                      } else if (video.includes("youtu.be/")) {
                        const videoId = video
                          .split("youtu.be/")[1]
                          .split("?")[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                      }

                      return (
                        <iframe
                          src={embedUrl}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ width: "100%", height: "100%" }}
                        ></iframe>
                      );
                    })()
                  )}
                </div>
              );
            }
          } else {
            // 다중 미디어인 경우 (슬라이더)
            return (
              <div className="glide" ref={glideRef}>
                <div className="glide__track" data-glide-el="track">
                  <ul className="glide__slides">
                    {project.optimizedMedia ? (
                      // optimizedMedia 배열 사용
                      project.optimizedMedia.map((media, index) => (
                        <li key={`media-${index}`} className="glide__slide">
                          {media.type === "image" ? (
                            <img
                              src={media.optimizedSrc || media.src}
                              alt={`${project.title} - ${index + 1}`}
                              className={getImageClass(index, "slide-image")}
                              data-slide-index={index}
                              onClick={() => openImgModal(index)}
                              style={{ cursor: "pointer" }}
                              onError={(e) => {
                                // 최적화된 이미지 로드 실패시 원본으로 fallback
                                if (e.target.src !== media.src) {
                                  e.target.src = media.src;
                                }
                              }}
                            />
                          ) : (
                              (() => {
                                const video = media.src;
                                let embedUrl = video;
                                if (video.includes("youtube.com/watch?v=")) {
                                  const videoId = video
                                    .split("v=")[1]
                                    .split("&")[0];
                                  embedUrl = `https://www.youtube.com/embed/${videoId}`;
                                } else if (video.includes("youtu.be/")) {
                                  const videoId = video
                                    .split("youtu.be/")[1]
                                    .split("?")[0];
                                  embedUrl = `https://www.youtube.com/embed/${videoId}`;
                                }

                                return (
                                  <iframe
                                    src={embedUrl}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ width: "100%", height: "100%" }}
                                  ></iframe>
                                );
                              })()
                            )}
                          </li>
                        ))
                    ) : (
                      // 기존 방식 (하위 호환성)
                      <>
                        {project.images?.map((image, index) => (
                          <li key={`image-${index}`} className="glide__slide">
                            <img
                              src={image}
                              alt={`${project.title} - ${index + 1}`}
                              className={getImageClass(index, "slide-image")}
                              data-slide-index={index}
                              onClick={() => openImgModal(index)}
                              style={{ cursor: "pointer" }}
                            />
                          </li>
                        ))}
                        {project.videos?.map((video, index) => {
                          // 유튜브 URL을 embed URL로 변환
                          let embedUrl = video;
                          if (video.includes("youtube.com/watch?v=")) {
                            const videoId = video.split("v=")[1].split("&")[0];
                            embedUrl = `https://www.youtube.com/embed/${videoId}`;
                          } else if (video.includes("youtu.be/")) {
                            const videoId = video
                              .split("youtu.be/")[1]
                              .split("?")[0];
                            embedUrl = `https://www.youtube.com/embed/${videoId}`;
                          }

                          return (
                            <li key={`video-${index}`} className="glide__slide">
                              <iframe
                                src={embedUrl}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ width: "100%", height: "100%" }}
                              ></iframe>
                            </li>
                          );
                        })}
                      </>
                    )}
                  </ul>
                </div>

                {/* 네비게이션 화살표 */}
                <div className="glide__arrows" data-glide-el="controls">
                  <button
                    className="glide__arrow glide__arrow--left"
                    data-glide-dir="<"
                  >
                    ←
                  </button>
                  <button
                    className="glide__arrow glide__arrow--right"
                    data-glide-dir=">"
                  >
                    →
                  </button>
                </div>

                {/* 불릿 인디케이터 */}
                <div className="glide__bullets" data-glide-el="controls[nav]">
                  {project.media
                    ? project.media.map((_, index) => (
                        <button
                          key={index}
                          className="glide__bullet"
                          data-glide-dir={`=${index}`}
                        />
                      ))
                    : [
                        ...(project.images || []),
                        ...(project.videos || []),
                      ].map((_, index) => (
                        <button
                          key={index}
                          className="glide__bullet"
                          data-glide-dir={`=${index}`}
                        />
                      ))}
                </div>
              </div>
            );
          }
        })()}
      </div>

      {/* 프로젝트 정보 */}
      <div className="project-content">
        <div className="project-description">
          <div className="lang-options">
            <button
              className={`lang-btn ${langMode === "KO" ? "active" : ""}`}
              onClick={() => handleLangModeChange("KO")}
            >
              KO
            </button>
            <span className="lang-separator">/</span>
            <button
              className={`lang-btn ${langMode === "EN" ? "active" : ""}`}
              onClick={() => handleLangModeChange("EN")}
            >
              EN
            </button>
          </div>
          <div
            className={`project-description-ko ${
              langMode === "KO" ? "active" : ""
            }`}
          >
            {project.description}
          </div>
          <div
            className={`project-description-en ${
              langMode === "EN" ? "active" : ""
            }`}
          >
            {project.descriptionEn}
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-line"></div>
          <div className="detail-grid">
            <div className="detail-grid-left">
              <div className="detail-row">
                <span className="detail-label">YEAR</span>
                <span className="detail-value">{project.year}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">TYPE</span>
                <span className="detail-value">{project.type}</span>
              </div>
              {project.location && project.location.trim() !== '' && (
                <div className="detail-row">
                  <span className="detail-label">LOCATION</span>
                  <span className="detail-value">{project.location}</span>
                </div>
              )}
            </div>
            <div className="detail-grid-right">
              {project.client && project.client.trim() !== '' && (
                <div className="detail-row">
                  <span className="detail-label">CLIENT</span>
                  <span className="detail-value">{project.client}</span>
                </div>
              )}
              {project.director && project.director.trim() !== '' && (
                <div className="detail-row">
                  <span className="detail-label">DIRECTOR</span>
                  <span className="detail-value">{project.director}</span>
                </div>
              )}
              {project.status && project.status.trim() !== '' && (
                <div className="detail-row">
                  <span className="detail-label">STATUS</span>
                  <span className="detail-value">{project.status}</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 이미지 모달 */}
      {isModalOpen && modalImageSrc && (
        <div className="image-modal" onClick={closeImgModal}>
          <img
            src={modalImageSrc}
            alt={`${project.title} - ${modalImageIndex + 1}`}
            className="image-modal-image"
          />
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;
