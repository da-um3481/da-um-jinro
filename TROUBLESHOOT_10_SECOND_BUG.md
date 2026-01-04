# 🔍 10초 행 추가 버그 트러블슈팅 가이드

## 🎯 현재 상황 요약

**사용자 보고**: "여전히 10초씩 행이 추가되고 있어"

**코드 상태**: ✅ **이미 수정 완료** (커밋 0b6c38a, 2026-01-04)

**예상 원인**: 🌐 **브라우저 캐시** 또는 **GitHub Pages CDN 캐시**

---

## 🔬 문제 진단

### 1단계: 버전 확인

#### 방법
1. https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal.html 접속
2. `F12` 키 눌러 개발자 도구 열기
3. **Console** 탭 선택
4. 첫 줄 확인

#### 예상 결과
```
✅ 신버전: 버전: v2.0.1 | 빌드: 2026-01-04
❌ 구버전: 버전 정보가 없거나 이전 날짜
```

### 2단계: 코드 확인

#### Console에서 실행
```javascript
// saveTodayStudyTime 함수 확인
console.log(saveTodayStudyTime.toString().includes('saveStudyRecordToCloud'))
```

#### 예상 결과
```
✅ 신버전: false (saveStudyRecordToCloud 호출 없음)
❌ 구버전: true (saveStudyRecordToCloud 호출 있음)
```

### 3단계: 실제 저장 동작 확인

#### 테스트 시나리오
1. 학생으로 로그인
2. 과목 선택 (예: 영어)
3. 타이머 시작
4. **정확히 1분 대기**
5. Google Sheets 확인

#### 예상 결과
```
✅ 신버전: 1분 동안 새 행 추가 없음 (0개)
❌ 구버전: 1분 동안 6개 행 추가 (10초마다)
```

---

## 💊 해결 방법

### 해결책 A: 강력 새로고침 (⭐ 권장)

#### Windows
```
Ctrl + Shift + R
또는
Ctrl + F5
```

#### Mac
```
Cmd + Shift + R
```

#### 확인
- 새로고침 후 F12 → Console → `버전: v2.0.1` 확인

---

### 해결책 B: 캐시 완전 삭제

#### Chrome/Edge
1. `Ctrl + Shift + Delete` (Windows) 또는 `Cmd + Shift + Delete` (Mac)
2. 시간 범위: **전체 기간**
3. 체크: **캐시된 이미지 및 파일**
4. **인터넷 사용 기록 제외** (로그인 정보 유지)
5. 삭제 버튼 클릭

#### Firefox
1. `Ctrl + Shift + Delete`
2. 시간 범위: **전체**
3. 체크: **캐시**
4. 지금 지우기

---

### 해결책 C: 시크릿/프라이빗 모드

#### 실행
```
Windows: Ctrl + Shift + N
Mac: Cmd + Shift + N
```

#### 장점
- 캐시 영향 없음
- 즉시 최신 버전 확인 가능

#### 단점
- 로그인 정보가 없어서 다시 로그인 필요

---

### 해결책 D: URL 쿼리 파라미터 (⚡ 가장 확실)

#### 방법
기존 URL:
```
https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal.html
```

버전 파라미터 추가:
```
https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal.html?v=2.0.1
```

#### 작동 원리
- 브라우저가 다른 URL로 인식
- 캐시를 무시하고 서버에서 새로 다운로드

---

## 🧪 테스트 체크리스트

### ✅ 신버전 확인 체크리스트

- [ ] 1. F12 → Console → `버전: v2.0.1 | 빌드: 2026-01-04` 표시됨
- [ ] 2. Console → `localStorage.getItem('pageVersion')` 실행 → `"v2.0.1"` 반환
- [ ] 3. 타이머 1분 실행 → Google Sheets에 새 행 추가 안 됨
- [ ] 4. 타이머 완료 (30분) → Google Sheets에 1개 행만 추가됨
- [ ] 5. 추가된 행에 `start_time`, `end_time`, `study_duration` 포함됨

### ❌ 문제가 계속되면?

#### Console 로그 수집
```javascript
// F12 → Console에서 실행
console.log('버전:', localStorage.getItem('pageVersion'));
console.log('activeSubject:', localStorage.getItem('activeSubject'));
console.log('timerStartTime:', localStorage.getItem('timerStartTime'));
console.log('saveTodayStudyTime 함수:', saveTodayStudyTime.toString().substring(0, 500));
```

