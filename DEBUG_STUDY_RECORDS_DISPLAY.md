# 🔧 학습 기록 표시 문제 디버깅

## 🚨 문제 상황

### 사용자 보고
```
✅ 학생 선택 드롭다운: 정상 작동 (학생 표시됨)
❌ 학습 기록 표시: 작동 안 함 (빈 화면)
```

### 증상
```
박수은 (중1) 님의 학습 통계

총 학습일: 0일
총 학습 시간: 0시
학습 과목: -
최대 과목: -

📊 매핑 학습 기록
(아직 학습 기록이 없습니다)
```

---

## 🔍 원인 분석

### 가능한 원인
1. **studentId 불일치**: 드롭다운의 `value` (studentId)와 Google Sheets의 `student_id` 불일치
2. **데이터 필터링 오류**: `getStudyRecordsFromCloud()` 함수에서 데이터 필터링 실패
3. **localStorage 데이터 형식**: `study_records`의 `student_id` 형식 불일치
4. **Google Sheets 응답 오류**: Apps Script에서 잘못된 형식 반환

---

## 🔧 해결 방법

### 1️⃣ 상세 디버깅 로그 추가

#### 수정 내용
```javascript
async function loadStudentStudyRecords(studentId) {
    console.log('🔍 [학습 기록] 로드 시작, studentId:', studentId);
    
    // 학생 이름 확인
    const studentName = selectedOption.text;
    console.log('🔍 [학습 기록] 선택된 학생:', studentName);
    
    // Google Sheets 조회
    console.log('🔍 [학습 기록] Google Sheets 조회 시작...');
    const result = await getStudyRecordsFromCloud(studentId);
    console.log('🔍 [학습 기록] Google Sheets 결과:', result);
    
    if (result.status === 'success' && result.data && result.data.length > 0) {
        console.log('✅ [학습 기록] Google Sheets에서', result.data.length, '건 로드');
    } else {
        console.log('⚠️ [학습 기록] Google Sheets 데이터 없음, localStorage 확인...');
        
        // localStorage 확인
        const localRecords = JSON.parse(localStorage.getItem('study_records') || '[]');
        console.log('🔍 [학습 기록] localStorage 전체 기록:', localRecords.length, '건');
        
        // 필터링 과정 상세 로그
        const studentRecords = localRecords.filter(r => {
            const match = r.student_id === studentId;
            if (match) {
                console.log('✅ [학습 기록] 매칭:', r.student_id, '===', studentId);
            }
            return match;
        });
        console.log('🔍 [학습 기록] 필터링 결과:', studentRecords.length, '건');
    }
}
```

---

## 🧪 테스트 방법

### 1️⃣ 강력 새로고침
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### 2️⃣ Console 열기
```
F12 → Console 탭
```

### 3️⃣ 학생 선택
```
📚 학습 관리 → 학생 선택 드롭다운 → 학생 선택
```

### 4️⃣ Console 로그 확인
```javascript
// 예상 로그
🔍 [학습 기록] 로드 시작, studentId: student_176706
🔍 [학습 기록] 선택된 학생: 박수은 (중1)
🔍 [학습 기록] Google Sheets 조회 시작...
🔍 [학습 기록] Google Sheets 결과: { status: 'success', data: [...] }
✅ [학습 기록] Google Sheets에서 5 건 로드
```

또는

```javascript
// localStorage 폴백
🔍 [학습 기록] 로드 시작, studentId: student_176706
🔍 [학습 기록] 선택된 학생: 박수은 (중1)
🔍 [학습 기록] Google Sheets 조회 시작...
🔍 [학습 기록] Google Sheets 결과: { status: 'success', data: [] }
⚠️ [학습 기록] Google Sheets 데이터 없음, localStorage 확인...
🔍 [학습 기록] localStorage 전체 기록: 10 건
✅ [학습 기록] 매칭: student_176706 === student_176706
🔍 [학습 기록] 필터링 결과: 3 건
✅ [학습 기록] localStorage에서 3 건 표시
```

---

## 🔍 디버깅 스크립트

### Console에서 실행할 명령어

#### 1. localStorage 학습 기록 확인
```javascript
const studyRecords = JSON.parse(localStorage.getItem('study_records') || '[]');
console.log('📊 전체 학습 기록:', studyRecords.length, '건');

// 각 기록의 student_id 확인
studyRecords.forEach((record, index) => {
    console.log(`${index + 1}. student_id: ${record.student_id}, student_name: ${record.student_name || record.studentName}, date: ${record.date}, subject: ${record.subject}`);
});
```

#### 2. 드롭다운 선택된 studentId 확인
```javascript
const select = document.getElementById('studentSelectForStudy');
const selectedOption = select.options[select.selectedIndex];
console.log('선택된 studentId:', selectedOption.value);
console.log('선택된 학생명:', selectedOption.text);
```

