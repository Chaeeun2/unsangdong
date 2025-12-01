# Cloudflare R2 설정 가이드

## ☁️ Cloudflare R2로 이미지 관리 설정 완료!

이 프로젝트는 **Cloudflare R2** (S3 호환 객체 스토리지)를 사용하여 이미지를 업로드하고 관리하며, Firebase에는 이미지 URL만 저장합니다.

## 🎯 아키텍처

```
📱 Admin Panel → 📤 Cloudflare R2 → 🔗 URL 저장 → 🔥 Firebase Firestore
```

- **이미지 저장**: Cloudflare R2 (S3 호환, 무료 egress)
- **이미지 URL**: Firebase Firestore에 문자열로 저장
- **이미지 변환**: Cloudflare Transform (선택사항)
- **CDN**: 전 세계 빠른 이미지 전송

## 💰 비용 효율성

### Cloudflare R2 장점:

- ✅ **무료 egress** (외부 전송 비용 없음)
- ✅ **저렴한 스토리지**: $0.015/GB/월
- ✅ **S3 호환 API** (기존 도구 사용 가능)
- ✅ **10GB/월 무료** (Class A 작업 1M개, Class B 작업 10M개)

### 다른 서비스와 비교:

- **AWS S3**: 스토리지 $0.023/GB + egress $0.09/GB
- **Firebase Storage**: $0.026/GB + $0.12/GB 다운로드
- **Cloudflare R2**: $0.015/GB + **egress 무료** 🎉

## 🚀 Cloudflare R2 설정 단계

### 1. R2 활성화

