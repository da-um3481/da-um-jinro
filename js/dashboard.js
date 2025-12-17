// 대시보드 관리 스크립트

let weeklyChart = null;
let subjectChart = null;
let selectedSchoolId = null;
let allSchools = [];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadSchools();
    loadDashboardData();
    initCharts();
    
    // 30초마다 자동 새로고침
    setInterval(() => {
        loadDashboardData();
    }, 30000); // 30초
});

// 대시보드 데이터 로드
async function loadDashboardData() {
    try {
        // 학생 데이터 로드
        const studentsResponse = await fetch('tables/students?limit=100');
        const studentsData = await studentsResponse.json();
        let students = studentsData.data;
        
        // 학교별 필터링
        if (selectedSchoolId) {
            students = students.filter(s => s.school_id === selectedSchoolId);
        }
        
        // 통계 업데이트
        document.getElementById('totalStudents').textContent = students.length;
        
        // 오늘의 학습 목표 달성 현황 로드
        await loadTodayGoalStatus(students);
        
        // 학생 테이블 업데이트
        await updateStudentTable(students);
        
        // 주간 피드백 데이터 로드
        await loadWeeklyFeedbackData(students);
        
        // 차트 데이터 로드
        await loadChartData(students);
        
    } catch (error) {
        console.error('대시보드 데이터 로드 오류:', error);
    }
}

// 오늘의 학습 목표 달성 현황
async function loadTodayGoalStatus(students) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const checksResponse = await fetch('tables/daily_checks?limit=1000');
        const checksData = await checksResponse.json();
        
        // 오늘의 모든 체크 항목 필터링
        const todayChecks = checksData.data.filter(c => c.date === today);
        const todayCompleted = todayChecks.filter(c => c.completed);
        
        // 전체 목표 / 완료 수 표시
        const totalGoal = todayChecks.length;
        const completed = todayCompleted.length;
        
        document.getElementById('todayGoal').textContent = `${completed}/${totalGoal}`;
        
        // 전체 학습 시간 합계 (완료된 항목만)
        const totalStudyTime = todayCompleted.reduce((sum, c) => sum + (c.actual_time || 0), 0);
        const totalStudyHours = (totalStudyTime / 60).toFixed(1);
        
    } catch (error) {
        console.error('오늘의 목표 로드 오류:', error);
    }
}

// 학생 테이블 업데이트
async function updateStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    
    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    등록된 학생이 없습니다. <a href="students.html" class="text-indigo-600 hover:underline">학생을 추가</a>해주세요.
                </td>
            </tr>
        `;
        return;
    }
    
    // 오늘의 학생별 학습 현황 데이터 먼저 로드
    const today = new Date().toISOString().split('T')[0];
    const checksResponse = await fetch('tables/daily_checks?limit=1000');
    const checksData = await checksResponse.json();
    
    tbody.innerHTML = students.map(student => {
        const avgScore = calculateAverageScore(student);
        const levelBadge = getLevelBadge(student.level);
        
        // 오늘의 학생 학습 현황 계산
        const studentTodayChecks = checksData.data.filter(c => 
            c.student_id === student.id && c.date === today
        );
        const completedChecks = studentTodayChecks.filter(c => c.completed);
        const todayProgress = studentTodayChecks.length > 0 
            ? ((completedChecks.length / studentTodayChecks.length) * 100).toFixed(0)
            : 0;
        const todayStudyTime = completedChecks.reduce((sum, c) => sum + (c.actual_time || 0), 0);
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium text-gray-900">${student.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                    ${student.grade}학년 ${student.class_num}반 ${student.student_num}번
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${levelBadge}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">
                    ${avgScore.toFixed(1)}점
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                        <div class="text-sm font-semibold ${getTodayProgressColor(todayProgress)}">
                            ${todayProgress}% (${completedChecks.length}/${studentTodayChecks.length})
                        </div>
                        <div class="text-xs text-gray-500">
                            ${todayStudyTime}분 학습
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="achievement-badge" id="achievement-${student.id}">로딩중...</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <a href="student-portal.html?id=${student.id}" class="text-indigo-600 hover:text-indigo-900 mr-3" target="_blank">
                        <i class="fas fa-clipboard-check"></i> 포털
                    </a>
                    <a href="feedback.html?id=${student.id}" class="text-green-600 hover:text-green-900">
                        <i class="fas fa-comment"></i> 피드백
                    </a>
                </td>
            </tr>
        `;
    }).join('');
    
    // 각 학생의 주간 달성률 로드
    students.forEach(student => {
        loadStudentWeeklyAchievement(student.id);
    });
}

