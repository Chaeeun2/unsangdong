// Firebase 관리자 계정 생성 스크립트
// 사용법: node src/admin/scripts/createAdminUser.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 관리자 계정 목록
const adminAccounts = [
  { email: 'admin@unsangdong.com', password: 'Admin123!@#' },
  { email: 'jang@unsangdong.com', password: 'Jang123!@#' },
  { email: 'shin@unsangdong.com', password: 'Shin123!@#' }
];

async function createAdminUsers() {
  console.log('🔐 Firebase 관리자 계정 생성 시작...\n');

  for (const account of adminAccounts) {
    try {
      console.log(`📧 계정 생성 중: ${account.email}`);
      
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        account.email, 
        account.password
      );
      
      console.log(`✅ 성공: ${userCredential.user.email} (UID: ${userCredential.user.uid})`);
      
      // 로그아웃하여 다음 계정 생성 준비
      await signOut(auth);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  이미 존재: ${account.email}`);
      } else {
        console.error(`❌ 실패: ${account.email} - ${error.message}`);
      }
    }
  }

  console.log('\n🎉 관리자 계정 생성 완료!');
  console.log('\n📝 생성된 계정 정보:');
  adminAccounts.forEach(account => {
    console.log(`   이메일: ${account.email}`);
    console.log(`   비밀번호: ${account.password}\n`);
  });
  
  console.log('⚠️  보안을 위해 비밀번호를 즉시 변경하시기 바랍니다.');
  process.exit(0);
}

// 스크립트 실행
createAdminUsers().catch(error => {
  console.error('❌ 스크립트 실행 실패:', error);
  process.exit(1);
}); 