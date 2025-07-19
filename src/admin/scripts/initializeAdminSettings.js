// 관리자 설정 초기화 스크립트
import { doc, setDoc } from '@firebase/firestore';
import { db } from '../lib/firebase';

// 환경변수에서 관리자 이메일 가져오기
const ALLOWED_ADMIN_EMAILS = process.env.REACT_APP_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];

export async function initializeAdminSettings() {
  try {
    console.log('관리자 설정 초기화 중...');
    console.log('허용된 관리자 이메일:', ALLOWED_ADMIN_EMAILS);
    
    const adminSettingsRef = doc(db, 'admin-settings', 'config');
    
    await setDoc(adminSettingsRef, {
      adminEmails: ALLOWED_ADMIN_EMAILS,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true });
    
    console.log('관리자 설정이 성공적으로 초기화되었습니다.');
    return true;
  } catch (error) {
    console.error('관리자 설정 초기화 실패:', error);
    throw error;
  }
}

// 스크립트 실행 (개발용)
if (typeof window !== 'undefined') {
  // 브라우저 환경에서는 전역 함수로 노출
  window.initializeAdminSettings = initializeAdminSettings;
} 