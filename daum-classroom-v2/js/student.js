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

// 타이머 변수
let timerStartTime = null;
let timerInterval = null;
let timerElapsedSeconds = 0;

// 사진 업로드 변수
let uploadedPhotos = [];
let questionPhoto = null;

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
    
    // 오늘 요일 계산
    const today = new Date();
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const todayName = dayNames[today.getDay()];
    
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
    
    container.innerHTML = weeklyPlan.map(dayPlan => {
        const isToday = dayPlan.day === todayName;
        return `
        <div class="border rounded-lg p-4 ${isToday ? 'border-blue-500 border-2 bg-blue-50' : ''}">
            <div class="flex justify-between items-center mb-3">
                <h4 class="font-bold text-lg flex items-center gap-2">
                    ${isToday ? '⭐' : '📅'} ${dayPlan.day}
                    ${isToday ? '<span class="text-sm bg-blue-500 text-white px-2 py-1 rounded-full">오늘</span>' : ''}
                </h4>
                <span class="text-sm text-gray-600">총 ${Math.floor(dayPlan.totalMinutes / 60)}시간 ${dayPlan.totalMinutes % 60}분</span>
            </div>
            <div class="space-y-2">
                ${dayPlan.schedule.map((item, idx) => `
                    <div class="flex items-center gap-3 ${subjectColors[item.subject]} border rounded p-2">
                        <div class="text-center min-w-[100px]">
                            <div class="text-xs font-semibold">${item.time}</div>
                        </div>
                        <div class="flex items-center gap-2 flex-1">
                            <i class="fas ${subjectIcons[item.subject]}"></i>
                            <span class="font-semibold">${item.subject}</span>
                        </div>
                        <div class="text-xs">${item.duration}분</div>
                        ${item.type === 'study' && isToday ? `
                            <button onclick="startStudyFromPlan('${item.subject}', ${item.duration})" class="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition">
                                <i class="fas fa-play mr-1"></i>시작
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `}).join('');
}

// 계획표에서 학습 시작
function startStudyFromPlan(subject, duration) {
    // 학습 일지 탭으로 이동
    showTab('journal');
    
    // 과목 선택
    document.getElementById('subject').value = subject;
    
    // 타이머 시작
    startTimer();
    
    // 스크롤
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    alert(`✅ ${subject} 학습을 시작합니다!\n예상 시간: ${duration}분`);
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

// 사진 업로드 처리
function handlePhotoUpload(event) {
    const files = event.target.files;
    const maxFiles = 3;
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (files.length > maxFiles) {
        alert(`최대 ${maxFiles}개의 사진만 첨부할 수 있습니다.`);
        event.target.value = '';
        return;
    }
    
    uploadedPhotos = [];
    const previewContainer = document.getElementById('photoPreview');
    previewContainer.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        // 파일 크기 체크
        if (file.size > maxSize) {
            alert(`${file.name}은(는) 2MB를 초과합니다.`);
            return;
        }
        
        // 이미지 파일만
        if (!file.type.startsWith('image/')) {
            alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoData = {
                name: file.name,
                data: e.target.result,
                size: file.size,
                type: file.type
            };
            
            uploadedPhotos.push(photoData);
            
            // 미리보기 생성
            const previewDiv = document.createElement('div');
            previewDiv.className = 'relative group';
            previewDiv.innerHTML = `
                <img src="${e.target.result}" class="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-75 transition" onclick="viewPhotoModal('${e.target.result}', '${file.name}')">
                <button onclick="removePhoto(${index})" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition">
                    <i class="fas fa-times"></i>
                </button>
                <div class="text-xs text-gray-500 mt-1 truncate">${file.name}</div>
            `;
            previewContainer.appendChild(previewDiv);
        };
        reader.readAsDataURL(file);
    });
}

// 사진 삭제
function removePhoto(index) {
    uploadedPhotos.splice(index, 1);
    
    // 미리보기 업데이트
    const previewContainer = document.getElementById('photoPreview');
    previewContainer.innerHTML = '';
    
    uploadedPhotos.forEach((photo, idx) => {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'relative group';
        previewDiv.innerHTML = `
            <img src="${photo.data}" class="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-75 transition" onclick="viewPhotoModal('${photo.data}', '${photo.name}')">
            <button onclick="removePhoto(${idx})" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition">
                <i class="fas fa-times"></i>
            </button>
            <div class="text-xs text-gray-500 mt-1 truncate">${photo.name}</div>
        `;
        previewContainer.appendChild(previewDiv);
    });
    
    // 파일 input 리셋
    document.getElementById('photoUpload').value = '';
}

