/* ============================================
   DA.UM 학생 포털 - 백업/내보내기 시스템
   ============================================ */

class BackupSystem {
    constructor() {
        this.storageKeys = [
            'classes',
            'study-records',
            'studySessions',
            'statistics',
            'app-theme',
            'app-color-theme',
            'notification-settings',
            'streak-data',
            'pomodoro-settings',
            'offline-queue',
            'notifications',
            'unread-count',
            'CUSTOM_SUBJECTS'
        ];
        this.init();
    }
    
    init() {
        this.createBackupUI();
        this.addBackupStyles();
        this.attachBackupEvents();
        console.log('✅ 백업 시스템 초기화');
    }
    
    // UI 생성
    createBackupUI() {
        // 플로팅 백업 버튼
        const backupBtn = document.createElement('button');
        backupBtn.id = 'backup-btn';
        backupBtn.className = 'floating-backup-btn';
        backupBtn.innerHTML = '💾';
        backupBtn.setAttribute('aria-label', '백업');
        document.body.appendChild(backupBtn);
        
        // 백업 모달
        const modal = document.createElement('div');
        modal.id = 'backup-modal';
        modal.className = 'backup-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="backup-modal-content">
                <div class="backup-modal-header">
                    <h3 class="text-xl font-bold">💾 데이터 백업 & 복원</h3>
                    <button class="backup-close-btn" id="backup-close">✕</button>
                </div>
                
                <div class="backup-modal-body">
                    <!-- 백업 섹션 -->
                    <div class="backup-section">
                        <h4 class="backup-section-title">📦 백업 생성</h4>
                        <p class="backup-section-desc">
                            모든 학습 데이터, 시간표, 설정을 백업 파일로 저장합니다.
                        </p>
                        <div class="backup-actions">
                            <button id="create-backup" class="backup-btn backup-btn-primary">
                                💾 백업 파일 생성
                            </button>
                        </div>
                    </div>
                    
                    <!-- 내보내기 섹션 -->
                    <div class="backup-section">
                        <h4 class="backup-section-title">📤 데이터 내보내기</h4>
                        <p class="backup-section-desc">
                            학습 데이터를 다양한 형식으로 내보낼 수 있습니다.
                        </p>
                        <div class="backup-export-grid">
                            <button id="export-json" class="backup-export-btn">
                                <span class="backup-export-icon">📄</span>
                                <span class="backup-export-label">JSON</span>
                            </button>
                            <button id="export-csv" class="backup-export-btn">
                                <span class="backup-export-icon">📊</span>
                                <span class="backup-export-label">CSV</span>
                            </button>
                            <button id="export-excel" class="backup-export-btn" disabled title="곧 제공 예정">
                                <span class="backup-export-icon">📗</span>
                                <span class="backup-export-label">Excel</span>
                            </button>
                            <button id="export-pdf" class="backup-export-btn" disabled title="곧 제공 예정">
                                <span class="backup-export-icon">📕</span>
                                <span class="backup-export-label">PDF</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- 복원 섹션 -->
                    <div class="backup-section">
                        <h4 class="backup-section-title">📥 백업 복원</h4>
                        <p class="backup-section-desc">
                            백업 파일을 업로드하여 데이터를 복원합니다.
                        </p>
                        <div class="backup-restore-area" id="restore-area">
                            <input type="file" id="restore-file" accept=".backup,.json" style="display: none;">
                            <div class="backup-restore-dropzone">
                                <div class="backup-restore-icon">📁</div>
                                <div class="backup-restore-text">
                                    <strong>파일을 여기에 드래그하거나 클릭하세요</strong>
                                    <span>(.backup 또는 .json 파일)</span>
                                </div>
                            </div>
                        </div>
                        <button id="restore-backup" class="backup-btn backup-btn-secondary" style="display: none;">
                            🔄 백업 복원하기
                        </button>
                    </div>
                    
                    <!-- 자동 백업 설정 -->
                    <div class="backup-section">
                        <h4 class="backup-section-title">⚙️ 자동 백업 설정</h4>
                        <div class="backup-auto-settings">
                            <label class="backup-toggle-label">
                                <input type="checkbox" id="auto-backup-toggle" />
                                <span class="backup-toggle-text">자동 백업 활성화</span>
                            </label>
                            <div class="backup-frequency-settings" id="backup-frequency-settings" style="display: none;">
                                <label class="backup-label">백업 주기:</label>
                                <select id="backup-frequency" class="backup-select">
                                    <option value="daily">매일</option>
                                    <option value="weekly">매주</option>
                                    <option value="monthly">매월</option>
                                </select>
                            </div>
                        </div>
                        <div class="backup-last-time" id="last-backup-time">
                            마지막 백업: 없음
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // 이벤트 연결
    attachBackupEvents() {
        // 백업 버튼 클릭
        const backupBtn = document.getElementById('backup-btn');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => this.openModal());
        }
        
