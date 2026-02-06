/**
 * DA.UM Classroom V2 - 모바일 터치 UX 개선
 * 
 * 기능:
 * - 터치 제스처 지원
 * - 스와이프 네비게이션
 * - 터치 피드백 개선
 * - 모바일 키보드 대응
 * - 풀스크린 모달
 */

// 터치 이벤트 상태
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// 스와이프 감지 최소 거리
const SWIPE_THRESHOLD = 50;

/**
 * 터치 이벤트 초기화
 */
function initTouchEvents() {
    // 스와이프 네비게이션 (탭 전환)
    const mainScreen = document.getElementById('mainScreen');
    if (mainScreen) {
        mainScreen.addEventListener('touchstart', handleTouchStart, { passive: true });
        mainScreen.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // 터치 피드백 개선
    addTouchFeedback();
    
    // 모바일 키보드 대응
    handleMobileKeyboard();
    
    // 풀스크린 모달 터치 개선
    improveModalTouch();
    
    console.log('✅ 터치 UX 초기화 완료');
}

/**
 * 터치 시작 처리
 */
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

/**
 * 터치 종료 처리 (스와이프 감지)
 */
function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    handleSwipeGesture();
}

/**
 * 스와이프 제스처 처리
 */
function handleSwipeGesture() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // 수평 스와이프가 수직보다 크면 탭 전환
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > SWIPE_THRESHOLD) {
        const tabs = ['timetable', 'today', 'journal', 'mission', 'materials', 'questions'];
        const currentTab = document.querySelector('.tab-active')?.id?.replace('tab-', '');
        
        if (!currentTab) return;
        
        const currentIndex = tabs.indexOf(currentTab);
        
        // 왼쪽 스와이프 = 다음 탭
        if (diffX < 0 && currentIndex < tabs.length - 1) {
            showTab(tabs[currentIndex + 1]);
        }
        // 오른쪽 스와이프 = 이전 탭
        else if (diffX > 0 && currentIndex > 0) {
            showTab(tabs[currentIndex - 1]);
        }
    }
}

/**
 * 터치 피드백 개선
 */
function addTouchFeedback() {
    // 모든 버튼에 터치 피드백 추가
    const buttons = document.querySelectorAll('button, .cute-btn, .tab-btn, a[role="button"]');
    
    buttons.forEach(button => {
        // 터치 시작
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
            this.style.opacity = '0.7';
        }, { passive: true });
        
        // 터치 종료
        button.addEventListener('touchend', function() {
            this.style.transform = '';
            this.style.opacity = '';
        }, { passive: true });
        
        // 터치 취소
        button.addEventListener('touchcancel', function() {
            this.style.transform = '';
            this.style.opacity = '';
        }, { passive: true });
    });
    
    console.log(`✅ ${buttons.length}개 요소에 터치 피드백 추가`);
}

/**
 * 모바일 키보드 대응
 */
function handleMobileKeyboard() {
    // input/textarea 포커스 시 화면 자동 스크롤
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // 키보드가 올라오면 해당 요소가 보이도록 스크롤
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
    
    // 키보드 숨김 시 원래 위치로
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

/**
 * 모달 터치 개선
 */
function improveModalTouch() {
    // 모달 배경 터치 시 닫기
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
            e.target.remove();
        }
    });
    
    // 모달 내부 스크롤 개선
    const modals = document.querySelectorAll('.fixed .overflow-y-auto');
    modals.forEach(modal => {
        modal.style.webkitOverflowScrolling = 'touch';
    });
}

/**
 * 풀스크린 이미지 뷰어 (핀치 줌 지원)
 */
let currentScale = 1;
let currentX = 0;
let currentY = 0;

