/* ============================================
   DA.UM 학생 포털 - 알림 시스템
   ============================================ */

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.storageKey = 'notifications';
        this.permission = Notification.permission;
        this.init();
    }
    
    init() {
        this.loadNotifications();
        this.createNotificationUI();
        this.addNotificationStyles();
        this.attachNotificationEvents();
        this.setupScheduledNotifications();
        console.log('✅ 알림 시스템 초기화');
    }
    
    // 알림 데이터 로드
    loadNotifications() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            this.notifications = JSON.parse(data);
            this.updateUnreadCount();
        }
    }
    
    // 알림 데이터 저장
    saveNotifications() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
        localStorage.setItem('unread-count', this.unreadCount.toString());
    }
    
    // 읽지 않은 알림 수 업데이트
    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
    }
    
    // UI 생성
    createNotificationUI() {
        // 플로팅 알림 버튼 생성
        const notifBtn = document.createElement('button');
        notifBtn.id = 'notification-btn';
        notifBtn.className = 'floating-notification-btn';
        notifBtn.innerHTML = `
            🔔
            <span class="notification-badge" id="notification-badge" style="display: none;">0</span>
        `;
        notifBtn.setAttribute('aria-label', '알림');
        document.body.appendChild(notifBtn);
        
        // 알림 모달 생성
        const modal = document.createElement('div');
        modal.id = 'notification-modal';
        modal.className = 'notification-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="notification-modal-content">
                <div class="notification-modal-header">
                    <h3 class="text-xl font-bold">🔔 알림</h3>
                    <div class="notification-header-actions">
                        <button id="notification-request-permission" class="notification-permission-btn" style="display: none;">
                            알림 권한 요청
                        </button>
                        <button id="notification-mark-all-read" class="notification-action-btn">
                            모두 읽음
                        </button>
                        <button id="notification-close" class="notification-close-btn">✕</button>
                    </div>
                </div>
                
                <div class="notification-filters">
                    <button class="notification-filter-btn active" data-filter="all">
                        전체 (${this.notifications.length})
                    </button>
                    <button class="notification-filter-btn" data-filter="unread">
                        읽지 않음 (${this.unreadCount})
                    </button>
                </div>
                
                <div class="notification-list" id="notification-list">
                    ${this.renderNotifications()}
                </div>
                
                <div class="notification-modal-footer">
                    <button id="notification-clear-all" class="notification-clear-btn">
                        모든 알림 지우기
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        this.updateUI();
    }
    
    // 알림 목록 렌더링
    renderNotifications(filter = 'all') {
        let filteredNotifications = this.notifications;
        
        if (filter === 'unread') {
            filteredNotifications = this.notifications.filter(n => !n.read);
        }
        
        if (filteredNotifications.length === 0) {
            return `
                <div class="notification-empty">
                    <div class="notification-empty-icon">📭</div>
                    <div class="notification-empty-text">알림이 없습니다</div>
                </div>
            `;
        }
        
        return filteredNotifications
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(notification => this.renderNotificationItem(notification))
            .join('');
    }
    
    // 개별 알림 아이템 렌더링
    renderNotificationItem(notification) {
        const readClass = notification.read ? 'read' : 'unread';
        return `
            <div class="notification-item ${readClass}" data-id="${notification.id}">
                <div class="notification-icon">${notification.icon || '📢'}</div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
                </div>
                <div class="notification-actions">
                    ${!notification.read ? '<button class="notification-mark-read-btn" title="읽음 표시">✓</button>' : ''}
                    <button class="notification-delete-btn" title="삭제">🗑️</button>
                </div>
            </div>
        `;
    }
    
    // 시간 포맷팅
    formatTime(timestamp) {
        const now = new Date();
        const notifTime = new Date(timestamp);
        const diffMs = now - notifTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return '방금 전';
        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;
        
        return notifTime.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric'
        });
    }
    
    // 이벤트 연결
    attachNotificationEvents() {
        // 알림 버튼 클릭
        const notifBtn = document.getElementById('notification-btn');
        if (notifBtn) {
            notifBtn.addEventListener('click', () => this.toggleModal());
        }
        
        // 모달 닫기
        const closeBtn = document.getElementById('notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // 모두 읽음
        const markAllBtn = document.getElementById('notification-mark-all-read');
        if (markAllBtn) {
            markAllBtn.addEventListener('click', () => this.markAllAsRead());
        }
        
        // 모든 알림 지우기
        const clearAllBtn = document.getElementById('notification-clear-all');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllNotifications());
        }
        
        // 알림 권한 요청
        const permissionBtn = document.getElementById('notification-request-permission');
        if (permissionBtn) {
            permissionBtn.addEventListener('click', () => this.requestPermission());
            
            // 권한이 없으면 버튼 표시
            if (this.permission !== 'granted') {
                permissionBtn.style.display = 'inline-block';
            }
        }
        
        // 필터 버튼
        document.querySelectorAll('.notification-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterNotifications(filter);
            });
        });
        
        // 알림 아이템 이벤트 (이벤트 위임)
        const notifList = document.getElementById('notification-list');
        if (notifList) {
            notifList.addEventListener('click', (e) => {
                const item = e.target.closest('.notification-item');
                if (!item) return;
                
                const id = parseInt(item.dataset.id);
                
                if (e.target.classList.contains('notification-mark-read-btn')) {
                    this.markAsRead(id);
                } else if (e.target.classList.contains('notification-delete-btn')) {
                    this.deleteNotification(id);
                } else {
                    this.handleNotificationClick(id);
                }
            });
        }
    }
    
    // 모달 토글
    toggleModal() {
        const modal = document.getElementById('notification-modal');
        if (modal) {
            if (modal.style.display === 'none') {
                modal.style.display = 'block';
            } else {
                modal.style.display = 'none';
            }
        }
    }
    
    // 모달 닫기
    closeModal() {
        const modal = document.getElementById('notification-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // 필터링
    filterNotifications(filter) {
        // 필터 버튼 상태 업데이트
        document.querySelectorAll('.notification-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        // 목록 다시 렌더링
        const listEl = document.getElementById('notification-list');
        if (listEl) {
            listEl.innerHTML = this.renderNotifications(filter);
        }
    }
    
    // 알림 클릭
    handleNotificationClick(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (!notification) return;
        
        // 읽음 표시
        this.markAsRead(id);
        
        // 액션이 있으면 실행
        if (notification.action) {
            // 예: 특정 탭으로 이동
            if (typeof notification.action === 'string') {
                const tab = notification.action;
                if (typeof showTab === 'function') {
                    showTab(tab);
                }
            }
        }
    }
    
    // 읽음 표시
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.updateUnreadCount();
            this.saveNotifications();
            this.updateUI();
            
            // 목록 다시 렌더링
            const listEl = document.getElementById('notification-list');
            if (listEl) {
                const activeFilter = document.querySelector('.notification-filter-btn.active');
                const filter = activeFilter ? activeFilter.dataset.filter : 'all';
                listEl.innerHTML = this.renderNotifications(filter);
            }
        }
    }
    
    // 모두 읽음 표시
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.updateUnreadCount();
        this.saveNotifications();
        this.updateUI();
        
        const listEl = document.getElementById('notification-list');
        if (listEl) {
            const activeFilter = document.querySelector('.notification-filter-btn.active');
            const filter = activeFilter ? activeFilter.dataset.filter : 'all';
            listEl.innerHTML = this.renderNotifications(filter);
        }
        
        if (typeof showToast === 'function') {
            showToast('✅ 모든 알림을 읽음으로 표시했습니다', 'success');
        }
    }
    
    // 알림 삭제
    deleteNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.updateUnreadCount();
        this.saveNotifications();
        this.updateUI();
        
        const listEl = document.getElementById('notification-list');
        if (listEl) {
            const activeFilter = document.querySelector('.notification-filter-btn.active');
            const filter = activeFilter ? activeFilter.dataset.filter : 'all';
            listEl.innerHTML = this.renderNotifications(filter);
        }
    }
    
    // 모든 알림 지우기
    clearAllNotifications() {
        if (confirm('모든 알림을 삭제하시겠습니까?')) {
            this.notifications = [];
            this.unreadCount = 0;
            this.saveNotifications();
            this.updateUI();
            
            const listEl = document.getElementById('notification-list');
            if (listEl) {
                listEl.innerHTML = this.renderNotifications();
            }
            
            if (typeof showToast === 'function') {
                showToast('🗑️ 모든 알림이 삭제되었습니다', 'info');
            }
        }
    }
    
    // UI 업데이트
    updateUI() {
        const badge = document.getElementById('notification-badge');
        if (badge) {
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
        
        // 필터 버튼 카운트 업데이트
        const allFilterBtn = document.querySelector('.notification-filter-btn[data-filter="all"]');
        if (allFilterBtn) {
            allFilterBtn.textContent = `전체 (${this.notifications.length})`;
        }
        
        const unreadFilterBtn = document.querySelector('.notification-filter-btn[data-filter="unread"]');
        if (unreadFilterBtn) {
            unreadFilterBtn.textContent = `읽지 않음 (${this.unreadCount})`;
        }
    }
    
    // 알림 생성
    createNotification(data) {
        const notification = {
            id: Date.now(),
            title: data.title || '알림',
            message: data.message || '',
            type: data.type || 'info',
            icon: data.icon || '📢',
            read: false,
            timestamp: new Date().toISOString(),
            action: data.action || null
        };
        
        this.notifications.unshift(notification);
        this.updateUnreadCount();
        this.saveNotifications();
        this.updateUI();
        
        // 푸시 알림 전송
        if (this.permission === 'granted') {
            this.sendPushNotification(notification);
        }
        
        return notification;
    }
    
    // 푸시 알림 전송
    sendPushNotification(notification) {
        if (this.permission !== 'granted') return;
        
        try {
            const pushNotif = new Notification(notification.title, {
                body: notification.message,
                icon: '/images/icon.png', // 아이콘 경로
                badge: '/images/badge.png',
                tag: notification.id.toString(),
                requireInteraction: false
            });
            
            pushNotif.onclick = () => {
                window.focus();
                this.handleNotificationClick(notification.id);
                pushNotif.close();
            };
        } catch (e) {
            console.log('푸시 알림 전송 실패:', e);
        }
    }
    
    // 알림 권한 요청
    async requestPermission() {
        if (!('Notification' in window)) {
            if (typeof showToast === 'function') {
                showToast('❌ 이 브라우저는 알림을 지원하지 않습니다', 'error');
            }
            return;
        }
        
        try {
            this.permission = await Notification.requestPermission();
            
            if (this.permission === 'granted') {
                if (typeof showToast === 'function') {
                    showToast('✅ 알림 권한이 허용되었습니다', 'success');
                }
                
                // 권한 버튼 숨기기
                const permissionBtn = document.getElementById('notification-request-permission');
                if (permissionBtn) {
                    permissionBtn.style.display = 'none';
                }
                
                // 테스트 알림 전송
                this.createNotification({
                    title: '알림이 활성화되었습니다',
                    message: '이제 중요한 학습 알림을 받을 수 있습니다!',
                    icon: '✅',
                    type: 'success'
                });
            } else {
                if (typeof showToast === 'function') {
                    showToast('⚠️ 알림 권한이 거부되었습니다', 'warning');
                }
            }
        } catch (e) {
            console.error('알림 권한 요청 실패:', e);
        }
    }
    
    // 예약 알림 설정
    setupScheduledNotifications() {
        // 매일 오후 3시 알림
        this.scheduleDaily(15, 0, {
            title: '📚 학습 시간이에요!',
            message: '오늘의 학습 목표를 달성해봐요',
            icon: '📚',
            action: 'journal'
        });
        
        // 매일 오후 8시 알림
        this.scheduleDaily(20, 0, {
            title: '📝 복습 시간!',
            message: '오늘 배운 내용을 복습해보세요',
            icon: '📝',
            action: 'review'
        });
    }
    
    // 매일 특정 시간에 알림
    scheduleDaily(hour, minute, notificationData) {
        const now = new Date();
        const scheduledTime = new Date();
        scheduledTime.setHours(hour, minute, 0, 0);
        
        // 이미 지난 시간이면 내일로 설정
        if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }
        
        const delay = scheduledTime.getTime() - now.getTime();
        
        setTimeout(() => {
            this.createNotification(notificationData);
            // 다음 날을 위해 다시 예약
            this.scheduleDaily(hour, minute, notificationData);
        }, delay);
    }
    
    // 스타일 추가
    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .floating-notification-btn {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .floating-notification-btn:hover {
                transform: translateY(-3px) rotate(15deg);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            }
            
            .notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                font-weight: 700;
                animation: pulse 2s ease-in-out infinite;
            }
            
            .notification-modal {
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
            
            .notification-modal-content {
                background: white;
                border-radius: 16px;
                width: 100%;
                max-width: 600px;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: scaleIn 0.3s ease;
            }
            
            .notification-modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notification-header-actions {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }
            
            .notification-permission-btn {
                padding: 0.5rem 1rem;
                background: #10b981;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 0.875rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .notification-permission-btn:hover {
                background: #059669;
            }
            
            .notification-action-btn {
                padding: 0.5rem 1rem;
                background: #f3f4f6;
                color: #374151;
                border: none;
                border-radius: 8px;
                font-size: 0.875rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .notification-action-btn:hover {
                background: #e5e7eb;
            }
            
            .notification-close-btn {
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
            
            .notification-close-btn:hover {
                background: #e5e7eb;
                transform: rotate(90deg);
            }
            
            .notification-filters {
                display: flex;
                gap: 0.5rem;
                padding: 1rem 1.5rem;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .notification-filter-btn {
                padding: 0.5rem 1rem;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                font-size: 0.875rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .notification-filter-btn.active {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-color: transparent;
            }
            
            .notification-list {
                flex: 1;
                overflow-y: auto;
                padding: 1rem 1.5rem;
            }
            
            .notification-item {
                display: flex;
                gap: 1rem;
                padding: 1rem;
                background: #f9fafb;
                border-radius: 12px;
                margin-bottom: 0.75rem;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .notification-item.unread {
                background: #eff6ff;
                border-left: 4px solid #3b82f6;
            }
            
            .notification-item:hover {
                transform: translateX(5px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .notification-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 0.25rem;
            }
            
            .notification-message {
                font-size: 0.875rem;
                color: #6b7280;
                margin-bottom: 0.25rem;
            }
            
            .notification-time {
                font-size: 0.75rem;
                color: #9ca3af;
            }
            
            .notification-actions {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }
            
            .notification-mark-read-btn,
            .notification-delete-btn {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: none;
                background: white;
                cursor: pointer;
                font-size: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .notification-mark-read-btn:hover {
                background: #10b981;
                color: white;
            }
            
            .notification-delete-btn:hover {
                background: #ef4444;
                color: white;
            }
            
            .notification-empty {
                text-align: center;
                padding: 3rem 1rem;
            }
            
            .notification-empty-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            
            .notification-empty-text {
                color: #9ca3af;
                font-size: 1rem;
            }
            
            .notification-modal-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid #e5e7eb;
                text-align: center;
            }
            
            .notification-clear-btn {
                padding: 0.75rem 1.5rem;
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .notification-clear-btn:hover {
                background: #dc2626;
                transform: translateY(-2px);
            }
            
            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            @media (max-width: 768px) {
                .floating-notification-btn {
                    top: auto;
                    bottom: 80px;
                }
                
                .notification-modal-content {
                    max-height: 100vh;
                    height: 100vh;
                    border-radius: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.notificationSystem = new NotificationSystem();
    console.log('✅ 알림 시스템 로드 완료');
});
