/**
 * DA.UM 포인트 시스템
 * 경험치(EXP)와 코인을 관리하는 핵심 시스템
 * Version: 1.0.0
 */

class PointSystem {
  constructor() {
    // LocalStorage 키
    this.STORAGE_KEYS = {
      EXP: 'daum_user_exp',
      COINS: 'daum_user_coins',
      LEVEL: 'daum_user_level',
      TOTAL_EXP: 'daum_user_total_exp',
      HISTORY: 'daum_point_history'
    };

    // 레벨 공식 설정
    this.LEVEL_CONFIG = {
      BASE_EXP: 100,        // 1레벨 → 2레벨에 필요한 경험치
      GROWTH_RATE: 1.2,     // 레벨당 증가율
      MAX_LEVEL: 100        // 최대 레벨
    };

    // 보상 배수 (레벨에 따른 보너스)
    this.LEVEL_BONUS = {
      10: 1.1,  // 레벨 10 이상: 10% 보너스
      20: 1.2,  // 레벨 20 이상: 20% 보너스
      30: 1.3,  // 레벨 30 이상: 30% 보너스
      50: 1.5   // 레벨 50 이상: 50% 보너스
    };

    // 초기화
    this.init();
  }

  /**
   * 시스템 초기화
   */
  init() {
    this.currentExp = this.loadData(this.STORAGE_KEYS.EXP, 0);
    this.coins = this.loadData(this.STORAGE_KEYS.COINS, 0);
    this.level = this.loadData(this.STORAGE_KEYS.LEVEL, 1);
    this.totalExp = this.loadData(this.STORAGE_KEYS.TOTAL_EXP, 0);
    this.history = this.loadData(this.STORAGE_KEYS.HISTORY, []);

    // 레벨업 필요 경험치 계산
    this.expToNextLevel = this.calculateExpForLevel(this.level + 1) - this.totalExp;

    console.log('✅ 포인트 시스템 초기화 완료', {
      level: this.level,
      exp: this.currentExp,
      coins: this.coins
    });
  }

