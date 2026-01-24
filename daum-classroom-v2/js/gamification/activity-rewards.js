/**
 * 학습 활동과 포인트 시스템 연동
 * 기존 학습 기능에 보상 시스템 추가
 */

class ActivityRewards {
  constructor() {
    this.REWARD_TABLE = {
      // 자율학습 (분당)
      'study_per_minute': { exp: 2, coins: 1 },
      
      // 복습
      'review_complete': { exp: 20, coins: 10 },
      'review_perfect': { exp: 50, coins: 30 },
      
      // 수업
      'class_attend': { exp: 15, coins: 8 },
      'class_review': { exp: 25, coins: 15 },
      
      // 목표 달성
      'daily_goal': { exp: 100, coins: 50 },
      'weekly_goal': { exp: 300, coins: 150 },
      
      // 연속 출석
      'streak_3days': { exp: 50, coins: 25 },
      'streak_7days': { exp: 150, coins: 75 },
      'streak_30days': { exp: 500, coins: 250 },
      
      // 기타
      'perfect_score': { exp: 100, coins: 50 },
      'first_time': { exp: 30, coins: 20 }
    };

    this.init();
  }

  init() {
    this.attachEventListeners();
    console.log('✅ 활동 보상 시스템 초기화 완료');
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEventListeners() {
    // 자율학습 완료 시
    document.addEventListener('studyCompleted', (e) => {
      this.handleStudyComplete(e.detail);
    });

    // 복습 완료 시
    document.addEventListener('reviewCompleted', (e) => {
      this.handleReviewComplete(e.detail);
    });

    // 수업 출석 시
    document.addEventListener('classAttended', (e) => {
      this.handleClassAttend(e.detail);
    });

    // 목표 달성 시
    document.addEventListener('goalAchieved', (e) => {
      this.handleGoalAchieve(e.detail);
    });

    // 스트릭 달성 시
    document.addEventListener('streakAchieved', (e) => {
      this.handleStreakAchieve(e.detail);
    });
  }

  /**
   * 자율학습 완료 처리
   */
  handleStudyComplete(data) {
    const duration = data.duration; // 분
    const subject = data.subject || '일반';

    // 시간 기반 보상
    const baseReward = this.REWARD_TABLE.study_per_minute;
    const exp = baseReward.exp * duration;
    const coins = baseReward.coins * duration;

    // 보너스: 1시간 이상
    let bonus = 0;
    if (duration >= 60) {
      bonus = 50;
    }

    // 포인트 지급
    if (window.pointSystem) {
      pointSystem.earnExp(exp + bonus, `${subject} 자율학습 ${duration}분`);
      pointSystem.earnCoins(coins + bonus, `${subject} 자율학습 ${duration}분`);

      // 추가 메시지
      if (duration >= 60) {
        showToast({
          type: 'success',
          title: '🏆 대단해요!',
          message: '1시간 이상 집중! 보너스 +50',
          duration: 3000
        });
      }
    }
  }

  /**
   * 복습 완료 처리
   */
  handleReviewComplete(data) {
    const isPerfect = data.correctRate >= 100;
    const rewardKey = isPerfect ? 'review_perfect' : 'review_complete';
    const reward = this.REWARD_TABLE[rewardKey];

    const subject = data.subject || '일반';
    const correctRate = data.correctRate || 0;

    // 포인트 지급
    if (window.pointSystem) {
      pointSystem.earnExp(
        reward.exp,
        `${subject} 복습 완료 (정답률 ${correctRate}%)`
      );
      pointSystem.earnCoins(
        reward.coins,
        `${subject} 복습 완료`
      );

      // 완벽 복습 시 축하 메시지
      if (isPerfect) {
        showToast({
          type: 'success',
          title: '💯 완벽해요!',
          message: `${subject} 100% 정답! 보너스 포인트!`,
          rewards: { exp: reward.exp, coins: reward.coins }
        });
      }
    }
  }

  /**
   * 수업 출석 처리
   */
  handleClassAttend(data) {
    const reward = this.REWARD_TABLE.class_attend;
    const subject = data.subject || '수업';

    if (window.pointSystem) {
      pointSystem.earnExp(reward.exp, `${subject} 출석`);
      pointSystem.earnCoins(reward.coins, `${subject} 출석`);
    }
  }

  /**
   * 목표 달성 처리
   */
  handleGoalAchieve(data) {
    const type = data.type; // 'daily' or 'weekly'
    const rewardKey = type === 'daily' ? 'daily_goal' : 'weekly_goal';
    const reward = this.REWARD_TABLE[rewardKey];

    if (window.pointSystem) {
      pointSystem.earnExp(reward.exp, `${type === 'daily' ? '일일' : '주간'} 목표 달성`);
      pointSystem.earnCoins(reward.coins, `${type === 'daily' ? '일일' : '주간'} 목표 달성`);

      // 특별 축하 메시지
      showToast({
        type: 'success',
        title: '🎯 목표 달성!',
        message: `${type === 'daily' ? '오늘의' : '이번 주'} 목표를 완료했어요!`,
        rewards: { exp: reward.exp, coins: reward.coins },
        duration: 4000
      });
    }
  }

  /**
   * 스트릭 달성 처리
   */
  handleStreakAchieve(data) {
    const days = data.days;
    let rewardKey = null;

    if (days === 3) rewardKey = 'streak_3days';
    else if (days === 7) rewardKey = 'streak_7days';
    else if (days === 30) rewardKey = 'streak_30days';

    if (rewardKey && window.pointSystem) {
      const reward = this.REWARD_TABLE[rewardKey];
      pointSystem.earnExp(reward.exp, `${days}일 연속 학습`);
      pointSystem.earnCoins(reward.coins, `${days}일 연속 학습`);

      showToast({
        type: 'success',
        title: '🔥 스트릭 달성!',
        message: `${days}일 연속 학습! 대단해요!`,
        rewards: { exp: reward.exp, coins: reward.coins },
        duration: 5000
      });
    }
  }

  /**
   * 수동으로 보상 지급
   */
  grantReward(activityType, customData = {}) {
    const reward = this.REWARD_TABLE[activityType];
    
    if (!reward) {
      console.warn('알 수 없는 활동 타입:', activityType);
      return;
    }

    const reason = customData.reason || activityType;
    
    if (window.pointSystem) {
      pointSystem.earnExp(reward.exp, reason);
      pointSystem.earnCoins(reward.coins, reason);
    }
  }
}

// 전역 인스턴스 생성
let activityRewards = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!activityRewards) {
    activityRewards = new ActivityRewards();
    window.activityRewards = activityRewards;
  }
});
