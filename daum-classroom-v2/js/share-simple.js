/* ============================================
   DA.UM 다움 클래스룸 - 간소화된 공유 시스템 (이미지만)
   ============================================ */

class SimpleShareSystem {
    constructor() {
        this.shareData = null;
        this.init();
    }
    
    init() {
        this.createShareUI();
        this.addShareStyles();
        this.attachShareEvents();
        console.log('✅ 간소화 공유 시스템 초기화');
    }
    
    // UI 생성
    createShareUI() {
        // 플로팅 공유 버튼
        const shareBtn = document.createElement('button');
        shareBtn.id = 'share-btn';
        shareBtn.className = 'floating-share-btn';
        shareBtn.innerHTML = '📸';
        shareBtn.setAttribute('aria-label', '성과 공유');
        document.body.appendChild(shareBtn);
        
        // 공유 모달
        const modal = document.createElement('div');
        modal.id = 'share-modal';
        modal.className = 'share-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-modal-header">
                    <h3 class="text-xl font-bold">🌸 학습 성과 공유하기</h3>
                    <button class="share-close-btn" id="share-close">✕</button>
                </div>
                
                <div class="share-modal-body">
                    <!-- 미리보기 카드 -->
                    <div class="share-preview-card" id="share-preview">
                        <div class="share-preview-header">
                            <div class="share-preview-icon">🐰</div>
                            <div class="share-preview-title">다움 클래스룸 학습 성과</div>
                        </div>
                        <div class="share-preview-stats">
                            <div class="share-stat">
                                <div class="share-stat-value" id="share-total-hours">0</div>
                                <div class="share-stat-label">총 학습 시간</div>
                            </div>
                            <div class="share-stat">
                                <div class="share-stat-value" id="share-completed">0</div>
                                <div class="share-stat-label">완료한 수업</div>
                            </div>
                            <div class="share-stat">
                                <div class="share-stat-value" id="share-streak">0</div>
                                <div class="share-stat-label">연속 학습일</div>
                            </div>
                        </div>
                        <div class="share-preview-footer">
                            <span id="share-username">학생</span>님의 학습 여정 🌟
                        </div>
                    </div>
                    
                    <!-- 이미지로 저장만 -->
                    <div class="share-image-export">
                        <h4 class="share-section-title">🖼️ 이미지로 저장하기</h4>
                        <p class="share-description">위 카드를 이미지로 저장하여 SNS에 공유하세요!</p>
                        <button id="share-save-image" class="share-btn share-btn-primary">
                            💾 이미지로 저장
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // 이벤트 연결
    attachShareEvents() {
        // 공유 버튼 클릭
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.openModal());
        }
        
        // 모달 닫기
        const closeBtn = document.getElementById('share-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // 모달 외부 클릭 시 닫기
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
        
        // 이미지로 저장
        document.getElementById('share-save-image')?.addEventListener('click', () => this.saveAsImage());
    }
    
