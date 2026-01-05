# 📋 완전한 Google Apps Script 코드 (ES5 호환)

## 🎯 사용 방법

### 1️⃣ Apps Script 열기
```
Google Sheets → 확장 프로그램 → Apps Script
```

### 2️⃣ 기존 코드 전체 삭제
```
Ctrl+A → Delete
```

### 3️⃣ 아래 코드 전체 복사 & 붙여넣기
```
아래 전체 코드 복사 → Ctrl+V
```

### 4️⃣ 저장 & 배포
```
1. Ctrl+S (저장)
2. 배포 → 배포 관리 → 편집 → 새 버전 → 배포
```

---

## ✅ **완전한 Apps Script 코드**

```javascript
/**
 * 자기주도학습UP 시스템 - Google Apps Script
 * 
 * 기능:
 * 1. 진단평가 결과 저장 및 조회
 * 2. 학습 기록 저장 및 조회
 * 3. 교사 피드백 저장 및 조회
 * 
 * ES5 호환 (var, for 루프 사용)
 */

// ============================================================
// 메인 처리 함수
// ============================================================
function doGet(e) {
  try {
    var action = e.parameter.action;
    
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
    Logger.log('doGet 오류: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}

// ============================================================
// POST 요청 처리
// ============================================================
function doPost(e) {
  try {
    var action = e.parameter.action;
    
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
    Logger.log('doPost 오류: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}

// ============================================================
// 유틸리티 함수: JSON 응답 생성
// ============================================================
function createJsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// 1. 진단평가 결과 조회
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
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = data.slice(1);
    
    var results = [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (!row[0]) continue;
      
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = row[j];
      }
      results.push(obj);
    }
    
    Logger.log('진단평가 결과 개수: ' + results.length);
    
    return createJsonResponse({
      status: 'success',
      data: results
    });
    
  } catch (error) {
    Logger.log('getDiagnosticResults 오류: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}

// ============================================================
// 2. 진단평가 결과 저장
// ============================================================
function saveDiagnosticResult(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('diagnostic_results');
    
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('diagnostic_results');
      sheet.appendRow([
        'student_id', 'student_name', 'grade', 'class', 'number',
        'test_date', 'subject', 'score', 'total_score', 'level',
        'created_at'
      ]);
    }
    
    var studentId = e.parameter.student_id || '';
    var studentName = e.parameter.student_name || '';
    var grade = e.parameter.grade || '';
    var classNum = e.parameter.class || '';
    var number = e.parameter.number || '';
    var testDate = e.parameter.test_date || new Date().toISOString();
    var subject = e.parameter.subject || '';
    var score = e.parameter.score || 0;
    var totalScore = e.parameter.total_score || 0;
    var level = e.parameter.level || '';
    var createdAt = new Date().toISOString();
    
    sheet.appendRow([
      studentId, studentName, grade, classNum, number,
      testDate, subject, score, totalScore, level,
      createdAt
    ]);
    
    Logger.log('진단평가 저장 완료: ' + studentId);
    
    return createJsonResponse({
      status: 'success',
      message: '진단평가 결과가 저장되었습니다',
      data: { student_id: studentId }
    });
    
  } catch (error) {
    Logger.log('saveDiagnosticResult 오류: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}

// ============================================================
// 3. 학습 기록 조회 (getStudyRecords)
// ============================================================
function getStudyRecords(e) {
  try {
    var studentId = e.parameter.student_id;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('study_records');
    
    if (!sheet) {
      return createJsonResponse({
        status: 'error',
        message: 'study_records 시트를 찾을 수 없습니다',
        data: []
      });
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = data.slice(1);
    
    var records = [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (!row[0]) continue;
      
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
    Logger.log('getStudyRecords 오류: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}

// ============================================================
// 4. 학습 기록 저장
// ============================================================
function saveStudyRecord(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('study_records');
    
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('study_records');
      sheet.appendRow([
        'student_id', 'student_name', 'date', 'subject', 'study_time',
        'progress', 'content', 'created_at'
      ]);
    }
    
    var studentId = e.parameter.student_id || '';
    var studentName = e.parameter.student_name || '';
    var date = e.parameter.date || new Date().toISOString().split('T')[0];
    var subject = e.parameter.subject || '';
    var studyTime = e.parameter.study_time || 0;
    var progress = e.parameter.progress || '';
    var content = e.parameter.content || '';
    var createdAt = new Date().toISOString();
    
    sheet.appendRow([
      studentId, studentName, date, subject, studyTime,
      progress, content, createdAt
    ]);
    
    Logger.log('학습 기록 저장 완료: ' + studentId);
    
    return createJsonResponse({
      status: 'success',
      message: '학습 기록이 저장되었습니다',
      data: { student_id: studentId }
    });
    
  } catch (error) {
    Logger.log('saveStudyRecord 오류: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}

// ============================================================
// 5. 교사 피드백 조회
// ============================================================
function getTeacherFeedback(e) {
  try {
    var studentId = e.parameter.student_id;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('teacher_feedback');
    
    if (!sheet) {
      return createJsonResponse({
        status: 'error',
        message: 'teacher_feedback 시트를 찾을 수 없습니다',
        data: []
      });
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = data.slice(1);
    
    var feedbacks = [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (!row[0]) continue;
      
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = row[j];
      }
      
      if (studentId && String(obj.student_id).trim() === String(studentId).trim()) {
        feedbacks.push(obj);
      } else if (!studentId) {
        feedbacks.push(obj);
      }
    }
    
    Logger.log('교사 피드백 개수: ' + feedbacks.length);
    
    return createJsonResponse({
      status: 'success',
      data: feedbacks
    });
    
  } catch (error) {
    Logger.log('getTeacherFeedback 오류: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}

// ============================================================
// 6. 교사 피드백 저장
// ============================================================
function saveTeacherFeedback(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('teacher_feedback');
    
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('teacher_feedback');
      sheet.appendRow([
        'student_id', 'student_name', 'feedback', 'date', 'created_at'
      ]);
    }
    
    var studentId = e.parameter.student_id || '';
    var studentName = e.parameter.student_name || '';
    var feedback = e.parameter.feedback || '';
    var date = e.parameter.date || new Date().toISOString().split('T')[0];
    var createdAt = new Date().toISOString();
    
    sheet.appendRow([
      studentId, studentName, feedback, date, createdAt
    ]);
    
    Logger.log('교사 피드백 저장 완료: ' + studentId);
    
    return createJsonResponse({
      status: 'success',
      message: '교사 피드백이 저장되었습니다',
      data: { student_id: studentId }
    });
    
  } catch (error) {
    Logger.log('saveTeacherFeedback 오류: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}
```

