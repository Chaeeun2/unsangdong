# 언생동 React 웹 애플리케이션

React와 JavaScript로 만든 웹 애플리케이션입니다.

## 프로젝트 구조

```
unsaengdong/
├── public/
│   └── index.html          # 메인 HTML 파일
├── src/
│   ├── App.js             # 메인 컴포넌트
│   ├── App.css            # 앱 스타일
│   ├── index.js           # 애플리케이션 진입점
│   └── index.css          # 전역 스타일
├── package.json           # 프로젝트 설정 및 의존성
└── README.md             # 프로젝트 설명서
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 3. 프로덕션 빌드

```bash
npm run build
```

## 사용 가능한 스크립트

- `npm start`: 개발 서버를 시작합니다
- `npm run build`: 프로덕션용 빌드를 생성합니다
- `npm test`: 테스트를 실행합니다
- `npm run eject`: Create React App 설정을 추출합니다 (주의: 되돌릴 수 없습니다)

## 개발 시작하기

1. `src/App.js` 파일을 수정하여 원하는 컴포넌트를 만들어보세요
2. `src/App.css` 파일에서 스타일을 변경할 수 있습니다
3. 새로운 컴포넌트는 `src/` 폴더 안에 생성하세요

## 기술 스택

- React 18
- JavaScript (ES6+)
- CSS3
- HTML5
