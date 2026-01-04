# 🚨 긴급: 캐시 문제 해결 가이드

## 📋 문제 상황

사용자가 "여전히 10초씩 행이 추가된다"고 보고했지만, 코드는 이미 수정되었습니다.

### 원인
- **브라우저 캐시**: 사용자가 구버전 HTML 파일을 보고 있음
- **GitHub Pages 캐시**: CDN 캐시가 업데이트되지 않음

## ✅ 해결 방법

### 1️⃣ 사용자에게 안내할 내용

#### 방법 A: 강력 새로고침 (가장 빠름)
```
Windows: Ctrl + Shift + R 또는 Ctrl + F5
Mac: Cmd + Shift + R
```

#### 방법 B: 캐시 완전 삭제
1. 브라우저에서 `Ctrl + Shift + Delete` (Windows) 또는 `Cmd + Shift + Delete` (Mac)
2. 시간 범위: **전체 기간** 선택
3. **캐시된 이미지 및 파일** 체크
4. 삭제 후 페이지 재방문

#### 방법 C: 시크릿/프라이빗 모드
```
Windows: Ctrl + Shift + N
Mac: Cmd + Shift + N
```
새 시크릿 창에서 학생 포털 열기

#### 방법 D: 버전 확인 URL (권장)
```
https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal.html?v=2.0.1
```
URL 끝에 `?v=2.0.1`을 추가하면 캐시를 우회합니다.

### 2️⃣ 버전 확인 방법

1. 학생 포털 접속
2. `F12` 키를 눌러 개발자 도구 열기
3. **Console** 탭 확인
4. 다음과 같은 메시지가 보여야 함:
   ```
   버전: v2.0.1 | 빌드: 2026-01-04
   ```

### 3️⃣ 코드 확인

#### ❌ 구버전 (문제 있음)
```javascript
// saveTodayStudyTime 함수 내부
if (typeof saveStudyRecordToCloud === 'function') {
    saveStudyRecordToCloud({
        student_id: studentId,
        student_name: localStorage.getItem('currentStudentName'),
        date: today,
        subject: subject,
        study_time: Math.floor(totalSeconds / 60),
        progress: todayRecord.subjects[subject].textbook || '-',
        content: todayRecord.subjects[subject].content || '학습 진행 중'
    }).catch(err => console.warn('⚠️ 클라우드 저장 실패:', err));
}
```

#### ✅ 신버전 (수정됨)
```javascript
// saveTodayStudyTime 함수 내부
// ⚠️ Google Sheets 자동 저장 제거 (타이머 완료 시에만 저장)
// 10초마다 localStorage에만 저장하고, 클라우드는 stopTimer()에서 저장
```

## 📊 테스트 체크리스트

### 테스트 1: 버전 확인
- [ ] F12 → Console → `버전: v2.0.1` 확인

### 테스트 2: 타이머 실행
- [ ] 학생으로 로그인
- [ ] 과목 선택 (예: 영어)
- [ ] 타이머 시작
- [ ] **1분 대기** (10초가 아닌 1분!)
- [ ] Google Sheets 확인 → **새 행이 추가되지 않아야 함**

### 테스트 3: 타이머 완료
- [ ] 30분 학습 (또는 테스트용으로 코드 수정)
- [ ] "완료" 버튼 클릭
- [ ] Google Sheets 확인 → **1개 행만 추가되어야 함**
- [ ] 시작 시간, 종료 시간, 학습 시간이 정확해야 함

## 🔍 문제가 계속되면?

### 디버깅 단계

1. **콘솔 로그 확인**
   ```javascript
   // F12 → Console에서 다음을 실행:
   localStorage.getItem('pageVersion')
   ```
   → `v2.0.1`이 나와야 함

2. **네트워크 탭 확인**
   - F12 → Network
   - 페이지 새로고침
   - `geunhwa-student-portal.html` 클릭
   - Response 탭에서 버전 확인

3. **GitHub Pages 캐시 대기**
   - GitHub Pages는 최대 10분까지 캐시 가능
   - 10분 후 다시 시도

## 📁 관련 파일

- `geunhwa-student-portal.html` (라인 2757-2758: Google Sheets 자동 저장 제거)
- `geunhwa-student-portal.html` (라인 3008-3026: 완료 시에만 저장)

## 📅 수정 이력

| 날짜 | 버전 | 커밋 | 내용 |
|------|------|------|------|
| 2026-01-04 | v2.0.1 | a6ee8fd | 캐시 버스팅 및 버전 정보 추가 |
| 2026-01-04 | v2.0.0 | 0b6c38a | 10초 중복 저장 버그 수정 |

## 🎯 예상 결과

### ✅ 수정 후
- 타이머 실행 중: **Google Sheets에 저장 안 됨**
- 타이머 완료 후: **1개 행만 추가됨**
- 학습 45분: **1개 행 (시작: 14:30:00, 종료: 15:15:00, 시간: 45분 0초)**

### ❌ 수정 전 (구버전)
- 타이머 실행 중: **10초마다 Google Sheets에 저장됨**
- 학습 45분: **270개 행 추가됨** (45분 × 6회/분 = 270회)

---

## 💡 추가 제안

사용자가 계속 문제를 보고하면:

1. **테스트용 최소 학습 시간 30초로 변경**
   - 30분은 테스트하기 너무 길다
   - 30초로 줄이면 빠르게 테스트 가능

2. **10초 자동 저장 간격을 30초로 증가**
   - localStorage 저장을 30초마다로 변경
   - 재로그인 대비는 충분함

3. **버전 비교 알림 추가**
   - 구버전 사용자에게 자동으로 새로고침 권장

---

**작성일**: 2026-01-04  
**상태**: 배포 완료, 사용자 캐시 문제 추정