// 학생별 주간 달성률 로드
async function loadStudentWeeklyAchievement(studentId) {
    try {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // 이번 주 일요일
        
        const feedbackResponse = await fetch(`tables/weekly_feedback?limit=100`);
        const feedbackData = await feedbackResponse.json();
        
        const studentFeedback = feedbackData.data.find(f => 
            f.student_id === studentId && 
            new Date(f.week_start) >= weekStart
        );
        
        const achievementElement = document.getElementById(`achievement-${studentId}`);
        if (achievementElement) {
            if (studentFeedback) {
                const achievement = studentFeedback.study_time_achievement || 0;
                achievementElement.innerHTML = getAchievementBadge(achievement);
            } else {
                achievementElement.innerHTML = '<span class="text-gray-400">데이터 없음</span>';
            }
        }
    } catch (error) {
        console.error('주간 달성률 로드 오류:', error);
    }
}

// 주간 피드백 데이터 로드
async function loadWeeklyFeedbackData(students) {
    try {
        const feedbackResponse = await fetch('tables/weekly_feedback?limit=100');
        const feedbackData = await feedbackResponse.json();
        
        // 이번 주 피드백 필터링
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        
        const thisWeekFeedback = feedbackData.data.filter(f => 
            new Date(f.week_start) >= weekStart
        );
        
        // 평균 달성률 계산
        if (thisWeekFeedback.length > 0) {
            const avgAchievement = thisWeekFeedback.reduce((sum, f) => 
                sum + (f.study_time_achievement || 0), 0
            ) / thisWeekFeedback.length;
            document.getElementById('avgAchievement').textContent = avgAchievement.toFixed(1) + '%';
        }
        
        // 피드백 대기 수 계산
        const pendingCount = students.length - thisWeekFeedback.length;
        document.getElementById('pendingFeedback').textContent = pendingCount;
        
    } catch (error) {
        console.error('주간 피드백 데이터 로드 오류:', error);
    }
}

// 차트 데이터 로드
async function loadChartData(students) {
    try {
        // 최근 4주간의 평균 달성률 데이터
        const feedbackResponse = await fetch('tables/weekly_feedback?limit=100');
        const feedbackData = await feedbackResponse.json();
        
        const weeklyData = processWeeklyData(feedbackData.data);
        updateWeeklyChart(weeklyData);
        
        // 과목별 학습시간 데이터
        const dailyResponse = await fetch('tables/daily_checks?limit=1000');
        const dailyData = await dailyResponse.json();
        
        const subjectData = processSubjectData(dailyData.data);
        updateSubjectChart(subjectData);
        
    } catch (error) {
        console.error('차트 데이터 로드 오류:', error);
    }
}

// 주간 데이터 처리
function processWeeklyData(feedbackList) {
    const weeks = {};
    
    feedbackList.forEach(feedback => {
        const weekKey = feedback.week_start;
        if (!weeks[weekKey]) {
            weeks[weekKey] = {
                achievements: [],
                weekStart: weekKey
            };
        }
        weeks[weekKey].achievements.push(feedback.study_time_achievement || 0);
    });
    
    const sortedWeeks = Object.values(weeks)
        .sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart))
        .slice(-4); // 최근 4주
    
    return sortedWeeks.map(week => ({
        week: formatWeekLabel(week.weekStart),
        achievement: week.achievements.reduce((a, b) => a + b, 0) / week.achievements.length
    }));
}

// 과목별 데이터 처리
function processSubjectData(dailyChecks) {
    const subjects = {
        '국어': 0,
        '영어': 0,
        '수학': 0,
        '과학': 0,
        '사회': 0
    };
    const counts = {
        '국어': 0,
        '영어': 0,
        '수학': 0,
        '과학': 0,
        '사회': 0
    };
    
    dailyChecks.forEach(check => {
        if (check.actual_time && subjects.hasOwnProperty(check.subject)) {
            subjects[check.subject] += check.actual_time;
            counts[check.subject]++;
        }
    });
    
    return Object.keys(subjects).map(subject => ({
        subject: subject,
        avgTime: counts[subject] > 0 ? subjects[subject] / counts[subject] : 0
    }));
}

// 차트 초기화
function initCharts() {
    // 주간 달성률 차트
    const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
    weeklyChart = new Chart(weeklyCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '평균 달성률 (%)',
                data: [],
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }]
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
                    max: 100
                }
            }
        }
    });
    
    // 과목별 학습시간 차트
    const subjectCtx = document.getElementById('subjectChart').getContext('2d');
    subjectChart = new Chart(subjectCtx, {
        type: 'bar',
        data: {
            labels: ['국어', '영어', '수학', '과학', '사회'],
            datasets: [{
                label: '평균 학습시간 (분)',
                data: [],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(251, 146, 60, 0.8)'
                ]
            }]
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
                    beginAtZero: true
                }
            }
        }
    });
}

