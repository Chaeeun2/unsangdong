import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>운생동 Admin</h2>
        <nav>
          <ul>
            <li className={location.pathname === '/admin' ? 'active' : ''}>
              <Link to="/admin">대시보드</Link>
            </li>
            <li className={location.pathname === '/admin/mainpage' ? 'active' : ''}>
              <Link to="/admin/mainpage">MAIN 관리</Link>
            </li>
            <li className={location.pathname === '/admin/about' ? 'active' : ''}>
              <Link to="/admin/about">ABOUT 관리</Link>
            </li>
            <li className={location.pathname === '/admin/awards' ? 'active' : ''}>
              <Link to="/admin/awards">AWARDS 관리</Link>
            </li>
            <li className={location.pathname === '/admin/contact' ? 'active' : ''}>
              <Link to="/admin/contact">CONTACT 관리</Link>
            </li>
            <li className={location.pathname === '/admin/projects' ? 'active' : ''}>
              <Link to="/admin/projects">PROJECT 관리</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="admin-content-wrapper">
        {children}
      </div>
    </div>
  );
} 