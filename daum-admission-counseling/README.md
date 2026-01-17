# DA.UM 진학상담 시스템 (독립 버전)

> **중요**: 이 프로젝트는 기존 DA.UM 학습관리 시스템과 완전히 독립적으로 작동합니다.

## 프로젝트 개요

**대한민국 입시·진학 전문가용 웹앱**

상담사의 판단 구조를 디지털화한 전문 상담 도구입니다.

### 핵심 철학

> **"대한민국 입시를 '결과'가 아니라 '과정'으로 관리하는 진학상담 시스템"**

## 독립 실행 방식

이 프로젝트는 다음과 같이 완전히 독립적으로 실행됩니다:

1. **별도의 포트 사용**: 5000번 포트 (기존 시스템과 충돌 없음)
2. **독립 데이터베이스**: `daum_admission.db` (SQLite)
3. **독립 URL**: `/admission/` 경로로 시작
4. **별도 프론트엔드**: React 독립 앱

## 빠른 시작

### Backend 실행
```bash
cd daum-admission-counseling/backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

서버: http://localhost:5000

### Frontend 실행
```bash
cd daum-admission-counseling/frontend
npm install
npm start
```

앱: http://localhost:3001

## 주요 기능

### 1️⃣ 학생 진단 시스템
- **성적 구조 진단**: 내신 안정형/상승형/변동형/위험형 분류
- **비교과 분석**: 종합전형 적합도 평가
- **학습 태도 진단**: 관리 가능성 평가

### 2️⃣ 전형 분석 엔진
- 학생부교과 / 학생부종합 / 정시 / 논술 적합도 산출
- 전형별 이유 설명 자동 생성
- 리스크 요소 자동 감지

### 3️⃣ 전략 설계 시스템
- 학년별·시기별 로드맵 자동 생성
- 학생부 설계 가이드
- 과목 선택 추천

### 4️⃣ 상담 기록 관리
- 상담 이력 타임라인
- 상담사 코멘트 누적
- 학부모 공유용 리포트 생성

### 5️⃣ 리포트 시스템
- 자동 문장 생성
- PDF 출력 (5페이지 구조)
- 전문가 신뢰도 확보

## 사용자 구분

### 1차 사용자 (메인)
- 진학상담사
- 학습코치
- 학원 원장
- 학교 진로부

### 2차 사용자 (보조)
- 학부모 (리포트 열람)
- 학생 (자기 이해 도구)

## 기술 스택

### Backend
- Python 3.9+
- Flask 3.0
- SQLite (MVP) → PostgreSQL (확장)
- ReportLab (PDF 생성)

### Frontend
- React 18
- Tailwind CSS
- Chart.js (시각화)
- Axios (API 통신)

## 프로젝트 구조

```
daum-admission-counseling/
├── backend/
│   ├── app.py                 # Flask 메인 앱
│   ├── config.py              # 설정
│   ├── models/                # DB 모델
│   ├── routes/                # API 라우트
│   ├── diagnostics/           # 진단 로직
│   ├── utils/                 # 유틸리티
│   └── requirements.txt       # Python 패키지
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # UI 컴포넌트
│   │   ├── pages/             # 페이지
│   │   ├── services/          # API 서비스
│   │   └── utils/             # 유틸리티
│   └── package.json
└── docs/
    ├── API.md                 # API 문서
    ├── DATABASE_SCHEMA.md     # DB 스키마
    └── DIAGNOSIS_LOGIC.md     # 진단 로직
```

## 데이터 독립성

- **데이터베이스**: `daum_admission.db` (기존 시스템과 분리)
- **파일 저장소**: `./uploads/` 디렉토리
- **리포트 출력**: `./reports/` 디렉토리
- **로그 파일**: `./logs/` 디렉토리

## API 엔드포인트

모든 API는 `/api/admission/` 경로로 시작합니다:

- `POST /api/admission/auth/login` - 로그인
- `GET /api/admission/students` - 학생 목록
- `POST /api/admission/students` - 학생 등록
- `POST /api/admission/diagnosis` - 진단 실행
- `GET /api/admission/reports/:id` - 리포트 조회

자세한 내용은 [API.md](docs/API.md) 참조

## 개발 로드맵

### ✅ Phase 1 - MVP (현재)
- [x] 프로젝트 구조 설계
- [x] 진단 로직 구현
- [x] 전형 분석 알고리즘
- [ ] REST API 구현
- [ ] 프론트엔드 개발
- [ ] PDF 리포트 생성

### 🔄 Phase 2 - 중학생 특화
- [ ] 고교 선택 시뮬레이터
- [ ] 고교 리스크 분석
- [ ] 중학생 리포트 분리

### 📅 Phase 3 - 확장
- [ ] 학교/센터용 B2B
- [ ] 상담사 계정 시스템
- [ ] 데이터 분석 대시보드

## 기존 시스템과의 통합 (선택사항)

필요시 다음과 같이 통합할 수 있습니다:

1. **SSO 인증**: 기존 시스템 계정으로 로그인
2. **학생 데이터 동기화**: API를 통한 학생 정보 공유
3. **리포트 링크**: 기존 시스템에서 진학상담 리포트 접근

## 라이선스

MIT License

## 문의

DA.UM 교육연구소
- Email: info@daum.edu
- Website: https://daum.edu
