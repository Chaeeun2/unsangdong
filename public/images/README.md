# 이미지 리소스 폴더

이 폴더는 포트폴리오 웹사이트에서 사용할 이미지들을 저장하는 곳입니다.

## 📁 폴더 구조

```
public/images/
├── portfolio/
│   ├── architecture/     # 건축물 외관 이미지
│   ├── interior/         # 인테리어 이미지
│   └── residential/      # 주거용 건물 이미지
└── README.md            # 이 파일
```

## 🖼️ 이미지 사용법

### 1. 이미지 파일 추가

- 각 카테고리에 맞는 폴더에 이미지 파일을 넣어주세요
- 권장 파일 형식: `.jpg`, `.jpeg`, `.png`, `.webp`
- 권장 파일명: `project1.jpg`, `building1.png` 등 (영문, 숫자, 하이픈만 사용)

### 2. 코드에서 이미지 사용

React 컴포넌트에서 이미지를 사용할 때는 다음과 같이 경로를 지정합니다:

```javascript
// 예시
const portfolioItems = [
  {
    id: 1,
    title: "현대 건축물",
    description: "화이트 모던 건축",
    imageUrl: "/images/portfolio/architecture/building1.jpg",
    size: "large",
  },
];
```

### 3. 이미지 최적화 권장사항

- **해상도**: 1920x1080 또는 그 이상
- **용량**: 1MB 이하 (웹 최적화)
- **비율**: 16:9 또는 4:3 권장

## 📝 파일명 규칙

- 영문 소문자 사용
- 공백 대신 하이픈(-) 또는 언더스코어(\_) 사용
- 숫자로 순서 표시 가능

### 예시

```
architecture/
├── modern-building-01.jpg
├── white-house-exterior.jpg
└── commercial-complex.png

interior/
├── minimal-living-room.jpg
├── marble-bathroom.jpg
└── modern-kitchen.png

residential/
├── family-house-01.jpg
├── apartment-complex.jpg
└── villa-design.png
```
