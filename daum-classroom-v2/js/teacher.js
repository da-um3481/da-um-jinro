// LocalStorage 키
const STORAGE_KEYS = {
    JOURNALS: 'daum_v2_journals',
    MISSIONS: 'daum_v2_missions',
    MATERIALS: 'daum_v2_materials',
    QUESTIONS: 'daum_v2_questions'
};

// 페이지 로드
window.addEventListener('DOMContentLoaded', () => {
    updateStats();
    loadAllData();
});

// 통계 업데이트
function updateStats() {
    const journals = getJournals();
    const questions = getQuestions();
    const missions = getMissions();

    // 고유 학생 수
    const uniqueStudents = [...new Set(journals.map(j => j.studentName))];
    document.getElementById('totalStudents').textContent = uniqueStudents.length;

    // 오늘 학습 기록
    const today = new Date().toDateString();
    const todayJournals = journals.filter(j => new Date(j.date).toDateString() === today);
    document.getElementById('todayJournals').textContent = todayJournals.length;

    // 대기 중 질문
    const pending = questions.filter(q => q.status === 'pending');
    document.getElementById('pendingQuestions').textContent = pending.length;

    // 활성 미션
    const active = missions.filter(m => m.status === 'active');
    document.getElementById('activeMissions').textContent = active.length;
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

// 학생 목록 로드
function loadStudents() {
    const journals = getJournals();
    const uniqueStudents = [...new Set(journals.map(j => j.studentName))];
    const container = document.getElementById('studentsList');

    if (uniqueStudents.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">아직 등록된 학생이 없습니다</p>';
        return;
    }

    container.innerHTML = uniqueStudents.map(name => {
        const studentJournals = journals.filter(j => j.studentName === name);
        const totalTime = studentJournals.reduce((sum, j) => sum + parseInt(j.studyTime || 0), 0);

        return `
            <div class="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition">
                <div>
                    <h4 class="font-bold text-lg">${name}</h4>
                    <p class="text-sm text-gray-600">총 학습 시간: ${totalTime}분 (${Math.floor(totalTime / 60)}시간 ${totalTime % 60}분)</p>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-blue-500">${studentJournals.length}</p>
                    <p class="text-xs text-gray-500">학습 기록</p>
                </div>
            </div>
        `;
    }).join('');
}

// 학습 기록 로드
function loadJournals() {
    const journals = getJournals();
    const filterSubject = document.getElementById('filterSubject').value;
    const container = document.getElementById('journalsList');

    let filtered = journals;
    if (filterSubject) {
        filtered = journals.filter(j => j.subject === filterSubject);
    }

    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">학습 기록이 없습니다</p>';
        return;
    }

    container.innerHTML = filtered.map(journal => `
        <div class="border rounded-lg p-4 hover:shadow-md transition">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold mr-2">${journal.subject}</span>
                    <span class="font-bold">${journal.studentName}</span>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">${formatDate(journal.date)}</p>
                    <p class="text-sm text-gray-600">⏱️ ${journal.studyTime}분</p>
                    ${journal.startTime && journal.endTime ? `
                        <p class="text-xs text-gray-400">${journal.startTime} ~ ${journal.endTime}</p>
                    ` : ''}
                </div>
            </div>
            <p class="text-gray-800 mb-2">${journal.content}</p>
            ${journal.memo ? `<p class="text-sm text-gray-600 bg-gray-50 rounded p-2 italic mb-2">💭 ${journal.memo}</p>` : ''}
            ${journal.photos && journal.photos.length > 0 ? `
                <div class="mt-3 border-t pt-3">
                    <div class="text-sm font-semibold text-gray-700 mb-2">
                        📷 첨부 사진 (${journal.photos.length})
                    </div>
                    <div class="grid grid-cols-4 gap-2">
                        ${journal.photos.map(photo => `
                            <div class="relative group">
                                <img src="${photo.data}" class="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-75 transition" onclick="viewPhotoModal('${photo.data}', '${photo.name}')">
                                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b opacity-0 group-hover:opacity-100 transition truncate">
                                    ${photo.name}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// 사진 확대 모달 (교사용)
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
                <h3 class="font-bold">${photoName || '첨부 사진'}</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-4">
                <img src="${photoData}" class="max-w-full h-auto">
            </div>
            <div class="p-4 border-t flex justify-end gap-2">
                <a href="${photoData}" download="${photoName || 'photo.jpg'}" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    <i class="fas fa-download mr-2"></i>다운로드
                </a>
                <button onclick="this.closest('.fixed').remove()" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    닫기
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 미션 폼 표시/숨기기
function showMissionForm() {
    document.getElementById('missionForm').classList.remove('hidden');
    
    // 오늘 날짜로 초기화
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('missionStart').value = today;
    
    // 1주일 후 날짜
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    document.getElementById('missionEnd').value = nextWeek.toISOString().split('T')[0];
}

function hideMissionForm() {
    document.getElementById('missionForm').classList.add('hidden');
    document.getElementById('missionTitle').value = '';
    document.getElementById('missionDesc').value = '';
}

// 미션 저장
function saveMission() {
    const title = document.getElementById('missionTitle').value.trim();
    const description = document.getElementById('missionDesc').value.trim();
    const startDate = document.getElementById('missionStart').value;
    const endDate = document.getElementById('missionEnd').value;

    if (!title || !description) {
        alert('제목과 설명을 입력해주세요');
        return;
    }

    const mission = {
        id: Date.now(),
        title: title,
        description: description,
        startDate: startDate,
        endDate: endDate,
        status: 'active',
        createdAt: new Date().toISOString()
    };

    const missions = getMissions();
    missions.unshift(mission);
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));

    hideMissionForm();
    alert('✅ 미션이 생성되었습니다!');
    loadMissions();
    updateStats();
}

// 미션 목록 로드
function loadMissions() {
    const missions = getMissions();
    const container = document.getElementById('missionsList');

    if (missions.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">아직 미션이 없습니다</p>';
        return;
    }

    container.innerHTML = missions.map(mission => `
        <div class="border rounded-lg p-4 hover:shadow-md transition">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-lg">${mission.title}</h4>
                <div class="flex gap-2">
                    <span class="inline-block ${mission.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-3 py-1 rounded-full text-xs font-semibold">
                        ${mission.status === 'active' ? '진행중' : '종료'}
                    </span>
                    ${mission.status === 'active' ? 
                        `<button onclick="endMission(${mission.id})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-stop-circle"></i>
                        </button>` : ''
                    }
                </div>
            </div>
            <p class="text-gray-600 mb-2">${mission.description}</p>
            <p class="text-sm text-gray-500">📅 ${mission.startDate} ~ ${mission.endDate}</p>
        </div>
    `).join('');
}

// 미션 종료
function endMission(missionId) {
    if (!confirm('이 미션을 종료하시겠습니까?')) return;

    const missions = getMissions();
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
        mission.status = 'ended';
        localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
        loadMissions();
        updateStats();
    }
}

// 자료 폼 표시/숨기기
function showMaterialForm() {
    document.getElementById('materialForm').classList.remove('hidden');
}

function hideMaterialForm() {
    document.getElementById('materialForm').classList.add('hidden');
    document.getElementById('materialTitle').value = '';
    document.getElementById('materialUrl').value = '';
}

// 자료 저장
function saveMaterial() {
    const title = document.getElementById('materialTitle').value.trim();
    const subject = document.getElementById('materialSubject').value;
    const type = document.getElementById('materialType').value;
    const url = document.getElementById('materialUrl').value.trim();

    if (!title || !url) {
        alert('제목과 URL을 입력해주세요');
        return;
    }

    const material = {
        id: Date.now(),
        title: title,
        subject: subject,
        type: type,
        url: url,
        createdAt: new Date().toISOString()
    };

    const materials = getMaterials();
    materials.unshift(material);
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));

    hideMaterialForm();
    alert('✅ 자료가 추가되었습니다!');
    loadMaterials();
}

// 자료 목록 로드
function loadMaterials() {
    const materials = getMaterials();
    const container = document.getElementById('materialsList');

    if (materials.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8 col-span-3">아직 자료가 없습니다</p>';
        return;
    }

    container.innerHTML = materials.map(material => `
        <div class="border rounded-lg p-4 hover:shadow-md transition">
            <div class="flex items-center mb-3">
                <i class="fas fa-file-${getFileIcon(material.type)} text-3xl text-blue-500 mr-3"></i>
                <div class="flex-1">
                    <h4 class="font-bold">${material.title}</h4>
                    <p class="text-sm text-gray-500">${material.subject}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="window.open('${material.url}', '_blank')" class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition text-sm">
                    <i class="fas fa-external-link-alt mr-1"></i>열기
                </button>
                <button onclick="deleteMaterial(${material.id})" class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 자료 삭제
function deleteMaterial(materialId) {
    if (!confirm('이 자료를 삭제하시겠습니까?')) return;

    const materials = getMaterials().filter(m => m.id !== materialId);
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
    loadMaterials();
}

// 질문 목록 로드
function loadQuestions() {
    const questions = getQuestions();
    const container = document.getElementById('questionsList');

    if (questions.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">아직 질문이 없습니다</p>';
        return;
    }

    container.innerHTML = questions.map(question => `
        <div class="border rounded-lg p-4 hover:shadow-md transition">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <span class="font-bold">${question.studentName}</span>
                    <span class="text-sm text-gray-500 ml-2">${formatDate(question.date)}</span>
                </div>
                <span class="inline-block ${question.status === 'answered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} px-3 py-1 rounded-full text-xs font-semibold">
                    ${question.status === 'answered' ? '답변완료' : '대기중'}
                </span>
            </div>
            
            <div class="bg-gray-50 rounded p-3 mb-3">
                <p class="font-semibold mb-1">Q. ${question.question}</p>
                ${question.photo ? `
                    <div class="mt-3 border-t pt-3">
                        <p class="text-xs text-gray-600 mb-2">📷 첨부된 문제 사진:</p>
                        <img src="${question.photo.data}" class="max-w-md rounded border cursor-pointer hover:opacity-75 transition" onclick="viewPhotoModal('${question.photo.data}', '${question.photo.name}')">
                    </div>
                ` : ''}
            </div>

            ${question.status === 'pending' ? `
                <div class="mb-3">
                    <textarea id="answer-${question.id}" rows="3" class="w-full px-4 py-2 border rounded-lg" placeholder="답변을 입력하세요"></textarea>
                </div>
                <button onclick="answerQuestion(${question.id})" class="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition">
                    <i class="fas fa-paper-plane mr-2"></i>답변하기
                </button>
            ` : `
                <div class="bg-purple-50 rounded p-3">
                    <p class="text-sm"><strong>A.</strong> ${question.answer}</p>
                </div>
            `}
        </div>
    `).join('');
}

// 질문 답변
function answerQuestion(questionId) {
    const answerText = document.getElementById(`answer-${questionId}`).value.trim();
    
    if (!answerText) {
        alert('답변을 입력해주세요');
        return;
    }

    const questions = getQuestions();
    const question = questions.find(q => q.id === questionId);
    
    if (question) {
        question.answer = answerText;
        question.status = 'answered';
        question.answeredAt = new Date().toISOString();
        
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
        
        alert('✅ 답변이 등록되었습니다!');
        loadQuestions();
        updateStats();
    }
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

// 모든 데이터 로드
function loadAllData() {
    loadStudents();
    loadJournals();
    loadMissions();
    loadMaterials();
    loadQuestions();
}
