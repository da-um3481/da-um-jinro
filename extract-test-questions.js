// diagnostic-test-db.js를 모듈로 로드
const diagnosticTestDB = require('./js/diagnostic-test-db.js');
const fs = require('fs');

// HTML 생성 함수
function generateHTML(grade, data) {
    const subjects = ['수학', '영어', '국어', '사회', '과학'];
    
    let html = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>중${grade} 성장테스트 문제지 - 2026-01-30</title>
    <style>
        @media print { @page { margin: 2cm; } }
        body { font-family: 'Malgun Gothic', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .subject-title { background: #4a5568; color: white; padding: 12px; font-size: 20px; margin: 30px 0 20px 0; }
        .question { margin-bottom: 25px; padding: 15px; border: 1px solid #e2e8f0; page-break-inside: avoid; }
        .q-num { background: #667eea; color: white; padding: 5px 12px; border-radius: 3px; font-weight: bold; }
        .options { margin: 10px 0 0 20px; }
        .option { margin: 8px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌱 중${grade} 성장테스트 문제지</h1>
        <p>오픈일: 2026년 1월 30일 (금) | 총 50문제 (475점)</p>
    </div>
`;

    let qNum = 1;
    subjects.forEach(subj => {
        html += `<div class="subject-title">📚 ${subj}</div>`;
        (data[subj] || []).forEach(q => {
            html += `<div class="question">
<span class="q-num">${qNum}</span> (${q.points}점) ${q.question}
<div class="options">`;
            q.options.forEach((opt, i) => {
                html += `<div class="option">① ${opt}</div>`;
            });
            html += `</div></div>`;
            qNum++;
        });
    });
    
    html += `</body></html>`;
    return html;
}

// 실행
try {
    [1, 2, 3].forEach(grade => {
        const html = generateHTML(grade, diagnosticTestDB[grade]);
        fs.writeFileSync(`growth-test-grade${grade}-questions.html`, html);
        console.log(`✅ 중${grade} 생성 완료`);
    });
    console.log('\n🎉 완료! 브라우저에서 열고 Ctrl+P로 PDF 저장하세요.');
} catch(e) {
    console.error('오류:', e.message);
}
