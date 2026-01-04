# 🔧 30일 프로그램 시작일 초기화 가이드

## 🎯 문제 상황

기존 학생이 이미 `programStartDate`를 localStorage에 저장한 경우, 
새로운 시작일(2025-01-05)이 적용되지 않고 기존 날짜가 유지됩니다.

## ✅ 해결 방법

### 방법 1: localStorage 초기화 (권장)

**개발자 도구에서 실행:**

1. F12 → Console 탭
2. 다음 코드 실행:

```javascript
// 프로그램 시작일 초기화
localStorage.setItem('programStartDate', '2025-01-05');

// 개별 학생별 프로그램 시작일 초기화
const currentStudentId = localStorage.getItem('currentStudentId');
if (currentStudentId) {
    localStorage.setItem(`program_start_${currentStudentId}`, '2025-01-05');
}

// 페이지 새로고침
location.reload();
```

### 방법 2: 모든 데이터 초기화 (주의!)

```javascript
// ⚠️ 주의: 모든 학습 기록이 삭제됩니다!
localStorage.clear();
location.reload();
```

### 방법 3: 선택적 초기화

```javascript
// 프로그램 시작일만 삭제하고 나머지 데이터 유지
localStorage.removeItem('programStartDate');

const students = JSON.parse(localStorage.getItem('students') || '[]');
students.forEach(student => {
    localStorage.removeItem(`program_start_${student.id}`);
});

// 페이지 새로고침
location.reload();
```

## 🔍 현재 설정 확인

```javascript
// 현재 프로그램 시작일 확인
console.log('전역 시작일:', localStorage.getItem('programStartDate'));

// 현재 학생의 시작일 확인
const currentStudentId = localStorage.getItem('currentStudentId');
console.log('학생 시작일:', localStorage.getItem(`program_start_${currentStudentId}`));

// 현재 날짜
console.log('오늘 날짜:', new Date().toISOString().split('T')[0]);
```

## 🎯 올바른 출력 예시

```
전역 시작일: 2025-01-05
학생 시작일: 2025-01-05
오늘 날짜: 2025-01-04
```

## 📝 테스트 체크리스트

- [ ] localStorage 초기화 실행
- [ ] 페이지 새로고침
- [ ] 30일 로드맵에서 "시작: 2025-01-05" 확인
- [ ] D-DAY 카운트다운 확인
- [ ] 주차 표시 확인

---

**작성일:** 2026-01-04
**상태:** localStorage 초기화 필요
