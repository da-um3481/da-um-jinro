// ============================================
// Google Apps Script - 2주 단위 평가 시스템 추가
// ============================================
// 새로 추가된 평가:
// 1. mid_test_results (중간평가) - 2025-01-16
// 2. post_test_results (최종평가) - 2025-01-30
// 3. growth_test_results (성장테스트) - 2025-01-30
// 4. growth_comparison (문제별 성장 비교)
// ============================================

function doGet(e) {
  const action = e.parameter.action;
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // 기존 액션들
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
  } else if (action === 'saveAIFeedback') {
    return saveAIFeedback(e, sheet);
  }
  
  // 🆕 새로운 평가 액션들
  else if (action === 'saveMidTest') {
    return saveMidTest(e, sheet);
  } else if (action === 'getMidTests') {
    return getMidTests(e, sheet);
  } else if (action === 'savePostTest') {
    return savePostTest(e, sheet);
  } else if (action === 'getPostTests') {
    return getPostTests(e, sheet);
  } else if (action === 'saveGrowthTest') {
    return saveGrowthTest(e, sheet);
  } else if (action === 'getGrowthTests') {
    return getGrowthTests(e, sheet);
  } else if (action === 'saveGrowthComparison') {
    return saveGrowthComparison(e, sheet);
  } else if (action === 'getGrowthComparison') {
    return getGrowthComparison(e, sheet);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: 'Unknown action: ' + action
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  return doGet(e);
}

// ============================================
// 기존 함수들 (변경 없음)
// ============================================

