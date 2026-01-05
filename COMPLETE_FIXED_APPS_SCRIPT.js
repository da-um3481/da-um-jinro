/**
 * ========================================
 * 자기주도학습 UP 챌린지 - Google Apps Script
 * ========================================
 * 버전: 3.0.0 (완전 수정판)
 * 수정일: 2026-01-05
 * 수정 내용:
 * - undefined 파라미터 오류 해결
 * - 학생 이름 undefined 문제 해결
 * - 학생별 그룹화 기능 추가
 * - ES5 호환성 완벽 보장
 * 
 * 적용 방법:
 * 1. Google Sheets 열기
 * 2. 확장 프로그램 > Apps Script
 * 3. 기존 코드 전체 삭제
 * 4. 이 파일 내용 전체 복사 & 붙여넣기
 * 5. Ctrl+S 저장
 * 6. 배포 > 새 배포 > 유형: 웹 앱 > 배포
 * 7. 웹 앱 URL 복사 (google-sheets-api.js에 설정)
 * ========================================
 */

// ========================================
// 1. 시트 설정
// ========================================

var SHEET_NAMES = {
  DIAGNOSTIC: 'diagnostic_results',
  STUDY_RECORDS: 'study_records',
  TEACHER_FEEDBACK: 'teacher_feedback'
};

/**
 * 시트 가져오기 (없으면 생성)
 */
function getOrCreateSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    Logger.log('✅ 시트 생성: ' + sheetName);
  }
  
  return sheet;
}

// ========================================
// 2. 메인 진입점 - doGet (웹 앱 요청 처리)
// ========================================

/**
 * HTTP GET 요청 처리
 * 중요: e 파라미터가 undefined일 수 있으므로 안전하게 처리
 */
function doGet(e) {
  // 파라미터 안전 처리 (undefined 방지)
  var params = e && e.parameter ? e.parameter : {};
  var action = params.action || '';
  
  Logger.log('📥 요청 받음: ' + action);
  Logger.log('📋 파라미터: ' + JSON.stringify(params));
  
  try {
    // 액션별 라우팅
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
        message: '알 수 없는 액션: ' + action
      });
    }
  } catch (error) {
    Logger.log('❌ 오류 발생: ' + error.toString());
    return createJsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * JSON 응답 생성 헬퍼
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========================================
// 3. 진단평가 관리
// ========================================

/**
 * 진단평가 결과 조회
 */
function getDiagnosticResults(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.DIAGNOSTIC);
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log('📭 진단평가 결과 없음');
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
  
  Logger.log('✅ 진단평가 ' + results.length + '건 조회 완료');
  
  return createJsonResponse({
    status: 'success',
    data: results
  });
}

/**
 * 진단평가 결과 저장
 */
function saveDiagnosticResult(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.DIAGNOSTIC);
  
  // 헤더 설정 (첫 실행 시)
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
  
  // 데이터 추가
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
  
  Logger.log('✅ 진단평가 결과 저장 완료: ' + params.student_name);
  
  return createJsonResponse({
    status: 'success',
    message: '진단평가 결과가 저장되었습니다.'
  });
}

// ========================================
// 4. 학습 기록 관리 (학생별 그룹화 지원)
// ========================================

/**
 * 학습 기록 조회 (학생별 그룹화 지원)
 */
function getStudyRecords(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.STUDY_RECORDS);
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log('📭 학습 기록 없음');
    return createJsonResponse({
      status: 'success',
      data: []
    });
  }
  
  var headers = data[0];
  Logger.log('📋 헤더: ' + JSON.stringify(headers));
  
  var records = [];
  
  // 데이터 파싱
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var record = {};
    
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = row[j];
    }
    
    // 첫 레코드 로그 (디버깅용)
    if (i === 1) {
      Logger.log('📝 첫 레코드 샘플: ' + JSON.stringify(record));
    }
    
    records.push(record);
  }
  
  Logger.log('✅ 학습 기록 ' + records.length + '건 조회 완료');
  
  // 학생별 그룹화 요청 처리
  var groupBy = params.group_by || '';
  
  if (groupBy === 'student') {
    return createJsonResponse({
      status: 'success',
      data: groupRecordsByStudent(records)
    });
  }
  
  // 특정 학생 필터링
  var studentId = params.student_id || '';
  if (studentId) {
    var filtered = [];
    for (var k = 0; k < records.length; k++) {
      if (records[k].student_id === studentId) {
        filtered.push(records[k]);
      }
    }
    Logger.log('🔍 학생 ' + studentId + ' 기록 ' + filtered.length + '건');
    return createJsonResponse({
      status: 'success',
      data: filtered
    });
  }
  
  // 전체 기록 반환
  return createJsonResponse({
    status: 'success',
    data: records
  });
}

