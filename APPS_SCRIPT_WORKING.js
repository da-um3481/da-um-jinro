// Self-Directed Learning UP Challenge - Google Apps Script
// Version: 4.0.0 (ACTUALLY WORKING)
// Date: 2026-01-05

var SHEET_NAMES = {
  DIAGNOSTIC: 'diagnostic_results',
  STUDY_RECORDS: 'study_records',
  TEACHER_FEEDBACK: 'teacher_feedback'
};

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
    
    // Get student name
    var studentName = record.name || record.student_name || record.studentName || '';
    if (!studentName) {
      for (var key in record) {
        if (record.hasOwnProperty(key)) {
          var val = record[key];
          if (val && typeof val === 'string' && val.length > 0 && val.length < 20) {
            if (key.toLowerCase().indexOf('name') >= 0 || key.indexOf('이름') >= 0) {
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
    
    // ✅ Use student name as key instead of ID to properly group
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
    
    // Get time
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
    
    grouped[studentKey].totalMinutes += time;
    
    // Get subject
    var subject = record.subject || record.content || 'Other';
    
    if (!grouped[studentKey].subjectStats[subject]) {
      grouped[studentKey].subjectStats[subject] = {
        count: 0,
        totalMinutes: 0
      };
    }
    
    grouped[studentKey].subjectStats[subject].count++;
    grouped[studentKey].subjectStats[subject].totalMinutes += time;
    
    grouped[studentKey].records.push(record);
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('study_records');
  
  if (!sheet) {
    sheet = ss.insertSheet('study_records');
    sheet.appendRow(['id', 'name', 'date', 'subject', 'time', 'content']);
  }
  
  sheet.appendRow([
    params.id || '',
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

function saveDiagnosticResult(params) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('diagnostic_results');
  
  if (!sheet) {
    sheet = ss.insertSheet('diagnostic_results');
    sheet.appendRow([
      'id', 'student_id', 'student_name', 'student_grade',
      'test_date', 'total_score', 'level'
    ]);
  }
  
  sheet.appendRow([
    params.id || '',
    params.student_id || '',
    params.student_name || '',
    params.student_grade || '',
    params.test_date || new Date().toISOString().split('T')[0],
    params.total_score || 0,
    params.level || ''
  ]);
  
  return createJsonResponse({
    status: 'success',
    message: 'Saved'
  });
}

function getTeacherFeedback(params) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('teacher_feedback');
  
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
  var feedbacks = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var feedback = {};
    
    for (var j = 0; j < headers.length; j++) {
      feedback[headers[j]] = row[j];
    }
    
    feedbacks.push(feedback);
  }
  
  return createJsonResponse({
    status: 'success',
    data: feedbacks
  });
}

function saveTeacherFeedback(params) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('teacher_feedback');
  
  if (!sheet) {
    sheet = ss.insertSheet('teacher_feedback');
    sheet.appendRow(['id', 'student_id', 'student_name', 'date', 'feedback_type', 'content']);
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
