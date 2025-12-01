# Firebase 설정 가이드

## 🔥 Firebase 프로젝트 설정 완료!

이 프로젝트는 Firebase를 사용하여 데이터베이스, 인증, 호스팅을 관리합니다.

## 📁 생성된 파일들

### 🔧 설정 파일

- `src/admin/lib/firebase.js` - Firebase 초기화 설정
- `src/admin/services/dataService.js` - Firestore 데이터 CRUD 서비스
- `src/admin/services/authService.js` - Firebase 인증 서비스
- `firestore.rules` - Firestore 보안 규칙
- `firestore.indexes.json` - Firestore 인덱스 설정

### 🎯 업데이트된 파일들

- `src/admin/pages/Dashboard.jsx` - Firebase 통계 데이터 연동
- `src/admin/pages/ContentManager.jsx` - Firebase 콘텐츠 관리
- `src/admin/pages/NoticeManager.jsx` - Firebase 공지사항 관리
- `src/admin/contexts/AuthContext.jsx` - Firebase 인증 통합

## 🚀 Firebase 설정 단계

### 1. Firebase 프로젝트 콘솔 접속

1. [Firebase Console](https://console.firebase.google.com/) 방문
2. 기존 프로젝트 `unsangdong-92e6f` 선택

### 2. Firebase 설정 값 가져오기

1. 프로젝트 설정 → 일반 → 앱 추가 → 웹
2. 앱 닉네임 입력 후 등록
3. Firebase SDK 설정 정보를 복사하여 `.env` 파일 업데이트:

\`\`\`bash

# .env 파일에서 아래 값들을 실제 Firebase 설정으로 변경

REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=unsangdong-92e6f.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=unsangdong-92e6f
REACT_APP_FIREBASE_STORAGE_BUCKET=unsangdong-92e6f.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
REACT_APP_FIREBASE_APP_ID=your-actual-app-id
\`\`\`

### 3. Firestore 데이터베이스 활성화

1. Firebase 콘솔 → Firestore Database
2. "데이터베이스 만들기" 클릭
3. 테스트 모드로 시작 (나중에 프로덕션 모드로 변경)
4. 서버 위치 선택 (asia-northeast3 - 서울 권장)

### 4. Firebase CLI 로그인 및 배포

\`\`\`bash

# Firebase 로그인

firebase login

# Firestore 규칙 및 인덱스 배포

firebase deploy --only firestore

# (선택사항) 호스팅 배포

npm run build
firebase deploy --only hosting
\`\`\`

## 📊 데이터베이스 구조

### 컬렉션들:

- **menus** - 메뉴 관리
- **contents** - 콘텐츠 관리 (건축, 아트, 디자인 등)
- **notices** - 공지사항 관리

### 문서 구조 예시:

\`\`\`javascript
// contents 컬렉션
{
title: "새로운 건축 프로젝트",
category: "architecture",
content: "프로젝트 내용...",
status: "published",
createdAt: timestamp,
updatedAt: timestamp
}

// notices 컬렉션
{
title: "공지사항 제목",
content: "공지 내용...",
important: true,
createdAt: timestamp,
updatedAt: timestamp
}
\`\`\`

## 🔒 관리자 인증

현재 환경 변수 기반 인증 사용:
\`\`\`bash
REACT_APP_ADMIN_EMAIL=admin@unsangdong.com
REACT_APP_ADMIN_PASSWORD=admin123!
\`\`\`

## 🌐 사용법

### 개발 환경 실행

\`\`\`bash
npm start
\`\`\`

### 관리자 페이지 접속

- URL: `http://localhost:3000/admin`
- 로그인: 위의 관리자 계정 사용

## 🔧 주요 기능

- ✅ Firebase Firestore 데이터베이스 연동
- ✅ 실시간 데이터 CRUD 기능
- ✅ 관리자 인증 시스템
- ✅ 콘텐츠 관리 (건축, 아트, 디자인)
- ✅ 공지사항 관리
- ✅ 대시보드 통계 표시
- ✅ Firebase 호스팅 설정

## 🚨 주의사항

1. **환경 변수**: `.env` 파일의 Firebase 설정값을 실제 값으로 교체 필요
2. **보안 규칙**: 프로덕션 배포 시 Firestore 보안 규칙을 더 엄격하게 설정
3. **인증**: 현재는 단순 환경변수 인증, 추후 Firebase Auth로 업그레이드 가능

## 📞 문제 해결

Firebase 설정 중 문제가 있으면 다음을 확인:

1. Firebase 프로젝트가 활성화되어 있는지
2. Firestore 데이터베이스가 생성되어 있는지
3. `.env` 파일의 설정값이 정확한지
4. Firebase CLI가 올바른 프로젝트에 연결되어 있는지

\`\`\`bash

# 현재 Firebase 프로젝트 확인

firebase projects:list
firebase use unsangdong-92e6f
\`\`\`
