# 🚨 긴급 수정 가이드 - undefined 학생 이름 문제

## 📸 현재 상황
- 학생별 요약 보기에서 "undefined" 표시
- Google Sheets에는 데이터가 정상 저장됨

## 🔍 문제 원인 확인

### Step 1: Google Sheets 헤더 확인
`study_records` 시트의 **첫 번째 행**을 확인하세요:

현재 보이는 헤더가 뭔가요?
- [ ] A1: id, B1: name, C1: date ...
- [ ] A1: student_id, B1: student_name, C1: date ...
- [ ] 다른 형식?

## ✅ 해결 방법 (헤더별)

### 케이스 1: 헤더가 "student_id, student_name" 인 경우

Apps Script 코드에서 이 부분만 수정:

```javascript
// 기존 (244번 줄)
var studentName = record.student_name || 
                  record.name || 
                  record.studentName || 
                  '알 수 없음';

// Apps Script 전체 코드에서 위 부분을 찾아서
// 순서만 확인하세요. student_name이 먼저 나와야 합니다.
```

### 케이스 2: 헤더가 "id, name" 인 경우

Apps Script에서:
```javascript
var studentName = record.name || 
                  record.student_name || 
                  record.studentName || 
                  '알 수 없음';
```

## 🧪 즉시 테스트

Apps Script 에디터에서 이 코드를 실행하세요:

```javascript
function debugHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('study_records');
  var data = sheet.getDataRange().getValues();
  
  Logger.log('=== 헤더 디버깅 ===');
  Logger.log('첫 번째 행 (헤더): ' + JSON.stringify(data[0]));
  Logger.log('두 번째 행 (첫 데이터): ' + JSON.stringify(data[1]));
  
  if (data.length > 1) {
    var headers = data[0];
    var firstRow = data[1];
    var record = {};
    
    for (var i = 0; i < headers.length; i++) {
      record[headers[i]] = firstRow[i];
    }
    
    Logger.log('=== 파싱된 첫 레코드 ===');
    Logger.log('record.name: ' + record.name);
    Logger.log('record.student_name: ' + record.student_name);
    Logger.log('record.id: ' + record.id);
    Logger.log('record.student_id: ' + record.student_id);
  }
}
```

실행 후 로그를 **스크린샷으로 찍어서** 보여주세요!

## 📸 필요한 정보

다음 2개를 스크린샷으로 보여주세요:

1. **Google Sheets 헤더 (첫 번째 행)**
   - study_records 시트
   - A1, B1, C1, D1, E1, F1, G1 셀

2. **Apps Script 로그**
   - debugHeaders() 실행 결과

이 두 개만 보여주시면 **즉시 정확한 코드**를 만들어드립니다!
