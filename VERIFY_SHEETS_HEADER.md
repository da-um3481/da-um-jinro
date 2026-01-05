# ✅ Google Sheets 헤더 수정 확인 가이드

## 🎯 확인 절차

### 1️⃣ Apps Script 실행 로그 확인

1. **Google Sheets 열기**
2. **확장 프로그램 → Apps Script**
3. **상단 메뉴: 실행 → 함수 선택 → doGet**
4. **실행** 버튼 클릭
5. **권한 승인** (처음 실행 시)
6. **실행 로그 보기** 클릭

### 2️⃣ 로그에서 확인할 내용

```javascript
// ✅ 올바른 로그 예시:
Action: getStudyRecords
헤더: ["id","student_id","student_name","date","subject","time","content"]
전체 학습 기록 개수: 30
첫 번째 레코드 샘플: {"id":"record_123","student_id":"student_456","student_name":"김다현","date":"2025-01-05","subject":"수학","time":45}
레코드 0 - 이름: 김다현, ID: student_456
레코드 1 - 이름: 박수은, ID: student_789
레코드 2 - 이름: 이철수, ID: student_012
```

### 3️⃣ 교사 대시보드 테스트

1. **교사 대시보드 열기**
   - https://da-um3481.github.io/da-um-jinro/middle-teacher-dashboard.html

2. **강력 새로고침**
   - **Ctrl+Shift+R** (Windows)
   - **Cmd+Shift+R** (Mac)

3. **학습 관리 탭 클릭**

4. **F12 → Console 탭 열기**

5. **"학생별 요약 보기" 버튼 클릭**

6. **Console 로그 확인**:
   ```javascript
   📊 학생별 그룹화 데이터: {status: "success", data: Array(12), message: "12명의 학생 학습 기록"}
   ```

---

## 📊 예상 결과

### ✅ 성공한 경우

**모달 화면:**
```
🧑‍🎓 학생별 학습 기록 요약

총 12명의 학생

┌─────────────────────────────────┐
│ 🎓 김다현                        │
│ 총 7개의 학습 기록    4시간 0분   │
│                                  │
│ 📊 과목별 학습 현황               │
│ 수학  3회  1시간 30분            │
│ 영어  2회  1시간 15분            │
│ 국어  2회  1시간 15분            │
│                                  │
│ [📈 상세 학습 기록 보기]          │
└─────────────────────────────────┘
```

### ❌ 여전히 문제가 있는 경우

**케이스 1: 여전히 "undefined"로 표시**
- 원인: Apps Script를 수정하지 않았거나 재배포하지 않음
- 해결: `APPS_SCRIPT_FIX_UNDEFINED.md`의 코드로 Apps Script 수정 후 재배포

**케이스 2: "데이터 로드 실패" 에러**
- 원인: Apps Script 웹 앱 URL이 잘못됨
- 해결: `google-sheets-api.js` 파일의 `WEB_APP_URL` 확인

**케이스 3: 빈 화면 (데이터 없음)**
- 원인: study_records 시트에 실제 데이터가 없음
- 해결: 학생 포털에서 학습 기록 생성 후 재확인

---

## 🔍 문제 해결

### Apps Script 로그에서 헤더가 이렇게 나온다면:

#### ❌ 잘못된 예:
```javascript
헤더: ["","","","","","",""]
// 또는
헤더: ["A","B","C","D","E","F","G"]
```
→ **해결**: Google Sheets 첫 번째 행을 다시 확인하고 정확히 입력

#### ❌ student_name이 없는 예:
```javascript
헤더: ["id","student_id","date","subject","time","content"]
```
→ **해결**: C열에 "student_name" 헤더 추가

#### ✅ 올바른 예:
```javascript
헤더: ["id","student_id","student_name","date","subject","time","content"]
```

### 레코드 샘플에서 student_name이 없다면:

#### ❌ 잘못된 예:
```javascript
첫 번째 레코드 샘플: {"id":"record_123","student_id":"student_456","student_name":"","date":"2025-01-05"}
// 또는
첫 번째 레코드 샘플: {"id":"record_123","student_id":"student_456","date":"2025-01-05"}
```
→ **해결**: 데이터 행의 C열(student_name)에 실제 학생 이름 입력

#### ✅ 올바른 예:
```javascript
첫 번째 레코드 샘플: {"id":"record_123","student_id":"student_456","student_name":"김다현","date":"2025-01-05"}
```

---

## 📸 확인해야 할 스크린샷

다음 3가지 스크린샷을 공유해주시면 정확히 진단할 수 있습니다:

1. **Google Sheets 첫 번째 행 (헤더)**
   - A1부터 G1까지 보이도록 캡처

2. **Apps Script 실행 로그**
   - 실행 → doGet 실행 후 로그 전체

3. **교사 대시보드 Console**
   - F12 → Console → "학생별 요약 보기" 클릭 후 로그

---

## 🚀 체크리스트

```
□ Google Sheets 헤더 수정 완료
  A1: id
  B1: student_id
  C1: student_name
  D1: date
  E1: subject
  F1: time
  G1: content

□ Apps Script 코드 수정 완료
  (APPS_SCRIPT_FIX_UNDEFINED.md의 코드 사용)

□ Apps Script 재배포 완료
  (배포 → 새 버전 → 배포)

□ 교사 대시보드 강력 새로고침
  (Ctrl+Shift+R)

□ Apps Script 실행 로그 확인
  (헤더와 샘플 데이터 확인)

□ 교사 대시보드 Console 로그 확인
  (F12 → Console)
```

---

## 💡 빠른 테스트 명령어

교사 대시보드 Console에서 다음 명령어를 실행하여 즉시 확인할 수 있습니다:

```javascript
// 1. 학생별 그룹화 데이터 조회
getStudyRecordsFromCloud('', 'student').then(result => {
    console.log('📊 결과:', result);
    if (result.data && result.data.length > 0) {
        console.log('✅ 첫 번째 학생:', result.data[0]);
        console.log('✅ 학생 이름:', result.data[0].studentName);
    }
});
```

**예상 출력:**
```javascript
📊 결과: {status: "success", data: Array(12), message: "12명의 학생 학습 기록"}
✅ 첫 번째 학생: {studentName: "김다현", studentId: "student_456", totalMinutes: 240, ...}
✅ 학생 이름: 김다현
```