// 주간 차트 업데이트
function updateWeeklyChart(data) {
    if (weeklyChart && data.length > 0) {
        weeklyChart.data.labels = data.map(d => d.week);
        weeklyChart.data.datasets[0].data = data.map(d => d.achievement);
        weeklyChart.update();
    }
}

// 과목별 차트 업데이트
function updateSubjectChart(data) {
    if (subjectChart && data.length > 0) {
        subjectChart.data.datasets[0].data = data.map(d => d.avgTime);
        subjectChart.update();
    }
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

function getLevelBadge(level) {
    const badges = {
        '기초': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border-2 border-green-300">🟢 기초</span>',
        '중하': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border-2 border-blue-300">🔵 중하</span>',
        '중상': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 border-2 border-yellow-300">🟡 중상</span>',
        '상급': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border-2 border-red-300">🔴 상급</span>',
        // 기존 3단계 호환성
        '상': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border-2 border-red-300">🔴 상급</span>',
        '중': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 border-2 border-yellow-300">🟡 중상</span>',
        '하': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border-2 border-blue-300">🔵 중하</span>'
    };
    return badges[level] || '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">미정</span>';
}

function getAchievementBadge(achievement) {
    if (achievement >= 90) {
        return `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">${achievement.toFixed(1)}% 🌟</span>`;
    } else if (achievement >= 70) {
        return `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">${achievement.toFixed(1)}% 👍</span>`;
    } else if (achievement >= 50) {
        return `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">${achievement.toFixed(1)}% 💪</span>`;
    } else {
        return `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">${achievement.toFixed(1)}% ⚠️</span>`;
    }
}

function formatWeekLabel(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}주`;
}

function getTodayProgressColor(progress) {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-blue-600';
    if (progress >= 30) return 'text-yellow-600';
    if (progress > 0) return 'text-orange-600';
    return 'text-gray-400';
}

// 학교 목록 로드
async function loadSchools() {
    try {
        const response = await fetch('tables/schools?limit=100');
        const data = await response.json();
        
        allSchools = data.data || [];
        
        // 학교 선택 드롭다운 채우기
        const select = document.getElementById('schoolFilter');
        if (select) {
            select.innerHTML = '<option value="">전체 학교</option>';
            allSchools.forEach(school => {
                if (school.active !== false) {
                    const option = document.createElement('option');
                    option.value = school.id;
                    option.textContent = school.school_name;
                    select.appendChild(option);
                }
            });
            
            // 저장된 학교 선택 복원
            const savedSchoolId = localStorage.getItem('selected_school_id');
            if (savedSchoolId && allSchools.find(s => s.id === savedSchoolId)) {
                select.value = savedSchoolId;
                selectedSchoolId = savedSchoolId;
            }
        }
        
    } catch (error) {
        console.error('학교 목록 로드 오류:', error);
    }
}

// 학교별 필터링
function filterBySchool() {
    const select = document.getElementById('schoolFilter');
    selectedSchoolId = select.value || null;
    
    // 선택 저장
    if (selectedSchoolId) {
        localStorage.setItem('selected_school_id', selectedSchoolId);
    } else {
        localStorage.removeItem('selected_school_id');
    }
    
    // 대시보드 새로고침
    loadDashboardData();
}

// ========================================
// 빠른 학생 등록 기능 (NEW!)
// ========================================

// 페이지 로드 시 빠른 등록 폼 이벤트 설정
document.addEventListener('DOMContentLoaded', function() {
    const quickForm = document.getElementById('quickStudentForm');
    if (quickForm) {
        quickForm.addEventListener('submit', handleQuickStudentSubmit);
        
        // 점수 입력 시 자동 수준 판정
        const scoreInputs = ['quickKorean', 'quickEnglish', 'quickMath', 'quickScience', 'quickSocial'];
        scoreInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', autoCalculateLevelQuick);
            }
        });
    }
});

// 빠른 등록 폼 제출
async function handleQuickStudentSubmit(e) {
    e.preventDefault();
    
    try {
        // 자동 수준 판정
        autoCalculateLevelQuick();
        
        const level = document.getElementById('quickLevel').value;
        if (!level) {
            alert('⚠️ 학습 수준을 판정하기 위해 최소 1개 과목의 EBS AI 진단평가 점수를 입력해주세요.');
            return;
        }
        
        const studentData = {
            name: document.getElementById('quickName').value.trim(),
            grade: parseInt(document.getElementById('quickGrade').value),
            class_num: parseInt(document.getElementById('quickClass').value),
            student_num: parseInt(document.getElementById('quickNumber').value),
            korean_score: parseFloat(document.getElementById('quickKorean').value) || 0,
            english_score: parseFloat(document.getElementById('quickEnglish').value) || 0,
            math_score: parseFloat(document.getElementById('quickMath').value) || 0,
            science_score: parseFloat(document.getElementById('quickScience').value) || 0,
            social_score: parseFloat(document.getElementById('quickSocial').value) || 0,
            level: level,
            status: '활동중',
            school_id: selectedSchoolId || null
        };
        
        // 총점 계산
        studentData.total_score = studentData.korean_score + studentData.english_score + 
                                   studentData.math_score + studentData.science_score + 
                                   studentData.social_score;
        
        // 학생 등록
        const response = await fetch('tables/students', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(studentData)
        });
        
        if (response.ok) {
            const newStudent = await response.json();
            
            // 성공 메시지
            showSuccessMessage(`✅ ${studentData.name} 학생이 성공적으로 등록되었습니다!`);
            
            // 폼 초기화
            document.getElementById('quickStudentForm').reset();
            document.getElementById('quickLevel').value = '';
            document.getElementById('quickLevel').disabled = true;
            document.getElementById('quickLevel').style.backgroundColor = '';
            
            // 대시보드 새로고침
            setTimeout(() => {
                loadDashboardData();
            }, 1000);
            
            // 수준별 교재 자동 추천
            await recommendMaterialsQuick(newStudent.id, studentData.level);
        } else {
            throw new Error('학생 등록 실패');
        }
        
    } catch (error) {
        console.error('빠른 등록 오류:', error);
        alert('❌ 학생 등록에 실패했습니다. 다시 시도해주세요.');
    }
}

// 자동 수준 계산 (빠른 등록용)
function autoCalculateLevelQuick() {
    const korean = parseFloat(document.getElementById('quickKorean').value) || 0;
    const english = parseFloat(document.getElementById('quickEnglish').value) || 0;
    const math = parseFloat(document.getElementById('quickMath').value) || 0;
    const science = parseFloat(document.getElementById('quickScience').value) || 0;
    const social = parseFloat(document.getElementById('quickSocial').value) || 0;
    
    const scores = [korean, english, math, science, social].filter(s => s > 0);
    
    if (scores.length === 0) {
        document.getElementById('quickLevel').value = '';
        document.getElementById('quickLevel').disabled = true;
        document.getElementById('quickLevel').style.backgroundColor = '';
        return;
    }
    
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    let level = '';
    
    // EBS AI 코스웨어 진단평가 점수 기반 수준 판정
    if (avgScore >= 85) {
        level = '상급'; // 85-100점
    } else if (avgScore >= 70) {
        level = '중상'; // 70-84점
    } else if (avgScore >= 50) {
        level = '중하'; // 50-69점
    } else {
        level = '기초'; // 0-49점
    }
    
    const levelSelect = document.getElementById('quickLevel');
    levelSelect.value = level;
    levelSelect.disabled = false;
    
    // 시각적 피드백
    const colors = {
        '기초': '#dcfce7', // Green-100
        '중하': '#dbeafe', // Blue-100
        '중상': '#fef3c7', // Yellow-100
        '상급': '#fee2e2'  // Red-100
    };
    levelSelect.style.backgroundColor = colors[level] || '#f3f4f6';
    levelSelect.style.fontWeight = 'bold';
}

// 수준별 교재 자동 추천 (빠른 등록용)
async function recommendMaterialsQuick(studentId, level) {
    try {
        const response = await fetch('tables/materials?limit=100');
        const data = await response.json();
        
        const recommendedMaterials = data.data.filter(m => m.level === level);
        
        // 각 과목별로 1개씩 추천
        const subjects = ['국어', '영어', '수학', '과학', '사회'];
        
        for (const subject of subjects) {
            const materialForSubject = recommendedMaterials.find(m => m.subject === subject);
            if (materialForSubject) {
                await fetch('tables/student_materials', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        student_id: studentId,
                        material_id: materialForSubject.id,
                        assigned_date: new Date().toISOString().split('T')[0],
                        status: '진행중',
                        progress: 0
                    })
                });
            }
        }
        
    } catch (error) {
        console.error('교재 추천 오류:', error);
    }
}

// 성공 메시지 표시
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-20 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-bounce';
    messageDiv.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas fa-check-circle text-2xl"></i>
            <span class="font-bold">${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.5s';
        setTimeout(() => messageDiv.remove(), 500);
    }, 3000);
}
