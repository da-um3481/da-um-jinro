# 🎯 Google Sheets 업데이트 가이드 - 2주 단위 평가 시스템

## 📋 개요

기존 진단평가 시스템에 **3개의 새로운 평가**를 추가합니다:

1. **중간평가** (Mid-test) - 2025-01-16
2. **최종평가** (Post-test) - 2025-01-30
3. **성장테스트** (Growth-test) - 2025-01-30 (진단평가와 동일한 문제 재시험)

---

## 🚀 업데이트 방법

### Step 1: Google Sheets 열기

기존 Google Sheets를 엽니다:
```
https://docs.google.com/spreadsheets/d/1UNGlEFfXRwqBy-LUm9trBTJRlgkHsOGKfBI7hCqRpeo/edit
```

### Step 2: Apps Script 에디터 열기

1. **확장 프로그램** → **Apps Script** 클릭
2. 기존 코드를 **모두 삭제**
3. 아래 새 코드를 **전체 복사 & 붙여넣기**

### Step 3: 새 코드 붙여넣기

`GOOGLE_APPS_SCRIPT_UPDATED.js` 파일의 전체 내용을 복사하여 붙여넣습니다.

### Step 4: 저장 및 재배포

1. **저장** 버튼 클릭 (💾 아이콘)
2. **배포** → **배포 관리**
3. 기존 배포 옆의 **✏️ (수정)** 클릭
4. **버전** → **새 버전** 선택
5. **배포** 클릭

⚠️ **중요**: 웹 앱 URL은 변경되지 않습니다!
```
https://script.google.com/macros/s/AKfycbxCRKmOjkjEbSPkpjzb_RF6c-o3g9GsvHBMjFzu2YxLbac7nK_MwV2AT5VYfzFR7aP7MQ/exec
```

---

## 📊 새로 추가되는 시트

### 1. mid_test_results (중간평가)

| 컬럼명 | 설명 | 예시 |
|--------|------|------|
| student_id | 학생 ID | student_001 |
| student_name | 학생 이름 | 김철수 |
| grade | 학년 | 1 |
| total_score | 총점 | 45 |
| level | 수준 | 표준 |
| math_score | 수학 점수 | 9 |
| english_score | 영어 점수 | 9 |
| korean_score | 국어 점수 | 9 |
| social_score | 사회 점수 | 9 |
| science_score | 과학 점수 | 9 |
| pre_total_score | 진단평가 점수 | 35 |
| improvement_rate | 향상률 (%) | 28.6 |
| test_date | 시험 날짜 | 2025-01-16 |
| timestamp | 저장 시간 | 2025-01-16T14:30:00Z |

### 2. post_test_results (최종평가)

| 컬럼명 | 설명 | 예시 |
|--------|------|------|
| student_id | 학생 ID | student_001 |
| student_name | 학생 이름 | 김철수 |
| grade | 학년 | 1 |
| total_score | 총점 | 47 |
| level | 수준 | 우수 |
| math_score | 수학 점수 | 10 |
| english_score | 영어 점수 | 9 |
| korean_score | 국어 점수 | 9 |
| social_score | 사회 점수 | 10 |
| science_score | 과학 점수 | 9 |
| pre_total_score | 진단평가 점수 | 35 |
| mid_total_score | 중간평가 점수 | 45 |
| mid_improvement_rate | 중간평가 대비 향상률 | 4.4 |
| total_improvement_rate | 전체 향상률 | 34.3 |
| test_date | 시험 날짜 | 2025-01-30 |
| timestamp | 저장 시간 | 2025-01-30T14:30:00Z |

### 3. growth_test_results (성장테스트)

