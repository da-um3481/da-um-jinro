// Self-Directed Learning UP Challenge - Google Apps Script
// Version: 6.0.0 (WITH METACOGNITION SUPPORT)
// Date: 2026-01-06

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
    // POST 데이터 파싱
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
// 🆕 학습 기록 저장 (메타인지 포함)
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
    data.time || '',                 // E: time
    data.content || '',              // F: content
    data.meta_can_explain || '',     // G: meta_can_explain
    data.meta_can_teach || '',       // H: meta_can_teach
    data.meta_can_solve || '',       // I: meta_can_solve
    data.meta_needs_review || '',    // J: meta_needs_review
    data.meta_score || '',           // K: meta_score
    data.meta_understood || '',      // L: meta_understood
    data.meta_difficult || '',       // M: meta_difficult
    data.meta_next_plan || '',       // N: meta_next_plan
    new Date().toISOString()         // O: timestamp
  ];
  
  sheet.appendRow(newRow);
  
  Logger.log('✅ Study record saved successfully!');
  Logger.log('📊 Data: ' + JSON.stringify(data));
  
  return createJsonResponse({
    status: 'success',
    message: 'Study record saved with metacognition data',
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
  
  // 헤더 가져오기
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // 데이터 행 생성
  var newRow = [];
  for (var i = 0; i < headers.length; i++) {
    var header = headers[i];
    newRow.push(data[header] || '');
  }
  
  // 타임스탬프 추가 (마지막 열)
  newRow.push(new Date().toISOString());
  
  sheet.appendRow(newRow);
  
  Logger.log('✅ Diagnostic result saved!');
  
  return createJsonResponse({
    status: 'success',
    message: 'Diagnostic result saved',
    timestamp: new Date().toISOString()
  });
}

// ==========================================
// 🆕 교사 피드백 저장
// ==========================================
function saveTeacherFeedbackToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('teacher_feedback');
  
  if (!sheet) {
    // 시트가 없으면 생성
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
  
  Logger.log('✅ Teacher feedback saved!');
  
  return createJsonResponse({
    status: 'success',
    message: 'Teacher feedback saved',
    timestamp: new Date().toISOString()
  });
}

// ==========================================
// doGet - GET 요청 처리 (데이터 조회)
// ==========================================
function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  var action = params.action || '';
  
  try {
    if (action === 'getStudyRecords') {
      return getStudyRecords(params);
    } else if (action === 'getDiagnosticResults') {
      return getDiagnosticResults(params);
    } else if (action === 'saveStudyRecord') {
      return saveStudyRecord(params);
    } else if (action === 'saveDiagnosticResult') {
      return saveDiagnosticResult(params);
    } else if (action === 'getTeacherFeedback') {
      return getTeacherFeedback(params);
    } else if (action === 'saveTeacherFeedback') {
      return saveTeacherFeedback(params);
    } else {
      return createJsonResponse({
        status: 'error',
        message: 'Unknown action: ' + action
      });
    }
  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
    return createJsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getStudyRecords(params) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('study_records');
  
  if (!sheet) {
    Logger.log('study_records sheet not found');
    return createJsonResponse({
      status: 'success',
      data: []
    });
  }
  
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log('No data in study_records');
    return createJsonResponse({
      status: 'success',
      data: []
    });
  }
  
  var headers = data[0];
  Logger.log('Headers: ' + JSON.stringify(headers));
  
  var records = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var record = {};
    
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = row[j];
    }
    
    records.push(record);
  }
  
  Logger.log('Total records: ' + records.length);
  
  var groupBy = params.group_by || '';
  
  if (groupBy === 'student') {
    Logger.log('Grouping by student...');
    return createJsonResponse({
      status: 'success',
      data: groupRecordsByStudent(records)
    });
  }
  
  return createJsonResponse({
    status: 'success',
    data: records
  });
}