  /**
   * LocalStorage에서 데이터 로드
   */
  loadData(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('데이터 로드 실패:', key, error);
      return defaultValue;
    }
  }

  /**
   * LocalStorage에 데이터 저장
   */
  saveData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('데이터 저장 실패:', key, error);
    }
  }

  /**
   * 특정 레벨까지 필요한 총 경험치 계산
   */
  calculateExpForLevel(targetLevel) {
    if (targetLevel <= 1) return 0;
    
    let totalExp = 0;
    for (let level = 1; level < targetLevel; level++) {
      totalExp += Math.floor(
        this.LEVEL_CONFIG.BASE_EXP * Math.pow(this.LEVEL_CONFIG.GROWTH_RATE, level - 1)
      );
    }
    return totalExp;
  }

  /**
   * 현재 레벨의 진행률 계산 (0-100)
   */
  getLevelProgress() {
    const currentLevelStartExp = this.calculateExpForLevel(this.level);
    const nextLevelStartExp = this.calculateExpForLevel(this.level + 1);
    const expInCurrentLevel = this.totalExp - currentLevelStartExp;
    const expNeededForLevel = nextLevelStartExp - currentLevelStartExp;
    
    return Math.min(100, Math.floor((expInCurrentLevel / expNeededForLevel) * 100));
  }

  /**
   * 레벨 보너스 배수 계산
   */
  getLevelBonus() {
    let bonus = 1.0;
    const bonusLevels = Object.keys(this.LEVEL_BONUS).map(Number).sort((a, b) => b - a);
    
    for (const level of bonusLevels) {
      if (this.level >= level) {
        bonus = this.LEVEL_BONUS[level];
        break;
      }
    }
    
    return bonus;
  }

  /**
   * 경험치 획득
   * @param {number} amount - 획득할 경험치
   * @param {string} reason - 획득 사유
   * @param {boolean} showNotification - 알림 표시 여부
   * @returns {object} 결과 정보
   */
  earnExp(amount, reason = '학습 활동', showNotification = true) {
    if (amount <= 0) {
      console.warn('경험치는 0보다 커야 합니다.');
      return null;
    }

    // 레벨 보너스 적용
    const bonus = this.getLevelBonus();
    const finalAmount = Math.floor(amount * bonus);
    const bonusAmount = finalAmount - amount;

    // 경험치 추가
    this.currentExp += finalAmount;
    this.totalExp += finalAmount;

    // 이력 기록
    this.addHistory({
      type: 'exp',
      amount: finalAmount,
      reason: reason,
      bonus: bonusAmount,
      timestamp: Date.now()
    });

    // 저장
    this.saveData(this.STORAGE_KEYS.EXP, this.currentExp);
    this.saveData(this.STORAGE_KEYS.TOTAL_EXP, this.totalExp);

    // 레벨업 체크
    const levelUpResult = this.checkLevelUp();

    // UI 업데이트
    this.updateUI();

    // 알림 표시
    if (showNotification) {
      this.showExpNotification(finalAmount, bonusAmount, reason);
    }

    const result = {
      expGained: finalAmount,
      bonusExp: bonusAmount,
      currentExp: this.currentExp,
      totalExp: this.totalExp,
      level: this.level,
      leveledUp: levelUpResult.leveledUp,
      newLevel: levelUpResult.newLevel
    };

    // 이벤트 발생
    this.dispatchEvent('expEarned', result);

    return result;
  }

  /**
   * 코인 획득
   * @param {number} amount - 획득할 코인
   * @param {string} reason - 획득 사유
   * @param {boolean} showNotification - 알림 표시 여부
   * @returns {object} 결과 정보
   */
  earnCoins(amount, reason = '학습 활동', showNotification = true) {
    if (amount <= 0) {
      console.warn('코인은 0보다 커야 합니다.');
      return null;
    }

    // 레벨 보너스 적용
    const bonus = this.getLevelBonus();
    const finalAmount = Math.floor(amount * bonus);
    const bonusAmount = finalAmount - amount;

    // 코인 추가
    this.coins += finalAmount;

    // 이력 기록
    this.addHistory({
      type: 'coin',
      amount: finalAmount,
      reason: reason,
      bonus: bonusAmount,
      timestamp: Date.now()
    });

    // 저장
    this.saveData(this.STORAGE_KEYS.COINS, this.coins);

    // UI 업데이트
    this.updateUI();

    // 알림 표시
    if (showNotification) {
      this.showCoinNotification(finalAmount, bonusAmount, reason);
    }

    const result = {
      coinsGained: finalAmount,
      bonusCoins: bonusAmount,
      totalCoins: this.coins,
      reason: reason
    };

    // 이벤트 발생
    this.dispatchEvent('coinsEarned', result);

    return result;
  }

  /**
   * 코인 사용
   * @param {number} amount - 사용할 코인
   * @param {string} reason - 사용 사유
   * @returns {boolean} 성공 여부
   */
  spendCoins(amount, reason = '구매') {
    if (amount <= 0) {
      console.warn('코인은 0보다 커야 합니다.');
      return false;
    }

    if (this.coins < amount) {
      console.warn('코인이 부족합니다.', { need: amount, have: this.coins });
      
      // 부족 알림
      if (typeof showToast === 'function') {
        showToast({
          type: 'error',
          title: '코인 부족',
          message: `${amount - this.coins}개 코인이 더 필요해요!`
        });
      }
      
      return false;
    }

    // 코인 차감
    this.coins -= amount;

    // 이력 기록
    this.addHistory({
      type: 'coin_spent',
      amount: -amount,
      reason: reason,
      timestamp: Date.now()
    });

    // 저장
    this.saveData(this.STORAGE_KEYS.COINS, this.coins);

    // UI 업데이트
    this.updateUI();

    // 이벤트 발생
    this.dispatchEvent('coinsSpent', {
      coinsSpent: amount,
      remainingCoins: this.coins,
      reason: reason
    });

    return true;
  }

  /**
   * 레벨업 체크
   * @returns {object} 레벨업 결과
   */
  checkLevelUp() {
    let leveledUp = false;
    let levelsGained = 0;
    const oldLevel = this.level;

    // 최대 레벨 확인
    if (this.level >= this.LEVEL_CONFIG.MAX_LEVEL) {
      return { leveledUp: false, newLevel: this.level, levelsGained: 0 };
    }

    // 레벨업 체크
    while (this.totalExp >= this.calculateExpForLevel(this.level + 1)) {
      this.level++;
      levelsGained++;
      leveledUp = true;

      // 레벨업 보상
      this.grantLevelUpReward();

      // 최대 레벨 도달
      if (this.level >= this.LEVEL_CONFIG.MAX_LEVEL) {
        break;
      }
    }

    if (leveledUp) {
      // 현재 레벨의 경험치 재계산
      const currentLevelStartExp = this.calculateExpForLevel(this.level);
      this.currentExp = this.totalExp - currentLevelStartExp;
      this.expToNextLevel = this.calculateExpForLevel(this.level + 1) - this.totalExp;

      // 저장
      this.saveData(this.STORAGE_KEYS.LEVEL, this.level);
      this.saveData(this.STORAGE_KEYS.EXP, this.currentExp);

      // 레벨업 애니메이션
      this.showLevelUpAnimation(oldLevel, this.level);

      // 이벤트 발생
      this.dispatchEvent('levelUp', {
        oldLevel: oldLevel,
        newLevel: this.level,
        levelsGained: levelsGained
      });

      console.log(`🎉 레벨업! ${oldLevel} → ${this.level}`);
    }

    return {
      leveledUp: leveledUp,
      newLevel: this.level,
      levelsGained: levelsGained
    };
  }

  /**
   * 레벨업 보상 지급
   */
  grantLevelUpReward() {
    const reward = {
      coins: this.level * 50,  // 레벨당 50 코인
      title: this.getLevelTitle()
    };

    // 코인 보상 (알림 표시 안함)
    this.coins += reward.coins;
    this.saveData(this.STORAGE_KEYS.COINS, this.coins);

    // 이력 기록
    this.addHistory({
      type: 'level_up_reward',
      amount: reward.coins,
      reason: `레벨 ${this.level} 달성`,
      timestamp: Date.now()
    });

    return reward;
  }

  /**
   * 레벨별 칭호 반환
   */
  getLevelTitle() {
    if (this.level >= 50) return '학습 마스터';
    if (this.level >= 40) return '학습 달인';
    if (this.level >= 30) return '학습 고수';
    if (this.level >= 20) return '학습 전사';
    if (this.level >= 10) return '학습 새싹';
    return '초보 학습자';
  }

  /**
   * 이력 추가
   */
  addHistory(entry) {
    this.history.unshift(entry);
    
    // 최근 100개만 유지
    if (this.history.length > 100) {
      this.history = this.history.slice(0, 100);
    }
    
    this.saveData(this.STORAGE_KEYS.HISTORY, this.history);
  }

  /**
   * 이력 조회
   * @param {string} type - 필터 타입 ('exp', 'coin', 'all')
   * @param {number} limit - 조회 개수
   */
  getHistory(type = 'all', limit = 10) {
    let filtered = this.history;
    
    if (type !== 'all') {
      filtered = this.history.filter(entry => entry.type === type);
    }
    
    return filtered.slice(0, limit);
  }

  /**
   * UI 업데이트
   */
  updateUI() {
    // EXP 표시 업데이트
    const expDisplay = document.querySelector('.exp-value');
    if (expDisplay) {
      expDisplay.textContent = `${this.currentExp.toLocaleString()} EXP`;
    }

    // 코인 표시 업데이트
    const coinDisplay = document.querySelector('.coin-value');
    if (coinDisplay) {
      coinDisplay.textContent = this.coins.toLocaleString();
    }

    // 레벨 표시 업데이트
    const levelDisplay = document.querySelector('.level-badge');
    if (levelDisplay) {
      levelDisplay.textContent = `Lv. ${this.level}`;
    }

    // 레벨 칭호 업데이트
    const levelTitle = document.querySelector('.level-title');
    if (levelTitle) {
      levelTitle.textContent = this.getLevelTitle();
    }

    // 경험치 바 업데이트
    const expBar = document.querySelector('.exp-fill');
    if (expBar) {
      const progress = this.getLevelProgress();
      expBar.style.width = `${progress}%`;
    }

    // 경험치 텍스트 업데이트
    const expText = document.querySelector('.exp-text');
    if (expText) {
      const nextLevelExp = this.calculateExpForLevel(this.level + 1) - this.calculateExpForLevel(this.level);
      const currentLevelExp = this.totalExp - this.calculateExpForLevel(this.level);
      expText.textContent = `${currentLevelExp.toLocaleString()} / ${nextLevelExp.toLocaleString()} EXP`;
    }
  }

  /**
   * 경험치 획득 알림 표시
   */
  showExpNotification(amount, bonus, reason) {
    if (typeof showToast === 'function') {
      showToast({
        type: 'success',
        title: bonus > 0 ? '🎉 보너스 EXP!' : '⭐ EXP 획득!',
        message: bonus > 0 
          ? `${reason}: +${amount} EXP (보너스 +${bonus})`
          : `${reason}: +${amount} EXP`,
        duration: 2000
      });
    }
  }

  /**
   * 코인 획득 알림 표시
   */
  showCoinNotification(amount, bonus, reason) {
    if (typeof showToast === 'function') {
      showToast({
        type: 'success',
        title: bonus > 0 ? '🎉 보너스 코인!' : '💰 코인 획득!',
        message: bonus > 0 
          ? `${reason}: +${amount} 코인 (보너스 +${bonus})`
          : `${reason}: +${amount} 코인`,
        duration: 2000
      });
    }
  }

  /**
   * 레벨업 애니메이션 표시
   */
  showLevelUpAnimation(oldLevel, newLevel) {
    if (typeof showToast === 'function') {
      const reward = newLevel * 50;
      showToast({
        type: 'levelup',
        title: '🎉 레벨업!',
        message: `레벨 ${oldLevel} → ${newLevel}\n보상: +${reward} 코인`,
        duration: 5000
      });
    }
  }

  /**
   * 커스텀 이벤트 발생
   */
  dispatchEvent(eventName, detail) {
    const event = new CustomEvent(`daum:${eventName}`, {
      detail: detail,
      bubbles: true
    });
    document.dispatchEvent(event);
  }

  /**
   * 현재 상태 조회
   */
  getStatus() {
    return {
      level: this.level,
      currentExp: this.currentExp,
      totalExp: this.totalExp,
      expToNextLevel: this.expToNextLevel,
      levelProgress: this.getLevelProgress(),
      coins: this.coins,
      levelBonus: this.getLevelBonus(),
      levelTitle: this.getLevelTitle()
    };
  }

  /**
   * 데이터 초기화 (테스트용)
   */
  reset() {
    if (confirm('정말 모든 포인트 데이터를 초기화하시겠습니까?')) {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      this.init();
      this.updateUI();
      console.log('✅ 포인트 데이터 초기화 완료');
    }
  }
}

// 전역 인스턴스 생성 (DOMContentLoaded 시)
let pointSystem = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!pointSystem) {
    pointSystem = new PointSystem();
    window.pointSystem = pointSystem;
  }
});
