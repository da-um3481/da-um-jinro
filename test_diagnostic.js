const fs = require('fs');
const content = fs.readFileSync('js/diagnostic-test-db.js', 'utf8');
eval(content);

const grade1 = diagnosticTestDB[1];
console.log('📊 중1 진단평가 문제 분석\n');

['수학', '영어', '국어', '사회', '과학'].forEach(subject => {
    const questions = grade1[subject];
    console.log(`\n📚 ${subject} (${questions.length}문제)`);
    
    let totalPoints = 0;
    let byDifficulty = { 1: [], 2: [], 3: [] };
    
    questions.forEach(q => {
        totalPoints += q.points;
        byDifficulty[q.difficulty].push(q.points);
    });
    
    console.log(`   총점: ${totalPoints}점`);
    console.log(`   기초(난이도1): ${byDifficulty[1].length}문제 × ${byDifficulty[1][0]}점 = ${byDifficulty[1].reduce((a,b)=>a+b,0)}점`);
    console.log(`   표준(난이도2): ${byDifficulty[2].length}문제 × ${byDifficulty[2][0]}점 = ${byDifficulty[2].reduce((a,b)=>a+b,0)}점`);
    console.log(`   심화(난이도3): ${byDifficulty[3].length}문제 × ${byDifficulty[3][0]}점 = ${byDifficulty[3].reduce((a,b)=>a+b,0)}점`);
});

console.log('\n\n📊 전체 총점 계산:');
const subjects = ['수학', '영어', '국어', '사회', '과학'];
let grandTotal = 0;
subjects.forEach(subj => {
    const total = grade1[subj].reduce((sum, q) => sum + q.points, 0);
    grandTotal += total;
});
console.log(`   5과목 총점: ${grandTotal}점`);
console.log(`   총 문제 수: 50문제\n`);