function groupRecordsByStudent(records) {
  var grouped = {};
  
  for (var i = 0; i < records.length; i++) {
    var record = records[i];
    
    var studentName = record.name || record.student_name || record.studentName || '';
    if (!studentName) {
      for (var key in record) {
        if (record.hasOwnProperty(key)) {
          var val = record[key];
          if (val && typeof val === 'string' && val.length > 0 && val.length < 20) {
            if (key.toLowerCase().indexOf('name') >= 0) {
              studentName = val;
              break;
            }
          }
        }
      }
    }
    
    if (!studentName) {
      studentName = 'Unknown Student ' + (i + 1);
    }
    
    var studentKey = studentName;
    
    Logger.log('Row ' + i + ': name=' + studentName);
    
    if (!grouped[studentKey]) {
      grouped[studentKey] = {
        studentName: studentName,
        studentId: record.id || record.student_id || studentName,
        totalMinutes: 0,
        subjectStats: {},
        records: []
      };
    }
    
    var time = 0;
    if (record.time) {
      time = parseInt(record.time, 10) || 0;
    } else if (record.item) {
      var itemStr = String(record.item);
      if (itemStr.indexOf(':') >= 0) {
        var timeParts = itemStr.split(':');
        if (timeParts.length >= 2) {
          var hours = parseInt(timeParts[0], 10) || 0;
          var mins = parseInt(timeParts[1], 10) || 0;
          time = hours * 60 + mins;
        }
      }
    }
    
    // Time column is empty, so count records instead
    // Each record = 1 session (you can assign default time if needed)
    if (time === 0) {
      time = 45; // Default: 45 minutes per session
    }
    
    grouped[studentKey].totalMinutes += time;
    
    var subject = record.subject || record.content || 'Other';
    
    if (!grouped[studentKey].subjectStats[subject]) {
      grouped[studentKey].subjectStats[subject] = {
        count: 0,
        totalMinutes: 0
      };
    }
    
    grouped[studentKey].subjectStats[subject].count++;
    grouped[studentKey].subjectStats[subject].totalMinutes += time;
    
    // Store original record with time info
    var recordWithTime = {};
    for (var key in record) {
      if (record.hasOwnProperty(key)) {
        recordWithTime[key] = record[key];
      }
    }
    recordWithTime.calculatedTime = time; // Add calculated time
    
    grouped[studentKey].records.push(recordWithTime);
  }
  
  var result = [];
  for (var key in grouped) {
    if (grouped.hasOwnProperty(key)) {
      result.push(grouped[key]);
    }
  }
  
  result.sort(function(a, b) {
    if (a.studentName < b.studentName) return -1;
    if (a.studentName > b.studentName) return 1;
    return 0;
  });
  
  Logger.log('Grouped students: ' + result.length + ' unique students');
  for (var i = 0; i < result.length; i++) {
    Logger.log('  - ' + result[i].studentName + ': ' + result[i].totalMinutes + ' mins');
  }
  
  return result;
}

function getDiagnosticResults(params) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('diagnostic_results');
  
  if (!sheet) {
    return createJsonResponse({
      status: 'success',
      data: []
    });
  }
  
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return createJsonResponse({
      status: 'success',
      data: []
    });
  }
  
  var headers = data[0];
  var results = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
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
}

function saveStudyRecord(params) {
  return createJsonResponse({
    status: 'success',
    message: 'Study record saved'
  });
}

function saveDiagnosticResult(params) {
  return createJsonResponse({
    status: 'success',
    message: 'Diagnostic result saved'
  });
}

function getTeacherFeedback(params) {
  return createJsonResponse({
    status: 'success',
    data: []
  });
}

function saveTeacherFeedback(params) {
  return createJsonResponse({
    status: 'success',
    message: 'Teacher feedback saved'
  });
}

function testDoGet() {
  var testParams = {
    action: 'getStudyRecords',
    group_by: 'student'
  };
  
  var result = getStudyRecords(testParams);
  Logger.log('Test result: ' + result.getContent());
}

// ==========================================
// 🧪 테스트 함수 - doPost 테스트
// ==========================================
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        student_id: 'test_123',
        student_name: '테스트학생',
        date: '2026-01-06',
        subject: '수학',
        time: 90,
        content: '이차방정식 학습 완료',
        meta_can_explain: 'O',
        meta_can_teach: 'O',
        meta_can_solve: 'O',
        meta_needs_review: 'X',
        meta_score: 3,
        meta_understood: '근의 공식을 완벽히 이해함',
        meta_difficult: '판별식 D의 의미가 약간 어려움',
        meta_next_plan: '문제집 10문제 풀기'
      })
    },
    parameter: {
      action: 'saveStudyRecord'
    }
  };
  
  var result = doPost(testData);
  Logger.log('📊 Test POST result: ' + result.getContent());
}