1. **[Cloudflare Dashboard](https://dash.cloudflare.com/) 접속**
2. **왼쪽 메뉴에서 "R2 Object Storage" 클릭**
3. **"Purchase R2" 또는 "Get Started" 클릭**
4. **결제 정보 입력** (무료 한도 있음)

### 2. 버킷 생성

1. **"Create bucket" 버튼 클릭**
2. **버킷 이름**: `unsangdong-images` (또는 원하는 이름)
3. **위치**: `Automatic` (권장) 또는 가까운 지역 선택
4. **"Create bucket" 클릭**

### 3. API 토큰 생성

1. **"Manage R2 API tokens" 클릭**
2. **"Create API token" 버튼 클릭**
3. **토큰 이름**: `unsangdong-r2-token`
4. **권한 설정**:
   - **Permissions**: `Object Read & Write`
   - **Bucket**: 생성한 버킷 선택 또는 `Apply to all buckets`
5. **"Create API token" 클릭**
6. **Access Key ID**와 **Secret Access Key** 복사 (재확인 불가능!)

### 4. 커스텀 도메인 설정 (선택사항)

1. **버킷 선택 → "Settings" 탭**
2. **"Custom Domains" → "Connect Domain"**
3. **도메인 입력**: `images.unsangdong.com`
4. **DNS 설정 완료 후 SSL 인증서 자동 생성**

### 5. 환경 변수 설정

`.env` 파일에서 R2 설정을 업데이트하세요:

```bash
# Cloudflare R2 설정
REACT_APP_R2_ACCOUNT_ID=실제-account-id-입력
REACT_APP_R2_ACCESS_KEY_ID=실제-access-key-id-입력
REACT_APP_R2_SECRET_ACCESS_KEY=실제-secret-access-key-입력
REACT_APP_R2_BUCKET_NAME=unsangdong-images
REACT_APP_R2_PUBLIC_URL=https://your-custom-domain.com
```

**Account ID 확인**: Cloudflare Dashboard 우측 사이드바

## 📊 이미지 URL 구조

### 기본 R2 URL:

```
https://pub-{account-hash}.r2.dev/images/filename.jpg
```

### 커스텀 도메인 사용시:

```
https://images.unsangdong.com/images/filename.jpg
```

### 생성되는 파일 구조:

```
버킷명/
├── images/
│   ├── 2024-01-15T10-30-45-abc123.jpg
│   ├── 2024-01-15T10-31-12-def456.png
│   └── batch-0-2024-01-15T10-32-00-ghi789.webp
```

## 🔧 주요 기능

### ✅ 업데이트된 컴포넌트들:

- **`imageService.js`**: R2 S3 API 연동 서비스
- **`ImageUploader.jsx`**: 드래그 앤 드롭 이미지 업로더 (동일)
- **`ContentEditor.jsx`**: 이미지 업로드가 포함된 콘텐츠 편집기 (동일)

### ✅ R2 특화 기능:

- 🗂️ **S3 호환 API** (기존 AWS SDK 사용)
- 📁 **폴더 구조 관리** (images/ 하위 저장)
- 🏷️ **메타데이터 저장** (업로드 시간, 원본 이름 등)
- 🔐 **서명된 URL 생성** (Private 버킷용)
- 📋 **파일 목록 조회** (관리 기능)

## 📋 사용법

### 1. 이미지 업로드 프로세스:

1. **Admin Panel → 콘텐츠 관리 → 새 콘텐츠 추가**
2. **파일 선택/드래그 앤 드롭**
3. **R2에 업로드 → 고유 파일명 생성**
4. **Public URL 반환 → Firebase에 저장**

### 2. Firebase에 저장되는 데이터:

```javascript
{
  title: "건축 프로젝트",
  category: "architecture",
  mainImage: "https://images.unsangdong.com/images/2024-01-15T10-30-45-abc123.jpg",
  thumbnailImage: "https://images.unsangdong.com/images/2024-01-15T10-30-45-abc123.jpg",
  galleryImages: [
    "https://images.unsangdong.com/images/2024-01-15T10-31-12-def456.jpg",
    "https://images.unsangdong.com/images/2024-01-15T10-32-00-ghi789.jpg"
  ],
  // ... 기타 콘텐츠 데이터
}
```

### 3. 파일명 규칙:

```
{prefix}{timestamp}-{random}.{extension}
예: 2024-01-15T10-30-45-abc123.jpg
   batch-0-2024-01-15T10-31-12-def456.png
```

## 🛠️ 이미지 최적화 (선택사항)

### Cloudflare Transform 연동:

R2와 함께 Cloudflare Transform을 사용하여 실시간 이미지 변환 가능:

```javascript
// 변환 URL 예시
const optimizedUrl = imageService.generateTransformUrl("filename.jpg", {
  width: 800,
  height: 600,
  quality: 85,
  format: "webp",
});
// 결과: https://images.unsangdong.com/images/filename.jpg?width=800&height=600&quality=85&format=webp
```

## 🔧 테스트 및 확인

### 1. 설정 테스트:

```bash
npm start
# http://localhost:3000/admin → 콘텐츠 관리 → 새 콘텐츠 추가
```

### 2. 이미지 업로드 테스트:

1. **이미지 파일을 드래그 앤 드롭**
2. **업로드 완료 후 미리보기 확인**
3. **R2 대시보드에서 파일 확인**
4. **Firebase에서 URL 확인**

### 3. R2 Dashboard에서 확인:

1. **Cloudflare Dashboard → R2 Object Storage**
2. **버킷 클릭 → Objects 탭**
3. **업로드된 파일 목록 확인**

## 🚨 트러블슈팅

### Common Issues:

1. **CORS 에러**:

   ```bash
   # R2 버킷에서 CORS 설정 필요
   # AWS CLI 또는 wrangler 사용
   ```

2. **접근 권한 오류**:

   - API 토큰의 버킷 권한 확인
   - Access Key ID와 Secret Key 재확인

3. **파일 업로드 실패**:
   - 버킷 이름 확인
   - Account ID와 엔드포인트 확인
   - 네트워크 연결 상태 확인

### 디버깅:

```javascript
// 브라우저 콘솔에서 설정 확인
console.log("R2 Account ID:", process.env.REACT_APP_R2_ACCOUNT_ID);
console.log("R2 Bucket:", process.env.REACT_APP_R2_BUCKET_NAME);
console.log("R2 Public URL:", process.env.REACT_APP_R2_PUBLIC_URL);
```

## 📈 성능 최적화

### 1. CDN 활용:

- R2 자체적으로 Cloudflare CDN 제공
- 전 세계 빠른 이미지 로딩

### 2. 파일 압축:

- WebP, AVIF 형식 업로드 권장
- 업로드 전 클라이언트 측 압축 (선택사항)

### 3. 캐싱:

- Browser Cache Headers 설정
- Cloudflare Page Rules 활용

## 🎉 완료!

이제 다음이 가능합니다:

- ✅ **Cloudflare R2로 이미지 업로드**
- ✅ **Firebase에 URL만 저장하여 비용 절약**
- ✅ **무료 egress로 트래픽 비용 제거**
- ✅ **S3 호환 API로 확장성 확보**
- ✅ **관리자 페이지에서 쉬운 이미지 관리**

**다음 단계**:

1. R2 버킷 생성 및 API 토큰 발급
2. `.env` 파일에서 R2 설정 업데이트
3. 커스텀 도메인 설정 (선택사항)
4. 테스트 이미지 업로드! 🚀
