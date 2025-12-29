# 학생 포털 타이머 최종 운영 방식

## 🎯 핵심 개념: **끊김 없는 학습 타이머**

학생 포털의 타이머는 **한 번 시작하면 완료 버튼을 누를 때까지 절대 멈추지 않습니다.**  
로그아웃, 새로고침, 브라우저 종료 후에도 **백그라운드에서 계속 실행**됩니다.

---

## 📊 타이머 생명주기

```
[시작] → [실행 중] → [로그아웃] → [백그라운드 실행] → [재로그인] → [자동 복원] → [완료]
   ↓         ↓           ↓              ↓                ↓              ↓           ↓
 45분    10초마다      타이머       경과 시간          타이머         자동으로      최소 30분
 목표    자동 저장     멈추지 않음    계속 누적        interval       카운트 계속    체크 후 완료
```

---

## 1️⃣ 타이머 시작 (startTimer)

### 기능
- 과목별로 45분 학습 타이머 시작
- 한 번에 하나의 과목만 학습 가능
- 당일 이전 학습 시간이 있으면 이어서 시작

### 동작 방식
```javascript
// 1. 중복 실행 방지
if (activeSubject && activeSubject !== subject) {
    alert('다른 과목을 학습 중입니다!');
    return;
}

// 2. 당일 학습 시간 로드 (재로그인 시)
const savedSeconds = loadTodayStudyTime(subject);

// 3. 타이머 시작
timers[subject] = {
    seconds: savedSeconds,      // 이전 기록부터 시작
    interval: setInterval(...), // 1초마다 실행
    isRunning: true,
    target: 45 * 60            // 45분 목표
};

// 4. 10초마다 자동 저장
if (seconds % 10 === 0) {
    saveTodayStudyTime(subject, seconds);
}

// 5. 45분 달성 시 알림 (자동 중지 X)
if (seconds === target) {
    alert('45분 목표 달성! 완료 버튼을 눌러주세요.');
}
```

### 저장 데이터
```json
{
  "activeSubject": "수학",
  "study_records": [{
    "student_id": "student123",
    "date": "2025-12-29",
    "subjects": {
      "수학": {
        "time": 15,              // 15분 (분 단위)
        "content": "",
        "isRunning": true,       // 실행 중 표시
        "last_update": "2025-12-29T10:15:00.000Z"
      }
    }
  }]
}
```

---

## 2️⃣ 로그아웃 (resetStudent)

### 핵심: **타이머는 멈추지 않음!**

```javascript
// 1. 경고 메시지 표시
confirm(`
✅ 실행 중인 타이머는 로그아웃 중에도 계속 실행됩니다.
✅ 완료 버튼을 누를 때까지 타이머가 멈추지 않습니다.
✅ 학습 데이터는 자동 저장됩니다.
`);

// 2. 타이머 시작 시각을 절대 시간으로 저장
// (현재 시각 - 경과 시간 = 타이머 시작 절대 시각)
const timerStartTime = Date.now() - (timers[activeSubject].seconds * 1000);
localStorage.setItem('timerStartTime', timerStartTime);

// 3. 현재 시간 저장
saveTodayStudyTime(activeSubject, timers[activeSubject].seconds);

// 4. 학생 세션 정보 삭제 (타이머 상태는 유지)
localStorage.removeItem('currentStudentId');
localStorage.removeItem('currentStudentName');
// ⚠️ timerStartTime과 activeSubject는 유지!

// 5. 페이지 새로고침 (interval은 자동 정리됨)
location.reload();
```

// 5. 세션 정보만 삭제 (타이머 데이터는 유지)
localStorage.removeItem('currentStudentId');
localStorage.removeItem('currentStudentName');
// activeSubject는 유지!

// 6. 페이지 새로고침
location.reload();
```

### 저장 데이터 (로그아웃 시)
```json
{
  "timerStartTime": 1735458000000,  // 절대 시각 (timestamp)
  "activeSubject": "수학",
  "study_records": [{
    "subjects": {
      "수학": {
        "time": 15,
        "isRunning": true  // ✅ 여전히 실행 중
      }
    }
  }]
}
```

---

## 3️⃣ 페이지 로드 시 타이머 자동 복원 (restoreRunningTimers)

### 핵심: **로그인 없이도 자동 복원!**

```javascript
// 🔥 페이지 로드 시 항상 실행 (로그인 전에도!)
// geunhwa-student-portal.html 5996행
restoreRunningTimers();

// 1. 오늘 학습 기록에서 isRunning = true인 과목 찾기
const todayRecord = studyRecords.find(r => r.date === today);
const runningSubject = Object.keys(todayRecord.subjects).find(s => 
    todayRecord.subjects[s].isRunning
);

