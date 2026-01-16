// LocalStorage 키
const STORAGE_KEYS = {
    STUDENT: 'daum_v2_current_student',
    JOURNALS: 'daum_v2_journals',
    MISSIONS: 'daum_v2_missions',
    MATERIALS: 'daum_v2_materials',
    QUESTIONS: 'daum_v2_questions',
    WEEKLY_PLAN: 'daum_v2_weekly_plan',
    PLAN_CREATED_DATE: 'daum_v2_plan_created_date',
    PLAN_COLLAPSED: 'daum_v2_plan_collapsed'
};

// 현재 학생 정보
let currentStudent = null;
let selectedStudyHours = 0;
let isPlanCollapsed = true; // 기본적으로 접혀있음

// 로그인
function login() {
    const name = document.getElementById('nameInput').value.trim();
    if (!name) {
        alert('이름을 입력해주세요');
        return;
    }

    currentStudent = {
        name: name,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(currentStudent));
    
    document.getElementById('studentName').textContent = `${name}님 환영합니다! 👋`;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainScreen').classList.remove('hidden');

    // 주간 계획이 없으면 학습 도우미 표시
    checkAndShowStudyHelper();
    loadAllData();
}

// 로그아웃
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem(STORAGE_KEYS.STUDENT);
        location.reload();
    }
}

// 페이지 로드 시 자동 로그인 체크
window.addEventListener('DOMContentLoaded', () => {
    const savedStudent = localStorage.getItem(STORAGE_KEYS.STUDENT);
    if (savedStudent) {
        currentStudent = JSON.parse(savedStudent);
        document.getElementById('studentName').textContent = `${currentStudent.name}님 환영합니다! 👋`;
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainScreen').classList.remove('hidden');
        checkAndShowStudyHelper();
        loadAllData();
    }
});

// 학습 도우미 표시 여부 확인
function checkAndShowStudyHelper() {
    const weeklyPlan = localStorage.getItem(STORAGE_KEYS.WEEKLY_PLAN);
    const planCreatedDate = localStorage.getItem(STORAGE_KEYS.PLAN_CREATED_DATE);
    
    // 계획이 있는지 확인
    if (weeklyPlan && planCreatedDate) {
        const createdDate = new Date(planCreatedDate);
        const today = new Date();
        const daysDiff = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
        
        // 7일이 지났으면 자동 갱신
        if (daysDiff >= 7) {
            localStorage.removeItem(STORAGE_KEYS.WEEKLY_PLAN);
            localStorage.removeItem(STORAGE_KEYS.PLAN_CREATED_DATE);
            alert('✨ 일주일이 지나 새로운 학습 계획을 만들어주세요!');
            openStudyHelperModal();
        } else {
            // 계획 표시
            displayWeeklyPlan();
        }
    }
}

// 계획표 접기/펼치기
function toggleWeeklyPlan() {
    const content = document.getElementById('weeklyPlanContent');
    const icon = document.getElementById('planToggleIcon');
    const collapsed = localStorage.getItem(STORAGE_KEYS.PLAN_COLLAPSED);
    
    if (collapsed === 'true' || !collapsed) {
        // 펼치기
        content.classList.remove('hidden');
        icon.classList.add('rotate-180');
        localStorage.setItem(STORAGE_KEYS.PLAN_COLLAPSED, 'false');
    } else {
        // 접기
        content.classList.add('hidden');
        icon.classList.remove('rotate-180');
        localStorage.setItem(STORAGE_KEYS.PLAN_COLLAPSED, 'true');
    }
}

// 학습 도우미 모달 열기
function openStudyHelperModal() {
    document.getElementById('studyHelperModal').classList.remove('hidden');
    document.getElementById('studyHelperModal').classList.add('flex');
    // 선택 초기화
    selectedStudyHours = 0;
    document.querySelectorAll('.study-hour-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.subject-checkbox').forEach(cb => cb.checked = false);
}

// 학습 도우미 모달 닫기
function closeStudyHelperModal() {
    document.getElementById('studyHelperModal').classList.add('hidden');
    document.getElementById('studyHelperModal').classList.remove('flex');
}

// 학습 도우미 다시 표시
function showStudyHelper() {
    openStudyHelperModal();
}

