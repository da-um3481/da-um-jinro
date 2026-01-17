// LocalStorage 키
const STORAGE_KEYS = {
    STUDENT: 'daum_v2_current_student',
    JOURNALS: 'daum_v2_journals',
    MISSIONS: 'daum_v2_missions',
    MATERIALS: 'daum_v2_materials',
    QUESTIONS: 'daum_v2_questions',
    WEEKLY_PLAN: 'daum_v2_weekly_plan',
    PLAN_CREATED_DATE: 'daum_v2_plan_created_date',
    PLAN_COLLAPSED: 'daum_v2_plan_collapsed',
    TIMETABLE: 'daum_v2_timetable',
    REVIEW_STATUS: 'daum_v2_review_status'
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

// 시간표 관련 변수
let currentEditingDay = '';
let timetableData = {};

// 테스트 모드 변수
let testDayOverride = null; // null이면 실제 날짜 사용

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

    // 복습 상태 업데이트
    updateReviewStatus(subject, studyTime);

    // 폼 초기화
    document.getElementById('content').value = '';
    document.getElementById('memo').value = '';
    document.getElementById('photoUpload').value = '';
    document.getElementById('photoPreview').innerHTML = '';
    uploadedPhotos = [];
    resetTimer();

    // 학습 시간에 따른 격려 메시지
    let encourageMessage = '';
    if (studyTime >= 60) {
        encourageMessage = '\n\n🏆 와! 1시간 이상 공부했어요! 정말 대단해요!';
    } else if (studyTime >= 30) {
        encourageMessage = '\n\n💪 30분 이상 집중했네요! 멋져요!';
    } else if (studyTime >= 15) {
        encourageMessage = '\n\n✨ 15분 집중! 좋은 시작이에요!';
    } else if (studyTime >= 5) {
        encourageMessage = '\n\n👍 조금씩이라도 꾸준히 하는 게 중요해요!';
    } else {
        encourageMessage = '\n\n🌱 작은 시작도 소중해요! 다음엔 더 오래 해볼까요?';
    }

    alert(`✅ 학습 기록이 저장되었습니다!${encourageMessage}`);
    loadJournals();
    loadTodayClasses(); // 오늘의 수업 새로고침
    loadWeeklyStats(); // 주간 통계 새로고침
    loadLearningPatterns(); // 학습 패턴 새로고침
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

// ========================================
// 시간표 관련 함수들
// ========================================

// 시간표 불러오기
function getTimetable() {
    const data = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    return data ? JSON.parse(data) : {};
}

// 시간표 저장
function saveTimetableData(data) {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(data));
}

// 복습 상태 불러오기
function getReviewStatus() {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEW_STATUS);
    return data ? JSON.parse(data) : {};
}

// 복습 상태 저장
function saveReviewStatus(data) {
    localStorage.setItem(STORAGE_KEYS.REVIEW_STATUS, JSON.stringify(data));
}

// 시간표 입력 모달 열기
function showTimetableInputModal() {
    document.getElementById('timetableModal').classList.remove('hidden');
    document.getElementById('timetableModal').classList.add('flex');
    timetableData = getTimetable();
}

// 시간표 입력 모달 닫기
function closeTimetableModal() {
    document.getElementById('timetableModal').classList.add('hidden');
    document.getElementById('timetableModal').classList.remove('flex');
    document.getElementById('dayScheduleForm').classList.add('hidden');
    currentEditingDay = '';
}

// 요일 선택
function selectDay(day) {
    currentEditingDay = day;
    
    // 모든 요일 버튼 스타일 초기화
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.remove('bg-gradient-to-r', 'from-blue-500', 'to-teal-500', 'text-white');
        btn.classList.add('bg-white', 'text-dark');
    });
    
    // 선택된 버튼 스타일 변경
    event.target.classList.remove('bg-white', 'text-dark');
    event.target.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-teal-500', 'text-white');
    
    // 폼 표시
    document.getElementById('dayScheduleForm').classList.remove('hidden');
    document.getElementById('selectedDayLabel').textContent = `📚 ${day}요일 시간표`;
    
    // 기존 시간표 불러오기
    loadDaySchedule(day);
}

