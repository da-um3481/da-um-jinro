# 🎓 DA.UM 진학상담 시스템

> **대한민국 모든 고등학생을 위한 AI 기반 입시 전략 플랫폼**

---

## 📚 문서 가이드

### 🌟 **최신 완전판 가이드** (2026-2028학년도)
- **[MASTER_COUNSELOR_GUIDE_COMPLETE.md](./MASTER_COUNSELOR_GUIDE_COMPLETE.md)**
  - **117KB, 57,000자 이상의 완전한 마스터 가이드**
  - 100개 이상의 실전 입시 자료 분석 반영
  - 세특(세부능력 특기사항) 완전 정복 포함
  - 학년별 맞춤 상담법 + 전형별 전략 + 위기관리
  - **신입 상담사 필독 문서**

### 📖 기존 가이드
- [MASTER_COUNSELOR_GUIDE.md](./MASTER_COUNSELOR_GUIDE.md) - 기본 가이드 (레거시)
- [GUIDE_ONLY_README.md](./GUIDE_ONLY_README.md) - 시스템 사용 매뉴얼

---

## 🎯 프로젝트 구조

```
DA.UM/
├── frontend/               # 프론트엔드 (가이드 HTML)
│   ├── guide.html         # 웹 기반 가이드
│   └── assets/            # 정적 파일
├── backend/               # 백엔드 (데이터 & API)
│   ├── data_generator/    # 대학 데이터 생성기
│   ├── diagnosis/         # AI 진단 엔진
│   └── automation/        # 자동화 도구
├── data/                  # 입시 데이터
│   ├── universities/      # 대학별 데이터
│   └── statistics/        # 통계 데이터
└── docs/                  # 문서
    ├── MASTER_COUNSELOR_GUIDE_COMPLETE.md  ⭐ 최신 완전판
    ├── MASTER_COUNSELOR_GUIDE.md
    └── GUIDE_ONLY_README.md
```

---

## 🚀 빠른 시작

### 1. 프론트엔드 가이드 보기
```bash
cd frontend
python3 -m http.server 3001
# 브라우저에서 http://localhost:3001/guide.html 접속
```

### 2. 백엔드 시스템 실행
```bash
cd backend
python3 app.py
```

---

## 📊 주요 기능

### 1. AI 진단 시스템
- 학생부 + 성적 분석
- 전형별 적합도 평가 (A~F)
- 추천 대학 리스트 생성
- 개선 포인트 제시

### 2. 대학 데이터베이스
- **Layer 1 (핵심)**: 서울·경상권 16개 대학, 50개 학과
- **Layer 2 (확장)**: 전국 주요 대학 추가 예정
- 실시간 입결 데이터 업데이트

### 3. 자동화 도구
- 자기소개서 첨삭
- 면접 예상 질문 생성
- 모의 원서 작성 시뮬레이션

---

## 📖 마스터 가이드 주요 내용

### PART 1. 입시 기초 이론
- 대학입시의 구조
- 4대 전형 완전 정복 (교과/종합/논술/정시)
- 학생부의 모든 것
- 수능 최저학력기준 이해

### PART 2. 세특 완전 정복 ⭐
- 세특의 중요성과 원리
- 매력적인 세특 작성 전략
- **세특 관리 4가지 방법**
- 전공별 세특 작성 사례 (의·약학, 공학, 인문·사회, 자연과학)
- 세특 기재 금지 사항 (2025학년도 기준)

### PART 3. 실전 상담 프로세스
- 첫 상담 40분 완벽 가이드
- 학년별 맞춤 상담법 (예비고1~고3)
- 전형별 전략 수립 (교과/학종/논술/정시)
- 위기관리 상담법 (내신 폭망, 모의고사 하락, 수시 전멸, 진로 변경)

### PART 4. DA.UM 시스템 활용
- 시스템 완전 활용법
- 자동 진단 해석 가이드
- 상담 시나리오 120선

### PART 5. 시기별 로드맵 & 체크리스트
- 학년별 연간 로드맵
- 월별 핵심 일정
- 겨울/여름방학 계획

### PART 6. 대학별 전략 & 면접
- 주요 대학 인재상 분석
- 대학별 면접 전략
- 합격 사례 분석

### PART 7. 상담사 자가 점검 & 성장
- 상담사 체크리스트
- 자주 묻는 질문 FAQ 100

---

## 💡 주요 특징

### ✅ 데이터 기반 판단
- 10,000+ 데이터 포인트
- 3개년 입시 결과 분석
- 실시간 입결 업데이트

### ✅ 실전 중심 가이드
- 100개 이상 실전 입시 자료 반영
- 상담 스크립트 30+ 포함
- 세특 관리 핵심 노하우 집대성

### ✅ AI 자동화
- 학생부 자동 분석
- 전형별 적합도 평가
- 자기소개서 첨삭

---

## 🔧 기술 스택

### Frontend
- HTML, CSS, JavaScript
- Responsive Design

### Backend
- Python 3.9+
- Data Processing & Analysis

### Data
- JSON 기반 데이터베이스
- 실시간 업데이트 파이프라인

---

## 📅 업데이트 이력

### 2026-01-17 (최신)
- ✅ **MASTER_COUNSELOR_GUIDE_COMPLETE.md 생성** (117KB, 57,000자)
- ✅ 100개 이상 실전 입시 자료 분석 반영
- ✅ 세특 완전 정복 섹션 추가
- ✅ 학년별 맞춤 상담법 + 위기관리 상담법 추가

### 2026-01-16
- Layer1 데이터 구축 완료 (16개 대학, 50개 학과)
- DA.UM 진단 엔진 구현
- 프론트엔드 가이드 HTML 생성

---

## 📞 문의

- **프로젝트 리포지토리**: [GitHub - da-um-jinro](https://github.com/da-um3481/da-um-jinro)
- **이슈 트래킹**: GitHub Issues
- **기여하기**: Pull Request 환영!

---

## 📜 라이선스

This project is proprietary and confidential.

---

**DA.UM - 모든 학생의 꿈을 응원합니다 🎓**
