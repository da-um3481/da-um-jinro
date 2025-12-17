// 교사 대시보드 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeTeacherDashboard();
});

function initializeTeacherDashboard() {
    setupNavigation();
    setupMobileMenu();
    loadOverviewData();
}

// 네비게이션 설정
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            navigateToPage(page);
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('active');
            }
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
        'overview': { title: '전체 현황', subtitle: '우리 반 학생들의 학습 현황을 한눈에' },
        'students-list': { title: '학생 목록', subtitle: '개별 학생 정보 조회 및 관리' },
        'class-stats': { title: '학급 통계', subtitle: '다양한 지표로 분석' },
        'admission-guide': { title: '입시 지도', subtitle: '맞춤형 전략 수립' },
        'career-counsel': { title: '진로 상담', subtitle: '상담 기록 관리' },
        'records-management': { title: '학생부 관리', subtitle: '작성 현황 및 도구' }
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

// 전체 현황 데이터 로드
function loadOverviewData() {
    createGradeDistributionChart();
    loadRecentStudents();
    loadAlerts();
}

// 등급 분포 차트
function createGradeDistributionChart() {
    const ctx = document.getElementById('gradeDistributionChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1등급', '2등급', '3등급', '4등급', '5등급', '6등급', '7등급', '8등급', '9등급'],
            datasets: [{
                label: '학생 수',
                data: [3, 7, 8, 6, 4, 2, 1, 1, 0],
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#8b5cf6',
                    '#f59e0b',
                    '#ef4444',
                    '#dc2626',
                    '#991b1b',
                    '#7f1d1d',
                    '#450a0a'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// 최근 활동 학생 로드
function loadRecentStudents() {
    const container = document.getElementById('recentStudentsGrid');
    if (!container) return;
    
    const students = [
        { name: '김학생', grade: 2.3, activity: '진로 검사 완료', time: '10분 전' },
        { name: '이학생', grade: 1.8, activity: '학습 계획 수정', time: '30분 전' },
        { name: '박학생', grade: 2.7, activity: '과목 선택 완료', time: '1시간 전' },
        { name: '최학생', grade: 2.1, activity: '비교과 활동 추가', time: '2시간 전' }
    ];
    
    container.innerHTML = students.map(student => `
        <div class="student-card" onclick="viewStudentDetail('${student.name}')">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <h4 style="font-size: 1.1rem; font-weight: 700;">${student.name}</h4>
                <span style="background: ${getGradeColor(student.grade)}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">
                    ${student.grade}등급
                </span>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 8px;">
                <i class="fas fa-check-circle" style="color: #10b981;"></i> ${student.activity}
            </p>
            <p style="color: #94a3b8; font-size: 0.85rem;">
                <i class="fas fa-clock"></i> ${student.time}
            </p>
        </div>
    `).join('');
}

// 등급별 색상
function getGradeColor(grade) {
    if (grade <= 2) return '#10b981';
    if (grade <= 3) return '#3b82f6';
    if (grade <= 4) return '#8b5cf6';
    if (grade <= 5) return '#f59e0b';
    return '#ef4444';
}

// 알림 로드
function loadAlerts() {
    const container = document.getElementById('alertList');
    if (!container) return;
    
    const alerts = [
        { title: '중간고사 성적 입력 마감', date: 'D-3', icon: 'fa-exclamation-circle', color: '#ef4444' },
        { title: '학생부 세특 작성 기한', date: '2024.05.30', icon: 'fa-file-alt', color: '#f59e0b' },
        { title: '진로 상담 주간', date: '진행중', icon: 'fa-comments', color: '#3b82f6' },
        { title: '학부모 상담 예정', date: '5명', icon: 'fa-users', color: '#8b5cf6' }
    ];
    
    container.innerHTML = alerts.map(alert => `
        <div class="alert-item" style="border-left-color: ${alert.color};">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="width: 45px; height: 45px; border-radius: 12px; background: ${alert.color}20; display: flex; align-items: center; justify-content: center; color: ${alert.color};">
                        <i class="fas ${alert.icon}" style="font-size: 1.3rem;"></i>
                    </div>
                    <div>
                        <h4 style="font-weight: 600; margin-bottom: 5px;">${alert.title}</h4>
                        <p style="color: #64748b; font-size: 0.9rem;">${alert.date}</p>
                    </div>
                </div>
                <button class="btn-icon">
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 페이지별 데이터 로드
function loadPageData(pageName) {
    switch(pageName) {
        case 'students-list':
            loadStudentsList();
            break;
        case 'class-stats':
            loadClassStats();
            break;
        case 'admission-guide':
            loadAdmissionGuide();
            break;
        default:
            break;
    }
}

// 학생 데이터 저장소 (실제로는 서버 DB 사용)
let studentsData = [
    { id: 1, name: '김민준', grade: 2.3, major: '컴퓨터공학', type: '학생부종합', activities: 15, target: '서울대', credits: 192 },
    { id: 2, name: '이서윤', grade: 1.8, major: '의예과', type: '학생부교과', activities: 12, target: '연세대', credits: 198 },
    { id: 3, name: '박지훈', grade: 2.7, major: '경영학', type: '정시', activities: 8, target: '고려대', credits: 186 },
    { id: 4, name: '최서준', grade: 2.1, major: '기계공학', type: '학생부종합', activities: 18, target: '한양대', credits: 195 },
    { id: 5, name: '정하은', grade: 3.2, major: '화학공학', type: '학생부교과', activities: 10, target: '성균관대', credits: 189 },
    { id: 6, name: '강도윤', grade: 1.9, major: '전기공학', type: '학생부교과', activities: 14, target: '서울대', credits: 196 },
    { id: 7, name: '조예진', grade: 2.5, major: '경제학', type: '학생부종합', activities: 16, target: '연세대', credits: 192 },
    { id: 8, name: '윤시우', grade: 2.8, major: '건축학', type: '정시', activities: 9, target: '고려대', credits: 184 },
    { id: 9, name: '장아린', grade: 2.2, major: '생명과학', type: '학생부종합', activities: 17, target: '서울대', credits: 194 },
    { id: 10, name: '임주원', grade: 3.0, major: '심리학', type: '학생부교과', activities: 11, target: '이화여대', credits: 188 },
    { id: 11, name: '한지후', grade: 2.4, major: '수학교육', type: '학생부종합', activities: 13, target: '서울교대', credits: 191 },
    { id: 12, name: '신다은', grade: 2.0, major: '화학', type: '학생부교과', activities: 15, target: 'KAIST', credits: 197 },
    { id: 13, name: '곽우진', grade: 3.1, major: '산업공학', type: '정시', activities: 10, target: '서강대', credits: 185 },
    { id: 14, name: '송지아', grade: 2.6, major: '국제학', type: '학생부종합', activities: 19, target: '한국외대', credits: 193 },
    { id: 15, name: '백태양', grade: 2.3, major: '물리학', type: '학생부교과', activities: 14, target: '포스텍', credits: 195 },
    { id: 16, name: '오수아', grade: 2.9, major: '사회학', type: '학생부종합', activities: 12, target: '중앙대', credits: 187 },
    { id: 17, name: '권민서', grade: 1.7, major: '약학', type: '학생부교과', activities: 16, target: '서울대', credits: 199 },
    { id: 18, name: '남준혁', grade: 2.5, major: '전자공학', type: '정시', activities: 11, target: '성균관대', credits: 190 },
    { id: 19, name: '황서현', grade: 2.2, major: '생명공학', type: '학생부종합', activities: 20, target: '연세대', credits: 196 },
    { id: 20, name: '류지원', grade: 3.3, major: '교육학', type: '학생부교과', activities: 9, target: '이화여대', credits: 183 },
    { id: 21, name: '문하윤', grade: 2.7, major: '통계학', type: '학생부종합', activities: 13, target: '고려대', credits: 189 },
    { id: 22, name: '선우진', grade: 2.4, major: '항공우주', type: '학생부종합', activities: 15, target: '서울대', credits: 192 },
    { id: 23, name: '진시현', grade: 2.8, major: '언론정보', type: '정시', activities: 10, target: '중앙대', credits: 186 },
    { id: 24, name: '허도현', grade: 2.1, major: '신소재공학', type: '학생부교과', activities: 17, target: '한양대', credits: 194 },
    { id: 25, name: '노채원', grade: 2.6, major: '영문학', type: '학생부종합', activities: 14, target: '서울대', credits: 191 },
    { id: 26, name: '추준서', grade: 3.0, major: '지리학', type: '정시', activities: 8, target: '서울시립대', credits: 184 },
    { id: 27, name: '탁은서', grade: 2.3, major: '간호학', type: '학생부교과', activities: 16, target: '연세대', credits: 195 },
    { id: 28, name: '유하준', grade: 2.9, major: '행정학', type: '학생부종합', activities: 11, target: '고려대', credits: 188 },
    { id: 29, name: '편수빈', grade: 2.5, major: '화학생명공학', type: '학생부종합', activities: 18, target: '서울대', credits: 193 },
    { id: 30, name: '변재윤', grade: 2.2, major: '데이터사이언스', type: '학생부교과', activities: 19, target: '고려대', credits: 196 },
    { id: 31, name: '원지우', grade: 3.1, major: '디자인', type: '정시', activities: 12, target: '홍익대', credits: 185 },
    { id: 32, name: '표민준', grade: 2.4, major: '환경공학', type: '학생부종합', activities: 15, target: '서울대', credits: 192 }
];

// 학생 목록 로드
async function loadStudentsList() {
    const tableContainer = document.getElementById('studentsTable');
    if (!tableContainer) return;
    
    try {
        const students = studentsData;
        
        renderStudentsTable(students);
    } catch (error) {
        console.error('Error loading students:', error);
        const tableContainer = document.getElementById('studentsTable');
        if (tableContainer) {
            tableContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #64748b;">학생 목록을 불러오는 중 오류가 발생했습니다.</p>';
        }
    }
}

// 학급 통계 로드
function loadClassStats() {
    createMajorDistributionChart();
    createAdmissionTypeChart();
    createGradeTrendChart();
    createActivityStatsChart();
}

// 전공 계열 분포 차트
function createMajorDistributionChart() {
    const ctx = document.getElementById('majorDistributionChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['공학계열', '자연계열', '인문계열', '사회계열', '예체능', '의약계열'],
            datasets: [{
                data: [12, 8, 5, 4, 2, 1],
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#8b5cf6',
                    '#ec4899',
                    '#06b6d4'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// 입시 전형 유형 차트
function createAdmissionTypeChart() {
    const ctx = document.getElementById('admissionTypeChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['학생부종합', '학생부교과', '정시(수능)'],
            datasets: [{
                data: [15, 10, 7],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// 성적 추이 차트
function createGradeTrendChart() {
    const ctx = document.getElementById('gradeTrendChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1-1', '1-2', '2-1', '2-2'],
            datasets: [{
                label: '학급 평균',
                data: [2.8, 2.7, 2.6, 2.5],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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

// 비교과 활동 통계 차트
function createActivityStatsChart() {
    const ctx = document.getElementById('activityStatsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['동아리', '봉사', '수상', '독서', '세특', '기타'],
            datasets: [{
                label: '평균 활동 수',
                data: [3.5, 2.8, 1.5, 4.2, 6.0, 2.0],
                backgroundColor: '#3b82f6',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 입시 지도 데이터 로드
function loadAdmissionGuide() {
    loadTrackStudents();
}

// 전형별 학생 로드
function loadTrackStudents() {
    const gyogwaContainer = document.getElementById('gyogwaStudents');
    const jonghapContainer = document.getElementById('jonghapStudents');
    const jeongsiContainer = document.getElementById('jeongsiStudents');
    
    if (gyogwaContainer) {
        const gyogwaStudents = ['김학생', '이학생', '박학생', '최학생', '정학생'];
        gyogwaContainer.innerHTML = gyogwaStudents.map(name => 
            `<span class="student-chip" onclick="viewStudentDetail('${name}')">${name}</span>`
        ).join('');
    }
    
    if (jonghapContainer) {
        const jonghapStudents = ['강학생', '조학생', '윤학생', '장학생', '임학생', '한학생'];
        jonghapContainer.innerHTML = jonghapStudents.map(name => 
            `<span class="student-chip" onclick="viewStudentDetail('${name}')">${name}</span>`
        ).join('');
    }
    
    if (jeongsiContainer) {
        const jeongsiStudents = ['송학생', '오학생', '서학생', '신학생'];
        jeongsiContainer.innerHTML = jeongsiStudents.map(name => 
            `<span class="student-chip" onclick="viewStudentDetail('${name}')">${name}</span>`
        ).join('');
    }
}

// 학생 상세 보기
function viewStudentDetail(name) {
    alert(`${name} 학생의 상세 정보를 조회합니다.\n(개별 학생 페이지로 이동)`);
    // 실제로는 학생 상세 페이지로 이동
}

// 학생 수정
function editStudent(id) {
    const student = studentsData.find(s => s.id === parseInt(id));
    if (!student) return;
    
    document.getElementById('modalTitle').textContent = '학생 정보 수정';
    document.getElementById('studentId').value = student.id;
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentGrade').value = student.grade;
    document.getElementById('studentMajor').value = student.major;
    document.getElementById('studentTarget').value = student.target;
    document.getElementById('studentType').value = student.type;
    document.getElementById('studentCredits').value = student.credits;
    document.getElementById('studentActivities').value = student.activities;
    
    document.getElementById('studentModal').style.display = 'flex';
}

// 학생 삭제
function deleteStudent(id) {
    if (!confirm('정말 이 학생을 삭제하시겠습니까?')) return;
    
    studentsData = studentsData.filter(s => s.id !== parseInt(id));
    loadStudentsList();
    alert('학생이 삭제되었습니다.');
}

// 학생 추가 모달 표시
function showAddStudentModal() {
    document.getElementById('modalTitle').textContent = '학생 추가';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('studentModal').style.display = 'flex';
}

// 모달 닫기
function closeStudentModal() {
    document.getElementById('studentModal').style.display = 'none';
    document.getElementById('studentForm').reset();
}

// 학생 저장
function saveStudent(event) {
    event.preventDefault();
    
    const id = document.getElementById('studentId').value;
    const studentData = {
        id: id ? parseInt(id) : studentsData.length > 0 ? Math.max(...studentsData.map(s => s.id)) + 1 : 1,
        name: document.getElementById('studentName').value,
        grade: parseFloat(document.getElementById('studentGrade').value),
        major: document.getElementById('studentMajor').value,
        target: document.getElementById('studentTarget').value,
        type: document.getElementById('studentType').value,
        credits: parseInt(document.getElementById('studentCredits').value) || 0,
        activities: parseInt(document.getElementById('studentActivities').value) || 0
    };
    
    if (id) {
        // 수정
        const index = studentsData.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            studentsData[index] = studentData;
        }
    } else {
        // 추가
        studentsData.push(studentData);
    }
    
    closeStudentModal();
    loadStudentsList();
    alert(id ? '학생 정보가 수정되었습니다.' : '학생이 추가되었습니다.');
}

// 학생 검색
function searchStudent() {
    const searchValue = document.getElementById('studentSearch').value.toLowerCase();
    if (!searchValue) {
        loadStudentsList();
        return;
    }
    
    const filtered = studentsData.filter(s => 
        s.name.toLowerCase().includes(searchValue) ||
        s.id.toString().includes(searchValue) ||
        s.major.toLowerCase().includes(searchValue)
    );
    
    renderStudentsTable(filtered);
}

// 학생 필터링
function filterStudents() {
    const filterValue = document.getElementById('gradeFilter').value;
    if (!filterValue) {
        loadStudentsList();
        return;
    }
    
    let filtered = studentsData;
    if (filterValue === '1') {
        filtered = studentsData.filter(s => s.grade <= 2);
    } else if (filterValue === '2') {
        filtered = studentsData.filter(s => s.grade > 2 && s.grade <= 3);
    } else if (filterValue === '3') {
        filtered = studentsData.filter(s => s.grade > 3 && s.grade <= 4);
    } else if (filterValue === '4') {
        filtered = studentsData.filter(s => s.grade > 4);
    }
    
    renderStudentsTable(filtered);
}

// 학생 테이블 렌더링 함수
function renderStudentsTable(students) {
    const tableContainer = document.getElementById('studentsTable');
    if (!tableContainer) return;
    
    tableContainer.innerHTML = `
        <thead>
            <tr>
                <th>번호</th>
                <th>이름</th>
                <th>내신 평균</th>
                <th>희망 전공</th>
                <th>목표 대학</th>
                <th>전형 유형</th>
                <th>학점</th>
                <th>비교과</th>
                <th>관리</th>
            </tr>
        </thead>
        <tbody>
            ${students.map((student, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${student.name}</strong></td>
                    <td>
                        <span style="background: ${getGradeColor(student.grade)}; color: white; padding: 4px 12px; border-radius: 12px; font-weight: 600;">
                            ${student.grade}등급
                        </span>
                    </td>
                    <td>${student.major}</td>
                    <td>${student.target}</td>
                    <td>${student.type}</td>
                    <td>${student.credits}학점</td>
                    <td>${student.activities}건</td>
                    <td>
                        <button class="btn-icon" onclick="viewStudentDetail('${student.name}')" title="상세보기">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editStudent(${student.id})" title="수정">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="deleteStudent(${student.id})" title="삭제" style="color: #ef4444;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

// 데이터 내보내기 (CSV)
function exportData() {
    if (studentsData.length === 0) {
        alert('내보낼 데이터가 없습니다.');
        return;
    }
    
    // CSV 헤더
    let csv = '번호,이름,내신평균,희망전공,목표대학,전형유형,이수학점,비교과활동\n';
    
    // CSV 데이터
    studentsData.forEach((student, index) => {
        csv += `${index + 1},${student.name},${student.grade},${student.major},${student.target},${student.type},${student.credits},${student.activities}\n`;
    });
    
    // 다운로드
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `학생목록_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('학생 목록이 CSV 파일로 다운로드되었습니다.');
}

// 알림 표시
function showNotifications() {
    alert('알림 기능 구현 예정');
}

// 로그아웃
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.clear();
        window.location.href = 'intro.html';
    }
}
