/**
 * DA.UM 게이미피케이션 시스템 테스트 스크립트
 * 개발자 도구 콘솔에서 실행
 */

// 테스트 메뉴 출력
console.log(`
╔══════════════════════════════════════════════════════╗
║     🎮 DA.UM 게이미피케이션 테스트 메뉴          ║
╚══════════════════════════════════════════════════════╝

📋 사용 가능한 테스트 함수:

1️⃣  testExpGain()          - 경험치 획득 테스트
2️⃣  testCoinGain()         - 코인 획득 테스트
3️⃣  testStudyComplete()    - 자율학습 완료 시뮬레이션
4️⃣  testReviewComplete()   - 복습 완료 시뮬레이션
5️⃣  testLevelUp()          - 레벨업 테스트
6️⃣  testStreak()           - 스트릭 달성 테스트
7️⃣  checkStatus()          - 현재 상태 확인
8️⃣  checkHistory()         - 이력 확인
9️⃣  resetPoints()          - 데이터 초기화 (주의!)
🔟  runAllTests()          - 모든 테스트 실행

예시:
  > testExpGain()           // 경험치 획득 테스트
  > checkStatus()           // 현재 상태 확인
`);

// 1. 경험치 획득 테스트
function testExpGain() {
    console.log('⭐ 경험치 획득 테스트 시작...');
    if (typeof pointSystem === 'undefined') {
        console.error('❌ pointSystem이 로드되지 않았습니다.');
        return;
    }
    const result = pointSystem.earnExp(50, '테스트 활동');
    console.log('✅ 결과:', result);
}

// 2. 코인 획득 테스트
function testCoinGain() {
    console.log('💰 코인 획득 테스트 시작...');
    if (typeof pointSystem === 'undefined') {
        console.error('❌ pointSystem이 로드되지 않았습니다.');
        return;
    }
    const result = pointSystem.earnCoins(100, '테스트 활동');
    console.log('✅ 결과:', result);
}

// 3. 자율학습 완료 시뮬레이션
function testStudyComplete(minutes = 30, subject = '수학') {
    console.log(`📚 자율학습 완료 시뮬레이션: ${subject} ${minutes}분`);
    document.dispatchEvent(new CustomEvent('studyCompleted', {
        detail: { duration: minutes, subject: subject }
    }));
    console.log('✅ 이벤트 발생 완료');
}

// 4. 복습 완료 시뮬레이션
function testReviewComplete(correctRate = 100, subject = '영어') {
    console.log(`📖 복습 완료 시뮬레이션: ${subject} (정답률 ${correctRate}%)`);
    document.dispatchEvent(new CustomEvent('reviewCompleted', {
        detail: { correctRate: correctRate, subject: subject }
    }));
    console.log('✅ 이벤트 발생 완료');
}

// 5. 레벨업 테스트
function testLevelUp(targetLevel = 5) {
    console.log(`🎉 레벨 ${targetLevel}로 강제 설정 중...`);
    if (typeof pointSystem === 'undefined') {
        console.error('❌ pointSystem이 로드되지 않았습니다.');
        return;
    }
    const requiredExp = pointSystem.calculateExpForLevel(targetLevel);
    pointSystem.totalExp = requiredExp;
    pointSystem.checkLevelUp();
    pointSystem.updateUI();
    console.log('✅ 레벨업 완료!', pointSystem.getStatus());
}

// 6. 스트릭 달성 테스트
function testStreak(days = 7) {
    console.log(`🔥 ${days}일 스트릭 달성 시뮬레이션`);
    document.dispatchEvent(new CustomEvent('streakAchieved', {
        detail: { days: days }
    }));
    console.log('✅ 이벤트 발생 완료');
}

// 7. 현재 상태 확인
function checkStatus() {
    if (typeof pointSystem === 'undefined') {
        console.error('❌ pointSystem이 로드되지 않았습니다.');
        return;
    }
    const status = pointSystem.getStatus();
    console.log(`
╔══════════════════════════════════════════════════════╗
║              📊 현재 상태                        ║
╚══════════════════════════════════════════════════════╝

🎯 레벨: ${status.level} (${status.levelTitle})
⭐ 현재 경험치: ${status.currentExp.toLocaleString()} EXP
📈 다음 레벨까지: ${status.expToNextLevel.toLocaleString()} EXP
📊 진행률: ${status.levelProgress}%
💰 코인: ${status.coins.toLocaleString()}
🎁 레벨 보너스: x${status.levelBonus}
    `);
    return status;
}

// 8. 이력 확인
function checkHistory(type = 'all', limit = 10) {
    if (typeof pointSystem === 'undefined') {
        console.error('❌ pointSystem이 로드되지 않았습니다.');
        return;
    }
    const history = pointSystem.getHistory(type, limit);
    console.log(`📜 최근 ${type} 이력 (${history.length}개):`);
    console.table(history.map(h => ({
        타입: h.type,
        수량: h.amount,
        사유: h.reason,
        시간: new Date(h.timestamp).toLocaleString('ko-KR')
    })));
    return history;
}

// 9. 데이터 초기화
function resetPoints() {
    if (typeof pointSystem === 'undefined') {
        console.error('❌ pointSystem이 로드되지 않았습니다.');
        return;
    }
    console.warn('⚠️  모든 포인트 데이터를 초기화합니다!');
    pointSystem.reset();
}

// 10. 모든 테스트 실행
function runAllTests() {
    console.log('🚀 모든 테스트 실행 시작...\n');
    
    // 1. 경험치 테스트
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testExpGain();
    
    // 2. 코인 테스트
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testCoinGain();
    
    // 3. 자율학습 테스트
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testStudyComplete(30, '수학');
    
    // 4. 복습 테스트
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testReviewComplete(100, '영어');
    
    // 5. 스트릭 테스트
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testStreak(7);
    
    // 6. 상태 확인
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    checkStatus();
    
    // 7. 이력 확인
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    checkHistory('all', 5);
    
    console.log('\n✅ 모든 테스트 완료!');
}

// 빠른 테스트 단축키
window.test = {
    exp: testExpGain,
    coin: testCoinGain,
    study: testStudyComplete,
    review: testReviewComplete,
    levelup: testLevelUp,
    streak: testStreak,
    status: checkStatus,
    history: checkHistory,
    reset: resetPoints,
    all: runAllTests
};

console.log(`
💡 단축키 사용법:
  test.exp()       // 경험치 테스트
  test.coin()      // 코인 테스트
  test.study(30)   // 30분 학습 테스트
  test.status()    // 상태 확인
  test.all()       // 전체 테스트
`);
