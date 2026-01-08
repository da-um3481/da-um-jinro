// Self-Directed Learning UP Challenge - Google Apps Script
// Version: 6.1.0 (WITH START/END TIME)
// Date: 2026-01-07

var SHEET_NAMES = {
  DIAGNOSTIC: 'diagnostic_results',
  STUDY_RECORDS: 'study_records',
  TEACHER_FEEDBACK: 'teacher_feedback'
};

// ==========================================
// 🆕 doPost - POST 요청 처리 (학습 기록 저장)
// ==========================================
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = e.parameter.action || '';
    
    Logger.log('📥 POST Request - Action: ' + action);
    Logger.log('📦 POST Data: ' + JSON.stringify(data));
    
    if (action === 'saveStudyRecord') {
      return saveStudyRecordToSheet(data);
    } else if (action === 'saveDiagnosticResult') {
      return saveDiagnosticResultToSheet(data);
    } else if (action === 'saveTeacherFeedback') {
      return saveTeacherFeedbackToSheet(data);
    } else {
      return createJsonResponse({
        status: 'error',
        message: 'Unknown POST action: ' + action
      });
    }
  } catch (error) {
    Logger.log('❌ POST ERROR: ' + error.toString());
    return createJsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

// ==========================================
// 🆕 학습 기록 저장 (시작/종료 시간 포함)
// ==========================================
function saveStudyRecordToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('study_records');
  
  if (!sheet) {
    Logger.log('❌ study_records sheet not found!');
    return createJsonResponse({
      status: 'error',
      message: 'study_records sheet not found'
    });
  }
  
  // 새 행 추가
  var newRow = [
    data.student_id || '',           // A: id
    data.student_name || '',         // B: name
    data.date || '',                 // C: date
    data.subject || '',              // D: subject
    data.time || '',                 // E: time (학습 시간: 45분)
    data.content || '',              // F: content
    '',                              // G: (빈 칸 - 상세 학습내용용)
    data.start_time || '',           // H: start_time (시작 시간) 🆕
    data.end_time || '',             // I: end_time (종료 시간) 🆕
    data.meta_can_explain || '',     // J: meta_can_explain
    data.meta_can_teach || '',       // K: meta_can_teach
    data.meta_can_solve || '',       // L: meta_can_solve
    data.meta_needs_review || '',    // M: meta_needs_review
    data.meta_score || '',           // N: meta_score
    data.meta_understood || '',      // O: meta_understood
    data.meta_difficult || '',       // P: meta_difficult
    data.meta_next_plan || '',       // Q: meta_next_plan
    new Date().toISOString()         // R: timestamp
  ];
  
  sheet.appendRow(newRow);
  
  Logger.log('✅ Study record saved successfully!');
  Logger.log('📊 Data: ' + JSON.stringify(data));
  Logger.log('⏰ Start: ' + (data.start_time || 'N/A'));
  Logger.log('⏰ End: ' + (data.end_time || 'N/A'));
  
  return createJsonResponse({
    status: 'success',
    message: 'Study record saved with start/end time',
    timestamp: new Date().toISOString()
  });
}

// ==========================================
// 🆕 진단평가 결과 저장
// ==========================================
function saveDiagnosticResultToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('diagnostic_results');
  
  if (!sheet) {
    Logger.log('❌ diagnostic_results sheet not found!');
    return createJsonResponse({
      status: 'error',
      message: 'diagnostic_results sheet not found'
    });
  }
  
  var newRow = [
    data.student_id || '',
    data.student_name || '',
    data.date || '',
    data.grade || '',
    data.subject || '',
    data.total_questions || '',
    data.correct_answers || '',
    data.score || '',
    JSON.stringify(data.details || {}),
    new Date().toISOString()
  ];
  
  sheet.appendRow(newRow);
  
  Logger.log('✅ Diagnostic result saved successfully!');
  
  return createJsonResponse({
    status: 'success',
    message: 'Diagnostic result saved'
  });
}

// ==========================================
// 🆕 교사 피드백 저장
// ==========================================
function saveTeacherFeedbackToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('teacher_feedback');
  
  if (!sheet) {
    sheet = ss.insertSheet('teacher_feedback');
    sheet.appendRow(['student_name', 'date', 'feedback', 'timestamp']);
  }
  
  var newRow = [
    data.student_name || '',
    data.date || '',
    data.feedback || '',
    new Date().toISOString()
  ];
  
  sheet.appendRow(newRow);
  
  Logger.log('✅ Teacher feedback saved successfully!');
  
  return createJsonResponse({
    status: 'success',
    message: 'Teacher feedback saved'
  });
}

// ==========================================
// JSON 응답 생성
// ==========================================
function createJsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// 🆕 doGet - GET 요청 처리 (기존 기능 유지)
// ==========================================
function doGet(e) {
  var action = e.parameter.action || '';
  
  Logger.log('📥 GET Request - Action: ' + action);
  
  if (action === 'getStudyRecords') {
    return getStudyRecords(e);
  } else if (action === 'getDiagnosticResults') {
    return getDiagnosticResults(e);
  } else if (action === 'getTeacherFeedback') {
    return getTeacherFeedback(e);
  } else {
    return createJsonResponse({
      status: 'error',
      message: 'Unknown action: ' + action
    });
  }
}

function getStudyRecords(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('study_records');
  
  if (!sheet) {
    return createJsonResponse({
      status: 'success',
      data: []
    });
  }
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var records = [];
  
  for (var i = 1; i < data.length; i++) {
    var record = {};
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = data[i][j];
    }
    records.push(record);
  }
  
  return createJsonResponse({
    status: 'success',
    data: records
  });
}

function getDiagnosticResults(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('diagnostic_results');
  
  if (!sheet) {
    return createJsonResponse({
      status: 'success',
      data: []
    });
  }
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var records = [];
  
  for (var i = 1; i < data.length; i++) {
    var record = {};
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = data[i][j];
    }
    records.push(record);
  }
  
  return createJsonResponse({
    status: 'success',
    data: records
  });
}

function getTeacherFeedback(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('teacher_feedback');
  
  if (!sheet) {
    return createJsonResponse({
      status: 'success',
      data: []
    });
  }
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var records = [];
  
  for (var i = 1; i < data.length; i++) {
    var record = {};
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = data[i][j];
    }
    records.push(record);
  }
  
  return createJsonResponse({
    status: 'success',
    data: records
  });
}

// ==========================================
// 테스트 함수
// ==========================================
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        student_id: 'test_123',
        student_name: 'TestStudent',
        date: '2026-01-07',
        subject: 'Math',
        time: 45,
        content: 'Test study session',
        start_time: '14:30:00',
        end_time: '15:15:00'
      })
    },
    parameter: {
      action: 'saveStudyRecord'
    }
  };
  
  var result = doPost(testData);
  Logger.log('Test Result: ' + result.getContent());
}
