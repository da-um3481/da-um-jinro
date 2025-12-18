# DA.UM 30일 프로그램 최종 배포 점검표

## ✅ 핵심 기능 점검 (localStorage 기반)

### 1. 학교/기관 관리 (schools-management.html)
- [ ] 학교 등록 (이름, 유형, 계약정보 등)
- [ ] 학교 목록 조회 (필터링)
- [ ] 학교 정보 수정
- [ ] 학교 삭제
- [ ] localStorage 'schools' 키 사용

### 2. 학생 등록/관리 (students.html)
- [ ] 학생 등록 (이름, 학년, 진단평가 점수 입력)
- [ ] 자동 레벨 계산 (평균점수 기반)
- [ ] 자동 교재 할당 (10개: 교재 5개 + EBS 강의 5개)
- [ ] 자동 4주 스케줄 생성 (28일, 평일 3h/주말 4h)
- [ ] 학생 목록 조회 (필터링)
- [ ] 학생 정보 수정
- [ ] 학생 삭제
- [ ] localStorage 'students' 키 사용

### 3. 교재 관리 (materials.html)
- [ ] 교재 목록 조회 (20개 초기 데이터)
- [ ] 교재 필터링 (과목, 레벨, 유형)
- [ ] 교재 검색
- [ ] localStorage 'materials' 키 사용

### 4. 수업 내용 관리 (lessons.html)
- [ ] 수업 내용 등록 (날짜, 학년, 과목, 단원, 내용)
- [ ] 수업 목록 조회
- [ ] 수업 내용 수정
- [ ] 수업 내용 삭제
- [ ] localStorage 'lessons' 키 사용

### 5. 주간 스케줄 관리 (weekly-schedule.html)
- [ ] 학생 선택
- [ ] 자동 스케줄 생성 (평일/주말 구분)
- [ ] 요일별 스케줄 표시
- [ ] localStorage 'student_schedules' 키 사용

### 6. 학생 포털 (geunhwa-student-portal.html)
- [ ] 오늘 날짜 표시
- [ ] 30일 프로그램 진행률 표시
- [ ] 과목별 학습 타이머 (수학, 영어, 국어, 과학, 사회)
- [ ] 학습 시작/완료 버튼
- [ ] 과목별 학습 내용 입력 (textarea)
- [ ] 실시간 학습 시간 기록
- [ ] localStorage 'study_records' 키 사용

### 7. 학습 기록 조회 (student-study-records.html)
- [ ] 학생 선택
- [ ] 학생 정보 카드 (이름, 학년, 평균점수, 레벨)
- [ ] 날짜별 학습 기록 목록
- [ ] 과목별 학습 시간 및 내용 표시
- [ ] 일일 총 학습 시간 계산

## 🔧 기술 점검

### JavaScript 문법 오류
- [✅] students.js - 문법 오류 없음
- [✅] materials.js - 문법 오류 없음
- [✅] lessons.js - 문법 오류 없음
- [✅] weekly-schedule.js - 문법 오류 없음

### HTML 페이지 존재
- [✅] index.html
- [✅] students.html
- [✅] schools-management.html
- [✅] materials.html
- [✅] lessons.html
- [✅] weekly-schedule.html
- [✅] geunhwa-student-portal.html
- [✅] student-study-records.html

### 메인 네비게이션 (index.html)
- [ ] 학교/기관 관리 링크
- [ ] 학생 등록/관리 링크
- [ ] 교재/강의 관리 링크
- [ ] 수업 내용 관리 링크
- [ ] 주간 스케줄 관리 링크
- [ ] 학습 기록 조회 링크

## 🌐 배포 확인

- [ ] GitHub Pages 배포 완료
- [ ] 모든 페이지 접근 가능
- [ ] localStorage 데이터 저장 확인
- [ ] 모바일 반응형 확인

## 📝 최종 Git 상태

- [✅] 모든 변경사항 커밋
- [✅] main 브랜치에 푸시
- [ ] 배포 URL 확인

---

**최종 배포 URL**: https://da-um3481.github.io/da-um-jinro/

