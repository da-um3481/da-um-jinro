// DA.UM 학습관리 시스템 보안 스크립트
// © 2025 DA.UM 다움진로진학컨설팅

(function() {
    'use strict';
    
    // ====================================
    // 1. 비밀번호 인증 시스템
    // ====================================
    const PASSWORD = "daum2025!"; // 비밀번호 (변경 가능)
    const AUTH_KEY = 'daum_auth_verified';
    
    function checkAuthentication() {
        const isAuthenticated = sessionStorage.getItem(AUTH_KEY);
        
        if (isAuthenticated !== 'true') {
            const userInput = prompt(
                '🔒 DA.UM 학습관리 시스템\n\n' +
                '정식 이용자만 접근 가능합니다.\n' +
                '비밀번호를 입력하세요:'
            );
            
            if (userInput !== PASSWORD) {
                alert(
                    '❌ 접근 권한이 없습니다.\n\n' +
                    'DA.UM 정식 이용자만 사용 가능합니다.\n' +
                    '문의: 010-2657-3481 (정라미)'
                );
                
                // 접근 거부
                document.body.innerHTML = `
                    <div style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        font-family: 'Noto Sans KR', sans-serif;
                        text-align: center;
                        color: white;
                    ">
                        <div>
                            <h1 style="font-size: 3em; margin-bottom: 20px;">🔒</h1>
                            <h2 style="margin-bottom: 10px;">접근 권한이 없습니다</h2>
                            <p style="font-size: 1.2em; margin-bottom: 20px;">
                                DA.UM 정식 이용자만 사용 가능합니다
                            </p>
                            <p style="font-size: 1em; opacity: 0.9;">
                                © DA.UM 다움진로진학컨설팅<br>
                                📞 010-2657-3481 (정라미)
                            </p>
                        </div>
                    </div>
                `;
                
                // 뒤로가기 방지
                window.history.pushState(null, '', window.location.href);
                window.onpopstate = function() {
                    window.history.pushState(null, '', window.location.href);
                };
                
                return false;
            }
            
            // 인증 성공
            sessionStorage.setItem(AUTH_KEY, 'true');
            console.log('✅ 인증 성공');
        }
        
        return true;
    }
    
    // ====================================
    // 2. 저작권 워터마크 추가
    // ====================================
    function addWatermark() {
        // 기존 워터마크 제거 (중복 방지)
        const existingWatermark = document.getElementById('daum-watermark');
        if (existingWatermark) {
            existingWatermark.remove();
        }
        
        const watermark = document.createElement('div');
        watermark.id = 'daum-watermark';
        watermark.innerHTML = `
            <div style="
                position: fixed;
                bottom: 15px;
                right: 15px;
                background: rgba(102, 126, 234, 0.95);
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                font-size: 12px;
                font-family: 'Noto Sans KR', sans-serif;
                z-index: 999999;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                cursor: default;
                user-select: none;
                line-height: 1.6;
            ">
                © 2025 DA.UM 다움진로진학컨설팅<br>
                📞 010-2657-3481 | 무단 도용 금지
            </div>
        `;
        
        document.body.appendChild(watermark);
        
        // 워터마크 제거 방지
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.removedNodes.forEach(function(node) {
                    if (node.id === 'daum-watermark') {
                        addWatermark();
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // ====================================
    // 3. 우클릭 방지
    // ====================================
    function preventRightClick() {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showProtectionMessage('우클릭이 비활성화되어 있습니다.');
            return false;
        }, false);
    }
    
    // ====================================
    // 4. 텍스트 선택 방지
    // ====================================
    function preventTextSelection() {
        document.addEventListener('selectstart', function(e) {
            // 입력 필드는 허용
            if (e.target.tagName === 'INPUT' || 
                e.target.tagName === 'TEXTAREA' || 
                e.target.isContentEditable) {
                return true;
            }
            e.preventDefault();
            return false;
        }, false);
    }
    
    // ====================================
    // 5. 복사 방지
    // ====================================
    function preventCopy() {
        document.addEventListener('copy', function(e) {
            // 입력 필드는 허용
            if (e.target.tagName === 'INPUT' || 
                e.target.tagName === 'TEXTAREA' || 
                e.target.isContentEditable) {
                return true;
            }
            
            e.preventDefault();
            e.clipboardData.setData('text/plain', 
                '© DA.UM 다움진로진학컨설팅 - 무단 복사 금지\n문의: 010-2657-3481'
            );
            showProtectionMessage('콘텐츠 복사가 제한되어 있습니다.');
            return false;
        }, false);
    }
    
    // ====================================
    // 6. 키보드 단축키 방지 (F12, Ctrl+U 등)
    // ====================================
    function preventKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // F12 (개발자 도구)
            if (e.key === 'F12') {
                e.preventDefault();
                showProtectionMessage('개발자 도구가 비활성화되어 있습니다.');
                return false;
            }
            
            // Ctrl+Shift+I (개발자 도구)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                showProtectionMessage('개발자 도구가 비활성화되어 있습니다.');
                return false;
            }
            
            // Ctrl+Shift+J (콘솔)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                return false;
            }
            
            // Ctrl+U (소스 보기)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                showProtectionMessage('소스 보기가 비활성화되어 있습니다.');
                return false;
            }
            
            // Ctrl+S (저장)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                return false;
            }
        }, false);
    }
    
    // ====================================
    // 7. 보호 메시지 표시
    // ====================================
    function showProtectionMessage(message) {
        const existingToast = document.getElementById('daum-protection-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.id = 'daum-protection-toast';
        toast.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(220, 38, 38, 0.95);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                font-size: 14px;
                font-family: 'Noto Sans KR', sans-serif;
                z-index: 9999999;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                animation: slideDown 0.3s ease-out;
            ">
                🔒 ${message}
            </div>
            <style>
                @keyframes slideDown {
                    from { transform: translateY(-100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(function() {
            toast.style.transition = 'opacity 0.3s ease-out';
            toast.style.opacity = '0';
            setTimeout(function() {
                toast.remove();
            }, 300);
        }, 2000);
    }
    
    // ====================================
    // 8. 개발자 도구 감지 (선택적)
    // ====================================
    function detectDevTools() {
        const threshold = 160;
        
        setInterval(function() {
            if (window.outerWidth - window.innerWidth > threshold || 
                window.outerHeight - window.innerHeight > threshold) {
                // 개발자 도구가 열림 (경고만 표시)
                console.clear();
                console.log('%c⚠️ 경고', 'color: red; font-size: 20px; font-weight: bold;');
                console.log('%c이 웹사이트는 저작권으로 보호되고 있습니다.', 'font-size: 14px;');
                console.log('%c© DA.UM 다움진로진학컨설팅', 'font-size: 12px;');
                console.log('%c📞 010-2657-3481', 'font-size: 12px;');
            }
        }, 1000);
    }
    
    // ====================================
    // 9. 콘솔 경고 메시지
    // ====================================
    function addConsoleWarning() {
        console.clear();
        console.log('%c🔒 DA.UM 학습관리 시스템', 'color: #667eea; font-size: 24px; font-weight: bold;');
        console.log('%c⚠️ 경고: 이 사이트는 저작권으로 보호되고 있습니다.', 'color: red; font-size: 16px; font-weight: bold;');
        console.log('%c무단 복제, 수정, 배포는 법적 조치 대상입니다.', 'font-size: 14px;');
        console.log('%c© 2025 DA.UM 다움진로진학컨설팅', 'font-size: 12px; color: #666;');
        console.log('%c📞 010-2657-3481 (정라미)', 'font-size: 12px; color: #666;');
        console.log(' ');
    }
    
    // ====================================
    // 초기화 함수
    // ====================================
    function init() {
        // 1. 인증 확인
        if (!checkAuthentication()) {
            return; // 인증 실패 시 중단
        }
        
        // 2. 페이지 로드 완료 후 보호 기능 활성화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                activateProtection();
            });
        } else {
            activateProtection();
        }
    }
    
    function activateProtection() {
        addWatermark();
        preventRightClick();
        preventTextSelection();
        preventCopy();
        preventKeyboardShortcuts();
        detectDevTools();
        addConsoleWarning();
        
        console.log('✅ DA.UM 보안 시스템 활성화');
    }
    
    // 스크립트 실행
    init();
    
})();
