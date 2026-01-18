/* ============================================
   DA.UM 학생 포털 - UX 개선 JavaScript
   ============================================ */

// 1. 초기화
document.addEventListener('DOMContentLoaded', function() {
    initScrollTopButton();
    initToastSystem();
    initLoadingOverlay();
    initFormValidation();
    initSmoothScroll();
    initEmptyStates();
    initSkeletonLoading();
    initStickyNav();
    console.log('✅ DA.UM UX 개선 스크립트 로드 완료');
});

// 2. 스크롤 탑 버튼
function initScrollTopButton() {
    // HTML에 버튼 추가
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scroll-top-btn';
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.innerHTML = '⬆️';
    scrollBtn.setAttribute('aria-label', '맨 위로');
    document.body.appendChild(scrollBtn);
    
    // 스크롤 이벤트
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }, 100);
    });
    
    // 클릭 이벤트
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 3. 토스트 알림 시스템
function initToastSystem() {
    // 토스트 컨테이너 생성
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
}

function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // 자동 제거
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    // 클릭으로 제거
    toast.addEventListener('click', () => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    });
}

// 전역으로 사용 가능하게
window.showToast = showToast;

// 4. 로딩 오버레이
function initLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay hidden';
    overlay.innerHTML = `
        <div class="spinner"></div>
        <p class="loading-text">로딩 중...</p>
    `;
    document.body.appendChild(overlay);
}

function showLoading(message = '로딩 중...') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        const text = overlay.querySelector('.loading-text');
        if (text) text.textContent = message;
        overlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

window.showLoading = showLoading;
window.hideLoading = hideLoading;

// 5. 폼 검증
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            // 실시간 검증
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            // 입력 시 에러 제거
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    const errorMsg = this.parentElement.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
            });
        });
        
        // 제출 시 전체 검증
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showToast('입력 항목을 확인해주세요.', 'error');
            }
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // 기존 에러 메시지 제거
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // 필수 입력 검증
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = '이 항목은 필수입니다.';
    }
    
    // 이메일 검증
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = '올바른 이메일 형식이 아닙니다.';
        }
    }
    
    // 숫자 검증
    if (input.type === 'number' && value) {
        const min = input.getAttribute('min');
        const max = input.getAttribute('max');
        
        if (min && parseFloat(value) < parseFloat(min)) {
            isValid = false;
            errorMessage = `최소값은 ${min}입니다.`;
        }
        
        if (max && parseFloat(value) > parseFloat(max)) {
            isValid = false;
            errorMessage = `최대값은 ${max}입니다.`;
        }
    }
    
    // 결과 적용
    if (!isValid) {
        input.classList.add('error');
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = errorMessage;
        input.parentElement.appendChild(error);
    } else {
        input.classList.remove('error');
    }
    
    return isValid;
}

// 6. 부드러운 스크롤
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 7. 빈 상태 자동 표시
function initEmptyStates() {
    const dataContainers = document.querySelectorAll('[data-empty-message]');
    
    dataContainers.forEach(container => {
        if (container.children.length === 0 || 
            (container.textContent.trim() === '' && container.children.length === 0)) {
            showEmptyState(container);
        }
    });
}

function showEmptyState(container) {
    const message = container.getAttribute('data-empty-message') || '데이터가 없습니다.';
    const icon = container.getAttribute('data-empty-icon') || '📭';
    
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state';
    emptyDiv.innerHTML = `
        <div class="empty-icon">${icon}</div>
        <h3>아직 데이터가 없어요</h3>
        <p>${message}</p>
    `;
    
    container.appendChild(emptyDiv);
}

// 8. 스켈레톤 로딩
function initSkeletonLoading() {
    const skeletons = document.querySelectorAll('.skeleton');
    
    // 3초 후 스켈레톤 제거 (실제로는 데이터 로드 완료 시)
    setTimeout(() => {
        skeletons.forEach(skeleton => {
            skeleton.classList.remove('skeleton');
        });
    }, 3000);
}

function createSkeleton(type = 'text', count = 3) {
    const container = document.createElement('div');
    
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = `skeleton skeleton-${type}`;
        container.appendChild(skeleton);
    }
    
    return container;
}

// 9. 데이터 저장 헬퍼 (LocalStorage)
function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('데이터 저장 실패:', e);
        return false;
    }
}

function loadData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('데이터 로드 실패:', e);
        return null;
    }
}

window.saveData = saveData;
window.loadData = loadData;

// 10. 디바운스 헬퍼
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.debounce = debounce;

