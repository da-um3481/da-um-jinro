# 🐛 버그 수정: 10초마다 Google Sheets 중복 저장 방지

## 📋 문제 발견

**사용자 보고:**
> "H열이 왜 10초마다 행을 표시하지?"

### 증상
- `study_records` 시트에 **10초마다 새로운 행이 생성됨**
- 같은 학생, 같은 과목, 같은 날짜에 수십 개의 중복 행
- 예시:
  ```
  206행: 2026-01-04T11:49:27.302Z
  207행: 2026-01-04T11:49:37.436Z (10초 후)
  208행: 2026-01-04T11:49:47.639Z (10초 후)
  209행: 2026-01-04T11:49:57.837Z (10초 후)
  ...
  ```

## 🔍 원인 분석

### 문제 코드

#### 1. 타이머 실행 중 (startTimer 함수)
```javascript
// 라인 2867-2875
timers[subject].interval = setInterval(() => {
    timers[subject].seconds++;
    updateTimerDisplay(subject);
    updateProgressBar(subject);
    
    // 🆕 10초마다 자동 저장 (재로그인 대비)
    if (timers[subject].seconds % 10 === 0) {
        saveTodayStudyTime(subject, timers[subject].seconds);  // ← 10초마다 호출!
    }
}, 1000);
```

#### 2. saveTodayStudyTime 함수
```javascript
// 라인 2728-2739
function saveTodayStudyTime(subject, totalSeconds) {
    // localStorage 저장...
    
    // ⚠️ 문제: 10초마다 Google Sheets에 저장!
    if (typeof saveStudyRecordToCloud === 'function') {
        saveStudyRecordToCloud({
            student_id: studentId,
            student_name: localStorage.getItem('currentStudentName'),
            date: today,
            subject: subject,
            study_time: Math.floor(totalSeconds / 60),
            progress: todayRecord.subjects[subject].textbook || '-',
            content: todayRecord.subjects[subject].content || '학습 진행 중'
        }).catch(err => console.warn('⚠️ 클라우드 저장 실패 (로컬은 저장됨):', err));
    }
}
```

### 문제 흐름

```
타이머 시작 (14:30:00)
   ↓
10초마다 saveTodayStudyTime() 호출
   ↓
매번 saveStudyRecordToCloud() 실행
   ↓
Google Sheets에 새로운 행 추가
   ↓
45분 학습 = 270개 행 생성! 😱
```

## ✅ 해결 방법

### Before (문제 코드)

```javascript
function saveTodayStudyTime(subject, totalSeconds) {
    // localStorage 저장
    localStorage.setItem('study_records', JSON.stringify(studyRecords));
    
    // ⚠️ 문제: 10초마다 Google Sheets 저장!
    if (typeof saveStudyRecordToCloud === 'function') {
        saveStudyRecordToCloud({
            student_id: studentId,
            student_name: localStorage.getItem('currentStudentName'),
            date: today,
            subject: subject,
            study_time: Math.floor(totalSeconds / 60),
            progress: todayRecord.subjects[subject].textbook || '-',
            content: todayRecord.subjects[subject].content || '학습 진행 중'
        }).catch(err => console.warn('⚠️ 클라우드 저장 실패 (로컬은 저장됨):', err));
    }
}
```

### After (수정 코드)

```javascript
function saveTodayStudyTime(subject, totalSeconds) {
    // localStorage 저장
    localStorage.setItem('study_records', JSON.stringify(studyRecords));
    
    // activeSubject도 저장
    localStorage.setItem('activeSubject', activeSubject || '');
    
    // ✅ Google Sheets 자동 저장 제거 (타이머 완료 시에만 저장)
    // 10초마다 localStorage에만 저장하고, 클라우드는 stopTimer()에서 저장
}
```

### 새로운 데이터 흐름

```
타이머 실행 중:
   ↓
10초마다 saveTodayStudyTime() 호출
   ↓
localStorage에만 저장 (재로그인 대비)
   ↓
Google Sheets 저장 없음
   ↓
타이머 완료 (stopTimer):
   ↓
saveStudyRecordToCloud() 1번만 실행
   ↓
시작 시간, 종료 시간, 학습 시간 포함
   ↓
Google Sheets에 1개 행만 추가 ✅
```

## 📊 개선 효과

### Before (문제 상황)

**45분 학습 시:**
```
Google Sheets 저장 횟수: 270번 (10초마다)
생성된 행 수: 270개
데이터 크기: 불필요하게 증가
쿼터 사용: 과도
```

### After (수정 후)

**45분 학습 시:**
```
Google Sheets 저장 횟수: 1번 (완료 시)
생성된 행 수: 1개
데이터 크기: 최적화
쿼터 사용: 정상
```

### 비교표

| 항목 | Before | After | 개선율 |
|------|--------|-------|--------|
| 저장 횟수 | 270번 | 1번 | **99.6% 감소** |
| 생성 행 수 | 270개 | 1개 | **99.6% 감소** |
| API 호출 | 과다 | 최소 | **99.6% 감소** |
| 데이터 품질 | 중복 많음 | 깔끔 | **100% 개선** |

## 🔧 기술적 상세

### localStorage 자동 저장 (유지)

**목적:** 브라우저 새로고침이나 재로그인 시 학습 시간 복원

**빈도:** 10초마다

**저장 위치:** 브라우저 localStorage

