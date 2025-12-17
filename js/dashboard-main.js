// DA.UM 학습관리 시스템 - 메인 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('DA.UM 학습관리 시스템 시작');
    
    // 현재 날짜 업데이트
    updateCurrentDate();
    
    // 사이드바 네비게이션 설정
    setupNavigation();
    
    // 사이드바 토글 설정
    setupSidebarToggle();
    
    // 초기 대시보드 데이터 로드
    loadDashboardData();
});

// 현재 날짜 업데이트
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        const koreanDate = now.toLocaleDateString('ko-KR', options);
        dateElement.textContent = koreanDate;
    }
}

// 네비게이션 설정
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            
            // 모든 네비게이션 아이템에서 active 제거
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // 클릭된 아이템에 active 추가
            this.classList.add('active');
            
            // 모든 페이지 숨기기
            pages.forEach(page => page.classList.remove('active'));
            
            // 선택된 페이지 표시
            const targetPageElement = document.getElementById(targetPage + '-page');
            if (targetPageElement) {
                targetPageElement.classList.add('active');
                
                // 페이지별 데이터 로드
                loadPageData(targetPage);
            }
        });
    });
}

// 사이드바 토글
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// 대시보드 데이터 로드
function loadDashboardData() {
    console.log('대시보드 데이터 로드 중...');
    
    // LocalStorage에서 학생 데이터 가져오기
    const students = getStudentsFromStorage();
    
    // 통계 업데이트
    updateDashboardStats(students);
    
    // 차트 업데이트
    updateDashboardCharts(students);
    
    // 학생 테이블 업데이트
    updateStudentTable(students);
}

// 페이지별 데이터 로드
function loadPageData(pageName) {
    console.log('페이지 데이터 로드:', pageName);
    
    switch(pageName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'students':
            loadStudentsPage();
            break;
        case 'weekly-goals':
            loadWeeklyGoalsPage();
            break;
        case 'study-log':
            loadStudyLogPage();
            break;
        case 'semester-grades':
            loadSemesterGradesPage();
            break;
        case 'mock-exams':
            loadMockExamsPage();
            break;
        case 'analysis':
            loadAnalysisPage();
            break;
        case 'personalized-roadmap':
            loadPersonalizedRoadmapPage();
            break;
        case 'middle-school-roadmap':
            loadMiddleSchoolRoadmapPage();
            break;
        default:
            console.log('알 수 없는 페이지:', pageName);
    }
}

// LocalStorage에서 학생 데이터 가져오기
function getStudentsFromStorage() {
    const studentsData = localStorage.getItem('da_um_students');
    return studentsData ? JSON.parse(studentsData) : [];
}

// LocalStorage에 학생 데이터 저장
function saveStudentsToStorage(students) {
    localStorage.setItem('da_um_students', JSON.stringify(students));
}

// 대시보드 통계 업데이트
function updateDashboardStats(students) {
    // 총 학생 수
    const totalStudentsElement = document.getElementById('totalStudents');
    if (totalStudentsElement) {
        totalStudentsElement.textContent = students.length;
    }
    
    // 주간 달성률 (샘플 데이터)
    const weeklyAchievementElement = document.getElementById('weeklyAchievement');
    if (weeklyAchievementElement) {
        const achievement = students.length > 0 ? Math.floor(Math.random() * 30 + 70) : 0;
        weeklyAchievementElement.textContent = achievement + '%';
    }
    
    // 일일 목표 (샘플 데이터)
    const dailyGoalsElement = document.getElementById('dailyGoals');
    if (dailyGoalsElement) {
        const completed = Math.floor(students.length * 0.6);
        dailyGoalsElement.textContent = `${completed}/${students.length}`;
    }
    
    // 피드백 대기 (샘플 데이터)
    const pendingFeedbackElement = document.getElementById('pendingFeedback');
    if (pendingFeedbackElement) {
        const pending = Math.floor(students.length * 0.2);
        pendingFeedbackElement.textContent = pending;
    }
}

// 대시보드 차트 업데이트
function updateDashboardCharts(students) {
    // Chart.js를 사용하여 차트 생성
    // 주간 학습시간 차트
    createWeeklyStudyChart();
    
    // 과목별 평균 차트
    createSubjectAverageChart();
}

