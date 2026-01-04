# 🔍 교사 피드백 시스템 연동 확인 가이드

## 📊 시스템 구조

```
교사 대시보드 → Google Sheets → 학생 포털
   (작성)        (teacher_feedback)    (표시)
```

## ✅ 구현 상태

### 1. Google Apps Script (Apps Script) ✅
- **저장**: `saveFeedback()` - Line 191-220
- **조회**: `getFeedback()` - Line 255-293
- **시트**: `teacher_feedback`
- **컬럼**: student_id, student_name, date, feedback_type, content, is_read, timestamp

### 2. API 연동 (google-sheets-api.js) ✅
- **저장**: `saveTeacherFeedbackToCloud()` - Line 135-169
- **조회**: `getTeacherFeedbackFromCloud()` - Line 209-229
- **URL**: `https://script.google.com/macros/s/AKfycbxCRKmOjkjEbSPkpjzb_RF6c-o3g9GsvHBMjFzu2YxLbac7nK_MwV2AT5VYfzFR7aP7MQ/exec`

### 3. 학생 포털 (geunhwa-student-portal.html) ✅
- **로드 함수**: `loadTeacherFeedbacks()` - Line 7401-7477
- **알림 함수**: `showFeedbackNotification()` - Line 7479-7525
- **HTML 컨테이너**: `<div id="feedbackContainer">` - Line 1416
- **자동 갱신**: 30초마다 (Line 7525)

---

## 🧪 테스트 절차

### Step 1: Google Sheets 확인

1. Google Sheets 열기
2. `teacher_feedback` 탭 찾기
3. 데이터 확인:
   ```
   A열: student_id (예: student_176752)
   B열: student_name (예: 이나연)
   C열: date (예: 2026-01-04)
   D열: feedback_type (예: encouragement)
   E열: content (피드백 내용)
   F열: is_read (false/true)
   G열: timestamp
   ```

### Step 2: 학생 포털 디버깅

#### 2-1. 콘솔 로그 확인
1. 학생 포털 접속
2. F12 → Console 열기
3. 다음 로그 확인:
   ```javascript
   ✅ Google Sheets에서 교사 피드백 로드: [...]
   ```
   또는
   ```javascript
   📦 localStorage에서 교사 피드백 로드: [...]
   ```

#### 2-2. 수동 테스트
Console에서 다음을 실행:

```javascript
// 현재 학생 ID 확인
const studentId = localStorage.getItem('currentStudentId');
console.log('학생 ID:', studentId);

// 피드백 수동 조회
getTeacherFeedbackFromCloud(studentId).then(result => {
    console.log('피드백 조회 결과:', result);
});

// 피드백 수동 로드
loadTeacherFeedbacks();
```

#### 2-3. 예상 결과

**성공**:
```javascript
✅ 선생님 피드백을 불러왔습니다: {
    status: 'success',
    data: [
        {
            student_id: 'student_176752',
            student_name: '이나연',
            date: '2026-01-04',
            feedback_type: 'encouragement',
            content: '오늘 학습 정말 잘했어요!',
            is_read: false,
            timestamp: '2026-01-04T12:30:00.000Z'
        }
    ]
}
```

**실패 - 데이터 없음**:
```javascript
✅ 선생님 피드백을 불러왔습니다: {
    status: 'success',
    data: []
}
```

**실패 - 에러**:
```javascript
❌ 피드백 조회 실패: Error: ...
```

---

## 🔧 문제 해결

### 문제 1: "아직 선생님 피드백이 없습니다" 표시

#### 원인 A: student_id 불일치
Google Sheets의 `student_id`와 localStorage의 `currentStudentId`가 다름

**확인 방법**:
```javascript
// Console에서 실행
console.log('학생 ID:', localStorage.getItem('currentStudentId'));
```

Google Sheets 확인:
```
A열 student_id: student_176752
```

→ 동일해야 함!

#### 원인 B: Google Sheets에 데이터 없음
`teacher_feedback` 시트가 비어있음

**해결**:
1. 교사 대시보드에서 피드백 작성
2. Google Sheets 확인
3. 학생 포털 새로고침

#### 원인 C: Apps Script URL 문제
Apps Script가 배포되지 않았거나 URL이 잘못됨

**확인**:
```javascript
// Console에서 실행
console.log('Apps Script URL:', GOOGLE_SHEETS_CONFIG.WEB_APP_URL);
```

**예상 결과**:
```
https://script.google.com/macros/s/AKfycbx.../exec
```

---

### 문제 2: "피드백을 불러오는데 실패했습니다" 표시

#### 원인: Apps Script 호출 실패

**디버깅**:
```javascript
// Console에서 수동 호출
fetch('https://script.google.com/macros/s/AKfycbxCRKmOjkjEbSPkpjzb_RF6c-o3g9GsvHBMjFzu2YxLbac7nK_MwV2AT5VYfzFR7aP7MQ/exec?action=getFeedback&student_id=student_176752')
    .then(r => r.json())
    .then(data => console.log('응답:', data))
    .catch(err => console.error('에러:', err));
```

