// 🌐 Google Sheets API 연동 모듈
// 이 파일을 학생 포털과 교사 대시보드에 포함시킵니다

const GOOGLE_SHEETS_CONFIG = {
    // 🔧 Google Apps Script 웹 앱 URL
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxCRKmOjkjEbSPkpjzb_RF6c-o3g9GsvHBMjFzu2YxLbac7nK_MwV2AT5VYfzFR7aP7MQ/exec',
    
    // 자동 동기화 설정
    AUTO_SYNC: true,
    SYNC_INTERVAL: 30000, // 30초마다 동기화
};

// ✅ 학습 기록 저장 (학생 포털에서 호출)
async function saveStudyRecordToCloud(record) {
    if (!GOOGLE_SHEETS_CONFIG.WEB_APP_URL || GOOGLE_SHEETS_CONFIG.WEB_APP_URL === 'YOUR_WEB_APP_URL_HERE') {
        console.warn('⚠️ Google Sheets URL이 설정되지 않았습니다. localStorage만 사용합니다.');
        return { status: 'error', message: 'Not configured' };
    }
    
    try {
        const response = await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'saveStudyRecord',
                ...record
            })
        });
        
        console.log('✅ 학습 기록이 클라우드에 저장되었습니다:', record);
        return { status: 'success' };
    } catch (error) {
        console.error('❌ 클라우드 저장 실패:', error);
        return { status: 'error', message: error.message };
    }
}

// ✅ 진단평가 결과 저장
async function saveDiagnosticToCloud(result) {
    if (!GOOGLE_SHEETS_CONFIG.WEB_APP_URL || GOOGLE_SHEETS_CONFIG.WEB_APP_URL === 'YOUR_WEB_APP_URL_HERE') {
        console.warn('⚠️ Google Sheets URL이 설정되지 않았습니다.');
        return { status: 'error', message: 'Not configured' };
    }
    
    try {
        const response = await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'saveDiagnosticResult',
                student_id: result.studentId,
                student_name: result.studentName,
                grade: result.grade,
                total_score: result.totalScore,
                level: result.level,
                math_score: result.subjectScores?.['수학']?.score || 0,
                english_score: result.subjectScores?.['영어']?.score || 0,
                korean_score: result.subjectScores?.['국어']?.score || 0,
                social_score: result.subjectScores?.['사회']?.score || 0,
                science_score: result.subjectScores?.['과학']?.score || 0,
                test_date: result.testDate
            })
        });
        
        console.log('✅ 진단평가 결과가 클라우드에 저장되었습니다');
        return { status: 'success' };
    } catch (error) {
        console.error('❌ 클라우드 저장 실패:', error);
        return { status: 'error', message: error.message };
    }
}

// 📥 학습 기록 조회 (교사 대시보드에서 호출)
async function getStudyRecordsFromCloud(studentId = null) {
    if (!GOOGLE_SHEETS_CONFIG.WEB_APP_URL || GOOGLE_SHEETS_CONFIG.WEB_APP_URL === 'YOUR_WEB_APP_URL_HERE') {
        console.warn('⚠️ Google Sheets URL이 설정되지 않았습니다.');
        return { status: 'error', data: [] };
    }
    
    try {
        const url = new URL(GOOGLE_SHEETS_CONFIG.WEB_APP_URL);
        url.searchParams.append('action', 'getStudyRecords');
        if (studentId) {
            url.searchParams.append('student_id', studentId);
        }
        
        const response = await fetch(url.toString());
        const data = await response.json();
        
        console.log('✅ 클라우드에서 학습 기록을 불러왔습니다:', data);
        return data;
    } catch (error) {
        console.error('❌ 클라우드 조회 실패:', error);
        return { status: 'error', data: [] };
    }
}

// 📥 진단평가 결과 조회
async function getDiagnosticResultsFromCloud() {
    if (!GOOGLE_SHEETS_CONFIG.WEB_APP_URL || GOOGLE_SHEETS_CONFIG.WEB_APP_URL === 'YOUR_WEB_APP_URL_HERE') {
        console.warn('⚠️ Google Sheets URL이 설정되지 않았습니다.');
        return { status: 'error', data: [] };
    }
    
    try {
        const url = new URL(GOOGLE_SHEETS_CONFIG.WEB_APP_URL);
        url.searchParams.append('action', 'getDiagnosticResults');
        
        const response = await fetch(url.toString());
        const data = await response.json();
        
        console.log('✅ 클라우드에서 진단평가 결과를 불러왔습니다');
        return data;
    } catch (error) {
        console.error('❌ 클라우드 조회 실패:', error);
        return { status: 'error', data: [] };
    }
}

