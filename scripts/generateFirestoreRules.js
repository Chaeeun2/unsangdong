const fs = require('fs');
const path = require('path');

// 환경변수에서 관리자 이메일 가져오기
const ALLOWED_ADMIN_EMAILS = process.env.REACT_APP_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];

if (ALLOWED_ADMIN_EMAILS.length === 0) {
  console.error('❌ REACT_APP_ADMIN_EMAILS 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

console.log('🔧 허용된 관리자 이메일:', ALLOWED_ADMIN_EMAILS);

// Firestore 규칙 템플릿
const firestoreRulesTemplate = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 관리자 권한 확인 (환경변수 기반)
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email in [${ALLOWED_ADMIN_EMAILS.map(email => `'${email}'`).join(', ')}];
    }
    
    // 문의사항 생성 시 기본 검증 (스팸 방지)
    function isValidInquiry() {
      return request.resource.data.keys().hasAll(['name', 'email', 'message']) &&
             request.resource.data.name is string &&
             request.resource.data.name.size() > 0 &&
             request.resource.data.name.size() < 100 &&
             request.resource.data.email is string &&
             request.resource.data.email.matches('^[^@]+@[^@]+\\\\.[^@]+$') &&
             request.resource.data.message is string &&
             request.resource.data.message.size() > 0 &&
             request.resource.data.message.size() < 2000;
    }
    
    // === 공개 읽기 허용 컬렉션 (웹사이트 방문자용) ===
    
    // 메뉴 컬렉션
    match /menus/{document} {
      allow read: if true;  // 공개 읽기
      allow write: if isAdmin();  // 관리자만 쓰기
    }
    
    // 콘텐츠 컬렉션 (프로젝트, 뉴스 등)
    match /contents/{document} {
      allow read: if true;  // 공개 읽기
      allow write: if isAdmin();  // 관리자만 쓰기
    }
    
    // 공지사항 컬렉션
    match /notices/{document} {
      allow read: if true;  // 공개 읽기
      allow write: if isAdmin();  // 관리자만 쓰기
    }
    
    // 뉴스 컬렉션
    match /news/{document} {
      allow read: if true;  // 공개 읽기
      allow write: if isAdmin();  // 관리자만 쓰기
    }
    
    // 메인 이미지 컬렉션
    match /mainImages/{document} {
      allow read: if true;  // 공개 읽기
      allow write: if isAdmin();  // 관리자만 쓰기
    }
    
    // About 페이지 컬렉션
    match /about/{document} {
      allow read: if true;  // 공개 읽기
      allow write: if isAdmin();  // 관리자만 쓰기
    }
    
    // Awards 페이지 컬렉션
    match /awards/{document} {
      allow read: if true;  // 공개 읽기
      allow write: if isAdmin();  // 관리자만 쓰기
    }
    
    // Contact 페이지 컬렉션
    match /contact/{document} {
      allow read: if true;  // 공개 읽기
      allow write: if isAdmin();  // 관리자만 쓰기
    }
    
    // Book 컬렉션
    match /books/{document} {
      allow read: if true;  // 공개 읽기
      allow write: if isAdmin();  // 관리자만 쓰기
    }
    
    // Press 컬렉션
    match /press/{document} {
      allow read: if true;  // 공개 읽기
      allow write: if isAdmin();  // 관리자만 쓰기
    }
    
    // 프로젝트 타입 컬렉션 (웹사이트 방문자도 읽기 가능)
    match /projectTypes/{document} {
      allow read: if true;  // 공개 읽기 (필터링 옵션용)
      allow write: if isAdmin();  // 관리자만 쓰기
    }
    
    // 문의사항 컬렉션 (모든 사용자 작성 가능)
    match /inquiries/{document} {
      allow read: if isAdmin();  // 관리자만 읽기
      allow create: if isValidInquiry();  // 유효한 문의사항만 생성 가능
      allow update, delete: if isAdmin();  // 관리자만 수정/삭제
    }
    
    // === 관리자 전용 컬렉션 ===
    
    // 관리자 설정 컬렉션 (완전 비공개)
    match /admin-settings/{document} {
      allow read, write: if isAdmin();
    }
    
    // 사용자 로그 컬렉션 (관리자만 읽기)
    match /user-logs/{document} {
      allow read: if isAdmin();
      allow write: if false;  // 시스템에서만 쓰기 (Cloud Functions 사용 권장)
    }
    
    // === 기본 보안 규칙 (모든 다른 경로 차단) ===
    match /{document=**} {
      allow read, write: if false;  // 명시적으로 정의되지 않은 모든 경로 차단
    }
  }
}`;

// 규칙 파일 생성
const rulesPath = path.join(__dirname, '..', 'firestore.rules');
fs.writeFileSync(rulesPath, firestoreRulesTemplate);

console.log('✅ Firestore 규칙이 성공적으로 생성되었습니다.');
console.log('📁 파일 위치:', rulesPath); 