/**
 * 학생별로 기록 그룹화 및 통계 생성
 */
function groupRecordsByStudent(records) {
  var grouped = {};
  
  for (var i = 0; i < records.length; i++) {
    var record = records[i];
    
    // 학생 이름 안전하게 가져오기 (다양한 필드명 지원)
    var studentName = record.student_name || 
                      record.studentName || 
                      record.name || 
                      record['학생이름'] || 
                      record['이름'] || 
                      '알 수 없음';
    
    var studentId = record.student_id || 
                    record.studentId || 
                    record.id || 
                    'unknown';
    
    Logger.log('👤 학생 이름: ' + studentName + ', ID: ' + studentId);
    
    if (!grouped[studentId]) {
      grouped[studentId] = {
        studentName: studentName,
        studentId: studentId,
        totalMinutes: 0,
        subjectStats: {},
        records: []
      };
    }
    
    // 학습 시간 누적
    var time = parseInt(record.time || 0, 10);
    grouped[studentId].totalMinutes += time;
    
    // 과목별 통계
    var subject = record.subject || '기타';
    if (!grouped[studentId].subjectStats[subject]) {
      grouped[studentId].subjectStats[subject] = {
        count: 0,
        totalMinutes: 0
      };
    }
    grouped[studentId].subjectStats[subject].count++;
    grouped[studentId].subjectStats[subject].totalMinutes += time;
    
    // 레코드 추가
    grouped[studentId].records.push(record);
  }
  
  // 배열로 변환
  var result = [];
  for (var key in grouped) {
    if (grouped.hasOwnProperty(key)) {
      result.push(grouped[key]);
    }
  }
  
  // 학생 이름으로 정렬
  result.sort(function(a, b) {
    if (a.studentName < b.studentName) return -1;
    if (a.studentName > b.studentName) return 1;
    return 0;
  });
  
  Logger.log('👥 학생별 그룹화 완료: ' + result.length + '명');
  
  return result;
}

/**
 * 학습 기록 저장
 */
function saveStudyRecord(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.STUDY_RECORDS);
  
  // 헤더 설정 (첫 실행 시)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'id', 'student_id', 'student_name', 'date',
      'subject', 'time', 'content'
    ]);
  }
  
  // 데이터 추가
  sheet.appendRow([
    params.id || '',
    params.student_id || '',
    params.student_name || '',
    params.date || new Date().toISOString().split('T')[0],
    params.subject || '',
    params.time || 0,
    params.content || ''
  ]);
  
  Logger.log('✅ 학습 기록 저장 완료: ' + params.student_name + ' - ' + params.subject);
  
  return createJsonResponse({
    status: 'success',
    message: '학습 기록이 저장되었습니다.'
  });
}

// ========================================
// 5. 교사 피드백 관리
// ========================================

/**
 * 교사 피드백 조회
 */
function getTeacherFeedback(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.TEACHER_FEEDBACK);
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log('📭 피드백 없음');
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
  
  // 특정 학생 필터링
  var studentId = params.student_id || '';
  if (studentId) {
    var filtered = [];
    for (var k = 0; k < feedbacks.length; k++) {
      if (feedbacks[k].student_id === studentId) {
        filtered.push(feedbacks[k]);
      }
    }
    Logger.log('🔍 학생 ' + studentId + ' 피드백 ' + filtered.length + '건');
    return createJsonResponse({
      status: 'success',
      data: filtered
    });
  }
  
  Logger.log('✅ 피드백 ' + feedbacks.length + '건 조회 완료');
  
  return createJsonResponse({
    status: 'success',
    data: feedbacks
  });
}

/**
 * 교사 피드백 저장
 */
function saveTeacherFeedback(params) {
  var sheet = getOrCreateSheet(SHEET_NAMES.TEACHER_FEEDBACK);
  
  // 헤더 설정 (첫 실행 시)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'id', 'student_id', 'student_name', 'date',
      'feedback_type', 'content'
    ]);
  }
  
  // 데이터 추가
  sheet.appendRow([
    params.id || '',
    params.student_id || '',
    params.student_name || '',
    params.date || new Date().toISOString().split('T')[0],
    params.feedback_type || 'general',
    params.content || ''
  ]);
  
  Logger.log('✅ 피드백 저장 완료: ' + params.student_name);
  
  return createJsonResponse({
    status: 'success',
    message: '피드백이 저장되었습니다.'
  });
}

// ========================================
// 6. 유틸리티 함수
// ========================================

/**
 * 테스트 함수 (Apps Script 에디터에서 직접 실행)
 */
function testDoGet() {
  var testEvent = {
    parameter: {
      action: 'getStudyRecords',
      group_by: 'student'
    }
  };
  
  var response = doGet(testEvent);
  Logger.log('📤 응답: ' + response.getContent());
}
