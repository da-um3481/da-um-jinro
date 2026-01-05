# 🔧 Apps Script - "undefined" 학생 이름 문제 해결

## 🎯 문제
- 학생별 요약에서 학생 이름이 "undefined"로 표시됨
- 원인: student_name 컬럼을 제대로 읽지 못함

## ✅ 해결 방법

Google Sheets의 **첫 번째 행(헤더)**을 확인하세요:

### 1️⃣ 헤더 확인
```
A열: id 또는 record_id
B열: student_id
C열: student_name (← 이 컬럼이 있는지 확인!)
D열: date
E열: subject
F열: time
G열: content
...
```

### 2️⃣ Apps Script 수정

`getStudyRecords` 함수를 다음과 같이 수정하세요:

```javascript
if (action === 'getStudyRecords') {
  try {
    var studentId = e.parameter.student_id || '';
    var groupBy = e.parameter.group_by || '';
    
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
    
    // 🔥 헤더 로깅 (디버깅용)
    Logger.log('헤더: ' + JSON.stringify(headers));
    
    // 데이터 파싱
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var record = {};
      
      for (var j = 0; j < headers.length; j++) {
        var key = String(headers[j]).trim();
        var value = row[j];
        
        // 빈 값 처리
        if (value === '' || value === null || value === undefined) {
          record[key] = '';
        } else {
          record[key] = value;
        }
      }
      
      records.push(record);
    }
    
    Logger.log('전체 학습 기록 개수: ' + records.length);
    if (records.length > 0) {
      Logger.log('첫 번째 레코드 샘플: ' + JSON.stringify(records[0]));
    }
    
    // 학생별 그룹화
    if (groupBy === 'student') {
      var grouped = {};
      
      for (var k = 0; k < records.length; k++) {
        var record = records[k];
        
        // 🔥 여러 가능한 필드명 시도
        var studName = record.student_name 
                    || record.studentName 
                    || record.name
                    || record['학생이름']
                    || record['이름']
                    || '알 수 없음';
        
        // 🔥 학생 ID도 여러 방식 시도
        var studId = record.student_id 
                  || record.studentId 
                  || record.id
                  || '';
        
        // 🔥 디버깅 로그
        if (k < 3) {
          Logger.log('레코드 ' + k + ' - 이름: ' + studName + ', ID: ' + studId);
        }
        
        if (!grouped[studName]) {
          grouped[studName] = {
            studentName: studName,
            studentId: studId,
            records: [],
            totalMinutes: 0,
            subjectStats: {}
          };
        }
        
        grouped[studName].records.push(record);
        
        // 학습 시간 누적
        var time = parseInt(record.time || record['시간'] || 0);
        grouped[studName].totalMinutes += time;
        
        // 과목별 통계
        var subject = record.subject || record['과목'] || '기타';
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
      
      Logger.log('그룹화 결과: ' + result.length + '명');
      
      return createJsonResponse({
        status: 'success',
        data: result,
        message: result.length + '명의 학생 학습 기록'
      });
    }
    
    // 특정 학생 필터링 (기존 코드 유지)
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

## 🔍 디버깅 방법

### 1️⃣ Apps Script 실행 로그 확인
1. Apps Script 편집기 열기
2. 상단 메뉴: **실행 → doGet**
3. 실행 후 **실행 로그 보기** 클릭
4. 다음 내용 확인:
   ```
   헤더: ["id","student_id","student_name","date",...]
   첫 번째 레코드 샘플: {"id":"...","student_name":"김다현",...}
   레코드 0 - 이름: 김다현, ID: student_123
   ```

### 2️⃣ 헤더가 잘못된 경우
만약 헤더가 다음과 같다면:
```
["A","B","C","D",...]  (← 잘못됨!)
```

**해결책**: study_records 시트의 **첫 번째 행**을 다음과 같이 수정:
```
A1: id
B1: student_id
C1: student_name
D1: date
E1: subject
F1: time
G1: content
```

---

## 🚀 적용 순서

1. ✅ Google Sheets 첫 번째 행(헤더) 확인
2. ✅ Apps Script 위 코드로 교체
3. ✅ Ctrl+S (저장)
4. ✅ 배포 → 새 버전 → 배포
5. ✅ 교사 대시보드 강력 새로고침 (Ctrl+Shift+R)
6. ✅ "학생별 요약 보기" 다시 클릭
7. ✅ F12 → Console에서 로그 확인

---

## 📊 예상 결과

### 수정 전
```
🎓 undefined
총 5개의 학습 기록    2시간 45분
```

### 수정 후
```
🎓 김다현
총 7개의 학습 기록    4시간 0분

🎓 박수은
총 5개의 학습 기록    2시간 45분
```