// 해당 요일의 시간표 불러오기
function loadDaySchedule(day) {
    const periodsList = document.getElementById('periodsList');
    periodsList.innerHTML = '';
    
    const daySchedule = timetableData[day] || [];
    
    if (daySchedule.length === 0) {
        // 기본 1교시 추가
        addPeriodRow(1, '', '');
    } else {
        daySchedule.forEach((period, index) => {
            addPeriodRow(index + 1, period.time, period.subject);
        });
    }
}

// 교시 추가
function addPeriod() {
    const periodsList = document.getElementById('periodsList');
    const currentCount = periodsList.children.length;
    addPeriodRow(currentCount + 1, '', '');
}

// 교시 행 추가
function addPeriodRow(periodNum, time, subject) {
    const periodsList = document.getElementById('periodsList');
    const periodDiv = document.createElement('div');
    periodDiv.className = 'flex gap-1.5 md:gap-3 items-center bg-gray-50 p-2.5 md:p-4 rounded-xl md:rounded-2xl border-2 border-gray-200';
    periodDiv.innerHTML = `
        <div class="font-black text-xs md:text-lg text-dark w-10 md:w-16 flex-shrink-0">${periodNum}교시</div>
        <input type="time" value="${time}" class="period-time w-[110px] md:w-36 px-2 py-1.5 md:px-4 md:py-2 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold text-dark text-sm md:text-base flex-shrink-0">
        <select class="period-subject flex-1 min-w-0 px-1.5 py-1.5 md:px-4 md:py-2 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold text-dark text-xs md:text-base">
            <option value="">과목</option>
            <option value="국어" ${subject === '국어' ? 'selected' : ''}>🌸국어</option>
            <option value="영어" ${subject === '영어' ? 'selected' : ''}>🌍영어</option>
            <option value="수학" ${subject === '수학' ? 'selected' : ''}>🧮수학</option>
            <option value="과학" ${subject === '과학' ? 'selected' : ''}>🔬과학</option>
            <option value="사회" ${subject === '사회' ? 'selected' : ''}>🗺️사회</option>
            <option value="음악" ${subject === '음악' ? 'selected' : ''}>🎵음악</option>
            <option value="미술" ${subject === '미술' ? 'selected' : ''}>🎨미술</option>
            <option value="체육" ${subject === '체육' ? 'selected' : ''}>⚽체육</option>
            <option value="기타" ${subject === '기타' ? 'selected' : ''}>🎯기타</option>
        </select>
        <button onclick="removePeriod(this)" class="bg-red-500 text-white w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl hover:bg-red-600 transition font-bold flex-shrink-0 flex items-center justify-center text-base md:text-lg">
            🗑️
        </button>
    `;
    periodsList.appendChild(periodDiv);
}

// 교시 삭제
function removePeriod(button) {
    button.parentElement.remove();
    
    // 교시 번호 재정렬
    const periods = document.querySelectorAll('#periodsList > div');
    periods.forEach((period, index) => {
        period.querySelector('.font-black').textContent = `${index + 1}교시`;
    });
}

// 해당 요일 시간표 초기화
function clearDaySchedule() {
    if (confirm(`${currentEditingDay}요일 시간표를 모두 삭제하시겠습니까?`)) {
        document.getElementById('periodsList').innerHTML = '';
        addPeriodRow(1, '', '');
    }
}

// 시간표 저장
function saveTimetable() {
    if (!currentEditingDay) {
        alert('요일을 선택해주세요!');
        return;
    }
    
    const periods = [];
    const periodElements = document.querySelectorAll('#periodsList > div');
    
    periodElements.forEach(element => {
        const time = element.querySelector('.period-time').value;
        const subject = element.querySelector('.period-subject').value;
        
        if (time && subject) {
            periods.push({ time, subject });
        }
    });
    
    if (periods.length === 0) {
        alert('최소 1개 이상의 수업을 입력해주세요!');
        return;
    }
    
    timetableData[currentEditingDay] = periods;
    saveTimetableData(timetableData);
    
    alert(`${currentEditingDay}요일 시간표가 저장되었습니다! ✨`);
    loadTimetableView();
}

