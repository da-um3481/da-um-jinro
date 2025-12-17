# 📊 샘플 데이터 가이드

## 🎓 샘플 학생 데이터

### 학생 1: 김민수 (우수 학생)
```javascript
{
  "name": "김민수",
  "grade": 2,
  "class_num": 3,
  "student_num": 15,
  "korean_score": 92,
  "english_score": 88,
  "math_score": 95,
  "science_score": 90,
  "social_score": 87,
  "level": "상",
  "status": "활동중"
}
```

### 학생 2: 이지은 (보통 학생)
```javascript
{
  "name": "이지은",
  "grade": 2,
  "class_num": 3,
  "student_num": 8,
  "korean_score": 75,
  "english_score": 72,
  "math_score": 68,
  "science_score": 70,
  "social_score": 73,
  "level": "중",
  "status": "활동중"
}
```

### 학생 3: 박준호 (기초 학생)
```javascript
{
  "name": "박준호",
  "grade": 2,
  "class_num": 3,
  "student_num": 22,
  "korean_score": 55,
  "english_score": 48,
  "math_score": 52,
  "science_score": 50,
  "social_score": 56,
  "level": "하",
  "status": "활동중"
}
```

## 📅 샘플 학습 계획 (김민수 - 2024년 3월 15일)

```javascript
{
  "student_id": "학생ID",
  "date": "2024-03-15",
  "korean_time": 40,    // 40분
  "english_time": 50,   // 50분
  "math_time": 70,      // 70분 (중요 과목이라 더 많이)
  "science_time": 40,   // 40분
  "social_time": 40,    // 40분
  "total_planned_time": 240,  // 총 4시간
  "notes": "수학 시험 범위 집중 학습"
}
```

## ✅ 샘플 일일 체크리스트

### 완료된 체크 항목
```javascript
{
  "student_id": "학생ID",
  "date": "2024-03-15",
  "subject": "수학",
  "content": "일차함수 그래프 그리기 연습",
  "planned_time": 70,
  "actual_time": 75,    // 5분 초과 달성!
  "completed": true,
  "memo": "개념은 이해했는데 문제풀이가 아직 어려워요"
}
```

### 미완료 체크 항목
```javascript
{
  "student_id": "학생ID",
  "date": "2024-03-15",
  "subject": "영어",
  "content": "Grammar Zone Unit 5 학습",
  "planned_time": 50,
  "actual_time": 0,
  "completed": false,
  "memo": ""
}
```

## 💬 샘플 주간 피드백

```javascript
{
  "student_id": "학생ID",
  "week_start": "2024-03-10",
  "week_end": "2024-03-16",
  "study_time_achievement": 92.5,  // 92.5% 달성
  "korean_progress": "문학 작품 분석 3편 완료, 비문학 독해 연습 진행",
  "english_progress": "Grammar Zone Unit 5-7 완료, 단어 암기 80개",
  "math_progress": "일차함수 단원 완료, 문제풀이 150문항",
  "science_progress": "화학반응 단원 복습, 실험 노트 정리",
  "social_progress": "근대사 정리 및 연표 작성",
  "improvement_notes": "영어 듣기 연습 시간을 늘릴 필요가 있음. 매일 30분씩 EBS 듣기 강의 수강 권장",
  "teacher_comment": "이번 주 학습 태도가 매우 좋았습니다. 특히 수학 과목에서 많은 발전이 있었고, 계획한 시간을 거의 완벽히 지켰습니다. 다만 영어 듣기 부분이 약하니 이 부분을 집중적으로 보완하면 좋겠습니다. 계속 이렇게 꾸준히 하면 중간고사에서 좋은 결과가 있을 것 같습니다!"
}
```

## 📖 샘플 학교 수업 내용

```javascript
{
  "date": "2024-03-15",
  "grade": 2,
  "subject": "수학",
  "chapter": "3. 일차함수와 그래프",
  "importance": "높음",
  "content": "일차함수 y=ax+b의 그래프 그리기 방법 학습. 기울기 a와 y절편 b의 의미 이해. 두 점을 지나는 직선의 방정식 구하기 연습. 실생활 문제 적용 예제 풀이."
}
```

## 📚 추천 교재 예시

### 상급 학생용 - 수학
```javascript
{
  "type": "교재",
  "subject": "수학",
  "title": "일품 중등수학",
  "level": "상",
  "description": "심화 학습용 교재. 내신 및 경시 대비에 적합한 난이도 높은 문제 수록",
  "publisher": "동아출판",
  "url": ""
}
```

### 중급 학생용 - 영어
```javascript
{
  "type": "교재",
  "subject": "영어",
  "title": "Grammar Zone 종합편",
  "level": "중",
  "description": "중학 영문법 전 과정 마스터. 실전 문제 다량 수록",
  "publisher": "능률",
  "url": ""
}
```

### EBS 강의
```javascript
{
  "type": "EBS강의",
  "subject": "수학",
  "title": "EBS 중학 수학 - 개념 완성",
  "level": "중",
  "description": "기본 개념을 쉽고 명확하게 설명하는 무료 강의",
  "publisher": "EBS",
  "url": "https://www.ebsmath.co.kr"
}
```

## 📊 실제 사용 시나리오

### 시나리오 1: 우수 학생 (김민수)
- **목표**: 내신 1등급 유지, 심화 학습
- **학습 시간**: 매일 4시간 이상
- **달성률**: 평균 95%
- **추천 교재**: 일품, 완자 등 심화 교재
- **피드백**: 자기주도적 학습 태도가 매우 우수, 경시대회 도전 권장

### 시나리오 2: 보통 학생 (이지은)
- **목표**: 평균 75점 이상 유지, 꾸준한 학습
- **학습 시간**: 매일 3-4시간
- **달성률**: 평균 80%
- **추천 교재**: 개념원리, Grammar Zone 등
- **피드백**: 꾸준한 학습으로 성적 향상 중, 복습 시간 늘리기 권장

### 시나리오 3: 기초 학생 (박준호)
- **목표**: 기본 개념 확실히 다지기
- **학습 시간**: 매일 3시간 목표
- **달성률**: 평균 65%
- **추천 교재**: 체크체크, 우공비 등 기초 교재
- **피드백**: 학습 습관 형성 중, EBS 기초 강의 병행 권장

## 💡 데이터 입력 팁

### 좋은 피드백 예시
```
✅ 구체적: "수학 문제 150개 풀이"
✅ 긍정적: "이번 주 많은 발전이 있었습니다"
✅ 실행 가능: "매일 30분씩 영어 듣기 연습하세요"
```

### 피해야 할 피드백
```
❌ 모호함: "열심히 하세요"
❌ 부정적: "왜 이것도 못하니"
❌ 비현실적: "하루에 10시간씩 공부하세요"
```

## 🎯 성공 사례

### 사례 1: 수학 성적 20점 향상
- **기간**: 2개월
- **방법**: 매일 수학 1.5시간 집중, EBS 강의 + 개념원리 교재
- **결과**: 55점 → 75점

### 사례 2: 자기주도학습 습관 형성
- **기간**: 1개월
- **방법**: 매일 체크리스트 완료, 선생님 피드백 적극 반영
- **결과**: 달성률 40% → 85%

---

이 샘플 데이터를 참고하여 실제 데이터를 입력하시면 됩니다! 🎓
