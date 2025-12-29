# 🎨 DA.UM 통합 디자인 시스템 가이드

## ✅ 완료! 세련된 그린/회색 톤 전문 디자인 적용

---

## 🎯 **디자인 철학**

> **"자연스럽고 전문적인, 신뢰할 수 있는 교육 플랫폼"**

- **그린**: 성장, 활력, 학습
- **회색**: 전문성, 세련됨, 안정감
- **조화**: 자연스러운 그라데이션과 부드러운 전환

---

## 🎨 **브랜드 컬러 시스템**

### **Primary Green Colors**
```css
--primary-500: #22c55e  /* 메인 그린 */
--primary-600: #16a34a  /* 진한 그린 */
--primary-700: #15803d  /* 더 진한 그린 */
```

### **Gray Scale**
```css
--gray-50: #f9fafb    /* 배경 */
--gray-100: #f3f4f6   /* 카드 배경 */
--gray-500: #6b7280   /* 텍스트 보조 */
--gray-900: #111827   /* 텍스트 메인 */
```

### **Gradients**
```css
--gradient-primary: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
--gradient-secondary: linear-gradient(135deg, #4b5563 0%, #6b7280 50%, #9ca3af 100%);
```

---

## 📦 **적용된 페이지**

### **✅ 1. index.html (메인 대시보드)**
- Hero Section with Green Gradient
- Animated Statistics Cards
- Program Cards with Hover Effects
- Unified Navigation

### **✅ 2. students.html (학생 관리)**
- Green Header Design
- Clean Table Layout
- Form Elements with Green Accent
- Action Buttons with Icons

### **✅ 3. winter-student-portal.html (겨울방학 포털)**
- Integrated Design System CSS
- Green Navigation
- Consistent Card Styles
- Mobile Responsive

---

## 🔧 **사용 방법**

### **1. CSS 파일 추가**
```html
<link rel="stylesheet" href="css/design-system.css">
```

### **2. 헤더 적용**
```html
<header class="daum-header">
    <div class="daum-header-container">
        <div class="daum-logo-section">
            <div class="daum-logo">
                <img src="images/daum-logo-transparent.png" alt="DA.UM Logo">
            </div>
            <div class="daum-title">
                <h1>페이지 제목</h1>
                <p>부제목</p>
            </div>
        </div>
        <nav class="daum-nav">
            <a href="#" class="daum-nav-link active">메뉴1</a>
            <a href="#" class="daum-nav-link">메뉴2</a>
        </nav>
    </div>
</header>
```

### **3. 카드 레이아웃**
```html
<div class="daum-card">
    <div class="daum-card-header">
        <h2 class="daum-card-title">
            <i class="fas fa-icon"></i> 제목
        </h2>
    </div>
    <!-- 카드 내용 -->
</div>
```

### **4. 버튼**
```html
<button class="daum-btn daum-btn-primary">
    <i class="fas fa-save"></i> 저장
</button>

<button class="daum-btn daum-btn-secondary">
    취소
</button>
```

---

## 🎯 **핵심 클래스**

### **레이아웃**
- `.daum-container` - 최대 1400px 컨테이너
- `.daum-grid` - 그리드 레이아웃
- `.daum-grid-2` - 2열 그리드
- `.daum-grid-3` - 3열 그리드

### **카드**
- `.daum-card` - 기본 카드
- `.daum-glass-card` - 글래스모피즘 카드
- `.daum-card-header` - 카드 헤더
- `.daum-card-title` - 카드 제목

### **버튼**
- `.daum-btn` - 기본 버튼
- `.daum-btn-primary` - 메인 그린 버튼
- `.daum-btn-secondary` - 회색 버튼
- `.daum-btn-outline` - 아웃라인 버튼

### **폼**
- `.daum-input` - 입력 필드
- `.daum-select` - 선택 박스
- `.daum-textarea` - 텍스트 영역
- `.daum-label` - 레이블

### **배지**
- `.daum-badge` - 기본 배지
- `.daum-badge-success` - 성공 (그린)
- `.daum-badge-warning` - 경고 (노랑)
- `.daum-badge-error` - 에러 (빨강)

