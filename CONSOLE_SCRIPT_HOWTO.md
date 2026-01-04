# 🎯 Console 스크립트 실행 가이드 (단계별)

## 📍 현재 상황
- Console 탭 열림 ✅
- 경고 메시지들 보임 (정상)
- 스크립트 입력 위치 확인 필요

---

## 🔍 Step 1: Console 입력창 찾기

### 위치
Console 창 **맨 아래**에 다음과 같은 입력창이 있습니다:

```
> _  (깜박이는 커서)
```

또는

```
» _  (깜박이는 커서)
```

**이 입력창을 클릭**하세요!

---

## 📋 Step 2: 스크립트 복사하기

다음 스크립트를 **전체 선택 → 복사** (Ctrl+C):

```javascript
const diagnosticResults = JSON.parse(localStorage.getItem('diagnostic_results')) || [];
console.log('====== 진단평가 데이터 분석 ======');
console.log('📊 전체 개수:', diagnosticResults.length);
const middleSchool = diagnosticResults.filter(r => (r.grade || 0) <= 3);
console.log('📊 중학생 개수:', middleSchool.length);
console.log('');
console.log('====== 학생 목록 ======');
middleSchool.forEach((r, i) => {
    const id = r.studentId || r.student_id || 'undefined';
    const name = r.studentName || r.student_name || '이름없음';
    console.log(`${i+1}. ID: ${id} | 이름: ${name} | 학년: ${r.grade}`);
});
console.log('');
const noId = middleSchool.filter(r => !r.studentId && !r.student_id);
console.log('⚠️ studentId 없는 학생:', noId.length, '명');
console.log('====== 분석 완료 ======');
```

---

## 🖱️ Step 3: Console에 붙여넣기

### 방법 1: 마우스 우클릭
1. Console 입력창 클릭
2. **우클릭** → **붙여넣기**

### 방법 2: 키보드 단축키
1. Console 입력창 클릭
2. **Ctrl + V** (Windows) 또는 **Cmd + V** (Mac)

---

## ⚡ Step 4: 실행하기

스크립트가 입력창에 붙여넣어지면:
1. **Enter 키** 누르기

또는

스크립트가 여러 줄이면:
1. **Shift + Enter** (줄바꿈)
2. 모든 줄이 입력된 후 **Enter** 키

---

## 📊 예상 결과

스크립트 실행 후 Console에 다음과 같이 출력됩니다:

### ✅ 정상인 경우
```
====== 진단평가 데이터 분석 ======
📊 전체 개수: 5
📊 중학생 개수: 5

====== 학생 목록 ======
1. ID: student_176752 | 이름: 박상윤 | 학년: 1
2. ID: student_176753 | 이름: 성동현 | 학년: 3
3. ID: student_176754 | 이름: 김태연 | 학년: 1
4. ID: student_176755 | 이름: 손최로 | 학년: 1
5. ID: student_176756 | 이름: 테스트 | 학년: 1

⚠️ studentId 없는 학생: 0 명
====== 분석 완료 ======
```

### ❌ 문제가 있는 경우
```
====== 진단평가 데이터 분석 ======
📊 전체 개수: 10
📊 중학생 개수: 10

====== 학생 목록 ======
1. ID: student_176752 | 이름: 박상윤 | 학년: 1
2. ID: student_176753 | 이름: 성동현 | 학년: 3
3. ID: student_176754 | 이름: 김태연 | 학년: 1
4. ID: student_176755 | 이름: 손최로 | 학년: 1
5. ID: student_176756 | 이름: 테스트 | 학년: 1
6. ID: undefined | 이름: 이나연 | 학년: 1  ← 문제!
7. ID: undefined | 이름: 정서윤 | 학년: 2  ← 문제!
8. ID: undefined | 이름: 김민준 | 학년: 3  ← 문제!
9. ID: undefined | 이름: 최지우 | 학년: 1  ← 문제!
10. ID: undefined | 이름: 박서준 | 학년: 2  ← 문제!

⚠️ studentId 없는 학생: 5 명  ← 문제 원인!
====== 분석 완료 ======
```

---

## 🔴 경고 메시지는 무시하세요

Console에 보이는 다음 경고들은 **무시해도 됩니다**:
```
⚠️ Uncaught (in promise) TypeError: Cannot read properties...
⚠️ 차트 초기화 실패...
```

이것들은 차트 초기화 관련 오류이고, 진단평가 데이터 확인과는 **무관**합니다.

---

## 🎬 Step 5: 결과 스크린샷 공유

스크립트 실행 후:
1. Console 전체 화면 스크린샷
2. 다음 정보 확인:
   - 📊 전체 개수: ?
   - 📊 중학생 개수: ?
   - ⚠️ studentId 없는 학생: ? 명

---

## 💡 간단 버전 (한 줄 스크립트)

위 스크립트가 너무 길면, 이 짧은 버전을 사용하세요:

```javascript
const data = JSON.parse(localStorage.getItem('diagnostic_results')) || []; const ms = data.filter(r => (r.grade || 0) <= 3); console.log('전체:', data.length, '| 중학생:', ms.length, '| ID없음:', ms.filter(r => !r.studentId && !r.student_id).length);
```

**결과 예시**:
```
전체: 5 | 중학생: 5 | ID없음: 0
```
또는
```
전체: 10 | 중학생: 10 | ID없음: 5  ← 문제!
```

---

## 📸 스크린샷 예시

### 1. Console 입력창 위치
```
Console
├── (경고 메시지들)
├── (로그 메시지들)
└── > _  ← 여기에 붙여넣기!
```

### 2. 스크립트 붙여넣기 후
```
> const diagnosticResults = JSON.parse...
  console.log('====== 진단평가...
  ...
```

### 3. Enter 후 결과
```
====== 진단평가 데이터 분석 ======
📊 전체 개수: 5
📊 중학생 개수: 5
...
```

---

## 🆘 문제 해결

### 문제 1: 입력창을 찾을 수 없어요
**해결**: Console 창을 **아래로 스크롤**하세요. 입력창은 맨 아래에 있습니다.

### 문제 2: 붙여넣기가 안 돼요
**해결**: 
1. Console 입력창을 **클릭**해서 포커스를 맞추세요
2. **Ctrl + V** (Windows) 또는 **Cmd + V** (Mac)

### 문제 3: 오류가 나요
**해결**: 스크립트를 **정확히 전체 복사**했는지 확인하세요.

---

**스크립트를 실행한 후 결과를 알려주세요!** 😊

특히 다음 정보가 중요합니다:
- 📊 중학생 개수: ?
- ⚠️ studentId 없는 학생: ? 명
