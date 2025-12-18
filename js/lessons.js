// 수업 관리 스크립트

let currentEditId = null;
let deleteLessonId = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadLessons();
    setupFormHandler();
    setTodayDate();
});

// 오늘 날짜 설정
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    document.getElementById('searchDate').value = today;
}

// 폼 이벤트 핸들러 설정
function setupFormHandler() {
    document.getElementById('lessonForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveLesson();
    });
}

// 수업 내용 목록 로드 (localStorage 기반)
async function loadLessons() {
    try {
        let lessons = JSON.parse(localStorage.getItem('lessons')) || [];
        
        // 날짜순 정렬 (최신순)
        lessons.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 필터 적용
        const filterGrade = document.getElementById('filterGrade')?.value;
        const filterSubject = document.getElementById('filterSubject')?.value;
        
        if (filterGrade) {
            lessons = lessons.filter(l => l.grade == filterGrade);
        }
        if (filterSubject) {
            lessons = lessons.filter(l => l.subject === filterSubject);
        }
        
        displayLessons(lessons);
    } catch (error) {
        console.error('수업 목록 로드 오류:', error);
        alert('수업 목록을 불러오는데 실패했습니다.');
    }
}

// 수업 내용 표시
function displayLessons(lessons) {
    const container = document.getElementById('lessonsList');
    
    if (lessons.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                등록된 수업 내용이 없습니다.
            </div>
        `;
        return;
    }
    
    const subjectColors = {
        '국어': 'red',
        '영어': 'blue',
        '수학': 'green',
        '과학': 'purple',
        '사회': 'orange'
    };
    
    const importanceBadges = {
        '높음': '<span class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">⭐ 높음</span>',
        '보통': '<span class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">보통</span>',
        '낮음': '<span class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">낮음</span>'
    };
    
    container.innerHTML = lessons.map(lesson => {
        const color = subjectColors[lesson.subject] || 'gray';
        
        return `
            <div class="border-l-4 border-${color}-500 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <h3 class="text-lg font-semibold text-${color}-700">${lesson.subject}</h3>
                            ${importanceBadges[lesson.importance]}
                            <span class="text-sm text-gray-500">${lesson.grade}학년</span>
                            <span class="text-sm text-gray-500">${formatDate(lesson.date)}</span>
                        </div>
                        ${lesson.chapter ? `<p class="text-sm text-gray-600 mb-2">📖 ${lesson.chapter}</p>` : ''}
                        <p class="text-gray-700">${lesson.content}</p>
                    </div>
                    <div class="flex space-x-2 ml-4">
                        <button onclick="editLesson('${lesson.id}')" class="text-green-600 hover:text-green-900" title="수정">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="showDeleteModal('${lesson.id}')" class="text-red-600 hover:text-red-900" title="삭제">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 수업 내용 저장 (localStorage 기반)
async function saveLesson() {
    try {
        const lessons = JSON.parse(localStorage.getItem('lessons')) || [];
        
        const lessonData = {
            id: currentEditId || 'lesson_' + Date.now(),
            date: document.getElementById('date').value,
            grade: parseInt(document.getElementById('grade').value),
            subject: document.getElementById('subject').value,
            chapter: document.getElementById('chapter').value,
            importance: document.getElementById('importance').value,
            content: document.getElementById('content').value,
            created_at: currentEditId ? lessons.find(l => l.id === currentEditId)?.created_at : new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        if (currentEditId) {
            // 수정
            const index = lessons.findIndex(l => l.id === currentEditId);
            if (index !== -1) {
                lessons[index] = lessonData;
            }
            alert('수업 내용이 수정되었습니다.');
            currentEditId = null;
        } else {
            // 신규 등록
            lessons.push(lessonData);
            alert('수업 내용이 등록되었습니다.');
        }
        
        localStorage.setItem('lessons', JSON.stringify(lessons));
        resetForm();
        loadLessons();
        
    } catch (error) {
        console.error('수업 내용 저장 오류:', error);
        alert('수업 내용 저장에 실패했습니다.');
    }
}

// 수업 내용 수정
async function editLesson(lessonId) {
    try {
        const lessons = JSON.parse(localStorage.getItem('lessons')) || [];
        const lesson = lessons.find(l => l.id === lessonId);
        
        if (!lesson) {
            alert('수업 내용을 찾을 수 없습니다.');
            return;
        }
        
        document.getElementById('date').value = lesson.date;
        document.getElementById('grade').value = lesson.grade;
        document.getElementById('subject').value = lesson.subject;
        document.getElementById('chapter').value = lesson.chapter || '';
        document.getElementById('importance').value = lesson.importance;
        document.getElementById('content').value = lesson.content;
        
        currentEditId = lessonId;
        
        // 폼으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('수업 내용 로드 오류:', error);
        alert('수업 내용을 불러오는데 실패했습니다.');
    }
}

// 날짜별 검색 (localStorage 기반)
async function searchByDate() {
    const searchDate = document.getElementById('searchDate').value;
    if (!searchDate) {
        alert('날짜를 선택해주세요.');
        return;
    }
    
    try {
        const allLessons = JSON.parse(localStorage.getItem('lessons')) || [];
        const lessons = allLessons.filter(l => l.date === searchDate);
        displayLessons(lessons);
        
        if (lessons.length === 0) {
            alert('해당 날짜의 수업 내용이 없습니다.');
        }
    } catch (error) {
        console.error('검색 오류:', error);
        alert('검색에 실패했습니다.');
    }
}

// 삭제 모달 표시
function showDeleteModal(lessonId) {
    deleteLessonId = lessonId;
    document.getElementById('deleteModal').classList.remove('hidden');
    
    document.getElementById('confirmDeleteBtn').onclick = async function() {
        await deleteLesson(deleteLessonId);
        closeDeleteModal();
    };
}

// 삭제 모달 닫기
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
    deleteLessonId = null;
}

// 수업 내용 삭제 (localStorage 기반)
async function deleteLesson(lessonId) {
    try {
        const lessons = JSON.parse(localStorage.getItem('lessons')) || [];
        const updatedLessons = lessons.filter(l => l.id !== lessonId);
        
        localStorage.setItem('lessons', JSON.stringify(updatedLessons));
        alert('수업 내용이 삭제되었습니다.');
        loadLessons();
    } catch (error) {
        console.error('수업 내용 삭제 오류:', error);
        alert('수업 내용 삭제에 실패했습니다.');
    }
}

// 폼 초기화
function resetForm() {
    document.getElementById('lessonForm').reset();
    currentEditId = null;
    setTodayDate();
}

// 유틸리티 함수
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
    return date.toLocaleDateString('ko-KR', options);
}