**예상 응답**:
```json
{
    "status": "success",
    "data": [...]
}
```

---

### 문제 3: 실시간 알림이 안 나타남

#### 원인: 30초 자동 갱신 동작 안 함

**확인**:
```javascript
// Console에서 확인
console.log('자동 갱신:', GOOGLE_SHEETS_CONFIG.AUTO_SYNC);
console.log('갱신 간격:', GOOGLE_SHEETS_CONFIG.SYNC_INTERVAL, 'ms');
```

**예상 결과**:
```
자동 갱신: true
갱신 간격: 30000 ms
```

**수동 테스트**:
1. 교사 대시보드에서 피드백 작성
2. **30초 대기**
3. 학생 포털에서 자동으로 알림 표시되어야 함

---

## 🎯 빠른 테스트 스크립트

### 교사 대시보드에서 실행 (F12 → Console)

```javascript
// 테스트 피드백 생성
const testFeedback = {
    student_id: 'student_176752',  // ← 실제 학생 ID로 변경
    student_name: '이나연',         // ← 실제 학생 이름으로 변경
    date: new Date().toISOString().split('T')[0],
    feedback_type: 'encouragement',
    content: '🎉 테스트 피드백입니다! 잘하고 있어요!'
};

// 저장
saveTeacherFeedbackToCloud(testFeedback).then(result => {
    console.log('저장 결과:', result);
});
```

### 학생 포털에서 실행 (F12 → Console)

```javascript
// 현재 학생 ID 확인
const studentId = localStorage.getItem('currentStudentId');
console.log('현재 학생 ID:', studentId);

// 피드백 강제 로드
loadTeacherFeedbacks();

// 5초 후 컨테이너 확인
setTimeout(() => {
    const container = document.getElementById('feedbackContainer');
    console.log('컨테이너 내용:', container.innerHTML);
}, 5000);
```

---

## 📋 체크리스트

### 교사 대시보드
- [ ] 피드백 작성 폼이 있음
- [ ] `saveTeacherFeedbackToCloud` 함수 호출됨
- [ ] Console에 "✅ 선생님 피드백이 클라우드에 저장되었습니다" 로그

### Google Sheets
- [ ] `teacher_feedback` 시트 존재
- [ ] 헤더 행: student_id, student_name, date, feedback_type, content, is_read, timestamp
- [ ] 데이터 행 추가됨
- [ ] student_id가 정확함

### 학생 포털
- [ ] `feedbackContainer` 요소 존재 (Line 1416)
- [ ] `loadTeacherFeedbacks()` 함수 호출됨 (페이지 로드 시)
- [ ] Console에 "✅ Google Sheets에서 교사 피드백 로드" 로그
- [ ] 피드백 카드가 화면에 표시됨

---

## 💡 즉시 해결 방법

### 방법 1: 강제 새로고침
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### 방법 2: Console에서 수동 로드
```javascript
loadTeacherFeedbacks();
```

### 방법 3: 학생 ID 확인
```javascript
// 학생 포털
console.log('학생 ID:', localStorage.getItem('currentStudentId'));

// Google Sheets의 student_id와 일치해야 함!
```

---

## 🚀 테스트 시나리오 (전체)

### 시나리오 1: 교사 → 학생 피드백 흐름

1. **교사 대시보드**
   - 피드백 작성: "오늘 수학 학습 정말 잘했어요! 👍"
   - 저장 버튼 클릭
   - Console 확인: "✅ 선생님 피드백이 클라우드에 저장되었습니다"

2. **Google Sheets**
   - `teacher_feedback` 탭 열기
   - 마지막 행 확인:
     - student_id: student_176752
     - content: "오늘 수학 학습 정말 잘했어요! 👍"

3. **학생 포털**
   - 학생으로 로그인 (ID: student_176752)
   - 페이지 새로고침
   - "선생님 피드백" 섹션에 카드 표시
   - 내용: "🎉 선생님 피드백" + "오늘 수학 학습 정말 잘했어요! 👍"

### 시나리오 2: 실시간 알림 테스트

1. **학생 포털 열어두기** (로그인 상태)
2. **교사 대시보드에서 새 피드백 작성**
3. **30초 이내 학생 포털 확인**
   - 우측 상단에 알림 배너 표시
   - "💌 새로운 선생님 피드백!"
   - 알림음 재생 (선택사항)
   - 5초 후 자동으로 사라짐

---

## 📞 추가 지원

문제가 계속되면:

1. **스크린샷 공유**
   - 교사 대시보드 피드백 작성 화면
   - Google Sheets `teacher_feedback` 탭
   - 학생 포털 Console 로그
   - 학생 포털 피드백 섹션

2. **학생 ID 확인**
   ```javascript
   localStorage.getItem('currentStudentId')
   ```

3. **피드백 데이터 확인**
   ```javascript
   getTeacherFeedbackFromCloud(localStorage.getItem('currentStudentId')).then(console.log)
   ```

---

**작성일**: 2026-01-04  
**버전**: v2.0.1  
**상태**: 완전 구현 완료 ✅
