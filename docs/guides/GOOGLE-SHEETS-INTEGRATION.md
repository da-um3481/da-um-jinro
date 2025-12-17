# 📊 구글 시트 연동 가이드

## ⚠️ 중요: 자동 연동이 아닙니다

현재 시스템의 구글 시트 연동은 **완전 자동 연동이 아닙니다**. 
선생님께서 직접 구글 Apps Script를 설정하셔야 합니다.

---

## 🔄 작동 방식

### 현재 방식 (수동 설정 필요)

1. **학생 데이터 저장**: 학생이 포털에서 학습 시간을 입력하면 브라우저의 `localStorage`에 저장됩니다.
2. **보고서 생성**: 선생님이 보고서 페이지에서 학생 이름을 입력하고 "보고서 생성" 버튼을 누르면 보고서가 생성됩니다.
3. **구글 시트 전송**: "구글 시트 전송" 버튼을 누르면:
   - 설정된 구글 Apps Script Web App URL로 데이터를 전송합니다
   - **Web App URL이 설정되지 않으면 작동하지 않습니다**

---

## 📝 구글 시트 연동 설정 방법

### 1단계: 구글 시트 생성

1. [Google Sheets](https://sheets.google.com)에 접속합니다
2. 새 스프레드시트를 생성합니다
3. 시트 이름을 "학습보고서" 등으로 설정합니다

### 2단계: 열(Column) 설정

첫 번째 행에 다음 제목들을 입력하세요:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| 날짜 | 학생이름 | 총학습시간 | 수학 | 영어 | 국어 | 과학 |

### 3단계: Apps Script 작성

1. 구글 시트에서 `확장 프로그램` > `Apps Script` 클릭
2. 아래 코드를 복사하여 붙여넣기:

```javascript
function doPost(e) {
  try {
    // JSON 데이터 파싱
    var data = JSON.parse(e.postData.contents);
    
    // 활성 시트 가져오기
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 새 행 추가
    sheet.appendRow([
      new Date(),                    // 날짜
      data.studentName,              // 학생 이름
      data.totalStudyTime,           // 총 학습 시간
      data.subjects.math || 0,       // 수학
      data.subjects.english || 0,    // 영어
      data.subjects.korean || 0,     // 국어
      data.subjects.science || 0     // 과학
    ]);
    
    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': '데이터가 저장되었습니다.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // 오류 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. 저장 버튼 클릭 (💾)
4. 프로젝트 이름 입력 (예: "학습보고서 연동")

### 4단계: Web App 배포

1. Apps Script 편집기에서 `배포` > `새 배포` 클릭
2. 설정:
   - **유형 선택**: "웹 앱"
   - **다음 사용자로 실행**: "나" (본인 계정)
   - **액세스 권한**: "모든 사용자" 또는 "조직 내 모든 사용자"
3. `배포` 버튼 클릭
4. **Web App URL 복사**: 
   ```
   https://script.google.com/macros/s/ABC...XYZ/exec
   ```
   ⚠️ 이 URL을 안전하게 보관하세요!

### 5단계: 시스템에 URL 설정

1. 보고서 페이지(`winter-report.html`)를 엽니다
2. "구글 시트 연동 설정하기" 버튼을 클릭합니다
3. 복사한 Web App URL을 입력합니다
4. "저장" 버튼을 클릭합니다

---

## ✅ 사용 방법

### 보고서 생성 및 전송

1. **학생 포털**(`winter-student-portal.html`)에서 학생이 학습 시간을 입력합니다
2. **보고서 페이지**(`winter-report.html`)로 이동합니다
3. 학생 이름을 입력하고 "보고서 생성" 버튼을 클릭합니다
4. 보고서 내용을 확인합니다
5. **"구글 시트 전송"** 버튼을 클릭하면:
   - 자동으로 구글 시트에 데이터가 추가됩니다
   - 성공 메시지가 표시됩니다
6. 구글 시트를 열어 데이터가 추가되었는지 확인합니다

---

## 🔧 문제 해결

### "Web App URL이 설정되지 않았습니다" 오류

- **원인**: 구글 Apps Script Web App URL을 설정하지 않았습니다
- **해결**: 위의 5단계를 완료하세요

### "전송 중 오류가 발생했습니다" 오류

- **원인 1**: Web App URL이 잘못되었습니다
  - **해결**: URL을 다시 확인하고 정확히 입력하세요
  
- **원인 2**: Apps Script 권한 문제
  - **해결**: Apps Script 배포 시 "모든 사용자" 권한으로 설정하세요
  
- **원인 3**: 네트워크 오류
  - **해결**: 인터넷 연결을 확인하세요

### 데이터가 구글 시트에 나타나지 않음

- **Apps Script 코드 확인**: 위의 코드가 정확히 입력되었는지 확인하세요
- **시트 이름 확인**: 활성 시트가 올바른지 확인하세요
- **Apps Script 로그 확인**: Apps Script 편집기에서 실행 로그를 확인하세요

---

## 🚀 향후 개선 계획

### Phase 1: 수동 연동 (현재)
- ✅ localStorage 기반 데이터 저장
- ✅ 수동 구글 시트 전송
- ⚠️ 선생님이 직접 Web App URL 설정 필요

### Phase 2: 반자동 연동 (3~6개월)
- 🔄 Firebase 또는 Supabase 백엔드 추가
- 🔄 자동 보고서 생성 및 전송
- 🔄 학부모 SMS 자동 발송

### Phase 3: 완전 자동 시스템 (6~12개월)
- 🔄 전문 백엔드 시스템
- 🔄 실시간 데이터 동기화
- 🔄 AI 기반 학습 분석
- 🔄 모바일 앱 개발

---

## 📞 문의

설정 중 문제가 발생하시면 연락 주세요:
- **담당자**: 정라미
- **전화**: 010-2657-3481
- **이메일**: (이메일 주소 추가)

---

## 📌 참고 자료

- [Google Apps Script 공식 문서](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Web Apps 배포 가이드](https://developers.google.com/apps-script/guides/web)
