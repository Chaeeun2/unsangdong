// Firebase 인증 서비스 (실무용 보안)
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

// 환경변수에서 허용된 관리자 이메일 목록 가져오기 (실무에서는 Firestore에 저장하거나 환경변수로 관리)
const ALLOWED_ADMIN_EMAILS = process.env.REACT_APP_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];

export const authService = {
  // Firebase Authentication으로 로그인
  async signIn(email, password) {
    try {
      console.log('Firebase Authentication 로그인 시도:', email);
      
      // Firebase Authentication으로 로그인
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 허용된 관리자 이메일인지 확인
      if (!ALLOWED_ADMIN_EMAILS.includes(user.email)) {
        await signOut(auth);
        throw new Error('관리자 권한이 없습니다.');
      }
      
      console.log('Firebase 인증 성공:', user.email);
      
      // 관리자 정보를 localStorage에 저장 (선택사항)
      localStorage.setItem('adminUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        role: 'admin',
        loginTime: new Date().toISOString()
      }));
      
      return { success: true, user: user };
    } catch (error) {
      console.error('Firebase 로그인 실패:', error);
      
      // 사용자 친화적인 오류 메시지
      let message = '로그인에 실패했습니다.';
      if (error.code === 'auth/user-not-found') {
        message = '등록되지 않은 이메일입니다.';
      } else if (error.code === 'auth/wrong-password') {
        message = '비밀번호가 올바르지 않습니다.';
      } else if (error.code === 'auth/invalid-email') {
        message = '유효하지 않은 이메일 형식입니다.';
      } else if (error.code === 'auth/user-disabled') {
        message = '비활성화된 계정입니다.';
      }
      
      throw new Error(message);
    }
  },

  // 관리자 계정 생성 (개발용 - 실제로는 Firebase Console에서 생성)
  async createAdminUser(email, password) {
    try {
      if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
        throw new Error('허용되지 않은 관리자 이메일입니다.');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('관리자 계정 생성 완료:', userCredential.user.email);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('관리자 계정 생성 실패:', error);
      throw error;
    }
  },

  // Firebase 로그아웃
  async signOut() {
    try {
      console.log('Firebase 로그아웃 시도');
      
      // Firebase 로그아웃
      await signOut(auth);
      
      // 로컬 저장소 정리
      localStorage.removeItem('adminUser');
      
      console.log('로그아웃 완료');
      return { success: true };
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  },

  // 현재 Firebase 사용자 확인
  getCurrentUser() {
    return auth.currentUser;
  },

  // 로컬 저장소의 관리자 정보 확인
  getLocalAdminUser() {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      try {
        return JSON.parse(adminUser);
      } catch (error) {
        console.error('사용자 정보 파싱 실패:', error);
        return null;
      }
    }
    return null;
  },

  // Firebase 인증 상태 확인
  isAuthenticated() {
    const currentUser = auth.currentUser;
    if (currentUser && ALLOWED_ADMIN_EMAILS.includes(currentUser.email)) {
      return true;
    }
    return false;
  },

  // Firebase 인증 상태 리스너
  onAuthStateChange(callback) {
    console.log('authService: onAuthStateChange 리스너 설정');
    return onAuthStateChanged(auth, (user) => {
      console.log('authService: onAuthStateChanged 콜백 호출');
      console.log('authService: user:', user);
      console.log('authService: user?.email:', user?.email);
      console.log('authService: ALLOWED_ADMIN_EMAILS:', ALLOWED_ADMIN_EMAILS);
      
      // 관리자 권한 확인 후 콜백 실행
      if (user && ALLOWED_ADMIN_EMAILS.includes(user.email)) {
        console.log('authService: 관리자 이메일 확인됨, 사용자 콜백 호출');
        callback(user);
      } else {
        console.log('authService: 관리자 이메일 아님 또는 사용자 없음, null 콜백 호출');
        callback(null);
      }
    });
  },

  // 관리자 권한 확인
  isAdmin(user = null) {
    const targetUser = user || auth.currentUser;
    console.log('authService: isAdmin 호출');
    console.log('authService: targetUser:', targetUser);
    console.log('authService: targetUser?.email:', targetUser?.email);
    console.log('authService: ALLOWED_ADMIN_EMAILS:', ALLOWED_ADMIN_EMAILS);
    
    const result = targetUser && ALLOWED_ADMIN_EMAILS.includes(targetUser.email);
    console.log('authService: isAdmin 결과:', result);
    return result;
  }
}; 