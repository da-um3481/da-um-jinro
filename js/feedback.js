// 피드백 관리 스크립트

let currentStudent = null;
let weeklyData = null;
let timeChart = null;
let achievementChart = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id');
    
    if (!studentId) {
        alert('학생 ID가 필요합니다.');
        location.href = 'students.html';
        return;
    }
    
    loadStudent(studentId);
    setupForm();
    initCharts();
    setCurrentWeek();
});

// 현재 주 설정
function setCurrentWeek() {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // 이번 주 일요일
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // 이번 주 토요일
    
    document.getElementById('weekStart').value = weekStart.toISOString().split('T')[0];
    document.getElementById('weekEnd').value = weekEnd.toISOString().split('T')[0];
}

// 학생 정보 로드
async function loadStudent(studentId) {
    try {
        const response = await fetch(`tables/students/${studentId}`);
        currentStudent = await response.json();
        
        displayStudentInfo();
        loadWeeklyData();
        
    } catch (error) {
        console.error('학생 정보 로드 오류:', error);
        alert('학생 정보를 불러오는데 실패했습니다.');
    }
}

// 학생 정보 표시
function displayStudentInfo() {
    const avgScore = calculateAverageScore(currentStudent);
    
    document.getElementById('studentInfo').innerHTML = `
        <div class="p-4 bg-indigo-50 rounded-lg">
            <p class="text-sm text-gray-600">이름</p>
            <p class="text-lg font-semibold">${currentStudent.name}</p>
        </div>
        <div class="p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-600">학년/반/번호</p>
            <p class="text-lg font-semibold">${currentStudent.grade}학년 ${currentStudent.class_num}반 ${currentStudent.student_num}번</p>
        </div>
        <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-600">수준 / 평균 성적</p>
            <p class="text-lg font-semibold">${currentStudent.level} / ${avgScore.toFixed(1)}점</p>
        </div>
    `;
}

// 주간 데이터 로드
async function loadWeeklyData() {
    try {
        const weekStart = document.getElementById('weekStart').value;
        const weekEnd = document.getElementById('weekEnd').value;
        
        if (!weekStart || !weekEnd) {
            alert('주간 시작일과 종료일을 선택해주세요.');
            return;
        }
        
        // 해당 주의 일일 체크 데이터 로드
        const response = await fetch('tables/daily_checks?limit=1000');
        const data = await response.json();
        
        weeklyData = data.data.filter(check => {
            return check.student_id === currentStudent.id &&
                   check.date >= weekStart &&
                   check.date <= weekEnd;
        });
        
        if (weeklyData.length === 0) {
            alert('해당 주간의 학습 데이터가 없습니다.');
            return;
        }
        
        // 데이터 분석 및 표시
        analyzeWeeklyData();
        updateCharts();
        calculateAchievement();
        
        // 기존 피드백 확인
        await checkExistingFeedback(weekStart, weekEnd);
        
    } catch (error) {
        console.error('주간 데이터 로드 오류:', error);
        alert('주간 데이터를 불러오는데 실패했습니다.');
    }
}

// 주간 데이터 분석
function analyzeWeeklyData() {
    const subjects = ['국어', '영어', '수학', '과학', '사회'];
    const stats = {};
    
    subjects.forEach(subject => {
        const subjectData = weeklyData.filter(d => d.subject === subject);
        const totalPlanned = subjectData.reduce((sum, d) => sum + (d.planned_time || 0), 0);
        const totalActual = subjectData.reduce((sum, d) => sum + (d.actual_time || 0), 0);
        const completed = subjectData.filter(d => d.completed).length;
        
        stats[subject] = {
            planned: totalPlanned,
            actual: totalActual,
            achievement: totalPlanned > 0 ? (totalActual / totalPlanned * 100).toFixed(1) : 0,
            completed: completed,
            total: subjectData.length
        };
    });
    
    // 통계 표시
    const statsContainer = document.getElementById('weeklyStats');
    const totalPlanned = Object.values(stats).reduce((sum, s) => sum + s.planned, 0);
    const totalActual = Object.values(stats).reduce((sum, s) => sum + s.actual, 0);
    
    statsContainer.innerHTML = `
        <div class="p-3 bg-gray-50 rounded">
            <p class="text-sm text-gray-600">전체 계획 시간</p>
            <p class="text-xl font-bold text-indigo-600">${totalPlanned}분</p>
        </div>
        <div class="p-3 bg-gray-50 rounded">
            <p class="text-sm text-gray-600">전체 실제 시간</p>
            <p class="text-xl font-bold text-green-600">${totalActual}분</p>
        </div>
        <div class="p-3 bg-gray-50 rounded">
            <p class="text-sm text-gray-600">시간 달성률</p>
            <p class="text-xl font-bold ${totalActual >= totalPlanned ? 'text-green-600' : 'text-orange-600'}">
                ${totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : 0}%
            </p>
        </div>
    `;
    
    // 과목별 진도 표시
    const progressContainer = document.getElementById('subjectProgress');
    progressContainer.innerHTML = subjects.map(subject => {
        const stat = stats[subject];
        const color = stat.achievement >= 80 ? 'green' : stat.achievement >= 60 ? 'yellow' : 'red';
        return `
            <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span class="font-medium">${subject}</span>
                <div class="text-right">
                    <span class="text-sm text-${color}-600 font-semibold">${stat.achievement}%</span>
                    <span class="text-xs text-gray-500 ml-2">(${stat.completed}/${stat.total})</span>
                </div>
            </div>
        `;
    }).join('');
    
    return stats;
}

