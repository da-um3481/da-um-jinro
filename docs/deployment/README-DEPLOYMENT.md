# 🚀 DA.UM 겨울방학 30일 프로그램 - 배포 가이드

## 📡 GitHub Pages 배포 완료!

### 🌐 접속 URL (배포 후 활성화)
```
https://da-um3481.github.io/da-um-jinro/
```

---

## 📋 전체 페이지 목록

### 🎨 **프로그램 소개**
- **메인**: `winter-30days.html` - 프로그램 전체 안내

### 👔 **관리자용 시스템**
- **학교 관리**: `schools-management-new.html` - 학교/기관 등록 및 관리
- **학생 관리**: `students-new.html` - 학생 정보 등록 및 관리
- **대시보드**: `winter-index.html` - 실시간 학습 모니터링
- **주간 일정**: `winter-weekly-schedule.html` - 30일 프로그램 일정표
- **학습 자료**: `winter-materials.html` - EBS 자료 관리
- **주간 리포트**: `winter-report.html` - 학부모 전달용 리포트
- **피드백**: `winter-feedback.html` - 만족도 조사

### 🎒 **학생용 시스템**
- **학생 포털**: `winter-student-portal.html` - 일일 학습 기록

---

## 🔧 GitHub Pages 활성화 방법

### 1️⃣ GitHub 저장소 접속
```
https://github.com/da-um3481/da-um-jinro
```

### 2️⃣ Settings 메뉴 이동
1. 저장소 상단 메뉴에서 **Settings** 클릭
2. 왼쪽 메뉴에서 **Pages** 클릭

### 3️⃣ GitHub Pages 설정
```
Source: Deploy from a branch
Branch: main (또는 master)
Folder: / (root)
```

### 4️⃣ Save 버튼 클릭

### 5️⃣ 배포 완료 대기 (1-2분)
- 상단에 초록색 박스로 URL 표시:
  ```
  Your site is live at https://da-um3481.github.io/da-um-jinro/
  ```

---

## 📱 모바일 접속

QR 코드 생성하여 학생들에게 배포:
```
https://da-um3481.github.io/da-um-jinro/winter-student-portal.html
```

---

## 🎯 사용 시나리오

### **관리자 (정라미 선생님)**
```
1. 학교 등록: /schools-management-new.html
2. 학생 등록: /students-new.html
3. 매일 모니터링: /winter-index.html
4. 매주 리포트: /winter-report.html
```

### **학생들**
```
매일 접속: /winter-student-portal.html
- 오늘의 학습 기록
- 과목별 시간 입력
- 학습 소감 작성
```

### **학부모/신규 학교**
```
프로그램 안내: /winter-30days.html
- 프로그램 소개
- 커리큘럼
- 참여 방법
```

---

## 💾 데이터 저장

### 현재: LocalStorage (브라우저 저장)
```
장점: 
✅ 즉시 사용 가능
✅ 추가 설정 불필요

단점:
❌ 브라우저마다 다른 데이터
❌ 다른 기기에서 접속 시 데이터 없음
```

### 향후 업그레이드 (선택사항)
```
1. Firebase (무료): 실시간 데이터베이스
2. Supabase (무료): PostgreSQL
3. Google Sheets API: 스프레드시트 연동
```

---

## 🔐 보안 권장사항

### LocalStorage 사용 시
- 민감한 개인정보는 최소화
- 정기적으로 데이터 백업
- 학부모 동의 필수

### 개선 방안
- 학생 이름 대신 ID 사용
- 연락처 암호화
- 데이터베이스 이전

---

## 📞 지원 및 문의

**DA.UM 진로진학컨설팅**
- 대표: 정라미
- 연락처: 010-2657-3481
- 이메일: [추가 필요]

---

## 🎉 배포 완료 체크리스트

- [x] Git 커밋 완료
- [x] GitHub 푸시 완료
- [ ] GitHub Pages 활성화 (수동 설정 필요)
- [ ] 접속 URL 확인
- [ ] 학교 등록 테스트
- [ ] 학생 등록 테스트
- [ ] 모바일 접속 테스트
- [ ] 학생들에게 URL 공유

---

**배포일**: 2025-12-15
**버전**: 1.0.0
**상태**: ✅ 준비 완료
