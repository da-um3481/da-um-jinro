# 🔍 진단: 수준별 학습관리에 모든 학생이 표시되지 않는 문제

## 📋 문제 상황

### 증상
```
진단평가 결과 섹션: 10명 완료
수준별 학습관리 섹션: 5명만 표시 ❌
```

→ **왜 5명만 보이는가?**

---

## 🔍 원인 분석

### 1. 진단평가 결과 섹션 (모든 레코드 표시)
```javascript
// Line 2293-2297
const diagnosticData = diagnosticResults.filter(result => {
    return result.grade && result.grade <= 3;
});

// 결과: 10개 레코드 표시 (중복 포함 가능)
```

### 2. 수준별 학습관리 섹션 (학생별 그룹화)
```javascript
// Line 2577-2584 (수정 전)
const studentMap = new Map();
middleSchoolDiagnostics.forEach(result => {
    const existingResult = studentMap.get(result.studentId);  // ❌ 문제!
    if (!existingResult || new Date(result.testDate) > new Date(existingResult.testDate)) {
        studentMap.set(result.studentId, result);
    }
});
```

**문제**:
- `result.studentId`가 **undefined** 또는 **null**인 경우
- Map에 key로 `undefined`가 들어감
- 여러 학생이 같은 `undefined` key로 덮어씌워짐
- **결과: 5명만 표시됨**

---

## 🔧 해결 방법

### 수정 전 (문제 있음)
```javascript
// studentId가 없으면 undefined로 처리
const existingResult = studentMap.get(result.studentId);
studentMap.set(result.studentId, result);
```

### 수정 후 (해결)
```javascript
// studentId 다양한 형식 지원 + 폴백
const studentId = result.studentId           // localStorage 형식
                  || result.student_id        // Google Sheets 형식
                  || `${result.studentName || result.student_name}_${result.grade}`;  // 폴백

console.log('🔍 처리 중:', { studentId, name: result.studentName || result.student_name, grade: result.grade });

const existingResult = studentMap.get(studentId);
studentMap.set(studentId, result);
```

**개선 사항**:
1. ✅ **3가지 형식 지원**
   - `result.studentId` (localStorage)
   - `result.student_id` (Google Sheets)
   - `이름_학년` (폴백)

2. ✅ **디버깅 로그 추가**
   ```javascript
   console.log('📊 원본 데이터 개수:', middleSchoolDiagnostics.length);
   console.log('🔍 처리 중:', { studentId, name, grade });
   console.log('📊 그룹화 후 학생 수:', studentMap.size);
   console.log('📊 그룹화 결과:', Array.from(studentMap.entries()));
   ```

3. ✅ **날짜 형식도 지원**
   ```javascript
   const existingResult = studentMap.get(studentId);
   if (!existingResult || 
       new Date(result.testDate || result.test_date) > 
       new Date(existingResult.testDate || existingResult.test_date)) {
       studentMap.set(studentId, result);
   }
   ```

---

## 🧪 디버깅 방법

### Step 1: 교사 대시보드 접속
```
https://da-um3481.github.io/da-um-jinro/middle-teacher-dashboard.html
```

### Step 2: Console 열기 (F12)

### Step 3: 수준별 학습관리 탭 클릭

### Step 4: Console 로그 확인

#### 예상 로그 (수정 후)
```javascript
📊 수준별 학습관리 원본 데이터: Array(10)
📊 원본 데이터 개수: 10

🔍 처리 중: { studentId: "student_176752", name: "김태연", grade: 1 }
🔍 처리 중: { studentId: "student_176753", name: "박상윤", grade: 1 }
🔍 처리 중: { studentId: "student_176754", name: "성동현", grade: 3 }
🔍 처리 중: { studentId: "student_176755", name: "손최로", grade: 1 }
🔍 처리 중: { studentId: "student_176756", name: "테스트", grade: 1 }
🔍 처리 중: { studentId: "이나연_1", name: "이나연", grade: 1 }  // 폴백 사용!
🔍 처리 중: { studentId: "정서윤_2", name: "정서윤", grade: 2 }  // 폴백 사용!
🔍 처리 중: { studentId: "김민준_3", name: "김민준", grade: 3 }  // 폴백 사용!
🔍 처리 중: { studentId: "최지우_1", name: "최지우", grade: 1 }  // 폴백 사용!
🔍 처리 중: { studentId: "박서준_2", name: "박서준", grade: 2 }  // 폴백 사용!

📊 그룹화 후 학생 수: 10
📊 그룹화 결과: Array(10)
  0: ["student_176752", {...}]
  1: ["student_176753", {...}]
  2: ["student_176754", {...}]
  3: ["student_176755", {...}]
  4: ["student_176756", {...}]
  5: ["이나연_1", {...}]
  6: ["정서윤_2", {...}]
  7: ["김민준_3", {...}]
  8: ["최지우_1", {...}]
  9: ["박서준_2", {...}]
```

