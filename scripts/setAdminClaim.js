const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Firebase Admin SDK 초기화
const serviceAccount = {
  type: "service_account",
  project_id: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 허용된 관리자 이메일
const ALLOWED_ADMIN_EMAILS = process.env.REACT_APP_ADMIN_EMAILS?.split(',').map(email => email.trim()) || ['admin@unsangdong.com'];

async function setAdminClaim(email) {
  try {
    // 이메일로 사용자 찾기
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // 현재 커스텀 클레임 확인
    const currentClaims = userRecord.customClaims || {};
    
    // 관리자 권한 설정
    const isAdmin = ALLOWED_ADMIN_EMAILS.includes(email);
    
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      ...currentClaims,
      admin: isAdmin,
      email: email
    });
    
    console.log(`✅ 커스텀 클레임 설정 완료: ${email} (admin: ${isAdmin})`);
    
    // 설정된 클레임 확인
    const updatedUser = await admin.auth().getUser(userRecord.uid);
    console.log('🔐 설정된 커스텀 클레임:', updatedUser.customClaims);
    
  } catch (error) {
    console.error(`❌ 커스텀 클레임 설정 실패 (${email}):`, error);
  }
}

// 스크립트 실행
const targetEmail = process.argv[2] || 'admin@unsangdong.com';

if (!targetEmail) {
  console.error('❌ 이메일을 입력해주세요.');
  console.log('사용법: node scripts/setAdminClaim.js admin@unsangdong.com');
  process.exit(1);
}

setAdminClaim(targetEmail).then(() => {
  console.log('🎉 커스텀 클레임 설정 완료!');
  process.exit(0);
}).catch(error => {
  console.error('❌ 스크립트 실행 실패:', error);
  process.exit(1);
}); 