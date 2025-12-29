# 개발자 가이드 - 근화 학생 포털

> ⚠️ **중요**: 이 문서는 코드를 수정하지 않고 현재 시스템을 이해하기 위한 참고 자료입니다.

---

## 📋 목차
1. [프로젝트 구조](#프로젝트-구조)
2. [핵심 시스템](#핵심-시스템)
3. [주요 함수 목록](#주요-함수-목록)
4. [LocalStorage 키 목록](#localstorage-키-목록)
5. [데이터 구조](#데이터-구조)
6. [타이머 시스템 상세](#타이머-시스템-상세)
7. [주의사항 및 알려진 이슈](#주의사항-및-알려진-이슈)

---

## 📁 프로젝트 구조

### 파일 구성
```
/home/user/webapp/
├── geunhwa-student-portal.html          # 겨울방학 30일 프로그램 (6,000+ 줄)
├── geunhwa-student-portal-semester.html # 학기중 100일 프로그램 (6,700+ 줄)
├── STUDENT_USER_GUIDE.md                # 학생용 사용 설명서
├── TIMER_SYSTEM_GUIDE.md                # 타이머 시스템 문서
├── AI_FEEDBACK_SYSTEM.md                # AI 피드백 시스템 문서
├── PROGRAM_COMPARISON.md                # 30일 vs 100일 비교
└── DEVELOPER_GUIDE.md                   # 이 문서
```

### 코드 구조 (HTML 파일 내부)
```
geunhwa-student-portal.html
├── HTML 구조 (1~1000행)
│   ├── 헤더 (프로그램 정보, 학생 정보)
│   ├── 프로그램 진행률 섹션
│   ├── 4주 로드맵
│   ├── 오늘의 학습 (과목 카드)
│   ├── 캘린더
│   └── 각종 모달 (진단평가, 메타인지, 축하, 자기점검, AI 피드백)
│
├── CSS 스타일 (1000~1500행)
│   └── Tailwind CSS + 커스텀 애니메이션
│
└── JavaScript 로직 (1500~6000행)
    ├── 전역 변수 선언
    ├── 초기화 함수들
    ├── 인증 시스템 (로그인/로그아웃)
    ├── 타이머 시스템 ⭐
    ├── 학습 기록 시스템
    ├── 진단평가 시스템
    ├── 스케줄 생성 시스템
    ├── 메타인지 체크
    ├── 자기점검 시스템
    ├── AI 피드백 시스템
    ├── 누적 복습 시스템
    ├── 캘린더 렌더링
    └── 유틸리티 함수들
```

---

## 🔑 핵심 시스템

### 1. 타이머 시스템 ⭐⭐⭐
**가장 복잡하고 중요한 시스템**

#### 동작 원리
```
[시작] → [실행] → [로그아웃] → [백그라운드 계속] → [재로그인] → [복원] → [완료]
```

#### 핵심 메커니즘
1. **절대 시작 시각 저장**: `timerStartTime` (타임스탬프)
2. **경과 시간 계산**: `Date.now() - timerStartTime`
3. **자동 저장**: 10초마다 localStorage에 저장
4. **복원**: 재로그인 시 경과 시간 자동 계산 및 표시

#### 관련 함수
- `startTimer(subject, targetMinutes)` - 타이머 시작
- `stopTimer(subject)` - 타이머 완료 (최소 30분 체크)
- `restoreRunningTimers()` - 재로그인 시 복원
- `saveTodayStudyTime(subject, totalSeconds)` - 실시간 저장
- `loadTodayStudyTime(subject)` - 기록 불러오기
- `updateTimerDisplay(subject)` - 화면 업데이트
- `updateProgressBar(subject)` - 진행률 바 업데이트

### 2. 인증 시스템
- 이름 기반 로그인 (비밀번호 없음)
- localStorage에 학생 정보 저장
- 게스트 모드 지원

#### 관련 함수
- 로그인 처리 (이름 입력 후 처리)
- `resetStudent()` - 로그아웃
- `checkLoginStatus()` - 자정 자동 로그아웃

### 3. 학습 기록 시스템
- 날짜별, 과목별 학습 시간 기록
- `study_records` 배열에 저장
- 과목별 `isRunning` 상태 추적

### 4. 스케줄 생성 시스템
- `autoGenerateWeeklySchedule()` - 4주 단계별 스케줄 자동 생성
- 주차별 학습 패턴:
  - 1주차: 개념 학습 (수학→영어→국어→과학→사회)
  - 2주차: 개념 강화
  - 3주차: 문제 풀이 시작
  - 4주차: 종합 문제 풀이

### 5. 진단평가 시스템
- 50문항 (과목당 10문제)
- Pre-test (시작 시) / Post-test (종료 시)
- 점수 비교 및 향상도 분석

### 6. 메타인지 체크 시스템
- 45분 완료 후 자동 실행
- 4가지 체크리스트 + 3가지 텍스트 입력
- `meta_cognition_records`에 저장

### 7. 자기점검 시스템
- 메타인지 체크 후 자동 실행
- 3가지 질문 (시작 난이도, 막힌 이유, 내일 계획)
- `daily_self_check_records`에 저장

### 8. AI 피드백 시스템
- 자기점검 후 자동 실행
- 5가지 분석 (학습 시간, 과목 수, 순서, 패턴, 효율성)
- 6개 섹션 피드백 생성
- `daily_feedback_records`에 저장

### 9. 누적 복습 시스템
- 에빙하우스 망각곡선 적용 (1일, 3일, 7일, 14일 후)
- 과목 완료 시 자동 스케줄 생성
- `review_schedules`에 저장

### 10. 학교 수업 기록 (100일 전용)
- 평일 시간표 자동 표시
- 수업 내용, 이해도, 질문 기록
- 자동 복습 스케줄 연동

---

## 📝 주요 함수 목록

### 타이머 관련 ⭐
```javascript
// 시작/종료
startTimer(subject, targetMinutes = 45)
stopTimer(subject)

// 복원
restoreRunningTimers()

// 저장/불러오기
saveTodayStudyTime(subject, totalSeconds)
loadTodayStudyTime(subject)

// UI 업데이트
updateTimerDisplay(subject)
updateProgressBar(subject)
updateTotalStudyTime()
```

### 인증 관련
```javascript
// 로그인/로그아웃
// 로그인은 이름 입력 후 직접 처리됨 (함수명 없음)
resetStudent()  // 로그아웃

// 자동 로그아웃
checkLoginStatus()  // 자정 체크
```

### 스케줄 관련
```javascript
autoGenerateWeeklySchedule(student)
generateAndDisplayTodaySchedule(student)
displayIntegratedSubjectCards(todaySchedule)
```

### 진단평가 관련
```javascript
startDiagnosticTest(grade, subject)
hasDiagnosticCompleted(studentId, subject)
```

### 프로그램 진행 관련
```javascript
initProgramProgress()
updateWeeklyRoadmapProgress()
renderCalendar()
showTomorrowPreview()
```

### 메타인지/자기점검/AI 피드백
```javascript
// 메타인지
saveMetaCognition()
skipMetaCognition()

// 자기점검
saveDailySelfCheck()
skipDailySelfCheck()

// AI 피드백
generateDailyFeedback()  // 자동 실행
```

### 복습 시스템
```javascript
createReviewSchedule(studyData)
getTodaysReviews()
displayTodaysReviews()
completeReview(reviewId, scheduleIndex)
```

### 유틸리티
```javascript
showSuccessMessage(message)
showWelcomeMessage(name, isGuest)
formatDate(date)
addDays(date, days)
```

---

## 🗄️ LocalStorage 키 목록

### 학생 정보
```javascript
'currentStudentId'       // 현재 로그인 학생 ID
'currentStudentName'     // 현재 학생 이름
'currentStudentGrade'    // 현재 학생 학년
'students'               // 전체 학생 목록 (배열)
```

### 타이머 관련 ⭐
```javascript
'timerStartTime'         // 타이머 절대 시작 시각 (타임스탬프)
'activeSubject'          // 현재 실행 중인 과목
```

### 학습 기록
```javascript
'study_records'          // 날짜별 학습 기록 (배열)
  // [{
  //   id: 'record_...',
  //   student_id: '...',
  //   date: '2025-12-29',
  //   subjects: {
  //     '수학': { time: 45, content: '...', isRunning: false }
  //   }
  // }]
```

### 스케줄
```javascript
'student_schedules'      // 주간 스케줄 (배열)
```

### 프로그램 진행
```javascript
'programStartDate'       // 프로그램 시작 날짜 (YYYY-MM-DD)
'program_start_{studentId}' // 학생별 시작 날짜
'lastLoginDate'          // 마지막 로그인 날짜 (자정 로그아웃용)
```

### 진단평가
```javascript
// students 배열 내 각 학생 객체에:
// student.diagnostic_completed = { '종합': true }
```

### 메타인지/자기점검/AI 피드백
```javascript
'meta_cognition_records'  // 메타인지 체크 기록
'daily_self_check_records' // 자기점검 기록
'daily_feedback_records'   // AI 피드백 기록
```

### 복습 시스템
```javascript
'review_schedules'        // 복습 스케줄 (배열)
  // [{
  //   id: 'review_...',
  //   student_id: '...',
  //   subject: '수학',
  //   reviews: [
  //     { day: 1, date: '2025-12-30', completed: false },
  //     { day: 3, date: '2026-01-01', completed: false }
  //   ]
  // }]
```

### 학교 수업 (100일 전용)
```javascript
'school_classes'          // 학교 수업 기록
'school_timetable'        // 시간표
```

---

## 📊 데이터 구조

### study_records 구조
```javascript
[
  {
    id: "record_1735458123456",
    student_id: "student_1735458000000",
    student_name: "홍길동",
    date: "2025-12-29",
    subjects: {
      "수학": {
        time: 45,              // 분 단위
        content: "함수 단원 학습",
        isRunning: false,      // 현재 실행 중 여부
        last_update: "2025-12-29T10:45:00.000Z",
        completed_at: "2025-12-29T10:45:00.000Z"
      },
      "영어": {
        time: 30,
        content: "문법 복습",
        isRunning: true,       // 실행 중!
        last_update: "2025-12-29T11:15:00.000Z"
      }
    }
  }
]
```

### students 구조
```javascript
[
  {
    id: "student_1735458000000",
    name: "홍길동",
    grade: 3,
    class_num: 1,
    number: 5,
    email: "hong@example.com",
    registered_at: "2025-12-29T09:00:00.000Z",
    diagnostic_completed: {
      "종합": true
    },
    diagnostic_scores: {
      "종합_pre": { 수학: 8, 영어: 7, ... },
      "종합_post": { 수학: 9, 영어: 9, ... }
    }
  }
]
```

### timers 객체 (전역 변수, localStorage 아님)
```javascript
{
  "수학": {
    seconds: 2700,           // 초 단위 (45분 = 2700초)
    interval: 123,           // setInterval ID
    isRunning: true,
    target: 2700             // 목표 시간 (초)
  }
}
```

### review_schedules 구조
```javascript
[
  {
    id: "review_1735458123456",
    student_id: "student_1735458000000",
    subject: "수학",
    original_date: "2025-12-29",
    content: "함수 단원 학습",
    created_at: "2025-12-29T10:45:00.000Z",
    reviews: [
      { day: 1, date: "2025-12-30", completed: false },
      { day: 3, date: "2026-01-01", completed: false },
      { day: 7, date: "2026-01-05", completed: false },
      { day: 14, date: "2026-01-12", completed: false }
    ]
  }
]
```

---

## ⏱️ 타이머 시스템 상세

### 타이머 생명주기

```
┌─────────────────────────────────────────────────────────┐
│ 1. startTimer() 호출                                    │
│    - timers[subject] 객체 생성                          │
│    - timerStartTime 저장 (절대 시각)                    │
│    - setInterval 시작 (1초마다)                         │
│    - activeSubject 설정                                 │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. 타이머 실행 중                                       │
│    - 매초 seconds++                                     │
│    - 10초마다 saveTodayStudyTime() 자동 저장           │
│    - updateTimerDisplay() 화면 갱신                     │
│    - 45분 도달 시 알림 (자동 중지 X)                   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. 로그아웃 (resetStudent)                              │
│    - saveTodayStudyTime() 최종 저장                     │
│    - isRunning: true 유지                               │
│    - timerStartTime 유지 (이미 있으면)                  │
│    - activeSubject 유지                                 │
│    - clearInterval은 호출 안 함 (멈추지 않음!)          │
│    - location.reload() → interval 자동 정리             │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. 백그라운드 실행                                      │
│    - timerStartTime은 localStorage에 보존              │
│    - study_records의 isRunning: true 유지              │
│    - 실제 시간은 계속 흐름 (절대 시각 기준)             │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 5. 재로그인 후 복원 (restoreRunningTimers)             │
│    - 로그인 후 500ms 지연으로 호출                      │
│    - study_records에서 isRunning: true인 과목 찾기     │
│    - timerStartTime 읽기                                │
│    - 경과 시간 계산: Date.now() - timerStartTime       │
│    - timers[subject] 객체 재생성                        │
│    - setInterval 재시작                                 │
│    - updateTimerDisplay() 즉시 호출                     │
│    - timerStartTime 유지 (삭제하지 않음!)              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 6. 타이머 완료 (stopTimer)                              │
│    - 최소 30분 체크                                     │
│    - clearInterval() 호출                               │
│    - isRunning: false 설정                              │
│    - timerStartTime 삭제 ← 여기서만 삭제!              │
│    - activeSubject = null                               │
│    - 최종 시간 study_records에 저장                     │
│    - 축하 모달 → 메타인지 → 자기점검 → AI 피드백      │
└─────────────────────────────────────────────────────────┘
```

### 핵심 로직 설명

#### timerStartTime의 의미
```javascript
// 잘못된 이해: "타이머 시작한 시각"
// 올바른 이해: "타이머가 0초였던 절대 시각"

// 예시:
// 10:00에 타이머 시작 → timerStartTime = 10:00
// 10:07에 로그아웃 (7분 경과) → timerStartTime = 10:00 (유지!)
// 10:15에 재로그인 → 경과 시간 = 10:15 - 10:00 = 15분

// 만약 이미 7분이 경과된 상태에서 시작했다면:
// timerStartTime = Date.now() - (7분 * 60 * 1000)
// = 현재 시각에서 7분을 뺀 과거 시각
```

#### 왜 로그아웃 시 interval을 정리하지 않나?
```javascript
// location.reload()가 모든 JS 실행 환경을 리셋하므로
// interval은 자동으로 정리됨
// 명시적으로 clearInterval 불필요
```

#### 왜 restoreRunningTimers에서 timerStartTime을 삭제하지 않나?
```javascript
// 삭제하면: 다음 재로그인 시 복원 불가능
// 유지하면: 여러 번 로그인/로그아웃 해도 계속 복원 가능
// 삭제 시점: stopTimer()에서 타이머 완료할 때만
```

---

## ⚠️ 주의사항 및 알려진 이슈

### 타이머 시스템 주의사항

1. **timerStartTime은 타이머 완료 전까지 절대 삭제하지 말 것**
   - startTimer에서 저장
   - resetStudent에서 유지
   - restoreRunningTimers에서 유지
   - stopTimer에서만 삭제

2. **한 번에 하나의 과목만 학습 가능**
   - activeSubject는 전역 변수
   - 다른 과목 시작 시 경고 표시

3. **최소 학습 시간 30분**
   - stopTimer에서 체크
   - 30분 미만이면 완료 불가

4. **10초마다 자동 저장**
   - 브라우저 종료 대비
   - 데이터 유실 최소화

### 개발 시 주의사항

#### 타이머 관련 코드 수정 시
```javascript
// ❌ 절대 하지 말 것
localStorage.removeItem('timerStartTime');  // stopTimer 외에는 금지!

// ❌ 덮어쓰기 금지
localStorage.setItem('timerStartTime', ...); // startTimer 외에는 금지!

// ✅ 안전한 방식
if (!localStorage.getItem('timerStartTime')) {
  // 없을 때만 저장
}
```

#### 새 기능 추가 시
1. **기존 타이머 로직은 건드리지 않기**
2. **새 localStorage 키 사용하기**
3. **테스트 시나리오 먼저 작성**
4. **로그인/로그아웃 반복 테스트**

### 알려진 제한사항

1. **브라우저 localStorage 용량 제한** (보통 5-10MB)
   - 오래된 기록은 수동으로 정리 필요
   
2. **다중 탭 동기화 안 됨**
   - 같은 학생이 여러 탭에서 로그인 시 충돌 가능
   
3. **시간 조작 감지 없음**
   - 사용자가 시스템 시간 변경 시 대응 불가

4. **네트워크 없이 로컬만 사용**
   - 다른 기기 간 동기화 불가
   - 브라우저 데이터 삭제 시 모든 기록 손실

---

## 🔧 디버깅 팁

### 타이머 문제 디버깅
```javascript
// 콘솔에서 확인
localStorage.getItem('timerStartTime')      // 절대 시작 시각
localStorage.getItem('activeSubject')       // 실행 중인 과목
JSON.parse(localStorage.getItem('study_records'))  // 전체 기록

// 경과 시간 계산
const start = parseInt(localStorage.getItem('timerStartTime'));
const elapsed = (Date.now() - start) / 1000 / 60;  // 분 단위
console.log(`경과 시간: ${elapsed}분`);

// 타이머 상태 확인
console.log(timers);  // 전역 변수
```

### localStorage 초기화 (문제 발생 시)
```javascript
// 특정 키만 삭제
localStorage.removeItem('timerStartTime');
localStorage.removeItem('study_records');

// 전체 삭제 (⚠️ 모든 데이터 손실!)
localStorage.clear();
```

---

## 📚 관련 문서

- **TIMER_SYSTEM_GUIDE.md** - 타이머 시스템 전체 가이드
- **STUDENT_USER_GUIDE.md** - 학생용 사용 설명서
- **AI_FEEDBACK_SYSTEM.md** - AI 피드백 시스템
- **PROGRAM_COMPARISON.md** - 30일 vs 100일 비교

---

## 🤝 개발 원칙

### DO ✅
- 기능 추가 전 백업
- 작은 단위로 테스트
- 콘솔 로그 활용
- 문서 업데이트

### DON'T ❌
- 타이머 로직 함부로 수정
- timerStartTime 임의 삭제
- localStorage 구조 변경
- 테스트 없이 배포

---

**마지막 업데이트**: 2025-12-29  
**작성자**: AI Assistant  
**버전**: 1.0