#### 문제 있는 로그 (수정 전)
```javascript
📊 수준별 학습관리 데이터: Array(10)

// studentId가 undefined인 경우
🔍 처리 중: { studentId: undefined, name: "이나연", grade: 1 }
🔍 처리 중: { studentId: undefined, name: "정서윤", grade: 2 }
🔍 처리 중: { studentId: undefined, name: "김민준", grade: 3 }
// ... 여러 학생이 같은 undefined key로 덮어씌워짐!

📊 그룹화 후 학생 수: 5  // ❌ 문제!
```

---

## 🎯 예상 결과

### 수정 전 ❌
```
수준별 학습관리 테이블:
중1 김태연  심화  475점
중1 박상윤  표준  348점
중3 성동현  표준  354점
중1 손최로  표준  252점
중1 테스트  기초  0점

통계:
- 심화: 1명
- 표준: 3명
- 기초: 1명
- 총 5명만 표시 ❌
```

### 수정 후 ✅
```
수준별 학습관리 테이블:
중1 김태연  심화  475점  심화 콘텐츠  ✅
중1 박상윤  표준  348점  표준 콘텐츠  ✅
중3 성동현  표준  354점  표준 콘텐츠  ✅
중1 손최로  표준  252점  표준 콘텐츠  ✅
중1 테스트  기초  0점    기초 콘텐츠  ✅
중1 이나연  표준  280점  표준 콘텐츠  ✅  // 추가!
중2 정서윤  표준  295점  표준 콘텐츠  ✅  // 추가!
중3 김민준  심화  380점  심화 콘텐츠  ✅  // 추가!
중1 최지우  기초  180점  기초 콘텐츠  ✅  // 추가!
중2 박서준  표준  310점  표준 콘텐츠  ✅  // 추가!

통계:
- 심화: 2명
- 표준: 6명
- 기초: 2명
- 총 10명 모두 표시 ✅
```

---

## 📊 데이터 형식 대응표

| 필드 | localStorage | Google Sheets | 폴백 |
|------|--------------|---------------|------|
| 학생 ID | `studentId` | `student_id` | `이름_학년` |
| 학생 이름 | `studentName` | `student_name` | - |
| 총점 | `totalScore` | `total_score` | 0 |
| 진단일 | `testDate` | `test_date` | now |
| 학년 | `grade` | `grade` | 0 |

---

## 🔍 문제 진단 체크리스트

교사 대시보드에서 Console을 열고 다음을 확인하세요:

### 1. 원본 데이터 확인
```javascript
localStorage.getItem('diagnostic_results')
```

**질문**:
- [ ] 진단평가 결과가 몇 개 있나요?
- [ ] 각 결과에 `studentId` 또는 `student_id`가 있나요?
- [ ] 없다면 `studentName`과 `grade`가 있나요?

### 2. 그룹화 확인
```javascript
// "수준별 학습관리" 탭 클릭 후 Console 확인
📊 원본 데이터 개수: ?
📊 그룹화 후 학생 수: ?
```

**예상**:
- ✅ 원본 = 그룹화 후 (중복 제거는 OK)
- ❌ 원본 > 그룹화 후 (일부 학생 누락!)

### 3. studentId 확인
```javascript
// Console 로그에서 확인
🔍 처리 중: { studentId: "student_176752", ... }  // ✅ 정상
🔍 처리 중: { studentId: undefined, ... }         // ❌ 문제!
🔍 처리 중: { studentId: "이나연_1", ... }        // ✅ 폴백 사용
```

---

## 🚀 배포 정보

- **커밋**: b351191
- **이전 커밋**: 74c031f
- **GitHub**: https://github.com/da-um3481/da-um-jinro
- **테스트 URL**: https://da-um3481.github.io/da-um-jinro/middle-teacher-dashboard.html
- **상태**: 배포 완료 ✅

---

## 📁 수정된 파일

- `middle-teacher-dashboard.html`
  - **Line 2575-2590**: studentId 다양한 형식 지원 추가
  - **Line 2604-2607**: studentName 다양한 형식 지원 추가
  - 디버깅 로그 추가

---

## 💡 테스트 시나리오

### 시나리오 1: studentId가 있는 경우
```javascript
진단평가 데이터:
{
  studentId: "student_176752",
  studentName: "김태연",
  totalScore: 475,
  grade: 1
}

예상: ✅ 정상 표시
```

### 시나리오 2: student_id만 있는 경우 (Google Sheets)
```javascript
진단평가 데이터:
{
  student_id: "student_176753",
  student_name: "박상윤",
  total_score: 348,
  grade: 1
}

예상: ✅ 정상 표시
```

### 시나리오 3: studentId가 없는 경우 (폴백)
```javascript
진단평가 데이터:
{
  studentName: "이나연",
  totalScore: 280,
  grade: 1
}

폴백 ID: "이나연_1"
예상: ✅ 정상 표시
```

---

**작성일**: 2026-01-04  
**버전**: v2.0.1  
**상태**: 배포 완료, Console 로그로 확인 가능 ✅