// 학습 시간 선택
function selectStudyHours(hours) {
    selectedStudyHours = hours;
    
    // 모든 버튼 비활성화
    document.querySelectorAll('.study-hour-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // 선택한 버튼 활성화
    event.target.closest('.study-hour-btn').classList.add('selected');
}

// 주간 학습 계획 생성
function generateWeeklyPlan() {
    if (selectedStudyHours === 0) {
        alert('학습 시간을 선택해주세요!');
        return;
    }

    // 선택한 과목들
    const selectedSubjects = [];
    document.querySelectorAll('.subject-checkbox:checked').forEach(cb => {
        selectedSubjects.push(cb.value);
    });

    // 기본 과목 (선택하지 않았으면 모든 과목)
    const allSubjects = ['국어', '영어', '수학', '과학', '사회'];
    const subjects = selectedSubjects.length > 0 ? selectedSubjects : allSubjects;

    // 주간 계획 생성
    const weeklyPlan = createWeeklySchedule(selectedStudyHours, subjects, selectedSubjects.length > 0);
    
    // 저장
    localStorage.setItem(STORAGE_KEYS.WEEKLY_PLAN, JSON.stringify(weeklyPlan));
    localStorage.setItem(STORAGE_KEYS.PLAN_CREATED_DATE, new Date().toISOString());
    localStorage.setItem(STORAGE_KEYS.PLAN_COLLAPSED, 'true'); // 생성 후 접혀있음
    
    // 모달 닫기
    closeStudyHelperModal();
    
    // 화면에 표시 (접힌 상태)
    displayWeeklyPlan();
    
    alert('✅ 일주일 학습 계획이 생성되었습니다!\n\n💡 계획표를 클릭하면 펼쳐서 볼 수 있습니다.');
}

// 학습 스케줄 생성 알고리즘
function createWeeklySchedule(totalHours, subjects, hasFocus) {
    const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
    const weeklyPlan = [];
    
    // 총 학습 시간을 분으로 변환
    const totalMinutes = totalHours * 60;
    
    // 50~60분 학습 + 5분 휴식 (평균 55분으로 계산)
    const sessionDuration = 50 + Math.floor(Math.random() * 11); // 50~60분 랜덤
    const breakDuration = 5;
    const sessionsPerDay = Math.floor(totalMinutes / 55); // 평균 세션 시간으로 계산
    
    for (let day of days) {
        const dailySchedule = [];
        let startHour = 19; // 저녁 7시 시작
        let startMinute = 0;
        
        for (let i = 0; i < sessionsPerDay; i++) {
            // 각 세션마다 50~60분 랜덤 지정
            const currentSessionDuration = 50 + Math.floor(Math.random() * 11);
            
            // 과목 선택 (집중 과목이 있으면 더 자주)
            let subject;
            if (hasFocus && Math.random() < 0.6) {
                // 60% 확률로 집중 과목
                subject = subjects[Math.floor(Math.random() * subjects.length)];
            } else {
                // 나머지는 모든 과목에서 랜덤
                const allSubjects = ['국어', '영어', '수학', '과학', '사회'];
                subject = allSubjects[Math.floor(Math.random() * allSubjects.length)];
            }
            
            // 시간 포맷
            const endMinute = startMinute + currentSessionDuration;
            const endHour = startHour + Math.floor(endMinute / 60);
            const finalEndMinute = endMinute % 60;
            
            dailySchedule.push({
                time: `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}-${String(endHour).padStart(2, '0')}:${String(finalEndMinute).padStart(2, '0')}`,
                subject: subject,
                duration: currentSessionDuration,
                type: 'study'
            });
            
            // 마지막 세션이 아니면 휴식 추가
            if (i < sessionsPerDay - 1) {
                startHour = endHour;
                startMinute = finalEndMinute;
                
                const breakEndMinute = startMinute + breakDuration;
                const breakEndHour = startHour + Math.floor(breakEndMinute / 60);
                const finalBreakEndMinute = breakEndMinute % 60;
                
                dailySchedule.push({
                    time: `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}-${String(breakEndHour).padStart(2, '0')}:${String(finalBreakEndMinute).padStart(2, '0')}`,
                    subject: '휴식',
                    duration: breakDuration,
                    type: 'break'
                });
                
                startHour = breakEndHour;
                startMinute = finalBreakEndMinute;
            }
        }
        
        weeklyPlan.push({
            day: day,
            schedule: dailySchedule,
            totalMinutes: dailySchedule.filter(s => s.type === 'study').reduce((sum, s) => sum + s.duration, 0)
        });
    }
    
    return weeklyPlan;
}

// 주간 계획 표시
function displayWeeklyPlan() {
    const weeklyPlan = JSON.parse(localStorage.getItem(STORAGE_KEYS.WEEKLY_PLAN));
    const planCreatedDate = localStorage.getItem(STORAGE_KEYS.PLAN_CREATED_DATE);
    const collapsed = localStorage.getItem(STORAGE_KEYS.PLAN_COLLAPSED);
    
    if (!weeklyPlan) return;
    
    const container = document.getElementById('weeklyPlanContent');
    const viewContainer = document.getElementById('weeklyPlanView');
    const icon = document.getElementById('planToggleIcon');
    const expiryDateElement = document.getElementById('planExpiryDate');
    
    // 만료일 계산
    if (planCreatedDate) {
        const createdDate = new Date(planCreatedDate);
        const expiryDate = new Date(createdDate);
        expiryDate.setDate(expiryDate.getDate() + 7);
        
        const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
        expiryDateElement.textContent = `${daysLeft}일 남음 | 클릭하여 펼치기/접기`;
    }
    
    viewContainer.classList.remove('hidden');
    
    // 접힌 상태 반영
    if (collapsed === 'true' || !collapsed) {
        container.classList.add('hidden');
        icon.classList.remove('rotate-180');
    } else {
        container.classList.remove('hidden');
        icon.classList.add('rotate-180');
    }
    
    const subjectIcons = {
        '국어': 'fa-book',
        '영어': 'fa-language',
        '수학': 'fa-calculator',
        '과학': 'fa-flask',
        '사회': 'fa-globe',
        '휴식': 'fa-coffee'
    };
    
    const subjectColors = {
        '국어': 'bg-red-50 border-red-200 text-red-800',
        '영어': 'bg-blue-50 border-blue-200 text-blue-800',
        '수학': 'bg-green-50 border-green-200 text-green-800',
        '과학': 'bg-purple-50 border-purple-200 text-purple-800',
        '사회': 'bg-yellow-50 border-yellow-200 text-yellow-800',
        '휴식': 'bg-gray-50 border-gray-200 text-gray-600'
    };
    
    container.innerHTML = weeklyPlan.map(dayPlan => `
        <div class="border rounded-lg p-4">
            <div class="flex justify-between items-center mb-3">
                <h4 class="font-bold text-lg">📅 ${dayPlan.day}</h4>
                <span class="text-sm text-gray-600">총 ${Math.floor(dayPlan.totalMinutes / 60)}시간 ${dayPlan.totalMinutes % 60}분</span>
            </div>
            <div class="space-y-2">
                ${dayPlan.schedule.map(item => `
                    <div class="flex items-center gap-3 ${subjectColors[item.subject]} border rounded p-2">
                        <div class="text-center min-w-[100px]">
                            <div class="text-xs font-semibold">${item.time}</div>
                        </div>
                        <div class="flex items-center gap-2 flex-1">
                            <i class="fas ${subjectIcons[item.subject]}"></i>
                            <span class="font-semibold">${item.subject}</span>
                        </div>
                        <div class="text-xs">${item.duration}분</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// 탭 전환
function showTab(tabName) {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('[id^="tab-"]').forEach(btn => {
        btn.classList.remove('tab-active');
        btn.classList.add('hover:bg-gray-100');
    });

    // 모든 컨텐츠 숨기기
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // 선택한 탭 활성화
    document.getElementById(`tab-${tabName}`).classList.add('tab-active');
    document.getElementById(`tab-${tabName}`).classList.remove('hover:bg-gray-100');
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
}

// 학습 일지 저장
function saveJournal() {
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('content').value.trim();
    const studyTime = document.getElementById('studyTime').value;
    const memo = document.getElementById('memo').value.trim();

    if (!content) {
        alert('학습 내용을 입력해주세요');
        return;
    }

    const journal = {
        id: Date.now(),
        studentName: currentStudent.name,
        date: new Date().toISOString(),
        subject: subject,
        content: content,
        studyTime: studyTime || 0,
        memo: memo,
        photo: null // 추후 구현
    };

    // 저장
    const journals = getJournals();
    journals.unshift(journal);
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));

    // 폼 초기화
    document.getElementById('content').value = '';
    document.getElementById('studyTime').value = '';
    document.getElementById('memo').value = '';

    alert('✅ 학습 기록이 저장되었습니다!');
    loadJournals();
}

// 학습 일지 목록 불러오기
function loadJournals() {
    const journals = getJournals().filter(j => j.studentName === currentStudent.name);
    const container = document.getElementById('journalList');

    if (journals.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">아직 학습 기록이 없습니다</p>';
        return;
    }

    container.innerHTML = journals.map(journal => `
        <div class="border rounded-lg p-4 hover:shadow-md transition">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="badge bg-blue-100 text-blue-800">${journal.subject}</span>
                    <span class="text-sm text-gray-500 ml-2">${formatDate(journal.date)}</span>
                </div>
                <span class="text-sm text-gray-600">⏱️ ${journal.studyTime}분</span>
            </div>
            <p class="text-gray-800 mb-2">${journal.content}</p>
            ${journal.memo ? `<p class="text-sm text-gray-600 italic">💭 ${journal.memo}</p>` : ''}
        </div>
    `).join('');
}

// 학습 미션 불러오기
function loadMissions() {
    const missions = getMissions();
    const container = document.getElementById('missionList');

    if (missions.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">아직 미션이 없습니다</p>';
        return;
    }

    container.innerHTML = missions.map(mission => `
        <div class="border rounded-lg p-4 hover:shadow-md transition">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-lg">${mission.title}</h4>
                <span class="badge ${mission.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${mission.status === 'active' ? '진행중' : '종료'}
                </span>
            </div>
            <p class="text-gray-600 mb-2">${mission.description}</p>
            <p class="text-sm text-gray-500">📅 ${mission.startDate} ~ ${mission.endDate}</p>
        </div>
    `).join('');
}

// 자료실 불러오기
function loadMaterials() {
    const materials = getMaterials();
    const container = document.getElementById('materialsList');

    if (materials.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8 col-span-2">아직 자료가 없습니다</p>';
        return;
    }

    container.innerHTML = materials.map(material => `
        <div class="border rounded-lg p-4 hover:shadow-md transition">
            <div class="flex items-center mb-2">
                <i class="fas fa-file-${getFileIcon(material.type)} text-2xl text-blue-500 mr-3"></i>
                <div class="flex-1">
                    <h4 class="font-bold">${material.title}</h4>
                    <p class="text-sm text-gray-500">${material.subject}</p>
                </div>
            </div>
            <button onclick="downloadMaterial('${material.url}')" class="w-full mt-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition text-sm">
                <i class="fas fa-download mr-1"></i>다운로드
            </button>
        </div>
    `).join('');
}

// AI 질문하기
function askAI() {
    const questionText = document.getElementById('questionText').value.trim();
    
    if (!questionText) {
        alert('질문을 입력해주세요');
        return;
    }

    const question = {
        id: Date.now(),
        studentName: currentStudent.name,
        date: new Date().toISOString(),
        question: questionText,
        answer: '선생님께서 곧 답변해 주실 예정입니다. 조금만 기다려주세요! 🤖',
        status: 'pending',
        photo: null
    };

    const questions = getQuestions();
    questions.unshift(question);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));

    document.getElementById('questionText').value = '';
    alert('✅ 질문이 등록되었습니다!');
    loadQuestions();
}

