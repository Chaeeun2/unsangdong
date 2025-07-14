import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AdminLayout from '../components/AdminLayout';
import { bookService } from '../services/dataService';
import { imageService } from '../services/imageService';
import '../styles/admin.css';

// Book 모달 컴포넌트
function BookModal({ isOpen, onClose, onSubmit, loading, book = null }) {
  const [title, setTitle] = useState('');
  const [size, setSize] = useState('중간');
  const [externalLink, setExternalLink] = useState('');
  const [useExternalLink, setUseExternalLink] = useState(false);
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [uploading, setUploading] = useState(false);

  // 모달이 열릴 때 데이터 초기화
  useEffect(() => {
    if (isOpen) {
      if (book) {
        // 수정 모드
        setTitle(book.title || '');
        setSize(book.size || '중간');
        setExternalLink(book.externalLink || '');
        setUseExternalLink(!!book.externalLink);
        setThumbnailImage(book.thumbnailImage || '');
      } else {
        // 새 추가 모드
        setTitle('');
        setSize('중간');
        setExternalLink('');
        setUseExternalLink(false);
        setThumbnailImage('');
      }
    }
  }, [isOpen, book]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!thumbnailImage) {
      alert('썸네일 이미지를 업로드해주세요.');
      return;
    }

    const bookData = {
      title: title.trim(),
      size,
      externalLink: useExternalLink ? externalLink.trim() : '',
      thumbnailImage,
      order: book ? book.order : 0
    };

    onSubmit(bookData);
  };

  const handleThumbnailUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await imageService.uploadImage(file, 'books');
      setThumbnailImage(url);
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('썸네일 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveThumbnail = async () => {
    if (!thumbnailImage) return;

    try {
      await imageService.deleteImage(thumbnailImage);
      setThumbnailImage('');
    } catch (error) {
      console.error('Error removing thumbnail:', error);
      alert('썸네일 삭제에 실패했습니다.');
    }
  };



  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content admin-modal-large">
        <div className="admin-modal-header">
          <h3>{book ? '도서 수정' : '새 도서 추가'}</h3>
          <button type="button" className="admin-modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-modal-body">
            <div className="admin-form-column">
              <div className="admin-form-group">
                <label>제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="admin-input"
                  required
                />
              </div>
              
              <div className="admin-form-group">
                <label>크기</label>
                <select value={size} onChange={(e) => setSize(e.target.value)} className="book-select">
                  <option value="작게">작게</option>
                  <option value="중간">중간</option>
                  <option value="크게">크게</option>
                </select>
              </div>
              
              <div className="admin-form-group">
              <label className="admin-checkbox-label">
                <div>
                  <input
                    type="checkbox"
                    checked={useExternalLink}
                    onChange={(e) => setUseExternalLink(e.target.checked)}
                  />
                  </div>
                  <div>URL 사용</div>
                </label>
              </div>
              
              {useExternalLink && (
                <div className="admin-form-group">
                  <label>URL</label>
                  <input
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    className="admin-input"
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>
            
            <div className="admin-form-column">
              <div className="admin-form-group">
                <label>썸네일 이미지</label>
                <div className="admin-upload-button-container">
                  <input
                    type="file"
                    id="book-thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('book-thumbnail').click()}
                    className="admin-button admin-button-secondary"
                    disabled={uploading}
                  >
                    {uploading ? '업로드 중...' : '이미지 선택'}
                  </button>
                  <small className="admin-upload-caption">
                    지원 포맷: JPG, PNG, WebP, GIF ㅣ 최대 용량: 2MB
                  </small>
                </div>
                
                {thumbnailImage && (
                  <div className="admin-book-preview">
                    <img src={thumbnailImage} alt="썸네일 미리보기" />
                    <div className="admin-image-controls">
                    </div>
                  </div>
                )}
              </div>
              
                          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="admin-button admin-button-secondary"
            >
              취소
            </button>
            <button
              type="submit"
              className="admin-button admin-button-primary"
              disabled={loading || uploading}
            >
              {loading ? '저장 중...' : (book ? '수정' : '추가')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks();
      setBooks(data || []);
    } catch (error) {
      console.error('Error loading books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (bookData) => {
    setSaving(true);
    try {
      if (editingBook) {
        await bookService.updateBook(editingBook.id, bookData);
      } else {
        await bookService.addBook(bookData);
      }
      
      setShowModal(false);
      setEditingBook(null);
      await loadBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 도서를 삭제하시겠습니까?')) {
      try {
        await bookService.deleteBook(id);
        await loadBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleNewBook = () => {
    setEditingBook(null);
    setShowModal(true);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(books);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // 즉시 UI 업데이트
    setBooks(items);

    // 서버에 순서 업데이트
    try {
      const updates = items.map((book, index) => ({
        id: book.id,
        order: index
      }));
      
      await bookService.updateBooksOrder(updates);
    } catch (error) {
      console.error('Error updating book order:', error);
      // 실패 시 원래 상태로 복원
      await loadBooks();
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="admin-content">
        <h2 className="admin-page-title">도서 관리</h2>
        <div className="admin-loading-state">
          <p>로딩 중...</p>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="admin-content">
        <h2 className="admin-page-title">Book 관리</h2>
        
        <div className="admin-content-layout">
          <div className="admin-content-main">
            <div className="admin-content-header">
              <div className="admin-content-title-section">
                <h3 className="admin-content-title">Book 목록</h3>
              </div>
              <div className="admin-header-buttons">
                <button
                  onClick={handleNewBook}
                  className="admin-button admin-button-primary"
                >
                  새 도서 추가
                </button>
              </div>
            </div>
            
{books.length === 0 ? (
              <div className="admin-empty-state">
                <p>등록된 도서가 없습니다.</p>
                <button
                  onClick={handleNewBook}
                  className="admin-button admin-button-primary"
                >
                  첫 번째 도서 추가하기
                </button>
              </div>
            ) : (
              <div className="admin-projects-container">
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="admin-projects-table">
                    <Droppable droppableId="books-list">
                      {(provided, snapshot) => (
                        <div 
                          className={`admin-table-body ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {books.map((book, index) => (
                            <Draggable 
                              key={book.id} 
                              draggableId={book.id} 
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div 
                                  className={`admin-table-row ${snapshot.isDragging ? 'dragging' : ''}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  <div className="admin-table-cell admin-table-title">
                                    <div 
                                      className="admin-project-drag-handle"
                                      {...provided.dragHandleProps}
                                    >
                                      ⠿
                                    </div>
                                    <div className="admin-project-title-info">
                                      <div className="admin-project-title-main">{book.title || '제목 없음'}</div>
                                    </div>
                                  </div>
                                  <div className="admin-table-cell admin-table-size">
                                    {book.size || '-'}
                                  </div>
                                  <div className="admin-table-cell admin-table-link">
                                    {book.externalLink ? (
                                      <a 
                                        href={book.externalLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="external-link"
                                      >
                                        URL
                                      </a>
                                    ) : (
                                      '-'
                                    )}
                                  </div>
                                  <div className="admin-table-cell admin-table-actions">
                                    <button
                                      className="admin-button admin-button-secondary admin-button-small"
                                      onClick={() => handleEdit(book)}
                                    >
                                      수정
                                    </button>
                                    <button
                                      className="admin-button admin-button-danger admin-button-small"
                                      onClick={() => handleDelete(book.id)}
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
                  </div>
                </DragDropContext>
              </div>
            )}
          </div>
        </div>
        
        <BookModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingBook(null);
          }}
          onSubmit={handleSave}
          loading={saving}
          book={editingBook}
        />
      </div>
    </AdminLayout>
  );
};

export default BookManager; 