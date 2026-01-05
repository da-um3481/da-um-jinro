# 🔧 Apps Script - doGet 파라미터 오류 해결

## 🎯 문제
```
cannot read properties of undefined (reading 'parameter')
```

## ✅ 해결 방법

`doGet` 함수를 다음과 같이 수정하세요:

### ❌ 잘못된 코드
```javascript
function doGet(e) {
  try {
    var action = e.parameter.action;  // ← 오류 발생!
    // ...
```

### ✅ 올바른 코드
```javascript
function doGet(e) {
  try {
    // e가 없거나 e.parameter가 없는 경우 빈 객체 사용
    var params = e && e.parameter ? e.parameter : {};
    var action = params.action || '';
    
    Logger.log('Action: ' + action);
    
    // ============================================================
    // 1. 진단평가 결과 조회
    // ============================================================
    if (action === 'getDiagnosticResults') {
      return getDiagnosticResults();
    }
    
    // ============================================================
    // 2. 진단평가 결과 저장
    // ============================================================
    if (action === 'saveDiagnosticResult') {
      return saveDiagnosticResult(e);
    }
    
    // ============================================================
    // 3. 학습 기록 조회 (getStudyRecords)
    // ============================================================
    if (action === 'getStudyRecords') {
      return getStudyRecords(e);
    }
    
    // ============================================================
    // 4. 학습 기록 저장
    // ============================================================
    if (action === 'saveStudyRecord') {
      return saveStudyRecord(e);
    }
    
    // ============================================================
    // 5. 교사 피드백 조회
    // ============================================================
    if (action === 'getTeacherFeedback') {
      return getTeacherFeedback(e);
    }
    
    // ============================================================
    // 6. 교사 피드백 저장
    // ============================================================
    if (action === 'saveTeacherFeedback') {
      return saveTeacherFeedback(e);
    }
    
    // ============================================================
    // 알 수 없는 액션
    // ============================================================
    return createJsonResponse({
      status: 'error',
      message: '알 수 없는 액션: ' + action,
      data: []
    });
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}

// ============================================================
// createJsonResponse 함수 (필수!)
// ============================================================
function createJsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## 📋 전체 수정 순서

### 1️⃣ doGet 함수 수정
위의 코드로 `doGet` 함수를 교체하세요.

### 2️⃣ getStudyRecords 함수 수정 (APPS_SCRIPT_FIX_UNDEFINED.md 참고)
```javascript
function getStudyRecords(e) {
  try {
    // e가 없는 경우 대비
    var params = e && e.parameter ? e.parameter : {};
    var studentId = params.student_id || '';
    var groupBy = params.group_by || '';
    
    // ... 나머지 코드
```

### 3️⃣ 다른 함수들도 동일하게 수정
모든 함수에서 `e.parameter`를 사용하는 부분을 다음과 같이 수정:

```javascript
function saveStudyRecord(e) {
  var params = e && e.parameter ? e.parameter : {};
  // 이제 params를 사용
}

function getTeacherFeedback(e) {
  var params = e && e.parameter ? e.parameter : {};
  var studentId = params.student_id || '';
  // ...
}
```

---

## 🚀 빠른 적용 (완전한 코드)

아래 전체 코드를 복사하여 Apps Script에 붙여넣으세요:

```javascript
/**
 * 자기주도학습UP 시스템 - Google Apps Script
 * ES5 호환 코드 (var, for 루프 사용)
 */

// ============================================================
// 메인 처리 함수
// ============================================================
function doGet(e) {
  try {
    // e 파라미터 안전하게 처리
    var params = e && e.parameter ? e.parameter : {};
    var action = params.action || '';
    
    Logger.log('Action: ' + action);
    
    if (action === 'getDiagnosticResults') {
      return getDiagnosticResults();
    }
    
    if (action === 'saveDiagnosticResult') {
      return saveDiagnosticResult(e);
    }
    
    if (action === 'getStudyRecords') {
      return getStudyRecords(e);
    }
    
    if (action === 'saveStudyRecord') {
      return saveStudyRecord(e);
    }
    
    if (action === 'getTeacherFeedback') {
      return getTeacherFeedback(e);
    }
    
    if (action === 'saveTeacherFeedback') {
      return saveTeacherFeedback(e);
    }
    
    return createJsonResponse({
      status: 'error',
      message: '알 수 없는 액션: ' + action,
      data: []
    });
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}

// ============================================================
// doPost 함수
// ============================================================
function doPost(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};
    var action = params.action || '';
    
    Logger.log('POST Action: ' + action);
    
    if (action === 'saveDiagnosticResult') {
      return saveDiagnosticResult(e);
    }
    
    if (action === 'saveStudyRecord') {
      return saveStudyRecord(e);
    }
    
    if (action === 'saveTeacherFeedback') {
      return saveTeacherFeedback(e);
    }
    
    return createJsonResponse({
      status: 'error',
      message: '알 수 없는 POST 액션: ' + action,
      data: []
    });
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}

// ============================================================
// JSON 응답 생성
// ============================================================
function createJsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// 진단평가 결과 조회
// ============================================================
function getDiagnosticResults() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('diagnostic_results');
    if (!sheet) {
      return createJsonResponse({
        status: 'error',
        message: 'diagnostic_results 시트를 찾을 수 없습니다',
        data: []
      });
    }
    
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    
    if (values.length <= 1) {
      return createJsonResponse({
        status: 'success',
        data: []
      });
    }
    
    var headers = values[0];
    var results = [];
    
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var result = {};
      
      for (var j = 0; j < headers.length; j++) {
        result[headers[j]] = row[j];
      }
      
      results.push(result);
    }
    
    return createJsonResponse({
      status: 'success',
      data: results
    });
    
  } catch (error) {
    Logger.log('Error in getDiagnosticResults: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}

// ============================================================
// 학습 기록 조회 (학생별 그룹화 지원)
// ============================================================
function getStudyRecords(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};
    var studentId = params.student_id || '';
    var groupBy = params.group_by || '';
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('study_records');
    if (!sheet) {
      return createJsonResponse({
        status: 'error',
        message: 'study_records 시트를 찾을 수 없습니다',
        data: []
      });
    }
    
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    
    if (values.length <= 1) {
      return createJsonResponse({
        status: 'success',
        data: []
      });
    }
    
    var headers = values[0];
    var records = [];
    
    Logger.log('헤더: ' + JSON.stringify(headers));
    
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var record = {};
      
      for (var j = 0; j < headers.length; j++) {
        var key = String(headers[j]).trim();
        var value = row[j];
        
        if (value === '' || value === null || value === undefined) {
          record[key] = '';
        } else {
          record[key] = value;
        }
      }
      
      records.push(record);
    }
    
    Logger.log('전체 학습 기록 개수: ' + records.length);
    if (records.length > 0) {
      Logger.log('첫 번째 레코드 샘플: ' + JSON.stringify(records[0]));
    }
    
    // 학생별 그룹화
    if (groupBy === 'student') {
      var grouped = {};
      
      for (var k = 0; k < records.length; k++) {
        var record = records[k];
        
        var studName = record.student_name 
                    || record.studentName 
                    || record.name
                    || record['학생이름']
                    || record['이름']
                    || '알 수 없음';
        
        var studId = record.student_id 
                  || record.studentId 
                  || record.id
                  || '';
        
        if (k < 3) {
          Logger.log('레코드 ' + k + ' - 이름: ' + studName + ', ID: ' + studId);
        }
        
        if (!grouped[studName]) {
          grouped[studName] = {
            studentName: studName,
            studentId: studId,
            records: [],
            totalMinutes: 0,
            subjectStats: {}
          };
        }
        
        grouped[studName].records.push(record);
        
        var time = parseInt(record.time || record['시간'] || 0);
        grouped[studName].totalMinutes += time;
        
        var subject = record.subject || record['과목'] || '기타';
        if (!grouped[studName].subjectStats[subject]) {
          grouped[studName].subjectStats[subject] = {
            count: 0,
            totalMinutes: 0
          };
        }
        grouped[studName].subjectStats[subject].count++;
        grouped[studName].subjectStats[subject].totalMinutes += time;
      }
      
      var result = [];
      for (var name in grouped) {
        if (grouped.hasOwnProperty(name)) {
          result.push(grouped[name]);
        }
      }
      
      result.sort(function(a, b) {
        if (a.studentName < b.studentName) return -1;
        if (a.studentName > b.studentName) return 1;
        return 0;
      });
      
      Logger.log('그룹화 결과: ' + result.length + '명');
      
      return createJsonResponse({
        status: 'success',
        data: result,
        message: result.length + '명의 학생 학습 기록'
      });
    }
    
    // 특정 학생 필터링
    if (studentId) {
      var filtered = [];
      var targetStudentId = String(studentId).trim();
      
      for (var m = 0; m < records.length; m++) {
        var record = records[m];
        var recordStudentId = String(record.student_id || record.studentId || '').trim();
        
        if (recordStudentId === targetStudentId || recordStudentId.indexOf(targetStudentId + '_') === 0) {
          filtered.push(record);
        }
      }
      
      Logger.log('필터링된 기록 개수: ' + filtered.length);
      
      return createJsonResponse({
        status: 'success',
        data: filtered
      });
    }
    
    return createJsonResponse({
      status: 'success',
      data: records
    });
    
  } catch (error) {
    Logger.log('Error in getStudyRecords: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}

// ============================================================
// 나머지 함수들 (saveDiagnosticResult, saveStudyRecord 등)
// COMPLETE_APPS_SCRIPT.md 참고하여 추가
// ============================================================
```

---

## ✅ 적용 후 테스트

1. **Ctrl+S** (저장)
2. **실행 → doGet**
3. 오류 없이 실행되는지 확인
4. **배포 → 새 버전 → 배포**
5. 교사 대시보드에서 테스트

