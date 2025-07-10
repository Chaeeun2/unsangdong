import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';

export default function MenuManager() {
  const [menus] = useState([
    { id: 1, name: 'ABOUT', url: '/about', parent: null, order: 1 },
    { id: 2, name: 'WORKS', url: '#', parent: null, order: 2 },
    { id: 3, name: 'ARCHITECTURE', url: '/architecture', parent: 2, order: 1 },
    { id: 4, name: 'ART', url: '/art', parent: 2, order: 2 },
    { id: 5, name: 'DESIGN', url: '/design', parent: 2, order: 3 },
    { id: 6, name: 'NEWS', url: '/news', parent: null, order: 3 },
    { id: 7, name: 'BOOK', url: '/book', parent: null, order: 4 },
    { id: 8, name: 'CONTACT', url: '/contact', parent: null, order: 5 }
  ]);

  const parentMenus = menus.filter(menu => !menu.parent);
  const getSubMenus = (parentId) => menus.filter(menu => menu.parent === parentId);

  return (
    <AdminLayout>
      <div className="admin-content">
        <h2 className="admin-page-title">메뉴 관리</h2>
        <div className="admin-content-layout">
          <div className="admin-menu-nav">
            <h3>메뉴 추가/수정</h3>
            <form className="admin-form">
              <div className="admin-form-group">
                <label htmlFor="menuName">메뉴명</label>
                <input
                  type="text"
                  id="menuName"
                  className="admin-input"
                  placeholder="메뉴명을 입력하세요"
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="menuUrl">URL</label>
                <input
                  type="text"
                  id="menuUrl"
                  className="admin-input"
                  placeholder="/page-url"
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="parentMenu">상위 메뉴</label>
                <select id="parentMenu" className="admin-select">
                  <option value="">최상위 메뉴</option>
                  {parentMenus.map(menu => (
                    <option key={menu.id} value={menu.id}>{menu.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="admin-button">메뉴 추가</button>
            </form>
          </div>
          <div className="admin-content-main">
            <div className="admin-content-header">
              <h3>현재 메뉴 구조</h3>
            </div>
            <div className="admin-menu-structure">
              <div className="admin-menu-structure-guide">
                <p>현재 사이트의 메뉴 구조입니다. 드래그 앤 드롭으로 순서를 변경할 수 있습니다.</p>
              </div>
              <div className="admin-menu-list">
                {parentMenus.map(menu => (
                  <div key={menu.id}>
                    <div className="admin-menu-item parent">
                      <span className="admin-menu-name">{menu.name}</span>
                      <span className="admin-menu-url">{menu.url}</span>
                      <div className="admin-menu-actions">
                        <button className="admin-button">수정</button>
                        <button className="admin-button delete">삭제</button>
                      </div>
                    </div>
                    {getSubMenus(menu.id).map(subMenu => (
                      <div key={subMenu.id} className="admin-menu-item child">
                        <span className="admin-menu-name">└ {subMenu.name}</span>
                        <span className="admin-menu-url">{subMenu.url}</span>
                        <div className="admin-menu-actions">
                          <button className="admin-button">수정</button>
                          <button className="admin-button delete">삭제</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 