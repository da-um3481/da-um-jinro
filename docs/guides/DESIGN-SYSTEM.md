# 🎨 DA.UM 디자인 시스템

겨울방학 30일 프로그램을 위한 통일된 디자인 언어

---

## 🌈 색상 팔레트

### Primary Colors (메인 색상)
```css
/* 청록-남색 그라데이션 - 메인 브랜드 컬러 */
background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%);
```

**사용처:**
- 페이지 배경
- 주요 버튼
- 헤더 배경
- 중요 강조 요소

**색상 코드:**
- Cyan 500: `#0ea5e9`
- Sky 600: `#0284c7`
- Sky 700: `#0369a1`

### Secondary Colors (보조 색상)
```css
/* 보라-분홍 그라데이션 - 홍보/특별 기능 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**사용처:**
- 홍보 페이지 hero 섹션
- CTA 버튼 강조
- 특별 알림

**색상 코드:**
- 보라: `#667eea`
- 진보라: `#764ba2`

### Accent Colors (강조 색상)

#### Success (성공/완료)
- 초록: `#10b981` (Emerald 500)
- 연초록: `#34d399` (Emerald 400)

#### Warning (경고/주의)
- 노랑: `#fbbf24` (Amber 400)
- 주황: `#f59e0b` (Amber 500)

#### Error (오류/삭제)
- 빨강: `#ef4444` (Red 500)
- 진빨강: `#dc2626` (Red 600)

#### Info (정보)
- 파랑: `#3b82f6` (Blue 500)
- 하늘: `#60a5fa` (Blue 400)

---

## 📝 타이포그래피

### 폰트 패밀리
```css
font-family: 'Noto Sans KR', sans-serif;
```

### 폰트 크기

#### 제목
- `text-6xl`: 3.75rem (60px) - Hero 타이틀
- `text-5xl`: 3rem (48px) - 섹션 메인 타이틀
- `text-4xl`: 2.25rem (36px) - 서브 타이틀
- `text-3xl`: 1.875rem (30px) - 카드 타이틀
- `text-2xl`: 1.5rem (24px) - 작은 제목
- `text-xl`: 1.25rem (20px) - 강조 텍스트

#### 본문
- `text-base`: 1rem (16px) - 기본 본문
- `text-sm`: 0.875rem (14px) - 작은 본문
- `text-xs`: 0.75rem (12px) - 보조 정보

### 폰트 굵기
- `font-black`: 900 - 가장 굵은 타이틀
- `font-bold`: 700 - 강조 제목
- `font-semibold`: 600 - 중간 강조
- `font-medium`: 500 - 일반 강조
- `font-normal`: 400 - 기본 텍스트

---

## 📐 간격 및 여백

### Spacing Scale
- `p-2`: 0.5rem (8px)
- `p-4`: 1rem (16px)
- `p-6`: 1.5rem (24px)
- `p-8`: 2rem (32px)
- `p-10`: 2.5rem (40px)
- `p-12`: 3rem (48px)

### 컴포넌트별 권장 간격

#### 섹션 간격
```css
padding: 6rem 0; /* py-24 */
```

#### 카드 내부
```css
padding: 1.5rem; /* p-6 ~ p-8 */
```

#### 버튼 내부
```css
padding: 0.75rem 1.5rem; /* py-3 px-6 */
```

---

## 🎨 컴포넌트 스타일

### Glass Effect (유리 효과)
```css
.glass-effect {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Card Hover (카드 호버)
```css
.card-hover {
    transition: all 0.3s ease;
}

.card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
```

### Gradient Button (그라데이션 버튼)
```css
/* Primary 버튼 */
.btn-primary {
    background: linear-gradient(to right, #0ea5e9, #0284c7);
    color: white;
    border-radius: 0.75rem; /* rounded-xl */
    padding: 0.75rem 1.5rem;
    font-weight: 700;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Secondary 버튼 */
.btn-secondary {
    background: linear-gradient(to right, #667eea, #764ba2);
    color: white;
    border-radius: 0.75rem;
    padding: 0.75rem 1.5rem;
    font-weight: 700;
}
```

### Border Radius (모서리 둥글기)
- `rounded-lg`: 0.5rem (8px) - 작은 요소
- `rounded-xl`: 0.75rem (12px) - 카드, 버튼
- `rounded-2xl`: 1rem (16px) - 큰 카드
- `rounded-3xl`: 1.5rem (24px) - Hero 섹션
- `rounded-full`: 9999px - 원형 버튼, 배지

---

## 📄 페이지별 색상 적용

### 홍보 페이지 (winter-30days.html)
- **배경**: 보라-분홍 그라데이션
- **주요 버튼**: 흰색 배경 + 보라 텍스트
- **보조 버튼**: 노란색 배경
- **강조**: 노란색, 초록색

### 관리자 페이지
#### Teacher Dashboard (teacher-dashboard.html)
- **배경**: 청록-남색 그라데이션
- **헤더**: 유리 효과
- **통계 카드**: 다양한 색상 (파랑, 초록, 보라, 주황)

#### 학습 대시보드 (winter-index.html)
- **배경**: 청록-남색 그라데이션
- **주요 버튼**: 청록-파랑 그라데이션
- **Week 카드**: 청록 계열

### 학생 페이지
#### 학생 포털 (winter-student-portal.html)
- **배경**: 청록-남색 그라데이션
- **과목별 색상**:
  - 수학: 파랑 (`#3b82f6`)
  - 영어: 초록 (`#10b981`)
  - 국어: 빨강 (`#ef4444`)
  - 과학: 보라 (`#8b5cf6`)
  - 사회: 노랑 (`#f59e0b`)

### 관리 페이지
- **배경**: 청록-남색 그라데이션
- **표 헤더**: 청록 계열
- **액션 버튼**: 색상별 의미 구분
  - 추가: 초록
  - 수정: 파랑
  - 삭제: 빨강

---

## 🎭 애니메이션

### Fade In
```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

### Float
```css
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}
```

### Pulse Glow
```css
@keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.5); }
    50% { box-shadow: 0 0 40px rgba(14, 165, 233, 0.8); }
}
```

---

## 🎯 사용 가이드라인

### DO ✅
- 청록-남색 그라데이션을 메인 브랜드 컬러로 사용
- 일관된 둥근 모서리 (rounded-xl, rounded-2xl)
- Glass effect로 깔끔한 카드 디자인
- 의미 있는 색상 사용 (초록=성공, 빨강=경고)
- 충분한 여백으로 시각적 여유

### DON'T ❌
- 너무 많은 색상을 한 화면에 사용
- 일관성 없는 그라데이션 방향
- 과도한 애니메이션
- 작은 텍스트에 낮은 대비
- 불규칙한 간격

---

## 📱 반응형 디자인

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### 모바일 우선 접근
```css
/* Mobile first */
.element { padding: 1rem; }

/* Tablet and above */
@media (min-width: 768px) {
    .element { padding: 2rem; }
}
```

---

## 🔧 유지보수

### 색상 변경 시
1. 이 문서의 색상 코드 업데이트
2. 모든 페이지의 그라데이션 통일 확인
3. 버튼 및 강조 요소 일관성 체크

### 새 페이지 추가 시
1. 메인 배경: 청록-남색 그라데이션 사용
2. Glass effect 헤더 적용
3. 이 디자인 시스템의 컴포넌트 재사용

---

**✨ 일관된 디자인으로 전문적인 브랜드 이미지 유지**
