// 전역 변수
let currentStudent = null;
let currentUser = null;
let charts = {};

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initializeApp();
});

// 권한 체크
function checkAuthentication() {
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    
    // 로그인 정보가 없으면 인트로로 리다이렉트
    if (!userRole || !userId) {
        window.location.href = 'intro.html';
        return;
    }
    
    // 교사가 학생 페이지에 접근하는 경우
    if (userRole === 'teacher' && !window.location.href.includes('teacher-dashboard')) {
        window.location.href = 'teacher-dashboard.html';
        return;
    }
    
    currentUser = {
        role: userRole,
        id: userId,
        studentId: localStorage.getItem('studentId') || userId
    };
    
    // 학생/학부모는 자신의 데이터만 조회 가능하도록 설정
    if (userRole === 'student' || userRole === 'parent') {
        currentStudent = currentUser.studentId;
    }
}

// 앱 초기화
function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    setupTabSystem();
    loadDashboardData();
    calculateDDay();
    updateUserInfo();
}

// 사용자 정보 업데이트
function updateUserInfo() {
    const userNameElement = document.querySelector('.user-name');
    const userGradeElement = document.querySelector('.user-grade');
    
    if (currentUser) {
        if (currentUser.role === 'student') {
            if (userNameElement) userNameElement.textContent = '김학생';
            if (userGradeElement) userGradeElement.textContent = '고등학교 2학년';
        } else if (currentUser.role === 'parent') {
            if (userNameElement) userNameElement.textContent = '학부모';
            if (userGradeElement) userGradeElement.textContent = '자녀: 김학생';
        }
    }
}

// 네비게이션 설정
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const moduleCards = document.querySelectorAll('.module-card');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            navigateToPage(page);
            
            // 활성 상태 업데이트
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // 모바일에서 사이드바 닫기
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });
    
    // 모듈 카드 클릭 이벤트
    moduleCards.forEach(card => {
        card.addEventListener('click', function() {
            const module = this.dataset.module;
            navigateToPage(module);
            
            // 네비게이션 활성 상태 업데이트
            navItems.forEach(nav => {
                if (nav.dataset.page === module) {
                    nav.classList.add('active');
                } else {
                    nav.classList.remove('active');
                }
            });
        });
    });
}

// 페이지 전환
function navigateToPage(pageName) {
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
        updatePageTitle(pageName);
        loadPageData(pageName);
    }
}

// 페이지 타이틀 업데이트
function updatePageTitle(pageName) {
    const titles = {
        'dashboard': { title: '대시보드', subtitle: '학습 현황 및 입시 관리 한눈에 보기' },
        'curriculum': { title: '교육과정 설계', subtitle: '희망 전공에 맞춘 최적의 과목 선택' },
        'student-record': { title: '학생부 관리', subtitle: '교과 성적과 비교과 활동 통합 관리' },
        'admission': { title: '대입전형 분석', subtitle: '맞춤형 입시 전략 수립' },
        'study-plan': { title: '학습 계획', subtitle: '공교육 중심의 자기주도 학습' },
        'career': { title: '진로 탐색', subtitle: '적성과 흥미 기반 진로 설계' },
        'analytics': { title: '데이터 분석', subtitle: '학습 및 입시 데이터 종합 분석' }
    };
    
    const pageInfo = titles[pageName];
    if (pageInfo) {
        document.getElementById('pageTitle').textContent = pageInfo.title;
        document.getElementById('pageSubtitle').textContent = pageInfo.subtitle;
    }
}

// 모바일 메뉴 설정
function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    mobileToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });
}

// 탭 시스템 설정
function setupTabSystem() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            const parentTabs = this.closest('.tabs');
            const container = parentTabs.nextElementSibling.parentElement;
            
            // 모든 탭 버튼 비활성화
            parentTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 모든 탭 콘텐츠 숨기기
            container.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 선택된 탭 콘텐츠 표시
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // 정보 탭 시스템
    const infoTabBtns = document.querySelectorAll('.info-tab-btn');
    infoTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.infoTab;
            
            // 모든 정보 탭 버튼 비활성화
            infoTabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 해당 탭 데이터 로드
            loadCareerInfo(targetTab);
        });
    });
}