// 2. 로그아웃 중 경과 시간 계산
const timerStartTime = localStorage.getItem('timerStartTime');
if (timerStartTime) {
    const now = Date.now();
    const totalElapsedSeconds = Math.floor((now - timerStartTime) / 1000);
    
    console.log(`⏱️ 로그아웃 중 경과 시간: ${Math.floor(totalElapsedSeconds / 60)}분`);
    
    // 3. 타이머 객체 복원
    timers[runningSubject] = {
        seconds: totalElapsedSeconds,  // ✅ 경과 시간 반영
        isRunning: true,
        target: 45 * 60
    };
    
    // 4. interval 다시 시작 (자동으로 계속 카운트)
    timers[runningSubject].interval = setInterval(() => {
        timers[runningSubject].seconds++;
        updateTimerDisplay(runningSubject);
        // ... 10초마다 자동 저장
    }, 1000);
    
    // 5. timerStartTime 삭제 (한 번만 사용)
    localStorage.removeItem('timerStartTime');
    
    // 6. 사용자에게 알림
    showSuccessMessage(`⏰ ${runningSubject} 학습이 계속됩니다! (${Math.floor(totalElapsedSeconds/60)}분)`);
}
```

### 🆕 개선 사항 (2025-12-29)
- **로그인 불필요**: 페이지 로드만으로 타이머 자동 복원
- **즉시 실행**: 로그인 전에도 타이머가 돌아감
- **백그라운드 유지**: 브라우저를 닫아도 시간은 계속 흐름

### 예시 시나리오
```
14:00 - 수학 타이머 시작 (0분)
14:15 - 15분 경과
14:20 - 로그아웃 (timerStartTime = 14:00 저장)
      └─ 타이머는 백그라운드에서 계속 실행 ✅
      └─ 브라우저 종료해도 OK

14:35 - 브라우저 열기 (로그인 안 해도 됨!)
      └─ 페이지 로드 → restoreRunningTimers() 자동 실행
      └─ 경과 시간 계산: 14:35 - 14:00 = 35분
      └─ 타이머 복원: 35분부터 자동으로 계속 카운트
      └─ 화면에 "⏰ 수학 학습이 계속됩니다! (35분)" 표시
      └─ 사용자 알림: "수학 학습이 계속됩니다! (35분)"
15:00 - 실제로 60분 학습 완료
```

---

## 4️⃣ 타이머 완료 (stopTimer)

### 최소 학습 시간 체크: **30분**

```javascript
// 1. 최소 학습 시간 체크
const MIN_SECONDS = 1800;  // 30분
if (totalSeconds < MIN_SECONDS) {
    alert(`⚠️ 학습 시간이 부족합니다!
    
현재 학습 시간: ${minutes}분
최소 학습 시간: 30분
남은 시간: 약 ${remainingMinutes}분

조금 더 집중해서 학습해주세요! 💪`);
    return;  // ❌ 완료 불가
}

// 2. 타이머 정지
clearInterval(timers[subject].interval);
timers[subject].isRunning = false;
activeSubject = null;

// 3. 최종 학습 시간 및 내용 저장
todayRecord.subjects[subject] = {
    time: minutes,                      // 총 학습 시간 (분)
    content: document.getElementById(`${subject}Content`).value,
    completed_at: new Date().toISOString(),
    isRunning: false                    // ✅ 완료됨
};

// 4. 누적복습 스케줄 자동 생성 (에빙하우스 망각곡선)
const reviewSchedule = createReviewSchedule({
    student_id: studentId,
    date: today,
    subject: subject,
    content: content
});
// 1일, 3일, 7일, 14일 후 복습 일정 자동 생성

// 5. 축하 모달 표시
showCelebrationModal(subject, minutes);

// 6. 메타인지 체크 모달 (자동)
// 축하 모달 닫기 → 메타인지 체크 모달 자동 표시
```

---

## 5️⃣ 자동 저장 시스템

### 10초마다 자동 저장
```javascript
// 타이머 interval 내부
if (timers[subject].seconds % 10 === 0) {
    saveTodayStudyTime(subject, timers[subject].seconds);
}
```

### 저장 내용
- **학습 시간**: 초 → 분 변환 후 저장
- **실행 상태**: `isRunning` (true/false)
- **마지막 업데이트**: 타임스탬프
- **활성 과목**: `activeSubject`

### 저장 시점
1. **10초마다** 자동 저장 (타이머 실행 중)
2. **로그아웃 시** 저장
3. **완료 시** 최종 저장

---

## 6️⃣ 데이터 구조

### localStorage Keys
```javascript
// 1. 타이머 관련
'activeSubject'        // 현재 실행 중인 과목
'timerStartTime'       // 타이머 시작 절대 시각 (timestamp)

// 2. 학습 기록
'study_records'        // 전체 학습 기록 (배열)
'programStartDate'     // 프로그램 시작 날짜

// 3. 세션 정보
'currentStudentId'     // 현재 로그인 학생 ID
'currentStudentName'   // 현재 로그인 학생 이름
'currentStudentGrade'  // 학년
'lastLoginDate'        // 마지막 로그인 날짜

