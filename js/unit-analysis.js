// ==========================================
// 단원별 분석 및 EBS 강의 추천 시스템
// ==========================================

/**
 * 진단평가 결과를 단원별로 분석
 * @param {Array} questions - 진단평가 문제 배열
 * @param {Array} studentAnswers - 학생 답안 배열
 * @param {Object} subjectScores - 과목별 점수
 * @returns {Object} 단원별 분석 결과
 */
function analyzeByUnit(questions, studentAnswers, subjectScores) {
    const unitAnalysis = {
        대분류: {},
        중분류: {},
        소분류: {},
        개념태그: {}
    };
    
    const wrongQuestions = [];
    
    questions.forEach((q, idx) => {
        const isCorrect = studentAnswers[idx] === q.answer;
        
        // unit 정보가 없는 문제는 건너뛰기
        if (!q.unit) return;
        
        const unit = q.unit;
        
        // 각 계층별 집계
        ['대분류', '중분류', '소분류'].forEach(level => {
            const key = unit[level];
            if (!key) return;
            
            if (!unitAnalysis[level][key]) {
                unitAnalysis[level][key] = {
                    total: 0,
                    correct: 0,
                    wrong: 0,
                    score: 0,
                    maxScore: 0,
                    questions: [],
                    wrongQuestions: []
                };
            }
            
            unitAnalysis[level][key].total++;
            unitAnalysis[level][key].maxScore += q.points;
            
            if (isCorrect) {
                unitAnalysis[level][key].correct++;
                unitAnalysis[level][key].score += q.points;
            } else {
                unitAnalysis[level][key].wrong++;
                unitAnalysis[level][key].wrongQuestions.push({
                    id: q.id,
                    question: q.question,
                    concept: q.concept,
                    difficulty: q.difficulty,
                    points: q.points
                });
            }
            
            unitAnalysis[level][key].questions.push(q);
        });
        
        // 개념태그 분석
        if (unit.개념태그 && Array.isArray(unit.개념태그)) {
            unit.개념태그.forEach(tag => {
                if (!unitAnalysis.개념태그[tag]) {
                    unitAnalysis.개념태그[tag] = {
                        total: 0,
                        correct: 0,
                        wrong: 0
                    };
                }
                
                unitAnalysis.개념태그[tag].total++;
                if (isCorrect) {
                    unitAnalysis.개념태그[tag].correct++;
                } else {
                    unitAnalysis.개념태그[tag].wrong++;
                }
            });
        }
        
        // 틀린 문제 수집
        if (!isCorrect) {
            wrongQuestions.push({
                ...q,
                studentAnswer: studentAnswers[idx]
            });
        }
    });
    
    // 취약 단원 파악 (정답률 60% 미만)
    const weakUnits = {
        대분류: [],
        중분류: [],
        소분류: []
    };
    
    ['대분류', '중분류', '소분류'].forEach(level => {
        weakUnits[level] = Object.entries(unitAnalysis[level])
            .filter(([name, data]) => {
                const rate = data.correct / data.total;
                return rate < 0.6 && data.total >= 2; // 최소 2문제 이상
            })
            .map(([name, data]) => ({
                name: name,
                correctRate: (data.correct / data.total * 100).toFixed(1),
                correct: data.correct,
                total: data.total,
                score: data.score,
                maxScore: data.maxScore,
                wrongQuestions: data.wrongQuestions
            }))
            .sort((a, b) => parseFloat(a.correctRate) - parseFloat(b.correctRate))
            .slice(0, 5); // 상위 5개
    });
    
    // 강점 단원 파악 (정답률 80% 이상)
    const strongUnits = {
        중분류: []
    };
    
    strongUnits.중분류 = Object.entries(unitAnalysis.중분류)
        .filter(([name, data]) => {
            const rate = data.correct / data.total;
            return rate >= 0.8 && data.total >= 2;
        })
        .map(([name, data]) => ({
            name: name,
            correctRate: (data.correct / data.total * 100).toFixed(1),
            correct: data.correct,
            total: data.total
        }))
        .sort((a, b) => parseFloat(b.correctRate) - parseFloat(a.correctRate))
        .slice(0, 3);
    
    return {
        unitAnalysis,
        weakUnits,
        strongUnits,
        wrongQuestions,
        summary: {
            totalQuestions: questions.length,
            correctCount: questions.filter((q, idx) => studentAnswers[idx] === q.answer).length,
            wrongCount: wrongQuestions.length
        }
    };
}

