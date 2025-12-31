# 🚨 긴급 해결 가이드

## 문제 진단

### ✅ 현재 상황
- 학생이 진단평가 완료
- 선생님 대시보드에 데이터 없음

### ❌ 원인
localStorage는 페이지별로 분리됨
→ 학생 포털과 선생님 대시보드는 **완전히 다른 저장소**

## 🔥 즉시 해결 방법

### 방법 1: 학생이 JSON 파일 다운로드 (권장)

#### Step 1: 학생 포털 재접속
```
https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal.html
또는
https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal-semester.html
```

#### Step 2: 로그인
- 이름 입력
- 학년 선택
- 로그인

#### Step 3: 2초 후 팝업 확인
```
"📢 중요 알림!
진단평가를 완료하셨습니다!
지금 바로 데이터를 내보내시겠습니까?"
```
→ **"확인" 클릭**

#### Step 4: JSON 파일 다운로드 확인
- 다운로드 폴더 확인
- 파일명: `진단평가_이름_날짜.json`

#### Step 5: 선생님께 제출
- 카카오톡
- 이메일
- USB

### 방법 2: 수동 내보내기

#### 학생 포털 접속 후:
1. 우측 상단 📥 (다운로드) 버튼 클릭
2. JSON 파일 자동 다운로드
3. 선생님께 제출

### 방법 3: 선생님이 Import

#### Step 1: 중학교 교사 대시보드 접속
```
https://da-um3481.github.io/da-um-jinro/middle-teacher-dashboard.html
```

#### Step 2: "평가 관리" 섹션으로 이동

#### Step 3: "📤 데이터 가져오기" 버튼 클릭

#### Step 4: JSON 파일 선택
- 여러 파일 동시 선택 가능 (Ctrl + 클릭)
- 열기

#### Step 5: 자동으로 데이터 표시!

## 🔍 디버깅

### localStorage 확인하는 방법

1. F12 (개발자 도구)
2. Console 탭
3. 다음 입력:
```javascript
console.log('진단평가 데이터:', localStorage.getItem('diagnostic_results'));
```

4. 결과 확인:
   - `null` → 데이터 없음 (정상, Import 필요)
   - `[...]` → 데이터 있음

## ⚠️ 중요!

**localStorage는 파일별로 분리됩니다!**

- 학생 포털 localStorage ≠ 선생님 대시보드 localStorage
- 반드시 JSON 파일로 전달해야 함
- 이것이 정상입니다!

## 📞 긴급 연락

문제가 계속되면:
1. 어떤 단계에서 막혔는지
2. 스크린샷
3. 에러 메시지

를 알려주세요!