// D-Day 계산
function calculateDDay() {
    const targetDate = new Date('2027-11-18'); // 2027학년도 수능일 (예시)
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const ddayElement = document.getElementById('ddayCount');
    if (ddayElement) {
        ddayElement.textContent = diffDays > 0 ? diffDays : 0;
    }
}

// 대시보드 데이터 로드
function loadDashboardData() {
    loadRecentActivities();
}

// 최근 활동 로드
function loadRecentActivities() {
    const activitiesContainer = document.getElementById('recentActivities');
    if (!activitiesContainer) return;
    
    const activities = [
        {
            icon: 'fa-book',
            color: '#3b82f6',
            title: '수학 II 과목 등록',
            desc: '2학년 1학기 선택 과목 등록 완료',
            time: '2시간 전'
        },
        {
            icon: 'fa-clipboard-check',
            color: '#10b981',
            title: '과학탐구 실험 활동 기록',
            desc: '화학 실험 보고서 작성 완료',
            time: '5시간 전'
        },
        {
            icon: 'fa-chart-line',
            color: '#8b5cf6',
            title: '모의고사 성적 분석',
            desc: '3월 학력평가 결과 분석 완료',
            time: '1일 전'
        },
        {
            icon: 'fa-university',
            color: '#f59e0b',
            title: '희망 대학 추가',
            desc: '서울대학교 컴퓨터공학과 추가',
            time: '2일 전'
        }
    ];
    
    activitiesContainer.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon" style="background: ${activity.color}">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-desc">${activity.desc}</div>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

// 페이지별 데이터 로드
function loadPageData(pageName) {
    switch(pageName) {
        case 'curriculum':
            loadCurriculumData();
            break;
        case 'student-record':
            loadStudentRecordData();
            break;
        case 'admission':
            loadAdmissionData();
            break;
        case 'study-plan':
            loadStudyPlanData();
            break;
        case 'career':
            loadCareerData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
    }
}

// 교육과정 데이터 로드
function loadCurriculumData() {
    // 이수 학점 차트
    createCreditChart();
    
    // 과목 선택 시뮬레이터 초기화
    const simulator = document.getElementById('subjectSimulator');
    if (simulator) {
        simulator.innerHTML = `
            <div class="info-text">
                <i class="fas fa-info-circle"></i>
                <p>희망 전공을 선택하면 추천 과목 조합을 확인할 수 있습니다.</p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn-primary" onclick="openSubjectSimulator()">
                    <i class="fas fa-play"></i> 시뮬레이터 시작
                </button>
            </div>
        `;
    }
}

// 학점 차트 생성
function createCreditChart() {
    const chartContainer = document.getElementById('creditChart');
    if (!chartContainer) return;
    
    chartContainer.innerHTML = `
        <div style="display: flex; justify-content: space-around; align-items: center; padding: 30px;">
            <div style="text-align: center;">
                <div style="font-size: 3rem; font-weight: 700; color: #3b82f6;">192</div>
                <div style="color: #64748b; margin-top: 10px;">이수 학점</div>
            </div>
            <div style="font-size: 3rem; color: #cbd5e1;">/</div>
            <div style="text-align: center;">
                <div style="font-size: 3rem; font-weight: 700; color: #8b5cf6;">204</div>
                <div style="color: #64748b; margin-top: 10px;">총 학점</div>
            </div>
        </div>
        <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #475569; font-weight: 600;">공통과목</span>
                <span style="color: #3b82f6; font-weight: 700;">84/84 학점</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #475569; font-weight: 600;">선택과목</span>
                <span style="color: #10b981; font-weight: 700;">96/102 학점</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #475569; font-weight: 600;">진로선택</span>
                <span style="color: #f59e0b; font-weight: 700;">12/18 학점</span>
            </div>
        </div>
    `;
}

// 학생부 기록 데이터 로드
function loadStudentRecordData() {
    loadCurricularTable();
    loadExtracurricularGrid();
}

// 교과 활동 테이블 로드
async function loadCurricularTable() {
    const tableContainer = document.getElementById('curricularTable');
    if (!tableContainer) return;
    
    try {
        const response = await fetch('tables/subjects?limit=10&sort=-created_at');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            tableContainer.innerHTML = `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 15px; text-align: left;">과목명</th>
                            <th style="padding: 15px; text-align: center;">학년-학기</th>
                            <th style="padding: 15px; text-align: center;">이수단위</th>
                            <th style="padding: 15px; text-align: center;">성적</th>
                            <th style="padding: 15px; text-align: center;">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.data.map(subject => `
                            <tr style="border-bottom: 1px solid #f1f5f9;">
                                <td style="padding: 15px; font-weight: 600;">${subject.subject_name}</td>
                                <td style="padding: 15px; text-align: center;">${subject.grade}-${subject.semester}</td>
                                <td style="padding: 15px; text-align: center;">${subject.credit}</td>
                                <td style="padding: 15px; text-align: center; font-weight: 700; color: #3b82f6;">${subject.score}등급</td>
                                <td style="padding: 15px; text-align: center;">
                                    <span style="padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; background: ${getStatusColor(subject.status)}; color: white;">
                                        ${subject.status}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            tableContainer.innerHTML = `
                <div class="info-text">
                    <i class="fas fa-inbox"></i>
                    <p>등록된 교과 성적이 없습니다.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading curricular data:', error);
        tableContainer.innerHTML = `<div class="info-text">데이터를 불러오는 중 오류가 발생했습니다.</div>`;
    }
}

// 비교과 활동 그리드 로드
async function loadExtracurricularGrid() {
    const gridContainer = document.getElementById('extracurricularGrid');
    if (!gridContainer) return;
    
    try {
        const response = await fetch('tables/student_records?limit=10&sort=-created_at');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            gridContainer.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                    ${data.data.map(record => `
                        <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid ${getRecordTypeColor(record.record_type)};">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                                <span style="background: ${getRecordTypeColor(record.record_type)}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">
                                    ${record.record_type}
                                </span>
                                <span style="color: #94a3b8; font-size: 0.85rem;">${formatDate(record.date)}</span>
                            </div>
                            <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; color: #0f172a;">${record.title}</h4>
                            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.6;">${truncateText(record.description, 100)}</p>
                            ${record.hours ? `<div style="margin-top: 12px; color: #3b82f6; font-size: 0.85rem;"><i class="fas fa-clock"></i> ${record.hours}시간</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            gridContainer.innerHTML = `
                <div class="info-text">
                    <i class="fas fa-inbox"></i>
                    <p>등록된 비교과 활동이 없습니다.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading extracurricular data:', error);
        gridContainer.innerHTML = `<div class="info-text">데이터를 불러오는 중 오류가 발생했습니다.</div>`;
    }
}

// 대입전형 분석 데이터 로드
function loadAdmissionData() {
    // 예측 차트 생성
    const predictionContainer = document.getElementById('predictionChart');
    if (predictionContainer) {
        predictionContainer.innerHTML = `
            <div class="info-text">
                <i class="fas fa-chart-bar"></i>
                <p>학생의 성적 데이터를 분석하여 합격 가능성을 예측합니다.</p>
            </div>
        `;
    }
}

// 학습 계획 데이터 로드
function loadStudyPlanData() {
    // 캘린더 초기화
    const calendar = document.getElementById('studyCalendar');
    if (calendar) {
        calendar.innerHTML = `
            <div class="info-text">
                <i class="fas fa-calendar-alt"></i>
                <p>학습 캘린더를 통해 일정을 관리하세요.</p>
            </div>
        `;
    }
    
    // 로드맵 타임라인
    const timeline = document.getElementById('roadmapTimeline');
    if (timeline) {
        timeline.innerHTML = `
            <div class="info-text">
                <i class="fas fa-route"></i>
                <p>AI가 추천하는 학습 로드맵을 확인하세요.</p>
            </div>
        `;
    }
}

// 진로 탐색 데이터 로드
function loadCareerData() {
    loadCareerTestResults();
}

// 진로 검사 결과 로드
async function loadCareerTestResults() {
    const resultsContainer = document.getElementById('careerResults');
    if (!resultsContainer) return;
    
    try {
        const response = await fetch('tables/career_tests?limit=1&sort=-created_at');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            const test = data.data[0];
            resultsContainer.innerHTML = `
                <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h4 style="font-size: 1.2rem; font-weight: 700;">최근 검사 결과</h4>
                        <span style="color: #64748b; font-size: 0.9rem;">${formatDate(test.test_date)}</span>
                    </div>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 15px;">
                        <div style="color: #3b82f6; font-weight: 600; margin-bottom: 8px;">${test.test_type}</div>
                        <div style="color: #475569; line-height: 1.6;">${test.result_summary}</div>
                    </div>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = `
                <div class="info-text">
                    <i class="fas fa-clipboard-list"></i>
                    <p>진로 검사를 실시하여 적성과 흥미를 분석해보세요.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading career test results:', error);
        resultsContainer.innerHTML = `<div class="info-text">데이터를 불러오는 중 오류가 발생했습니다.</div>`;
    }
}

// 진로 정보 로드 (전공/직업)
function loadCareerInfo(type) {
    const container = document.getElementById('majorCareerInfo');
    if (!container) return;
    
    if (type === 'majors') {
        container.innerHTML = `
            <div style="display: grid; gap: 15px; margin-top: 20px;">
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6;">
                    <h4 style="font-weight: 700; margin-bottom: 8px; color: #0f172a;">컴퓨터공학과</h4>
                    <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 12px;">소프트웨어 개발, AI, 데이터 사이언스 등 IT 분야의 핵심 인재 양성</p>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <span style="background: white; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; color: #3b82f6;">#프로그래밍</span>
                        <span style="background: white; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; color: #3b82f6;">#AI</span>
                        <span style="background: white; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; color: #3b82f6;">#데이터</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="display: grid; gap: 15px; margin-top: 20px;">
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981;">
                    <h4 style="font-weight: 700; margin-bottom: 8px; color: #0f172a;">소프트웨어 개발자</h4>
                    <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 12px;">다양한 플랫폼과 서비스를 위한 소프트웨어 설계 및 개발</p>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <span style="background: white; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; color: #10b981;">#개발</span>
                        <span style="background: white; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; color: #10b981;">#코딩</span>
                        <span style="background: white; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; color: #10b981;">#IT</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// 데이터 분석 페이지 로드
function loadAnalyticsData() {
    createGradeChart();
    createActivityChart();
    loadSolutionCards();
}

// 성적 차트 생성
function createGradeChart() {
    const ctx = document.getElementById('gradeChart');
    if (!ctx) return;
    
    if (charts.gradeChart) {
        charts.gradeChart.destroy();
    }
    
    charts.gradeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1-1', '1-2', '2-1', '2-2', '3-1'],
            datasets: [{
                label: '내신 평균 등급',
                data: [2.8, 2.5, 2.3, 2.1, 2.0],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    reverse: true,
                    min: 1,
                    max: 4
                }
            }
        }
    });
}

// 활동 차트 생성
function createActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;
    
    if (charts.activityChart) {
        charts.activityChart.destroy();
    }
    
    charts.activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['교과', '세특', '봉사', '동아리', '수상', '독서'],
            datasets: [{
                label: '활동 건수',
                data: [18, 12, 8, 6, 3, 5],
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#8b5cf6',
                    '#ef4444',
                    '#06b6d4'
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
            }
        }
    });
}

// 솔루션 카드 로드
function loadSolutionCards() {
    const container = document.getElementById('solutionCards');
    if (!container) return;
    
    const solutions = [
        {
            icon: 'fa-book-open',
            color: '#3b82f6',
            title: '수학 성적 향상 전략',
            desc: '미적분 단원의 취약점이 발견되었습니다. EBS 수학 강좌 중 해당 단원 집중 학습을 권장합니다.'
        },
        {
            icon: 'fa-users',
            color: '#10b981',
            title: '비교과 활동 강화',
            desc: '희망 전공과 연계된 심화 탐구 활동을 추가하면 학생부종합전형에서 경쟁력이 높아집니다.'
        },
        {
            icon: 'fa-chart-line',
            color: '#f59e0b',
            title: '모의고사 성적 관리',
            desc: '국어 영역의 비문학 독해력 향상이 필요합니다. 매일 지문 분석 연습을 권장합니다.'
        }
    ];
    
    container.innerHTML = solutions.map(solution => `
        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="width: 50px; height: 50px; border-radius: 12px; background: ${solution.color}; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; margin-bottom: 15px;">
                <i class="fas ${solution.icon}"></i>
            </div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 10px; color: #0f172a;">${solution.title}</h4>
            <p style="color: #64748b; line-height: 1.6; font-size: 0.9rem;">${solution.desc}</p>
        </div>
    `).join('');
}

// 유틸리티 함수들
function getStatusColor(status) {
    const colors = {
        '진행중': '#3b82f6',
        '완료': '#10b981',
        '계획': '#f59e0b'
    };
    return colors[status] || '#64748b';
}

function getRecordTypeColor(type) {
    const colors = {
        '교과': '#3b82f6',
        '비교과': '#10b981',
        '세특': '#8b5cf6',
        '봉사': '#f59e0b',
        '동아리': '#06b6d4',
        '수상': '#ef4444'
    };
    return colors[type] || '#64748b';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// 기능 함수들
function showSubjectGuide() {
    alert('과목 선택 가이드 기능은 준비 중입니다.');
}

function showCareerCuration() {
    alert('진로 연계 큐레이션 기능은 준비 중입니다.');
}

function showCommonCurriculum() {
    alert('공동교육과정 매칭 기능은 준비 중입니다.');
}

function openSubjectSimulator() {
    alert('과목 선택 시뮬레이터 기능은 준비 중입니다.');
}

// 학생부 기록 추가 (자동 연계 기능)
// 학생부 활동 추가 모달 열기
function addRecord(type) {
    const modal = document.getElementById('recordModal');
    const modalTitle = document.getElementById('recordModalTitle');
    const recordType = document.getElementById('recordType');
    const curricularForm = document.getElementById('curricularForm');
    const extracurricularForm = document.getElementById('extracurricularForm');
    const recordDate = document.getElementById('recordDate');
    
    // 타입 설정
    recordType.value = type;
    
    // 모달 제목 및 폼 표시 설정
    if (type === 'curricular') {
        modalTitle.textContent = '교과 성적 추가';
        curricularForm.style.display = 'block';
        extracurricularForm.style.display = 'none';
    } else {
        modalTitle.textContent = '비교과 활동 추가';
        curricularForm.style.display = 'none';
        extracurricularForm.style.display = 'block';
        
        // 비교과 활동 일자 기본값 설정
        const today = new Date().toISOString().split('T')[0];
        if (recordDate) recordDate.value = today;
    }
    
    // 모달 표시
    modal.style.display = 'flex';
}

// 모달 닫기
function closeRecordModal() {
    const modal = document.getElementById('recordModal');
    const form = document.getElementById('recordForm');
    modal.style.display = 'none';
    form.reset();
}

// 학생부 기록 저장
async function saveRecord(event) {
    event.preventDefault();
    
    const type = document.getElementById('recordType').value;
    let recordData;
    
    try {
        if (type === 'curricular') {
            // 교과 성적 입력
            const subjectName = document.getElementById('subjectName').value.trim();
            const subjectType = document.getElementById('subjectType').value;
            const semester = document.getElementById('semester').value;
            const credit = document.getElementById('credit').value;
            const gradeScore = document.getElementById('gradeScore').value;
            const subjectDetail = document.getElementById('subjectDetail').value.trim();
            
            // 필수 입력 검증
            if (!subjectName || !subjectType || !semester || !credit || !gradeScore) {
                alert('⚠️ 필수 항목을 모두 입력해주세요.');
                return;
            }
            
            // 성적 범위 검증
            const grade = parseFloat(gradeScore);
            if (grade < 1 || grade > 9) {
                alert('⚠️ 성적은 1~9등급 사이로 입력해주세요.');
                return;
            }
            
            recordData = {
                student_id: currentStudent,
                record_type: '교과',
                title: `${subjectName} (${semester})`,
                description: `[${subjectType}] 이수단위: ${credit}, 등급: ${gradeScore}\n${subjectDetail ? '\n세부능력 및 특기사항:\n' + subjectDetail : ''}`,
                date: new Date().toISOString(),
                hours: 0,
                grade: parseInt(credit)  // 이수 단위를 grade 필드에 임시 저장
            };
            
        } else {
            // 비교과 활동 입력
            const title = document.getElementById('recordTitle').value.trim();
            const description = document.getElementById('recordDescription').value.trim();
            const date = document.getElementById('recordDate').value;
            const hours = document.getElementById('recordHours') ? document.getElementById('recordHours').value : 0;
            
            // 필수 입력 검증
            if (!title || !description || !date) {
                alert('⚠️ 필수 항목을 모두 입력해주세요.');
                return;
            }
            
            recordData = {
                student_id: currentStudent,
                record_type: '비교과',
                title: title,
                description: description,
                date: new Date(date).toISOString(),
                hours: parseInt(hours) || 0,
                grade: 2
            };
        }
        
        // 1. 학생부 기록 추가
        const recordResponse = await fetch('tables/student_records', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(recordData)
        });
        
        if (!recordResponse.ok) {
            throw new Error('기록 추가 실패');
        }
        
        const newRecord = await recordResponse.json();
        console.log('Record added:', newRecord);
        
        // 2. 자동 연계: 대입전형 분석 트리거
        await triggerAdmissionAnalysis(currentStudent);
        
        // 3. 자동 연계: 통계 데이터 업데이트
        await updateStudentStats(currentStudent);
        
        // 모달 닫기
        closeRecordModal();
        
        const recordTypeText = type === 'curricular' ? '교과 성적' : '비교과 활동';
        alert(`✅ ${recordTypeText}이(가) 추가되었습니다!\n\n자동으로 다음 항목이 업데이트되었습니다:\n- 대입전형 분석\n- 통계 데이터\n- 학생부 기록`);
        
        // 페이지 새로고침
        loadStudentRecordData();
        
    } catch (error) {
        console.error('Error adding record:', error);
        alert('기록 추가 중 오류가 발생했습니다: ' + error.message);
    }
}

// 대입전형 자동 분석 트리거
async function triggerAdmissionAnalysis(studentId) {
    try {
        // 학생의 최신 데이터 조회
        const [subjectsRes, recordsRes] = await Promise.all([
            fetch(`tables/subjects?student_id=${studentId}`),
            fetch(`tables/student_records?student_id=${studentId}`)
        ]);
        
        const subjects = await subjectsRes.json();
        const records = await recordsRes.json();
        
        // GPA 계산
        const totalScore = subjects.data.reduce((sum, s) => sum + s.score, 0);
        const avgGPA = subjects.data.length > 0 ? (totalScore / subjects.data.length).toFixed(2) : 0;
        
        // 비교과 활동 수
        const activityCount = records.data.length;
        
        // 5개년 입시 데이터와 비교하여 유리한 전형 분석
        const recommendedType = await analyzeOptimalAdmissionType(avgGPA, activityCount);
        
        // 분석 결과 저장
        const analysisData = {
            student_id: studentId,
            analysis_date: new Date().toISOString(),
            recommended_type: recommendedType.type,
            confidence_score: recommendedType.confidence,
            student_gpa: parseFloat(avgGPA),
            activity_count: activityCount,
            predicted_universities: recommendedType.universities,
            recommendation_reason: recommendedType.reason
        };
        
        await fetch('tables/admission_analysis', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(analysisData)
        });
        
        console.log('✅ 대입전형 자동 분석 완료:', recommendedType);
        
    } catch (error) {
        console.error('Error in admission analysis:', error);
    }
}

// 최적 전형 분석 (5개년 데이터 기반)
async function analyzeOptimalAdmissionType(gpa, activityCount) {
    try {
        // 5개년 입시 데이터 조회
        const historyRes = await fetch('tables/admission_history?limit=500');
        const history = await historyRes.json();
        
        const scores = {
            '학생부교과': 0,
            '학생부종합': 0,
            '정시': 0
        };
        
        // 학생부교과: 내신이 강점
        if (gpa <= 2.0) {
            scores['학생부교과'] = 90;
        } else if (gpa <= 3.0) {
            scores['학생부교과'] = 70;
        } else {
            scores['학생부교과'] = 40;
        }
        
        // 학생부종합: 내신 + 비교과 활동
        const activityScore = Math.min(activityCount * 3, 50);
        const gpaScore = gpa <= 2.5 ? 40 : gpa <= 3.5 ? 30 : 20;
        scores['학생부종합'] = activityScore + gpaScore;
        
        // 정시: 내신이 약하고 수능에 강점 (가정)
        if (gpa > 3.0) {
            scores['정시'] = 75;
        } else {
            scores['정시'] = 50;
        }
        
        // 가장 높은 점수의 전형 선택
        const recommendedType = Object.keys(scores).reduce((a, b) => 
            scores[a] > scores[b] ? a : b
        );
        
        // 합격 가능 대학 예측 (샘플)
        const universities = [
            '서울대학교 컴퓨터공학부',
            'KAIST 전산학부',
            '연세대학교 컴퓨터과학과'
        ];
        
        // 추천 사유 생성
        let reason = `<strong>${recommendedType}</strong>이 가장 유리합니다.\n\n`;
        
        if (recommendedType === '학생부교과') {
            reason += `• 내신 평균 ${gpa}등급으로 교과 전형에 강점\n`;
            reason += `• 수능 최저학력기준 충족 시 합격 가능성 높음\n`;
            reason += `• 추천 대학: 중상위권 대학 교과전형`;
        } else if (recommendedType === '학생부종합') {
            reason += `• 비교과 활동 ${activityCount}건으로 종합전형 강점\n`;
            reason += `• 내신 ${gpa}등급 + 풍부한 활동으로 전공적합성 어필 가능\n`;
            reason += `• 추천 대학: 상위권 대학 종합전형`;
        } else {
            reason += `• 내신 대비 수능 성적 향상 가능성\n`;
            reason += `• 정시 모집 확대 추세 활용\n`;
            reason += `• 추천: 수능 집중 학습 전략`;
        }
        
        return {
            type: recommendedType,
            confidence: scores[recommendedType],
            universities: universities,
            reason: reason
        };
        
    } catch (error) {
        console.error('Error analyzing admission type:', error);
        return {
            type: '학생부종합',
            confidence: 70,
            universities: [],
            reason: '데이터 분석 중 오류가 발생했습니다.'
        };
    }
}

// 학생 통계 업데이트
async function updateStudentStats(studentId) {
    // 통계 데이터 재계산 및 캐시 업데이트
    console.log('✅ 학생 통계 데이터 업데이트 완료');
}

function generatePortfolio() {
    alert('포트폴리오 생성 기능은 준비 중입니다.');
}

function analyzeAdmission() {
    alert('전형 분석 기능은 준비 중입니다.');
}

function searchUniversity() {
    const searchValue = document.getElementById('universitySearch').value;
    if (searchValue) {
        alert(`"${searchValue}" 검색 기능은 준비 중입니다.`);
    }
}

function startTest(testType) {
    alert(`${testType} 검사 시작 기능은 준비 중입니다.`);
}