/**
 * 취약 단원 기반 EBS 강의 추천
 * @param {Object} diagnosticResult - 진단평가 결과
 * @param {Object} unitAnalysisResult - 단원별 분석 결과
 * @returns {Array} 추천 강의 목록
 */
function recommendLectures(diagnosticResult, unitAnalysisResult) {
    const { grade, subjectLevels } = diagnosticResult;
    const { weakUnits } = unitAnalysisResult;
    
    const recommendations = [];
    const gradeKey = `중${grade}`;
    
    // EBS 강의 DB가 없으면 빈 배열 반환
    if (typeof ebsLectureDB === 'undefined') {
        console.warn('EBS 강의 DB가 로드되지 않았습니다.');
        return recommendations;
    }
    
    // 중분류 단위로 강의 추천 (가장 실용적)
    weakUnits.중분류.forEach(unit => {
        const unitName = unit.name;
        
        // 해당 단원이 어느 과목인지 확인
        Object.keys(subjectLevels).forEach(subject => {
            const level = subjectLevels[subject];
            
            // EBS 강의 DB에서 해당 강의 찾기
            const lectureData = ebsLectureDB[gradeKey]?.[subject]?.[unitName]?.[level];
            
            if (lectureData) {
                recommendations.push({
                    unit: unitName,
                    subject: subject,
                    level: level,
                    correctRate: unit.correctRate,
                    reason: `정답률 ${unit.correctRate}% (${unit.correct}/${unit.total})`,
                    priority: parseFloat(unit.correctRate) < 40 ? 'high' : 'medium',
                    lecture: lectureData,
                    wrongQuestions: unit.wrongQuestions || []
                });
            }
        });
    });
    
    // 우선순위 정렬 (낮은 정답률 우선)
    recommendations.sort((a, b) => {
        // 1순위: priority (high > medium)
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        
        // 2순위: 정답률 (낮은 것 우선)
        return parseFloat(a.correctRate) - parseFloat(b.correctRate);
    });
    
    return recommendations;
}

/**
 * 맞춤형 학습 문제 추천 (규칙 기반)
 * @param {Object} diagnosticResult - 진단평가 결과
 * @param {Object} unitAnalysisResult - 단원별 분석 결과
 * @returns {Array} 추천 문제 목록
 */
function recommendProblems(diagnosticResult, unitAnalysisResult) {
    const { subjectLevels, wrongQuestions } = diagnosticResult;
    const { weakUnits } = unitAnalysisResult;
    
    const recommendations = [];
    
    // 1. 취약 과목 집중 문제 (과목별 수준 기반)
    Object.keys(subjectLevels).forEach(subject => {
        const level = subjectLevels[subject];
        let problemCount = 0;
        let difficultyFocus = 2; // 기본 표준
        let source = '';
        
        if (level === '기초') {
            problemCount = 15;
            difficultyFocus = 1;
            source = 'EBS 기초 다지기';
        } else if (level === '표준') {
            problemCount = 10;
            difficultyFocus = 2;
            source = 'EBS 유형 마스터';
        } else if (level === '심화') {
            problemCount = 5;
            difficultyFocus = 3;
            source = 'EBS 실력 완성';
        }
        
        recommendations.push({
            subject: subject,
            type: `${level} 집중`,
            difficulty: difficultyFocus,
            count: problemCount,
            source: source,
            priority: level === '기초' ? 'high' : 'medium'
        });
    });
    
    // 2. 틀린 문제 유형 분석 (개념별)
    const conceptCount = {};
    wrongQuestions.forEach(q => {
        const concept = q.concept || '기타';
        conceptCount[concept] = (conceptCount[concept] || 0) + 1;
    });
    
    // 3. 가장 많이 틀린 개념 우선 추천 (상위 3개)
    Object.entries(conceptCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([concept, count]) => {
            recommendations.push({
                concept: concept,
                type: '개념 보강',
                count: count * 3, // 틀린 개수의 3배만큼 연습
                priority: 'high',
                source: 'EBS 개념 완성'
            });
        });
    
    // 4. 취약 단원 추가 문제 (중분류 기준)
    weakUnits.중분류.slice(0, 3).forEach(unit => {
        recommendations.push({
            unit: unit.name,
            type: '단원 보강',
            count: 8,
            correctRate: unit.correctRate,
            priority: parseFloat(unit.correctRate) < 40 ? 'high' : 'medium',
            source: 'EBS 단원평가'
        });
    });
    
    return recommendations;
}

