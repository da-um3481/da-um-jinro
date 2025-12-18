// 학생 포털 스크립트

let currentStudent = null;
let currentCheckItem = null;
let todayChecks = [];
let studyTimer = null;
let studyStartTime = null;
let studyElapsedSeconds = 0;

// 평일/주말 학습 시간 (분 단위)
const WEEKDAY_TARGET = 210; // 평일 3.5시간 (3~4시간 평균)
const WEEKEND_TARGET = 300; // 주말 5시간

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    setTodayDate();
    setTodayTarget(); // 평일/주말 목표 설정
    
    // localStorage에서 저장된 학생 정보 확인
    const savedStudentName = localStorage.getItem('currentStudentName');
    if (savedStudentName) {
        document.getElementById('studentNameInput').value = savedStudentName;
        loadStudentByName();
    }
    
    // 입력창에 포커스
    document.getElementById('studentNameInput').focus();
});

// 오늘 날짜 설정
function setTodayDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    document.getElementById('todayDate').textContent = today.toLocaleDateString('ko-KR', options);
}

// 오늘의 목표 시간 설정 (평일/주말 자동 구분)
function setTodayTarget() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0(일) ~ 6(토)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const targetMinutes = isWeekend ? WEEKEND_TARGET : WEEKDAY_TARGET;
    const targetHours = targetMinutes / 60;
    
    // 헤더 목표 시간 표시
    const headerTarget = document.getElementById('headerTarget');
    const headerDayType = document.getElementById('headerDayType');
    if (headerTarget) {
        headerTarget.textContent = `${targetHours}시간`;
    }
    if (headerDayType) {
        headerDayType.textContent = isWeekend ? '(주말)' : '(평일)';
        headerDayType.className = isWeekend ? 
            'text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700' : 
            'text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700';
    }
    
    // 진행바 목표 업데이트
    const goalTime = document.getElementById('goalTime');
    if (goalTime) {
        goalTime.textContent = `목표: ${targetMinutes}분 ${isWeekend ? '(주말 5시간)' : '(평일 3~4시간)'}`;
    }
    
    return targetMinutes;
}

// 현재 목표 시간 가져오기
function getTodayTarget() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    return isWeekend ? WEEKEND_TARGET : WEEKDAY_TARGET;
}

// 이름으로 학생 찾기
async function loadStudentByName() {
    const nameInput = document.getElementById('studentNameInput');
    const name = nameInput.value.trim();
    
    if (!name) {
        showWarningMessage('⚠️ 이름을 입력해주세요!');
        nameInput.focus();
        return;
    }
    
    try {
        // 모든 학생 목록 가져오기
        const response = await fetch('tables/students?limit=100');
        const data = await response.json();
        
        // 이름으로 검색 (대소문자 구분 없이, 공백 제거)
        const student = data.data.find(s => 
            s.name.replace(/\s/g, '').toLowerCase() === name.replace(/\s/g, '').toLowerCase()
        );
        
        if (!student) {
            showWarningMessage(`⚠️ "${name}" 학생을 찾을 수 없습니다. 이름을 확인해주세요.`);
            nameInput.focus();
            nameInput.select();
            return;
        }
        
        // 학생 정보 저장
        currentStudent = student;
        localStorage.setItem('currentStudentName', student.name);
        
        // UI 업데이트
        document.getElementById('studentInfo').textContent = 
            `${student.name} (${student.grade}학년 ${student.class_num}반 ${student.student_num}번) - 수준: ${student.level}`;
        
        // 성공 메시지
        showSuccessMessage(`✅ ${student.name} 학생의 학습 포털에 오신 것을 환영합니다! 🎉`);
        
        // 데이터 로드
        await loadStudentDataById(student.id);
        
    } catch (error) {
        console.error('학생 검색 오류:', error);
        showWarningMessage('⚠️ 학생 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    }
}

// 학생 데이터 로드 (ID로)
async function loadStudentDataById(studentId) {
    if (!studentId) return;
    
    try {
        // 오늘의 체크리스트 로드
        await loadTodayChecklist();
        
        // 추천 교재 로드
        await loadRecommendedMaterials();
        
        // 피드백 로드
        await loadFeedback();
        
        // 주간 달성률 로드
        await loadWeeklyAchievement();
        
    } catch (error) {
        console.error('학생 데이터 로드 오류:', error);
    }
}

// 오늘의 체크리스트 로드
async function loadTodayChecklist() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // 오늘의 학습 계획 확인
        const planResponse = await fetch(`tables/study_plans?limit=100`);
        const planData = await planResponse.json();
        
        const todayPlan = planData.data.find(p => 
            p.student_id === currentStudent.id && p.date === today
        );
        
        if (!todayPlan) {
            // 계획이 없으면 자동 생성 (학교 수업 기반)
            await createTodayPlan(today);
            return;
        }
        
        // 오늘의 체크 항목 로드
        const checksResponse = await fetch(`tables/daily_checks?limit=100`);
        const checksData = await checksResponse.json();
        
        todayChecks = checksData.data.filter(c => 
            c.student_id === currentStudent.id && c.date === today
        );
        
        if (todayChecks.length === 0) {
            // 체크 항목 생성
            await createChecklistItems(todayPlan, today);
        } else {
            displayChecklist(todayChecks);
            updateProgress();
        }
        
    } catch (error) {
        console.error('체크리스트 로드 오류:', error);
    }
}

