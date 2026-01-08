function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var action = e.parameter.action || '';
  
  if (action === 'saveStudyRecord') {
    return saveStudyRecordToSheet(data);
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: 'error'})).setMimeType(ContentService.MimeType.JSON);
}

function saveStudyRecordToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('study_records');
  
  var timeInMinutes = data.time || '';
  
  if (!timeInMinutes && data.start_time && data.end_time) {
    var start = parseTime(data.start_time);
    var end = parseTime(data.end_time);
    var diffMinutes = Math.round((end - start) / 60000);
    timeInMinutes = diffMinutes;
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
  
  return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);
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
  return date.getTime();
}
