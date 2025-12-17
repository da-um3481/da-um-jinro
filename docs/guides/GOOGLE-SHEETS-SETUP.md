# 📊 구글 시트 자동 연동 설정 가이드

## 🎯 개요
DA.UM 겨울방학 30일 프로그램의 주간 리포트를 Google Sheets에 자동으로 전송하는 기능입니다.

---

## 🚀 설정 방법 (5분 소요)

### 1단계: 구글 시트 생성

1. **Google Sheets** 접속: https://sheets.google.com
2. **새 스프레드시트** 생성
3. 시트 이름을 `겨울방학 30일 프로그램 - 주간 리포트`로 변경

### 2단계: Apps Script 코드 작성

1. 구글 시트에서 **확장 프로그램** → **Apps Script** 클릭
2. 기존 코드를 모두 삭제하고 아래 코드를 복사해서 붙여넣기:

```javascript
function doPost(e) {
  try {
    // JSON 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 현재 스프레드시트 가져오기
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('주간 리포트');
    
    // 시트가 없으면 생성
    if (!sheet) {
      sheet = ss.insertSheet('주간 리포트');
      
      // 헤더 생성
      const headers = [
        '전송 시간', '학생 이름', '프로그램명', '시작일', '종료일', 
        '현재일', '총일수', '진행률(%)', '총 학습시간', '출석률(%)', 
        '일일 평균', '교재 진도(%)',
        '수학 시간', '수학 진도', '수학 교재', '수학 코멘트',
        '영어 시간', '영어 진도', '영어 교재', '영어 코멘트',
        '국어 시간', '국어 진도', '국어 교재', '국어 코멘트',
        '과학 시간', '과학 진도', '과학 교재', '과학 코멘트',
        '사회 시간', '사회 진도', '사회 교재', '사회 코멘트',
        '종합 평가', '강점', '개선 방향'
      ];
      
      sheet.appendRow(headers);
      
      // 헤더 스타일링
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#0ea5e9');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }
    
    // 데이터 행 추가
    const row = [
      new Date(data.timestamp).toLocaleString('ko-KR'),
      data.studentName,
      data.programName,
      data.startDate,
      data.endDate,
      data.currentDay,
      data.totalDays,
      data.progress,
      data.totalStudyHours,
      data.attendanceRate,
      data.dailyAverage,
      data.materialProgress,
      data.subjects.math.hours,
      data.subjects.math.progress,
      data.subjects.math.material,
      data.subjects.math.comment,
      data.subjects.english.hours,
      data.subjects.english.progress,
      data.subjects.english.material,
      data.subjects.english.comment,
      data.subjects.korean.hours,
      data.subjects.korean.progress,
      data.subjects.korean.material,
      data.subjects.korean.comment,
      data.subjects.science.hours,
      data.subjects.science.progress,
      data.subjects.science.material,
      data.subjects.science.comment,
      data.subjects.social.hours,
      data.subjects.social.progress,
      data.subjects.social.material,
      data.subjects.social.comment,
      data.overallEvaluation,
      data.strengths,
      data.improvements
    ];
    
    sheet.appendRow(row);
    
    // 자동 너비 조정
    sheet.autoResizeColumns(1, sheet.getLastColumn());
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: '데이터가 성공적으로 저장되었습니다.'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **저장** 버튼 클릭 (💾 아이콘)
4. 프로젝트 이름을 `겨울방학 리포트 수신`으로 변경

### 3단계: Web App 배포

1. 오른쪽 상단 **배포** → **새 배포** 클릭
2. **유형 선택** → **웹 앱** 선택
3. 설정:
   - **설명**: `겨울방학 주간 리포트 자동 저장`
   - **다음 사용자로 실행**: `나`
   - **액세스 권한**: `모든 사용자`
4. **배포** 버튼 클릭
5. **액세스 승인** → Google 계정 선택 → **고급** → **안전하지 않은 페이지로 이동** → **허용**
6. **웹 앱 URL** 복사 (예: `https://script.google.com/macros/s/AKfycby...`)

### 4단계: 프로그램에 URL 입력

