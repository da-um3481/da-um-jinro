// 🌸 캐주얼 파티 게임 스타일 - 인터랙티브 효과

(function() {
    'use strict';

    // 떠다니는 요소 생성
    function createFloatingElements() {
        const emojis = ['☁️', '⭐', '💖', '🌈', '✨', '🎈', '🌸', '🦋', '💕', '🎀'];
        const container = document.createElement('div');
        container.id = 'floatingElements';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        document.body.insertBefore(container, document.body.firstChild);

        for (let i = 0; i < 12; i++) {
            const element = document.createElement('div');
            element.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            element.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 25}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0.6;
                animation: float-random ${Math.random() * 10 + 10}s infinite ease-in-out;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(element);
        }

        // CSS 애니메이션 추가
        if (!document.getElementById('floating-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'floating-animation-styles';
            style.textContent = `
                @keyframes float-random {
                    0%, 100% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                    }
                    25% {
                        transform: translateY(-30px) translateX(20px) rotate(5deg);
                    }
                    50% {
                        transform: translateY(-60px) translateX(-10px) rotate(-5deg);
                    }
                    75% {
                        transform: translateY(-30px) translateX(30px) rotate(3deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 색종이 효과 생성
    function createConfetti(x, y, count = 20) {
        const colors = ['#ffb3d9', '#ffd4b3', '#b3f0e0', '#e0d4ff', '#fff3b3', '#ffc9e3'];
        
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${x}px;
                top: ${y}px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                pointer-events: none;
                z-index: 9999;
                animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
                animation-delay: ${Math.random() * 0.3}s;
            `;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }

        // CSS 애니메이션 추가
        if (!document.getElementById('confetti-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-animation-styles';
            style.textContent = `
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 버튼 클릭 시 색종이 효과
    function addConfettiToButtons() {
        const buttons = document.querySelectorAll('.cute-btn, .btn-primary-cute, .btn-secondary-cute, button[type="submit"]');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                createConfetti(x, y, 15);
            });
        });
    }

    // 성공 메시지 시 색종이 폭발
    function celebrateSuccess() {
        // MutationObserver로 토스트 알림 감지
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && (node.classList.contains('toast-notification') || node.classList.contains('success'))) {
                        // 화면 중앙에서 색종이 폭발
                        createConfetti(window.innerWidth / 2, window.innerHeight / 2, 30);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 레벨업 시 특별한 효과
    function celebrateLevelUp() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('levelup')) {
                        // 레벨업 시 더 많은 색종이!
                        setTimeout(() => {
                            for (let i = 0; i < 5; i++) {
                                setTimeout(() => {
                                    createConfetti(
                                        Math.random() * window.innerWidth,
                                        Math.random() * window.innerHeight / 2,
                                        20
                                    );
                                }, i * 200);
                            }
                        }, 100);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 카드 호버 시 흔들기 효과
    function addCardWiggle() {
        const cards = document.querySelectorAll('.cute-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icons = this.querySelectorAll('i, .emoji');
                icons.forEach(icon => {
                    icon.classList.add('icon-wiggle');
                });
            });

            card.addEventListener('mouseleave', function() {
                const icons = this.querySelectorAll('i, .emoji');
                icons.forEach(icon => {
                    icon.classList.remove('icon-wiggle');
                });
            });
        });
    }

    // 마스코트 눈 깜빡임 효과
    function addMascotBlink() {
        const mascot = document.querySelector('.mascot-icon');
        if (mascot) {
            setInterval(() => {
                mascot.style.animation = 'none';
                setTimeout(() => {
                    mascot.style.animation = 'bounce 2s infinite';
                }, 10);
            }, 5000);
        }
    }

    // 스크롤 시 헤더 효과
    function addHeaderScrollEffect() {
        const header = document.querySelector('.sticky-nav');
        if (header) {
            let lastScroll = 0;
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                lastScroll = currentScroll;
            });
        }
    }

    // 페이지 로드 시 환영 효과
    function welcomeEffect() {
        // 페이지 로드 시 여러 곳에서 색종이 터짐
        setTimeout(() => {
            const positions = [
                { x: window.innerWidth * 0.25, y: window.innerHeight * 0.3 },
                { x: window.innerWidth * 0.75, y: window.innerHeight * 0.3 },
                { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 }
            ];

            positions.forEach((pos, index) => {
                setTimeout(() => {
                    createConfetti(pos.x, pos.y, 15);
                }, index * 300);
            });
        }, 500);
    }

    // 초기화 함수
    function init() {
        // DOM이 완전히 로드된 후 실행
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                executeEffects();
            });
        } else {
            executeEffects();
        }
    }

    function executeEffects() {
        createFloatingElements();
        addConfettiToButtons();
        celebrateSuccess();
        celebrateLevelUp();
        addCardWiggle();
        addMascotBlink();
        addHeaderScrollEffect();
        
        // 환영 효과는 처음 한 번만
        if (!sessionStorage.getItem('welcomed')) {
            welcomeEffect();
            sessionStorage.setItem('welcomed', 'true');
        }

        console.log('🌸 캐주얼 파티 게임 스타일 활성화! ✨');
    }

    // 초기화 실행
    init();

})();