// 주간 학습시간 차트
function createWeeklyStudyChart() {
    const ctx = document.getElementById('weeklyStudyChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['월', '화', '수', '목', '금', '토', '일'],
                datasets: [{
                    label: '학습시간 (시간)',
                    data: [3, 4, 3.5, 5, 4.5, 6, 5],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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
}

// 과목별 평균 차트
function createSubjectAverageChart() {
    const ctx = document.getElementById('subjectAverageChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['국어', '영어', '수학', '과학', '사회'],
                datasets: [{
                    label: '평균 점수',
                    data: [85, 78, 92, 88, 81],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(79, 172, 254, 0.8)',
                        'rgba(67, 233, 123, 0.8)',
                        'rgba(250, 112, 154, 0.8)',
                        'rgba(48, 207, 208, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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
    }
}

// 학생 테이블 업데이트
function updateStudentTable(students) {
    const tableBody = document.getElementById('studentTableBody');
    if (!tableBody) return;
    
    if (students.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="padding: 40px;">
                    <div class="empty-state">
                        <i class="fas fa-user-graduate"></i>
                        <h3>등록된 학생이 없습니다</h3>
                        <p>빠른 학생 등록으로 첫 학생을 추가해보세요</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = students.map((student, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${student.name || '이름 없음'}</strong></td>
            <td>${student.grade || '-'}학년</td>
            <td>${student.school || '-'}</td>
            <td>
                <span class="status-badge ${student.status || 'active'}">
                    ${student.status === 'active' ? '활동중' : student.status === 'inactive' ? '비활동' : '대기중'}
                </span>
            </td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="viewStudent(${index})">
                    <i class="fas fa-eye"></i> 보기
                </button>
            </td>
        </tr>
    `).join('');
}

// 빠른 학생 등록
function quickRegisterStudent(formData) {
    const students = getStudentsFromStorage();
    
    const newStudent = {
        id: Date.now(),
        name: formData.name,
        grade: formData.grade,
        school: formData.school,
        phone: formData.phone,
        status: 'active',
        registeredAt: new Date().toISOString()
    };
    
    students.push(newStudent);
    saveStudentsToStorage(students);
    
    // 대시보드 새로고침
    loadDashboardData();
    
    showAlert('학생이 성공적으로 등록되었습니다!', 'success');
}

// 알림 표시
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        // 알림 컨테이너가 없으면 생성
        const container = document.createElement('div');
        container.id = 'alertContainer';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '10000';
        document.body.appendChild(container);
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.marginBottom = '10px';
    alert.style.minWidth = '300px';
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    const container = document.getElementById('alertContainer');
    container.appendChild(alert);
    
    setTimeout(() => {
        alert.style.transition = 'opacity 0.3s';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// 페이지 로드 함수들 (플레이스홀더)
function loadStudentsPage() {
    console.log('학생 관리 페이지 로드');
    // 추후 구현
}

function loadWeeklyGoalsPage() {
    console.log('주간 학습목표 페이지 로드');
    // 추후 구현
}

function loadStudyLogPage() {
    console.log('학습 이력 페이지 로드');
    // 추후 구현
}

function loadSemesterGradesPage() {
    console.log('학기별 성적 페이지 로드');
    // 추후 구현
}

function loadMockExamsPage() {
    console.log('모의고사 페이지 로드');
    // 추후 구현
}

function loadAnalysisPage() {
    console.log('성적 분석 페이지 로드');
    // 추후 구현
}

function loadPersonalizedRoadmapPage() {
    console.log('맞춤형 학습 로드맵 (고등) 페이지 로드');
    // 추후 구현
}

function loadMiddleSchoolRoadmapPage() {
    console.log('맞춤형 학습 로드맵 (중학) 페이지 로드');
    // 추후 구현
}

function viewStudent(index) {
    const students = getStudentsFromStorage();
    const student = students[index];
    alert(`학생 정보:\n이름: ${student.name}\n학년: ${student.grade}\n학교: ${student.school}`);
}

// 전역 함수로 내보내기
window.quickRegisterStudent = quickRegisterStudent;
window.viewStudent = viewStudent;
window.showAlert = showAlert;
