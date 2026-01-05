// Self-Directed Learning UP Challenge - Google Apps Script
// Version: 3.1.0 (ULTRA FINAL - 100% Works)
// Date: 2026-01-05

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
  }
  
  return sheet;
}

function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  var action = params.action || '';
  
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
        message: 'Unknown action'
      });
    }
  } catch (error) {
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
  
  return createJsonResponse({
    status: 'success',
    message: 'Saved'
  });
}

function getStudyRecords(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.STUDY_RECORDS);
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return createJsonResponse({
      status: 'success',
      data: []
    });
  }
  
  var headers = data[0];
  var records = [];
  
  // Parse all records
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var record = {};
    
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = row[j];
    }
    
    records.push(record);
  }
  
  var groupBy = params.group_by || '';
  
  if (groupBy === 'student') {
    return createJsonResponse({
      status: 'success',
      data: groupRecordsByStudent(records, headers)
    });
  }
  
  var studentId = params.student_id || '';
  if (studentId) {
    var filtered = [];
    for (var k = 0; k < records.length; k++) {
      var rec = records[k];
      var recId = rec.id || rec.student_id || rec.studentId || '';
      if (recId === studentId) {
        filtered.push(rec);
      }
    }
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

function groupRecordsByStudent(records, headers) {
  var grouped = {};
  
  // Find which column has the name
  var nameColumn = -1;
  var idColumn = -1;
  
  for (var h = 0; h < headers.length; h++) {
    var header = headers[h].toString().toLowerCase();
    if (header.indexOf('name') >= 0 || header.indexOf('이름') >= 0) {
      nameColumn = h;
    }
    if (header === 'id' || header === 'student_id') {
      idColumn = h;
    }
  }
  
  for (var i = 0; i < records.length; i++) {
    var record = records[i];
    
    // Get name from any possible field
    var studentName = '';
    if (record.student_name) {
      studentName = record.student_name;
    } else if (record.name) {
      studentName = record.name;
    } else if (record.studentName) {
      studentName = record.studentName;
    } else if (nameColumn >= 0) {
      // Get from raw data by column index
      studentName = record[headers[nameColumn]] || '';
    }
    
    // Fallback: use first non-empty string value
    if (!studentName) {
      for (var key in record) {
        if (record.hasOwnProperty(key)) {
          var val = record[key];
          if (val && typeof val === 'string' && val.length > 0 && val.length < 20) {
            studentName = val;
            break;
          }
        }
      }
    }
    
    if (!studentName) {
      studentName = 'Student ' + (i + 1);
    }
    
    // Get ID
    var studentId = '';
    if (record.student_id) {
      studentId = record.student_id;
    } else if (record.id) {
      studentId = record.id;
    } else if (record.studentId) {
      studentId = record.studentId;
    } else if (idColumn >= 0) {
      studentId = record[headers[idColumn]] || '';
    }
    
    if (!studentId) {
      studentId = 'unknown_' + i;
    }
    
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
  
  return result;
}

function saveStudyRecord(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.STUDY_RECORDS);
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'student_id', 'student_name', 'date', 'subject', 'time', 'content'
    ]);
  }
  
  sheet.appendRow([
    params.student_id || params.id || '',
    params.student_name || params.name || '',
    params.date || new Date().toISOString().split('T')[0],
    params.subject || '',
    params.time || 0,
    params.content || ''
  ]);
  
  return createJsonResponse({
    status: 'success',
    message: 'Saved'
  });
}

function getTeacherFeedback(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.TEACHER_FEEDBACK);
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
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
    return createJsonResponse({
      status: 'success',
      data: filtered
    });
  }
  
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
  
  return createJsonResponse({
    status: 'success',
    message: 'Saved'
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
  Logger.log('RESPONSE: ' + response.getContent());
}
