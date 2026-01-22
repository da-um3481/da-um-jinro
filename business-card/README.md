# 💜 다움진로진학컨설팅 - 정라미 명함

## 📇 명함 정보

### 기본 정보
- **이름**: 정라미
- **소속**: 다움진로진학컨설팅 (DA.UM Career & Education Consulting)
- **직책**: 진로진학 컨설턴트
- **태그라인**: "학생 한 명 한 명의 꿈을 다움질하다"

### 연락처 정보
- **전화번호**: 010-XXXX-XXXX (수정 필요)
- **이메일**: ramijung@daum.com (수정 필요)
- **주소**: 경북 김천시
- **웹사이트**: www.daum-consulting.com (수정 필요)

---

## 🎨 명함 형식 (3가지)

### 1️⃣ **HTML/CSS 웹 명함** ✅
- **파일**: `index.html`
- **특징**:
  - 인터랙티브 디지털 명함
  - 모바일 반응형 디자인
  - QR 코드 자동 생성
  - 호버 애니메이션 효과
  - 3D 회전 효과
  
- **사용 방법**:
  ```bash
  # 웹 브라우저로 열기
  open index.html
  
  # 또는 로컬 서버로 실행
  python3 -m http.server 8080
  # 접속: http://localhost:8080
  ```

- **기능**:
  - 🖨️ **인쇄**: 인쇄 버튼 클릭 (표준 명함 사이즈 90mm x 50mm)
  - 💾 **이미지 저장**: "이미지 저장" 버튼 클릭 → PNG 다운로드
  - 🔄 **뒤집기**: "뒤집기" 버튼으로 3D 회전 효과

### 2️⃣ **이미지 파일 명함** 🖼️
- **생성된 이미지**: AI로 디자인된 고품질 명함
- **특징**:
  - 해상도: 1376 x 768px
  - 인쇄용 고해상도
  - PNG 형식
  
- **이미지 URL**:
  - 워터마크 없음: https://www.genspark.ai/api/files/s/cUnUGOFO
  - 워터마크 있음: https://www.genspark.ai/api/files/s/3lrXdWmc

- **다운로드 방법**:
  1. 위 URL을 브라우저에서 열기
  2. 우클릭 → "다른 이름으로 저장"
  3. 또는 HTML 웹 명함에서 "이미지 저장" 버튼 클릭

### 3️⃣ **PDF 명함** 📄
- **생성 방법**:
  1. `index.html`을 브라우저로 열기
  2. **인쇄 버튼** 클릭 또는 `Ctrl+P` (Windows) / `Cmd+P` (Mac)
  3. 출력 대상: **PDF로 저장**
  4. 용지 크기: A4 또는 사용자 지정 (90mm x 50mm)
  5. 저장하기

---

## 🎯 디자인 컨셉

### 컬러 팔레트
- **Primary Blue**: `#1E40AF` (진한 파란색)
- **Primary Teal**: `#0D9488` (청록색)
- **Accent Yellow**: `#FBBF24` (노란색)
- **Gradient**: 파란색 → 청록색

### 레이아웃
- **왼쪽 (380px)**: 브랜드 영역
  - DA.UM 로고 💜
  - 회사명
  - 태그라인
  - 그라데이션 배경

- **오른쪽 (520px)**: 연락처 영역
  - 이름 (대형 폰트)
  - 직책
  - 연락처 정보 (아이콘 포함)
  - QR 코드

### 애니메이션
- 로고 플로팅 효과
- 호버 시 3D 회전
- 연락처 항목 호버 효과

---

## 📱 사용 시나리오

### 시나리오 1: 디지털 명함
1. `index.html`을 이메일에 첨부 또는 웹사이트에 호스팅
2. 상대방이 브라우저로 열기
3. QR 코드 스캔 → DA.UM 학생 포털 접속

### 시나리오 2: 인쇄용 명함
1. `index.html` 열기
2. **인쇄 버튼** 클릭
3. PDF로 저장
4. 인쇄소에 전달 (표준 명함 사이즈)

### 시나리오 3: SNS 공유
1. `index.html` 열기
2. **이미지 저장** 버튼 클릭
3. PNG 파일을 SNS에 업로드
4. 프로필 또는 게시물로 공유

---

## 🛠️ 커스터마이징

### 연락처 정보 수정
`index.html` 파일을 텍스트 에디터로 열고 다음 부분을 수정하세요:

```html
<!-- 전화번호 -->
<span>010-XXXX-XXXX</span>

<!-- 이메일 -->
<span>ramijung@daum.com</span>

<!-- 주소 -->
<span>경북 김천시</span>

<!-- 웹사이트 -->
<span>www.daum-consulting.com</span>
```

### QR 코드 URL 변경
```javascript
// QR 코드 생성 부분
const qrcode = new QRCode(document.getElementById("qrcode"), {
    text: "https://your-website.com", // 여기를 수정
    width: 100,
    height: 100,
    // ...
});
```

### 컬러 변경
CSS `:root` 변수를 수정하세요:

```css
:root {
    --primary-blue: #1E40AF;    /* 메인 파란색 */
    --primary-teal: #0D9488;    /* 청록색 */
    --accent-yellow: #FBBF24;   /* 노란색 */
}
```

---

## 📋 체크리스트

### 배포 전 확인사항
- [ ] 이름 확인
- [ ] 전화번호 수정
- [ ] 이메일 수정
- [ ] 주소 확인
- [ ] 웹사이트 URL 수정
- [ ] QR 코드 URL 수정
- [ ] 인쇄 테스트
- [ ] 모바일 반응형 테스트

---

## 🚀 배포 방법

### GitHub Pages 배포
```bash
# 1. Git 저장소 초기화
cd /home/user/webapp/business-card
git init

# 2. 파일 추가 및 커밋
git add .
git commit -m "💜 다움진로진학컨설팅 정라미 명함 추가"

# 3. GitHub 저장소 생성 후 푸시
git remote add origin https://github.com/your-username/business-card.git
git push -u origin main

# 4. GitHub Pages 설정
# Settings → Pages → Source: main branch
```

### 접속 URL
```
https://your-username.github.io/business-card/
```

---

## 📞 문의사항

명함 디자인 수정이나 추가 요청 사항이 있으시면 알려주세요!

---

## 📄 라이선스

이 명함 디자인은 **다움진로진학컨설팅**의 브랜드 자산입니다.

---

**제작일**: 2026-01-22  
**버전**: 1.0  
**제작**: DA.UM Development Team
