# 📋 Apps Script - 학생별 그룹화 기능 추가

## 🎯 문제점
- 현재: 학습 기록이 시간순으로 저장되어 한 학생의 기록 보기 어려움
- 해결: 학생 이름별로 그룹화하여 학습 과목, 내용, 시간을 한눈에 보기

---

## ✅ Apps Script에 추가할 코드

`doGet` 함수의 `getStudyRecords` 액션 부분을 다음과 같이 수정:

```javascript
// ============================================================
// 3. 학습 기록 조회 (getStudyRecords) - 학생별 그룹화
// ============================================================
if (action === 'getStudyRecords') {
  try {
    var studentId = e.parameter.student_id || '';
    var groupBy = e.parameter.group_by || ''; // 'student' 또는 빈 문자열
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('study_records');
    if (!sheet) {
      return createJsonResponse({
        status: 'error',
        message: 'study_records 시트를 찾을 수 없습니다',
        data: []
      });
    }
    
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    
    if (values.length <= 1) {
      return createJsonResponse({
        status: 'success',
        data: []
      });
    }
    
    var headers = values[0];
    var records = [];
    
    // 헤더에서 각 컬럼 인덱스 찾기
    var studentIdIndex = -1;
    var studentNameIndex = -1;
    
    for (var h = 0; h < headers.length; h++) {
      var header = String(headers[h]).toLowerCase().trim();
      if (header === 'student_id' || header === 'studentid') {
        studentIdIndex = h;
      }
      if (header === 'student_name' || header === 'studentname') {
        studentNameIndex = h;
      }
    }
    
    // 데이터 파싱
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var record = {};
      
      for (var j = 0; j < headers.length; j++) {
        var key = String(headers[j]).trim();
        record[key] = row[j];
      }
      
      records.push(record);
    }
    
    Logger.log('전체 학습 기록 개수: ' + records.length);
    
    // 학생별 그룹화
    if (groupBy === 'student') {
      var grouped = {};
      
      for (var k = 0; k < records.length; k++) {
        var record = records[k];
        var studName = record.student_name || record.studentName || '알 수 없음';
        
        if (!grouped[studName]) {
          grouped[studName] = {
            studentName: studName,
            studentId: record.student_id || record.studentId || '',
            records: [],
            totalMinutes: 0,
            subjectStats: {}
          };
        }
        
        grouped[studName].records.push(record);
        
        // 학습 시간 누적
        var time = parseInt(record.time) || 0;
        grouped[studName].totalMinutes += time;
        
        // 과목별 통계
        var subject = record.subject || '기타';
        if (!grouped[studName].subjectStats[subject]) {
          grouped[studName].subjectStats[subject] = {
            count: 0,
            totalMinutes: 0
          };
        }
        grouped[studName].subjectStats[subject].count++;
        grouped[studName].subjectStats[subject].totalMinutes += time;
      }
      
      // 객체를 배열로 변환
      var result = [];
      for (var name in grouped) {
        if (grouped.hasOwnProperty(name)) {
          result.push(grouped[name]);
        }
      }
      
      // 이름순 정렬
      result.sort(function(a, b) {
        if (a.studentName < b.studentName) return -1;
        if (a.studentName > b.studentName) return 1;
        return 0;
      });
      
      return createJsonResponse({
        status: 'success',
        data: result,
        message: result.length + '명의 학생 학습 기록'
      });
    }
    
    // 특정 학생 필터링
    if (studentId) {
      var filtered = [];
      var targetStudentId = String(studentId).trim();
      
      for (var m = 0; m < records.length; m++) {
        var record = records[m];
        var recordStudentId = String(record.student_id || record.studentId || '').trim();
        
        if (recordStudentId === targetStudentId || recordStudentId.indexOf(targetStudentId + '_') === 0) {
          filtered.push(record);
        }
      }
      
      Logger.log('필터링된 기록 개수: ' + filtered.length);
      
      return createJsonResponse({
        status: 'success',
        data: filtered
      });
    }
    
    // 전체 반환
    return createJsonResponse({
      status: 'success',
      data: records
    });
    
  } catch (error) {
    Logger.log('Error in getStudyRecords: ' + error.message);
    return createJsonResponse({
      status: 'error',
      message: error.message,
      data: []
    });
  }
}
```

---

## 📊 사용 방법

### 1️⃣ 전체 학습 기록 조회 (기존)
```javascript
getStudyRecordsFromCloud()
```

### 2️⃣ 학생별 그룹화 조회 (신규)
```javascript
getStudyRecordsFromCloud('', 'student')
```

### 3️⃣ 특정 학생 조회 (기존)
```javascript
getStudyRecordsFromCloud('student_176706')
```

---

## 🎯 반환 데이터 구조 (학생별 그룹화)

```json
{
  "status": "success",
  "data": [
    {
      "studentName": "김다현",
      "studentId": "student_123",
      "totalMinutes": 240,
      "subjectStats": {
        "수학": { "count": 3, "totalMinutes": 90 },
        "영어": { "count": 2, "totalMinutes": 75 },
        "국어": { "count": 2, "totalMinutes": 75 }
      },
      "records": [
        { "date": "2025-01-05", "subject": "수학", "time": 45, "content": "..." },
        { "date": "2025-01-05", "subject": "영어", "time": 40, "content": "..." }
      ]
    }
  ]
}
```

---

## 🔧 적용 방법

1. Google Sheets → 확장 프로그램 → Apps Script
2. `doGet` 함수의 `getStudyRecords` 부분을 위 코드로 교체
3. Ctrl+S (저장)
4. 배포 → 배포 관리 → 새 버전 → 배포
5. 교사 대시보드에서 테스트