1. **주간 리포트 페이지** 접속: https://da-um3481.github.io/da-um-jinro/winter-report.html
2. **"구글 시트 연동 설정하기"** 버튼 클릭
3. 복사한 **Web App URL** 붙여넣기
4. **확인** 클릭

---

## ✅ 사용 방법

### 주간 리포트 전송

1. **주간 리포트 페이지** 접속
2. **학생 이름** 입력
3. **"보고서 생성"** 버튼 클릭
4. **"구글 시트 전송"** 버튼 클릭 ✨
5. 구글 시트에서 데이터 확인!

### 자동화 팁

- 매주 금요일에 각 학생별로 리포트를 생성하고 전송하세요
- 구글 시트에서 **차트**를 만들어 시각화할 수 있습니다
- **필터** 기능으로 특정 학생만 볼 수 있습니다
- **공유** 기능으로 학부모님께 열람 권한을 드릴 수 있습니다

---

## 🎨 구글 시트 활용 예시

### 1. 학생별 진도 비교 차트
```
학생 이름 | 총 학습시간 | 진행률(%)
---------|------------|----------
김민준   | 28시간      | 23%
이서연   | 32시간      | 27%
박지훈   | 25시간      | 21%
```

### 2. 과목별 평균 학습 시간
```
과목 | 평균 시간
-----|----------
수학 | 8.5시간
영어 | 7.2시간
국어 | 5.8시간
```

### 3. 주간 출석률 추이
```
Week | 출석률(%)
-----|----------
1주차 | 100%
2주차 | 98%
3주차 | 100%
```

---

## 🔧 문제 해결

### Q1: "구글 시트 연동 설정 필요" 경고가 계속 표시됩니다
**A:** Web App URL을 올바르게 입력했는지 확인하세요. URL은 `https://script.google.com/macros/s/`로 시작해야 합니다.

### Q2: "전송 실패" 메시지가 표시됩니다
**A:** 
1. Web App 배포 시 **액세스 권한**이 `모든 사용자`로 설정되었는지 확인
2. Apps Script 코드가 올바르게 저장되었는지 확인
3. Web App URL이 최신 배포 버전인지 확인

### Q3: 구글 시트에 데이터가 표시되지 않습니다
**A:**
1. `no-cors` 모드로 전송되므로 실제로는 성공했을 수 있습니다 (구글 시트 확인)
2. Apps Script 실행 로그 확인: Apps Script 편집기 → 실행 → 실행 로그 보기

### Q4: 여러 선생님이 동시에 사용할 수 있나요?
**A:** 네! 같은 Web App URL을 공유하면 모든 선생님의 리포트가 하나의 구글 시트에 저장됩니다.

---

## 🚀 고급 기능 (선택)

### 자동 이메일 발송 (Apps Script)
주간 리포트가 저장되면 학부모님께 자동으로 이메일을 발송할 수 있습니다:

```javascript
function sendEmailNotification(studentName, reportData) {
  const email = "parent@example.com"; // 학부모 이메일
  const subject = `[DA.UM] ${studentName} 학생 주간 학습 리포트`;
  const body = `
    안녕하세요, ${studentName} 학부모님!
    
    이번 주 학습 현황입니다:
    - 총 학습시간: ${reportData.totalStudyHours}시간
    - 출석률: ${reportData.attendanceRate}%
    - 종합 평가: ${reportData.overallEvaluation}
    
    자세한 내용은 첨부된 구글 시트를 확인해주세요.
    
    감사합니다.
    DA.UM 진로진학컨설팅
  `;
  
  MailApp.sendEmail(email, subject, body);
}
```

### Google Data Studio 연동
구글 시트를 Data Studio에 연결하여 실시간 대시보드를 만들 수 있습니다:
1. https://datastudio.google.com 접속
2. **만들기** → **보고서**
3. **데이터 소스** → **Google 스프레드시트** 선택
4. 생성한 구글 시트 선택
5. 차트 추가 및 커스터마이징

---

## 📞 지원

문제가 계속되면 다음을 확인하세요:
- GitHub 저장소: https://github.com/da-um3481/da-um-jinro
- Google Apps Script 문서: https://developers.google.com/apps-script

---

**✨ 설정이 완료되면 "구글 시트 전송" 버튼 하나로 모든 리포트가 자동 저장됩니다!**