// 사진 확대 모달
function viewPhotoModal(photoData, photoName) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div class="p-4 border-b flex justify-between items-center">
                <h3 class="font-bold">${photoName}</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-4">
                <img src="${photoData}" class="max-w-full h-auto">
            </div>
            <div class="p-4 border-t flex justify-end">
                <a href="${photoData}" download="${photoName}" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    <i class="fas fa-download mr-2"></i>다운로드
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}
function saveJournal() {
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('content').value.trim();
    const memo = document.getElementById('memo').value.trim();

    if (!content) {
        alert('학습 내용을 입력해주세요');
        return;
    }

    // 타이머로 측정한 시간 사용
    const studyTime = timerElapsedSeconds > 0 ? Math.round(timerElapsedSeconds / 60) : 0;
    
    if (studyTime === 0) {
        alert('⏱️ 학습 시간을 측정해주세요!\n\n"학습 시작" 버튼을 눌러 타이머를 시작한 후,\n학습이 끝나면 "완료" 버튼을 눌러주세요.');
        return;
    }

    const journal = {
        id: Date.now(),
        studentName: currentStudent.name,
        date: new Date().toISOString(),
        subject: subject,
        content: content,
        studyTime: studyTime,
        startTime: timerStartTime ? new Date(timerStartTime).toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'}) : '',
        endTime: timerStartTime ? new Date(timerStartTime + (timerElapsedSeconds * 1000)).toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'}) : '',
        memo: memo,
        photos: uploadedPhotos // 사진 데이터 저장
    };

    // 저장
    const journals = getJournals();
    journals.unshift(journal);
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));

    // 폼 초기화
    document.getElementById('content').value = '';
    document.getElementById('memo').value = '';
    document.getElementById('photoUpload').value = '';
    document.getElementById('photoPreview').innerHTML = '';
    uploadedPhotos = [];
    resetTimer();

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
                <div class="text-right">
                    <div class="text-lg font-bold text-blue-500">${journal.studyTime}분</div>
                    ${journal.startTime && journal.endTime ? `
                        <div class="text-xs text-gray-500">${journal.startTime} ~ ${journal.endTime}</div>
                    ` : ''}
                </div>
            </div>
            <p class="text-gray-800 mb-2">${journal.content}</p>
            ${journal.memo ? `<p class="text-sm text-gray-600 italic mb-2">💭 ${journal.memo}</p>` : ''}
            ${journal.photos && journal.photos.length > 0 ? `
                <div class="mt-3">
                    <div class="text-sm font-semibold text-gray-700 mb-2">📷 첨부 사진 (${journal.photos.length})</div>
                    <div class="grid grid-cols-3 gap-2">
                        ${journal.photos.map(photo => `
                            <img src="${photo.data}" class="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-75 transition" onclick="viewPhotoModal('${photo.data}', '${photo.name}')">
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// 타이머 시작
function startTimer() {
    timerStartTime = Date.now();
    timerElapsedSeconds = 0;
    
    // UI 전환
    document.getElementById('timerIdle').classList.add('hidden');
    document.getElementById('timerRunning').classList.remove('hidden');
    document.getElementById('timerCompleted').classList.add('hidden');
    
    // 시작 시각 표시
    const startTimeStr = new Date(timerStartTime).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('startTime').textContent = startTimeStr;
    
    // 타이머 시작
    timerInterval = setInterval(() => {
        timerElapsedSeconds = Math.floor((Date.now() - timerStartTime) / 1000);
        updateTimerDisplay();
    }, 1000);
}

// 타이머 업데이트
function updateTimerDisplay() {
    const hours = Math.floor(timerElapsedSeconds / 3600);
    const minutes = Math.floor((timerElapsedSeconds % 3600) / 60);
    const seconds = timerElapsedSeconds % 60;
    
    const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('elapsedTime').textContent = display;
}

// 타이머 정지 (완료)
function stopTimer() {
    if (!timerInterval) return;
    
    clearInterval(timerInterval);
    timerInterval = null;
    
    const endTime = Date.now();
    const totalMinutes = Math.round(timerElapsedSeconds / 60);
    
    // UI 전환
    document.getElementById('timerRunning').classList.add('hidden');
    document.getElementById('timerCompleted').classList.remove('hidden');
    
    // 완료 정보 표시
    const startTimeStr = new Date(timerStartTime).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const endTimeStr = new Date(endTime).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('completedStartTime').textContent = startTimeStr;
    document.getElementById('completedEndTime').textContent = endTimeStr;
    document.getElementById('completedDuration').textContent = `${totalMinutes}분`;
}

// 타이머 리셋
function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    timerStartTime = null;
    timerElapsedSeconds = 0;
    
    // UI 리셋
    document.getElementById('timerIdle').classList.remove('hidden');
    document.getElementById('timerRunning').classList.add('hidden');
    document.getElementById('timerCompleted').classList.add('hidden');
    document.getElementById('elapsedTime').textContent = '00:00:00';
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

// 질문 사진 업로드 처리
function handleQuestionPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (file.size > maxSize) {
        alert('파일 크기는 2MB 이하여야 합니다.');
        event.target.value = '';
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 첨부할 수 있습니다.');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        questionPhoto = {
            name: file.name,
            data: e.target.result,
            size: file.size,
            type: file.type
        };
        
        // 미리보기
        const previewContainer = document.getElementById('questionPhotoPreview');
        previewContainer.innerHTML = `
            <div class="relative inline-block">
                <img src="${e.target.result}" class="max-w-xs rounded border">
                <button onclick="removeQuestionPhoto()" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 hover:bg-red-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

// 질문 사진 삭제
function removeQuestionPhoto() {
    questionPhoto = null;
    document.getElementById('questionPhoto').value = '';
    document.getElementById('questionPhotoPreview').innerHTML = '';
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
        photo: questionPhoto // 사진 데이터 저장
    };

    const questions = getQuestions();
    questions.unshift(question);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));

    document.getElementById('questionText').value = '';
    removeQuestionPhoto();
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
                ${question.photo ? `
                    <div class="mt-2">
                        <img src="${question.photo.data}" class="max-w-xs rounded border cursor-pointer hover:opacity-75 transition" onclick="viewPhotoModal('${question.photo.data}', '${question.photo.name}')">
                    </div>
                ` : ''}
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