// 11. 네트워크 상태 감지
window.addEventListener('online', () => {
    showToast('인터넷 연결이 복구되었습니다.', 'success');
});

window.addEventListener('offline', () => {
    showToast('인터넷 연결이 끊어졌습니다.', 'warning');
});

// 12. 페이지 가시성 감지 (백그라운드 탭)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('페이지가 백그라운드로 이동');
    } else {
        console.log('페이지가 포그라운드로 복귀');
        // 필요시 데이터 새로고침
    }
});

// 13. 애니메이션 헬퍼
function addAnimationClass(element, animationClass) {
    element.classList.add(animationClass);
    element.addEventListener('animationend', function handler() {
        element.classList.remove(animationClass);
        element.removeEventListener('animationend', handler);
    });
}

window.addAnimationClass = addAnimationClass;

// 14. 카드 자동 애니메이션
function animateCards() {
    const cards = document.querySelectorAll('.cute-card, .card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        setTimeout(() => {
            card.classList.add('fade-in');
            card.style.opacity = '1';
        }, index * 100);
    });
}

window.animateCards = animateCards;

// 15. 버튼 로딩 상태 헬퍼
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

window.setButtonLoading = setButtonLoading;

// 16. 확인 다이얼로그 (커스텀)
function showConfirm(message, onConfirm, onCancel) {
    const result = confirm(message);
    if (result && onConfirm) {
        onConfirm();
    } else if (!result && onCancel) {
        onCancel();
    }
    return result;
}

window.showConfirm = showConfirm;

// 17. 데이터 포맷 헬퍼
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatTime(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}시간 ${minutes}분`;
    } else if (minutes > 0) {
        return `${minutes}분 ${secs}초`;
    } else {
        return `${secs}초`;
    }
}

window.formatDate = formatDate;
window.formatTime = formatTime;
window.formatDuration = formatDuration;

// 18. 이미지 프리로드
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

window.preloadImage = preloadImage;

// 19. 클립보드 복사
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('클립보드에 복사되었습니다.', 'success');
        return true;
    } catch (err) {
        console.error('복사 실패:', err);
        showToast('복사에 실패했습니다.', 'error');
        return false;
    }
}

window.copyToClipboard = copyToClipboard;

// 20. 랜덤 색상 생성
function getRandomColor() {
    const colors = [
        '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
        '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

window.getRandomColor = getRandomColor;

// 21. 사용 예시 함수들
function exampleUsage() {
    // 토스트 사용
    // showToast('저장되었습니다!', 'success');
    
    // 로딩 표시
    // showLoading('데이터를 불러오는 중...');
    // setTimeout(hideLoading, 2000);
    
    // 데이터 저장
    // saveData('userSettings', { theme: 'light', language: 'ko' });
    
    // 데이터 로드
    // const settings = loadData('userSettings');
    
    // 버튼 로딩 상태
    // const btn = document.querySelector('.save-btn');
    // setButtonLoading(btn, true);
    // setTimeout(() => setButtonLoading(btn, false), 2000);
    
    // 날짜 포맷
    // const today = formatDate(new Date()); // "2026-01-18"
    
    // 클립보드 복사
    // copyToClipboard('복사할 텍스트');
}

// 22. 학습 기록 저장 헬퍼 (예시)
async function saveStudyRecord(data) {
    showLoading('학습 기록을 저장하는 중...');
    
    try {
        // 기존 기록 로드
        const records = loadData('study_records') || [];
        
        // 새 기록 추가
        const newRecord = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...data
        };
        records.push(newRecord);
        
        // 저장
        saveData('study_records', records);
        
        hideLoading();
        showToast('학습 기록이 저장되었습니다!', 'success');
        return true;
    } catch (error) {
        hideLoading();
        showToast('저장에 실패했습니다.', 'error');
        console.error('저장 오류:', error);
        return false;
    }
}

window.saveStudyRecord = saveStudyRecord;

// 23. Sticky Navigation
function initStickyNav() {
    const nav = document.getElementById('stickyNav');
    if (!nav) return;
    
    // 스크롤 시 nav 스타일 변경
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // 초기 active 상태 설정
    updateActiveNavLink('timetable');
}

function updateActiveNavLink(tabName) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkTab = link.getAttribute('data-tab');
        if (linkTab === tabName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.updateActiveNavLink = updateActiveNavLink;

// 24. 완료! ✨
console.log('✅ DA.UM UX 개선 스크립트 로드 완료');