        // 모달 닫기
        const closeBtn = document.getElementById('backup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // 백업 생성
        const createBtn = document.getElementById('create-backup');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.createBackup());
        }
        
        // 내보내기 버튼들
        document.getElementById('export-json')?.addEventListener('click', () => this.exportJSON());
        document.getElementById('export-csv')?.addEventListener('click', () => this.exportCSV());
        document.getElementById('export-excel')?.addEventListener('click', () => this.exportExcel());
        document.getElementById('export-pdf')?.addEventListener('click', () => this.exportPDF());
        
        // 복원 영역
        const restoreArea = document.getElementById('restore-area');
        const fileInput = document.getElementById('restore-file');
        
        if (restoreArea && fileInput) {
            restoreArea.addEventListener('click', () => fileInput.click());
            
            // 드래그 앤 드롭
            restoreArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                restoreArea.classList.add('dragover');
            });
            
            restoreArea.addEventListener('dragleave', () => {
                restoreArea.classList.remove('dragover');
            });
            
            restoreArea.addEventListener('drop', (e) => {
                e.preventDefault();
                restoreArea.classList.remove('dragover');
                
                const file = e.dataTransfer.files[0];
                if (file) {
                    this.handleFileSelect(file);
                }
            });
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFileSelect(file);
                }
            });
        }
        
        // 복원 버튼
        const restoreBtn = document.getElementById('restore-backup');
        if (restoreBtn) {
            restoreBtn.addEventListener('click', () => this.restoreBackup());
        }
        
        // 자동 백업 토글
        const autoBackupToggle = document.getElementById('auto-backup-toggle');
        if (autoBackupToggle) {
            autoBackupToggle.addEventListener('change', (e) => {
                this.toggleAutoBackup(e.target.checked);
            });
            
            // 설정 로드
            const autoBackupEnabled = localStorage.getItem('auto-backup-enabled') === 'true';
            autoBackupToggle.checked = autoBackupEnabled;
            if (autoBackupEnabled) {
                document.getElementById('backup-frequency-settings').style.display = 'block';
            }
        }
        
        // 백업 주기 변경
        const frequencySelect = document.getElementById('backup-frequency');
        if (frequencySelect) {
            frequencySelect.addEventListener('change', (e) => {
                this.setBackupFrequency(e.target.value);
            });
            
            // 설정 로드
            const frequency = localStorage.getItem('backup-frequency') || 'weekly';
            frequencySelect.value = frequency;
        }
        
        // 마지막 백업 시간 표시
        this.updateLastBackupTime();
    }
    
    // 모달 열기
    openModal() {
        const modal = document.getElementById('backup-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    // 모달 닫기
    closeModal() {
        const modal = document.getElementById('backup-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // 백업 생성
    createBackup() {
        try {
            if (typeof showLoading === 'function') showLoading();
            
            const backupData = {
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                data: {}
            };
            
            // 모든 localStorage 데이터 수집
            this.storageKeys.forEach(key => {
                const value = localStorage.getItem(key);
                if (value !== null) {
                    try {
                        backupData.data[key] = JSON.parse(value);
                    } catch {
                        backupData.data[key] = value;
                    }
                }
            });
            
            // 파일 다운로드
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const timestamp = new Date().toISOString().split('T')[0];
            this.downloadFile(blob, `daum-backup-${timestamp}.backup`);
            
            // 마지막 백업 시간 업데이트
            localStorage.setItem('last-backup', new Date().toISOString());
            this.updateLastBackupTime();
            
            if (typeof hideLoading === 'function') hideLoading();
            if (typeof showToast === 'function') {
                showToast('✅ 백업 파일이 생성되었습니다', 'success');
            }
        } catch (error) {
            if (typeof hideLoading === 'function') hideLoading();
            if (typeof showToast === 'function') {
                showToast('❌ 백업 생성 실패', 'error');
            }
            console.error('백업 생성 오류:', error);
        }
    }
    
    // JSON 내보내기
    exportJSON() {
        try {
            const data = {
                classes: this.getClassesData(),
                studyRecords: this.getStudyRecordsData(),
                statistics: this.getStatisticsData(),
                settings: this.getSettingsData()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const timestamp = new Date().toISOString().split('T')[0];
            this.downloadFile(blob, `daum-export-${timestamp}.json`);
            
            if (typeof showToast === 'function') {
                showToast('✅ JSON 파일로 내보내기 완료', 'success');
            }
        } catch (error) {
            if (typeof showToast === 'function') {
                showToast('❌ JSON 내보내기 실패', 'error');
            }
            console.error('JSON 내보내기 오류:', error);
        }
    }
    
    // CSV 내보내기
    exportCSV() {
        try {
            const studyRecords = this.getStudyRecordsData();
            
            if (!studyRecords || studyRecords.length === 0) {
                if (typeof showToast === 'function') {
                    showToast('⚠️ 내보낼 학습 기록이 없습니다', 'warning');
                }
                return;
            }
            
            // CSV 헤더
            let csv = 'ID,날짜,과목,학습시간(분),내용\n';
            
            // CSV 데이터
            studyRecords.forEach(record => {
                const date = new Date(record.timestamp || record.date).toLocaleDateString('ko-KR');
                const subject = record.subject || record.selectedSubject || '미지정';
                const duration = Math.round((record.duration || 0) / 60);
                const content = (record.content || '').replace(/,/g, '，').replace(/\n/g, ' ');
                
                csv += `${record.id},${date},${subject},${duration},"${content}"\n`;
            });
            
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
            const timestamp = new Date().toISOString().split('T')[0];
            this.downloadFile(blob, `daum-export-${timestamp}.csv`);
            
            if (typeof showToast === 'function') {
                showToast('✅ CSV 파일로 내보내기 완료', 'success');
            }
        } catch (error) {
            if (typeof showToast === 'function') {
                showToast('❌ CSV 내보내기 실패', 'error');
            }
            console.error('CSV 내보내기 오류:', error);
        }
    }
    
    // Excel 내보내기 (향후 구현)
    exportExcel() {
        if (typeof showToast === 'function') {
            showToast('⚠️ Excel 내보내기는 곧 제공 예정입니다', 'info');
        }
    }
    
    // PDF 내보내기 (향후 구현)
    exportPDF() {
        if (typeof showToast === 'function') {
            showToast('⚠️ PDF 내보내기는 곧 제공 예정입니다', 'info');
        }
    }
    
    // 데이터 수집 헬퍼 함수들
    getClassesData() {
        const data = localStorage.getItem('classes');
        return data ? JSON.parse(data) : [];
    }
    
    getStudyRecordsData() {
        const data = localStorage.getItem('studySessions') || localStorage.getItem('study-records');
        return data ? JSON.parse(data) : [];
    }
    
    getStatisticsData() {
        const data = localStorage.getItem('statistics');
        return data ? JSON.parse(data) : {};
    }
    
    getSettingsData() {
        return {
            theme: localStorage.getItem('app-theme'),
            colorTheme: localStorage.getItem('app-color-theme'),
            notifications: localStorage.getItem('notification-settings'),
            autoBackup: localStorage.getItem('auto-backup-enabled'),
            backupFrequency: localStorage.getItem('backup-frequency')
        };
    }
    
    // 파일 다운로드
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // 파일 선택 처리
    handleFileSelect(file) {
        if (!file.name.endsWith('.backup') && !file.name.endsWith('.json')) {
            if (typeof showToast === 'function') {
                showToast('❌ .backup 또는 .json 파일만 지원됩니다', 'error');
            }
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.backupData = JSON.parse(e.target.result);
                
                // 복원 버튼 표시
                const restoreBtn = document.getElementById('restore-backup');
                if (restoreBtn) {
                    restoreBtn.style.display = 'block';
                }
                
                if (typeof showToast === 'function') {
                    showToast('✅ 백업 파일을 불러왔습니다. 복원 버튼을 클릭하세요.', 'success');
                }
            } catch (error) {
                if (typeof showToast === 'function') {
                    showToast('❌ 백업 파일 형식이 올바르지 않습니다', 'error');
                }
                console.error('파일 파싱 오류:', error);
            }
        };
        reader.readAsText(file);
    }
    
    // 백업 복원
    restoreBackup() {
        if (!this.backupData) {
            if (typeof showToast === 'function') {
                showToast('❌ 복원할 백업 파일이 없습니다', 'error');
            }
            return;
        }
        
        if (!confirm('⚠️ 현재 데이터가 모두 삭제되고 백업으로 복원됩니다. 계속하시겠습니까?')) {
            return;
        }
        
        try {
            if (typeof showLoading === 'function') showLoading();
            
            // 백업 데이터 복원
            if (this.backupData.data) {
                Object.keys(this.backupData.data).forEach(key => {
                    const value = this.backupData.data[key];
                    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                });
            }
            
            if (typeof hideLoading === 'function') hideLoading();
            if (typeof showToast === 'function') {
                showToast('✅ 백업이 복원되었습니다. 페이지를 새로고침합니다.', 'success');
            }
            
            // 페이지 새로고침
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            if (typeof hideLoading === 'function') hideLoading();
            if (typeof showToast === 'function') {
                showToast('❌ 백업 복원 실패', 'error');
            }
            console.error('백업 복원 오류:', error);
        }
    }
    
    // 자동 백업 토글
    toggleAutoBackup(enabled) {
        localStorage.setItem('auto-backup-enabled', enabled.toString());
        
        const frequencySettings = document.getElementById('backup-frequency-settings');
        if (frequencySettings) {
            frequencySettings.style.display = enabled ? 'block' : 'none';
        }
        
        if (enabled) {
            if (typeof showToast === 'function') {
                showToast('✅ 자동 백업이 활성화되었습니다', 'success');
            }
        } else {
            if (typeof showToast === 'function') {
                showToast('⚠️ 자동 백업이 비활성화되었습니다', 'warning');
            }
        }
    }
    
    // 백업 주기 설정
    setBackupFrequency(frequency) {
        localStorage.setItem('backup-frequency', frequency);
        
        const messages = {
            'daily': '매일',
            'weekly': '매주',
            'monthly': '매월'
        };
        
        if (typeof showToast === 'function') {
            showToast(`⚙️ 백업 주기가 ${messages[frequency]}로 설정되었습니다`, 'info');
        }
    }
    
    // 마지막 백업 시간 업데이트
    updateLastBackupTime() {
        const lastBackup = localStorage.getItem('last-backup');
        const lastBackupEl = document.getElementById('last-backup-time');
        
        if (lastBackupEl) {
            if (lastBackup) {
                const date = new Date(lastBackup);
                lastBackupEl.textContent = `마지막 백업: ${date.toLocaleDateString('ko-KR')} ${date.toLocaleTimeString('ko-KR')}`;
            } else {
                lastBackupEl.textContent = '마지막 백업: 없음';
            }
        }
    }
    
    // 스타일 추가
    addBackupStyles() {
        if (document.getElementById('backup-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'backup-styles';
        style.textContent = `
            .floating-backup-btn {
                position: fixed;
                top: 180px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
                transition: all 0.3s ease;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .floating-backup-btn:hover {
                transform: translateY(-3px) scale(1.1);
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
            }
            
            .backup-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            
            .backup-modal-content {
                background: white;
                border-radius: 16px;
                width: 100%;
                max-width: 700px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: scaleIn 0.3s ease;
            }
            
            .backup-modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                background: white;
                z-index: 1;
            }
            
            .backup-close-btn {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: #f3f4f6;
                border: none;
                cursor: pointer;
                font-size: 1.25rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .backup-close-btn:hover {
                background: #e5e7eb;
                transform: rotate(90deg);
            }
            
            .backup-modal-body {
                padding: 1.5rem;
            }
            
            .backup-section {
                background: #f9fafb;
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .backup-section-title {
                font-size: 1.125rem;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 0.5rem;
            }
            
            .backup-section-desc {
                font-size: 0.875rem;
                color: #6b7280;
                margin-bottom: 1rem;
            }
            
            .backup-actions {
                display: flex;
                gap: 0.75rem;
            }
            
            .backup-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                flex: 1;
            }
            
            .backup-btn-primary {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
            }
            
            .backup-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            }
            
            .backup-btn-secondary {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
            }
            
            .backup-btn-secondary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            }
            
            .backup-export-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0.75rem;
            }
            
            .backup-export-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem;
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .backup-export-btn:hover:not(:disabled) {
                border-color: #3b82f6;
                transform: translateY(-3px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
            }
            
            .backup-export-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .backup-export-icon {
                font-size: 2rem;
            }
            
            .backup-export-label {
                font-size: 0.875rem;
                font-weight: 600;
                color: #374151;
            }
            
            .backup-restore-dropzone {
                border: 2px dashed #d1d5db;
                border-radius: 12px;
                padding: 2rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .backup-restore-dropzone:hover,
            .backup-restore-area.dragover .backup-restore-dropzone {
                border-color: #3b82f6;
                background: #eff6ff;
            }
            
            .backup-restore-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .backup-restore-text {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .backup-restore-text strong {
                font-size: 1rem;
                color: #1f2937;
            }
            
            .backup-restore-text span {
                font-size: 0.875rem;
                color: #6b7280;
            }
            
            .backup-auto-settings {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .backup-toggle-label {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                cursor: pointer;
            }
            
            .backup-toggle-label input[type="checkbox"] {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }
            
            .backup-toggle-text {
                font-weight: 600;
                color: #374151;
            }
            
            .backup-frequency-settings {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding-left: 2rem;
            }
            
            .backup-label {
                font-size: 0.875rem;
                color: #6b7280;
            }
            
            .backup-select {
                padding: 0.5rem 1rem;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 0.875rem;
                cursor: pointer;
            }
            
            .backup-last-time {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid #e5e7eb;
                font-size: 0.875rem;
                color: #6b7280;
                text-align: center;
            }
            
            @media (max-width: 768px) {
                .floating-backup-btn {
                    top: 170px;
                    right: 12px;
                    width: 44px;
                    height: 44px;
                    font-size: 1.25rem;
                }
                
                .backup-export-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.backupSystem = new BackupSystem();
    console.log('✅ 백업 시스템 로드 완료');
});
