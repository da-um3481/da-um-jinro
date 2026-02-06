/**
 * DA.UM Classroom V2 - Google Apps Script Web App
 * 
 * 배포 방법:
 * 1. Google Sheets 생성
 * 2. 확장 프로그램 > Apps Script
 * 3. 이 코드 복사/붙여넣기
 * 4. 배포 > 새 배포 > 유형: 웹 앱
 * 5. 액세스 권한: "모든 사용자"
 * 6. 배포 URL 복사 → google-sheets-api.js의 WEB_APP_URL에 입력
 * 
 * 시트 구조:
 * - journals: 학습 일지
 * - missions: 학습 미션
 * - materials: 학습 자료
 * - questions: 질문 답변
 */

// 🔧 설정
const SHEET_NAMES = {
  journals: 'journals',
  missions: 'missions',
  materials: 'materials',
  questions: 'questions'
};

/**
 * GET 요청 처리 (데이터 읽기)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const sheetName = e.parameter.sheetName;
    
    if (action === 'ping') {
      return createResponse({ success: true, message: 'pong' });
    }
    
    if (action === 'load') {
      const filter = {
        studentName: e.parameter.studentName || null
      };
      const data = loadData(sheetName, filter);
      return createResponse({ success: true, data: data });
    }
    
    return createResponse({ success: false, error: 'Invalid action' });
  } catch (error) {
    return createResponse({ success: false, error: error.toString() });
  }
}

/**
 * POST 요청 처리 (데이터 쓰기)
 */
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    const sheetName = requestData.sheetName;
    const data = requestData.data;
    
    if (action === 'save') {
      const result = saveData(sheetName, data);
      return createResponse({ success: true, result: result });
    }
    
    return createResponse({ success: false, error: 'Invalid action' });
  } catch (error) {
    return createResponse({ success: false, error: error.toString() });
  }
}

/**
 * 데이터 저장
 */
function saveData(sheetName, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  // 시트가 없으면 생성
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    initializeSheet(sheet, sheetName);
  }
  
  // 데이터가 배열이면 여러 행 추가
  if (Array.isArray(data)) {
    data.forEach(item => appendRow(sheet, sheetName, item));
    return { rowsAdded: data.length };
  } else {
    appendRow(sheet, sheetName, data);
    return { rowsAdded: 1 };
  }
}

/**
 * 데이터 로드
 */
function loadData(sheetName, filter) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return [];
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  // 객체 배열로 변환
  const result = rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  // 필터 적용
  if (filter.studentName) {
    return result.filter(item => item.studentName === filter.studentName);
  }
  
  return result;
}

/**
 * 시트 초기화 (헤더 생성)
 */
function initializeSheet(sheet, sheetName) {
  let headers = [];
  
  switch(sheetName) {
    case 'journals':
      headers = [
        'id', 'studentName', 'subject', 'date', 'time', 
        'content', 'photos', 'memo', 'timestamp'
      ];
      break;
    case 'missions':
      headers = [
        'id', 'title', 'description', 'subject', 'dueDate', 
        'status', 'createdAt', 'createdBy'
      ];
      break;
    case 'materials':
      headers = [
        'id', 'title', 'subject', 'type', 'url', 
        'description', 'uploadedAt', 'uploadedBy'
      ];
      break;
    case 'questions':
      headers = [
        'id', 'studentName', 'question', 'photoUrl', 
        'answer', 'answeredBy', 'answeredAt', 'createdAt'
      ];
      break;
    default:
      headers = ['id', 'data', 'timestamp'];
  }
  
  sheet.appendRow(headers);
  
  // 헤더 스타일 설정
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285F4');
  headerRange.setFontColor('#FFFFFF');
}

/**
 * 행 추가
 */
function appendRow(sheet, sheetName, data) {
  let row = [];
  
  switch(sheetName) {
    case 'journals':
      row = [
        data.id || generateId(),
        data.studentName || '',
        data.subject || '',
        data.date || new Date().toISOString().split('T')[0],
        data.time || 0,
        data.content || '',
        JSON.stringify(data.photos || []),
        data.memo || '',
        data.timestamp || new Date().toISOString()
      ];
      break;
    case 'missions':
      row = [
        data.id || generateId(),
        data.title || '',
        data.description || '',
        data.subject || '',
        data.dueDate || '',
        data.status || 'active',
        data.createdAt || new Date().toISOString(),
        data.createdBy || 'teacher'
      ];
      break;
    case 'materials':
      row = [
        data.id || generateId(),
        data.title || '',
        data.subject || '',
        data.type || '',
        data.url || '',
        data.description || '',
        data.uploadedAt || new Date().toISOString(),
        data.uploadedBy || 'teacher'
      ];
      break;
    case 'questions':
      row = [
        data.id || generateId(),
        data.studentName || '',
        data.question || '',
        data.photoUrl || '',
        data.answer || '',
        data.answeredBy || '',
        data.answeredAt || '',
        data.createdAt || new Date().toISOString()
      ];
      break;
    default:
      row = [
        data.id || generateId(),
        JSON.stringify(data),
        new Date().toISOString()
      ];
  }
  
  sheet.appendRow(row);
}

/**
 * ID 생성
 */
function generateId() {
  return 'id_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * JSON 응답 생성
 */
function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
