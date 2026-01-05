# ✅ Apps Script ES5 호환 코드 (구문 오류 해결)

## 🚨 문제
**Line 224: Syntax error** - `const`와 화살표 함수(`=>`)를 Apps Script가 지원하지 않음

## ✅ **완전 호환 코드 (ES5)**

### 📋 **전체 코드 (복사 후 붙여넣기)**

Apps Script 편집기에서 **Line 101-130을 완전히 삭제**하고 아래 코드로 교체:

```javascript
  if (action === 'getStudyRecords') {
    try {
      var studentId = e.parameter.student_id;
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('study_records');
      
      if (!sheet) {
        return ContentService.createTextOutput(
          JSON.stringify({ 
            status: 'error', 
            message: 'study_records 시트를 찾을 수 없습니다',
            data: [] 
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      
      var data = sheet.getDataRange().getValues();
      var headers = data[0];
      var rows = data.slice(1);
      
      var records = [];
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!row[0]) continue;  // 빈 행 제외
        
        var obj = {};
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = row[j];
        }
        records.push(obj);
      }
      
      Logger.log('전체 학습 기록 개수: ' + records.length);
      
      var filtered = [];
      if (studentId) {
        for (var k = 0; k < records.length; k++) {
          var record = records[k];
          var recordStudentId = String(record.student_id || record.studentId || '').trim();
          var targetStudentId = String(studentId).trim();
          
          Logger.log('비교: ' + recordStudentId + ' === ' + targetStudentId);
          
          if (recordStudentId === targetStudentId || 
              recordStudentId.indexOf(targetStudentId + '_') === 0) {
            filtered.push(record);
          }
        }
        
        Logger.log('필터링된 기록 개수: ' + filtered.length);
        
        return ContentService.createTextOutput(
          JSON.stringify({ status: 'success', data: filtered })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      
      // student_id 파라미터가 없으면 전체 반환
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'success', data: records })
      ).setMimeType(ContentService.MimeType.JSON);
      
    } catch (error) {
      Logger.log('getStudyRecords 오류: ' + error.message);
      return ContentService.createTextOutput(
        JSON.stringify({ 
          status: 'error', 
          message: error.message,
          data: [] 
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }
```

---

## 🔧 **적용 방법**

### 1️⃣ **Line 101-130 완전 삭제**
```
1. Line 101부터 Line 130까지 전체 선택
2. Delete 키로 삭제
```

### 2️⃣ **위 코드 붙여넣기**
```
1. 위 코드 전체 복사 (Ctrl+A, Ctrl+C)
2. Line 101 위치에 붙여넣기 (Ctrl+V)
```

### 3️⃣ **저장**
```
Ctrl + S
```

### 4️⃣ **재배포**
```
1. 배포 → 배포 관리
2. 편집 (연필 아이콘)
3. 버전 → 새 버전
4. 배포
```

---

## 📊 **수정 전후 비교**

### ❌ 수정 전 (ES6 - 오류 발생)
```javascript
const studentId = e.parameter.student_id;  // ← const 오류!
const records = rows
  .filter(row => row[0])  // ← 화살표 함수 오류!
  .map(row => {           // ← 화살표 함수 오류!
    // ...
  });
```

### ✅ 수정 후 (ES5 - 완벽 호환)
```javascript
var studentId = e.parameter.student_id;  // ← var 사용
var records = [];
for (var i = 0; i < rows.length; i++) {  // ← for 루프 사용
  var row = rows[i];
  if (!row[0]) continue;
  // ...
  records.push(obj);
}
```

---

## 🧪 **테스트 방법**

### 1️⃣ Apps Script 저장 & 재배포
```
Ctrl + S → 배포 → 배포 관리 → 편집 → 새 버전 → 배포
```

### 2️⃣ 교사 대시보드 테스트
```
1. Ctrl+Shift+R (강력 새로고침)
2. 📚 학습 관리 → 박수은 (중1) 선택
3. F12 (Console 열기)
```

### 3️⃣ 예상 결과
```javascript
✅ 클라우드에서 학습 기록을 불러왔습니다: { status: "success", data: [1건] }
🔍 [학습 기록] Google Sheets 결과: { status: "success", data: [{...}] }
✅ [학습 기록] Google Sheets에서 1 건 로드

학습 기록 테이블:
날짜          과목    학습 시간    진도    내용
2026-01-05   사회     -           -      학습 완료
```

---

## 🔍 **Apps Script 로그 확인**

### 실행 로그 확인 방법
```
1. Apps Script 편집기
2. 상단 메뉴: 보기 → 실행 로그
3. 또는: Ctrl + Enter (함수 실행)
```

### 예상 로그
```
전체 학습 기록 개수: 13
비교: student_176706 === student_176706
필터링된 기록 개수: 1
```

---

## ✅ **체크리스트**

- [ ] Line 101-130 완전 삭제
- [ ] 위 ES5 코드 붙여넣기
- [ ] Ctrl+S 저장
- [ ] 배포 → 배포 관리 → 편집 → 새 버전 → 배포
- [ ] 교사 대시보드 강력 새로고침 (Ctrl+Shift+R)
- [ ] 학생 선택 (박수은 중1)
- [ ] Console 로그 확인
- [ ] 학습 기록 표시 확인

---

## 💡 **핵심 변경 사항**

1. ✅ `const` → `var` (모든 변수)
2. ✅ `let` → `var` (모든 변수)
3. ✅ 화살표 함수 → `function` 또는 `for` 루프
4. ✅ `.filter()` → `for` 루프 + `if` + `push()`
5. ✅ `.map()` → `for` 루프 + `push()`
6. ✅ `.startsWith()` → `.indexOf() === 0`
7. ✅ 템플릿 리터럴 → 문자열 연결 (`+`)

---

## 📝 **문제 해결 흐름**

```
❌ Line 224 구문 오류
   ↓
✅ const/let → var
✅ 화살표 함수 → for 루프
✅ .startsWith() → .indexOf()
   ↓
✅ ES5 완벽 호환 코드
   ↓
✅ 저장 & 재배포
   ↓
✅ 교사 대시보드 테스트
   ↓
✅ 학습 기록 표시 성공!
```

---

**수정 후 결과를 알려주세요!** 😊