// 질문 목록 불러오기
function loadQuestions() {
    const questions = getQuestions().filter(q => q.studentName === currentStudent.name);
    const container = document.getElementById('questionList');

    if (questions.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">아직 질문이 없습니다</p>';
        return;
    }

    container.innerHTML = questions.map(question => `
        <div class="border rounded-lg p-4 hover:shadow-md transition">
            <div class="flex justify-between items-start mb-2">
                <span class="badge ${question.status === 'answered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    ${question.status === 'answered' ? '답변완료' : '대기중'}
                </span>
                <span class="text-sm text-gray-500">${formatDate(question.date)}</span>
            </div>
            <div class="bg-gray-50 rounded p-3 mb-2">
                <p class="font-semibold mb-1">Q. ${question.question}</p>
            </div>
            <div class="bg-purple-50 rounded p-3">
                <p class="text-sm">A. ${question.answer}</p>
            </div>
        </div>
    `).join('');
}

// 유틸리티 함수들
function getJournals() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNALS) || '[]');
}

function getMissions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MISSIONS) || '[]');
}

function getMaterials() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MATERIALS) || '[]');
}

function getQuestions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTIONS) || '[]');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function getFileIcon(type) {
    const icons = {
        'pdf': 'pdf',
        'image': 'image',
        'video': 'video',
        'doc': 'word',
        'default': 'alt'
    };
    return icons[type] || icons.default;
}

function downloadMaterial(url) {
    window.open(url, '_blank');
}

// 모든 데이터 로드
function loadAllData() {
    loadJournals();
    loadMissions();
    loadMaterials();
    loadQuestions();
}
