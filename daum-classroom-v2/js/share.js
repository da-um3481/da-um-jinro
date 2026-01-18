/* ============================================
   DA.UM 학생 포털 - 공유 시스템
   ============================================ */

class ShareSystem {
    constructor() {
        this.shareData = null;
        this.init();
    }
    
    init() {
        this.createShareUI();
        this.addShareStyles();
        this.attachShareEvents();
        console.log('✅ 공유 시스템 초기화');
    }
    
    // UI 생성
    createShareUI() {
        // 플로팅 공유 버튼
        const shareBtn = document.createElement('button');
        shareBtn.id = 'share-btn';
        shareBtn.className = 'floating-share-btn';
        shareBtn.innerHTML = '🔗';
        shareBtn.setAttribute('aria-label', '공유');
        document.body.appendChild(shareBtn);
        
        // 공유 모달
        const modal = document.createElement('div');
        modal.id = 'share-modal';
        modal.className = 'share-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-modal-header">
                    <h3 class="text-xl font-bold">🔗 학습 성과 공유하기</h3>
                    <button class="share-close-btn" id="share-close">✕</button>
                </div>
                
                <div class="share-modal-body">
                    <!-- 미리보기 카드 -->
                    <div class="share-preview-card" id="share-preview">
                        <div class="share-preview-header">
                            <div class="share-preview-icon">🎓</div>
                            <div class="share-preview-title">DA.UM 학습 성과</div>
                        </div>
                        <div class="share-preview-stats">
                            <div class="share-stat">
                                <div class="share-stat-value" id="share-total-hours">127</div>
                                <div class="share-stat-label">총 학습 시간</div>
                            </div>
                            <div class="share-stat">
                                <div class="share-stat-value" id="share-completed">45</div>
                                <div class="share-stat-label">완료한 수업</div>
                            </div>
                            <div class="share-stat">
                                <div class="share-stat-value" id="share-streak">23</div>
                                <div class="share-stat-label">연속 학습일</div>
                            </div>
                        </div>
                        <div class="share-preview-footer">
                            <span id="share-username">학생</span>님의 학습 여정
                        </div>
                    </div>
                    
                    <!-- 공유 옵션 -->
                    <div class="share-options">
                        <h4 class="share-section-title">📤 공유 방법</h4>
                        <div class="share-options-grid">
                            <button class="share-option-btn" id="share-link">
                                <span class="share-option-icon">🔗</span>
                                <span class="share-option-label">링크 복사</span>
                            </button>
                            <button class="share-option-btn" id="share-kakao">
                                <span class="share-option-icon">💬</span>
                                <span class="share-option-label">카카오톡</span>
                            </button>
                            <button class="share-option-btn" id="share-twitter">
                                <span class="share-option-icon">🐦</span>
                                <span class="share-option-label">Twitter</span>
                            </button>
                            <button class="share-option-btn" id="share-facebook">
                                <span class="share-option-icon">📘</span>
                                <span class="share-option-label">Facebook</span>
                            </button>
                            <button class="share-option-btn" id="share-instagram">
                                <span class="share-option-icon">📷</span>
                                <span class="share-option-label">Instagram</span>
                            </button>
                            <button class="share-option-btn" id="share-email">
                                <span class="share-option-icon">✉️</span>
                                <span class="share-option-label">Email</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- 이미지로 저장 -->
                    <div class="share-image-export">
                        <h4 class="share-section-title">🖼️ 이미지로 저장</h4>
                        <div class="share-image-styles">
                            <button class="share-style-btn" data-style="modern">모던</button>
                            <button class="share-style-btn active" data-style="minimal">미니멀</button>
                            <button class="share-style-btn" data-style="colorful">컬러풀</button>
                        </div>
                        <button id="share-save-image" class="share-btn share-btn-primary">
                            💾 이미지로 저장
                        </button>
                    </div>
                    
                    <!-- QR 코드 -->
                    <div class="share-qr-section">
                        <h4 class="share-section-title">📱 QR 코드</h4>
                        <div class="share-qr-container" id="qr-container">
                            <canvas id="qr-canvas"></canvas>
                        </div>
                        <button id="share-download-qr" class="share-btn share-btn-secondary">
                            ⬇️ QR 코드 다운로드
                        </button>
                    </div>
                    
                    <!-- 공유 설정 -->
                    <div class="share-settings">
                        <h4 class="share-section-title">⚙️ 공유 설정</h4>
                        <label class="share-setting-item">
                            <input type="checkbox" id="share-show-name" checked />
                            <span>이름 표시</span>
                        </label>
                        <label class="share-setting-item">
                            <input type="checkbox" id="share-show-details" checked />
                            <span>상세 정보 표시</span>
                        </label>
                        <label class="share-setting-item">
                            <input type="checkbox" id="share-public-profile" />
                            <span>프로필 공개</span>
                        </label>
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
        
        // 공유 방법 버튼들
        document.getElementById('share-link')?.addEventListener('click', () => this.shareViaLink());
        document.getElementById('share-kakao')?.addEventListener('click', () => this.shareViaKakao());
        document.getElementById('share-twitter')?.addEventListener('click', () => this.shareViaTwitter());
        document.getElementById('share-facebook')?.addEventListener('click', () => this.shareViaFacebook());
        document.getElementById('share-instagram')?.addEventListener('click', () => this.shareViaInstagram());
        document.getElementById('share-email')?.addEventListener('click', () => this.shareViaEmail());
        
        // 이미지 스타일 선택
        document.querySelectorAll('.share-style-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.share-style-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // 이미지로 저장
        document.getElementById('share-save-image')?.addEventListener('click', () => this.saveAsImage());
        
        // QR 코드 다운로드
        document.getElementById('share-download-qr')?.addEventListener('click', () => this.downloadQRCode());
    }
    
    // 모달 열기
    openModal() {
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.updatePreview();
            this.generateQRCode();
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
    
    // 링크 복사
    async shareViaLink() {
        const url = window.location.href;
        
        try {
            await navigator.clipboard.writeText(url);
            if (typeof showToast === 'function') {
                showToast('✅ 링크가 복사되었습니다', 'success');
            }
        } catch (error) {
            if (typeof showToast === 'function') {
                showToast('❌ 링크 복사 실패', 'error');
            }
        }
    }
    
    // 카카오톡 공유
    shareViaKakao() {
        if (typeof showToast === 'function') {
            showToast('⚠️ 카카오톡 공유는 카카오 개발자 등록이 필요합니다', 'info');
        }
        // 실제 구현 시 Kakao SDK 사용
        // Kakao.Link.sendDefault({ ... });
    }
    
    // Twitter 공유
    shareViaTwitter() {
        const text = `🎓 DA.UM 학습 성과를 공유합니다! #학습 #교육`;
        const url = encodeURIComponent(window.location.href);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }
    
    // Facebook 공유
    shareViaFacebook() {
        const url = encodeURIComponent(window.location.href);
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    }
    
    // Instagram 공유 (이미지 다운로드 안내)
    shareViaInstagram() {
        if (typeof showToast === 'function') {
            showToast('📷 이미지로 저장한 후 Instagram에 업로드하세요', 'info');
        }
    }
    
    // Email 공유
    shareViaEmail() {
        const subject = 'DA.UM 학습 성과 공유';
        const body = `안녕하세요!\n\n저의 DA.UM 학습 성과를 공유합니다.\n\n${window.location.href}`;
        const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    }
    
    // 이미지로 저장
    async saveAsImage() {
        // html2canvas 라이브러리가 필요합니다
        if (typeof showToast === 'function') {
            showToast('⚠️ 이미지 저장 기능은 html2canvas 라이브러리가 필요합니다', 'info');
        }
        
        // 실제 구현:
        // const previewCard = document.getElementById('share-preview');
        // const canvas = await html2canvas(previewCard);
        // const link = document.createElement('a');
        // link.download = 'daum-share.png';
        // link.href = canvas.toDataURL();
        // link.click();
    }
    
    // QR 코드 생성
    generateQRCode() {
        const canvas = document.getElementById('qr-canvas');
        if (!canvas) return;
        
        // QRCode.js 라이브러리가 필요합니다
        // 간단한 플레이스홀더
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 200;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 200, 200);
        
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR 코드', 100, 90);
        ctx.fillText('(QRCode.js', 100, 110);
        ctx.fillText('라이브러리 필요)', 100, 130);
        
        // 실제 구현:
        // new QRCode(canvas, {
        //     text: window.location.href,
        //     width: 200,
        //     height: 200
        // });
    }
    
    // QR 코드 다운로드
    downloadQRCode() {
        const canvas = document.getElementById('qr-canvas');
        if (!canvas) return;
        
        try {
            const link = document.createElement('a');
            link.download = 'daum-qr-code.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            if (typeof showToast === 'function') {
                showToast('✅ QR 코드가 다운로드되었습니다', 'success');
            }
        } catch (error) {
            if (typeof showToast === 'function') {
                showToast('❌ QR 코드 다운로드 실패', 'error');
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
                top: 200px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
                transition: all 0.3s ease;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .floating-share-btn:hover {
                transform: translateY(-3px) scale(1.1);
                box-shadow: 0 6px 20px rgba(245, 158, 11, 0.6);
            }
            
            .share-modal {
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
            
            .share-modal-content {
                background: white;
                border-radius: 16px;
                width: 100%;
                max-width: 700px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: scaleIn 0.3s ease;
            }
            
            .share-modal-header {
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
            
            .share-close-btn {
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
            
            .share-close-btn:hover {
                background: #e5e7eb;
                transform: rotate(90deg);
            }
            
            .share-modal-body {
                padding: 1.5rem;
            }
            
            .share-preview-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 16px;
                padding: 2rem;
                color: white;
                margin-bottom: 1.5rem;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            }
            
            .share-preview-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
            }
            
            .share-preview-icon {
                font-size: 2rem;
            }
            
            .share-preview-title {
                font-size: 1.25rem;
                font-weight: 700;
            }
            
            .share-preview-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .share-stat {
                text-align: center;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                backdrop-filter: blur(10px);
            }
            
            .share-stat-value {
                font-size: 2rem;
                font-weight: 900;
                margin-bottom: 0.25rem;
            }
            
            .share-stat-label {
                font-size: 0.875rem;
                opacity: 0.9;
            }
            
            .share-preview-footer {
                text-align: center;
                font-size: 1rem;
                opacity: 0.95;
            }
            
            .share-section-title {
                font-size: 1rem;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 1rem;
            }
            
            .share-options {
                margin-bottom: 1.5rem;
            }
            
            .share-options-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0.75rem;
            }
            
            .share-option-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem;
                background: #f9fafb;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .share-option-btn:hover {
                border-color: #667eea;
                transform: translateY(-3px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
            }
            
            .share-option-icon {
                font-size: 1.5rem;
            }
            
            .share-option-label {
                font-size: 0.875rem;
                font-weight: 600;
                color: #374151;
            }
            
            .share-image-export {
                background: #f9fafb;
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .share-image-styles {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .share-style-btn {
                flex: 1;
                padding: 0.75rem;
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 0.875rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .share-style-btn.active,
            .share-style-btn:hover {
                border-color: #667eea;
                background: #eff6ff;
            }
            
            .share-btn {
                width: 100%;
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .share-btn-primary {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
            }
            
            .share-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
            }
            
            .share-btn-secondary {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
            }
            
            .share-btn-secondary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            }
            
            .share-qr-section {
                background: #f9fafb;
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .share-qr-container {
                display: flex;
                justify-content: center;
                padding: 1.5rem;
                background: white;
                border-radius: 12px;
                margin-bottom: 1rem;
            }
            
            #qr-canvas {
                border: 2px solid #e5e7eb;
                border-radius: 8px;
            }
            
            .share-settings {
                background: #f9fafb;
                border-radius: 12px;
                padding: 1.5rem;
            }
            
            .share-setting-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                background: white;
                border-radius: 8px;
                margin-bottom: 0.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .share-setting-item:hover {
                background: #eff6ff;
            }
            
            .share-setting-item input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
            }
            
            .share-setting-item span {
                font-size: 0.875rem;
                color: #374151;
            }
            
            @media (max-width: 768px) {
                .floating-share-btn {
                    top: auto;
                    bottom: 200px;
                }
                
                .share-options-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .share-preview-stats {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.shareSystem = new ShareSystem();
    console.log('✅ 공유 시스템 로드 완료');
});
