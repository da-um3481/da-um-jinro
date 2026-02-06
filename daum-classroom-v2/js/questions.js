/**
 * DA.UM Classroom V2 - 질문 답변 시스템
 * 
 * 기능:
 * - 학생: 질문 작성 및 제출
 * - 학생: 사진 첨부 (문제 사진 등)
 * - 교사: 질문 목록 보기
 * - 교사: 답변 작성
 * - 실시간 동기화 (Google Sheets)
 */

// 질문 상태
const QUESTION_STATUS = {
    PENDING: 'pending',    // 답변 대기
    ANSWERED: 'answered',  // 답변 완료
    CLOSED: 'closed'       // 종료
};

/**
 * 질문 제출 (학생)
 */
async function submitQuestion() {
    const studentName = localStorage.getItem('currentStudentName');
    if (!studentName) {
        alert('❌ 로그인이 필요합니다.');
        return;
    }
    
    const questionText = document.getElementById('questionText')?.value.trim();
    const questionSubject = document.getElementById('questionSubject')?.value || '기타';
    
    if (!questionText) {
        alert('❌ 질문 내용을 입력해주세요.');
        return;
    }
    
    // 질문 데이터 생성
    const questionData = {
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        studentName: studentName,
        subject: questionSubject,
        question: questionText,
        photos: getUploadedPhotos(), // photo-upload.js에서 가져옴
        answer: '',
        answeredBy: '',
        answeredAt: '',
        status: QUESTION_STATUS.PENDING,
        createdAt: new Date().toISOString()
    };
    
    try {
        // 하이브리드 저장
        let questions = JSON.parse(localStorage.getItem('daum_v2_questions') || '[]');
        questions.unshift(questionData); // 최신순
        
        await window.GoogleSheetsAPI.hybridSave(
            'daum_v2_questions',
            questions,
            'questions'
        );
        
        // UI 초기화
        document.getElementById('questionText').value = '';
        if (typeof resetPhotos === 'function') {
            resetPhotos();
        }
        
        alert('✅ 질문이 제출되었습니다!\n선생님이 답변을 작성하면 알려드릴게요.');
        
        // 질문 목록 새로고침
        loadMyQuestions();
        
        console.log('✅ 질문 제출 완료:', questionData);
    } catch (error) {
        console.error('❌ 질문 제출 실패:', error);
        alert('❌ 질문 제출에 실패했습니다. 다시 시도해주세요.');
    }
}

/**
 * 내 질문 목록 로드 (학생)
 */
