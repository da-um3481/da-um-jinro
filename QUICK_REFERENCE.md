# 📌 빠른 참조 가이드 (Quick Reference)

## 🔗 주요 링크 모음

### 🎓 학생용 포털
```
학생 포털 (30일 프로그램 - 5과목)
https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal.html

기초탄탄 포털 (3과목 집중)
https://da-um3481.github.io/da-um-jinro/tantan-student-portal.html

통합 포털 (전체 시스템)
https://da-um3481.github.io/da-um-jinro/unified-portal.html
```

### 👨‍🏫 교사/학부모용
```
교사 대시보드
https://da-um3481.github.io/da-um-jinro/middle-teacher-dashboard.html

학부모 대시보드
https://da-um3481.github.io/da-um-jinro/parent-dashboard.html
```

### 📢 공유 및 자료
```
공유 페이지
https://da-um3481.github.io/da-um-jinro/geunhwa-share.html

QR 코드 생성
https://da-um3481.github.io/da-um-jinro/generate-qr-codes.html

2페이지 제안서
https://da-um3481.github.io/da-um-jinro/geunhwa-proposal.html

프로그램 보고서
https://da-um3481.github.io/da-um-jinro/program-report.html
```

---

## ⚡ 핵심 기능 요약

### 일반 학생 포털 (30일 프로그램)
- **과목**: 5과목 (국어, 영어, 수학, 사회, 과학)
- **최소 학습 시간**: 30분/과목
- **일일 목표**: 2~3시간
- **진단평가**: 50문제 (과목당 10)
- **특징**: 정지 버튼 있음, 타이머 재로그인 시 복원

### 기초탄탄 포털
- **과목**: 3과목 (국어, 영어, 수학)
- **최소 학습 시간**: 30분/과목
- **목표 학습 시간**: 45분/과목
- **일일 목표**: 1~2시간
- **진단평가**: 30문제 (과목당 10)
- **특징**: 정지 버튼 없음 (연속 작동), 45분 시 10분 휴식 알림

---

## 🎯 타이머 규칙

### 공통 규칙
- ✅ 최소 30분 학습 필수
- ✅ 자동 저장 (10초마다)
- ✅ 재로그인 시 자동 복원 (같은 날)
- ✅ 날짜 변경 시 자동 초기화
- ✅ localStorage에 저장

### 기초탄탄 포털 추가 규칙
- ✅ 45분 도달 시 자동 알림
- ✅ 10분 휴식 권장
- ✅ 정지 버튼 없음 (완료까지 연속)

---

## 💾 localStorage 키

```javascript
// 기초탄탄 포털
tantan_student_data

// 일반 포털
studentData
study_records
activeSubject
currentStudentId
```

---

## 🚀 빠른 시작 가이드

### 학생용
1. 포털 접속
2. 이름 입력 및 학년 선택
3. 진단평가 완료 (선택)
4. 과목 선택 후 "시작" 버튼
5. 최소 30분 학습
6. "완료" 버튼 클릭

### 교사용
1. 교사 대시보드 접속
2. 학생 목록 확인
3. 개별 학생 진도 모니터링
4. 피드백 작성
5. 평가 관리

### 학부모용
1. 학부모 대시보드 접속
2. 자녀 학습 현황 확인
3. 과목별 진도 조회
4. 교사 피드백 확인

---

## 📊 문서 위치

```
/home/user/webapp/
├── WORK_SUMMARY.md              # 작업 완료 요약
├── SYSTEM_ARCHITECTURE.md       # 시스템 아키텍처
├── QUICK_REFERENCE.md           # 빠른 참조 가이드 (이 파일)
├── student-portal-orientation-script.md
└── tantan-orientation-script.md
```

---

## 🔧 개발자 정보

### Git Repository
```bash
Repository: da-um3481/da-um-jinro
Branch: main
URL: https://github.com/da-um3481/da-um-jinro.git
```

### 최근 커밋
```
3f7ef9d - Add system architecture documentation
8e07fbc - Add comprehensive work summary document
716a45f - Persist timer state and restore on same-day re-login
3aac966 - Remove stop button and update timer to run until complete
0ff02e0 - Update Tantan portal minimum study time to 30 minutes
```

---

## 📞 문의 및 지원

### 기술 지원
- GitHub Issues를 통해 문의
- 문서 참조: WORK_SUMMARY.md, SYSTEM_ARCHITECTURE.md

### 추가 기능 요청
- 향후 확장 계획 참조 (SYSTEM_ARCHITECTURE.md)
- Phase 2 개발 계획 확인

---

## ✅ 체크리스트

### 첫 시작 시
- [ ] QR 코드 인쇄 및 게시
- [ ] 오리엔테이션 스크립트 준비
- [ ] 학생 명단 확인
- [ ] 교사 대시보드 접속 테스트

### 일일 운영
- [ ] 학생 출석 확인
- [ ] 학습 진도 모니터링
- [ ] 개별 피드백 작성
- [ ] 문제 발생 시 대응

### 주간 점검
- [ ] 전체 학생 진도율 확인
- [ ] 평균 학습 시간 분석
- [ ] 저조한 학생 격려
- [ ] 우수 학생 칭찬

---

**최종 업데이트**: 2025-12-28  
**버전**: v1.1  
**상태**: ✅ 완료