// 학습 기록 저장
function saveStudyRecord(e, sheet) {
  try {
    const data = JSON.parse(e.postData.contents);
    const studySheet = sheet.getSheetByName('study_records') || sheet.insertSheet('study_records');
    
    // 헤더 확인 및 추가
    if (studySheet.getLastRow() === 0) {
      studySheet.appendRow(['student_id', 'student_name', 'date', 'subject', 'study_time', 'progress', 'content', 'timestamp']);
    }
    
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
    
    // 헤더 확인 및 추가
    if (diagnosticSheet.getLastRow() === 0) {
      diagnosticSheet.appendRow(['student_id', 'student_name', 'grade', 'total_score', 'level', 'math_score', 'english_score', 'korean_score', 'social_score', 'science_score', 'test_date', 'timestamp']);
    }
    
    diagnosticSheet.appendRow([
      data.student_id,
      data.student_name,
      data.grade,
      data.total_score,
      data.level,
      data.math_score || 0,
      data.english_score || 0,
      data.korean_score || 0,
      data.social_score || 0,
      data.science_score || 0,
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

// 피드백 저장 (교사)
function saveFeedback(e, sheet) {
  try {
    const data = JSON.parse(e.postData.contents);
    const feedbackSheet = sheet.getSheetByName('teacher_feedback') || sheet.insertSheet('teacher_feedback');
    
    // 헤더 확인 및 추가
    if (feedbackSheet.getLastRow() === 0) {
      feedbackSheet.appendRow(['student_id', 'student_name', 'date', 'feedback_type', 'content', 'is_read', 'timestamp']);
    }
    
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

// AI 피드백 저장
function saveAIFeedback(e, sheet) {
  try {
    const data = JSON.parse(e.postData.contents);
    const feedbackSheet = sheet.getSheetByName('ai_feedback') || sheet.insertSheet('ai_feedback');
    
    // 헤더 확인 및 추가
    if (feedbackSheet.getLastRow() === 0) {
      feedbackSheet.appendRow(['student_id', 'date', 'emoji', 'title', 'summary', 'strengths', 'improvements', 'tips', 'timestamp']);
    }
    
    feedbackSheet.appendRow([
      data.student_id,
      data.date,
      data.emoji,
      data.title,
      data.summary,
      data.strengths,
      data.improvements,
      data.tips,
      new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'AI Feedback saved'
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

// ============================================
// 🆕 중간평가 함수들 (Mid-test)
// ============================================

// 중간평가 저장
function saveMidTest(e, sheet) {
  try {
    const data = JSON.parse(e.postData.contents);
    const midTestSheet = sheet.getSheetByName('mid_test_results') || sheet.insertSheet('mid_test_results');
    
    // 헤더 확인 및 추가
    if (midTestSheet.getLastRow() === 0) {
      midTestSheet.appendRow([
        'student_id', 'student_name', 'grade', 
        'total_score', 'level', 
        'math_score', 'english_score', 'korean_score', 'social_score', 'science_score',
        'pre_total_score', 'improvement_rate',
        'test_date', 'timestamp'
      ]);
    }
    
    midTestSheet.appendRow([
      data.student_id,
      data.student_name,
      data.grade,
      data.total_score,
      data.level,
      data.math_score || 0,
      data.english_score || 0,
      data.korean_score || 0,
      data.social_score || 0,
      data.science_score || 0,
      data.pre_total_score || 0,
      data.improvement_rate || 0,
      data.test_date,
      new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Mid-test result saved'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 중간평가 조회
function getMidTests(e, sheet) {
  try {
    const midTestSheet = sheet.getSheetByName('mid_test_results');
    
    if (!midTestSheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = midTestSheet.getDataRange().getValues();
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

// ============================================
// 🆕 최종평가 함수들 (Post-test)
// ============================================

// 최종평가 저장
function savePostTest(e, sheet) {
  try {
    const data = JSON.parse(e.postData.contents);
    const postTestSheet = sheet.getSheetByName('post_test_results') || sheet.insertSheet('post_test_results');
    
    // 헤더 확인 및 추가
    if (postTestSheet.getLastRow() === 0) {
      postTestSheet.appendRow([
        'student_id', 'student_name', 'grade',
        'total_score', 'level',
        'math_score', 'english_score', 'korean_score', 'social_score', 'science_score',
        'pre_total_score', 'mid_total_score',
        'mid_improvement_rate', 'total_improvement_rate',
        'test_date', 'timestamp'
      ]);
    }
    
    postTestSheet.appendRow([
      data.student_id,
      data.student_name,
      data.grade,
      data.total_score,
      data.level,
      data.math_score || 0,
      data.english_score || 0,
      data.korean_score || 0,
      data.social_score || 0,
      data.science_score || 0,
      data.pre_total_score || 0,
      data.mid_total_score || 0,
      data.mid_improvement_rate || 0,
      data.total_improvement_rate || 0,
      data.test_date,
      new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Post-test result saved'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 최종평가 조회
function getPostTests(e, sheet) {
  try {
    const postTestSheet = sheet.getSheetByName('post_test_results');
    
    if (!postTestSheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = postTestSheet.getDataRange().getValues();
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

// ============================================
// 🆕 성장테스트 함수들 (Growth-test)
// ============================================

// 성장테스트 저장 (진단평가와 동일한 문제)
function saveGrowthTest(e, sheet) {
  try {
    const data = JSON.parse(e.postData.contents);
    const growthTestSheet = sheet.getSheetByName('growth_test_results') || sheet.insertSheet('growth_test_results');
    
    // 헤더 확인 및 추가
    if (growthTestSheet.getLastRow() === 0) {
      growthTestSheet.appendRow([
        'student_id', 'student_name', 'grade',
        'total_score', 'level',
        'math_score', 'english_score', 'korean_score', 'social_score', 'science_score',
        'pre_total_score', 'growth_rate',
        'questions_improved', 'questions_maintained', 'questions_declined',
        'test_date', 'timestamp'
      ]);
    }
    
    growthTestSheet.appendRow([
      data.student_id,
      data.student_name,
      data.grade,
      data.total_score,
      data.level,
      data.math_score || 0,
      data.english_score || 0,
      data.korean_score || 0,
      data.social_score || 0,
      data.science_score || 0,
      data.pre_total_score || 0,
      data.growth_rate || 0,
      data.questions_improved || 0,
      data.questions_maintained || 0,
      data.questions_declined || 0,
      data.test_date,
      new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Growth-test result saved'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 성장테스트 조회
function getGrowthTests(e, sheet) {
  try {
    const growthTestSheet = sheet.getSheetByName('growth_test_results');
    
    if (!growthTestSheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = growthTestSheet.getDataRange().getValues();
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

// ============================================
// 🆕 문제별 성장 비교 함수들
// ============================================

// 문제별 성장 비교 저장
function saveGrowthComparison(e, sheet) {
  try {
    const data = JSON.parse(e.postData.contents);
    const comparisonSheet = sheet.getSheetByName('growth_comparison') || sheet.insertSheet('growth_comparison');
    
    // 헤더 확인 및 추가
    if (comparisonSheet.getLastRow() === 0) {
      comparisonSheet.appendRow([
        'student_id', 'student_name', 
        'question_number', 'subject', 'concept',
        'pre_answer', 'growth_answer',
        'pre_correct', 'growth_correct',
        'improvement', 'test_date', 'timestamp'
      ]);
    }
    
    // 각 문제별로 행 추가
    if (data.comparisons && Array.isArray(data.comparisons)) {
      data.comparisons.forEach(comp => {
        comparisonSheet.appendRow([
          data.student_id,
          data.student_name,
          comp.question_number,
          comp.subject,
          comp.concept,
          comp.pre_answer,
          comp.growth_answer,
          comp.pre_correct,
          comp.growth_correct,
          comp.improvement,
          data.test_date,
          new Date().toISOString()
        ]);
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Growth comparison saved'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 문제별 성장 비교 조회
function getGrowthComparison(e, sheet) {
  try {
    const studentId = e.parameter.student_id;
    const comparisonSheet = sheet.getSheetByName('growth_comparison');
    
    if (!comparisonSheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = comparisonSheet.getDataRange().getValues();
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