#### 3. studentId 매칭 테스트
```javascript
const selectedStudentId = document.getElementById('studentSelectForStudy').value;
const studyRecords = JSON.parse(localStorage.getItem('study_records') || '[]');

console.log('선택된 studentId:', selectedStudentId);
console.log('전체 기록 수:', studyRecords.length);

const matches = studyRecords.filter(r => r.student_id === selectedStudentId);
console.log('매칭된 기록 수:', matches.length);

if (matches.length > 0) {
    console.log('매칭된 기록:', matches);
} else {
    console.log('매칭 실패! student_id 확인:');
    studyRecords.forEach((r, i) => {
        console.log(`  ${i+1}. student_id: "${r.student_id}" (type: ${typeof r.student_id})`);
    });
}
```

#### 4. Google Sheets 데이터 확인
```javascript
// 선택된 학생의 studentId로 Google Sheets 조회
const selectedStudentId = document.getElementById('studentSelectForStudy').value;
getStudyRecordsFromCloud(selectedStudentId).then(result => {
    console.log('Google Sheets 결과:', result);
    if (result.status === 'success') {
        console.log('데이터 개수:', result.data?.length || 0);
        console.log('데이터:', result.data);
    }
});
```

---

## 📊 예상 결과

### 케이스 1: Google Sheets에 데이터 있음 ✅
```javascript
🔍 [학습 기록] 로드 시작, studentId: student_002
🔍 [학습 기록] 선택된 학생: 이경희 (중1)
🔍 [학습 기록] Google Sheets 조회 시작...
✅ Google Sheets에서 학습 기록을 불러왔습니다: { status: 'success', data: [5건] }
🔍 [학습 기록] Google Sheets 결과: { status: 'success', data: [...] }
✅ [학습 기록] Google Sheets에서 5 건 로드

→ 학습 기록 테이블에 5건 표시
→ 통계: 총 학습일 3일, 총 학습 시간 2시간 30분
```

### 케이스 2: localStorage에만 데이터 있음 ⚠️
```javascript
🔍 [학습 기록] 로드 시작, studentId: student_176706
🔍 [학습 기록] 선택된 학생: 박수은 (중1)
🔍 [학습 기록] Google Sheets 조회 시작...
✅ Google Sheets에서 학습 기록을 불러왔습니다: { status: 'success', data: [] }
🔍 [학습 기록] Google Sheets 결과: { status: 'success', data: [] }
⚠️ [학습 기록] Google Sheets 데이터 없음, localStorage 확인...
🔍 [학습 기록] localStorage 전체 기록: 10 건
✅ [학습 기록] 매칭: student_176706 === student_176706
🔍 [학습 기록] 필터링 결과: 3 건
✅ [학습 기록] localStorage에서 3 건 표시

→ 학습 기록 테이블에 3건 표시
→ 통계: 총 학습일 2일, 총 학습 시간 1시간 30분
```

### 케이스 3: studentId 불일치 ❌
```javascript
🔍 [학습 기록] 로드 시작, studentId: student_176706
🔍 [학습 기록] 선택된 학생: 박수은 (중1)
🔍 [학습 기록] Google Sheets 조회 시작...
🔍 [학습 기록] Google Sheets 결과: { status: 'success', data: [] }
⚠️ [학습 기록] Google Sheets 데이터 없음, localStorage 확인...
🔍 [학습 기록] localStorage 전체 기록: 10 건
🔍 [학습 기록] 필터링 결과: 0 건
📭 [학습 기록] 학습 기록 없음

→ "아직 학습 기록이 없습니다" 메시지 표시

원인:
- localStorage의 student_id: "student_176706_박수은" (이름 포함)
- 드롭다운의 studentId: "student_176706" (이름 미포함)
→ 매칭 실패!
```

---

## 💡 예상 원인별 해결책

### 원인 1: studentId 형식 불일치
```javascript
// localStorage 확인
const studyRecords = JSON.parse(localStorage.getItem('study_records') || '[]');
studyRecords.forEach(r => console.log(r.student_id));

// 예상 결과:
// - student_002
// - student_176706
// - student_176752
// 또는
// - student_002_이경희  ← 이름 포함!
// - student_176706_박수은  ← 이름 포함!

// 해결: loadStudentStudyRecords에서 부분 매칭 사용
const studentRecords = localRecords.filter(r => 
    r.student_id === studentId || 
    r.student_id.startsWith(studentId + '_')
);
```

### 원인 2: Google Sheets Apps Script 미구현
```javascript
// Apps Script에 getStudyRecords 액션이 없음
// → 항상 빈 배열 반환

// 해결: Apps Script에 다음 코드 추가
function getStudyRecords(studentId) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('study_records');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const records = rows.map(row => {
        const obj = {};
        headers.forEach((header, i) => {
            obj[header] = row[i];
        });
        return obj;
    });
    
    if (studentId) {
        return records.filter(r => r.student_id === studentId);
    }
    return records;
}
```

---

## ✅ 다음 단계

1. **강력 새로고침** (Ctrl+Shift+R)
2. **학생 선택**
3. **Console 로그 확인** (위 스크립트 실행)
4. **결과 공유**: Console 스크린샷 + localStorage 데이터

---

**Console 로그를 공유해주시면 정확한 원인을 찾을 수 있습니다!** 🔍
