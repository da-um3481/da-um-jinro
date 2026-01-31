const fs = require('fs');

// diagnostic-test-db.js를 require로 불러오기
const diagnosticTestDB = require('./js/diagnostic-test-db.js');

// 학년별 성장테스트 문항 추출 (각 과목 10문항씩, 총 50문항)
const grades = [
  { key: 1, name: '중1' },
  { key: 2, name: '중2' },
  { key: 3, name: '중3' }
];

const subjects = ['수학', '영어', '국어', '사회', '과학'];

grades.forEach(grade => {
  const gradeData = {};
  let totalQuestions = 0;
  
  subjects.forEach(subject => {
    const questions = diagnosticTestDB[grade.key][subject].slice(0, 10);
    gradeData[subject] = questions;
    totalQuestions += questions.length;
    console.log(`${grade.name} ${subject}: ${questions.length}문항`);
  });
  
  const filename = `성장테스트_${grade.name}_문항.json`;
  fs.writeFileSync(filename, JSON.stringify(gradeData, null, 2), 'utf8');
  console.log(`✅ ${filename} 생성 완료 (총 ${totalQuestions}문항)\n`);
});

console.log('📁 생성된 파일:');
console.log('- 성장테스트_중1_문항.json');
console.log('- 성장테스트_중2_문항.json');
console.log('- 성장테스트_중3_문항.json');