| 컬럼명 | 설명 | 예시 |
|--------|------|------|
| student_id | 학생 ID | student_001 |
| student_name | 학생 이름 | 김철수 |
| grade | 학년 | 1 |
| total_score | 총점 | 46 |
| level | 수준 | 우수 |
| math_score | 수학 점수 | 10 |
| english_score | 영어 점수 | 9 |
| korean_score | 국어 점수 | 9 |
| social_score | 사회 점수 | 9 |
| science_score | 과학 점수 | 9 |
| pre_total_score | 진단평가 점수 (동일 문제) | 35 |
| growth_rate | 성장률 (%) | 31.4 |
| questions_improved | 향상된 문제 수 | 12 |
| questions_maintained | 유지된 문제 수 | 23 |
| questions_declined | 하락한 문제 수 | 1 |
| test_date | 시험 날짜 | 2025-01-30 |
| timestamp | 저장 시간 | 2025-01-30T15:00:00Z |

### 4. growth_comparison (문제별 성장 비교)

| 컬럼명 | 설명 | 예시 |
|--------|------|------|
| student_id | 학생 ID | student_001 |
| student_name | 학생 이름 | 김철수 |
| question_number | 문제 번호 | 1 |
| subject | 과목 | 수학 |
| concept | 개념 | 이차방정식 |
| pre_answer | 진단평가 답안 | 2 |
| growth_answer | 성장테스트 답안 | 3 |
| pre_correct | 진단평가 정답 여부 | false |
| growth_correct | 성장테스트 정답 여부 | true |
| improvement | 향상 여부 | improved |
| test_date | 시험 날짜 | 2025-01-30 |
| timestamp | 저장 시간 | 2025-01-30T15:00:00Z |

---

## ✅ 업데이트 확인

Apps Script 재배포 후:

1. **시트 자동 생성 확인**
   - 첫 데이터 저장 시 시트가 자동으로 생성됩니다
   - `mid_test_results`, `post_test_results`, `growth_test_results`, `growth_comparison`

2. **테스트**
   - 학생 포털에서 중간평가 진행
   - Google Sheets에 데이터 저장 확인

---

## 📌 주요 변경사항

### 🆕 추가된 API 액션

```javascript
// 중간평가
- saveMidTest: 중간평가 결과 저장
- getMidTests: 중간평가 결과 조회

// 최종평가
- savePostTest: 최종평가 결과 저장
- getPostTests: 최종평가 결과 조회

// 성장테스트
- saveGrowthTest: 성장테스트 결과 저장 (진단평가와 동일 문제)
- getGrowthTests: 성장테스트 결과 조회

// 문제별 비교
- saveGrowthComparison: 문제별 성장 비교 저장
- getGrowthComparison: 문제별 성장 비교 조회
```

### 🔄 기존 기능 유지

- ✅ 진단평가 (diagnostic_results)
- ✅ 학습 기록 (study_records)
- ✅ 교사 피드백 (teacher_feedback)
- ✅ AI 피드백 (ai_feedback)

**모든 기존 기능은 그대로 유지됩니다!**

---

## 🎯 평가 일정 요약

```
2025-01-05 (일) 📝 진단평가 시작
              ↓
2025-01-16 (목) 📊 중간평가 (2주차)
              ↓
2025-01-30 (목) 📋 최종평가 + 🎯 성장테스트 (4주차)
```

---

## ❓ 문제 해결

### Q: 시트가 자동으로 생성되지 않아요
**A**: 첫 데이터 저장 시 자동 생성됩니다. 학생이 평가를 완료하면 시트가 생성됩니다.

### Q: 웹 앱 URL이 변경되었나요?
**A**: 아니요! URL은 그대로입니다. 버전만 업데이트됩니다.

### Q: 기존 데이터는 안전한가요?
**A**: 네! 기존 시트와 데이터는 전혀 영향을 받지 않습니다.

---

## 📞 지원

문제가 발생하면:
1. Apps Script 로그 확인 (실행 → 로그)
2. Google Sheets 데이터 확인
3. 학생 포털 F12 콘솔 로그 확인

---

**업데이트 완료 후 연락 주세요! 🎉**
