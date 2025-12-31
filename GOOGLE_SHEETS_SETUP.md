# Google Sheets 자동화 설정 가이드

## 1. Google Sheets 생성

### Sheet 1: 학생 학습 기록 (study_records)
| student_id | student_name | date | subject | study_time | progress | content | timestamp |
|------------|--------------|------|---------|------------|----------|---------|-----------|
| student_001 | 김철수 | 2025-12-31 | 수학 | 90 | p.25-35 | 이차방정식 학습 | 2025-12-31T14:30:00Z |

### Sheet 2: 진단평가 결과 (diagnostic_results)
| student_id | student_name | grade | total_score | level | math | english | korean | social | science | test_date |
|------------|--------------|-------|-------------|-------|------|---------|--------|--------|---------|-----------|
| student_001 | 김철수 | 1 | 42 | 표준 | 8 | 9 | 8 | 9 | 8 | 2025-12-31 |

### Sheet 3: 선생님 피드백 (teacher_feedback)
| student_id | student_name | date | feedback_type | content | is_read | created_at |
|------------|--------------|------|---------------|---------|---------|------------|
| student_001 | 김철수 | 2025-12-31 | daily | 오늘 학습 잘했어요! | false | 2025-12-31T20:00:00Z |

### Sheet 4: AI 피드백 (ai_feedback)
| student_id | date | emoji | title | summary | strengths | improvements | tips | timestamp |
|------------|------|-------|-------|---------|-----------|--------------|------|-----------|
| student_001 | 2025-12-31 | 🎉 | 훌륭해요! | 오늘도... | [...] | [...] | [...] | 2025-12-31T22:00:00Z |

---

## 2. Google Apps Script 설정

1. Google Sheets 열기
2. **확장 프로그램** → **Apps Script**
3. 아래 코드 붙여넣기:

```javascript
function doGet(e) {
  const action = e.parameter.action;
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'getStudyRecords') {
    return getStudyRecords(e, sheet);
  } else if (action === 'saveStudyRecord') {
    return saveStudyRecord(e, sheet);
  } else if (action === 'getDiagnosticResults') {
    return getDiagnosticResults(e, sheet);
  } else if (action === 'saveDiagnosticResult') {
    return saveDiagnosticResult(e, sheet);
  } else if (action === 'getFeedback') {
    return getFeedback(e, sheet);
  } else if (action === 'saveFeedback') {
    return saveFeedback(e, sheet);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: 'Unknown action'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  return doGet(e);
}

// 학습 기록 저장
function saveStudyRecord(e, sheet) {
  try {
    const data = JSON.parse(e.postData.contents);
    const studySheet = sheet.getSheetByName('study_records') || sheet.insertSheet('study_records');
    
    studySheet.appendRow([
      data.student_id,
      data.student_name,
      data.date,
      data.subject,
      data.study_time,
      data.progress,
      data.content,
      new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Study record saved'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 학습 기록 조회
function getStudyRecords(e, sheet) {
  try {
    const studentId = e.parameter.student_id;
    const studySheet = sheet.getSheetByName('study_records');
    
    if (!studySheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = studySheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    let records = rows.map(row => {
      let record = {};
      headers.forEach((header, index) => {
        record[header] = row[index];
      });
      return record;
    });
    
    if (studentId) {
      records = records.filter(r => r.student_id === studentId);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: records
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 진단평가 결과 저장
function saveDiagnosticResult(e, sheet) {
  try {
    const data = JSON.parse(e.postData.contents);
    const diagnosticSheet = sheet.getSheetByName('diagnostic_results') || sheet.insertSheet('diagnostic_results');
    
    diagnosticSheet.appendRow([
      data.student_id,
      data.student_name,
      data.grade,
      data.total_score,
      data.level,
      data.math_score,
      data.english_score,
      data.korean_score,
      data.social_score,
      data.science_score,
      data.test_date,
      new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Diagnostic result saved'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 진단평가 결과 조회
function getDiagnosticResults(e, sheet) {
  try {
    const diagnosticSheet = sheet.getSheetByName('diagnostic_results');
    
    if (!diagnosticSheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = diagnosticSheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const records = rows.map(row => {
      let record = {};
      headers.forEach((header, index) => {
        record[header] = row[index];
      });
      return record;
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: records
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 피드백 저장
function saveFeedback(e, sheet) {
  try {
    const data = JSON.parse(e.postData.contents);
    const feedbackSheet = sheet.getSheetByName('teacher_feedback') || sheet.insertSheet('teacher_feedback');
    
    feedbackSheet.appendRow([
      data.student_id,
      data.student_name,
      data.date,
      data.feedback_type,
      data.content,
      false, // is_read
      new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Feedback saved'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 피드백 조회
function getFeedback(e, sheet) {
  try {
    const studentId = e.parameter.student_id;
    const feedbackSheet = sheet.getSheetByName('teacher_feedback');
    
    if (!feedbackSheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = feedbackSheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    let records = rows.map(row => {
      let record = {};
      headers.forEach((header, index) => {
        record[header] = row[index];
      });
      return record;
    });
    
    if (studentId) {
      records = records.filter(r => r.student_id === studentId && !r.is_read);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: records
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. **배포** → **새 배포**
5. **유형 선택** → **웹 앱**
6. **액세스 권한** → **모든 사용자**
7. **배포** 클릭
8. **웹 앱 URL 복사** (예: https://script.google.com/macros/s/ABC123.../exec)

---

## 3. 설정 완료 확인

- [ ] Google Sheets 생성 완료
- [ ] Apps Script 코드 붙여넣기 완료
- [ ] 웹 앱 배포 완료
- [ ] 웹 앱 URL 복사 완료

**웹 앱 URL을 저에게 공유해주세요!**

---

## 다음 단계

이 URL을 받으면:
1. 학생 포털 → Google Sheets 자동 전송 코드 추가
2. 선생님 대시보드 → Google Sheets 읽기 코드 추가
3. 피드백 작성 UI 추가
4. 테스트!

**웹 앱 URL을 알려주시면 바로 코드 작성 시작합니다!** 🚀
