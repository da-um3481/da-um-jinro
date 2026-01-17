# 🎓 DA.UM 진학상담 시스템 사용 가이드

## ✅ 시스템이 성공적으로 실행되었습니다!

이 시스템은 **기존 DA.UM 학습관리 시스템과 완전히 독립적**으로 작동합니다.

---

## 🌐 접속 URL

### 프론트엔드 (사용자 인터페이스)
👉 **메인 페이지**: https://3001-i45vnacl1o8qm5cx0lfip-2b54fc91.sandbox.novita.ai/index.html

👉 **진단 테스트**: https://3001-i45vnacl1o8qm5cx0lfip-2b54fc91.sandbox.novita.ai/diagnosis-test.html

### 백엔드 API
👉 **API 서버**: https://5000-i45vnacl1o8qm5cx0lfip-2b54fc91.sandbox.novita.ai

👉 **헬스 체크**: https://5000-i45vnacl1o8qm5cx0lfip-2b54fc91.sandbox.novita.ai/api/health

---

## 📋 시스템 특징

### 1. 완전 독립 실행 ✅
- **별도 포트**: 5000번 (백엔드), 3001번 (프론트엔드)
- **별도 데이터베이스**: `daum_admission.db`
- **기존 시스템 영향 없음**: 완전히 분리된 프로세스

### 2. 핵심 기능 구현 ✅
- ✅ 입시형 진단 엔진 (A-성적, B-비교과, C-학습태도)
- ✅ 전형 적합도 분석 (교과/종합/정시/논술)
- ✅ 자동 문장 생성 시스템
- ✅ REST API (Flask)
- ✅ 반응형 웹 인터페이스

---

## 🎯 진단 테스트 사용 방법

### Step 1: 진단 페이지 접속
위의 "진단 테스트" URL을 클릭하세요.

### Step 2: 데이터 입력
1. **성적 데이터**: 최근 학기 성적 입력 (등급 1-9)
2. **비교과 질문**: 4가지 질문에 답변 (0-2점)
3. **학습 태도 질문**: 4가지 질문에 답변 (0-2점)

### Step 3: 진단 실행
"📊 진단 실행하기" 버튼 클릭

### Step 4: 결과 확인
- 종합 입시형 (예: "내신 상승형·종합 보완 필요·관리형 학생")
- 전형별 적합도 점수 및 별점
- 추천 전략

---

## 🔧 API 사용 예시

### 1. 헬스 체크
```bash
curl https://5000-i45vnacl1o8qm5cx0lfip-2b54fc91.sandbox.novita.ai/api/health
```

### 2. 학생 목록 조회
```bash
curl https://5000-i45vnacl1o8qm5cx0lfip-2b54fc91.sandbox.novita.ai/api/students
```

### 3. 학생 등록
```bash
curl -X POST https://5000-i45vnacl1o8qm5cx0lfip-2b54fc91.sandbox.novita.ai/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "김학생",
    "grade": 5,
    "school_name": "XX고등학교",
    "desired_major": "컴퓨터공학"
  }'
```

---

## 📊 진단 알고리즘 개요

### A. 성적 구조 진단 (10점 만점)
- 평균 내신 (3점)
- 내신 추이 (3점)
- 과목 편차 (2점)
- 주요과목 (2점)

**결과**: 안정형 / 상승형 / 변동형 / 위험형

### B. 비교과 진단 (8점 만점)
- 활동 지속성 (2점)
- 전공 연계성 (2점)
- 사고 과정 드러남 (2점)
- 심화도 (2점)

**결과**: 종합 적합 / 종합 보완 필요 / 종합 부적합

### C. 학습 태도 진단 (8점 만점)
- 계획 이행률 (2점)
- 과제 완수도 (2점)
- 피드백 반영 (2점)
- 관리 효과성 (2점)

**결과**: 자율형 / 관리형 / 집중관리필요형

### 전형 적합도 산출
| 전형 | 가중치 |
|------|--------|
| **교과** | 성적 70% + 비교과 10% + 관리 20% |
| **종합** | 비교과 50% + 성적 30% + 관리 20% |
| **정시** | 관리 50% + 성적 30% + 비교과 20% |
| **논술** | 성적 40% + 관리 35% + 비교과 25% |

---

## 📁 프로젝트 구조

```
daum-admission-counseling/
├── backend/
│   ├── app.py                  # Flask 메인 앱
│   ├── diagnostics/
│   │   └── diagnosis_engine.py # 진단 로직
│   ├── daum_admission.db       # SQLite 데이터베이스
│   └── requirements.txt
├── frontend/
│   ├── index.html              # 메인 페이지
│   └── diagnosis-test.html     # 진단 테스트
└── docs/
    └── USAGE_GUIDE.md          # 이 파일
```

---

## 💾 데이터베이스 구조

### 테이블 목록
1. **counselors** - 상담사 정보
2. **students** - 학생 정보
3. **academic_records** - 성적 기록
4. **diagnoses** - 진단 결과
5. **admission_type_analysis** - 전형 분석
6. **risk_analysis** - 리스크 분석
7. **consultations** - 상담 기록

### 초기 계정
- **이메일**: admin@daum.edu
- **비밀번호**: test123 (개발용)

---

## 🚀 로컬에서 실행하기

### 백엔드
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 프론트엔드
```bash
cd frontend
python3 -m http.server 3001
```

---

## 🎨 주요 화면

### 1. 메인 페이지
- 시스템 상태 확인
- 주요 기능 소개
- API 테스트

### 2. 진단 테스트 페이지
- 3단계 질문지
- 실시간 진단
- 결과 시각화

---

## 📈 향후 개발 계획

### Phase 2 - 중학생 특화 (2주)
- [ ] 고교 선택 시뮬레이터
- [ ] 고교 유형별 리스크 분석
- [ ] 중학생 전용 리포트

### Phase 3 - 확장 기능 (4주)
- [ ] PDF 리포트 생성
- [ ] 상담 기록 타임라인
- [ ] 학년별 로드맵 자동 생성
- [ ] 리스크 자동 감지 시스템

### Phase 4 - 프로덕션 준비 (2주)
- [ ] 사용자 인증 (JWT)
- [ ] PostgreSQL 마이그레이션
- [ ] 프론트엔드 React 전환
- [ ] API 문서 자동화 (Swagger)

---

## ❓ FAQ

### Q1. 기존 시스템에 영향이 있나요?
**A**: 전혀 없습니다. 완전히 독립적인 데이터베이스와 포트를 사용합니다.

### Q2. 데이터는 어디에 저장되나요?
**A**: `backend/daum_admission.db` 파일에 저장됩니다.

### Q3. 프론트엔드를 수정하려면?
**A**: `frontend/` 디렉토리의 HTML 파일을 편집하면 됩니다.

### Q4. API 문서는 어디에 있나요?
**A**: 메인 페이지에서 "API 문서" 버튼을 클릭하세요.

### Q5. 진단 로직을 수정하려면?
**A**: `backend/diagnostics/diagnosis_engine.py` 파일을 수정하세요.

---

## 📞 문의

DA.UM 교육연구소
- 프로젝트: https://github.com/daum-edu
- 이메일: info@daum.edu

---

## 📝 라이선스

MIT License

---

**🎉 축하합니다! DA.UM 진학상담 시스템이 성공적으로 실행되었습니다!**