async function loadMyQuestions() {
    const studentName = localStorage.getItem('currentStudentName');
    if (!studentName) return;
    
    const container = document.getElementById('myQuestionsList');
    if (!container) return;
    
    try {
        // 하이브리드 로드
        const questions = await window.GoogleSheetsAPI.hybridLoad(
            'daum_v2_questions',
            'questions',
            { studentName: studentName }
        );
        
        // 내 질문만 필터링
        const myQuestions = questions.filter(q => q.studentName === studentName);
        
        if (myQuestions.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 md:py-12">
                    <div class="text-4xl md:text-6xl mb-3 md:mb-4">💭</div>
                    <p class="text-base md:text-lg font-bold text-gray-600">
                        아직 질문이 없어요.<br>궁금한 것을 물어보세요!
                    </p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        myQuestions.forEach(question => {
            const questionCard = createQuestionCard(question, 'student');
            container.appendChild(questionCard);
        });
        
        console.log(`✅ 내 질문 로드 완료: ${myQuestions.length}개`);
    } catch (error) {
        console.error('❌ 질문 로드 실패:', error);
    }
}

/**
 * 모든 질문 로드 (교사)
 */
async function loadAllQuestions(filterStatus = 'all') {
    const container = document.getElementById('allQuestionsList');
    if (!container) return;
    
    try {
        const questions = await window.GoogleSheetsAPI.hybridLoad(
            'daum_v2_questions',
            'questions'
        );
        
        // 필터 적용
        let filteredQuestions = questions;
        if (filterStatus !== 'all') {
            filteredQuestions = questions.filter(q => q.status === filterStatus);
        }
        
        if (filteredQuestions.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 md:py-12">
                    <div class="text-4xl md:text-6xl mb-3 md:mb-4">📭</div>
                    <p class="text-base md:text-lg font-bold text-gray-600">
                        ${filterStatus === 'pending' ? '답변 대기 중인 질문이 없습니다.' : '질문이 없습니다.'}
                    </p>
                </div>
            `;
            return;
        }
        
        // 통계 업데이트
        updateQuestionStats(questions);
        
        container.innerHTML = '';
        
        filteredQuestions.forEach(question => {
            const questionCard = createQuestionCard(question, 'teacher');
            container.appendChild(questionCard);
        });
        
        console.log(`✅ 질문 로드 완료: ${filteredQuestions.length}개`);
    } catch (error) {
        console.error('❌ 질문 로드 실패:', error);
    }
}

/**
 * 질문 카드 생성
 */
function createQuestionCard(question, viewMode) {
    const card = document.createElement('div');
    card.className = 'cute-card p-4 md:p-6';
    
    // 상태 배지
    let statusBadge = '';
    if (question.status === QUESTION_STATUS.PENDING) {
        statusBadge = '<span class="badge bg-yellow-100 text-yellow-700">답변 대기</span>';
    } else if (question.status === QUESTION_STATUS.ANSWERED) {
        statusBadge = '<span class="badge bg-green-100 text-green-700">답변 완료</span>';
    } else {
        statusBadge = '<span class="badge bg-gray-100 text-gray-700">종료</span>';
    }
    
    // 과목 배지
    const subjectClass = {
        '국어': 'subject-korean',
        '영어': 'subject-english',
        '수학': 'subject-math',
        '과학': 'subject-science',
        '사회': 'subject-social'
    }[question.subject] || 'bg-gray-100 text-gray-700';
    
    // 사진 표시
    let photosHtml = '';
    if (question.photos && question.photos.length > 0) {
        photosHtml = `
            <div class="mt-3 md:mt-4">
                <div class="text-sm font-bold text-gray-700 mb-2">📷 첨부 사진 (${question.photos.length})</div>
                <div class="grid grid-cols-3 gap-2 md:gap-3" id="photos_${question.id}">
                    ${question.photos.map(photo => `
                        <img 
                            src="${photo.base64}" 
                            alt="${photo.filename}"
                            class="w-full h-20 md:h-24 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition"
                            onclick="viewPhotoFullSize('${photo.id}')"
                        >
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // 답변 표시
    let answerHtml = '';
    if (question.status === QUESTION_STATUS.ANSWERED && question.answer) {
        const answeredDate = new Date(question.answeredAt).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        answerHtml = `
            <div class="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                <div class="flex items-center gap-2 mb-2">
                    <div class="text-lg md:text-xl">💡</div>
                    <div class="text-sm md:text-base font-black text-dark">선생님 답변</div>
                </div>
                <div class="text-sm md:text-base text-dark font-semibold mb-2 whitespace-pre-wrap">${question.answer}</div>
                <div class="text-xs text-gray-600 font-semibold">
                    ${question.answeredBy} • ${answeredDate}
                </div>
            </div>
        `;
    }
    
    // 답변 버튼 (교사 전용)
    let actionButton = '';
    if (viewMode === 'teacher' && question.status === QUESTION_STATUS.PENDING) {
        actionButton = `
            <button 
                onclick="showAnswerModal('${question.id}')"
                class="w-full md:w-auto bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:from-blue-700 hover:to-teal-600 transition cute-btn font-bold text-sm md:text-base shadow-lg"
            >
                <span class="text-base md:text-lg mr-1 md:mr-2">✏️</span>답변하기
            </button>
        `;
    }
    
    const createdDate = new Date(question.createdAt).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    card.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start gap-3 md:gap-4 mb-3 md:mb-4">
            <div class="flex items-center gap-2 md:gap-3 flex-wrap">
                <span class="badge ${subjectClass}">${question.subject}</span>
                ${statusBadge}
                ${viewMode === 'teacher' ? `<span class="text-sm md:text-base font-bold text-dark">${question.studentName}</span>` : ''}
            </div>
            <div class="text-xs md:text-sm text-gray-600 font-semibold">
                ${createdDate}
            </div>
        </div>
        
        <div class="mb-3 md:mb-4">
            <div class="text-base md:text-lg font-bold text-dark mb-2">❓ 질문</div>
            <div class="text-sm md:text-base text-dark font-semibold whitespace-pre-wrap">${question.question}</div>
        </div>
        
        ${photosHtml}
        ${answerHtml}
        
        ${actionButton ? `<div class="mt-4 md:mt-6">${actionButton}</div>` : ''}
    `;
    
    return card;
}

/**
 * 답변 모달 표시 (교사)
 */
function showAnswerModal(questionId) {
    const questions = JSON.parse(localStorage.getItem('daum_v2_questions') || '[]');
    const question = questions.find(q => q.id === questionId);
    
    if (!question) {
        alert('❌ 질문을 찾을 수 없습니다.');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 md:p-4';
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- 헤더 -->
            <div class="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 text-white p-4 md:p-6 rounded-t-2xl md:rounded-t-3xl sticky top-0">
                <div class="flex justify-between items-center">
                    <div>
                        <div class="text-2xl md:text-3xl font-black mb-1 md:mb-2">답변 작성 ✏️</div>
                        <div class="text-sm md:text-base opacity-90">${question.studentName} 학생의 질문</div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="text-white hover:bg-white hover:bg-opacity-30 rounded-full w-10 h-10 flex items-center justify-center transition text-xl font-bold">
                        ❌
                    </button>
                </div>
            </div>
            
            <!-- 바디 -->
            <div class="p-4 md:p-6">
                <div class="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-xl">
                    <div class="text-sm md:text-base font-bold text-gray-700 mb-2">질문 내용</div>
                    <div class="text-sm md:text-base text-dark font-semibold whitespace-pre-wrap">${question.question}</div>
                </div>
                
                <div class="mb-4 md:mb-6">
                    <label class="block text-base md:text-lg font-black mb-2 md:mb-3 text-dark">💡 답변 작성</label>
                    <textarea 
                        id="answerText_${questionId}"
                        rows="6"
                        class="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition text-sm md:text-base font-semibold"
                        placeholder="학생에게 도움이 되는 답변을 작성해주세요 😊"
                    ></textarea>
                </div>
                
                <div class="flex flex-col md:flex-row gap-2 md:gap-3">
                    <button 
                        onclick="submitAnswer('${questionId}')"
                        class="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 md:py-4 rounded-full hover:from-blue-700 hover:to-teal-600 transition cute-btn font-black text-base md:text-lg shadow-lg"
                    >
                        <span class="text-lg md:text-xl mr-2">✅</span>답변 제출
                    </button>
                    <button 
                        onclick="this.closest('.fixed').remove()"
                        class="px-4 md:px-6 py-3 md:py-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition font-bold text-sm md:text-base"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * 답변 제출 (교사)
 */
async function submitAnswer(questionId) {
    const teacherName = localStorage.getItem('teacherName') || '선생님';
    const answerText = document.getElementById(`answerText_${questionId}`)?.value.trim();
    
    if (!answerText) {
        alert('❌ 답변 내용을 입력해주세요.');
        return;
    }
    
    try {
        // 질문 목록 로드
        let questions = JSON.parse(localStorage.getItem('daum_v2_questions') || '[]');
        const questionIndex = questions.findIndex(q => q.id === questionId);
        
        if (questionIndex === -1) {
            alert('❌ 질문을 찾을 수 없습니다.');
            return;
        }
        
        // 답변 업데이트
        questions[questionIndex].answer = answerText;
        questions[questionIndex].answeredBy = teacherName;
        questions[questionIndex].answeredAt = new Date().toISOString();
        questions[questionIndex].status = QUESTION_STATUS.ANSWERED;
        
        // 하이브리드 저장
        await window.GoogleSheetsAPI.hybridSave(
            'daum_v2_questions',
            questions,
            'questions'
        );
        
        alert('✅ 답변이 등록되었습니다!');
        
        // 모달 닫기
        document.querySelector('.fixed')?.remove();
        
        // 목록 새로고침
        loadAllQuestions();
        
        console.log('✅ 답변 제출 완료:', questionId);
    } catch (error) {
        console.error('❌ 답변 제출 실패:', error);
        alert('❌ 답변 제출에 실패했습니다. 다시 시도해주세요.');
    }
}

/**
 * 질문 통계 업데이트 (교사 대시보드)
 */
function updateQuestionStats(questions) {
    const totalQuestions = questions.length;
    const pendingQuestions = questions.filter(q => q.status === QUESTION_STATUS.PENDING).length;
    const answeredQuestions = questions.filter(q => q.status === QUESTION_STATUS.ANSWERED).length;
    
    const totalEl = document.getElementById('totalQuestions');
    const pendingEl = document.getElementById('pendingQuestions');
    const answeredEl = document.getElementById('answeredQuestions');
    
    if (totalEl) totalEl.textContent = totalQuestions;
    if (pendingEl) pendingEl.textContent = pendingQuestions;
    if (answeredEl) answeredEl.textContent = answeredQuestions;
}

/**
 * 질문 필터 변경
 */
function filterQuestions(status) {
    // 버튼 활성화 상태 변경
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 질문 목록 새로고침
    loadAllQuestions(status);
}

console.log('✅ 질문 답변 시스템 로드 완료');