---

## 📊 **코드 구조**

### 메인 함수
- `doGet(e)` - GET 요청 처리
- `doPost(e)` - POST 요청 처리

### 진단평가
- `getDiagnosticResults()` - 진단평가 결과 조회
- `saveDiagnosticResult(e)` - 진단평가 결과 저장

### 학습 기록
- `getStudyRecords(e)` - 학습 기록 조회 ⭐ **핵심 기능**
- `saveStudyRecord(e)` - 학습 기록 저장

### 교사 피드백
- `getTeacherFeedback(e)` - 교사 피드백 조회
- `saveTeacherFeedback(e)` - 교사 피드백 저장

### 유틸리티
- `createJsonResponse(obj)` - JSON 응답 생성

---

## ✅ **특징**

### 1️⃣ ES5 완벽 호환
```javascript
✅ var 사용 (const/let 없음)
✅ for 루프 사용 (화살표 함수 없음)
✅ .indexOf() 사용 (.startsWith() 없음)
✅ 문자열 연결 사용 (템플릿 리터럴 없음)
```

### 2️⃣ 에러 처리
```javascript
✅ try-catch로 모든 함수 보호
✅ Logger.log로 디버깅 로그
✅ 상세한 에러 메시지
```

### 3️⃣ 시트 자동 생성
```javascript
✅ 시트가 없으면 자동 생성
✅ 헤더 자동 추가
✅ 데이터 구조 일관성
```

---

## 🧪 **테스트 방법**

### 1️⃣ Apps Script에서 테스트
```
1. 실행 → 함수 실행 → doGet
2. 권한 승인 (처음만)
3. 하단 "실행 로그" 확인
```

### 2️⃣ 배포
```
1. 배포 → 배포 관리
2. 새 배포 또는 편집 → 새 버전
3. 웹 앱 URL 복사
```

### 3️⃣ 교사 대시보드 테스트
```
1. Ctrl+Shift+R (강력 새로고침)
2. 📚 학습 관리 → 학생 선택
3. F12 → Console 확인
```

---

## 🔗 **Google Sheets 시트 구조**

### 필요한 시트
1. `diagnostic_results` - 진단평가 결과
2. `study_records` - 학습 기록 ⭐
3. `teacher_feedback` - 교사 피드백

### study_records 컬럼
```
student_id | student_name | date | subject | study_time | progress | content | created_at
```

---

## 💡 **핵심 요약**

1. ✅ **완전한 코드** - 모든 기능 포함
2. ✅ **ES5 호환** - 구문 오류 없음
3. ✅ **에러 처리** - 안정적 동작
4. ✅ **자동 생성** - 시트 자동 생성

---

**이 코드를 전체 복사해서 붙여넣으면 바로 작동합니다!** 😊
