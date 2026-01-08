function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var action = e.parameter.action || '';
  
  Logger.log('Action: ' + action);
  Logger.log('Data: ' + JSON.stringify(data));
  
  if (action === 'saveStudyRecord') {
    return saveStudyRecordToSheet(data);
  } else if (action === 'saveDiagnosticResult') {
    return saveDiagnosticResultToSheet(data);
  } else if (action === 'saveTeacherFeedback') {
    return saveTeacherFeedbackToSheet(data);
  }
  
  return createJsonResponse({status: 'error', message: 'Unknown action'});
}

function saveStudyRecordToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('study_records');
  
  if (!sheet) {
    Logger.log('ERROR: Sheet not found!');
    return createJsonResponse({status: 'error', message: 'Sheet not found'});
  }
  
  var timeInMinutes = data.time || '';
  
  if (!timeInMinutes && data.start_time && data.end_time) {
    var start = parseTime(data.start_time);
    var end = parseTime(data.end_time);
    var diffMinutes = Math.round((end - start) / 60000);
    timeInMinutes = diffMinutes;
    Logger.log('Calculated time: ' + diffMinutes + ' min');
  }
  
  var newRow = [
    data.student_id || '',
    data.student_name || '',
    data.date || '',
    data.subject || '',
    timeInMinutes,
    data.content || '',
    '',
    data.start_time || '',
    data.end_time || '',
    new Date().toISOString()
  ];
  
  sheet.appendRow(newRow);
  
  Logger.log('Saved! Time: ' + timeInMinutes + ', Start: ' + data.start_time + ', End: ' + data.end_time);
  
  return createJsonResponse({
    status: 'success',
    message: 'Study record saved',
    timestamp: new Date().toISOString()
  });
}

function saveDiagnosticResultToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('diagnostic_results');
  
  if (!sheet) {
    return createJsonResponse({status: 'error', message: 'Sheet not found'});
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
  
  return createJsonResponse({status: 'success', message: 'Diagnostic saved'});
}

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
  
  return createJsonResponse({status: 'success', message: 'Feedback saved'});
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var action = e.parameter.action || '';
  
  if (action === 'getStudyRecords') {
    return getStudyRecords(e);
  } else if (action === 'getDiagnosticResults') {
    return getDiagnosticResults(e);
  } else if (action === 'getTeacherFeedback') {
    return getTeacherFeedback(e);
  }
  
  return createJsonResponse({status: 'error', message: 'Unknown action'});
}

function getStudyRecords(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('study_records');
  
  if (!sheet) {
    return createJsonResponse({status: 'success', data: []});
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
  
  return createJsonResponse({status: 'success', data: records});
}

function getDiagnosticResults(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('diagnostic_results');
  
  if (!sheet) {
    return createJsonResponse({status: 'success', data: []});
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
  
  return createJsonResponse({status: 'success', data: records});
}

function getTeacherFeedback(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('teacher_feedback');
  
  if (!sheet) {
    return createJsonResponse({status: 'success', data: []});
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
  
  return createJsonResponse({status: 'success', data: records});
}

function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        student_id: 'test_123',
        student_name: 'TestStudent',
        date: '2026-01-08',
        subject: 'Math',
        time: 44,
        content: 'Test study',
        start_time: '09:13:16',
        end_time: '10:04:11'
      })
    },
    parameter: {
      action: 'saveStudyRecord'
    }
  };
  
  var result = doPost(testData);
  Logger.log('Test Result: ' + result.getContent());
}

function parseTime(timeStr) {
  var parts = timeStr.split(':');
  var hours = parseInt(parts[0]) || 0;
  var minutes = parseInt(parts[1]) || 0;
  var seconds = parseInt(parts[2]) || 0;
  
  var date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  date.setMilliseconds(0);
  
  return date.getTime();
}
