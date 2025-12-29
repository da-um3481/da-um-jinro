# 📋 학생 등록 및 포털 접근 시스템

## 🔄 전체 프로세스 흐름

### 1️⃣ 학생 등록 단계 (교사/관리자)
```
공유 페이지 → 학생 관리 시스템 → 학생 등록 (개별/엑셀)
```

**접근 경로:**
- 직접 접근: https://da-um3481.github.io/da-um-jinro/student-management.html
- 공유 페이지: https://da-um3481.github.io/da-um-jinro/geunhwa-share.html → "학생 관리 시스템" 카드
- 통합 포털: https://da-um3481.github.io/da-um-jinro/unified-portal.html → "학생 관리 시스템" 메뉴

**등록 방법:**
1. **개별 입력**: 한 명씩 수동 입력
   - 필수 정보: 학년, 반, 번호, 이름
   - 선택 정보: 성별, 전화번호, 이메일, 학부모 연락처, 특이사항
   
2. **엑셀 일괄 입력**: 다수 학생 한번에 등록
   - 엑셀 템플릿 다운로드
   - 학생 정보 입력 후 업로드
   - 자동 중복 체크 및 검증

**데이터 저장:**
```javascript
localStorage.setItem('student_list', JSON.stringify([
  {
    grade: "1",        // 학년 (1, 2, 3)
    class: "1",        // 반 번호
    number: "1",       // 번호
    name: "홍길동",    // 이름
    gender: "M",       // 성별 (M/F)
    phone: "010-1234-5678",
    email: "student@example.com",
    parentPhone: "010-9876-5432",
    notes: "특이사항",
    registeredDate: "2025-12-21T..."
  },
  // ... 추가 학생들
]));
```

---

### 2️⃣ 학생 포털 접근 단계 (학생)
```
학생 포털 접근 → 이름+학년 입력 → 등록 확인 → 포털 사용
                                  ↓ 미등록
                               접근 차단
```

**접근 경로:**
- 직접 접근: https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal.html
- 공유 페이지: https://da-um3481.github.io/da-um-jinro/geunhwa-share.html → "학생 포털 (30일 프로그램)" 카드

**검증 프로세스:**
1. 학생이 이름과 학년 입력
2. 시스템이 `student_list`에서 등록 여부 확인
3. **등록된 경우**: 포털 접근 허용 + 학생 정보 자동 연동
4. **미등록된 경우**: 접근 차단 + 안내 메시지 표시

---

## 🔒 등록 검증 로직

### 코드 구현 (geunhwa-student-portal.html)

```javascript
function loadStudentByName() {
    const nameInput = document.getElementById('studentNameInput').value.trim();
    const gradeSelect = document.getElementById('studentGradeSelect').value;
    const selectedGrade = parseInt(gradeSelect);
    
    if (!nameInput) {
        alert('이름을 입력해주세요!');
        return;
    }

    // ✅ STEP 1: 학생 관리 시스템에서 등록된 학생 확인
    const registeredStudents = JSON.parse(localStorage.getItem('student_list')) || [];
    const registeredStudent = registeredStudents.find(s => 
        s.name === nameInput && 
        s.grade === String(selectedGrade)
    );

    // ❌ STEP 2: 등록되지 않은 학생 접근 차단
    if (!registeredStudent) {
        alert(`❌ 등록되지 않은 학생입니다.

📝 입력 정보:
   • 이름: ${nameInput}
   • 학년: 중${selectedGrade}

💡 학생 관리 시스템에 먼저 등록해주세요.

🔗 학생 관리 시스템:
   https://da-um3481.github.io/da-um-jinro/student-management.html

또는 선생님께 문의하세요.`);
        return;
    }

    // ✅ STEP 3: 등록된 학생 - 포털 사용 허용
    // 학생 정보 자동 연동 및 초기화
    // ...
}
```

### 검증 조건
```javascript
// 조건 1: 이름이 정확히 일치해야 함
s.name === nameInput

// 조건 2: 학년이 정확히 일치해야 함
s.grade === String(selectedGrade)

// 둘 다 만족해야 등록된 학생으로 인정
```

---

## 📊 미등록 학생 접근 시 메시지

```
❌ 등록되지 않은 학생입니다.

📝 입력 정보:
   • 이름: [입력한 이름]
   • 학년: 중[입력한 학년]

💡 학생 관리 시스템에 먼저 등록해주세요.

🔗 학생 관리 시스템:
   https://da-um3481.github.io/da-um-jinro/student-management.html

또는 선생님께 문의하세요.
```

**메시지 특징:**
- ❌ 명확한 거부 표시
- 📝 입력한 정보 확인 가능
- 💡 해결 방법 제시
- 🔗 등록 시스템 직접 링크
- 선생님 문의 유도

---

## ✅ 등록된 학생 접근 시 동작