// 오늘의 학습 계획 자동 생성
async function createTodayPlan(date) {
    try {
        // 학교 수업 내용 기반으로 계획 생성
        const lessonsResponse = await fetch(`tables/school_lessons?limit=100`);
        const lessonsData = await lessonsResponse.json();
        
        const todayLessons = lessonsData.data.filter(l => 
            l.date === date && l.grade === currentStudent.grade
        );
        
        // 평일/주말 구분
        const planDate = new Date(date);
        const dayOfWeek = planDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // 기본 시간 배분 (평일: 210분 = 3.5시간, 주말: 300분 = 5시간)
        // 1일 3과목 학습 원칙
        let timeAllocation;
        if (isWeekend) {
            // 주말: 3과목 집중 학습 (5시간 = 300분)
            // 수학, 영어, 과학 중심
            timeAllocation = {
                korean_time: 0,
                english_time: 100,
                math_time: 120, // 수학 집중
                science_time: 80,
                social_time: 0
            };
        } else {
            // 평일: 3과목 학습 (3.5시간 = 210분)
            // 수학, 영어, 국어 or 과학
            timeAllocation = {
                korean_time: 70,
                english_time: 70,
                math_time: 70,
                science_time: 0,
                social_time: 0
            };
        }
        
        // 오늘 수업이 있는 과목에 더 많은 시간 배정
        todayLessons.forEach(lesson => {
            if (lesson.importance === '높음') {
                const subjectKey = getSubjectKey(lesson.subject);
                if (subjectKey) {
                    timeAllocation[subjectKey] += 20;
                }
            }
        });
        
        // 총 시간 조정
        const totalTime = Object.values(timeAllocation).reduce((a, b) => a + b, 0);
        
        const plan = {
            student_id: currentStudent.id,
            date: date,
            ...timeAllocation,
            total_planned_time: totalTime,
            notes: '학교 수업 기반 자동 생성'
        };
        
        const response = await fetch('tables/study_plans', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(plan)
        });
        
        if (response.ok) {
            await loadTodayChecklist();
        }
        
    } catch (error) {
        console.error('학습 계획 생성 오류:', error);
    }
}

// 체크리스트 항목 생성
async function createChecklistItems(plan, date) {
    // 평일/주말 구분
    const planDate = new Date(date);
    const dayOfWeek = planDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const subjects = [
        { name: '국어', time: plan.korean_time },
        { name: '영어', time: plan.english_time },
        { name: '수학', time: plan.math_time },
        { name: '과학', time: plan.science_time },
        { name: '사회', time: plan.social_time }
    ];
    
    const checkItems = [];
    
    for (const subject of subjects) {
        if (subject.time > 0) {
            // 평일/주말에 따라 다른 학습 내용
            let content;
            if (isWeekend) {
                // 주말: 주간 총복습 + 문제풀이 중심
                if (subject.name === '수학') {
                    content = `📊 ${subject.name} 이번 주 배운 단원 총복습 + 유형별 문제풀이 + 오답정리`;
                } else {
                    content = `📚 ${subject.name} 주간 학습내용 전체 복습 + 핵심 개념 정리 + 문제풀이`;
                }
            } else {
                // 평일: 학교수업 복습 + 주요과목 학습
                content = `📖 ${subject.name} 오늘 학교수업 복습 + 교재 개념학습 + 기본문제`;
            }
            
            const item = {
                student_id: currentStudent.id,
                date: date,
                subject: subject.name,
                content: content,
                planned_time: subject.time,
                actual_time: 0,
                completed: false,
                memo: ''
            };
            
            const response = await fetch('tables/daily_checks', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(item)
            });
            
            if (response.ok) {
                const newItem = await response.json();
                checkItems.push(newItem);
            }
        }
    }
    
    todayChecks = checkItems;
    displayChecklist(todayChecks);
    restoreTimers(); // 진행 중인 타이머 복원
}

