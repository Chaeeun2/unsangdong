import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { addProject, getProjects, deleteProject, updateProjectImages, updateProject } from '../../services/projectService';
import { getCategories } from '../../services/categoryService';
import { getPresignedUrl } from '../../services/r2Service';
import { convertToEmbedUrl, isValidVideoUrl, detectVideoPlatform } from '../../utils/videoUtils';
import './ProjectManagement.css';
import { writeBatch, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState({
    title: '',
    detail: '',
    description: '',
    thumbnailUrl: '',
    mainImageUrl: '',
    detailMedia: [], // 이미지와 동영상을 함께 관리
    categories: []
  });
  const [newProject, setNewProject] = useState({
    title: '',
    detail: '',
    description: '',
    thumbnailUrl: '',
    mainImageUrl: '',
    detailMedia: [], // 이미지와 동영상을 함께 관리
    categories: []
  });

  // 이미지 파일 상태 (기존)
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [detailImageFiles, setDetailImageFiles] = useState([]);

  // 수정용 이미지 파일 상태
  const [editThumbnailFile, setEditThumbnailFile] = useState(null);
  const [editMainImageFile, setEditMainImageFile] = useState(null);
  const [editDetailImageFiles, setEditDetailImageFiles] = useState([]);

  // 이미지 미리보기 상태 (기존)
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [detailImagePreviews, setDetailImagePreviews] = useState([]);

  // 수정용 이미지 미리보기 상태
  const [editThumbnailPreview, setEditThumbnailPreview] = useState('');
  const [editMainImagePreview, setEditMainImagePreview] = useState('');
  const [editDetailImagePreviews, setEditDetailImagePreviews] = useState([]);

  // 동영상 URL 상태 추가
  const [videoUrl, setVideoUrl] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');

  // YouTube 비디오 ID 추출 함수
  const extractYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Vimeo 비디오 ID 추출 함수
  const extractVimeoVideoId = (url) => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data || []);
    } catch (error) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      setCategories([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryToggle = (category, isNewProject = true) => {
    if (isNewProject) {
      setNewProject(prev => {
        const isSelected = prev.categories.some(cat => cat.id === category.id);
        return {
          ...prev,
          categories: isSelected
            ? prev.categories.filter(cat => cat.id !== category.id)
            : [...prev.categories, category]
        };
      });
    } else {
      setEditProject(prev => {
        const isSelected = prev.categories.some(cat => cat.id === category.id);
        return {
          ...prev,
          categories: isSelected
            ? prev.categories.filter(cat => cat.id !== category.id)
            : [...prev.categories, category]
        };
      });
    }
  };

  const handleImagePreview = (e, type) => {
    if (type === 'detail') {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // detailMedia 배열에만 추가
          setNewProject(prev => ({
            ...prev,
            detailMedia: [...prev.detailMedia, {
              type: 'image',
              url: reader.result, // 임시 미리보기 URL
              file: file,
              order: prev.detailMedia.length
            }]
          }));
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        switch (type) {
          case 'thumbnail':
            setThumbnailPreview(reader.result);
            setThumbnailFile(file);
            break;
          case 'main':
            setMainImagePreview(reader.result);
            setMainImageFile(file);
            break;
          default:
            console.warn('Unknown image type:', type);
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetailImageDelete = (index) => {
    setDetailImagePreviews(prev => prev.filter((_, i) => i !== index));
    setDetailImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 동영상 URL 추가 함수
  const handleAddVideo = () => {
    if (!videoUrl.trim()) {
      alert('동영상 URL을 입력해주세요.');
      return;
    }

    if (!isValidVideoUrl(videoUrl)) {
      alert('유효한 유튜브 또는 비메오 URL을 입력해주세요.');
      return;
    }

    const embedUrl = convertToEmbedUrl(videoUrl);
    if (!embedUrl) {
      alert('URL을 변환할 수 없습니다. 올바른 URL인지 확인해주세요.');
      return;
    }

    const videoData = {
      type: 'video',
      url: embedUrl,
      originalUrl: videoUrl,
      platform: detectVideoPlatform(videoUrl),
      order: newProject.detailMedia.length
    };

    setNewProject(prev => ({
      ...prev,
      detailMedia: [...prev.detailMedia, videoData]
    }));

    setVideoUrl('');
  };

  // 수정 모드에서 동영상 URL 추가 함수
  const handleEditAddVideo = () => {
    if (!editVideoUrl.trim()) {
      alert('동영상 URL을 입력해주세요.');
      return;
    }

    let embedUrl = '';
    let platform = '';

    // YouTube URL 처리
    if (editVideoUrl.includes('youtube.com') || editVideoUrl.includes('youtu.be')) {
      const videoId = extractYouTubeVideoId(editVideoUrl);
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        platform = 'YouTube';
      }
    }
    // Vimeo URL 처리
    else if (editVideoUrl.includes('vimeo.com')) {
      const videoId = extractVimeoVideoId(editVideoUrl);
      if (videoId) {
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
        platform = 'Vimeo';
      }
    }

    if (!embedUrl) {
      alert('지원하지 않는 동영상 URL입니다. YouTube 또는 Vimeo URL을 입력해주세요.');
      return;
    }

    const newVideo = {
      type: 'video',
      url: embedUrl,
      platform: platform,
      originalUrl: editVideoUrl
    };

    setEditProject(prev => ({
      ...prev,
      detailMedia: [...(prev.detailMedia || []), newVideo]
    }));

    setEditVideoUrl('');
  };

  // 미디어 아이템 삭제 함수 (이미지와 동영상 모두 지원)
  const handleDetailMediaDelete = (index) => {
    setNewProject(prev => ({
      ...prev,
      detailMedia: prev.detailMedia.filter((_, i) => i !== index)
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceDroppableId = result.source.droppableId;

    // 새 프로젝트 추가 시 상세 미디어 순서 변경
    if (sourceDroppableId === 'new-project-detail-media') {
      const items = Array.from(newProject.detailMedia);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      
      setNewProject(prev => ({
        ...prev,
        detailMedia: items
      }));
      return;
    }

    // 모달에서 편집 중인 경우
    if (showEditModal && editingProjectId) {
      // editProject의 detailMedia 순서 변경
      const items = Array.from(editProject.detailMedia);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      // editProject 상태 업데이트
      setEditProject(prev => ({
        ...prev,
        detailMedia: items
      }));

      // 전체 projects 배열도 업데이트 (UI 일관성을 위해)
      setProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === editingProjectId
            ? { ...p, detailMedia: items }
            : p
        )
      );

      // Firebase 업데이트
      updateProjectImages(editingProjectId, items).catch(error => {
        console.error('드래그 앤 드롭 업데이트 실패:', error);
        // 실패 시 원래 상태로 복구
        fetchProjects();
      });
    } else {
      // 일반 목록에서의 드래그 앤 드롭 (기존 로직)
      const projectId = result.source.droppableId.replace('droppable-', '');
      const project = projects.find(p => p.id === projectId);
      
      if (!project || !project.detailMedia) return;

      const items = Array.from(project.detailMedia);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === projectId
            ? { ...p, detailMedia: items }
            : p
        )
      );

      updateProjectImages(projectId, items).catch(error => {
        console.error('드래그 앤 드롭 업데이트 실패:', error);
        fetchProjects();
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const thumbnailUrl = await getPresignedUrl(thumbnailFile);
      const mainImageUrl = await getPresignedUrl(mainImageFile);
      
      // detailMedia 처리 (이미지와 동영상 모두)
      const detailMediaProcessed = await Promise.all(
        newProject.detailMedia.map(async (media, index) => {
          if (media.type === 'image' && media.file) {
            // 이미지인 경우 업로드
            const url = await getPresignedUrl(media.file);
            return {
              type: 'image',
              url,
              order: index
            };
          } else if (media.type === 'video') {
            // 동영상인 경우 embed URL 그대로 사용
            return {
              type: 'video',
              url: media.url,
              originalUrl: media.originalUrl,
              platform: media.platform,
              order: index
            };
          }
          return media;
        })
      );

      const projectData = {
        title: newProject.title,
        detail: newProject.detail,
        description: newProject.description,
        thumbnailUrl,
        mainImageUrl,
        detailMedia: detailMediaProcessed,
        categories: newProject.categories,
        createdAt: new Date()
      };

      await addProject(projectData);
      
      // 폼 초기화
      setNewProject({
        title: '',
        detail: '',
        description: '',
        thumbnailUrl: '',
        mainImageUrl: '',
        detailMedia: [],
        categories: []
      });
      setThumbnailPreview('');
      setMainImagePreview('');
      setThumbnailFile(null);
      setMainImageFile(null);
      setVideoUrl('');
      
      fetchProjects();
    } catch (error) {
      console.error('프로젝트 추가 중 오류:', error);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
      try {
        await deleteProject(projectId);
        fetchProjects();
      } catch (error) {
        console.error('프로젝트 삭제 중 오류:', error);
      }
    }
  };

  const handleEditStart = (project) => {
    setEditingProjectId(project.id);
    setEditProject({
      title: project.title,
      detail: project.detail,
      description: project.description,
      thumbnailUrl: project.thumbnailUrl,
      mainImageUrl: project.mainImageUrl,
      detailMedia: project.detailMedia || [],
      categories: project.categories || []
    });
    
    // 기존 이미지 미리보기 설정
    setEditThumbnailPreview(project.thumbnailUrl);
    setEditMainImagePreview(project.mainImageUrl);
    setEditDetailImagePreviews(project.detailMedia?.map(media => media.url) || []);
    
    // 파일 상태 초기화
    setEditThumbnailFile(null);
    setEditMainImageFile(null);
    setEditDetailImageFiles([]);
    
    // 모달 열기
    setShowEditModal(true);
  };

  const handleEditCancel = () => {
    setEditingProjectId(null);
    setShowEditModal(false);
    setEditProject({
      title: '',
      detail: '',
      description: '',
      thumbnailUrl: '',
      mainImageUrl: '',
      detailMedia: [],
      categories: []
    });
    setEditThumbnailPreview('');
    setEditMainImagePreview('');
    setEditDetailImagePreviews([]);
    setEditThumbnailFile(null);
    setEditMainImageFile(null);
    setEditDetailImageFiles([]);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditImagePreview = (e, type) => {
    if (type === 'detail') {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditDetailImagePreviews(prev => [...prev, reader.result]);
          setEditDetailImageFiles(prev => [...prev, file]);
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        switch (type) {
          case 'thumbnail':
            setEditThumbnailPreview(reader.result);
            setEditThumbnailFile(file);
            break;
          case 'main':
            setEditMainImagePreview(reader.result);
            setEditMainImageFile(file);
            break;
          default:
            console.warn('Unknown image type:', type);
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditDetailImageDelete = (index, event) => {
    // 이벤트 전파 방지 (드래그 방해하지 않도록)
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    setEditDetailImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    // 기존 이미지를 삭제하는 경우
    if (index < editProject.detailMedia.length) {
      setEditProject(prev => ({
        ...prev,
        detailMedia: prev.detailMedia.filter((_, i) => i !== index)
      }));
    } else {
      // 새로 추가된 파일을 삭제하는 경우  
      const fileIndex = index - editProject.detailMedia.length;
      setEditDetailImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      let thumbnailUrl = editProject.thumbnailUrl;
      let mainImageUrl = editProject.mainImageUrl;
      let detailMedia = [...editProject.detailMedia];

      // 새 썸네일 이미지가 있으면 업로드
      if (editThumbnailFile) {
        thumbnailUrl = await getPresignedUrl(editThumbnailFile);
      }

      // 새 메인 이미지가 있으면 업로드
      if (editMainImageFile) {
        mainImageUrl = await getPresignedUrl(editMainImageFile);
      }

      // 새 상세 이미지들이 있으면 업로드
      if (editDetailImageFiles.length > 0) {
        const newDetailMediaPromises = editDetailImageFiles.map(async (file) => {
          const url = await getPresignedUrl(file);
          return { url, order: detailMedia.length + editDetailImageFiles.indexOf(file) };
        });
        const newDetailMedia = await Promise.all(newDetailMediaPromises);
        detailMedia = [...detailMedia, ...newDetailMedia];
      }

      const projectData = {
        title: editProject.title,
        detail: editProject.detail,
        description: editProject.description,
        thumbnailUrl,
        mainImageUrl,
        detailMedia,
        categories: editProject.categories
      };

      await updateProject(editingProjectId, projectData);
      
      handleEditCancel();
      fetchProjects();
    } catch (error) {
      console.error('프로젝트 수정 중 오류:', error);
    }
  };

  // 프로젝트 목록 순서 변경 핸들러
  const handleProjectListDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // 순서 업데이트 (order 필드 추가)
    const updatedProjects = items.map((project, index) => ({
      ...project,
      order: index
    }));

    setProjects(updatedProjects);

    // Firestore에 순서 업데이트
    try {
      const batch = writeBatch(db);
      updatedProjects.forEach((project) => {
        const projectRef = doc(db, 'projects', project.id);
        batch.update(projectRef, { order: project.order });
      });
      await batch.commit();
      console.log('프로젝트 순서가 업데이트되었습니다.');
    } catch (error) {
      console.error('프로젝트 순서 업데이트 실패:', error);
    }
  };

  if (loading) {
    return <div className="admin-loading">로딩 중...</div>;
  }

  return (
    <div className="project-management">
      <h1>프로젝트 관리</h1>

      {/* 새 프로젝트 추가 폼 */}
      <div className="admin-form-section">
        <h2>새 프로젝트 추가</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="title">프로젝트 제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newProject.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="detail">프로젝트 상세 설명</label>
            <textarea
              id="detail"
              name="detail"
              value={newProject.detail}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">프로젝트 간단 설명</label>
            <input
              type="text"
              id="description"
              name="description"
              value={newProject.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>카테고리 선택</label>
            <div className="categories-selection">
              {categories.map((category) => (
                <label key={category.id} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={newProject.categories.some(cat => cat.id === category.id)}
                    onChange={() => handleCategoryToggle(category, true)}
                  />
                  <span 
                    className="category-label"
                    style={{ 
                      backgroundColor: 'black',
                      color: category.color || '#007bff',
                      padding: '4px 8px',
                      marginLeft: '5px'
                    }}
                  >
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
            <div className="selected-categories">
              <strong>선택된 카테고리:</strong>
              <div className="categories-display">
                {newProject.categories.map((cat, index) => (
                  <span 
                    key={index} 
                    className="selected-category"
                    style={{ 
                      backgroundColor: 'black',
                      color: cat.color || '#007bff'
                    }}
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail">썸네일 이미지</label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={(e) => handleImagePreview(e, 'thumbnail')}
              required
            />
            {thumbnailPreview && (
              <div className="image-preview">
                <img src={thumbnailPreview} alt="썸네일 미리보기" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mainImage">메인 이미지</label>
            <input
              type="file"
              id="mainImage"
              accept="image/*"
              onChange={(e) => handleImagePreview(e, 'main')}
              required
            />
            {mainImagePreview && (
              <div className="image-preview">
                <img src={mainImagePreview} alt="메인 이미지 미리보기" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="detailImages">상세 이미지들 (여러 장 한번에 선택 가능)</label>
            <input
              type="file"
              id="detailImages"
              accept="image/*"
              onChange={(e) => handleImagePreview(e, 'detail')}
              multiple
            />
          </div>

          {/* 동영상 URL 추가 */}
          <div className="form-group">
            <label htmlFor="videoUrl">동영상 URL 추가 (유튜브/비메오)</label>
            <div className="video-input-container">
              <input
                type="url"
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... 또는 https://vimeo.com/..."
              />
              <button
                type="button"
                onClick={handleAddVideo}
                className="add-video-button"
              >
                동영상 추가
              </button>
            </div>
          </div>

          {/* 상세 미디어 (이미지 + 동영상) 순서 조정 */}
          {newProject.detailMedia.length > 0 && (
            <div className="admin-detail-media-section">
              <h4>상세 미디어 순서 조정</h4>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                  droppableId="new-project-detail-media"
                  direction="horizontal"
                  isDropDisabled={false}
                  isCombineEnabled={false}
                >
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`admin-detail-media-container ${
                        snapshot.isDraggingOver ? 'dragging-over' : ''
                      }`}
                    >
                      {newProject.detailMedia.map((media, index) => (
                        <Draggable
                          key={`new-media-${index}`}
                          draggableId={`new-media-${index}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`admin-detail-media-item ${
                                snapshot.isDragging ? 'dragging' : ''
                              }`}
                            >
                              {media.type === 'image' ? (
                                <img 
                                  src={media.url} 
                                  alt={`상세 이미지 ${index + 1}`}
                                  style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover'
                                  }}
                                />
                              ) : (
                                <div className="video-preview">
                                  <iframe
                                    src={media.url}
                                    width="100"
                                    height="75"
                                    frameBorder="0"
                                    allowFullScreen
                                    title={`동영상 ${index + 1}`}
                                  />
                                  <div className="video-info">
                                    <span className="video-platform">{media.platform}</span>
                                  </div>
                                </div>
                              )}
                              <button
                                type="button"
                                className="delete-media-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleDetailMediaDelete(index);
                                }}
                              >
                                삭제
                              </button>
                              <div style={{ textAlign: 'center', marginTop: '4px' }}>
                                {index + 1}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}

          <button type="submit" className="submit-button">프로젝트 추가</button>
        </form>
      </div>

      {/* 프로젝트 목록 */}
      <div className="admin-list-section">
        <h2>프로젝트 목록 (드래그하여 순서 변경)</h2>
        <DragDropContext onDragEnd={handleProjectListDragEnd}>
          <Droppable droppableId="project-list">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`project-list-simple ${
                  snapshot.isDraggingOver ? 'dragging-over' : ''
                }`}
              >
                {projects.map((project, index) => (
                  <Draggable key={project.id} draggableId={project.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`project-list-item ${
                          snapshot.isDragging ? 'dragging' : ''
                        }`}
                      >
                        <div className="project-drag-handle">⋮⋮</div>
                        <div className="project-thumbnail">
                          {project.thumbnailUrl ? (
                            <img 
                              src={project.thumbnailUrl} 
                              alt={`${project.title} 썸네일`}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="thumbnail-placeholder" style={{ display: project.thumbnailUrl ? 'none' : 'flex' }}>
                            📷
                          </div>
                        </div>
                        <div className="project-info">
                          <span className="project-title">{project.title}</span>
                          <span className="admin-project-description">{project.description}</span>
                        </div>
                        <div className="project-actions">
                          <button
                            className="edit-button"
                            onClick={() => handleEditStart(project)}
                          >
                            수정
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(project.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* 수정 모달 */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleEditCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>프로젝트 수정</h2>
              <button className="modal-close" onClick={handleEditCancel}>×</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="edit-title">프로젝트 제목</label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={editProject.title}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-detail">프로젝트 상세 설명</label>
                <textarea
                  id="edit-detail"
                  name="detail"
                  value={editProject.detail}
                  onChange={handleEditInputChange}
                  required
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">프로젝트 간단 설명</label>
                <input
                  type="text"
                  id="edit-description"
                  name="description"
                  value={editProject.description}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>카테고리 선택</label>
                <div className="categories-selection">
                  {categories.map((category) => (
                    <label key={category.id} className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={editProject.categories.some(cat => cat.id === category.id)}
                        onChange={() => handleCategoryToggle(category, false)}
                      />
                      <span 
                        className="category-label"
                        style={{ 
                          backgroundColor: 'black',
                          color: category.color || '#007bff',
                          padding: '4px 8px',
                          marginLeft: '5px'
                        }}
                      >
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="selected-categories">
                  <strong>선택된 카테고리:</strong>
                  <div className="categories-display">
                    {editProject.categories.map((cat, index) => (
                      <span 
                        key={index} 
                        className="selected-category"
                        style={{ 
                          backgroundColor: 'black',
                          color: cat.color || '#007bff'
                        }}
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-thumbnail">썸네일 이미지</label>
                <input
                  type="file"
                  id="edit-thumbnail"
                  accept="image/*"
                  onChange={(e) => handleEditImagePreview(e, 'thumbnail')}
                />
                {editThumbnailPreview && (
                  <div className="image-preview">
                    <img src={editThumbnailPreview} alt="썸네일 미리보기" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="edit-mainImage">메인 이미지</label>
                <input
                  type="file"
                  id="edit-mainImage"
                  accept="image/*"
                  onChange={(e) => handleEditImagePreview(e, 'main')}
                />
                {editMainImagePreview && (
                  <div className="image-preview">
                    <img src={editMainImagePreview} alt="메인 이미지 미리보기" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="edit-detailImages">상세 이미지들 (여러 장 한번에 선택 가능)</label>
                <input
                  type="file"
                  id="edit-detailImages"
                  accept="image/*"
                  onChange={(e) => handleEditImagePreview(e, 'detail')}
                  multiple
                />
                <div className="admin-detail-images-preview">
                  {editDetailImagePreviews.map((preview, index) => (
                    <div key={index} className="admin-detail-image-item">
                      <img src={preview} alt={`상세 이미지 ${index + 1}`} />
                      <button
                        type="button"
                        className="delete-image-button"
                        onClick={(e) => handleEditDetailImageDelete(index, e)}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 동영상 URL 추가 */}
              <div className="form-group">
                <label htmlFor="edit-video-url">동영상 URL 추가 (YouTube, Vimeo)</label>
                <div className="video-url-input">
                  <input
                    type="url"
                    id="edit-video-url"
                    value={editVideoUrl}
                    onChange={(e) => setEditVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... 또는 https://vimeo.com/..."
                  />
                  <button
                    type="button"
                    className="add-video-button"
                    onClick={handleEditAddVideo}
                  >
                    동영상 추가
                  </button>
                </div>
              </div>

              {editProject.detailMedia && editProject.detailMedia.length > 0 && (
                <div className="admin-detail-images-section">
                  <h4>기존 상세 이미지 순서 조정</h4>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                      droppableId={`droppable-${editingProjectId}`}
                      direction="horizontal"
                      isDropDisabled={false}
                      isCombineEnabled={false}
                    >
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`admin-detail-images-container ${
                            snapshot.isDraggingOver ? 'dragging-over' : ''
                          }`}
                        >
                          {editProject.detailMedia.map((media, index) => (
                            <Draggable
                              key={`media-${index}`}
                              draggableId={`media-${index}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`admin-detail-image-item ${
                                    snapshot.isDragging ? 'dragging' : ''
                                  }`}
                                >
                                  <img
                                    src={media.url}
                                    alt={`상세 이미지 ${index + 1}`}
                                    style={{
                                      width: '100px',
                                      height: '100px',
                                      objectFit: 'cover'
                                    }}
                                  />
                                  <div style={{ textAlign: 'center', marginTop: '4px' }}>
                                    {index + 1}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}

              <div className="modal-buttons">
                <button type="submit" className="save-button">저장</button>
                <button type="button" className="cancel-button" onClick={handleEditCancel}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectManagement; 