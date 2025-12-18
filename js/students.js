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
    
    // 점수 입력 시 자동 수준 판정
    const scoreInputs = ['koreanScore', 'englishScore', 'mathScore', 'scienceScore', 'socialScore'];
    scoreInputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', autoCalculateLevel);
    });
}

// 점수 평균 기반 자동 수준 판정
function autoCalculateLevel() {
    const korean = parseFloat(document.getElementById('koreanScore').value) || 0;
    const english = parseFloat(document.getElementById('englishScore').value) || 0;
    const math = parseFloat(document.getElementById('mathScore').value) || 0;
    const science = parseFloat(document.getElementById('scienceScore').value) || 0;
    const social = parseFloat(document.getElementById('socialScore').value) || 0;
    
    const scores = [korean, english, math, science, social].filter(s => s > 0);
    
    if (scores.length === 0) {
        document.getElementById('level').value = '';
        document.getElementById('level').selectedIndex = 0;
        return;
    }
    
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const levelSelect = document.getElementById('level');
    
    // EBS AI 코스웨어 진단평가 점수 기반 수준 판정
    let level = '';
    if (avgScore >= 85) {
        level = '상급'; // 85-100점: 상급
    } else if (avgScore >= 70) {
        level = '중상'; // 70-84점: 중상
    } else if (avgScore >= 50) {
        level = '중하'; // 50-69점: 중하
    } else {
        level = '기초'; // 0-49점: 기초
    }
    
    levelSelect.value = level;
    levelSelect.disabled = false;
    
    // 시각적 피드백 (배경색 변경)
    levelSelect.style.backgroundColor = getLevelColor(level);
    levelSelect.style.fontWeight = 'bold';
}

// 수준별 색상 반환
function getLevelColor(level) {
    const colors = {
        '기초': '#dcfce7', // Green-100
        '중하': '#dbeafe', // Blue-100
        '중상': '#fef3c7', // Yellow-100
        '상급': '#fee2e2'  // Red-100
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
        const avgScore = calculateAverageScore(student);
        const levelBadge = getLevelBadge(student.level);
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${student.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                    ${student.grade}학년 ${student.class_num}반 ${student.student_num}번
                </td>
                <td class="px-6 py-4 whitespace-nowrap">${levelBadge}</td>
                <td class="px-6 py-4 whitespace-nowrap">${student.korean_score || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap">${student.english_score || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap">${student.math_score || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap">${student.science_score || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap">${student.social_score || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap font-semibold">${avgScore.toFixed(1)}</td>
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

// 학생 저장
async function saveStudent() {
    try {
        // 수준이 비어있으면 자동 계산
        autoCalculateLevel();
        
        const levelValue = document.getElementById('level').value;
        if (!levelValue) {
            alert('EBS AI 코스웨어 진단평가 점수를 입력해주세요.');
            return;
        }
        
        const grade = parseInt(document.getElementById('grade').value);
        const studentData = {
            name: document.getElementById('name').value,
            grade: grade,
            class_num: parseInt(document.getElementById('classNum').value),
            student_num: parseInt(document.getElementById('studentNum').value),
            korean_score: parseFloat(document.getElementById('koreanScore').value) || 0,
            english_score: parseFloat(document.getElementById('englishScore').value) || 0,
            math_score: parseFloat(document.getElementById('mathScore').value) || 0,
            science_score: parseFloat(document.getElementById('scienceScore').value) || 0,
            social_score: parseFloat(document.getElementById('socialScore').value) || 0,
            level: levelValue,
            status: '활동중',
            school_id: document.getElementById('schoolId').value,
            program_type: document.getElementById('programType').value,
            student_type: grade <= 3 ? 'middle' : 'high'
        };
        
        // 총점 계산
        studentData.total_score = studentData.korean_score + studentData.english_score + 
                                   studentData.math_score + studentData.science_score + 
                                   studentData.social_score;
        
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
            alert(`✅ 학생이 등록되었습니다!\n\n이름: ${studentData.name}\n학년: ${studentData.grade}학년 ${studentData.class_num}반 ${studentData.student_num}번\n수준: ${studentData.level}`);
        }
        
        resetForm();
        loadStudents();
        
    } catch (error) {
        console.error('학생 저장 오류:', error);
        alert('학생 정보 저장에 실패했습니다.');
    }
}

// 수준별 교재 자동 추천
async function recommendMaterials(studentId, level) {
    try {
        // 해당 수준의 교재 가져오기
        const response = await fetch('tables/materials?limit=100');
        const data = await response.json();
        
        const recommendedMaterials = data.data.filter(m => m.level === level);
        
        // 각 과목별로 1개씩 추천
        const subjects = ['국어', '영어', '수학', '과학', '사회'];
        const assignments = [];
        
        for (const subject of subjects) {
            const materialForSubject = recommendedMaterials.find(m => m.subject === subject);
            if (materialForSubject) {
                assignments.push({
                    student_id: studentId,
                    material_id: materialForSubject.id,
                    assigned_date: new Date().toISOString().split('T')[0],
                    status: '진행중',
                    progress: 0
                });
            }
        }
        
        // 추천 교재 배정
        if (assignments.length > 0) {
            await fetch('tables/student_materials', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(assignments[0])
            });
            
            for (let i = 1; i < assignments.length; i++) {
                await fetch('tables/student_materials', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(assignments[i])
                });
            }
        }
        
    } catch (error) {
        console.error('교재 추천 오류:', error);
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
        document.getElementById('koreanScore').value = student.korean_score || '';
        document.getElementById('englishScore').value = student.english_score || '';
        document.getElementById('mathScore').value = student.math_score || '';
        document.getElementById('scienceScore').value = student.science_score || '';
        document.getElementById('socialScore').value = student.social_score || '';
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
        '상급': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border-2 border-red-300">🔴 상급</span>',
        // 기존 3단계 호환성 유지
        '상': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border-2 border-red-300">🔴 상급</span>',
        '중': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 border-2 border-yellow-300">🟡 중상</span>',
        '하': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border-2 border-blue-300">🔵 중하</span>'
    };
    return badges[level] || '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">미정</span>';
}
