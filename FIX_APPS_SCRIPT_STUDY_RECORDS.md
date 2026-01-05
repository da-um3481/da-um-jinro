# 🔧 Google Apps Script 수정: getStudyRecords 구현

## 🚨 문제 상황

### Console 로그
```javascript
✅ 클라우드에서 학습 기록을 불러왔습니다: { status: "success", data: [] }
❌ data: 빈 배열 (0건)
```

### Google Sheets 실제 데이터
```
Row 12: student_176706, 박수은, 2026-01-05, 사회, 학습 완료
```

### 원인
- **Apps Script의 `getStudyRecords` 액션이 없거나 제대로 작동하지 않음**
- 데이터는 있지만 필터링 실패로 빈 배열 반환

---

## 🔧 **Apps Script 수정 방법**

### 1️⃣ Google Sheets Apps Script 열기

1. **Google Sheets 열기**
   - 자기주도학습UP설문지 시트 열기

2. **확장 프로그램 → Apps Script**
   - 상단 메뉴: 확장 프로그램 → Apps Script
   - 또는 단축키: Alt + Shift + F11

3. **코드.gs 파일 확인**
   - 왼쪽 파일 목록에서 `코드.gs` 클릭

---

## 📝 **수정할 코드**

### 현재 코드 확인

`doGet` 또는 `doPost` 함수에서 다음 부분을 찾으세요:

```javascript
function doGet(e) {
    const action = e.parameter.action;
    
    if (action === 'getDiagnosticResults') {
        // ... 진단평가 조회
    } else if (action === 'saveDiagnosticResult') {
        // ... 진단평가 저장
    } else if (action === 'getStudyRecords') {
        // ← 이 부분이 없거나 문제가 있음!
    }
    // ...
}
```

---

### ✅ **수정된 코드 (추가 또는 교체)**

```javascript
function doGet(e) {
    const action = e.parameter.action;
    
    // ============================================================
    // 📚 학습 기록 조회 (getStudyRecords)
    // ============================================================
    if (action === 'getStudyRecords') {
        try {
            const studentId = e.parameter.student_id;
            const sheet = SpreadsheetApp.getActiveSpreadsheet()
                                         .getSheetByName('study_records');
            
            if (!sheet) {
                return ContentService.createTextOutput(
                    JSON.stringify({ 
                        status: 'error', 
                        message: 'study_records 시트를 찾을 수 없습니다',
                        data: [] 
                    })
                ).setMimeType(ContentService.MimeType.JSON);
            }
            
            const data = sheet.getDataRange().getValues();
            
            // 첫 번째 행은 헤더
            const headers = data[0];
            const rows = data.slice(1);
            
            // 헤더 인덱스 찾기
            const studentIdIndex = headers.findIndex(h => 
                h === 'student_id' || h === 'studentId' || h === 'A'
            );
            
            if (studentIdIndex === -1) {
                return ContentService.createTextOutput(
                    JSON.stringify({ 
                        status: 'error', 
                        message: 'student_id 컬럼을 찾을 수 없습니다',
                        data: [] 
                    })
                ).setMimeType(ContentService.MimeType.JSON);
            }
            
            // 데이터를 객체 배열로 변환
            const records = rows
                .filter(row => row[0])  // 빈 행 제외 (A열이 비어있지 않은 행만)
                .map(row => {
                    const obj = {};
                    headers.forEach((header, i) => {
                        obj[header] = row[i];
                    });
                    return obj;
                });
            
            Logger.log('전체 학습 기록 개수: ' + records.length);
            
            // student_id로 필터링
            if (studentId) {
                const filtered = records.filter(record => {
                    const recordStudentId = String(record.student_id || record.studentId || '').trim();
                    const targetStudentId = String(studentId).trim();
                    
                    Logger.log('비교: ' + recordStudentId + ' === ' + targetStudentId);
                    
                    return recordStudentId === targetStudentId ||
                           recordStudentId.startsWith(targetStudentId + '_');
                });
                
                Logger.log('필터링된 기록 개수: ' + filtered.length);
                
                return ContentService.createTextOutput(
                    JSON.stringify({ 
                        status: 'success', 
                        data: filtered 
                    })
                ).setMimeType(ContentService.MimeType.JSON);
            }
            
            // student_id 파라미터가 없으면 전체 반환
            return ContentService.createTextOutput(
                JSON.stringify({ 
                    status: 'success', 
                    data: records 
                })
            ).setMimeType(ContentService.MimeType.JSON);
            
        } catch (error) {
            Logger.log('getStudyRecords 오류: ' + error.message);
            return ContentService.createTextOutput(
                JSON.stringify({ 
                    status: 'error', 
                    message: error.message,
                    data: [] 
                })
            ).setMimeType(ContentService.MimeType.JSON);
        }
    }
    
    // ============================================================
    // 다른 액션들...
    // ============================================================
    if (action === 'getDiagnosticResults') {
        // ... 기존 코드
    }
    
    // ...
}
```