/**
 * 학습 우선순위 생성
 * @param {Array} lectureRecommendations - 강의 추천 목록
 * @param {Array} problemRecommendations - 문제 추천 목록
 * @returns {Object} 학습 우선순위
 */
function generateLearningPriority(lectureRecommendations, problemRecommendations) {
    const priority = {
        urgent: [],    // 긴급 (정답률 40% 미만)
        important: [], // 중요 (정답률 40~60%)
        normal: []     // 보통 (정답률 60~80%)
    };
    
    // 강의 우선순위 분류
    lectureRecommendations.forEach(rec => {
        const rate = parseFloat(rec.correctRate);
        if (rate < 40) {
            priority.urgent.push({
                type: 'lecture',
                ...rec
            });
        } else if (rate < 60) {
            priority.important.push({
                type: 'lecture',
                ...rec
            });
        } else {
            priority.normal.push({
                type: 'lecture',
                ...rec
            });
        }
    });
    
    // 문제 우선순위 분류
    problemRecommendations.forEach(rec => {
        if (rec.priority === 'high') {
            priority.urgent.push({
                type: 'problem',
                ...rec
            });
        } else {
            priority.important.push({
                type: 'problem',
                ...rec
            });
        }
    });
    
    return priority;
}

/**
 * 학습 계획 생성 (30일 기준)
 * @param {Object} learningPriority - 학습 우선순위
 * @param {number} days - 학습 일수 (기본 30일)
 * @returns {Object} 30일 학습 계획
 */
function generateLearningPlan(learningPriority, days = 30) {
    const plan = {
        week1: [],
        week2: [],
        week3: [],
        week4: [],
        summary: {
            totalLectures: 0,
            totalProblems: 0,
            estimatedHours: 0
        }
    };
    
    const { urgent, important, normal } = learningPriority;
    
    // 1주차: 긴급 항목 집중
    plan.week1 = urgent.slice(0, 7);
    
    // 2주차: 중요 항목 + 남은 긴급
    plan.week2 = [...urgent.slice(7), ...important].slice(0, 7);
    
    // 3주차: 중요 항목 계속 + 일반
    plan.week3 = [...important.slice(7 - urgent.slice(7).length), ...normal].slice(0, 7);
    
    // 4주차: 종합 복습
    plan.week4 = [
        ...urgent.slice(0, 2),
        ...important.slice(0, 2),
        ...normal.slice(0, 3)
    ];
    
    // 요약 통계
    [plan.week1, plan.week2, plan.week3, plan.week4].forEach(week => {
        week.forEach(item => {
            if (item.type === 'lecture') {
                plan.summary.totalLectures++;
                const duration = parseInt(item.lecture?.duration) || 30;
                plan.summary.estimatedHours += duration / 60;
            } else {
                plan.summary.totalProblems += item.count || 0;
                plan.summary.estimatedHours += (item.count || 0) * 0.05; // 문제당 3분
            }
        });
    });
    
    plan.summary.estimatedHours = Math.round(plan.summary.estimatedHours);
    
    return plan;
}

// ==========================================
// 유틸리티 함수
// ==========================================

/**
 * 단원별 분석 결과를 HTML로 변환
 * @param {Object} unitAnalysisResult - 단원별 분석 결과
 * @returns {string} HTML 문자열
 */