결과를 복사해서 공유

---

## 🔧 개발자용 임시 해결책

### 최소 학습 시간 30초로 변경 (테스트용)

#### 위치: `geunhwa-student-portal.html` 라인 2917

#### 변경 전
```javascript
const MIN_SECONDS = 1800;  // 30분
```

#### 변경 후 (테스트용)
```javascript
const MIN_SECONDS = 30;  // 30초 (테스트용)
```

#### 주의사항
⚠️ **프로덕션에서는 30분 유지 필수!**

---

## 📊 예상 결과 비교

### 시나리오: 45분 학습

#### ❌ 구버전 (버그 있음)
```
총 행 수: 270개
저장 간격: 10초마다
Google Sheets:
  Row 1: 영어, 0분 10초
  Row 2: 영어, 0분 20초
  Row 3: 영어, 0분 30초
  ...
  Row 270: 영어, 45분 0초
```

#### ✅ 신버전 (수정됨)
```
총 행 수: 1개
저장 시점: 완료 버튼 클릭 시
Google Sheets:
  Row 1: 영어, 시작: 14:30:00, 종료: 15:15:00, 학습: 45분 0초
```

---

## 🚀 배포 정보

### GitHub 커밋
| 날짜 | 커밋 해시 | 메시지 |
|------|-----------|--------|
| 2026-01-04 | a6ee8fd | 캐시 버스팅 및 버전 정보 추가 (v2.0.1) |
| 2026-01-04 | 0b6c38a | 10초마다 Google Sheets 저장 방지 |

### 코드 변경 위치
1. **라인 2757-2758**: Google Sheets 자동 저장 제거
   ```javascript
   // ⚠️ Google Sheets 자동 저장 제거 (타이머 완료 시에만 저장)
   // 10초마다 localStorage에만 저장하고, 클라우드는 stopTimer()에서 저장
   ```

2. **라인 3008-3026**: 완료 시에만 Google Sheets 저장
   ```javascript
   if (typeof saveStudyRecordToCloud === 'function') {
       saveStudyRecordToCloud({
           student_id: studentId,
           student_name: localStorage.getItem('currentStudentName'),
           date: today,
           subject: subject,
           start_time: formattedStartTime,
           end_time: formattedEndTime,
           study_duration: `${minutes}분 ${seconds}초`,
           progress: todayRecord.subjects[subject].textbook || '-',
           content: todayRecord.subjects[subject].content || '학습 완료'
       }).catch(err => console.warn('⚠️ 클라우드 저장 실패 (로컬은 저장됨):', err));
   }
   ```

---

## 📞 추가 지원

### 문제가 해결되지 않으면?

1. **스크린샷 공유**
   - F12 → Console 화면
   - Google Sheets H열 화면
   - 타이머 실행 화면

2. **테스트 로그 공유**
   ```javascript
   // Console에서 실행 후 결과 복사
   console.log('=== 디버그 정보 ===');
   console.log('페이지 버전:', localStorage.getItem('pageVersion'));
   console.log('현재 학생:', localStorage.getItem('currentStudentName'));
   console.log('활성 과목:', localStorage.getItem('activeSubject'));
   console.log('타이머 시작 시간:', localStorage.getItem('timerStartTime'));
   ```

3. **네트워크 탭 확인**
   - F12 → Network
   - 타이머 실행
   - 필터: `google`
   - POST 요청 확인

---

## ✨ 최종 확인

### 성공 기준
- ✅ 버전: v2.0.1 이상
- ✅ 타이머 실행 중: Google Sheets 변화 없음
- ✅ 타이머 완료 후: 1개 행만 추가
- ✅ 행 내용: 시작/종료 시간, 학습 시간 포함

### 실패 시 체크포인트
- ❌ 버전이 v2.0.1 미만 → **강력 새로고침**
- ❌ 10초마다 행 추가됨 → **캐시 삭제**
- ❌ 캐시 삭제 후에도 문제 → **시크릿 모드 테스트**
- ❌ 시크릿 모드에서도 문제 → **코드 재확인 필요**

---

**작성일**: 2026-01-04  
**작성자**: AI Assistant  
**상태**: 배포 완료, 사용자 캐시 문제 추정  
**테스트 URL**: https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal.html?v=2.0.1