// 차트 업데이트
function updateCharts() {
    const subjects = ['국어', '영어', '수학', '과학', '사회'];
    const dailyData = {};
    
    // 날짜별 데이터 집계
    weeklyData.forEach(check => {
        if (!dailyData[check.date]) {
            dailyData[check.date] = { planned: 0, actual: 0 };
        }
        dailyData[check.date].planned += check.planned_time || 0;
        dailyData[check.date].actual += check.actual_time || 0;
    });
    
    const dates = Object.keys(dailyData).sort();
    const plannedData = dates.map(date => dailyData[date].planned);
    const actualData = dates.map(date => dailyData[date].actual);
    
    // 주간 학습시간 차트
    timeChart.data.labels = dates.map(d => formatDate(d));
    timeChart.data.datasets[0].data = plannedData;
    timeChart.data.datasets[1].data = actualData;
    timeChart.update();
    
    // 과목별 달성률 차트
    const subjectAchievements = subjects.map(subject => {
        const subjectData = weeklyData.filter(d => d.subject === subject);
        const totalPlanned = subjectData.reduce((sum, d) => sum + (d.planned_time || 0), 0);
        const totalActual = subjectData.reduce((sum, d) => sum + (d.actual_time || 0), 0);
        return totalPlanned > 0 ? (totalActual / totalPlanned * 100) : 0;
    });
    
    achievementChart.data.datasets[0].data = subjectAchievements;
    achievementChart.update();
}

// 달성률 계산
function calculateAchievement() {
    const totalPlanned = weeklyData.reduce((sum, d) => sum + (d.planned_time || 0), 0);
    const totalActual = weeklyData.reduce((sum, d) => sum + (d.actual_time || 0), 0);
    
    const achievement = totalPlanned > 0 ? (totalActual / totalPlanned * 100) : 0;
    document.getElementById('achievement').value = achievement.toFixed(1);
}

// 기존 피드백 확인
async function checkExistingFeedback(weekStart, weekEnd) {
    try {
        const response = await fetch('tables/weekly_feedback?limit=100');
        const data = await response.json();
        
        const existing = data.data.find(f => 
            f.student_id === currentStudent.id &&
            f.week_start === weekStart &&
            f.week_end === weekEnd
        );
        
        if (existing) {
            // 기존 피드백 데이터로 폼 채우기
            document.getElementById('koreanProgress').value = existing.korean_progress || '';
            document.getElementById('englishProgress').value = existing.english_progress || '';
            document.getElementById('mathProgress').value = existing.math_progress || '';
            document.getElementById('scienceProgress').value = existing.science_progress || '';
            document.getElementById('socialProgress').value = existing.social_progress || '';
            document.getElementById('improvementNotes').value = existing.improvement_notes || '';
            document.getElementById('teacherComment').value = existing.teacher_comment || '';
        }
        
    } catch (error) {
        console.error('기존 피드백 확인 오류:', error);
    }
}

// 폼 제출 설정
function setupForm() {
    document.getElementById('feedbackForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveFeedback();
    });
}

// 피드백 저장
async function saveFeedback() {
    try {
        const weekStart = document.getElementById('weekStart').value;
        const weekEnd = document.getElementById('weekEnd').value;
        
        const feedbackData = {
            student_id: currentStudent.id,
            week_start: weekStart,
            week_end: weekEnd,
            study_time_achievement: parseFloat(document.getElementById('achievement').value),
            korean_progress: document.getElementById('koreanProgress').value,
            english_progress: document.getElementById('englishProgress').value,
            math_progress: document.getElementById('mathProgress').value,
            science_progress: document.getElementById('scienceProgress').value,
            social_progress: document.getElementById('socialProgress').value,
            improvement_notes: document.getElementById('improvementNotes').value,
            teacher_comment: document.getElementById('teacherComment').value
        };
        
        // 기존 피드백 확인
        const checkResponse = await fetch('tables/weekly_feedback?limit=100');
        const checkData = await checkResponse.json();
        const existing = checkData.data.find(f => 
            f.student_id === currentStudent.id &&
            f.week_start === weekStart &&
            f.week_end === weekEnd
        );
        
        let response;
        if (existing) {
            // 업데이트
            response = await fetch(`tables/weekly_feedback/${existing.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(feedbackData)
            });
        } else {
            // 신규 생성
            response = await fetch('tables/weekly_feedback', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(feedbackData)
            });
        }
        
        if (response.ok) {
            alert('피드백이 저장되었습니다.');
            location.href = 'index.html';
        }
        
    } catch (error) {
        console.error('피드백 저장 오류:', error);
        alert('피드백 저장에 실패했습니다.');
    }
}

// 차트 초기화
function initCharts() {
    // 주간 학습시간 차트
    const timeCtx = document.getElementById('weeklyTimeChart').getContext('2d');
    timeChart = new Chart(timeCtx, {
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
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '시간 (분)'
                    }
                }
            }
        }
    });
    
    // 과목별 달성률 차트
    const achievementCtx = document.getElementById('subjectAchievementChart').getContext('2d');
    achievementChart = new Chart(achievementCtx, {
        type: 'radar',
        data: {
            labels: ['국어', '영어', '수학', '과학', '사회'],
            datasets: [{
                label: '달성률 (%)',
                data: [],
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                pointBackgroundColor: 'rgb(99, 102, 241)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(99, 102, 241)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 150,
                    ticks: {
                        stepSize: 30
                    }
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

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth()+1}/${date.getDate()}`;
}
