import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// 환경변수에서 허용된 관리자 이메일 목록 가져오기
const ALLOWED_ADMIN_EMAILS = process.env.REACT_APP_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Firebase 인증 초기화 중이면 로딩 화면 표시
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Firebase 인증 확인 중...
      </div>
    );
  }

  // 사용자 인증 확인 로직
  let isAuthenticated = false;
  
  if (user) {
    // 커스텀 user 객체인 경우 (AuthContext에서 변환된 경우)
    if (user.role === 'admin' && user.email && ALLOWED_ADMIN_EMAILS.includes(user.email)) {
      isAuthenticated = true;
    }
    // Firebase UserImpl 객체인 경우 (직접 처리)
    else if (user.email && ALLOWED_ADMIN_EMAILS.includes(user.email)) {
      isAuthenticated = true;
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
} 