function enablePinchZoom(imageElement) {
    let initialDistance = 0;
    let isPinching = false;
    
    imageElement.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            isPinching = true;
            initialDistance = getDistance(e.touches[0], e.touches[1]);
        }
    }, { passive: true });
    
    imageElement.addEventListener('touchmove', function(e) {
        if (isPinching && e.touches.length === 2) {
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const scale = currentDistance / initialDistance;
            currentScale = Math.min(Math.max(0.5, currentScale * scale), 3);
            
            this.style.transform = `scale(${currentScale})`;
            initialDistance = currentDistance;
        }
    }, { passive: true });
    
    imageElement.addEventListener('touchend', function() {
        isPinching = false;
    }, { passive: true });
}

function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 하단 네비게이션 바 (모바일 전용)
 */
function createMobileNavBar() {
    // 768px 이하에서만 표시
    if (window.innerWidth > 768) return;
    
    const navBar = document.createElement('nav');
    navBar.className = 'fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-xl z-50 md:hidden';
    navBar.style.paddingBottom = 'env(safe-area-inset-bottom)'; // iOS safe area
    
    const tabs = [
        { id: 'timetable', icon: '📅', label: '시간표' },
        { id: 'today', icon: '🌟', label: '복습' },
        { id: 'journal', icon: '📖', label: '학습' },
        { id: 'mission', icon: '🎯', label: '미션' },
        { id: 'questions', icon: '💬', label: '질문' }
    ];
    
    navBar.innerHTML = `
        <div class="flex justify-around py-2">
            ${tabs.map(tab => `
                <button 
                    onclick="showTab('${tab.id}')" 
                    class="mobile-nav-btn flex flex-col items-center gap-1 px-3 py-2 flex-1"
                    data-tab="${tab.id}"
                >
                    <span class="text-2xl">${tab.icon}</span>
                    <span class="text-xs font-bold text-gray-600">${tab.label}</span>
                </button>
            `).join('')}
        </div>
    `;
    
    document.body.appendChild(navBar);
    
    // 활성 탭 표시
    updateMobileNavActive();
}

/**
 * 모바일 네비게이션 활성 상태 업데이트
 */
function updateMobileNavActive() {
    const currentTab = document.querySelector('.tab-active')?.id?.replace('tab-', '');
    
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        if (btn.dataset.tab === currentTab) {
            btn.classList.add('text-blue-600');
            btn.classList.remove('text-gray-600');
        } else {
            btn.classList.remove('text-blue-600');
            btn.classList.add('text-gray-600');
        }
    });
}

/**
 * 화면 크기 변경 감지
 */
function handleResize() {
    // 모바일 네비게이션 바 토글
    const mobileNav = document.querySelector('.fixed.bottom-0');
    if (window.innerWidth > 768 && mobileNav) {
        mobileNav.remove();
    } else if (window.innerWidth <= 768 && !mobileNav) {
        createMobileNavBar();
    }
}

/**
 * Pull-to-Refresh (당겨서 새로고침)
 */
let pullStartY = 0;
let isPulling = false;

function initPullToRefresh() {
    const mainScreen = document.getElementById('mainScreen');
    if (!mainScreen) return;
    
    mainScreen.addEventListener('touchstart', function(e) {
        if (window.scrollY === 0) {
            pullStartY = e.touches[0].clientY;
            isPulling = true;
        }
    }, { passive: true });
    
    mainScreen.addEventListener('touchmove', function(e) {
        if (isPulling) {
            const pullDistance = e.touches[0].clientY - pullStartY;
            
            if (pullDistance > 100) {
                // 새로고침 트리거
                location.reload();
            }
        }
    }, { passive: true });
    
    mainScreen.addEventListener('touchend', function() {
        isPulling = false;
    }, { passive: true });
}

/**
 * 초기화
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initTouchEvents();
        createMobileNavBar();
        initPullToRefresh();
        
        window.addEventListener('resize', handleResize);
        
        // showTab 함수에 훅 추가
        const originalShowTab = window.showTab;
        if (originalShowTab) {
            window.showTab = function(tabName) {
                originalShowTab(tabName);
                updateMobileNavActive();
            };
        }
    });
} else {
    initTouchEvents();
    createMobileNavBar();
    initPullToRefresh();
    
    window.addEventListener('resize', handleResize);
}

console.log('✅ 모바일 터치 UX 모듈 로드 완료');
