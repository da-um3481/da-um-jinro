// 학생 관리 스크립트

let currentEditId = null;
let deleteStudentId = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadSchools();
    loadStudents();
    setupFormHandler();
});

// 학교 목록 로드
async function loadSchools() {
    try {
        // localStorage에서 학교 데이터 로드
        const schools = JSON.parse(localStorage.getItem('schools') || '[]');
        
        // 기본 학교 데이터가 없으면 생성
        if (schools.length === 0) {
            const defaultSchools = [
                {
                    id: 'school_1',
                    school_name: '근화여자중학교',
                    school_type: 'middle_school',
                    contract_status: 'active',
                    main_program: 'winter_30days',
                    student_count: 30,
                    monthly_fee: 1500000,
                    contact_name: '담당선생님',
                    contact_phone: '010-1234-5678',
                    contract_start_date: '2025-01-05',
                    contract_end_date: '2025-02-04',
                    memo: '겨울방학 30일 프로그램',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'school_2',
                    school_name: 'DA.UM 진로진학컨설팅',
                    school_type: 'learning_center',
                    contract_status: 'active',
                    main_program: 'custom',
                    student_count: 0,
                    monthly_fee: 0,
                    contact_name: '김은숙',
                    contact_phone: '010-9876-5432',
                    memo: '통합 학습 관리 시스템',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ];
            localStorage.setItem('schools', JSON.stringify(defaultSchools));
            schools.push(...defaultSchools);
        }

        // 등록 폼용
        const schoolSelect = document.getElementById('schoolId');
        schoolSelect.innerHTML = '<option value="">선택하세요</option>';
        
        // 필터용
        const filterSelect = document.getElementById('filterSchool');
        filterSelect.innerHTML = '<option value="">전체 학교</option>';

        schools.forEach(school => {
            const typeEmoji = {
                'middle_school': '🏫',
                'high_school': '🎓',
                'individual': '👤',
                'learning_center': '📖'
            };
            
            const emoji = typeEmoji[school.school_type] || '📚';
            
            // 등록 폼
            const option1 = document.createElement('option');
            option1.value = school.id;
            option1.textContent = `${emoji} ${school.school_name}`;
            schoolSelect.appendChild(option1);
            
            // 필터
            const option2 = document.createElement('option');
            option2.value = school.id;
            option2.textContent = `${emoji} ${school.school_name}`;
            filterSelect.appendChild(option2);
        });
    } catch (error) {
        console.error('학교 목록 로드 오류:', error);
        alert('학교 목록 로드 실패: ' + error.message);
    }
}

let allStudents = []; // 전체 학생 데이터 저장

// 필터 적용
function applyFilters() {
    const schoolFilter = document.getElementById('filterSchool').value;
    const programFilter = document.getElementById('filterProgram').value;
    const typeFilter = document.getElementById('filterStudentType').value;

    let filtered = allStudents;

    if (schoolFilter) {
        filtered = filtered.filter(s => s.school_id === schoolFilter);
    }
    if (programFilter) {
        filtered = filtered.filter(s => s.program_type === programFilter);
    }
    if (typeFilter) {
        filtered = filtered.filter(s => s.student_type === typeFilter);
    }

    document.getElementById('filteredStudents').textContent = filtered.length;
    displayStudents(filtered);
}

// 폼 이벤트 핸들러 설정
function setupFormHandler() {
    document.getElementById('studentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveStudent();
    });
    
    // 과목별 수준 선택 시 자동 종합 수준 판정
    const levelSelects = ['koreanLevel', 'englishLevel', 'mathLevel', 'scienceLevel', 'socialLevel'];
    levelSelects.forEach(selectId => {
        document.getElementById(selectId).addEventListener('change', autoCalculateOverallLevel);
    });
}

// 과목별 수준 기반 자동 종합 수준 판정
function autoCalculateOverallLevel() {
    const koreanLevel = document.getElementById('koreanLevel').value;
    const englishLevel = document.getElementById('englishLevel').value;
    const mathLevel = document.getElementById('mathLevel').value;
    const scienceLevel = document.getElementById('scienceLevel').value;
    const socialLevel = document.getElementById('socialLevel').value;
    
    const levels = [koreanLevel, englishLevel, mathLevel, scienceLevel, socialLevel].filter(l => l !== '');
    
    if (levels.length === 0) {
        document.getElementById('level').value = '';
        document.getElementById('level').selectedIndex = 0;
        return;
    }
    
    // 수준을 숫자로 변환 (상=4, 중상=3, 중하=2, 기초=1)
    const levelToNumber = {
        '상': 4,
        '중상': 3,
        '중하': 2,
        '기초': 1
    };
    
    const numberToLevel = {
        4: '상',
        3: '중상',
        2: '중하',
        1: '기초'
    };
    
    const levelNumbers = levels.map(l => levelToNumber[l]);
    const avgLevel = Math.round(levelNumbers.reduce((a, b) => a + b, 0) / levelNumbers.length);
    
    const overallLevel = numberToLevel[avgLevel] || '기초';
    const levelSelect = document.getElementById('level');
    
    levelSelect.value = overallLevel;
    levelSelect.disabled = false;
    
    // 시각적 피드백 (배경색 변경)
    levelSelect.style.backgroundColor = getLevelColor(overallLevel);
    levelSelect.style.fontWeight = 'bold';
}