// 4. 복습 스케줄
'review_schedules'     // 누적복습 스케줄 (배열)

// 5. 메타인지 체크
'meta_cognition_records'  // 메타인지 체크 기록
'lastCompletedSubject'    // 마지막 완료 과목 (메타인지 체크용)
```

### study_records 구조
```json
[{
  "id": "record_1735458123456",
  "student_id": "student123",
  "student_name": "김다움",
  "date": "2025-12-29",
  "subjects": {
    "수학": {
      "time": 45,                           // 학습 시간 (분)
      "content": "일차함수 그래프 그리기",    // 학습 내용
      "isRunning": false,                   // 실행 중 여부
      "last_update": "2025-12-29T15:00:00.000Z",
      "completed_at": "2025-12-29T15:00:00.000Z"
    },
    "영어": {
      "time": 30,
      "content": "과거형 동사 변화",
      "isRunning": true,                    // ✅ 실행 중!
      "last_update": "2025-12-29T15:30:00.000Z"
    }
  }
}]
```

---

## 7️⃣ 타이머 복원 시나리오

### 시나리오 A: 짧은 로그아웃 (15분)
```
09:00 - 수학 타이머 시작
09:15 - 로그아웃 (15분 경과)
09:30 - 재로그인
       └─ 자동 계산: 09:30 - 09:00 = 30분
       └─ 타이머 복원: 30분부터 시작
09:45 - 45분 목표 달성 알림
10:00 - 완료 버튼 클릭 (총 60분)
```

### 시나리오 B: 여러 번 로그아웃 (누적 반영)
```
14:00 - 수학 타이머 시작
14:15 - 로그아웃 (15분 경과)
14:30 - 재로그인 → 30분으로 자동 복원
14:40 - 로그아웃 (40분 경과)
15:00 - 재로그인 → 60분으로 자동 복원
15:10 - 완료 (총 70분)
```

### 시나리오 C: 자정 넘김
```
23:50 - 수학 타이머 시작
00:00 - 자정 (자동 로그아웃)
       └─ 타이머는 계속 실행 ✅
00:10 - 재로그인 (다음 날)
       └─ ⚠️ 전날 기록으로 처리
       └─ 타이머는 새로 시작 필요
```

---

## 8️⃣ 타이머 특징 요약

### ✅ 장점
1. **끊김 없는 학습**: 로그아웃해도 계속 실행
2. **정확한 시간 추적**: 절대 시각 기반 계산
3. **자동 복원**: 재로그인 시 자동으로 이어서 실행
4. **자동 저장**: 10초마다 자동 저장 (데이터 손실 방지)
5. **최소 학습 시간 보장**: 30분 미만은 완료 불가

### 📊 데이터 흐름
```
시작 → 10초마다 자동 저장 → 로그아웃 (절대 시각 저장)
  ↓                              ↓
실행                        백그라운드 계속
  ↓                              ↓
재로그인 ← 경과 시간 계산 ← 자동 복원
  ↓
45분 달성 알림
  ↓
완료 (최소 30분 체크)
  ↓
복습 스케줄 자동 생성 + 메타인지 체크
```

---

## 9️⃣ 개발자 참고사항

### 타이머 interval은 절대 멈추지 않음
```javascript
// ❌ 로그아웃 시 이렇게 하면 안 됨
clearInterval(timers[subject].interval);

// ✅ 로그아웃 시 올바른 방법
// interval은 그대로 두고, 절대 시각만 저장
localStorage.setItem('timerStartTime', Date.now() - elapsed);
```

### 재로그인 시 자동 복원 로직
```javascript
// 1. isRunning = true인 과목 찾기
// 2. timerStartTime에서 경과 시간 계산
// 3. 타이머 객체 재생성
// 4. interval 다시 시작
```

### 자정 넘김 처리
```javascript
// 오늘 날짜와 기록 날짜 비교
if (recordDate !== today) {
    // 전날 타이머는 복원하지 않음
    console.log('전날 타이머는 새로 시작 필요');
}
```

---

## 🎯 최종 요약

### 타이머 철학
> **"한 번 시작한 학습은 완료 버튼을 누를 때까지 절대 멈추지 않는다."**

### 핵심 3원칙
1. **영속성**: 로그아웃, 새로고침, 브라우저 종료에도 데이터 유지
2. **연속성**: 재로그인 시 자동으로 이어서 실행
3. **정확성**: 절대 시각 기반으로 경과 시간 정확히 계산

### 사용자 경험
- ✅ 로그아웃해도 타이머 걱정 없음
- ✅ 재로그인하면 자동으로 이어짐
- ✅ 정확한 학습 시간 추적
- ✅ 최소 30분 학습 보장

---

**© 2025 다움진로진학컨설팅 (DA:UM Consulting). All rights reserved.**