// 💬 선생님 피드백 저장 (교사 대시보드에서 호출)
async function saveTeacherFeedbackToCloud(feedback) {
    if (!GOOGLE_SHEETS_CONFIG.WEB_APP_URL || GOOGLE_SHEETS_CONFIG.WEB_APP_URL === 'YOUR_WEB_APP_URL_HERE') {
        console.warn('⚠️ Google Sheets URL이 설정되지 않았습니다.');
        return { status: 'error' };
    }
    
    try {
        const response = await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'saveFeedback',
                ...feedback
            })
        });
        
        console.log('✅ 선생님 피드백이 클라우드에 저장되었습니다');
        return { status: 'success' };
    } catch (error) {
        console.error('❌ 피드백 저장 실패:', error);
        return { status: 'error', message: error.message };
    }
}

// 🤖 AI 피드백 저장 (학생 포털에서 호출)
async function saveAIFeedbackToCloud(feedback) {
    if (!GOOGLE_SHEETS_CONFIG.WEB_APP_URL || GOOGLE_SHEETS_CONFIG.WEB_APP_URL === 'YOUR_WEB_APP_URL_HERE') {
        console.warn('⚠️ Google Sheets URL이 설정되지 않았습니다.');
        return { status: 'error' };
    }
    
    try {
        const response = await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'saveAIFeedback',
                ...feedback
            })
        });
        
        console.log('✅ AI 피드백이 클라우드에 저장되었습니다');
        return { status: 'success' };
    } catch (error) {
        console.error('❌ AI 피드백 저장 실패:', error);
        return { status: 'error', message: error.message };
    }
}

// 📥 선생님 피드백 조회 (학생 포털에서 호출)
async function getTeacherFeedbackFromCloud(studentId) {
    if (!GOOGLE_SHEETS_CONFIG.WEB_APP_URL || GOOGLE_SHEETS_CONFIG.WEB_APP_URL === 'YOUR_WEB_APP_URL_HERE') {
        console.warn('⚠️ Google Sheets URL이 설정되지 않았습니다.');
        return { status: 'error', data: [] };
    }
    
    try {
        const url = new URL(GOOGLE_SHEETS_CONFIG.WEB_APP_URL);
        url.searchParams.append('action', 'getFeedback');
        url.searchParams.append('student_id', studentId);
        
        const response = await fetch(url.toString());
        const data = await response.json();
        
        console.log('✅ 선생님 피드백을 불러왔습니다:', data);
        return data;
    } catch (error) {
        console.error('❌ 피드백 조회 실패:', error);
        return { status: 'error', data: [] };
    }
}

// 🔄 자동 동기화 시작
function startAutoSync() {
    if (!GOOGLE_SHEETS_CONFIG.AUTO_SYNC) {
        console.log('ℹ️ 자동 동기화가 비활성화되어 있습니다.');
        return;
    }
    
    console.log('🔄 자동 동기화 시작...');
    
    setInterval(async () => {
        const currentStudentId = localStorage.getItem('currentStudentId');
        if (currentStudentId) {
            // 학생 포털: 선생님 피드백 확인
            const feedbackData = await getTeacherFeedbackFromCloud(currentStudentId);
            if (feedbackData.status === 'success' && feedbackData.data.length > 0) {
                // 새 피드백 알림
                showTeacherFeedbackNotification(feedbackData.data);
            }
        }
    }, GOOGLE_SHEETS_CONFIG.SYNC_INTERVAL);
}

// 📢 선생님 피드백 알림 표시
function showTeacherFeedbackNotification(feedbacks) {
    const unreadCount = feedbacks.length;
    if (unreadCount > 0) {
        console.log(`📬 새로운 선생님 피드백 ${unreadCount}개`);
        
        // 알림 표시
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            cursor: pointer;
        `;
        notification.innerHTML = `
            <div style="font-weight: 700; margin-bottom: 5px;">💬 선생님 피드백</div>
            <div style="font-size: 14px;">${unreadCount}개의 새로운 피드백이 있습니다</div>
        `;
        notification.onclick = () => {
            showTeacherFeedbackModal(feedbacks);
            notification.remove();
        };
        
        document.body.appendChild(notification);
        
        // 5초 후 자동으로 사라짐
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// 💬 선생님 피드백 모달 표시
function showTeacherFeedbackModal(feedbacks) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        padding: 20px;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    let html = `
        <h2 style="color: #667eea; margin-bottom: 20px; font-size: 24px; font-weight: 700;">
            💬 선생님 피드백
        </h2>
    `;
    
    feedbacks.forEach(feedback => {
        html += `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #667eea;">
                <div style="font-size: 12px; color: #6c757d; margin-bottom: 5px;">${feedback.date}</div>
                <div style="white-space: pre-wrap; line-height: 1.6;">${feedback.content}</div>
            </div>
        `;
    });
    
    html += `
        <button onclick="this.closest('[style*=\"fixed\"]').remove()" 
                style="width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                       color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; 
                       cursor: pointer; margin-top: 20px;">
            확인
        </button>
    `;
    
    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

console.log('✅ Google Sheets API 모듈 로드 완료');