---

## 🧪 **테스트 방법**

### 1️⃣ Apps Script 저장
```
Ctrl + S (저장)
```

### 2️⃣ 배포 (재배포 필요!)
```
1. 상단 메뉴: 배포 → 배포 관리
2. "새 버전" 또는 "배포 수정" 클릭
3. 웹 앱 URL 복사
```

### 3️⃣ URL 확인
```
WEB_APP_URL이 최신 배포 URL인지 확인
google-sheets-api.js 파일의 WEB_APP_URL 확인
```

### 4️⃣ 교사 대시보드에서 테스트
```
1. 강력 새로고침 (Ctrl+Shift+R)
2. 학습 관리 → 박수은 (중1) 선택
3. Console 확인
```

---

## 📊 **예상 결과**

### 수정 전 ❌
```javascript
✅ 클라우드에서 학습 기록을 불러왔습니다: { status: "success", data: [] }
🔍 [학습 기록] Google Sheets 결과: { status: "success", data: [] }
⚠️ [학습 기록] Google Sheets 데이터 없음
```

### 수정 후 ✅
```javascript
✅ 클라우드에서 학습 기록을 불러왔습니다: { status: "success", data: [1건] }
🔍 [학습 기록] Google Sheets 결과: { status: "success", data: [{...}] }
✅ [학습 기록] Google Sheets에서 1 건 로드

학습 기록 테이블:
날짜          과목    학습 시간    진도    내용
2026-01-05   사회     -           -      학습 완료
```

---

## 🔍 **디버깅: Apps Script Logs 확인**

### Apps Script에서 로그 확인
```
1. Apps Script 편집기 열기
2. 상단 메뉴: 실행 → 함수 실행 → doGet (테스트용)
3. 하단 "실행 로그" 확인
```

### 로그 예시
```
전체 학습 기록 개수: 13
비교: student_176706 === student_176706
필터링된 기록 개수: 1
```

---

## ⚠️ **주의사항**

### 1️⃣ 배포 버전 업데이트 필수!
```
Apps Script 코드 수정 후 반드시 "새 배포" 또는 "배포 수정" 필요!
기존 배포는 코드 수정이 반영되지 않습니다!
```

### 2️⃣ 캐시 문제
```
브라우저 캐시로 인해 이전 버전 실행 가능
강력 새로고침 (Ctrl+Shift+R) 필수!
```

### 3️⃣ WEB_APP_URL 확인
```
google-sheets-api.js의 WEB_APP_URL이
최신 배포 URL과 일치하는지 확인!
```

---

## 📝 **체크리스트**

### Apps Script 수정
- [ ] Apps Script 편집기 열기
- [ ] `getStudyRecords` 액션 코드 추가/수정
- [ ] 저장 (Ctrl+S)
- [ ] 배포 → 새 배포 또는 배포 수정
- [ ] 웹 앱 URL 복사

### 테스트
- [ ] 교사 대시보드 강력 새로고침
- [ ] 학생 선택 (박수은 중1)
- [ ] Console 로그 확인
- [ ] 학습 기록 테이블 표시 확인

---

## 🔗 **관련 문서**
- `DEBUG_STUDY_RECORDS_DISPLAY.md` - 학습 기록 표시 디버깅
- `FIX_STUDY_MANAGEMENT_STUDENT_LIST.md` - 학습 관리 학생 목록 연동

---

## 💡 **핵심 요약**

**문제**: Apps Script의 `getStudyRecords` 액션 누락 또는 필터링 실패
**해결**: 위 코드를 Apps Script에 추가하고 재배포
**테스트**: 강력 새로고침 후 Console 로그 확인

---

**Apps Script 수정 후 결과를 공유해주세요!** 😊
