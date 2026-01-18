/* ============================================
   DA.UM 학생 포털 - 추가 필수 기능들
   ============================================ */

// ============================================
// 1. 학습 스트릭 (연속 학습일) 시스템
// ============================================
class StreakSystem {
    constructor() {
        this.currentStreak = 0;
        this.longestStreak = 0;
        this.lastStudyDate = null;
        this.storageKey = 'streak-data';
        this.init();
    }
    
    init() {
        this.loadStreak();
        this.createStreakUI();
        console.log('✅ 스트릭 시스템 초기화');
    }
    
    // 스트릭 데이터 로드
    loadStreak() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            const parsed = JSON.parse(data);
            this.currentStreak = parsed.currentStreak || 0;
            this.longestStreak = parsed.longestStreak || 0;
            this.lastStudyDate = parsed.lastStudyDate || null;
        }
    }
    
    // 스트릭 데이터 저장
    saveStreak() {
        const data = {
            currentStreak: this.currentStreak,
            longestStreak: this.longestStreak,
            lastStudyDate: this.lastStudyDate
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
    
    // 학습 기록 시 스트릭 업데이트
    updateStreak() {
        const today = new Date().toISOString().split('T')[0];
        
        if (!this.lastStudyDate) {
            // 첫 학습
            this.currentStreak = 1;
            this.lastStudyDate = today;
        } else if (this.lastStudyDate === today) {
            // 오늘 이미 학습함
            return;
        } else {
            const lastDate = new Date(this.lastStudyDate);
            const todayDate = new Date(today);
            const diffTime = Math.abs(todayDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // 연속 학습
                this.currentStreak++;
                this.lastStudyDate = today;
                
                // 7일 단위 달성 알림
                if (this.currentStreak % 7 === 0) {
                    this.showMilestoneAchievement();
                }
            } else {
                // 연속 끊김
                this.currentStreak = 1;
                this.lastStudyDate = today;
            }
        }
        
        // 최고 기록 갱신
        if (this.currentStreak > this.longestStreak) {
            this.longestStreak = this.currentStreak;
        }
        
        this.saveStreak();
        this.updateUI();
    }
    
    // 7일 단위 달성 알림
    showMilestoneAchievement() {
        if (typeof showToast === 'function') {
            showToast(`🎉 축하합니다! ${this.currentStreak}일 연속 학습 달성!`, 'success');
        }
    }
    
    // UI 생성
    createStreakUI() {
        const container = document.createElement('div');
        container.id = 'streak-container';
        container.className = 'cute-card p-4 md:p-6 mb-6 animate-fadeIn';
        container.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                    🔥 학습 스트릭
                </h3>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="streak-stat-card">
                    <div class="streak-stat-value" id="current-streak">${this.currentStreak}</div>
                    <div class="streak-stat-label">현재 연속일</div>
                </div>
                <div class="streak-stat-card">
                    <div class="streak-stat-value" id="longest-streak">${this.longestStreak}</div>
                    <div class="streak-stat-label">최고 기록</div>
                </div>
            </div>
            <div class="mt-4 text-sm text-gray-600 text-center">
                ${this.getMotivationMessage()}
            </div>
        `;
        
        // 대시보드 최상단에 추가
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.insertBefore(container, mainContent.firstChild);
        }
        
        this.addStreakStyles();
    }
    
    // 동기부여 메시지
    getMotivationMessage() {
        if (this.currentStreak === 0) {
            return '오늘 학습을 시작해보세요! 💪';
        } else if (this.currentStreak < 7) {
            return `${7 - this.currentStreak}일만 더 하면 1주일 달성! 🎯`;
        } else if (this.currentStreak < 30) {
            return `대단해요! ${30 - this.currentStreak}일만 더 하면 한 달 달성! 🌟`;
        } else {
            return '놀라워요! 지속적인 학습의 힘을 보여주고 있어요! 🚀';
        }
    }
    
    // UI 업데이트
    updateUI() {
        const currentStreakEl = document.getElementById('current-streak');
        const longestStreakEl = document.getElementById('longest-streak');
        
        if (currentStreakEl) currentStreakEl.textContent = this.currentStreak;
        if (longestStreakEl) longestStreakEl.textContent = this.longestStreak;
        
        // 동기부여 메시지 업데이트
        const container = document.getElementById('streak-container');
        if (container) {
            const messageEl = container.querySelector('.text-sm.text-gray-600');
            if (messageEl) {
                messageEl.textContent = this.getMotivationMessage();
            }
        }
    }
    
    // 스타일 추가
    addStreakStyles() {
        if (document.getElementById('streak-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'streak-styles';
        style.textContent = `
            .streak-stat-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 1rem;
                text-align: center;
                color: white;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                transition: transform 0.3s ease;
            }
            
            .streak-stat-card:hover {
                transform: translateY(-5px);
            }
            
            .streak-stat-value {
                font-size: 2rem;
                font-weight: 900;
                margin-bottom: 0.25rem;
                animation: pulse 2s ease-in-out infinite;
            }
            
            .streak-stat-label {
                font-size: 0.875rem;
                opacity: 0.9;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// 2. 포모도로 타이머
// ============================================
class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25분 (초)
        this.breakTime = 5 * 60; // 5분 (초)
        this.currentTime = this.workTime;
        this.isRunning = false;
        this.isWorkSession = true;
        this.intervalId = null;
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.createPomodoroUI();
        console.log('✅ 포모도로 타이머 초기화');
    }
    
    // 설정 로드
    loadSettings() {
        const settings = localStorage.getItem('pomodoro-settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.workTime = (parsed.workTime || 25) * 60;
            this.breakTime = (parsed.breakTime || 5) * 60;
            this.currentTime = this.workTime;
        }
    }
    
    // 설정 저장
    saveSettings() {
        const settings = {
            workTime: this.workTime / 60,
            breakTime: this.breakTime / 60
        };
        localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
    }
    
    // UI 생성
    createPomodoroUI() {
        const container = document.createElement('div');
        container.id = 'pomodoro-container';
        container.className = 'cute-card p-4 md:p-6 mb-6 animate-fadeIn';
        container.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                    🍅 포모도로 타이머
                </h3>
                <button id="pomodoro-settings-btn" class="text-gray-500 hover:text-gray-700">
                    ⚙️
                </button>
            </div>
            
            <div class="pomodoro-display">
                <div class="pomodoro-session-type" id="pomodoro-session-type">
                    집중 시간
                </div>
                <div class="pomodoro-circular-progress">
                    <svg class="pomodoro-progress-ring" width="200" height="200">
                        <circle class="pomodoro-progress-ring-bg" stroke="#e5e7eb" stroke-width="8" fill="transparent" r="90" cx="100" cy="100"/>
                        <circle class="pomodoro-progress-ring-circle" stroke="url(#gradient)" stroke-width="8" fill="transparent" r="90" cx="100" cy="100" id="pomodoro-progress-circle"/>
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div class="pomodoro-time-display" id="pomodoro-time-display">
                        ${this.formatTime(this.currentTime)}
                    </div>
                </div>
                
                <div class="pomodoro-controls">
                    <button id="pomodoro-start" class="pomodoro-btn pomodoro-btn-primary">
                        시작
                    </button>
                    <button id="pomodoro-pause" class="pomodoro-btn pomodoro-btn-secondary" style="display: none;">
                        일시정지
                    </button>
                    <button id="pomodoro-reset" class="pomodoro-btn pomodoro-btn-tertiary">
                        리셋
                    </button>
                </div>
            </div>
        `;
        
        // 스트릭 카드 다음에 추가
        const streakContainer = document.getElementById('streak-container');
        if (streakContainer && streakContainer.parentNode) {
            streakContainer.parentNode.insertBefore(container, streakContainer.nextSibling);
        } else {
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.insertBefore(container, mainContent.firstChild);
            }
        }
        
        this.attachPomodoroEvents();
        this.addPomodoroStyles();
    }
    
    // 시간 포맷 (MM:SS)
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    // 이벤트 연결
    attachPomodoroEvents() {
        const startBtn = document.getElementById('pomodoro-start');
        const pauseBtn = document.getElementById('pomodoro-pause');
        const resetBtn = document.getElementById('pomodoro-reset');
        const settingsBtn = document.getElementById('pomodoro-settings-btn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.start());
        }
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pause());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }
    }
    
    // 타이머 시작
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        document.getElementById('pomodoro-start').style.display = 'none';
        document.getElementById('pomodoro-pause').style.display = 'inline-block';
        
        this.intervalId = setInterval(() => {
            this.currentTime--;
            this.updateDisplay();
            
            if (this.currentTime <= 0) {
                this.onTimerComplete();
            }
        }, 1000);
    }
    
    // 타이머 일시정지
    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.intervalId);
        document.getElementById('pomodoro-start').style.display = 'inline-block';
        document.getElementById('pomodoro-pause').style.display = 'none';
    }
    
    // 타이머 리셋
    reset() {
        this.pause();
        this.currentTime = this.isWorkSession ? this.workTime : this.breakTime;
        this.updateDisplay();
    }
    
    // 타이머 완료
    onTimerComplete() {
        this.pause();
        
        if (this.isWorkSession) {
            // 집중 시간 완료 → 휴식 시간
            if (typeof showToast === 'function') {
                showToast('🎉 집중 시간 완료! 휴식을 취하세요.', 'success');
            }
            this.isWorkSession = false;
            this.currentTime = this.breakTime;
            document.getElementById('pomodoro-session-type').textContent = '휴식 시간';
        } else {
            // 휴식 시간 완료 → 집중 시간
            if (typeof showToast === 'function') {
                showToast('✅ 휴식 완료! 다시 집중해봐요.', 'info');
            }
            this.isWorkSession = true;
            this.currentTime = this.workTime;
            document.getElementById('pomodoro-session-type').textContent = '집중 시간';
        }
        
        this.updateDisplay();
        this.playNotificationSound();
    }
    
    // 알림 소리 (간단한 beep)
    playNotificationSound() {
        // Web Audio API를 사용한 간단한 소리
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('소리 재생 실패:', e);
        }
    }
    
    // 디스플레이 업데이트
    updateDisplay() {
        const timeDisplay = document.getElementById('pomodoro-time-display');
        if (timeDisplay) {
            timeDisplay.textContent = this.formatTime(this.currentTime);
        }
        
        // 원형 프로그레스 업데이트
        const circle = document.getElementById('pomodoro-progress-circle');
        if (circle) {
            const maxTime = this.isWorkSession ? this.workTime : this.breakTime;
            const progress = this.currentTime / maxTime;
            const circumference = 2 * Math.PI * 90;
            const offset = circumference * (1 - progress);
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
        }
    }
    
    // 설정 열기
    openSettings() {
        const currentWork = this.workTime / 60;
        const currentBreak = this.breakTime / 60;
        
        const workInput = prompt(`집중 시간을 입력하세요 (분):`, currentWork);
        if (workInput !== null && !isNaN(workInput) && workInput > 0) {
            this.workTime = parseInt(workInput) * 60;
        }
        
        const breakInput = prompt(`휴식 시간을 입력하세요 (분):`, currentBreak);
        if (breakInput !== null && !isNaN(breakInput) && breakInput > 0) {
            this.breakTime = parseInt(breakInput) * 60;
        }
        
        this.saveSettings();
        this.reset();
        
        if (typeof showToast === 'function') {
            showToast('⚙️ 타이머 설정이 저장되었습니다.', 'success');
        }
    }
    
    // 스타일 추가
    addPomodoroStyles() {
        if (document.getElementById('pomodoro-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'pomodoro-styles';
        style.textContent = `
            .pomodoro-display {
                text-align: center;
            }
            
            .pomodoro-session-type {
                font-size: 1.25rem;
                font-weight: 700;
                color: #667eea;
                margin-bottom: 1rem;
            }
            
            .pomodoro-circular-progress {
                position: relative;
                display: inline-block;
                margin: 1rem 0;
            }
            
            .pomodoro-progress-ring {
                transform: rotate(-90deg);
            }
            
            .pomodoro-progress-ring-circle {
                transition: stroke-dashoffset 0.3s ease;
            }
            
            .pomodoro-time-display {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 2.5rem;
                font-weight: 900;
                color: #1f2937;
            }
            
            .pomodoro-controls {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
                margin-top: 1.5rem;
            }
            
            .pomodoro-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .pomodoro-btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .pomodoro-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
            
            .pomodoro-btn-secondary {
                background: #f59e0b;
                color: white;
            }
            
            .pomodoro-btn-secondary:hover {
                background: #d97706;
            }
            
            .pomodoro-btn-tertiary {
                background: #e5e7eb;
                color: #374151;
            }
            
            .pomodoro-btn-tertiary:hover {
                background: #d1d5db;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// 3. 키보드 단축키 시스템
// ============================================
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = {
            'ctrl+s': this.focusSearch,
            'cmd+s': this.focusSearch,
            'ctrl+n': this.toggleNotifications,
            'cmd+n': this.toggleNotifications,
            'ctrl+t': this.toggleTheme,
            'cmd+t': this.toggleTheme,
            'ctrl+b': this.openBackup,
            'cmd+b': this.openBackup,
            'ctrl+h': this.showHelp,
            'cmd+h': this.showHelp,
            '?': this.showHelp
        };
        this.init();
    }
    
    init() {
        this.attachKeyboardEvents();
        console.log('✅ 키보드 단축키 초기화');
    }
    
    attachKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            const key = this.getKeyCombo(e);
            
            if (this.shortcuts[key]) {
                e.preventDefault();
                this.shortcuts[key].call(this);
            }
        });
    }
    
    getKeyCombo(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('ctrl');
        if (e.metaKey) parts.push('cmd');
        if (e.altKey) parts.push('alt');
        if (e.shiftKey) parts.push('shift');
        parts.push(e.key.toLowerCase());
        return parts.join('+');
    }
    
    focusSearch() {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="검색"]');
        if (searchInput) {
            searchInput.focus();
            if (typeof showToast === 'function') {
                showToast('🔍 검색 포커스', 'info');
            }
        }
    }
    
    toggleNotifications() {
        // 알림 시스템이 있다면 토글
        if (window.notificationSystem) {
            // 알림 모달 토글 로직
            if (typeof showToast === 'function') {
                showToast('🔔 알림 토글', 'info');
            }
        }
    }
    
    toggleTheme() {
        // 테마 매니저가 있다면 토글
        if (window.themeManager) {
            window.themeManager.toggleTheme();
        } else if (typeof showToast === 'function') {
            showToast('🎨 테마 토글', 'info');
        }
    }
    
    openBackup() {
        // 백업 시스템이 있다면 열기
        if (window.backupSystem) {
            // 백업 모달 열기 로직
            if (typeof showToast === 'function') {
                showToast('💾 백업 시스템 열기', 'info');
            }
        }
    }
    
    showHelp() {
        this.createHelpModal();
    }
    
    createHelpModal() {
        // 기존 모달 제거
        const existingModal = document.getElementById('keyboard-shortcuts-modal');
        if (existingModal) {
            existingModal.remove();
            return;
        }
        
        const modal = document.createElement('div');
        modal.id = 'keyboard-shortcuts-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content animate-scaleIn">
                <div class="modal-header">
                    <h3 class="text-xl font-bold">⌨️ 키보드 단축키</h3>
                    <button class="modal-close" id="shortcuts-close">✕</button>
                </div>
                <div class="modal-body">
                    <div class="shortcuts-list">
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>Ctrl</kbd> + <kbd>S</kbd>
                            </div>
                            <div class="shortcut-desc">검색 포커스</div>
                        </div>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>Ctrl</kbd> + <kbd>N</kbd>
                            </div>
                            <div class="shortcut-desc">알림 토글</div>
                        </div>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>Ctrl</kbd> + <kbd>T</kbd>
                            </div>
                            <div class="shortcut-desc">테마 전환</div>
                        </div>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>Ctrl</kbd> + <kbd>B</kbd>
                            </div>
                            <div class="shortcut-desc">백업 시스템</div>
                        </div>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>Ctrl</kbd> + <kbd>H</kbd> 또는 <kbd>?</kbd>
                            </div>
                            <div class="shortcut-desc">이 도움말</div>
                        </div>
                    </div>
                    <p class="text-sm text-gray-500 mt-4 text-center">
                        Mac에서는 Ctrl 대신 ⌘ (Cmd)를 사용하세요
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 닫기 이벤트
        const closeBtn = document.getElementById('shortcuts-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.remove());
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        this.addShortcutsStyles();
    }
    
    addShortcutsStyles() {
        if (document.getElementById('shortcuts-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'shortcuts-styles';
        style.textContent = `
            .shortcuts-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .shortcut-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem;
                background: #f9fafb;
                border-radius: 8px;
            }
            
            .shortcut-keys {
                display: flex;
                gap: 0.25rem;
                align-items: center;
                font-size: 0.875rem;
            }
            
            .shortcut-keys kbd {
                padding: 0.25rem 0.5rem;
                background: white;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                font-family: monospace;
                font-size: 0.875rem;
            }
            
            .shortcut-desc {
                color: #6b7280;
                font-size: 0.875rem;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// 4. 오프라인 지원 시스템
// ============================================
class OfflineSupport {
    constructor() {
        this.isOnline = navigator.onLine;
        this.offlineQueue = [];
        this.init();
    }
    
    init() {
        this.loadOfflineQueue();
        this.attachNetworkEvents();
        this.registerServiceWorker();
        this.createOfflineBanner();
        console.log('✅ 오프라인 지원 초기화');
    }
    
    // 네트워크 이벤트 연결
    attachNetworkEvents() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.hideOfflineBanner();
            this.syncOfflineQueue();
            if (typeof showToast === 'function') {
                showToast('✅ 온라인으로 연결되었습니다', 'success');
            }
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineBanner();
            if (typeof showToast === 'function') {
                showToast('⚠️ 오프라인 모드입니다', 'warning');
            }
        });
    }
    
    // 오프라인 배너 생성
    createOfflineBanner() {
        const banner = document.createElement('div');
        banner.id = 'offline-banner';
        banner.className = 'offline-banner';
        banner.innerHTML = `
            <div class="offline-banner-content">
                📡 오프라인 모드 - 일부 기능이 제한됩니다
            </div>
        `;
        document.body.appendChild(banner);
        
        if (!this.isOnline) {
            this.showOfflineBanner();
        }
        
        this.addOfflineStyles();
    }
    
    showOfflineBanner() {
        const banner = document.getElementById('offline-banner');
        if (banner) {
            banner.classList.add('visible');
        }
    }
    
    hideOfflineBanner() {
        const banner = document.getElementById('offline-banner');
        if (banner) {
            banner.classList.remove('visible');
        }
    }
    
    // 오프라인 큐 로드
    loadOfflineQueue() {
        const data = localStorage.getItem('offline-queue');
        if (data) {
            this.offlineQueue = JSON.parse(data);
        }
    }
    
    // 오프라인 큐 저장
    saveOfflineQueue() {
        localStorage.setItem('offline-queue', JSON.stringify(this.offlineQueue));
    }
    
    // 오프라인 데이터 추가
    addToQueue(data) {
        this.offlineQueue.push({
            id: Date.now(),
            data: data,
            timestamp: new Date().toISOString()
        });
        this.saveOfflineQueue();
    }
    
    // 온라인 복구 시 동기화
    async syncOfflineQueue() {
        if (this.offlineQueue.length === 0) return;
        
        console.log(`동기화 시작: ${this.offlineQueue.length}개 항목`);
        
        // 실제로는 서버 API 호출
        // 여기서는 로컬스토리지만 사용
        this.offlineQueue = [];
        this.saveOfflineQueue();
        
        if (typeof showToast === 'function') {
            showToast('✅ 오프라인 데이터 동기화 완료', 'success');
        }
    }
    
    // Service Worker 등록
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker 등록 완료:', registration.scope);
                })
                .catch(error => {
                    console.log('Service Worker 등록 실패:', error);
                });
        }
    }
    
    // 스타일 추가
    addOfflineStyles() {
        if (document.getElementById('offline-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'offline-styles';
        style.textContent = `
            .offline-banner {
                position: fixed;
                top: -60px;
                left: 0;
                right: 0;
                z-index: 9999;
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
                padding: 1rem;
                text-align: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                transition: top 0.3s ease;
            }
            
            .offline-banner.visible {
                top: 0;
            }
            
            .offline-banner-content {
                font-weight: 600;
                font-size: 0.875rem;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// 초기화
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // 전역 인스턴스 생성
    window.streakSystem = new StreakSystem();
    window.pomodoroTimer = new PomodoroTimer();
    window.keyboardShortcuts = new KeyboardShortcuts();
    window.offlineSupport = new OfflineSupport();
    
    console.log('✅ 추가 기능 스크립트 로드 완료');
});

// 학습 기록 저장 시 스트릭 업데이트 (기존 saveStudyRecord 함수와 연동)
if (window.saveStudyRecord) {
    const originalSaveStudyRecord = window.saveStudyRecord;
    window.saveStudyRecord = async function(...args) {
        const result = await originalSaveStudyRecord(...args);
        if (result && window.streakSystem) {
            window.streakSystem.updateStreak();
        }
        return result;
    };
}
