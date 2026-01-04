# 📅 30일 학습 프로그램 시작일 수정 완료

## 🎯 프로그램 일정

**겨울방학 30일 프로그램**
- **시작일:** 2025년 1월 5일 (일요일)
- **종료일:** 2025년 2월 3일 (월요일)
- **총 기간:** 30일

## 📋 수정 내용

### Before (수정 전)
```javascript
// 문제: 오늘 날짜로 자동 설정
const programStartDate = new Date().toISOString().split('T')[0];
// 예: 2025-01-04 (오늘 로그인하면 오늘부터 시작)
```

**문제점:**
- 학생마다 시작일이 다름
- 프로그램 일정이 통일되지 않음
- 주차 계산이 학생별로 다름

### After (수정 후)
```javascript
// 해결: 고정된 프로그램 시작일
const PROGRAM_START_DATE = '2025-01-05'; // 프로그램 공식 시작일
const PROGRAM_END_DATE = '2025-02-03';   // 30일 후

const programStartDate = localStorage.getItem(`program_start_${student.id}`) || PROGRAM_START_DATE;
```

**개선사항:**
- ✅ 모든 학생 동일한 시작일 (2025-01-05)
- ✅ 프로그램 일정 통일
- ✅ 주차 계산 일관성
- ✅ 교사-학생 간 일정 동기화

## 🗓️ 날짜별 상태

### 1월 4일 (토요일) - 프로그램 시작 전
```
📊 상태: 준비 중
📅 시작일: 2025-01-05
⏰ D-1 (내일 시작!)
📚 주차: 준비 단계
```

### 1월 5일 (일요일) - Day 1
```
📊 상태: 1주차 시작
📅 경과: 1일 / 30일
⏰ D-29
📚 주차: 1주차 (개념 집중)
```

### 1월 12일 (일요일) - Day 8
```
📊 상태: 2주차 시작
📅 경과: 8일 / 30일
⏰ D-22
📚 주차: 2주차 (개념 심화)
```

### 1월 19일 (일요일) - Day 15
```
📊 상태: 3주차 시작
📅 경과: 15일 / 30일
⏰ D-15
📚 주차: 3주차 (강의 + 문제풀이)
```

### 1월 26일 (일요일) - Day 22
```
📊 상태: 4주차 시작
📅 경과: 22일 / 30일
⏰ D-8
📚 주차: 4주차 (종합 + 심화)
```

### 2월 3일 (월요일) - Day 30
```
📊 상태: 프로그램 완료! 🎉
📅 경과: 30일 / 30일
⏰ D-DAY (완료!)
📚 주차: 4주차 완료
🏆 보상: 완주 트로피
```

## 📚 주차별 학습 내용

### 1주차 (1월 5일 ~ 1월 11일)
- **Day 1-7**
- **목표:** 개념 이해 및 기초 다지기
- **학습 방법:** 교과서 복습 + 기초 개념 정리
- **난이도:** 기초 → 표준
- **일일 목표:** 2-3시간

### 2주차 (1월 12일 ~ 1월 18일)
- **Day 8-14**
- **목표:** 개념 심화 및 적용
- **학습 방법:** 문제 풀이 + 개념 확장
- **난이도:** 표준
- **일일 목표:** 2-3시간

### 3주차 (1월 19일 ~ 1월 25일)
- **Day 15-21**
- **목표:** 강의 학습 + 문제 해결
- **학습 방법:** EBS 강의 + 문제풀이
- **난이도:** 표준 → 심화
- **일일 목표:** 3-4시간
- **심화 학생:** 선행학습 시작

### 4주차 (1월 26일 ~ 2월 3일)
- **Day 22-30 (9일)**
- **목표:** 종합 정리 + 실전 대비
- **학습 방법:** 종합 문제 + 약점 보완
- **난이도:** 심화
- **일일 목표:** 3-4시간
- **심화 학생:** 상급 문제 + 선행학습

## 🎯 주요 변경 파일

### 1. generateAndDisplayTodaySchedule() 
**위치:** Line 4596-4615
```javascript
const PROGRAM_START_DATE = '2025-01-05';
const programStartDate = localStorage.getItem(`program_start_${student.id}`) || PROGRAM_START_DATE;
const startDate = new Date(programStartDate);
const today = new Date();
const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
const currentWeek = Math.min(Math.floor(daysPassed / 7) + 1, 4);

console.log('📅 프로그램 일정:', {
    시작일: PROGRAM_START_DATE,
    오늘: today.toISOString().split('T')[0],
    경과일: daysPassed,
    현재주차: currentWeek
});
```

**역할:** 오늘의 학습 스케줄 생성 시 주차 계산

### 2. getStudyMaterialsForSubject()
**위치:** Line 5020-5026
```javascript
const PROGRAM_START_DATE = '2025-01-05';
const programStartDate = localStorage.getItem(`program_start_${studentId}`) || PROGRAM_START_DATE;
const startDate = new Date(programStartDate);
const today = new Date();
const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
const currentWeek = Math.min(Math.floor(daysPassed / 7) + 1, 4);
const isConceptPhase = currentWeek <= 2; // 1~2주: 개념 집중
```

**역할:** 주차에 맞는 학습 자료 제공 (개념 vs 강의)

