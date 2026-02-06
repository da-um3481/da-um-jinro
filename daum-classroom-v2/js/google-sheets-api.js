/**
 * DA.UM Classroom V2 - Google Sheets API 연동 모듈
 * 
 * 기능:
 * - 학습 일지 동기화
 * - 미션 동기화
 * - 자료실 동기화
 * - 질문 답변 동기화
 * 
 * 사용 방법:
 * 1. Google Sheets 생성
 * 2. Apps Script 배포
 * 3. WEB_APP_URL 설정
 */

// ⚠️ 설정: Google Apps Script Web App URL
// 아래 URL을 실제 배포된 Apps Script URL로 변경하세요
const WEB_APP_URL = 'YOUR_WEB_APP_URL_HERE';

// 🔧 API 설정
const API_CONFIG = {
    timeout: 30000, // 30초
    retryAttempts: 3,
    retryDelay: 1000 // 1초
};

/**
 * Google Sheets에 데이터 저장
 * @param {string} sheetName - 시트 이름 (journals, missions, materials, questions)
 * @param {object} data - 저장할 데이터
 * @returns {Promise<object>} - 응답 데이터
 */
async function saveToGoogleSheets(sheetName, data) {
    console.log(`📤 Google Sheets에 저장 시작: ${sheetName}`, data);
    
    if (WEB_APP_URL === 'YOUR_WEB_APP_URL_HERE') {
        console.warn('⚠️ Google Sheets URL이 설정되지 않았습니다. localStorage만 사용합니다.');
        return { success: false, error: 'URL not configured' };
    }
    
    try {
        const response = await fetchWithRetry(WEB_APP_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'save',
                sheetName: sheetName,
                data: data,
                timestamp: new Date().toISOString()
            })
        });
        
        const result = await response.json();
        console.log(`✅ Google Sheets 저장 완료:`, result);
        return result;
    } catch (error) {
        console.error(`❌ Google Sheets 저장 실패:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Google Sheets에서 데이터 읽기
 * @param {string} sheetName - 시트 이름
 * @param {object} filter - 필터 조건 (선택)
 * @returns {Promise<Array>} - 데이터 배열
 */
async function loadFromGoogleSheets(sheetName, filter = {}) {
    console.log(`📥 Google Sheets에서 로드 시작: ${sheetName}`, filter);
    
    if (WEB_APP_URL === 'YOUR_WEB_APP_URL_HERE') {
        console.warn('⚠️ Google Sheets URL이 설정되지 않았습니다. localStorage만 사용합니다.');
        return [];
    }
    
    try {
        const url = new URL(WEB_APP_URL);
        url.searchParams.append('action', 'load');
        url.searchParams.append('sheetName', sheetName);
        if (filter.studentName) {
            url.searchParams.append('studentName', filter.studentName);
        }
        
        const response = await fetchWithRetry(url.toString(), {
            method: 'GET',
            mode: 'cors'
        });
        
        const result = await response.json();
        console.log(`✅ Google Sheets 로드 완료: ${result.data?.length || 0}개`);
        return result.data || [];
    } catch (error) {
        console.error(`❌ Google Sheets 로드 실패:`, error);
        return [];
    }
}

/**
 * 재시도 기능이 있는 fetch
 */
async function fetchWithRetry(url, options, attempt = 1) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), API_CONFIG.timeout);
        
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
    } catch (error) {
        if (attempt < API_CONFIG.retryAttempts) {
            console.warn(`⚠️ 재시도 ${attempt}/${API_CONFIG.retryAttempts}...`);
            await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * attempt));
            return fetchWithRetry(url, options, attempt + 1);
        }
        throw error;
    }
}

/**
 * 하이브리드 저장 (LocalStorage + Google Sheets)
 */
async function hybridSave(storageKey, data, sheetName) {
    // 1. LocalStorage에 즉시 저장 (오프라인 대응)
    try {
        localStorage.setItem(storageKey, JSON.stringify(data));
        console.log(`✅ LocalStorage 저장 완료: ${storageKey}`);
    } catch (error) {
        console.error(`❌ LocalStorage 저장 실패:`, error);
    }
    
    // 2. Google Sheets에 백그라운드 저장
    try {
        const result = await saveToGoogleSheets(sheetName, data);
        if (result.success) {
            console.log(`✅ 클라우드 동기화 완료`);
        }
        return result;
    } catch (error) {
        console.error(`❌ 클라우드 동기화 실패:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * 하이브리드 로드 (Google Sheets 우선, LocalStorage 폴백)
 */
async function hybridLoad(storageKey, sheetName, filter = {}) {
    let cloudData = [];
    let localData = [];
    
    // 1. Google Sheets에서 로드 시도
    try {
        cloudData = await loadFromGoogleSheets(sheetName, filter);
        if (cloudData && cloudData.length > 0) {
            console.log(`✅ 클라우드 데이터 사용: ${cloudData.length}개`);
            // LocalStorage 업데이트
            localStorage.setItem(storageKey, JSON.stringify(cloudData));
            return cloudData;
        }
    } catch (error) {
        console.warn(`⚠️ 클라우드 로드 실패, 로컬 데이터 사용`, error);
    }
    
    // 2. LocalStorage에서 로드 (폴백)
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            localData = JSON.parse(saved);
            console.log(`✅ 로컬 데이터 사용: ${localData.length}개`);
            return localData;
        }
    } catch (error) {
        console.error(`❌ LocalStorage 로드 실패:`, error);
    }
    
    return [];
}

/**
 * 동기화 상태 체크
 */
async function checkSyncStatus() {
    if (WEB_APP_URL === 'YOUR_WEB_APP_URL_HERE') {
        return {
            connected: false,
            message: 'Google Sheets URL이 설정되지 않았습니다.',
            mode: 'offline'
        };
    }
    
    try {
        const url = new URL(WEB_APP_URL);
        url.searchParams.append('action', 'ping');
        
        const response = await fetch(url.toString(), {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (response.ok) {
            return {
                connected: true,
                message: '클라우드 동기화 활성화',
                mode: 'online'
            };
        }
    } catch (error) {
        console.warn('⚠️ Google Sheets 연결 실패, 오프라인 모드');
    }
    
    return {
        connected: false,
        message: '오프라인 모드 (LocalStorage 사용)',
        mode: 'offline'
    };
}

/**
 * 전역 함수로 노출
 */
window.GoogleSheetsAPI = {
    save: saveToGoogleSheets,
    load: loadFromGoogleSheets,
    hybridSave,
    hybridLoad,
    checkSyncStatus,
    WEB_APP_URL
};

console.log('✅ Google Sheets API 모듈 로드 완료');
