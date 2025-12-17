// 보고서 생성 스크립트

let currentStudent = null;
let reportData = null;
let studyTimeChart = null;
let subjectChart = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadStudentList();
    initCharts();
    setDefaultDates();
});

// 기본 날짜 설정 (3월 ~ 4월 중간고사)
function setDefaultDates() {
    const currentYear = new Date().getFullYear();
    document.getElementById('startDate').value = `${currentYear}-03-01`;
    document.getElementById('endDate').value = `${currentYear}-04-30`;
}

// 학생 목록 로드
async function loadStudentList() {
    try {
        const response = await fetch('tables/students?limit=100');
        const data = await response.json();
        
        const select = document.getElementById('studentSelect');
        data.data.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} (${student.grade}학년 ${student.class_num}반 ${student.student_num}번)`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('학생 목록 로드 오류:', error);
    }
}

// 보고서 생성
async function generateReport() {
    const studentId = document.getElementById('studentSelect').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!studentId || !startDate || !endDate) {
        return;
    }
    
    try {
        // 학생 정보 로드
        const studentResponse = await fetch(`tables/students/${studentId}`);
        currentStudent = await studentResponse.json();
        
        // 기간 내 학습 데이터 로드
        const checksResponse = await fetch('tables/daily_checks?limit=2000');
        const checksData = await checksResponse.json();
        
        const dailyChecks = checksData.data.filter(c => 
            c.student_id === studentId &&
            c.date >= startDate &&
            c.date <= endDate
        );
        
        // 피드백 데이터 로드
        const feedbackResponse = await fetch('tables/weekly_feedback?limit=100');
        const feedbackData = await feedbackResponse.json();
        
        const feedbacks = feedbackData.data.filter(f => 
            f.student_id === studentId &&
            f.week_start >= startDate &&
            f.week_end <= endDate
        ).sort((a, b) => new Date(b.week_start) - new Date(a.week_start));
        
        // 보고서 데이터 생성
        reportData = {
            student: currentStudent,
            dailyChecks: dailyChecks,
            feedbacks: feedbacks,
            startDate: startDate,
            endDate: endDate
        };
        
        // 보고서 표시
        displayReport();
        
    } catch (error) {
        console.error('보고서 생성 오류:', error);
        alert('보고서 생성에 실패했습니다.');
    }
}

// 보고서 표시
function displayReport() {
    document.getElementById('emptyReport').classList.add('hidden');
    document.getElementById('reportBody').classList.remove('hidden');
    
    // 기간 표시
    document.getElementById('reportPeriod').textContent = 
        `${reportData.startDate} ~ ${reportData.endDate}`;
    
    // 보고서 날짜
    document.getElementById('reportDate').textContent = 
        `작성일: ${new Date().toLocaleDateString('ko-KR')}`;
    
    // 학생 기본 정보
    displayBasicInfo();
    
    // 학습 시간 통계
    displayTimeStats();
    
    // 과목별 성취도
    displaySubjectAchievement();
    
    // 피드백 이력
    displayFeedbackHistory();
    
    // 종합 의견
    displayComprehensiveOpinion();
}

// 학생 기본 정보 표시
function displayBasicInfo() {
    const avgScore = calculateAverageScore(currentStudent);
    
    document.getElementById('studentBasicInfo').innerHTML = `
        <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">이름</p>
            <p class="text-lg font-bold">${currentStudent.name}</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">학년/반/번호</p>
            <p class="text-lg font-bold">${currentStudent.grade}학년 ${currentStudent.class_num}반 ${currentStudent.student_num}번</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">학습 수준</p>
            <p class="text-lg font-bold">${currentStudent.level}</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">평균 성적</p>
            <p class="text-lg font-bold">${avgScore.toFixed(1)}점</p>
        </div>
    `;
}

// 학습 시간 통계 표시
function displayTimeStats() {
    const totalPlanned = reportData.dailyChecks.reduce((sum, c) => sum + (c.planned_time || 0), 0);
    const totalActual = reportData.dailyChecks.reduce((sum, c) => sum + (c.actual_time || 0), 0);
    const completedCount = reportData.dailyChecks.filter(c => c.completed).length;
    const totalDays = new Set(reportData.dailyChecks.map(c => c.date)).size;
    const achievement = totalPlanned > 0 ? (totalActual / totalPlanned * 100) : 0;
    
    // 통계 정보
    document.getElementById('timeStats').innerHTML = `
        <div class="p-4 bg-indigo-50 rounded-lg">
            <p class="text-sm text-gray-600">전체 계획 시간</p>
            <p class="text-2xl font-bold text-indigo-600">${Math.round(totalPlanned / 60)}시간 ${totalPlanned % 60}분</p>
        </div>
        <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-600">전체 실제 시간</p>
            <p class="text-2xl font-bold text-green-600">${Math.round(totalActual / 60)}시간 ${totalActual % 60}분</p>
        </div>
        <div class="p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-600">달성률</p>
            <p class="text-2xl font-bold text-blue-600">${achievement.toFixed(1)}%</p>
        </div>
        <div class="p-4 bg-purple-50 rounded-lg">
            <p class="text-sm text-gray-600">완료한 학습</p>
            <p class="text-2xl font-bold text-purple-600">${completedCount}개</p>
        </div>
        <div class="p-4 bg-orange-50 rounded-lg">
            <p class="text-sm text-gray-600">학습 일수</p>
            <p class="text-2xl font-bold text-orange-600">${totalDays}일</p>
        </div>
        <div class="p-4 bg-pink-50 rounded-lg">
            <p class="text-sm text-gray-600">일평균 학습시간</p>
            <p class="text-2xl font-bold text-pink-600">${totalDays > 0 ? Math.round(totalActual / totalDays) : 0}분</p>
        </div>
    `;
    
    // 주별 학습시간 차트
    const weeklyData = processWeeklyTimeData();
    studyTimeChart.data.labels = weeklyData.labels;
    studyTimeChart.data.datasets[0].data = weeklyData.planned;
    studyTimeChart.data.datasets[1].data = weeklyData.actual;
    studyTimeChart.update();
}

// 주별 학습시간 데이터 처리
function processWeeklyTimeData() {
    const weeks = {};
    
    reportData.dailyChecks.forEach(check => {
        const date = new Date(check.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeks[weekKey]) {
            weeks[weekKey] = { planned: 0, actual: 0 };
        }
        weeks[weekKey].planned += check.planned_time || 0;
        weeks[weekKey].actual += check.actual_time || 0;
    });
    
    const sortedWeeks = Object.keys(weeks).sort();
    return {
        labels: sortedWeeks.map(w => formatWeekLabel(w)),
        planned: sortedWeeks.map(w => weeks[w].planned),
        actual: sortedWeeks.map(w => weeks[w].actual)
    };
}

// 과목별 성취도 표시
function displaySubjectAchievement() {
    const subjects = ['국어', '영어', '수학', '과학', '사회'];
    const subjectData = subjects.map(subject => {
        const subjectChecks = reportData.dailyChecks.filter(c => c.subject === subject);
        const totalPlanned = subjectChecks.reduce((sum, c) => sum + (c.planned_time || 0), 0);
        const totalActual = subjectChecks.reduce((sum, c) => sum + (c.actual_time || 0), 0);
        return totalPlanned > 0 ? (totalActual / totalPlanned * 100) : 0;
    });
    
    subjectChart.data.datasets[0].data = subjectData;
    subjectChart.update();
}

// 피드백 이력 표시
function displayFeedbackHistory() {
    const container = document.getElementById('feedbackHistory');
    
    if (reportData.feedbacks.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">피드백 기록이 없습니다.</p>';
        return;
    }
    
    container.innerHTML = reportData.feedbacks.map((feedback, index) => `
        <div class="border-l-4 border-indigo-500 bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-gray-800">
                    ${index + 1}주차: ${formatWeekRange(feedback.week_start, feedback.week_end)}
                </h4>
                <span class="px-3 py-1 text-sm font-semibold rounded-full ${getAchievementClass(feedback.study_time_achievement)}">
                    달성률 ${feedback.study_time_achievement.toFixed(1)}%
                </span>
            </div>
            <div class="mb-2">
                <p class="text-sm font-semibold text-gray-700 mb-1">선생님 코멘트:</p>
                <p class="text-sm text-gray-600">${feedback.teacher_comment || '작성 안됨'}</p>
            </div>
            ${feedback.improvement_notes ? `
                <div class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p class="text-sm font-semibold text-yellow-800 mb-1">💡 개선사항:</p>
                    <p class="text-sm text-gray-700">${feedback.improvement_notes}</p>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// 종합 의견 표시
function displayComprehensiveOpinion() {
    const totalDays = new Set(reportData.dailyChecks.map(c => c.date)).size;
    const totalActual = reportData.dailyChecks.reduce((sum, c) => sum + (c.actual_time || 0), 0);
    const avgDailyTime = totalDays > 0 ? totalActual / totalDays : 0;
    const avgAchievement = reportData.feedbacks.length > 0 ?
        reportData.feedbacks.reduce((sum, f) => sum + f.study_time_achievement, 0) / reportData.feedbacks.length : 0;
    
    let opinion = '';
    
    if (avgAchievement >= 90) {
        opinion = '매우 우수한 자기주도학습 성취율을 보이고 있습니다. 꾸준한 학습 태도와 높은 달성률을 유지하고 있어 칭찬할 만합니다.';
    } else if (avgAchievement >= 70) {
        opinion = '양호한 학습 태도를 보이고 있습니다. 목표 시간을 대체로 달성하고 있으며, 지속적인 노력이 필요합니다.';
    } else if (avgAchievement >= 50) {
        opinion = '학습 시간 관리에 개선이 필요합니다. 계획한 학습 시간을 완전히 달성하지 못하는 경우가 있어 동기부여와 시간 관리 지도가 필요합니다.';
    } else {
        opinion = '학습 시간 달성률이 낮은 편입니다. 학습 습관 형성과 지속적인 관심이 필요하며, 개별 상담을 통한 맞춤형 지도가 권장됩니다.';
    }
    
    document.getElementById('comprehensiveOpinion').innerHTML = `
        <div class="space-y-3">
            <div>
                <p class="font-semibold text-gray-800 mb-2">📊 학습 성과 요약</p>
                <ul class="list-disc list-inside text-gray-700 space-y-1">
                    <li>총 학습 일수: ${totalDays}일</li>
                    <li>일평균 학습시간: ${Math.round(avgDailyTime)}분 (목표: 240분)</li>
                    <li>평균 달성률: ${avgAchievement.toFixed(1)}%</li>
                    <li>주간 피드백 횟수: ${reportData.feedbacks.length}회</li>
                </ul>
            </div>
            <div>
                <p class="font-semibold text-gray-800 mb-2">💭 종합 의견</p>
                <p class="text-gray-700 leading-relaxed">${opinion}</p>
            </div>
            <div>
                <p class="font-semibold text-gray-800 mb-2">✅ 향후 권장사항</p>
                <ul class="list-disc list-inside text-gray-700 space-y-1">
                    <li>매일 정해진 시간에 학습하는 습관 유지</li>
                    <li>취약 과목에 대한 집중 학습 시간 확보</li>
                    <li>주간 피드백을 참고하여 학습 방법 개선</li>
                    <li>중간고사 대비 체계적인 복습 계획 수립</li>
                </ul>
            </div>
        </div>
    `;
}

// 인쇄
function printReport() {
    window.print();
}

// 차트 초기화
function initCharts() {
    // 주별 학습시간 차트
    const timeCtx = document.getElementById('studyTimeChart').getContext('2d');
    studyTimeChart = new Chart(timeCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: '계획 시간',
                    data: [],
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4
                },
                {
                    label: '실제 시간',
                    data: [],
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: '시간 (분)' }
                }
            }
        }
    });
    
    // 과목별 성취도 차트
    const subjectCtx = document.getElementById('subjectChart').getContext('2d');
    subjectChart = new Chart(subjectCtx, {
        type: 'radar',
        data: {
            labels: ['국어', '영어', '수학', '과학', '사회'],
            datasets: [{
                label: '달성률 (%)',
                data: [],
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                pointBackgroundColor: 'rgb(99, 102, 241)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 150,
                    ticks: { stepSize: 30 }
                }
            }
        }
    });
}

// 유틸리티 함수들
function calculateAverageScore(student) {
    const scores = [
        student.korean_score || 0,
        student.english_score || 0,
        student.math_score || 0,
        student.science_score || 0,
        student.social_score || 0
    ];
    const validScores = scores.filter(s => s > 0);
    return validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
}

function formatWeekLabel(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth()+1}/${date.getDate()}`;
}

function formatWeekRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.getMonth()+1}/${startDate.getDate()} ~ ${endDate.getMonth()+1}/${endDate.getDate()}`;
}

function getAchievementClass(achievement) {
    if (achievement >= 90) return 'bg-green-100 text-green-700';
    if (achievement >= 70) return 'bg-blue-100 text-blue-700';
    if (achievement >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
}
