# 🔍 진단: 진단평가 데이터 확인 스크립트

## Console에서 실행할 명령어

### 1. 진단평가 결과 데이터 확인
```javascript
// F12 → Console에서 실행

// 1. 진단평가 결과 전체 데이터 확인
const diagnosticResults = JSON.parse(localStorage.getItem('diagnostic_results')) || [];
console.log('📊 전체 진단평가 결과:', diagnosticResults);
console.log('📊 전체 개수:', diagnosticResults.length);

// 2. 중학생만 필터링
const middleSchool = diagnosticResults.filter(result => {
    const grade = result.grade || parseInt(result.student_id?.split('_')[1]) || 0;
    return grade <= 3;
});
console.log('📊 중학생 진단평가 결과:', middleSchool);
console.log('📊 중학생 개수:', middleSchool.length);

// 3. 각 학생의 studentId 확인
middleSchool.forEach((result, index) => {
    console.log(`${index + 1}. studentId: ${result.studentId || result.student_id || 'undefined'}, name: ${result.studentName || result.student_name}, grade: ${result.grade}`);
});

// 4. studentId가 없는 학생 찾기
const noId = middleSchool.filter(r => !r.studentId && !r.student_id);
console.log('⚠️ studentId가 없는 학생:', noId);
console.log('⚠️ studentId 없는 학생 수:', noId.length);

// 5. 중복된 학생 확인
const studentMap = new Map();
middleSchool.forEach(result => {
    const id = result.studentId || result.student_id;
    if (id) {
        if (studentMap.has(id)) {
            console.log('🔁 중복 발견:', id);
        }
        studentMap.set(id, result);
    }
});
console.log('📊 고유 학생 수 (ID 있는 경우):', studentMap.size);
```

### 2. 수준별 학습관리 데이터 확인
```javascript
// 수준별 학습관리 탭을 클릭한 후 실행

// 수준별 학습관리 로그 확인
// Console에 다음 로그가 자동으로 출력됩니다:
// 📊 수준별 학습관리 원본 데이터: Array(?)
// 📊 원본 데이터 개수: ?
// 🔍 처리 중: { studentId, name, grade }
// 📊 그룹화 후 학생 수: ?
```

### 3. 진단평가 결과 섹션 vs 수준별 학습관리 비교
```javascript
// 진단평가 결과 탭 데이터
const diagnosticData = diagnosticResults.filter(result => {
    return result.grade && result.grade <= 3;
});

// 수준별 학습관리 탭 데이터
const middleSchoolDiagnostics = diagnosticResults.filter(result => {
    const grade = result.grade || parseInt(result.student_id?.split('_')[1]) || 0;
    return grade <= 3;
});

// 학생별 그룹화
const studentMap = new Map();
middleSchoolDiagnostics.forEach(result => {
    const studentId = result.studentId || result.student_id || `${result.studentName || result.student_name}_${result.grade}`;
    const existingResult = studentMap.get(studentId);
    if (!existingResult || new Date(result.testDate || result.test_date) > new Date(existingResult.testDate || existingResult.test_date)) {
        studentMap.set(studentId, result);
    }
});

console.log('📊 진단평가 결과 섹션:', diagnosticData.length, '명');
console.log('📊 수준별 학습관리 (그룹화 전):', middleSchoolDiagnostics.length, '명');
console.log('📊 수준별 학습관리 (그룹화 후):', studentMap.size, '명');

// 차이 확인
if (diagnosticData.length !== studentMap.size) {
    console.warn('⚠️ 학생 수 불일치!');
    console.warn('진단평가 결과:', diagnosticData.length);
    console.warn('수준별 학습관리:', studentMap.size);
}
```

---

## 📊 예상 결과

### 케이스 1: studentId가 모두 있는 경우 ✅
```javascript
📊 전체 개수: 5
📊 중학생 개수: 5
1. studentId: student_176752, name: 박상윤, grade: 1
2. studentId: student_176753, name: 성동현, grade: 3
3. studentId: student_176754, name: 김태연, grade: 1
4. studentId: student_176755, name: 손최로, grade: 1
5. studentId: student_176756, name: 테스트, grade: 1
⚠️ studentId 없는 학생 수: 0
📊 고유 학생 수: 5

결과: ✅ 모든 학생이 정상적으로 표시됩니다!
```

### 케이스 2: studentId가 일부 없는 경우 ⚠️
```javascript
📊 전체 개수: 10
📊 중학생 개수: 10
1. studentId: student_176752, name: 박상윤, grade: 1
2. studentId: student_176753, name: 성동현, grade: 3
3. studentId: student_176754, name: 김태연, grade: 1
4. studentId: student_176755, name: 손최로, grade: 1
5. studentId: student_176756, name: 테스트, grade: 1
6. studentId: undefined, name: 이나연, grade: 1  ← 문제!
7. studentId: undefined, name: 정서윤, grade: 2  ← 문제!
8. studentId: undefined, name: 김민준, grade: 3  ← 문제!
9. studentId: undefined, name: 최지우, grade: 1  ← 문제!
10. studentId: undefined, name: 박서준, grade: 2  ← 문제!
⚠️ studentId 없는 학생 수: 5
📊 고유 학생 수: 5  ← 5명만 표시됨!

결과: ❌ studentId 없는 학생이 덮어씌워져 5명만 표시됩니다!
```

### 케이스 3: 폴백 적용 후 ✅
```javascript
📊 전체 개수: 10
📊 중학생 개수: 10
🔍 처리 중: { studentId: "student_176752", name: "박상윤", grade: 1 }
🔍 처리 중: { studentId: "이나연_1", name: "이나연", grade: 1 }  ← 폴백!
🔍 처리 중: { studentId: "정서윤_2", name: "정서윤", grade: 2 }  ← 폴백!
📊 그룹화 후 학생 수: 10

결과: ✅ 폴백으로 모든 학생이 표시됩니다!
```

---

## 🎯 진단 결과에 따른 조치

### 결과 1: studentId 없는 학생 수 = 0
→ **문제 없음!** 모든 학생이 정상적으로 표시됩니다.

### 결과 2: studentId 없는 학생 수 > 0
→ **문제 발견!** 폴백 처리가 필요합니다.
→ **이미 수정 완료!** 강력 새로고침 (Ctrl + Shift + R) 필요

### 결과 3: 중복된 학생 발견
→ 같은 학생이 여러 번 진단평가를 한 경우
→ 최신 결과만 표시됩니다 (정상 동작)

---

## 🔧 해결 방법

### 이미 배포된 수정 사항
```javascript
// 폴백 처리 추가됨 (커밋 b351191)
const studentId = result.studentId           
                  || result.student_id        
                  || `${result.studentName || result.student_name}_${result.grade}`;
```

### 적용 방법
1. **강력 새로고침**: Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)
2. **캐시 삭제**: Ctrl + Shift + Delete → 캐시 삭제
3. **시크릿 모드**: Ctrl + Shift + N → 테스트

---

## 📞 결과 공유 부탁

위 스크립트를 실행한 후 다음을 공유해주세요:

1. **전체 개수**: ?
2. **중학생 개수**: ?
3. **studentId 없는 학생 수**: ?
4. **고유 학생 수**: ?

예시:
```
전체 개수: 10
중학생 개수: 10
studentId 없는 학생 수: 5
고유 학생 수: 5 ← 문제!
```

이 정보로 정확한 원인을 파악할 수 있습니다! 😊