// 체크리스트 표시
function displayChecklist(checks) {
    const container = document.getElementById('checklistContainer');
    const emptyDiv = document.getElementById('emptyChecklist');
    const countSpan = document.getElementById('checklistCount');
    
    if (checks.length === 0) {
        container.innerHTML = '';
        emptyDiv.style.display = 'block';
        if (countSpan) countSpan.textContent = '0개';
        return;
    }
    
    emptyDiv.style.display = 'none';
    if (countSpan) countSpan.textContent = `${checks.length}개`;
    
    const subjectColors = {
        '국어': { bg: 'red-50', border: 'red-500', text: 'red-700', btn: 'red-600' },
        '영어': { bg: 'blue-50', border: 'blue-500', text: 'blue-700', btn: 'blue-600' },
        '수학': { bg: 'green-50', border: 'green-500', text: 'green-700', btn: 'green-600' },
        '과학': { bg: 'purple-50', border: 'purple-500', text: 'purple-700', btn: 'purple-600' },
        '사회': { bg: 'orange-50', border: 'orange-500', text: 'orange-700', btn: 'orange-600' }
    };
    
    // 🚫 중복 학습 방지: 현재 학습 중인 과목이 있는지 확인
    const studyingCheck = checks.find(c => c.start_time && !c.completed);
    const hasStudying = !!studyingCheck;
    
    container.innerHTML = checks.map(check => {
        const colors = subjectColors[check.subject] || { bg: 'gray-50', border: 'gray-500', text: 'gray-700', btn: 'gray-600' };
        
        // 이 항목이 학습 중인가?
        const isStudying = check.start_time && !check.completed;
        
        // 다른 과목이 학습 중인가?
        const isBlocked = hasStudying && !isStudying && !check.completed;
        
        // 상태별 스타일
        let cardClass, statusIcon, statusBadge;
        if (check.completed) {
            cardClass = 'bg-gradient-to-br from-green-50 to-white border-2 border-green-200';
            statusIcon = '<div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><i class="fas fa-check-circle text-green-600 text-xl"></i></div>';
            statusBadge = '<span class="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold"><i class="fas fa-check mr-1"></i>완료</span>';
        } else if (isStudying) {
            cardClass = `bg-gradient-to-br from-${colors.bg} to-white border-2 border-${colors.border} shadow-lg`;
            statusIcon = `<div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-pulse"><i class="fas fa-hourglass-half text-white text-lg"></i></div>`;
            statusBadge = '<span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold animate-pulse"><i class="fas fa-circle mr-1"></i>학습 중</span>';
        } else if (isBlocked) {
            // 다른 과목이 학습 중일 때
            cardClass = 'bg-gray-100 border-2 border-gray-300 opacity-60';
            statusIcon = `<div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><i class="fas fa-lock text-gray-400 text-xl"></i></div>`;
            statusBadge = '<span class="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs"><i class="fas fa-lock mr-1"></i>대기</span>';
        } else {
            cardClass = `bg-white border-2 border-${colors.border} hover:shadow-md`;
            statusIcon = `<div class="w-10 h-10 bg-${colors.bg} rounded-full flex items-center justify-center"><i class="far fa-circle text-${colors.text} text-xl"></i></div>`;
            statusBadge = '';
        }
        
        return `
            <div class="${cardClass} rounded-2xl p-4 transition-all duration-300">
                <!-- 헤더 -->
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        ${statusIcon}
                        <div>
                            <h3 class="font-bold text-lg text-${colors.text}">${check.subject}</h3>
                            <p class="text-sm text-gray-600">${check.content}</p>
                        </div>
                    </div>
                    ${statusBadge}
                </div>
                
                <!-- 정보 -->
                <div class="flex flex-wrap gap-2 mb-3 text-sm">
                    <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        <i class="fas fa-target mr-1"></i>목표 ${check.planned_time}분
                    </span>
                    ${check.start_time && !check.completed ? `
                        <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                            <i class="fas fa-play mr-1"></i>${new Date(check.start_time).toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'})} 시작
                        </span>
                    ` : ''}
                    ${check.completed ? `
                        <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                            <i class="fas fa-check mr-1"></i>${check.actual_time}분 학습
                        </span>
                    ` : ''}
                </div>
                
                ${check.memo ? `
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 rounded p-3 mb-3">
                        <p class="text-sm text-gray-700">💭 ${check.memo}</p>
                    </div>
                ` : ''}
                
                <!-- 액션 -->
                ${!check.completed ? `
                    ${isStudying ? `
                        <div class="flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
                            <div>
                                <p class="text-xs text-gray-600 mb-1">경과 시간</p>
                                <div class="text-3xl font-black text-${colors.text} timer-display" id="timer-${check.id}">00:00</div>
                            </div>
                            <button onclick="stopStudy('${check.id}')" class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                                <i class="fas fa-stop mr-2"></i>완료
                            </button>
                        </div>
                    ` : isBlocked ? `
                        <div class="w-full py-4 bg-gray-200 text-gray-500 rounded-xl font-bold text-center cursor-not-allowed">
                            <i class="fas fa-lock mr-2"></i>다른 과목 학습 중
                        </div>
                        <p class="text-xs text-center text-gray-500 mt-2">
                            💡 <strong>${studyingCheck.subject}</strong>을(를) 먼저 완료해주세요
                        </p>
                    ` : `
                        <button onclick="startStudy('${check.id}')" class="w-full py-4 bg-gradient-to-r from-${colors.btn} to-${colors.text} text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                            <i class="fas fa-play mr-2"></i>학습 시작하기
                        </button>
                    `}
                ` : ''}
            </div>
        `;
    }).join('');
    
    // 타이머 복원
    checks.forEach(check => {
        if (check.start_time && !check.completed) {
            startTimer(check.id, check.start_time);
        }
    });
    
    updateProgress();
}

// 체크 토글 (사용 안함 - 시작/완료 버튼만 사용)
// 이 함수들은 하위 호환성을 위해 유지하지만 더 이상 사용하지 않습니다
async function toggleCheck(checkId) {
    // 더 이상 사용하지 않음
    return;
}

// 체크 모달 열기 (사용 안함)
function openCheckModal(checkId) {
    // 더 이상 사용하지 않음
    return;
}

// 체크 모달 닫기 (사용 안함)
function closeCheckModal() {
    // 더 이상 사용하지 않음
    return;
}

// 학습 완료 체크 (사용 안함 - stopStudy 함수 사용)
async function completeCheck(checkId) {
    // 더 이상 사용하지 않음 - stopStudy() 함수를 사용하세요
    return;
    
    /* 이전 코드 - 주석 처리
    const actualTime = parseInt(document.getElementById('actualTime').value) || 0;
    const memo = document.getElementById('checkMemo').value;
    
    if (actualTime === 0) {
        alert('실제 학습 시간을 입력해주세요.');
        return;
    }
    
    try {
    */
}

// 진행률 업데이트
function updateProgress() {
    const completed = todayChecks.filter(c => c.completed);
    const totalActualTime = completed.reduce((sum, c) => sum + (c.actual_time || 0), 0);
    const totalPlannedTime = getTodayTarget(); // 평일/주말 자동 구분 (4시간 or 6시간)
    
    // 시간 진행률
    const timeProgress = Math.min((totalActualTime / totalPlannedTime) * 100, 100);
    document.getElementById('todayStudyTime').textContent = totalActualTime;
    document.getElementById('timeProgress').style.width = timeProgress + '%';
    
    // 과목 진행률
    const subjectProgress = todayChecks.length > 0 ? (completed.length / todayChecks.length) * 100 : 0;
    document.getElementById('completedSubjects').textContent = completed.length;
    document.getElementById('subjectProgress').style.width = subjectProgress + '%';
    
    // 과목 퍼센트 표시
    const subjectPercentEl = document.getElementById('subjectPercent');
    if (subjectPercentEl) {
        subjectPercentEl.textContent = Math.round(subjectProgress) + '%';
    }
}

// 추천 교재 로드
async function loadRecommendedMaterials() {
    const container = document.getElementById('materialsContainer');
    const emptyDiv = document.getElementById('emptyMaterials');
    
    try {
        const response = await fetch(`tables/student_materials?limit=100`);
        const data = await response.json();
        
        const studentMaterials = data.data.filter(m => m.student_id === currentStudent.id);
        
        if (studentMaterials.length === 0) {
            container.innerHTML = '';
            if (emptyDiv) emptyDiv.style.display = 'block';
            return;
        }
        
        if (emptyDiv) emptyDiv.style.display = 'none';
        
        // 교재 상세 정보 가져오기
        const materialsResponse = await fetch('tables/materials?limit=100');
        const materialsData = await materialsResponse.json();
        
        container.innerHTML = '';
        
        for (const sm of studentMaterials) {
            const material = materialsData.data.find(m => m.id === sm.material_id);
            if (material) {
                const card = createMaterialCard(material, sm);
                container.innerHTML += card;
            }
        }
        
    } catch (error) {
        console.error('교재 로드 오류:', error);
        container.innerHTML = '';
        if (emptyDiv) emptyDiv.style.display = 'block';
    }
}

// 교재 카드 생성
function createMaterialCard(material, assignment) {
    const isVideo = material.type === 'EBS강의';
    const typeConfig = isVideo ? 
        { icon: 'fa-video', color: 'red', bg: 'red-50', label: 'EBS 강의' } : 
        { icon: 'fa-book', color: 'blue', bg: 'blue-50', label: '교재' };
    
    const statusConfig = assignment.status === '완료' ?
        { bg: 'green-100', text: 'green-700', label: '완료', icon: 'fa-check-circle' } :
        { bg: 'yellow-100', text: 'yellow-700', label: '진행중', icon: 'fa-clock' };
    
    return `
        <div class="bg-white border-2 border-gray-200 rounded-2xl p-5 hover:shadow-xl hover:border-${typeConfig.color}-300 transition-all duration-300">
            <!-- 타입 배지 -->
            <div class="flex justify-between items-start mb-3">
                <span class="px-3 py-1 bg-${typeConfig.bg} text-${typeConfig.color}-700 rounded-full text-xs font-bold">
                    <i class="fas ${typeConfig.icon} mr-1"></i>${typeConfig.label}
                </span>
                <span class="px-3 py-1 bg-${statusConfig.bg} text-${statusConfig.text} rounded-full text-xs font-bold">
                    <i class="fas ${statusConfig.icon} mr-1"></i>${statusConfig.label}
                </span>
            </div>
            
            <!-- 제목 -->
            <h4 class="font-bold text-gray-900 mb-2 text-base line-clamp-1">${material.title}</h4>
            
            <!-- 과목 & 레벨 -->
            <div class="flex items-center space-x-2 mb-3">
                <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">${material.subject}</span>
                <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">${material.level}</span>
            </div>
            
            <!-- 설명 -->
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">${material.description}</p>
            
            <!-- 진도율 -->
            <div class="mb-4">
                <div class="flex justify-between text-xs text-gray-600 mb-2">
                    <span>학습 진도</span>
                    <span class="font-bold">${assignment.progress || 0}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-gradient-to-r from-${typeConfig.color}-500 to-${typeConfig.color}-600 h-2.5 rounded-full transition-all" style="width: ${assignment.progress || 0}%"></div>
                </div>
            </div>
            
            <!-- 버튼 -->
            ${material.url ? `
                <a href="${material.url}" target="_blank" class="block w-full py-3 bg-gradient-to-r from-${typeConfig.color}-600 to-${typeConfig.color}-700 text-white text-center rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105 active:scale-95">
                    <i class="fas fa-external-link-alt mr-2"></i>바로가기
                </a>
            ` : ''}
        </div>
    `;
}

// 피드백 로드
async function loadFeedback() {
    try {
        const response = await fetch('tables/weekly_feedback?limit=100');
        const data = await response.json();
        
        const studentFeedbacks = data.data
            .filter(f => f.student_id === currentStudent.id)
            .sort((a, b) => new Date(b.week_start) - new Date(a.week_start))
            .slice(0, 3); // 최근 3개
        
        const container = document.getElementById('feedbackContainer');
        const emptyDiv = document.getElementById('emptyFeedback');
        
        if (studentFeedbacks.length === 0) {
            container.innerHTML = '';
            emptyDiv.style.display = 'block';
            return;
        }
        
        emptyDiv.style.display = 'none';
        
        container.innerHTML = studentFeedbacks.map(feedback => {
            const achievement = feedback.study_time_achievement;
            const achievementConfig = achievement >= 80 ? 
                { color: 'green', bg: 'green-50', icon: 'fa-trophy', text: '우수' } :
                achievement >= 60 ?
                { color: 'blue', bg: 'blue-50', icon: 'fa-thumbs-up', text: '양호' } :
                { color: 'orange', bg: 'orange-50', icon: 'fa-chart-line', text: '노력' };
            
            return `
            <div class="bg-gradient-to-br from-white to-${achievementConfig.bg} border-2 border-${achievementConfig.color}-200 rounded-2xl p-5 mb-4 hover:shadow-lg transition-all">
                <!-- 헤더 -->
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="font-bold text-gray-900 text-base mb-1">
                            ${formatWeekRange(feedback.week_start, feedback.week_end)}
                        </h4>
                        <p class="text-xs text-gray-500">선생님 피드백</p>
                    </div>
                    <div class="text-right">
                        <div class="inline-flex items-center space-x-2 px-3 py-2 bg-${achievementConfig.color}-100 rounded-full">
                            <i class="fas ${achievementConfig.icon} text-${achievementConfig.color}-600"></i>
                            <span class="text-sm font-bold text-${achievementConfig.color}-700">${achievement}%</span>
                        </div>
                        <p class="text-xs text-gray-600 mt-1">${achievementConfig.text}</p>
                    </div>
                </div>
                
                <!-- 선생님 코멘트 -->
                <div class="bg-white rounded-xl p-4 mb-3">
                    <div class="flex items-start space-x-2">
                        <i class="fas fa-comment-dots text-indigo-600 mt-1"></i>
                        <p class="text-sm text-gray-700 leading-relaxed">
                            ${feedback.teacher_comment || '피드백이 작성되지 않았습니다.'}
                        </p>
                    </div>
                </div>
                
                <!-- 개선사항 -->
                ${feedback.improvement_notes ? `
                    <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-4">
                        <div class="flex items-start space-x-2">
                            <i class="fas fa-lightbulb text-yellow-600 mt-1"></i>
                            <div>
                                <p class="font-bold text-yellow-900 text-sm mb-1">💡 개선 포인트</p>
                                <p class="text-sm text-gray-700">${feedback.improvement_notes}</p>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('피드백 로드 오류:', error);
    }
}

// 주간 달성률 로드
async function loadWeeklyAchievement() {
    try {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        
        const response = await fetch('tables/weekly_feedback?limit=100');
        const data = await response.json();
        
        const thisWeekFeedback = data.data.find(f => 
            f.student_id === currentStudent.id && 
            new Date(f.week_start) >= weekStart
        );
        
        if (thisWeekFeedback) {
            document.getElementById('weeklyAchievement').textContent = 
                thisWeekFeedback.study_time_achievement.toFixed(1);
        }
    } catch (error) {
        console.error('주간 달성률 로드 오류:', error);
    }
}

// 유틸리티 함수들
function getSubjectKey(subject) {
    const map = {
        '국어': 'korean_time',
        '영어': 'english_time',
        '수학': 'math_time',
        '과학': 'science_time',
        '사회': 'social_time'
    };
    return map[subject];
}

function formatWeekRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.getMonth()+1}/${startDate.getDate()} ~ ${endDate.getMonth()+1}/${endDate.getDate()}`;
}

function getAchievementColor(achievement) {
    if (achievement >= 90) return 'text-green-600';
    if (achievement >= 70) return 'text-blue-600';
    if (achievement >= 50) return 'text-yellow-600';
    return 'text-red-600';
}

// 성공 메시지 표시
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] animate-slide-up';
    messageDiv.innerHTML = `
        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-md">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <i class="fas fa-check text-white"></i>
                </div>
                <span class="font-bold">${message}</span>
            </div>
        </div>
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translate(-50%, -20px)';
        messageDiv.style.transition = 'all 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// 경고 메시지 표시
function showWarningMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] animate-slide-up';
    messageDiv.innerHTML = `
        <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-md">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <i class="fas fa-exclamation-triangle text-white"></i>
                </div>
                <span class="font-bold">${message}</span>
            </div>
        </div>
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translate(-50%, -20px)';
        messageDiv.style.transition = 'all 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3500);
}

// 학습 시작
async function startStudy(checkId) {
    const check = todayChecks.find(c => c.id === checkId);
    if (!check || check.completed) return;
    
    // 🚫 중복 학습 방지: 현재 학습 중인 과목이 있는지 확인
    const studyingCheck = todayChecks.find(c => c.start_time && !c.completed);
    if (studyingCheck) {
        // 이미 학습 중인 과목이 있음
        showWarningMessage(`⚠️ ${studyingCheck.subject} 학습이 진행 중입니다. 먼저 완료해주세요!`);
        
        // 학습 중인 항목으로 스크롤
        const studyingElement = document.getElementById(`timer-${studyingCheck.id}`);
        if (studyingElement) {
            studyingElement.closest('.rounded-2xl').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
        return;
    }
    
    try {
        const now = new Date().toISOString();
        const updateData = {
            ...check,
            start_time: now
        };
        
        const response = await fetch(`tables/daily_checks/${checkId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            showSuccessMessage(`⏱️ ${check.subject} 학습을 시작했습니다! 화이팅! 🔥`);
            await loadTodayChecklist();
            
            // 타이머 시작
            startTimer(checkId, now);
        }
    } catch (error) {
        console.error('학습 시작 오류:', error);
        alert('학습 시작에 실패했습니다.');
    }
}

