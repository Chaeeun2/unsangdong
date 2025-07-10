import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// 환경변수에서 허용된 관리자 이메일 목록 가져오기
const ALLOWED_ADMIN_EMAILS = process.env.REACT_APP_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: 인증 확인', location.pathname, { loading, userEmail: user?.email });
  console.log('ProtectedRoute: 허용된 관리자 이메일 목록', ALLOWED_ADMIN_EMAILS);

  // Firebase 인증 초기화 중이면 로딩 화면 표시
  if (loading) {
    console.log('Firebase 인증 초기화 중...');
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
    console.log('사용자 이메일:', user?.email);
    console.log('사용자 UID:', user?.uid);
    console.log('사용자 role:', user?.role);
    
    // 커스텀 user 객체인 경우 (AuthContext에서 변환된 경우)
    if (user.role === 'admin' && user.email && ALLOWED_ADMIN_EMAILS.includes(user.email)) {
      console.log('커스텀 user 객체 - 관리자 권한 확인');
      isAuthenticated = true;
    }
    // Firebase UserImpl 객체인 경우 (직접 처리)
    else if (user.email && ALLOWED_ADMIN_EMAILS.includes(user.email)) {
      console.log('Firebase UserImpl 객체 - 허용된 관리자 이메일 확인');
      isAuthenticated = true;
    }
  }

  console.log('최종 인증 상태:', isAuthenticated);

  if (!isAuthenticated) {
    console.log('인증 실패 - 로그인 페이지로 리디렉션');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('인증 성공 - 관리자 페이지 접근 허용');
  return children;
} 