### **애니메이션**
- `.daum-animate-slide-up` - 슬라이드업
- `.daum-animate-fade-in` - 페이드인

---

## 📱 **반응형 디자인**

### **Breakpoints**
- **Desktop**: > 768px
- **Tablet**: ≤ 768px
- **Mobile**: ≤ 480px

### **자동 적용**
- 네비게이션: 모바일에서 수직 스택
- 그리드: 모바일에서 1열
- 폰트: 자동 크기 조정
- 패딩/마진: 반응형 조정

---

## 🎨 **디자인 예시**

### **1. 프로그램 카드**
```html
<div class="program-card">
    <div class="program-header">
        <div class="program-icon">
            <i class="fas fa-graduation-cap"></i>
        </div>
        <h2 class="program-title">프로그램명</h2>
    </div>
    <div class="menu-list">
        <a href="#" class="menu-item">
            <i class="fas fa-book"></i>
            <div>
                메뉴 제목
                <span class="menu-desc">설명</span>
            </div>
        </a>
    </div>
</div>
```

### **2. 통계 카드**
```html
<div class="stat-card">
    <span class="stat-number">100</span>
    <span class="stat-label">등록 학생</span>
</div>
```

### **3. 공지사항 배너**
```html
<div class="notice-banner">
    <div class="notice-icon">📢</div>
    <div class="notice-text">
        <h3>공지 제목</h3>
        <p>공지 내용</p>
    </div>
</div>
```

---

## 🚀 **배포 정보**

| 항목 | 정보 |
|------|------|
| **Repository** | https://github.com/da-um3481/da-um-jinro |
| **Branch** | `main` |
| **Latest Commit** | `43c8ff6` |
| **Commit Message** | "🎨 통일된 그린/회색 디자인 시스템 적용 - 세련되고 전문적인 UI/UX" |
| **변경 파일** | `css/design-system.css`, `index.html`, `students.html`, `winter-student-portal.html` |
| **배포 날짜** | 2025-12-19 |

---

## 📋 **TODO: 나머지 페이지 적용**

### **우선순위 높음**
- [ ] schools-management.html
- [ ] materials.html
- [ ] lessons.html
- [ ] geunhwa-student-portal.html

### **우선순위 보통**
- [ ] weekly-schedule.html
- [ ] feedback.html
- [ ] report.html
- [ ] parent-portal.html

### **우선순위 낮음**
- [ ] 기타 마케팅/제안서 페이지

---

## 🎯 **적용 가이드 (다른 페이지)**

### **Step 1: CSS 파일 추가**
```html
<head>
    ...
    <link rel="stylesheet" href="css/design-system.css">
</head>
```

### **Step 2: 헤더 교체**
기존 헤더를 `daum-header` 클래스로 교체

### **Step 3: 컨테이너 적용**
```html
<div class="daum-container">
    <!-- 기존 내용 -->
</div>
```

### **Step 4: 카드 스타일 적용**
기존 카드를 `daum-card`로 교체

### **Step 5: 버튼 스타일 적용**
기존 버튼을 `daum-btn` 클래스로 교체

### **Step 6: 푸터 교체**
```html
<footer class="daum-footer">
    <!-- 푸터 내용 -->
</footer>
```

---

## 🎨 **디자인 장점**

### **1. 통일성**
- 모든 페이지에서 일관된 디자인
- 브랜드 아이덴티티 강화
- 사용자 경험 향상

### **2. 전문성**
- 그린/회색의 세련된 조합
- 깔끔한 레이아웃
- 명확한 정보 계층

### **3. 현대성**
- 글래스모피즘 효과
- 부드러운 애니메이션
- 반응형 디자인

### **4. 접근성**
- 고대비 컬러
- 명확한 버튼
- 큰 터치 영역

---

## 📞 **문의**

**DA.UM 진로컨설팅**
📱 010-2657-3481

---

**🎉 통일된 디자인 시스템으로 프로페셔널한 플랫폼 완성!** 💚
