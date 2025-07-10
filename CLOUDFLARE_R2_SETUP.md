# 🔧 Cloudflare R2 설정값 확인 방법

## 📋 필요한 설정값들

```bash
REACT_APP_R2_ACCOUNT_ID=your-r2-account-id           # ← 여기서 확인!
REACT_APP_R2_ACCESS_KEY_ID=your-r2-access-key-id     # ← API 토큰 생성시
REACT_APP_R2_SECRET_ACCESS_KEY=your-r2-secret-key    # ← API 토큰 생성시
REACT_APP_R2_BUCKET_NAME=unsangdong-images           # ← 버킷 생성시
REACT_APP_R2_PUBLIC_URL=https://your-domain.com      # ← 커스텀 도메인 또는 기본
```

## 1️⃣ Account ID 확인 방법

### 방법 1: Dashboard 우측 사이드바

1. **[Cloudflare Dashboard](https://dash.cloudflare.com/) 접속**
2. **로그인 후 메인 페이지**
3. **우측 사이드바에서 "Account ID" 찾기**
   ```
   📋 Account ID
   abc123def456ghi789  [Copy]
   ```

### 방법 2: R2 페이지에서 확인

1. **Cloudflare Dashboard → 왼쪽 메뉴 → "R2 Object Storage"**
2. **페이지 상단 또는 우측에 Account ID 표시**

### 방법 3: URL에서 확인

R2 페이지 URL을 보면:

```
https://dash.cloudflare.com/{account-id}/r2
```

## 2️⃣ API 토큰 생성 (Access Key & Secret)

### 단계별 생성:

1. **R2 페이지 → "Manage R2 API tokens" 클릭**
2. **"Create API token" 버튼 클릭**
3. **토큰 설정**:
   ```
   Token name: unsangdong-r2-token
   Permissions: Object Read & Write
   TTL: No expiry (또는 원하는 기간)
   Bucket restrictions: All buckets (또는 특정 버킷)
   ```
4. **"Create API token" 클릭**
5. **⚠️ 중요: 다음 정보를 즉시 복사하여 저장!**

   ```
   Access Key ID: ABCD1234EFGH5678
   Secret Access Key: abcdef1234567890abcdef1234567890abcdef12
   ```

   ❌ **재확인 불가능!** - 한 번 닫으면 다시 볼 수 없습니다.

## 3️⃣ 버킷 생성

1. **R2 Dashboard → "Create bucket"**
2. **버킷 설정**:
   ```
   Bucket name: unsangdong-images
   Location: Automatic (권장)
   ```
3. **"Create bucket" 클릭**

## 4️⃣ Public URL 설정

### 옵션 1: 기본 R2 Public URL

```
https://pub-{random-hash}.r2.dev
```

- 버킷 생성 후 자동 제공
- **R2 Dashboard → 버킷 선택 → "Settings" → Public bucket URL 확인**

### 옵션 2: 커스텀 도메인 (권장)

1. **버킷 → "Settings" → "Custom Domains"**
2. **"Connect Domain" 클릭**
3. **도메인 입력**: `images.unsangdong.com`
4. **DNS 설정**:
   ```
   Type: CNAME
   Name: images
   Content: {bucket-name}.{account-id}.r2.cloudflarestorage.com
   ```
5. **SSL 인증서 자동 생성 대기**

## 5️⃣ 최종 .env 설정 예시

```bash
# Cloudflare R2 설정 - 실제 값으로 교체하세요!
REACT_APP_R2_ACCOUNT_ID=abc123def456ghi789
REACT_APP_R2_ACCESS_KEY_ID=ABCD1234EFGH5678
REACT_APP_R2_SECRET_ACCESS_KEY=abcdef1234567890abcdef1234567890abcdef12
REACT_APP_R2_BUCKET_NAME=unsangdong-images
REACT_APP_R2_PUBLIC_URL=https://images.unsangdong.com
```

## 🔍 설정 확인 방법

### 1. Account ID 확인:

```javascript
// 브라우저 콘솔에서 실행
console.log("Account ID:", process.env.REACT_APP_R2_ACCOUNT_ID);
```

### 2. API 연결 테스트:

```bash
# AWS CLI로 테스트 (선택사항)
aws configure set aws_access_key_id YOUR_ACCESS_KEY_ID
aws configure set aws_secret_access_key YOUR_SECRET_ACCESS_KEY
aws s3 ls --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
```

### 3. 웹 콘솔에서 확인:

- **R2 Dashboard에서 버킷 내용 확인**
- **업로드된 파일들이 올바른 경로에 있는지 확인**

## 🚨 자주 발생하는 문제들

### 1. "Account ID를 찾을 수 없어요!"

- **해결**: Dashboard 새로고침 후 우측 사이드바 확인
- **또는**: URL에서 직접 확인 (`/dash.cloudflare.com/{여기}/`)

### 2. "API 토큰이 작동하지 않아요!"

- **확인사항**:
  - ✅ Access Key ID 정확히 복사했는지
  - ✅ Secret Access Key 정확히 복사했는지
  - ✅ 토큰 권한이 "Object Read & Write"인지
  - ✅ 버킷 제한이 올바른지

### 3. "Public URL에 접근할 수 없어요!"

- **기본 URL**: R2 Dashboard에서 Public bucket URL 확인
- **커스텀 도메인**: DNS 설정 및 SSL 인증서 상태 확인

### 4. "CORS 에러가 발생해요!"

```bash
# wrangler로 CORS 설정 (고급 사용자용)
wrangler r2 object put-cors unsangdong-images --cors-config cors.json
```

## 📞 도움이 필요하시면

1. **Cloudflare Dashboard의 Account ID 스크린샷 공유**
2. **R2 버킷 생성 완료 여부 확인**
3. **API 토큰 생성 시 오류 메시지 공유**

모든 설정이 완료되면 `npm start`로 테스트해보세요! 🚀
