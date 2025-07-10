import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';
import { useMobile } from '../contexts/MobileContext';
import MobileCheck from '../components/MobileCheck';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // 환경변수에서 허용된 관리자 이메일 목록 가져오기
  const ALLOWED_ADMIN_EMAILS = process.env.REACT_APP_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];

  // 이미 인증된 관리자면 자동으로 admin 홈으로 이동
  useEffect(() => {
    console.log('Login useEffect 호출 - user:', user);
    
    if (user && user.email) {
      console.log('사용자 확인:', user.email);
      console.log('허용된 이메일 목록:', ALLOWED_ADMIN_EMAILS);
      
      // 관리자 권한 확인
      const isAdmin = (user.role === 'admin' && ALLOWED_ADMIN_EMAILS.includes(user.email)) ||
                      (ALLOWED_ADMIN_EMAILS.includes(user.email));
      
      console.log('관리자 권한 확인 결과:', isAdmin);
      
      if (isAdmin) {
        console.log('이미 로그인된 관리자, admin 홈으로 이동');
        navigate('/admin');
      }
    }
  }, [user, navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 디버깅: 환경변수와 입력값 확인
    console.log('환경변수 이메일:', process.env.REACT_APP_ADMIN_EMAIL);
    console.log('입력된 이메일:', credentials.email);
    console.log('환경변수 비밀번호:', process.env.REACT_APP_ADMIN_PASSWORD);
    console.log('입력된 비밀번호:', credentials.password);

    try {
      const result = await login(credentials.email, credentials.password);
      console.log('로그인 결과:', result);
      console.log('localStorage 확인:', localStorage.getItem('adminToken'), localStorage.getItem('adminUser'));
      // 로그인 성공 후 admin 홈으로 이동
      console.log('로그인 성공, admin 홈으로 이동');
      navigate('/admin');
    } catch (error) {
      console.error('로그인 오류:', error);
      setError(error.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  if (isMobile) {
    return <MobileCheck />;
  }

  return (
    <div className="admin-login">
      <form onSubmit={handleLogin} className="admin-form">
        <h2 className="admin-page-title">UNSANGDONG Admin</h2>
        <div className="admin-login-guide">관리자 계정은 개발자에게 문의 바랍니다.<br />시크릿 브라우저에서는 로그인이 불가능합니다.</div>
        {error && <div className="admin-error-message">{error}</div>}
        <div className="admin-form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            className="admin-input"
            required
            autoComplete="username"
          />
        </div>
        <div className="admin-form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            className="admin-input"
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={loading} className="admin-button">
          {loading ? '로그인 중...' : '관리자 로그인'}
        </button>
      </form>
    </div>
  );
} 