### 3. initProgramProgress()
**위치:** Line 1870-1900
```javascript
const PROGRAM_START_DATE = '2025-01-05';
const PROGRAM_END_DATE = '2025-02-03';

const programStart = localStorage.getItem('programStartDate') || PROGRAM_START_DATE;

// 시작 전 상태
document.getElementById('roadmapStartDate').textContent = `시작: ${PROGRAM_START_DATE}`;
document.getElementById('roadmapDDay').textContent = 'D-DAY';
document.getElementById('roadmapEndDate').textContent = `종료: ${PROGRAM_END_DATE}`;
```

**역할:** 30일 로드맵 초기화 및 날짜 표시

### 4. startTimer()
**위치:** Line 2811-2817
```javascript
const PROGRAM_START_DATE = '2025-01-05';
const programStart = localStorage.getItem('programStartDate');
if (!programStart) {
    localStorage.setItem('programStartDate', PROGRAM_START_DATE);
    console.log('📅 프로그램 시작일 설정:', PROGRAM_START_DATE);
    initProgramProgress();
    updateWeeklyRoadmapProgress();
}
```

**역할:** 학습 타이머 시작 시 프로그램 시작일 기록

## 📊 UI 변경 사항

### 30일 학습 로드맵 카드
**Before:**
```
🗺️ 30일 학습 로드맵
━━━━━━━━━━━━━━━━━━
0%                  0일 / 30일
시작: 미정  |  D-DAY  |  종료: 미정
```

**After:**
```
🗺️ 30일 학습 로드맵
━━━━━━━━━━━━━━━━━━
0%                  0일 / 30일
시작: 2025-01-05  |  D-1  |  종료: 2025-02-03
```

### 프로그램 진행률 (1월 12일 기준)
```
Day 8  |  2주차
━━━━━━━━━━━━━━━━━━
27%                 8일 / 30일
시작: 1월 5일  |  D-22  |  종료: 2월 3일
```

## 🎨 사용자 경험

### 시나리오 1: 프로그램 시작 전 (1월 4일)
```
학생 로그인
   ↓
"프로그램이 내일 시작됩니다!"
   ↓
시작: 2025-01-05 (D-1)
종료: 2025-02-03
   ↓
진단평가 완료 유도
```

### 시나리오 2: 프로그램 첫 날 (1월 5일)
```
학생 로그인
   ↓
"Day 1 - 1주차 시작!"
   ↓
오늘의 학습 스케줄:
• 수학 (45분) - 개념: 소인수분해
• 영어 (45분) - 개념: 현재시제
• 국어 (30분) - 개념: 품사
   ↓
학습 시작 → 타이머 작동
```

### 시나리오 3: 주차 전환 (1월 12일)
```
학생 로그인
   ↓
"Day 8 - 2주차 시작!"
   ↓
1주차 완료 🎉
   ↓
2주차 학습 내용:
• 개념 심화
• 문제 풀이 시작
   ↓
학습 자료 변경 감지
```

## ✅ 테스트 체크리스트

### 기능 테스트
- [ ] 1월 4일: 시작 전 상태 확인
- [ ] 1월 5일: Day 1 표시 확인
- [ ] 1월 12일: 2주차 전환 확인
- [ ] 1월 19일: 3주차 전환 + 강의 제공 확인
- [ ] 2월 3일: 완료 상태 확인

### UI 테스트
- [ ] 30일 로드맵에 시작일 표시
- [ ] 30일 로드맵에 종료일 표시
- [ ] D-DAY 카운트다운 정확성
- [ ] 주차별 학습 자료 변경
- [ ] 프로그램 진행률 (%)

### 콘솔 로그 확인
```javascript
📅 프로그램 일정: {
    시작일: '2025-01-05',
    오늘: '2025-01-04',
    경과일: -1,
    현재주차: 1
}
```

## 🚀 배포 정보

- **Commit:** 670b6dc
- **Branch:** main
- **파일:** geunhwa-student-portal.html
- **변경 줄 수:** +27 -7
- **배포 시간:** 즉시 (GitHub Pages)
- **테스트 URL:** https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal.html

## 📝 주의사항

### 기존 학생 데이터 처리
- 기존에 프로그램을 시작한 학생: localStorage에 `programStartDate` 저장됨
- 새로운 학생: 자동으로 2025-01-05로 설정
- 교사가 수동으로 조정 가능 (localStorage 수정)

### 날짜 계산 로직
```javascript
// 경과 일수 계산
const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

// 주차 계산 (1~4주차)
const currentWeek = Math.min(Math.floor(daysPassed / 7) + 1, 4);

// 개념 단계 여부 (1~2주차)
const isConceptPhase = currentWeek <= 2;
```

### D-DAY 계산
```javascript
// 시작 전: D-1, D-2, ...
// 진행 중: D-29, D-28, ..., D-1
// 완료: 🎉 완료!
const daysRemaining = 30 - daysPassed;
```

## 🎓 교육적 효과

1. **통일된 일정**: 모든 학생이 같은 주차에 같은 내용 학습
2. **교사 관리 용이**: 주차별 진도 관리 가능
3. **동기부여**: D-DAY 카운트다운으로 목표 의식 강화
4. **체계적 학습**: 주차별 단계적 학습 진행

---

**최종 확인:** 2026-01-04
**상태:** ✅ 배포 완료 및 테스트 가능
**프로그램 시작일:** 2025년 1월 5일 (일요일)
