// 교사 대시보드에서 F12 → Console 탭에 붙여넣기:

// 1. 저장된 피드백 확인
console.log('💾 저장된 피드백:');
console.log(localStorage.getItem('teacher_feedbacks'));

// 2. 파싱된 피드백 객체 확인
try {
    const feedbacks = JSON.parse(localStorage.getItem('teacher_feedbacks'));
    console.log('📋 피드백 개수:', Object.keys(feedbacks || {}).length);
    console.log('📝 피드백 목록:', feedbacks);
} catch (e) {
    console.error('❌ 피드백 파싱 에러:', e);
}

// 3. 현재 페이지의 feedbacks 변수 확인 (전역 변수라면)
if (typeof feedbacks !== 'undefined') {
    console.log('🎯 현재 feedbacks 변수:', feedbacks);
} else {
    console.log('⚠️ feedbacks 변수가 전역 스코프에 없습니다');
}