### 1. 학생 정보 자동 연동
```javascript
// 등록 시스템의 정보를 포털로 가져옴
student = {
    id: 'student_' + Date.now(),
    name: nameInput,
    grade: selectedGrade,
    class_num: parseInt(registeredStudent.class),    // 등록 시스템에서
    number: parseInt(registeredStudent.number),       // 등록 시스템에서
    phone: registeredStudent.phone,                   // 등록 시스템에서
    email: registeredStudent.email,                   // 등록 시스템에서
    created_at: new Date().toISOString()
};
```

### 2. 포털 초기화
- 학생 정보 표시 업데이트
- 환영 메시지 표시
- 오늘의 학습 스케줄 자동 생성
- 프로그램 진행률 표시
- 진단평가 안내 (미완료 시)

### 3. 화면 표시
```
📚 홍길동 (1학년 1반 1번)
```

---

## 🎯 시스템 장점

### 1. 보안 강화
- ✅ 미등록 학생의 무단 접근 차단
- ✅ 학생 관리 시스템과 연동된 검증
- ✅ 정확한 학생 식별 (이름 + 학년)

### 2. 데이터 무결성
- ✅ 사전 등록된 학생만 데이터 생성
- ✅ 학생 정보 자동 동기화
- ✅ 중복 학생 방지

### 3. 사용자 경험
- ✅ 명확한 안내 메시지
- ✅ 등록 방법 직접 제공
- ✅ 등록된 학생은 즉시 사용 가능

### 4. 관리 효율성
- ✅ 교사가 사전에 학생 등록
- ✅ 학생은 간단히 이름+학년만 입력
- ✅ 자동 정보 연동으로 중복 입력 불필요

---

## 📝 사용 시나리오

### 시나리오 1: 정상 사용 (등록된 학생)
1. **교사**: 학생 관리 시스템에서 "홍길동 (1학년 1반 1번)" 등록
2. **학생**: 학생 포털 접속
3. **학생**: 이름 "홍길동", 학년 "1" 입력 → "찾기" 클릭
4. **시스템**: ✅ 등록 확인 → 포털 접근 허용
5. **학생**: 진단평가 → 맞춤형 학습 시작

### 시나리오 2: 미등록 학생
1. **학생**: 학생 포털 접속
2. **학생**: 이름 "김철수", 학년 "2" 입력 → "찾기" 클릭
3. **시스템**: ❌ 미등록 확인 → 접근 차단
4. **학생**: 안내 메시지 확인
5. **학생**: 선생님께 등록 요청 또는 직접 등록 시스템 링크 공유

### 시나리오 3: 잘못된 정보 입력
1. **교사**: "이영희 (3학년)" 등록
2. **학생**: 이름 "이영희", 학년 "2" 입력 (잘못된 학년)
3. **시스템**: ❌ 불일치 → 접근 차단
4. **학생**: 정확한 학년으로 다시 입력

---

## 🔗 관련 페이지

| 페이지 | URL | 목적 |
|--------|-----|------|
| 학생 관리 시스템 | https://da-um3481.github.io/da-um-jinro/student-management.html | 학생 등록 (개별/엑셀) |
| 학생 포털 | https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal.html | 학생 학습 활동 |
| 공유 페이지 | https://da-um3481.github.io/da-um-jinro/geunhwa-share.html | 모든 링크 모음 |
| 통합 포털 | https://da-um3481.github.io/da-um-jinro/unified-portal.html | 전체 시스템 통합 |

---

## 🛠️ 기술 정보

### 데이터 저장소
- **저장 위치**: `localStorage` (브라우저 로컬 저장소)
- **저장 키**: `student_list`
- **데이터 형식**: JSON 배열

### 중요 함수
- `loadStudentByName()`: 학생 검색 및 검증
- `addStudent()`: 개별 학생 등록
- `importExcel()`: 엑셀 일괄 등록

### 브라우저 호환성
- Chrome, Edge, Firefox, Safari 모두 지원
- localStorage 지원 필수
- 모바일 브라우저 지원

---

## ⚠️ 주의사항

1. **localStorage 제한**
   - 브라우저별로 데이터가 독립적으로 저장됨
   - 동일한 브라우저에서 접속해야 데이터 공유 가능
   - 시크릿/사생활 보호 모드에서는 데이터 유지 안됨

2. **학생 등록 필수**
   - 반드시 학생 관리 시스템에 먼저 등록 필요
   - 등록 없이는 포털 접근 불가

3. **정확한 정보 입력**
   - 이름과 학년이 정확히 일치해야 함
   - 오타나 띄어쓰기 주의

4. **데이터 백업**
   - 학생 목록은 엑셀로 내보내기 기능 활용
   - 정기적인 백업 권장

---

## 📞 문의 및 지원

- **시스템 문제**: GitHub Issues
- **사용 문의**: 담당 교사
- **기술 지원**: 시스템 관리자

---

**최종 업데이트**: 2025-12-21  
**버전**: 2.0  
**작성자**: DA.UM 진로진학컨설팅