    // 모달 열기
    openModal() {
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.updatePreview();
        }
    }
    
    // 모달 닫기
    closeModal() {
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // 미리보기 업데이트
    updatePreview() {
        // 실제 데이터 가져오기
        const studyRecords = JSON.parse(localStorage.getItem('studySessions') || '[]');
        const streakData = JSON.parse(localStorage.getItem('streak-data') || '{}');
        const username = localStorage.getItem('username') || '학생';
        
        // 총 학습 시간 계산 (시간 단위)
        const totalSeconds = studyRecords.reduce((sum, record) => sum + (record.duration || 0), 0);
        const totalHours = Math.round(totalSeconds / 3600);
        
        // 완료한 수업 수
        const completedCount = studyRecords.length;
        
        // 연속 학습일
        const currentStreak = streakData.currentStreak || 0;
        
        // UI 업데이트
        document.getElementById('share-total-hours').textContent = totalHours;
        document.getElementById('share-completed').textContent = completedCount;
        document.getElementById('share-streak').textContent = currentStreak;
        document.getElementById('share-username').textContent = username;
    }
    
    // 이미지로 저장
    async saveAsImage() {
        const previewCard = document.getElementById('share-preview');
        if (!previewCard) return;

        // html2canvas가 로드되었는지 확인
        if (typeof html2canvas === 'undefined') {
            // html2canvas 동적 로드
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
            script.onload = () => this.captureAndDownload(previewCard);
            document.head.appendChild(script);
            
            if (typeof showToast === 'function') {
                showToast('⏳ 라이브러리 로딩 중...', 'info');
            }
        } else {
            this.captureAndDownload(previewCard);
        }
    }
    
    // 캡처 및 다운로드
    async captureAndDownload(element) {
        try {
            const canvas = await html2canvas(element, {
                backgroundColor: null,
                scale: 2,
                logging: false
            });
            
            const link = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            link.download = `다움클래스룸_학습성과_${date}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            if (typeof showToast === 'function') {
                showToast('✅ 이미지가 저장되었습니다!', 'success');
            }
            
            // 색종이 효과
            if (window.createConfetti) {
                createConfetti(window.innerWidth / 2, window.innerHeight / 2, 30);
            }
        } catch (error) {
            console.error('이미지 저장 실패:', error);
            if (typeof showToast === 'function') {
                showToast('❌ 이미지 저장 실패', 'error');
            }
        }
    }
    
    // 스타일 추가
    addShareStyles() {
        if (document.getElementById('share-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'share-styles';
        style.textContent = `
            .floating-share-btn {
                position: fixed;
                top: 240px;
                right: 20px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ffb3d9 0%, #ffc9e3 100%);
                color: white;
                border: 3px solid white;
                font-size: 1.75rem;
                cursor: pointer;
                box-shadow: 0 6px 20px rgba(255, 179, 217, 0.4);
                transition: all 0.3s ease;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: float-gentle 3s infinite ease-in-out;
            }
            
            @keyframes float-gentle {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            .floating-share-btn:hover {
                transform: translateY(-5px) scale(1.1);
                box-shadow: 0 8px 25px rgba(255, 179, 217, 0.6);
                animation: none;
            }
            
            .share-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(5px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .share-modal-content {
                background: white;
                border-radius: 30px;
                width: 100%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: scaleIn 0.3s ease;
            }
            
            @keyframes scaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            .share-modal-header {
                padding: 1.5rem;
                border-bottom: 2px solid #fff0f6;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                background: white;
                z-index: 1;
                border-radius: 30px 30px 0 0;
            }
            
            .share-modal-header h3 {
                font-family: 'Gaegu', cursive;
                background: linear-gradient(135deg, #ffb3d9, #ffd4b3);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .share-close-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #fff5f9;
                border: 2px solid #ffb3d9;
                cursor: pointer;
                font-size: 1.25rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                color: #ffb3d9;
                font-weight: bold;
            }
            
            .share-close-btn:hover {
                background: #ffb3d9;
                color: white;
                transform: rotate(90deg);
            }
            
            .share-modal-body {
                padding: 1.5rem;
            }
            
            .share-preview-card {
                background: linear-gradient(135deg, #ffb3d9 0%, #ffd4b3 100%);
                border-radius: 25px;
                padding: 2.5rem 2rem;
                color: white;
                margin-bottom: 1.5rem;
                box-shadow: 0 10px 30px rgba(255, 179, 217, 0.3);
            }
            
            .share-preview-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .share-preview-icon {
                font-size: 3rem;
                animation: bounce 2s infinite;
            }
            
            .share-preview-title {
                font-size: 1.5rem;
                font-weight: 900;
                font-family: 'Gaegu', cursive;
            }
            
            .share-preview-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .share-stat {
                text-align: center;
                padding: 1.5rem 1rem;
                background: rgba(255, 255, 255, 0.25);
                border-radius: 20px;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .share-stat-value {
                font-size: 2.5rem;
                font-weight: 900;
                margin-bottom: 0.5rem;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .share-stat-label {
                font-size: 0.875rem;
                opacity: 0.95;
                font-weight: 600;
            }
            
            .share-preview-footer {
                text-align: center;
                font-size: 1.125rem;
                font-weight: 600;
                opacity: 0.95;
            }
            
            .share-section-title {
                font-size: 1.125rem;
                font-weight: 900;
                color: #333;
                margin-bottom: 0.75rem;
            }
            
            .share-description {
                font-size: 0.875rem;
                color: #666;
                margin-bottom: 1.25rem;
                line-height: 1.6;
            }
            
            .share-image-export {
                background: linear-gradient(135deg, #fff5f9, #fffbf0);
                border-radius: 20px;
                padding: 2rem;
                border: 2px solid #ffb3d9;
            }
            
            .share-btn {
                width: 100%;
                padding: 1rem 1.5rem;
                border: none;
                border-radius: 50px;
                font-weight: 900;
                font-size: 1.125rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Noto Sans KR', sans-serif;
            }
            
            .share-btn-primary {
                background: linear-gradient(135deg, #ffb3d9 0%, #ff99cc 100%);
                color: white;
                box-shadow: 0 6px 20px rgba(255, 179, 217, 0.3);
            }
            
            .share-btn-primary:hover {
                transform: translateY(-3px) scale(1.02);
                box-shadow: 0 10px 30px rgba(255, 179, 217, 0.5);
            }
            
            @media (max-width: 768px) {
                .floating-share-btn {
                    top: 225px;
                    right: 12px;
                    width: 44px;
                    height: 44px;
                    font-size: 1.25rem;
                    border: 2px solid white;
                }
                
                .share-preview-stats {
                    grid-template-columns: 1fr;
                }
                
                .share-preview-card {
                    padding: 2rem 1.5rem;
                }
                
                .share-stat {
                    padding: 1rem;
                }
                
                .share-stat-value {
                    font-size: 2rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.shareSystem = new SimpleShareSystem();
    console.log('✅ 간소화 공유 시스템 로드 완료');
});
