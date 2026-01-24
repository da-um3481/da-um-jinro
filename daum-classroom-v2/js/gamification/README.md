# 🎮 DA.UM 게이미피케이션 시스템

**학습 활동을 재미있게! 포인트와 레벨로 동기부여하는 게이미피케이션 시스템**

---

## 📋 목차

1. [시스템 개요](#시스템-개요)
2. [핵심 기능](#핵심-기능)
3. [파일 구조](#파일-구조)
4. [설치 방법](#설치-방법)
5. [사용 방법](#사용-방법)
6. [테스트 방법](#테스트-방법)
7. [커스터마이징](#커스터마이징)
8. [문제 해결](#문제-해결)

---

## 🎯 시스템 개요

DA.UM 게이미피케이션 시스템은 **학습 활동을 재미있게 만들기 위한 포인트 및 레벨 시스템**입니다.

### 주요 특징
- ⭐ **경험치(EXP)** 시스템
- 💰 **코인** 시스템
- 🎯 **레벨업** 및 칭호
- 🎁 **레벨 보너스** (최대 50%)
- 📊 **실시간 UI** 업데이트
- 💾 **LocalStorage** 자동 저장
- 🔔 **토스트 알림** 시스템

---

## ✨ 핵심 기능

### 1️⃣ 포인트 시스템
- **경험치(EXP)**: 학습 활동으로 획득
- **코인**: 구매 및 보상에 사용
- **레벨**: 경험치로 레벨업 (최대 Lv. 100)

### 2️⃣ 보상 테이블

| 활동 | EXP | 코인 |
|------|-----|------|
| 자율학습 (분당) | 2 | 1 |
| 복습 완료 | 20 | 10 |
| 완벽 복습 (100%) | 50 | 30 |
| 수업 출석 | 15 | 8 |
| 일일 목표 달성 | 100 | 50 |
| 주간 목표 달성 | 300 | 150 |
| 3일 스트릭 | 50 | 25 |
| 7일 스트릭 | 150 | 75 |
| 30일 스트릭 | 500 | 250 |

### 3️⃣ 레벨 보너스

| 레벨 | 보너스 |
|------|--------|
| Lv. 10+ | +10% |
| Lv. 20+ | +20% |
| Lv. 30+ | +30% |
| Lv. 50+ | +50% |

### 4️⃣ 칭호 시스템

- **초보 학습자** (Lv. 1-9)
- **학습 새싹** (Lv. 10-19)
- **학습 전사** (Lv. 20-29)
- **학습 고수** (Lv. 30-39)
- **학습 달인** (Lv. 40-49)
- **학습 마스터** (Lv. 50+)

---

## 📂 파일 구조

```
daum-classroom-v2/
├── components/
│   └── gamification/
│       └── point-display.html          # 포인트 표시 UI
├── css/
│   └── gamification/
│       ├── point-display.css           # 포인트 UI 스타일
│       └── toast-notification.css      # 토스트 알림 스타일
├── js/
│   └── gamification/
│       ├── core/
│       │   └── point-system.js         # 핵심 포인트 시스템
│       ├── ui/
│       │   └── toast-notification.js   # 토스트 알림 시스템
│       ├── integration/
│       │   └── activity-rewards.js     # 학습 활동 연동
│       └── test.js                     # 테스트 스크립트
└── student.html                        # 통합된 학생 포털
```

---

## 🚀 설치 방법

### 자동 설치 (이미 완료됨!)
이미 `student.html`에 통합되어 있습니다!

### 수동 설치
다른 페이지에 추가하려면:

#### 1. CSS 추가
```html
<head>
    <!-- 게이미피케이션 CSS -->
    <link rel="stylesheet" href="css/gamification/point-display.css">
    <link rel="stylesheet" href="css/gamification/toast-notification.css">
</head>
```

#### 2. JavaScript 추가
```html
<body>
    <!-- 게이미피케이션 스크립트 (순서 중요!) -->
    <script src="js/gamification/ui/toast-notification.js"></script>
    <script src="js/gamification/core/point-system.js"></script>
    <script src="js/gamification/integration/activity-rewards.js"></script>
</body>
```

#### 3. UI 컴포넌트 추가
```html
<div class="container" id="gamification-container"></div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        fetch('components/gamification/point-display.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('gamification-container').innerHTML = html;
                if (typeof pointSystem !== 'undefined') {
                    pointSystem.updateUI();
                }
            });
    });
</script>
```

---

## 💻 사용 방법

### 기본 사용법

#### 1. 경험치 획득
```javascript
pointSystem.earnExp(50, '수학 학습 30분');
```

#### 2. 코인 획득
```javascript
pointSystem.earnCoins(30, '목표 달성');
```

#### 3. 코인 사용
```javascript
pointSystem.spendCoins(100, '아이템 구매');
```

#### 4. 현재 상태 확인
```javascript
const status = pointSystem.getStatus();
console.log(status);
```

### 이벤트 연동

#### 자율학습 완료 시
```javascript
document.dispatchEvent(new CustomEvent('studyCompleted', {
    detail: {
        duration: 30,  // 분
        subject: '수학'
    }
}));
```

#### 복습 완료 시
```javascript
document.dispatchEvent(new CustomEvent('reviewCompleted', {
    detail: {
        correctRate: 85,  // 정답률
        subject: '영어'
    }
}));
```

#### 스트릭 달성 시
```javascript
document.dispatchEvent(new CustomEvent('streakAchieved', {
    detail: {
        days: 7  // 연속 일수
    }
}));
```

---

## 🧪 테스트 방법

### 개발자 도구에서 테스트

#### 1. 테스트 스크립트 로드
```html
<script src="js/gamification/test.js"></script>
```

#### 2. 콘솔에서 실행
```javascript
// 경험치 획득 테스트
testExpGain();

// 코인 획득 테스트
testCoinGain();

// 자율학습 30분 완료 시뮬레이션
testStudyComplete(30, '수학');

// 복습 완료 시뮬레이션
testReviewComplete(100, '영어');

// 레벨 5로 강제 설정
testLevelUp(5);

// 현재 상태 확인
checkStatus();

// 이력 확인
checkHistory('all', 10);

// 모든 테스트 실행
runAllTests();
```

#### 3. 단축키 사용
```javascript
test.exp()          // 경험치 테스트
test.coin()         // 코인 테스트
test.study(60)      // 60분 학습 테스트
test.review(100)    // 100% 복습 테스트
test.status()       // 상태 확인
test.all()          // 전체 테스트
```

---

## 🎨 커스터마이징

### 레벨 공식 변경
`js/gamification/core/point-system.js`:
```javascript
this.LEVEL_CONFIG = {
    BASE_EXP: 100,        // 1레벨 → 2레벨 필요 경험치
    GROWTH_RATE: 1.2,     // 레벨당 증가율
    MAX_LEVEL: 100        // 최대 레벨
};
```

### 보상 테이블 변경
`js/gamification/integration/activity-rewards.js`:
```javascript
this.REWARD_TABLE = {
    'study_per_minute': { exp: 2, coins: 1 },
    'review_complete': { exp: 20, coins: 10 },
    // ... 원하는 대로 수정
};
```

### 레벨 보너스 변경
```javascript
this.LEVEL_BONUS = {
    10: 1.1,  // Lv. 10+: 10% 보너스
    20: 1.2,  // Lv. 20+: 20% 보너스
    // ... 원하는 대로 수정
};
```

### 칭호 변경
```javascript
getLevelTitle() {
    if (this.level >= 50) return '학습 마스터';
    if (this.level >= 40) return '학습 달인';
    // ... 원하는 대로 수정
}
```

---

## 🐛 문제 해결

### Q1: 포인트가 표시되지 않아요
**A**: 다음을 확인하세요:
1. 모든 JavaScript 파일이 로드되었나요?
2. `gamification-container` div가 있나요?
3. 개발자 도구 콘솔에 오류가 있나요?

### Q2: 이벤트가 동작하지 않아요
**A**: `activity-rewards.js`가 로드되었는지 확인하세요:
```javascript
console.log(typeof activityRewards);  // 'object'가 출력되어야 함
```

### Q3: LocalStorage 데이터를 초기화하고 싶어요
**A**: 개발자 도구 콘솔에서:
```javascript
pointSystem.reset();
```

### Q4: 레벨이 올라가지 않아요
**A**: 필요한 경험치를 확인하세요:
```javascript
const status = pointSystem.getStatus();
console.log(`현재 EXP: ${status.currentExp}`);
console.log(`다음 레벨까지: ${status.expToNextLevel}`);
```

---

## 📊 데이터 구조

### LocalStorage 키
```javascript
'daum_user_exp'        // 현재 경험치
'daum_user_coins'      // 보유 코인
'daum_user_level'      // 현재 레벨
'daum_user_total_exp'  // 총 누적 경험치
'daum_point_history'   // 포인트 획득/사용 이력
```

### 이력 데이터 형식
```json
{
    "type": "exp",
    "amount": 60,
    "reason": "수학 학습 30분",
    "bonus": 10,
    "timestamp": 1705900800000
}
```

---

## 🎯 다음 단계

### 향후 추가 기능
- [ ] 업적 시스템
- [ ] 랭킹 시스템
- [ ] 아이템 상점
- [ ] 친구 시스템
- [ ] 챌린지 시스템
- [ ] 통계 대시보드

---

## 📞 문의

문제가 있거나 제안 사항이 있으시면 GitHub Issues에 등록해주세요!

---

**제작일**: 2026-01-22  
**버전**: 1.0.0  
**라이선스**: MIT
