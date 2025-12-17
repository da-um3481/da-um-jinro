// 학교 선택 페이지 스크립트

let schools = [];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadSchools();
    
    // 폼 제출 이벤트
    document.getElementById('addSchoolForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addSchool();
    });
});

// 학교 목록 로드
async function loadSchools() {
    try {
        const response = await fetch('tables/schools?limit=100');
        const data = await response.json();
        
        schools = data.data || [];
        displaySchools();
        
    } catch (error) {
        console.error('학교 목록 로드 오류:', error);
    }
}

// 학교 목록 표시
function displaySchools() {
    const grid = document.getElementById('schoolsGrid');
    const empty = document.getElementById('emptySchools');
    
    if (schools.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    empty.style.display = 'none';
    
    grid.innerHTML = schools.map(school => `
        <div class="glass-effect rounded-2xl shadow-xl p-6 school-card" onclick="selectSchool('${school.id}')">
            <!-- 학교 아이콘 -->
            <div class="w-16 h-16 bg-gradient-to-br ${getSchoolGradient(school.school_type)} rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <i class="fas ${school.school_type === '중학교' ? 'fa-school' : 'fa-graduation-cap'} text-white text-3xl"></i>
            </div>
            
            <!-- 학교 정보 -->
            <h3 class="text-xl font-bold text-gray-800 mb-2">${school.school_name}</h3>
            
            <div class="space-y-2 text-sm text-gray-600 mb-4">
                <div class="flex items-center">
                    <i class="fas fa-map-marker-alt w-5 text-purple-600"></i>
                    <span>${school.location}</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-user-tie w-5 text-indigo-600"></i>
                    <span>${school.contact_teacher || '담당자 미정'}</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-calendar w-5 text-blue-600"></i>
                    <span>${school.start_date ? formatDate(school.start_date) : '일정 미정'}</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-users w-5 text-green-600"></i>
                    <span>${school.student_count || 0}명</span>
                </div>
            </div>
            
            <!-- 상태 배지 -->
            <div class="flex items-center justify-between">
                ${school.active !== false ? `
                    <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <i class="fas fa-check-circle mr-1"></i>운영중
                    </span>
                ` : `
                    <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        <i class="fas fa-pause-circle mr-1"></i>중단
                    </span>
                `}
                
                <button onclick="editSchool('${school.id}'); event.stopPropagation();" 
                    class="text-gray-500 hover:text-purple-600 transition">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 학교 선택
function selectSchool(schoolId) {
    // 선택한 학교 ID를 로컬 스토리지에 저장
    localStorage.setItem('selected_school_id', schoolId);
    
    const school = schools.find(s => s.id === schoolId);
    
    // 성공 메시지 표시
    showSuccessMessage(`${school.school_name}를 선택했습니다!`);
    
    // 대시보드로 이동
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// 학교 추가 모달 열기
function showAddSchoolModal() {
    document.getElementById('addSchoolModal').classList.remove('hidden');
    
    // 오늘 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
}

// 학교 추가 모달 닫기
function closeAddSchoolModal() {
    document.getElementById('addSchoolModal').classList.add('hidden');
    document.getElementById('addSchoolForm').reset();
}

// 학교 추가
async function addSchool() {
    const schoolName = document.getElementById('schoolName').value.trim();
    const schoolType = document.getElementById('schoolType').value;
    const location = document.getElementById('location').value.trim();
    const contactTeacher = document.getElementById('contactTeacher').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const startDate = document.getElementById('startDate').value;
    
    if (!schoolName || !schoolType || !location || !startDate) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }
    
    try {
        const schoolData = {
            school_name: schoolName,
            school_type: schoolType,
            location: location,
            contact_teacher: contactTeacher,
            phone: phone,
            start_date: startDate,
            student_count: 0,
            active: true
        };
        
        const response = await fetch('tables/schools', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(schoolData)
        });
        
        if (response.ok) {
            showSuccessMessage('✅ 학교가 성공적으로 등록되었습니다!');
            closeAddSchoolModal();
            await loadSchools();
        }
    } catch (error) {
        console.error('학교 추가 오류:', error);
        alert('학교 등록에 실패했습니다.');
    }
}

// 학교 편집
function editSchool(schoolId) {
    // TODO: 편집 기능 구현
    alert('편집 기능은 곧 추가될 예정입니다.');
}

// 유틸리티 함수들
function getSchoolGradient(type) {
    return type === '중학교' 
        ? 'from-blue-500 to-cyan-600' 
        : 'from-purple-500 to-pink-600';
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
    messageDiv.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-check-circle text-xl"></i>
            <span class="font-semibold">${message}</span>
        </div>
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}
