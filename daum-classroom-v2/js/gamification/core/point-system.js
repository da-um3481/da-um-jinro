/**
 * DA.UM 포인트 시스템
 * 경험치(EXP)와 코인을 관리하는 핵심 시스템
 * Version: 1.0.0
 */

class PointSystem {
  constructor() {
    this.STORAGE_KEYS = {
      EXP: 'daum_user_exp',
      COINS: 'daum_user_coins',
      LEVEL: 'daum_user_level',
      TOTAL_EXP: 'daum_user_total_exp',
      HISTORY: 'daum_point_history'
    };

    this.LEVEL_CONFIG = {
      BASE_EXP: 100,
      GROWTH_RATE: 1.2,
      MAX_LEVEL: 100
    };

    this.LEVEL_BONUS = {
      10: 1.1,
      20: 1.2,
      30: 1.3,
      50: 1.5
    };

    this.init();
  }

  init() {
    this.currentExp = this.loadData(this.STORAGE_KEYS.EXP, 0);
    this.coins = this.loadData(this.STORAGE_KEYS.COINS, 0);
    this.level = this.loadData(this.STORAGE_KEYS.LEVEL, 1);
    this.totalExp = this.loadData(this.STORAGE_KEYS.TOTAL_EXP, 0);
    this.history = this.loadData(this.STORAGE_KEYS.HISTORY, []);
    this.expToNextLevel = this.calculateExpForLevel(this.level + 1) - this.totalExp;
    console.log('✅ 포인트 시스템 초기화 완료', { level: this.level, exp: this.currentExp, coins: this.coins });
  }

