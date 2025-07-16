import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AdminLayout from '../components/AdminLayout';
import { pressService } from '../services/dataService';
import '../styles/admin.css';

// SortablePressItem 컴포넌트
function SortablePressItem({ id, item, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      className={`admin-press-table-row ${isDragging ? 'dragging' : ''}`}
    >
      <div className="admin-table-cell admin-table-title">
        <div 
          className="admin-project-drag-handle"
          {...listeners}
        >
          ⠿
        </div>
        <div className="admin-project-title-info">
          <div className="admin-project-title-main">{item.title || '제목 없음'}</div>
        </div>
      </div>
      <div className="admin-table-cell admin-table-year">
        {item.year || '-'}
      </div>
      <div className="admin-table-cell admin-table-size">
        {item.media || '-'}
      </div>
      <div className="admin-table-cell admin-table-actions">
        <button
          className="admin-button admin-button-secondary admin-button-small"
          onClick={() => onEdit(item)}
        >
          수정
        </button>
        <button
          className="admin-button admin-button-danger admin-button-small"
          onClick={() => onDelete(item.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

// Press 모달 컴포넌트
function PressModal({ isOpen, onClose, onSubmit, loading, pressItem = null }) {
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [media, setMedia] = useState('');
  const [url, setUrl] = useState('');
  const [useUrl, setUseUrl] = useState(false);

  // 모달이 열릴 때 데이터 초기화
  useEffect(() => {
    if (isOpen) {
      if (pressItem) {
        // 수정 모드
        setYear(pressItem.year || '');
        setTitle(pressItem.title || '');
        setMedia(pressItem.media || '');
        setUrl(pressItem.url || '');
        setUseUrl(!!pressItem.url);
      } else {
        // 새 추가 모드
        setYear('');
        setTitle('');
        setMedia('');
        setUrl('');
        setUseUrl(false);
      }
    }
  }, [isOpen, pressItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!year || year === '') {
      alert('연도를 입력해주세요.');
      return;
    }
    
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!media.trim()) {
      alert('언론사를 입력해주세요.');
      return;
    }

    const pressData = {
      year: parseInt(year),
      title: title.trim(),
      media: media.trim(),
      url: useUrl ? url.trim() : ''
    };

    onSubmit(pressData);
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content admin-modal-large">
        <div className="admin-modal-header">
          <h3>{pressItem ? 'Press 수정' : '새 Press 추가'}</h3>
          <button onClick={onClose} className="admin-modal-close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-modal-body">
                  <div className="admin-form-column">
                      
          <div className="admin-form-group">
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="기사 제목을 입력하세요"
              className="admin-input"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>연도</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="예: 2024"
              min="1900"
              max="2100"
              className="admin-input admin-input-press"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>언론사</label>
            <input
              type="text"
              value={media}
              onChange={(e) => setMedia(e.target.value)}
              placeholder="언론사명을 입력하세요"
              className="admin-input admin-input-press"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-checkbox-label">
              <div>
                <input
                  type="checkbox"
                  checked={useUrl}
                  onChange={(e) => setUseUrl(e.target.checked)}
                />
              </div>
              <div>URL 사용</div>
            </label>
          </div>
          
          {useUrl && (
            <div className="admin-form-group">
              <label>URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="admin-input"
              />
            </div>
          )}

          <div className="admin-form-actions">
            <button type="button" onClick={onClose} className="admin-button admin-button-secondary">
              취소
            </button>
            <button type="submit" disabled={loading} className="admin-button admin-button-primary">
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const PressManager = () => {
  const [pressItems, setPressItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPress, setEditingPress] = useState(null);

  useEffect(() => {
    loadPress();
  }, []);

  const loadPress = async () => {
    try {
      setLoading(true);
      const items = await pressService.getPress();
      setPressItems(items);
    } catch (error) {
      console.error('Error loading press:', error);
      alert('Press 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (pressData) => {
    try {
      setSaving(true);
      
      if (editingPress) {
        await pressService.updatePressItem(editingPress.id, pressData);
      } else {
        await pressService.addPressItem(pressData);
      }
      
      await loadPress();
      setIsModalOpen(false);
      setEditingPress(null);
    } catch (error) {
      console.error('Error saving press:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pressItem) => {
    setEditingPress(pressItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await pressService.deletePressItem(id);
      await loadPress();
    } catch (error) {
      console.error('Error deleting press:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleNewPress = () => {
    setEditingPress(null);
    setIsModalOpen(true);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = pressItems.findIndex(item => item.id === active.id);
      const newIndex = pressItems.findIndex(item => item.id === over.id);

      const newItems = arrayMove(pressItems, oldIndex, newIndex);
      
      // 즉시 UI 업데이트
      setPressItems(newItems);

      // Firebase 업데이트
      try {
        const updates = newItems.map((item, index) => ({
          id: item.id,
          order: index
        }));
        
        await pressService.updatePressOrder(updates);
      } catch (error) {
        console.error('Error updating press order:', error);
        alert('순서 변경에 실패했습니다.');
        // 에러 시 데이터 새로고침
        loadPress();
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-content">
          <div className="admin-loading">로딩 중...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <AdminLayout>
        <div className="admin-content">
          <h2 className="admin-page-title">PRESS 관리</h2>
          
          <div className="admin-content-layout">
            <div className="admin-content-main">
              <div className="admin-content-header">
                <div className="admin-content-title-section">
                  <h3 className="admin-content-title">Press 목록</h3>
                </div>
                <div className="admin-header-buttons">
                  <button 
                    onClick={handleNewPress}
                    className="admin-button admin-button-primary"
                  >
                    새 Press 추가
                  </button>
                </div>
              </div>

              <div className="admin-content-body">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={pressItems.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="admin-projects-table">
                      <div className="admin-table-container">
                        {pressItems.map((item) => (
                          <SortablePressItem
                            key={item.id}
                            id={item.id}
                            item={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>

      <PressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPress(null);
        }}
        onSubmit={handleSave}
        loading={saving}
        pressItem={editingPress}
      />
    </>
  );
};

export default PressManager; 