// 학습 완료
async function stopStudy(checkId) {
    const check = todayChecks.find(c => c.id === checkId);
    if (!check || check.completed || !check.start_time) return;
    
    // 타이머 정지
    if (studyTimer) {
        clearInterval(studyTimer);
        studyTimer = null;
    }
    
    // 실제 학습 시간 계산 (분 단위)
    const startTime = new Date(check.start_time);
    const endTime = new Date();
    const actualMinutes = Math.round((endTime - startTime) / 1000 / 60);
    
    if (actualMinutes < 1) {
        if (!confirm('학습 시간이 1분 미만입니다. 그래도 완료하시겠습니까?')) {
            return;
        }
    }
    
    try {
        const updateData = {
            ...check,
            end_time: endTime.toISOString(),
            actual_time: actualMinutes,
            completed: true,
            memo: `${actualMinutes}분 학습 완료`
        };
        
        const response = await fetch(`tables/daily_checks/${checkId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            showSuccessMessage(`✅ ${check.subject} 학습 완료! ${actualMinutes}분 동안 정말 잘했어요! 👏`);
            await loadTodayChecklist();
        }
    } catch (error) {
        console.error('학습 완료 오류:', error);
        alert('학습 완료 처리에 실패했습니다.');
    }
}

// 타이머 시작
function startTimer(checkId, startTimeStr) {
    const startTime = new Date(startTimeStr);
    
    studyTimer = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000); // 초 단위
        
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        
        const timeStr = hours > 0 
            ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        const timerElement = document.getElementById(`timer-${checkId}`);
        if (timerElement) {
            timerElement.textContent = timeStr;
        } else {
            // 타이머 엘리먼트가 없으면 중지
            clearInterval(studyTimer);
            studyTimer = null;
        }
    }, 1000);
}

// 페이지 로드 시 진행 중인 학습 타이머 복원
function restoreTimers() {
    todayChecks.forEach(check => {
        if (check.start_time && !check.completed) {
            startTimer(check.id, check.start_time);
        }
    });
}
