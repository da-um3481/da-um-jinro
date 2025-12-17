# 🎯 GitHub에 업로드할 파일 목록

## ⭐ 최우선 파일 (꼭 업로드!)

### 1. 학생 포털 (학생들이 사용)
- `winter-student-portal.html` ⭐⭐⭐ (겨울방학 30일 - 1월 2일 사용!)
- `student-portal.html` (일반 100일 프로그램)

### 2. 관리자 대시보드 (정라미님이 사용)
- `winter-index.html` (겨울방학 관리)
- `index.html` (일반 관리)
- `students.html` (학생 관리)
- `students-bulk-upload.html` ⭐ (엑셀 일괄등록 - 중요!)
- `schools-management.html` (학교 관리)

### 3. 기타 관리 페이지
- `winter-weekly-schedule.html` (주간 일정)
- `feedback.html` (피드백)
- `report.html` (리포트)
- `lessons.html` (수업 관리)
- `materials.html` (교재 관리)

---

## 📁 필수 폴더 (폴더째로 업로드!)

### js 폴더
이 폴더 안에 있는 모든 .js 파일들이 필요해요!
- 시스템 작동에 필수!

### css 폴더  
이 폴더 안에 있는 모든 .css 파일들
- 디자인/스타일링에 필요!

---

## 📄 가이드 문서 (선택사항)

- `컴맹을_위한_GitHub_완전정복.html`
- `여러학교_동시관리_가이드.html`
- `엑셀로_학생등록_완전초보가이드.html`
- `README.md`

---

## 🚨 업로드 순서 (중요!)

1. **먼저 폴더 만들기**: `js`, `css` 폴더를 GitHub에 먼저 만들기
2. **폴더 안에 파일 넣기**: js 파일들은 js 폴더에, css 파일들은 css 폴더에
3. **HTML 파일 업로드**: 위의 HTML 파일들을 루트(최상위)에 올리기

---

## ✅ 최종 구조 (GitHub에서 이렇게 보여야 함)

```
daum-system/
├── index.html
├── winter-student-portal.html
├── student-portal.html
├── students.html
├── students-bulk-upload.html
├── schools-management.html
├── winter-index.html
├── js/
│   ├── dashboard.js
│   ├── students.js
│   ├── student-portal.js
│   └── (기타 js 파일들)
└── css/
    └── (css 파일들)
```

---

## 💡 팁

- 파일 이름에 **한글 있으면** 영어로 바꾸는 게 좋아요
- 폴더 구조 그대로 유지해야 작동해요!
- **js 폴더가 없으면** 시스템이 작동 안 해요!
