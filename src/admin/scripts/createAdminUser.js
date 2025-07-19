// Firebase 관리자 계정 생성 스크립트
// 사용법: node src/admin/scripts/createAdminUser.js

import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 생성할 관리자 계정 정보
const adminAccounts = [
  {
    email: process.env.REACT_APP_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.REACT_APP_ADMIN_PASSWORD || 'admin123456'
  }
];

// 관리자 계정 생성 함수
async function createAdminUsers() {
  for (const account of adminAccounts) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, account.email, account.password);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // 이미 존재하는 계정
      } else {
        throw error;
      }
    }
  }
}

// 스크립트 실행
createAdminUsers().catch(error => {
  console.error('관리자 계정 생성 중 오류 발생:', error);
  process.exit(1);
}); 