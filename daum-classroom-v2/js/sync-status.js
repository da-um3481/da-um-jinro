/**
 * DA.UM Classroom V2 - 동기화 상태 관리
 */

// 동기화 상태 체크 (페이지 로드 시)
async function initializeSyncStatus() {
    const syncStatusDiv = document.getElementById('syncStatus');
    const syncIcon = document.getElementById('syncIcon');
    const syncText = document.getElementById('syncText');
    
    if (!syncStatusDiv) return;
    
    // 동기화 상태 체크
    const status = await window.GoogleSheetsAPI.checkSyncStatus();
    
    // UI 업데이트
    syncStatusDiv.classList.remove('hidden');
    
    if (status.connected) {
        syncIcon.textContent = '☁️';
        syncText.textContent = '온라인';
        syncStatusDiv.classList.add('bg-green-100', 'text-green-700');
        syncStatusDiv.classList.remove('bg-gray-100', 'text-gray-700');
        syncStatusDiv.title = status.message;
    } else {
        syncIcon.textContent = '📱';
        syncText.textContent = '오프라인';
        syncStatusDiv.classList.add('bg-gray-100', 'text-gray-700');
        syncStatusDiv.classList.remove('bg-green-100', 'text-green-700');
        syncStatusDiv.title = status.message;
    }
    
    console.log('🔄 동기화 상태:', status);
}

// 수동으로 동기화 상태 체크
async function checkSyncStatusManually() {
    const syncIcon = document.getElementById('syncIcon');
    const originalIcon = syncIcon.textContent;
    
    // 로딩 표시
    syncIcon.textContent = '⏳';
    
    try {
        const status = await window.GoogleSheetsAPI.checkSyncStatus();
        
        alert(`📊 동기화 상태\n\n${status.message}\n모드: ${status.mode === 'online' ? '온라인 (클라우드 동기화)' : '오프라인 (로컬 저장)'}`);
        
        // 상태 업데이트
        await initializeSyncStatus();
    } catch (error) {
        console.error('동기화 상태 체크 실패:', error);
        syncIcon.textContent = originalIcon;
    }
}

// 페이지 로드 시 자동 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSyncStatus);
} else {
    initializeSyncStatus();
}