// 수준별 색상 반환
function getLevelColor(level) {
    const colors = {
        '기초': '#dcfce7', // Green-100
        '중하': '#dbeafe', // Blue-100
        '중상': '#fef3c7', // Yellow-100
        '상': '#fee2e2'  // Red-100
    };
    return colors[level] || '#f3f4f6';
}

// 학생 목록 로드
async function loadStudents() {
    try {
        // localStorage에서 학생 데이터 로드
        allStudents = JSON.parse(localStorage.getItem('students') || '[]');
        document.getElementById('totalStudents').textContent = allStudents.length;
        document.getElementById('filteredStudents').textContent = allStudents.length;
        displayStudents(allStudents);
    } catch (error) {
        console.error('학생 목록 로드 오류:', error);
        alert('학생 목록을 불러오는데 실패했습니다: ' + error.message);
    }
}

// 학생 목록 표시
function displayStudents(students) {
    const tbody = document.getElementById('studentList');
    
    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="px-6 py-4 text-center text-gray-500">
                    등록된 학생이 없습니다.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = students.map(student => {
        const levelBadge = getLevelBadge(student.level);
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${student.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                    ${student.grade}학년 ${student.class_num}반 ${student.student_num}번
                </td>
                <td class="px-6 py-4 whitespace-nowrap">${levelBadge}</td>
                <td class="px-6 py-4 whitespace-nowrap">${getLevelIcon(student.korean_level)}</td>
                <td class="px-6 py-4 whitespace-nowrap">${getLevelIcon(student.english_level)}</td>
                <td class="px-6 py-4 whitespace-nowrap">${getLevelIcon(student.math_level)}</td>
                <td class="px-6 py-4 whitespace-nowrap">${getLevelIcon(student.science_level)}</td>
                <td class="px-6 py-4 whitespace-nowrap">${getLevelIcon(student.social_level)}</td>
                <td class="px-6 py-4 whitespace-nowrap font-semibold">-</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button onclick="viewStudentDetail('${student.id}')" class="text-indigo-600 hover:text-indigo-900" title="상세보기">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editStudent('${student.id}')" class="text-green-600 hover:text-green-900" title="수정">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="showDeleteModal('${student.id}')" class="text-red-600 hover:text-red-900" title="삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="createStudyPlan('${student.id}')" class="text-blue-600 hover:text-blue-900" title="학습계획">
                        <i class="fas fa-calendar-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 수준 아이콘 반환
function getLevelIcon(level) {
    const icons = {
        '상': '🔴 상',
        '중상': '🟡 중상',
        '중하': '🔵 중하',
        '기초': '🟢 기초'
    };
    return icons[level] || '-';
}

// 학생 저장
async function saveStudent() {
    try {
        // 수준이 비어있으면 자동 계산
        autoCalculateOverallLevel();
        
        const levelValue = document.getElementById('level').value;
        if (!levelValue) {
            alert('과목별 학습 수준을 선택해주세요.');
            return;
        }
        
        const grade = parseInt(document.getElementById('grade').value);
        const studentData = {
            name: document.getElementById('name').value,
            grade: grade,
            class_num: parseInt(document.getElementById('classNum').value),
            student_num: parseInt(document.getElementById('studentNum').value),
            korean_level: document.getElementById('koreanLevel').value || '',
            english_level: document.getElementById('englishLevel').value || '',
            math_level: document.getElementById('mathLevel').value || '',
            science_level: document.getElementById('scienceLevel').value || '',
            social_level: document.getElementById('socialLevel').value || '',
            level: levelValue,
            status: '활동중',
            school_id: document.getElementById('schoolId').value,
            program_type: document.getElementById('programType').value,
            student_type: grade <= 3 ? 'middle' : 'high'
        };
        
        // localStorage에서 기존 학생 데이터 로드
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        
        if (currentEditId) {
            // 수정
            const index = students.findIndex(s => s.id === currentEditId);
            if (index !== -1) {
                students[index] = {...students[index], ...studentData, id: currentEditId};
                localStorage.setItem('students', JSON.stringify(students));
                alert('학생 정보가 수정되었습니다.');
                currentEditId = null;
            }
        } else {
            // 신규 등록
            const newId = 'student_' + Date.now();
            const newStudent = {...studentData, id: newId, created_at: new Date().toISOString()};
            students.push(newStudent);
            localStorage.setItem('students', JSON.stringify(students));
            
            // 🎯 학생 레벨에 맞는 교재 자동 할당
            recommendMaterials(newId, studentData.level);
            
            // 🎯 주간 학습 스케줄 자동 생성
            generateAutoScheduleForStudent(newId, studentData);
            
            alert(`✅ 학생이 등록되었습니다!\n\n이름: ${studentData.name}\n학년: ${studentData.grade}학년 ${studentData.class_num}반 ${studentData.student_num}번\n수준: ${studentData.level}\n\n✨ 맞춤형 교재와 학습 스케줄이 자동으로 생성되었습니다!`);
        }
        
        resetForm();
        loadStudents();
        
    } catch (error) {
        console.error('학생 저장 오류:', error);
        alert('학생 정보 저장에 실패했습니다.');
    }
}

// 수준별 교재 자동 추천 (localStorage 기반)
function recommendMaterials(studentId, level) {
    try {
        // localStorage에서 교재 데이터 로드
        const materials = JSON.parse(localStorage.getItem('materials')) || [];
        
        // 레벨 매핑 (상급/중상/중하/기초 → 상/중/하)
        let targetLevel = '중';
        if (level === '상급' || level === '중상') {
            targetLevel = '상';
        } else if (level === '중하' || level === '기초') {
            targetLevel = '하';
        }
        
        // 해당 레벨의 교재 필터링
        const recommendedMaterials = materials.filter(m => m.level === targetLevel);
        
        // 각 과목별로 교재 1개 + EBS강의 1개씩 추천
        const subjects = ['국어', '영어', '수학', '과학', '사회'];
        const assignments = [];
        
        for (const subject of subjects) {
            // 교재 추천
            const bookForSubject = recommendedMaterials.find(m => m.subject === subject && m.type === '교재');
            if (bookForSubject) {
                assignments.push({
                    id: `assign_${Date.now()}_${subject}_book`,
                    student_id: studentId,
                    material_id: bookForSubject.id,
                    material_title: bookForSubject.title,
                    material_type: '교재',
                    subject: subject,
                    assigned_date: new Date().toISOString().split('T')[0],
                    status: '진행중',
                    progress: 0,
                    created_at: new Date().toISOString()
                });
            }
            
            // EBS 강의 추천
            const lectureForSubject = recommendedMaterials.find(m => m.subject === subject && m.type === 'EBS강의');
            if (lectureForSubject) {
                assignments.push({
                    id: `assign_${Date.now()}_${subject}_lecture`,
                    student_id: studentId,
                    material_id: lectureForSubject.id,
                    material_title: lectureForSubject.title,
                    material_type: 'EBS강의',
                    subject: subject,
                    assigned_date: new Date().toISOString().split('T')[0],
                    status: '진행중',
                    progress: 0,
                    created_at: new Date().toISOString()
                });
            }
        }
        
        // localStorage에 저장
        const existingAssignments = JSON.parse(localStorage.getItem('student_materials')) || [];
        existingAssignments.push(...assignments);
        localStorage.setItem('student_materials', JSON.stringify(existingAssignments));
        
        console.log(`✅ ${studentId}에게 ${assignments.length}개의 교재/강의가 자동 할당되었습니다.`);
        return assignments;
        
    } catch (error) {
        console.error('교재 추천 오류:', error);
        return [];
    }
}

// 학생 정보 수정
async function editStudent(studentId) {
    try {
        // localStorage에서 학생 데이터 찾기
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const student = students.find(s => s.id === studentId);
        
        if (!student) {
            alert('해당 학생을 찾을 수 없습니다.');
            return;
        }
        
        document.getElementById('schoolId').value = student.school_id || '';
        document.getElementById('programType').value = student.program_type || '';
        document.getElementById('name').value = student.name;
        document.getElementById('grade').value = student.grade;
        document.getElementById('classNum').value = student.class_num;
        document.getElementById('studentNum').value = student.student_num;
        document.getElementById('koreanLevel').value = student.korean_level || '';
        document.getElementById('englishLevel').value = student.english_level || '';
        document.getElementById('mathLevel').value = student.math_level || '';
        document.getElementById('scienceLevel').value = student.science_level || '';
        document.getElementById('socialLevel').value = student.social_level || '';
        document.getElementById('level').value = student.level;
        document.getElementById('level').disabled = false;
        
        currentEditId = studentId;
        
        // 폼으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('학생 정보 로드 오류:', error);
        alert('학생 정보를 불러오는데 실패했습니다: ' + error.message);
    }
}

// 학생 상세보기
function viewStudentDetail(studentId) {
    window.location.href = `student-detail.html?id=${studentId}`;
}

// 학습계획 생성
function createStudyPlan(studentId) {
    window.location.href = `study-plan.html?id=${studentId}`;
}

// 삭제 모달 표시
function showDeleteModal(studentId) {
    deleteStudentId = studentId;
    document.getElementById('deleteModal').classList.remove('hidden');
    
    document.getElementById('confirmDeleteBtn').onclick = async function() {
        await deleteStudent(deleteStudentId);
        closeDeleteModal();
    };
}

// 삭제 모달 닫기
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
    deleteStudentId = null;
}

// 학생 삭제
async function deleteStudent(studentId) {
    try {
        // localStorage에서 학생 데이터 로드
        let students = JSON.parse(localStorage.getItem('students') || '[]');
        const index = students.findIndex(s => s.id === studentId);
        
        if (index !== -1) {
            students.splice(index, 1);
            localStorage.setItem('students', JSON.stringify(students));
            alert('학생이 삭제되었습니다.');
            loadStudents();
        } else {
            alert('해당 학생을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('학생 삭제 오류:', error);
        alert('학생 삭제에 실패했습니다: ' + error.message);
    }
}

// 폼 초기화
function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('level').disabled = true;
    document.getElementById('level').style.backgroundColor = '';
    currentEditId = null;
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
        '상': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border-2 border-red-300">🔴 상</span>',
        // 기존 호환성 유지
        '상급': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border-2 border-red-300">🔴 상</span>',
        '중': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 border-2 border-yellow-300">🟡 중상</span>',
        '하': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border-2 border-blue-300">🔵 중하</span>'
    };
    return badges[level] || '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">미정</span>';
}

// 🎯 학생 등록 시 자동 주간 스케줄 생성
function generateAutoScheduleForStudent(studentId, studentData) {
    try {
        // localStorage에서 할당된 교재 가져오기
        const studentMaterials = JSON.parse(localStorage.getItem('student_materials')) || [];
        const myMaterials = studentMaterials.filter(m => m.student_id === studentId);
        
        // 30일 프로그램 주간 스케줄 생성
        const schedules = [];
        const subjects = ['국어', '영어', '수학', '과학', '사회'];
        const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
        
        // 중학생 학습 시간 규칙: 평일 3시간, 주말 4시간 (2시간 오전 + 2시간 오후)
        const studyHoursPerDay = {
            '월요일': 3, '화요일': 3, '수요일': 3, '목요일': 3, '금요일': 3,
            '토요일': 4, '일요일': 4
        };
        
        // 4주간의 스케줄 생성
        for (let week = 1; week <= 4; week++) {
            for (const day of days) {
                const isWeekend = day === '토요일' || day === '일요일';
                const dailyHours = studyHoursPerDay[day];
                
                // 과목별 학습 시간 배분 (균등 배분)
                const hoursPerSubject = dailyHours / subjects.length;
                
                const schedule = {
                    id: `schedule_${studentId}_week${week}_${day}`,
                    student_id: studentId,
                    week: week,
                    day: day,
                    is_weekend: isWeekend,
                    total_hours: dailyHours,
                    subjects: {}
                };
                
                // 각 과목별 학습 계획
                subjects.forEach((subject, index) => {
                    const material = myMaterials.find(m => m.subject === subject && m.material_type === '교재');
                    const lecture = myMaterials.find(m => m.subject === subject && m.material_type === 'EBS강의');
                    
                    schedule.subjects[subject] = {
                        hours: parseFloat(hoursPerSubject.toFixed(1)),
                        material: material ? material.material_title : `${subject} 교재`,
                        lecture: lecture ? lecture.material_title : `${subject} EBS 강의`,
                        tasks: isWeekend ? 
                            [`오전: ${subject} 개념 복습 (1시간)`, `오후: ${subject} 문제 풀이 (1시간)`] :
                            [`${subject} 학교 수업 복습 및 문제 풀이`]
                    };
                });
                
                schedules.push(schedule);
            }
        }
        
        // localStorage에 저장
        const existingSchedules = JSON.parse(localStorage.getItem('student_schedules')) || [];
        existingSchedules.push(...schedules);
        localStorage.setItem('student_schedules', JSON.stringify(existingSchedules));
        
        console.log(`✅ ${studentId}의 4주간 주간 스케줄 (${schedules.length}개)이 자동 생성되었습니다.`);
        return schedules;
        
    } catch (error) {
        console.error('스케줄 생성 오류:', error);
        return [];
    }
}