  loadData(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('데이터 로드 실패:', key, error);
      return defaultValue;
    }
  }

  saveData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('데이터 저장 실패:', key, error);
    }
  }

  calculateExpForLevel(targetLevel) {
    if (targetLevel <= 1) return 0;
    let totalExp = 0;
    for (let level = 1; level < targetLevel; level++) {
      totalExp += Math.floor(this.LEVEL_CONFIG.BASE_EXP * Math.pow(this.LEVEL_CONFIG.GROWTH_RATE, level - 1));
    }
    return totalExp;
  }

  getLevelProgress() {
    const currentLevelStartExp = this.calculateExpForLevel(this.level);
    const nextLevelStartExp = this.calculateExpForLevel(this.level + 1);
    const expInCurrentLevel = this.totalExp - currentLevelStartExp;
    const expNeededForLevel = nextLevelStartExp - currentLevelStartExp;
    return Math.min(100, Math.floor((expInCurrentLevel / expNeededForLevel) * 100));
  }

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

  earnExp(amount, reason = '학습 활동', showNotification = true) {
    if (amount <= 0) return null;
    const bonus = this.getLevelBonus();
    const finalAmount = Math.floor(amount * bonus);
    const bonusAmount = finalAmount - amount;
    this.currentExp += finalAmount;
    this.totalExp += finalAmount;
    this.addHistory({ type: 'exp', amount: finalAmount, reason, bonus: bonusAmount, timestamp: Date.now() });
    this.saveData(this.STORAGE_KEYS.EXP, this.currentExp);
    this.saveData(this.STORAGE_KEYS.TOTAL_EXP, this.totalExp);
    const levelUpResult = this.checkLevelUp();
    this.updateUI();
    if (showNotification) this.showExpNotification(finalAmount, bonusAmount, reason);
    const result = { expGained: finalAmount, bonusExp: bonusAmount, currentExp: this.currentExp, totalExp: this.totalExp, level: this.level, leveledUp: levelUpResult.leveledUp, newLevel: levelUpResult.newLevel };
    this.dispatchEvent('expEarned', result);
    return result;
  }

  earnCoins(amount, reason = '학습 활동', showNotification = true) {
    if (amount <= 0) return null;
    const bonus = this.getLevelBonus();
    const finalAmount = Math.floor(amount * bonus);
    const bonusAmount = finalAmount - amount;
    this.coins += finalAmount;
    this.addHistory({ type: 'coin', amount: finalAmount, reason, bonus: bonusAmount, timestamp: Date.now() });
    this.saveData(this.STORAGE_KEYS.COINS, this.coins);
    this.updateUI();
    if (showNotification) this.showCoinNotification(finalAmount, bonusAmount, reason);
    const result = { coinsGained: finalAmount, bonusCoins: bonusAmount, totalCoins: this.coins, reason };
    this.dispatchEvent('coinsEarned', result);
    return result;
  }

  spendCoins(amount, reason = '구매') {
    if (amount <= 0) return false;
    if (this.coins < amount) {
      if (typeof showToast === 'function') {
        showToast({ type: 'error', title: '코인 부족', message: `${amount - this.coins}개 코인이 더 필요해요!` });
      }
      return false;
    }
    this.coins -= amount;
    this.addHistory({ type: 'coin_spent', amount: -amount, reason, timestamp: Date.now() });
    this.saveData(this.STORAGE_KEYS.COINS, this.coins);
    this.updateUI();
    this.dispatchEvent('coinsSpent', { coinsSpent: amount, remainingCoins: this.coins, reason });
    return true;
  }

  checkLevelUp() {
    let leveledUp = false;
    let levelsGained = 0;
    const oldLevel = this.level;
    if (this.level >= this.LEVEL_CONFIG.MAX_LEVEL) return { leveledUp: false, newLevel: this.level, levelsGained: 0 };
    while (this.totalExp >= this.calculateExpForLevel(this.level + 1)) {
      this.level++;
      levelsGained++;
      leveledUp = true;
      this.grantLevelUpReward();
      if (this.level >= this.LEVEL_CONFIG.MAX_LEVEL) break;
    }
    if (leveledUp) {
      const currentLevelStartExp = this.calculateExpForLevel(this.level);
      this.currentExp = this.totalExp - currentLevelStartExp;
      this.expToNextLevel = this.calculateExpForLevel(this.level + 1) - this.totalExp;
      this.saveData(this.STORAGE_KEYS.LEVEL, this.level);
      this.saveData(this.STORAGE_KEYS.EXP, this.currentExp);
      this.showLevelUpAnimation(oldLevel, this.level);
      this.dispatchEvent('levelUp', { oldLevel, newLevel: this.level, levelsGained });
      console.log(`🎉 레벨업! ${oldLevel} → ${this.level}`);
    }
    return { leveledUp, newLevel: this.level, levelsGained };
  }

  grantLevelUpReward() {
    const reward = { coins: this.level * 50, title: this.getLevelTitle() };
    this.coins += reward.coins;
    this.saveData(this.STORAGE_KEYS.COINS, this.coins);
    this.addHistory({ type: 'level_up_reward', amount: reward.coins, reason: `레벨 ${this.level} 달성`, timestamp: Date.now() });
    return reward;
  }

  getLevelTitle() {
    if (this.level >= 50) return '학습 마스터';
    if (this.level >= 40) return '학습 달인';
    if (this.level >= 30) return '학습 고수';
    if (this.level >= 20) return '학습 전사';
    if (this.level >= 10) return '학습 새싹';
    return '초보 학습자';
  }

  addHistory(entry) {
    this.history.unshift(entry);
    if (this.history.length > 100) this.history = this.history.slice(0, 100);
    this.saveData(this.STORAGE_KEYS.HISTORY, this.history);
  }

  getHistory(type = 'all', limit = 10) {
    let filtered = this.history;
    if (type !== 'all') filtered = this.history.filter(entry => entry.type === type);
    return filtered.slice(0, limit);
  }

  updateUI() {
    const expDisplay = document.querySelector('.exp-value');
    if (expDisplay) expDisplay.textContent = `${this.currentExp.toLocaleString()} EXP`;
    const coinDisplay = document.querySelector('.coin-value');
    if (coinDisplay) coinDisplay.textContent = this.coins.toLocaleString();
    const levelDisplay = document.querySelector('.level-badge');
    if (levelDisplay) levelDisplay.textContent = `Lv. ${this.level}`;
    const titleDisplay = document.querySelector('.level-title');
    if (titleDisplay) titleDisplay.textContent = this.getLevelTitle();
    const expBar = document.querySelector('.exp-fill');
    if (expBar) expBar.style.width = `${this.getLevelProgress()}%`;
    const expText = document.querySelector('.exp-text');
    if (expText) {
      const nextLevelExp = this.calculateExpForLevel(this.level + 1) - this.calculateExpForLevel(this.level);
      const currentLevelExp = this.totalExp - this.calculateExpForLevel(this.level);
      expText.textContent = `${currentLevelExp.toLocaleString()} / ${nextLevelExp.toLocaleString()} EXP`;
    }
  }

  showExpNotification(amount, bonus, reason) {
    if (typeof showToast === 'function') {
      showToast({
        type: 'success',
        title: bonus > 0 ? '🎉 보너스 EXP!' : '⭐ EXP 획득!',
        message: bonus > 0 ? `${reason}: +${amount} EXP (보너스 +${bonus})` : `${reason}: +${amount} EXP`,
        duration: 2000
      });
    }
  }

  showCoinNotification(amount, bonus, reason) {
    if (typeof showToast === 'function') {
      showToast({
        type: 'success',
        title: bonus > 0 ? '🎉 보너스 코인!' : '💰 코인 획득!',
        message: bonus > 0 ? `${reason}: +${amount} 코인 (보너스 +${bonus})` : `${reason}: +${amount} 코인`,
        duration: 2000
      });
    }
  }

  showLevelUpAnimation(oldLevel, newLevel) {
    const reward = newLevel * 50;
    if (typeof showToast === 'function') {
      showToast({
        type: 'levelup',
        title: '🎉 레벨업!',
        message: `${oldLevel} → ${newLevel}\n보상: ${reward} 코인 획득!`,
        duration: 4000
      });
    }
  }

  dispatchEvent(eventName, detail) {
    const event = new CustomEvent(`daum:${eventName}`, { detail, bubbles: true });
    document.dispatchEvent(event);
  }

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

  reset() {
    if (confirm('정말 모든 데이터를 초기화하시겠습니까?')) {
      Object.values(this.STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      this.init();
      this.updateUI();
      console.log('✅ 데이터 초기화 완료');
    }
  }
}

let pointSystem;
document.addEventListener('DOMContentLoaded', () => {
  pointSystem = new PointSystem();
  window.pointSystem = pointSystem;
  console.log('✅ PointSystem 전역 인스턴스 생성 완료');
});