// 시간표 전체 보기
function loadTimetableView() {
    const timetableView = document.getElementById('timetableView');
    const timetable = getTimetable();
    
    if (Object.keys(timetable).length === 0) {
        timetableView.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📅</div>
                <p class="text-xl font-bold text-gray mb-4">아직 시간표가 없어요!</p>
                <p class="text-md font-semibold text-gray">위의 버튼을 눌러 시간표를 입력해주세요 😊</p>
            </div>
        `;
        return;
    }
    
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    let html = '<div class="grid grid-cols-2 md:grid-cols-7 gap-4">';
    
    days.forEach(day => {
        const daySchedule = timetable[day] || [];
        const isWeekend = day === '토' || day === '일';
        const weekendClass = isWeekend ? 'border-2 border-orange-300' : '';
        
        html += `
            <div class="cute-card p-4 hover:shadow-xl transition ${weekendClass}">
                <h4 class="text-lg font-black text-dark mb-3 text-center">
                    ${day}요일 ${isWeekend ? '🌞' : ''}
                </h4>
                <div class="space-y-2">
        `;
        
        if (daySchedule.length === 0) {
            html += `<p class="text-sm text-gray text-center py-4">수업 없음</p>`;
        } else {
            daySchedule.forEach((period, index) => {
                const subjectColor = getSubjectColor(period.subject);
                html += `
                    <div class="bg-gradient-to-r ${subjectColor} text-white p-3 rounded-xl text-center">
                        <div class="text-xs font-semibold opacity-90">${index + 1}교시 · ${period.time}</div>
                        <div class="text-md font-black">${period.subject}</div>
                    </div>
                `;
            });
        }
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    timetableView.innerHTML = html;
}

// 과목별 색상 반환
function getSubjectColor(subject) {
    const colors = {
        '국어': 'from-blue-500 to-cyan-500',
        '영어': 'from-sky-500 to-cyan-500',
        '수학': 'from-blue-700 to-blue-500',
        '과학': 'from-teal-600 to-teal-400',
        '사회': 'from-cyan-600 to-cyan-400',
        '음악': 'from-purple-500 to-pink-500',
        '미술': 'from-pink-500 to-rose-500',
        '체육': 'from-orange-500 to-yellow-500'
    };
    return colors[subject] || 'from-gray-500 to-gray-400';
}

// 오늘의 수업 불러오기
function loadTodayClasses() {
    const today = new Date();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    
    // 테스트 모드가 활성화되어 있으면 덮어쓰기
    const todayDayName = testDayOverride || dayNames[today.getDay()];
    
    // 오늘 날짜 표시
    const testModeIndicator = testDayOverride ? ' 🧪 (테스트 모드)' : '';
    const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${todayDayName}요일${testModeIndicator}`;
    document.getElementById('todayDate').textContent = dateStr;
    
    const timetable = getTimetable();
    const todaySchedule = timetable[todayDayName] || [];
    const reviewStatus = getReviewStatus();
    const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const todayReviews = reviewStatus[todayKey] || {};
    
    const todayClassList = document.getElementById('todayClassList');
    
    if (todaySchedule.length === 0) {
        todayClassList.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">😊</div>
                <p class="text-xl font-bold text-gray mb-4">오늘은 수업이 없어요!</p>
                <p class="text-md font-semibold text-gray">또는 시간표 탭에서 시간표를 입력해주세요 📅</p>
            </div>
        `;
        document.getElementById('todayTotalClasses').textContent = '0';
        document.getElementById('todayCompletedReviews').textContent = '0';
        document.getElementById('todayTotalReviewTime').textContent = '0분';
        return;
    }
    
    // 통계 계산
    let completedCount = 0;
    let totalReviewTime = 0;
    
    let html = '';
    todaySchedule.forEach((period, index) => {
        const isCompleted = todayReviews[period.subject] || false;
        const reviewTime = todayReviews[`${period.subject}_time`] || 0;
        
        if (isCompleted) completedCount++;
        totalReviewTime += reviewTime;
        
        const subjectColor = getSubjectColor(period.subject);
        const statusIcon = isCompleted ? '✅' : '⏳';
        const statusText = isCompleted ? '복습 완료!' : '복습 필요';
        const statusColor = isCompleted ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300';
        
        html += `
            <div class="cute-card p-6 ${statusColor} border-2">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <div class="text-sm font-bold text-gray mb-1">${index + 1}교시 · ${period.time}</div>
                        <div class="flex items-center gap-2">
                            <div class="text-2xl font-black text-dark">${period.subject}</div>
                            <div class="text-2xl">${statusIcon}</div>
                        </div>
                        <div class="text-sm font-semibold mt-1 ${isCompleted ? 'text-green-600' : 'text-yellow-600'}">
                            ${statusText} ${reviewTime > 0 ? `(${reviewTime}분)` : ''}
                        </div>
                    </div>
                    <button onclick="startReview('${period.subject}')" class="bg-gradient-to-r ${subjectColor} text-white px-6 py-3 rounded-full hover:shadow-lg transition cute-btn font-black">
                        ${isCompleted ? '다시 복습 🔄' : '복습 시작 📖'}
                    </button>
                </div>
            </div>
        `;
    });
    
    todayClassList.innerHTML = html;
    
    // 통계 업데이트
    document.getElementById('todayTotalClasses').textContent = todaySchedule.length;
    document.getElementById('todayCompletedReviews').textContent = completedCount;
    document.getElementById('todayTotalReviewTime').textContent = `${totalReviewTime}분`;
}

// 복습 시작
function startReview(subject) {
    // 학습 일지 탭으로 이동
    showTab('journal');
    
    // 과목 자동 선택
    document.getElementById('subject').value = subject;
    
    // 타이머 자동 시작 (선택사항)
    if (confirm(`${subject} 복습을 시작하시겠습니까?\n타이머가 자동으로 시작됩니다! ⏱️`)) {
        startTimer();
        alert(`✨ ${subject} 복습 시작!\n집중해서 공부해볼까요? 💪`);
    }
}

// 복습 상태 업데이트
function updateReviewStatus(subject, studyTime) {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    const reviewStatus = getReviewStatus();
    
    if (!reviewStatus[todayKey]) {
        reviewStatus[todayKey] = {};
    }
    
    // 해당 과목 복습 완료 표시
    reviewStatus[todayKey][subject] = true;
    
    // 복습 시간 누적
    const currentTime = reviewStatus[todayKey][`${subject}_time`] || 0;
    reviewStatus[todayKey][`${subject}_time`] = currentTime + studyTime;
    
    saveReviewStatus(reviewStatus);
}

// 주간 복습 통계 로드
function loadWeeklyStats() {
    const timetable = getTimetable();
    const reviewStatus = getReviewStatus();
    const today = new Date();
    
    // 이번 주 월요일 구하기
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    let totalClasses = 0;
    let completedClasses = 0;
    const subjectTimeMap = {}; // 과목별 시간 집계
    const pendingSubjects = new Set(); // 미완료 과목
    
    // 이번 주 월~일 (7일) 순회
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[currentDate.getDay()];
        const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        
        const daySchedule = timetable[dayName] || [];
        const dayReviews = reviewStatus[dateKey] || {};
        
        totalClasses += daySchedule.length;
        
        daySchedule.forEach(period => {
            const subject = period.subject;
            const isCompleted = dayReviews[subject] || false;
            const reviewTime = dayReviews[`${subject}_time`] || 0;
            
            if (isCompleted) {
                completedClasses++;
            } else {
                // 오늘 또는 과거 날짜의 미완료 과목만 추가
                if (currentDate <= today) {
                    pendingSubjects.add(subject);
                }
            }
            
            // 과목별 시간 집계
            if (!subjectTimeMap[subject]) {
                subjectTimeMap[subject] = 0;
            }
            subjectTimeMap[subject] += reviewTime;
        });
    }
    
    // 완료율 계산
    const completionRate = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;
    
    // UI 업데이트
    document.getElementById('weeklyCompletionRate').textContent = `${completionRate}%`;
    document.getElementById('weeklyCompletionBar').style.width = `${completionRate}%`;
    document.getElementById('weeklyCompleted').textContent = completedClasses;
    document.getElementById('weeklyTotal').textContent = totalClasses;
    
    // 과목별 학습 시간 표시
    loadSubjectTimeList(subjectTimeMap);
    
    // 복습 알림 표시
    loadReviewAlerts(pendingSubjects);
}

// 과목별 학습 시간 목록 표시
function loadSubjectTimeList(subjectTimeMap) {
    const container = document.getElementById('subjectTimeList');
    
    // 시간 많은 순으로 정렬
    const sortedSubjects = Object.entries(subjectTimeMap)
        .filter(([_, time]) => time > 0)
        .sort((a, b) => b[1] - a[1]);
    
    if (sortedSubjects.length === 0) {
        container.innerHTML = `
            <div class="text-center py-6 text-gray-500">
                <div class="text-3xl mb-2">📚</div>
                <p class="text-sm font-semibold">아직 이번 주 복습 기록이 없어요</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    sortedSubjects.forEach(([subject, time], index) => {
        const subjectColor = getSubjectColor(subject);
        const hours = Math.floor(time / 60);
        const mins = time % 60;
        const timeText = hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
        
        // 순위 메달
        let rankEmoji = '';
        if (index === 0) rankEmoji = '🥇';
        else if (index === 1) rankEmoji = '🥈';
        else if (index === 2) rankEmoji = '🥉';
        
        html += `
            <div class="flex items-center gap-2 md:gap-3 bg-gradient-to-r ${subjectColor} p-3 md:p-4 rounded-xl">
                <div class="text-xl md:text-2xl">${rankEmoji}</div>
                <div class="flex-1">
                    <div class="font-black text-white text-sm md:text-base">${subject}</div>
                    <div class="font-semibold text-white text-xs md:text-sm opacity-90">${timeText}</div>
                </div>
                <div class="text-2xl md:text-3xl font-black text-white">${time}분</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 복습 알림 표시
function loadReviewAlerts(pendingSubjects) {
    const alertArea = document.getElementById('reviewAlertArea');
    const pendingList = document.getElementById('pendingSubjectsList');
    
    if (pendingSubjects.size === 0) {
        alertArea.classList.add('hidden');
        return;
    }
    
    alertArea.classList.remove('hidden');
    
    const subjects = Array.from(pendingSubjects);
    pendingList.innerHTML = `
        <span class="font-black">${subjects.join(', ')}</span> 과목을 복습해보세요! 💪
    `;
}

// 학습 패턴 분석
function loadLearningPatterns() {
    const journals = getJournals().filter(j => j.studentName === currentStudent.name);
    
    if (journals.length === 0) {
        document.getElementById('topSubjectsGrid').innerHTML = `
            <div class="col-span-3 text-center py-6 text-gray-500">
                <div class="text-3xl mb-2">📚</div>
                <p class="text-sm font-semibold">아직 학습 기록이 없어요</p>
            </div>
        `;
        document.getElementById('timeZoneAnalysis').innerHTML = '';
        document.getElementById('weekdayPatternList').innerHTML = '';
        return;
    }
    
    // TOP 3 과목 분석
    analyzeTopSubjects(journals);
    
    // 학습 시간대 분석
    analyzeTimeZones(journals);
    
    // 요일별 학습 패턴
    analyzeWeekdayPattern(journals);
}

// TOP 3 과목 분석
function analyzeTopSubjects(journals) {
    const subjectCount = {};
    const subjectTime = {};
    
    journals.forEach(journal => {
        const subject = journal.subject;
        const time = journal.studyTime || 0;
        
        subjectCount[subject] = (subjectCount[subject] || 0) + 1;
        subjectTime[subject] = (subjectTime[subject] || 0) + time;
    });
    
    // 학습 횟수 많은 순으로 정렬
    const sortedSubjects = Object.entries(subjectCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    const container = document.getElementById('topSubjectsGrid');
    
    if (sortedSubjects.length === 0) {
        container.innerHTML = `
            <div class="col-span-3 text-center py-6 text-gray-500">
                <p class="text-sm font-semibold">학습 기록이 없어요</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    sortedSubjects.forEach(([subject, count], index) => {
        const medals = ['🥇', '🥈', '🥉'];
        const colors = [
            'from-yellow-400 to-orange-400',
            'from-gray-400 to-gray-500',
            'from-orange-400 to-yellow-600'
        ];
        const time = subjectTime[subject] || 0;
        const avgTime = Math.round(time / count);
        
        html += `
            <div class="bg-gradient-to-br ${colors[index]} p-3 md:p-4 rounded-xl text-white text-center">
                <div class="text-3xl md:text-4xl mb-1 md:mb-2">${medals[index]}</div>
                <div class="text-lg md:text-xl font-black mb-1">${subject}</div>
                <div class="text-xs md:text-sm font-semibold opacity-90">${count}회 학습</div>
                <div class="text-xs md:text-sm font-semibold opacity-90">평균 ${avgTime}분</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 학습 시간대 분석
function analyzeTimeZones(journals) {
    const timeZones = {
        morning: { name: '아침', emoji: '🌅', count: 0, time: 0, range: '6시~12시' },
        afternoon: { name: '점심', emoji: '☀️', count: 0, time: 0, range: '12시~18시' },
        evening: { name: '저녁', emoji: '🌙', count: 0, time: 0, range: '18시~24시' }
    };
    
    journals.forEach(journal => {
        if (!journal.startTime) return;
        
        // "오전 9:30" 형식에서 시간 추출
        const timeMatch = journal.startTime.match(/(\d+):(\d+)/);
        if (!timeMatch) return;
        
        let hour = parseInt(timeMatch[1]);
        const isPM = journal.startTime.includes('오후');
        
        if (isPM && hour !== 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
        
        let zone;
        if (hour >= 6 && hour < 12) zone = 'morning';
        else if (hour >= 12 && hour < 18) zone = 'afternoon';
        else zone = 'evening';
        
        timeZones[zone].count++;
        timeZones[zone].time += journal.studyTime || 0;
    });
    
    const container = document.getElementById('timeZoneAnalysis');
    const sorted = Object.entries(timeZones).sort((a, b) => b[1].count - a[1].count);
    
    let html = '';
    sorted.forEach(([key, data]) => {
        const percentage = journals.length > 0 ? Math.round((data.count / journals.length) * 100) : 0;
        const opacity = data.count > 0 ? '100' : '50';
        
        html += `
            <div class="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 md:p-4 rounded-xl border-2 border-blue-200 text-center" style="opacity: ${opacity}%">
                <div class="text-2xl md:text-3xl mb-1 md:mb-2">${data.emoji}</div>
                <div class="text-sm md:text-base font-black text-dark">${data.name}</div>
                <div class="text-xs md:text-sm font-semibold text-gray">${data.range}</div>
                <div class="text-lg md:text-xl font-black text-dark mt-1">${data.count}회</div>
                <div class="text-xs md:text-sm font-bold text-gray">${percentage}%</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 요일별 학습 패턴
function analyzeWeekdayPattern(journals) {
    const weekdays = {
        '일': { name: '일요일', count: 0, time: 0 },
        '월': { name: '월요일', count: 0, time: 0 },
        '화': { name: '화요일', count: 0, time: 0 },
        '수': { name: '수요일', count: 0, time: 0 },
        '목': { name: '목요일', count: 0, time: 0 },
        '금': { name: '금요일', count: 0, time: 0 },
        '토': { name: '토요일', count: 0, time: 0 }
    };
    
    journals.forEach(journal => {
        const date = new Date(journal.date);
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[date.getDay()];
        
        weekdays[dayName].count++;
        weekdays[dayName].time += journal.studyTime || 0;
    });
    
    const container = document.getElementById('weekdayPatternList');
    const dayOrder = ['월', '화', '수', '목', '금', '토', '일'];
    const maxCount = Math.max(...Object.values(weekdays).map(d => d.count), 1);
    
    let html = '';
    dayOrder.forEach(day => {
        const data = weekdays[day];
        const percentage = Math.round((data.count / maxCount) * 100);
        const isWeekend = day === '토' || day === '일';
        
        html += `
            <div class="bg-gray-50 p-3 md:p-4 rounded-xl border-2 border-gray-200">
                <div class="flex items-center gap-3 mb-2">
                    <div class="font-black text-sm md:text-base text-dark w-16">${data.name} ${isWeekend ? '🌞' : ''}</div>
                    <div class="flex-1">
                        <div class="w-full bg-gray-200 rounded-full h-3 md:h-4 overflow-hidden">
                            <div class="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm md:text-base font-black text-dark">${data.count}회</div>
                        <div class="text-xs md:text-sm font-semibold text-gray">${data.time}분</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 테스트 모드: 요일 강제 변경
function setTestDay(day) {
    if (day === null) {
        testDayOverride = null;
        alert('✅ 테스트 모드가 해제되었습니다!\n실제 오늘 날짜로 돌아갑니다.');
    } else {
        testDayOverride = day;
        alert(`🧪 테스트 모드 활성화!\n오늘을 "${day}요일"로 표시합니다.`);
    }
    loadTodayClasses();
}

// 데이터 모두 불러오기
function loadAllData() {
    loadJournals();
    loadMissions();
    loadMaterials();
    loadQuestions();
    checkAndShowStudyHelper();
    loadTimetableView();
    loadTodayClasses();
    loadWeeklyStats(); // 주간 복습 통계 추가
    loadLearningPatterns(); // 학습 패턴 분석 추가
}