function renderUnitAnalysisHTML(unitAnalysisResult) {
    const { unitAnalysis, weakUnits, strongUnits } = unitAnalysisResult;
    
    let html = '<div class="unit-analysis-container">';
    
    // 취약 단원
    if (weakUnits.중분류.length > 0) {
        html += '<div class="weak-units">';
        html += '<h4 class="text-lg font-bold text-red-600 mb-3">🚨 보강 필요 단원</h4>';
        html += '<div class="space-y-2">';
        
        weakUnits.중분류.forEach(unit => {
            const percentage = parseFloat(unit.correctRate);
            const barColor = percentage < 40 ? 'bg-red-500' : 'bg-yellow-500';
            
            html += `
                <div class="unit-card bg-red-50 border-2 border-red-200 rounded-lg p-3">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-gray-800">${unit.name}</span>
                        <span class="text-sm font-bold text-red-600">${unit.correctRate}%</span>
                    </div>
                    <div class="bg-gray-200 rounded-full h-2 mb-2">
                        <div class="${barColor} h-2 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                    <div class="text-xs text-gray-600">
                        정답: ${unit.correct}/${unit.total} 문제
                    </div>
                </div>
            `;
        });
        
        html += '</div></div>';
    }
    
    // 강점 단원
    if (strongUnits.중분류.length > 0) {
        html += '<div class="strong-units mt-4">';
        html += '<h4 class="text-lg font-bold text-green-600 mb-3">✅ 잘하는 단원</h4>';
        html += '<div class="space-y-2">';
        
        strongUnits.중분류.forEach(unit => {
            html += `
                <div class="unit-card bg-green-50 border-2 border-green-200 rounded-lg p-3">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-gray-800">${unit.name}</span>
                        <span class="text-sm font-bold text-green-600">${unit.correctRate}%</span>
                    </div>
                    <div class="text-xs text-gray-600 mt-1">
                        정답: ${unit.correct}/${unit.total} 문제
                    </div>
                </div>
            `;
        });
        
        html += '</div></div>';
    }
    
    html += '</div>';
    
    return html;
}

/**
 * 추천 강의를 HTML로 변환
 * @param {Array} lectureRecommendations - 강의 추천 목록
 * @returns {string} HTML 문자열
 */
function renderLectureRecommendationsHTML(lectureRecommendations) {
    if (lectureRecommendations.length === 0) {
        return '<p class="text-gray-500">추천 강의가 없습니다.</p>';
    }
    
    let html = '<div class="lecture-recommendations space-y-4">';
    
    lectureRecommendations.slice(0, 5).forEach(rec => {
        const priorityBadge = rec.priority === 'high' 
            ? '<span class="badge bg-red-500 text-white px-2 py-1 rounded text-xs">🚨 우선 학습</span>'
            : '<span class="badge bg-yellow-500 text-white px-2 py-1 rounded text-xs">⚠️ 보강 필요</span>';
        
        html += `
            <div class="lecture-card bg-white border-2 ${rec.priority === 'high' ? 'border-red-300' : 'border-yellow-300'} rounded-xl p-4 hover:shadow-lg transition-shadow">
                <div class="flex items-start gap-4">
                    <img src="${rec.lecture.thumbnail}" alt="${rec.lecture.title}" 
                         class="w-32 h-18 rounded-lg object-cover" />
                    <div class="flex-1">
                        ${priorityBadge}
                        <h5 class="font-bold text-gray-900 mt-2">${rec.lecture.title}</h5>
                        <p class="text-sm text-gray-600 mt-1">👨‍🏫 ${rec.lecture.teacher} 선생님</p>
                        <p class="text-sm text-gray-700 mt-1">${rec.lecture.description}</p>
                        <div class="flex items-center gap-4 mt-2 text-xs text-gray-600">
                            <span>⏱ ${rec.lecture.duration}</span>
                            <span>📊 ${rec.reason}</span>
                            <span class="font-bold">${rec.level} 수준</span>
                        </div>
                    </div>
                    <a href="${rec.lecture.url}" target="_blank" 
                       class="btn bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap">
                        강의 듣기 →
                    </a>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

console.log('✅ 단원별 분석 및 EBS 강의 추천 시스템 로드 완료');