**데이터:**
```javascript
{
  student_id: "student_176752",
  date: "2026-01-04",
  subjects: {
    "국어": {
      time: 3,  // 3분 경과 (10초 * 18 = 180초)
      isRunning: true,
      last_update: "2026-01-04T14:33:00Z"
    }
  }
}
```

### Google Sheets 저장 (완료 시 1번)

**목적:** 최종 학습 기록 저장 및 분석

**빈도:** 타이머 완료 시 1번

**저장 위치:** Google Sheets (study_records 시트)

**데이터:**
```javascript
{
  student_id: "student_176752",
  student_name: "이나연",
  date: "2026-01-04",
  subject: "국어",
  start_time: "14:30:00",
  end_time: "15:15:30",
  study_duration: "45분 30초",
  progress: "약속 진행 중",
  content: "학습 완료"
}
```

## 🧪 테스트 시나리오

### 시나리오 1: 정상 학습 완료

**단계:**
1. 학생 포털 접속
2. 국어 과목 선택
3. 타이머 시작 (14:30:00)
4. 45분 학습
5. 완료 버튼 클릭 (15:15:30)

**예상 결과:**
```
localStorage:
- 10초마다 업데이트 (270번)
- 최종 시간: 45분 30초

Google Sheets:
- 저장 횟수: 1번
- 생성 행 수: 1개
- start_time: 14:30:00
- end_time: 15:15:30
- study_duration: 45분 30초
```

### 시나리오 2: 브라우저 새로고침

**단계:**
1. 타이머 시작 (14:30:00)
2. 20분 경과 (14:50:00)
3. 브라우저 새로고침 (F5)
4. 페이지 재로드
5. 타이머 자동 복원
6. 25분 더 학습 (총 45분)
7. 완료 버튼 클릭 (15:15:00)

**예상 결과:**
```
localStorage:
- 새로고침 전: 20분 저장됨
- 새로고침 후: 20분부터 시작
- 최종: 45분

Google Sheets:
- 저장 횟수: 1번 (완료 시)
- start_time: 14:30:00 (원래 시작 시간)
- end_time: 15:15:00
- study_duration: 45분 0초
```

### 시나리오 3: 중간에 포기

**단계:**
1. 타이머 시작 (14:30:00)
2. 15분 경과 (14:45:00)
3. 완료 버튼 클릭 시도
4. ⚠️ "최소 30분 필요" 경고
5. 타이머 계속 실행

**예상 결과:**
```
localStorage:
- 15분 저장됨
- 타이머 계속 실행 중

Google Sheets:
- 저장 없음 (완료하지 않음)
```

## 🚀 배포 정보

### Commit 정보
- **Commit Hash:** `0b6c38a`
- **Branch:** `main`
- **Date:** 2026-01-04
- **Message:** "🐛 수정: 10초마다 Google Sheets 저장 방지"

### 변경 파일
```
geunhwa-student-portal.html:
  - saveTodayStudyTime(): Google Sheets 저장 코드 제거 (-12 lines)
  - stopTimer(): 시작/종료 시간 포함 저장 (기존 유지)
```

### 변경 통계
```
2 files changed
419 insertions(+)
12 deletions(-)
```

### 배포 상태
- ✅ GitHub Pages 배포 완료
- ✅ 실시간 반영 완료

### 테스트 URL
```
https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal.html
```

## 📝 주의사항

### 기존 중복 데이터 정리

이미 생성된 중복 행은 자동으로 삭제되지 않습니다. 수동으로 정리가 필요합니다:

#### 옵션 1: 수동 삭제
1. Google Sheets 열기
2. `study_records` 탭 선택
3. 10초 간격 중복 행 선택
4. 우클릭 → 행 삭제

#### 옵션 2: Apps Script로 자동 정리

```javascript
function cleanupDuplicateRecords() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const studySheet = sheet.getSheetByName('study_records');
  
  const data = studySheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  // 학생별/날짜별/과목별로 그룹화
  const groups = {};
  
  rows.forEach((row, index) => {
    const key = `${row[0]}_${row[2]}_${row[3]}`; // student_id_date_subject
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push({
      row: row,
      index: index + 2 // 헤더 제외, 1-based index
    });
  });
  
  // 각 그룹에서 마지막 행만 남기고 삭제
  Object.values(groups).forEach(group => {
    if (group.length > 1) {
      // 첫 번째부터 마지막 직전까지 삭제
      for (let i = 0; i < group.length - 1; i++) {
        studySheet.deleteRow(group[i].index);
      }
    }
  });
  
  Logger.log('중복 행 정리 완료!');
}
```

### localStorage 복원 확인

10초 자동 저장은 여전히 작동합니다:
- 브라우저 새로고침 시 타이머 복원
- 재로그인 시 학습 시간 복원
- **Google Sheets 저장은 완료 시에만!**

## ✨ 최종 확인

### 체크리스트
- [x] saveTodayStudyTime() Google Sheets 저장 제거
- [x] stopTimer() 최종 저장 유지
- [x] localStorage 10초 자동 저장 유지
- [x] 시작/종료 시간 포함
- [x] 코드 커밋 및 푸시 완료
- [x] 문서화 완료

### 최종 결과
```
✅ 10초마다 중복 저장 방지!
✅ Google Sheets에 1번만 저장!
✅ localStorage는 10초마다 저장 (복원용)!
✅ 데이터 품질 대폭 개선!
```

---

**작성일:** 2026-01-04  
**작성자:** GenSpark AI Developer  
**상태:** ✅ 배포 완료 및 즉시 적용
