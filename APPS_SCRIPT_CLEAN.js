// Self-Directed Learning UP Challenge - Google Apps Script
// Version: 3.0.1 (Clean Version)
// Date: 2026-01-05
// ES5 Compatible

// Sheet Names Configuration
var SHEET_NAMES = {
  DIAGNOSTIC: 'diagnostic_results',
  STUDY_RECORDS: 'study_records',
  TEACHER_FEEDBACK: 'teacher_feedback'
};

function getOrCreateSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    Logger.log('Sheet created: ' + sheetName);
  }
  
  return sheet;
}

function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  var action = params.action || '';
  
  Logger.log('Request received: ' + action);
  Logger.log('Parameters: ' + JSON.stringify(params));
  
  try {
    if (action === 'getDiagnosticResults') {
      return getDiagnosticResults(params);
    } else if (action === 'saveDiagnosticResult') {
      return saveDiagnosticResult(params);
    } else if (action === 'getStudyRecords') {
      return getStudyRecords(params);
    } else if (action === 'saveStudyRecord') {
      return saveStudyRecord(params);
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
    Logger.log('Error occurred: ' + error.toString());
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

function getDiagnosticResults(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.DIAGNOSTIC);
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log('No diagnostic results found');
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
  
  Logger.log('Diagnostic results loaded: ' + results.length);
  
  return createJsonResponse({
    status: 'success',
    data: results
  });
}

function saveDiagnosticResult(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.DIAGNOSTIC);
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'id', 'student_id', 'student_name', 'student_grade',
      'test_date', 'total_score', 'level',
      'math_score', 'math_level',
      'english_score', 'english_level',
      'korean_score', 'korean_level',
      'social_score', 'social_level',
      'science_score', 'science_level',
      'strength_subjects', 'weakness_subjects'
    ]);
  }
  
  sheet.appendRow([
    params.id || '',
    params.student_id || '',
    params.student_name || '',
    params.student_grade || '',
    params.test_date || new Date().toISOString().split('T')[0],
    params.total_score || 0,
    params.level || '',
    params.math_score || 0,
    params.math_level || '',
    params.english_score || 0,
    params.english_level || '',
    params.korean_score || 0,
    params.korean_level || '',
    params.social_score || 0,
    params.social_level || '',
    params.science_score || 0,
    params.science_level || '',
    params.strength_subjects || '',
    params.weakness_subjects || ''
  ]);
  
  Logger.log('Diagnostic result saved: ' + params.student_name);
  
  return createJsonResponse({
    status: 'success',
    message: 'Diagnostic result saved successfully'
  });
}

function getStudyRecords(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.STUDY_RECORDS);
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log('No study records found');
    return createJsonResponse({
      status: 'success',
      data: []
    });
  }
  
  var headers = data[0];
  Logger.log('Headers: ' + JSON.stringify(headers));
  Logger.log('Header count: ' + headers.length);
  Logger.log('Header B1 (name field): ' + headers[1]);
  
  var records = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var record = {};
    
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = row[j];
    }
    
    if (i === 1) {
      Logger.log('First record sample: ' + JSON.stringify(record));
    }
    
    records.push(record);
  }
  
  Logger.log('Study records loaded: ' + records.length);
  
  var groupBy = params.group_by || '';
  
  if (groupBy === 'student') {
    return createJsonResponse({
      status: 'success',
      data: groupRecordsByStudent(records)
    });
  }
  
  var studentId = params.student_id || '';
  if (studentId) {
    var filtered = [];
    for (var k = 0; k < records.length; k++) {
      if (records[k].id === studentId || records[k].student_id === studentId) {
        filtered.push(records[k]);
      }
    }
    Logger.log('Student records filtered: ' + filtered.length);
    return createJsonResponse({
      status: 'success',
      data: filtered
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
    
    var studentName = record.student_name || 
                      record.name || 
                      record.studentName || 
                      '알 수 없음';
    
    var studentId = record.student_id || 
                    record.id || 
                    record.studentId || 
                    'unknown';
    
    Logger.log('Student name: ' + studentName + ', ID: ' + studentId);
    
    if (!grouped[studentId]) {
      grouped[studentId] = {
        studentName: studentName,
        studentId: studentId,
        totalMinutes: 0,
        subjectStats: {},
        records: []
      };
    }
    
    var time = parseInt(record.time || 0, 10);
    grouped[studentId].totalMinutes += time;
    
    var subject = record.subject || 'Other';
    if (!grouped[studentId].subjectStats[subject]) {
      grouped[studentId].subjectStats[subject] = {
        count: 0,
        totalMinutes: 0
      };
    }
    grouped[studentId].subjectStats[subject].count++;
    grouped[studentId].subjectStats[subject].totalMinutes += time;
    
    grouped[studentId].records.push(record);
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
  
  Logger.log('Student grouping completed: ' + result.length + ' students');
  
  return result;
}

function saveStudyRecord(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.STUDY_RECORDS);
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'id', 'name', 'date', 'subject', 'time', 'content'
    ]);
  }
  
  sheet.appendRow([
    params.id || '',
    params.student_name || params.name || '',
    params.date || new Date().toISOString().split('T')[0],
    params.subject || '',
    params.time || 0,
    params.content || ''
  ]);
  
  Logger.log('Study record saved: ' + (params.student_name || params.name));
  
  return createJsonResponse({
    status: 'success',
    message: 'Study record saved successfully'
  });
}

function getTeacherFeedback(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.TEACHER_FEEDBACK);
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log('No feedback found');
    return createJsonResponse({
      status: 'success',
      data: []
    });
  }
  
  var headers = data[0];
  var feedbacks = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var feedback = {};
    
    for (var j = 0; j < headers.length; j++) {
      feedback[headers[j]] = row[j];
    }
    
    feedbacks.push(feedback);
  }
  
  var studentId = params.student_id || '';
  if (studentId) {
    var filtered = [];
    for (var k = 0; k < feedbacks.length; k++) {
      if (feedbacks[k].student_id === studentId) {
        filtered.push(feedbacks[k]);
      }
    }
    Logger.log('Student feedback filtered: ' + filtered.length);
    return createJsonResponse({
      status: 'success',
      data: filtered
    });
  }
  
  Logger.log('Feedback loaded: ' + feedbacks.length);
  
  return createJsonResponse({
    status: 'success',
    data: feedbacks
  });
}

function saveTeacherFeedback(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.TEACHER_FEEDBACK);
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'id', 'student_id', 'student_name', 'date',
      'feedback_type', 'content'
    ]);
  }
  
  sheet.appendRow([
    params.id || '',
    params.student_id || '',
    params.student_name || '',
    params.date || new Date().toISOString().split('T')[0],
    params.feedback_type || 'general',
    params.content || ''
  ]);
  
  Logger.log('Feedback saved: ' + params.student_name);
  
  return createJsonResponse({
    status: 'success',
    message: 'Feedback saved successfully'
  });
}

function testDoGet() {
  var testEvent = {
    parameter: {
      action: 'getStudyRecords',
      group_by: 'student'
    }
  };
  
  var response = doGet(testEvent);
  Logger.log('Response: ' + response.getContent());
}
