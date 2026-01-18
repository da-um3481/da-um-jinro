/* ============================================
   테마 관리 시스템
   다크모드 + 컬러 테마
   ============================================ */

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.currentColorTheme = 'purple';
        this.init();
    }
    
    init() {
        // 저장된 테마 불러오기
        this.loadTheme();
        
        // 테마 컨트롤 UI 생성
        this.createThemeControls();
        
        // 시스템 테마 변경 감지
        this.watchSystemTheme();
        
        console.log('✅ 테마 매니저 초기화 완료');
    }
    
    // 테마 컨트롤 UI 생성
    createThemeControls() {
        const controls = document.createElement('div');
        controls.className = 'theme-controls';
        controls.innerHTML = `
            <button class="theme-toggle-btn" id="theme-toggle" title="다크모드 전환">
                <span class="theme-icon">🌙</span>
            </button>
            <button class="theme-toggle-btn" id="color-theme-toggle" title="컬러 테마">
                <span class="theme-icon">🎨</span>
            </button>
        `;
        
        document.body.appendChild(controls);
        
        // 컬러 테마 선택기
        const picker = document.createElement('div');
        picker.className = 'color-theme-picker';
        picker.id = 'color-theme-picker';
        picker.innerHTML = `
            <div style="text-align: center; margin-bottom: 12px; font-weight: 600; color: var(--text-primary);">
                컬러 테마 선택
            </div>
            <div style="display: flex; flex-wrap: wrap; justify-content: center;">
                <div class="color-option purple ${this.currentColorTheme === 'purple' ? 'active' : ''}" 
                     data-theme="purple" title="퍼플"></div>
                <div class="color-option mint ${this.currentColorTheme === 'mint' ? 'active' : ''}" 
                     data-theme="mint" title="민트"></div>
                <div class="color-option sunset ${this.currentColorTheme === 'sunset' ? 'active' : ''}" 
                     data-theme="sunset" title="선셋"></div>
                <div class="color-option ocean ${this.currentColorTheme === 'ocean' ? 'active' : ''}" 
                     data-theme="ocean" title="오션"></div>
                <div class="color-option cherry ${this.currentColorTheme === 'cherry' ? 'active' : ''}" 
                     data-theme="cherry" title="체리"></div>
            </div>
        `;
        
        document.body.appendChild(picker);
        
        // 이벤트 리스너
        this.attachEventListeners();
    }
    
    // 이벤트 리스너 연결
    attachEventListeners() {
        // 다크모드 토글
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // 컬러 테마 토글
        const colorToggle = document.getElementById('color-theme-toggle');
        const colorPicker = document.getElementById('color-theme-picker');
        if (colorToggle && colorPicker) {
            colorToggle.addEventListener('click', () => {
                colorPicker.classList.toggle('active');
            });
            
            // 외부 클릭 시 닫기
            document.addEventListener('click', (e) => {
                if (!colorToggle.contains(e.target) && !colorPicker.contains(e.target)) {
                    colorPicker.classList.remove('active');
                }
            });
        }
        
        // 컬러 옵션 선택
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.target.getAttribute('data-theme');
                this.setColorTheme(theme);
            });
        });
    }
    
    // 다크모드 토글
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();
        
        // 아이콘 변경
        const icon = document.querySelector('#theme-toggle .theme-icon');
        if (icon) {
            icon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
        
        // 애니메이션 효과
        document.body.style.animation = 'fadeIn 0.3s ease';
        
        // 토스트 알림
        if (typeof showToast === 'function') {
            showToast(
                `${this.currentTheme === 'dark' ? '다크' : '라이트'} 모드로 변경되었습니다`,
                'info',
                2000
            );
        }
    }
    
    // 컬러 테마 변경
    setColorTheme(theme) {
        this.currentColorTheme = theme;
        this.applyColorTheme();
        this.saveTheme();
        
        // 활성화 표시 업데이트
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`.color-option[data-theme="${theme}"]`)?.classList.add('active');
        
        // 컬러 피커 닫기
        document.getElementById('color-theme-picker')?.classList.remove('active');
        
        // 토스트 알림
        if (typeof showToast === 'function') {
            const themeNames = {
                purple: '퍼플',
                mint: '민트',
                sunset: '선셋',
                ocean: '오션',
                cherry: '체리'
            };
            showToast(`${themeNames[theme]} 테마로 변경되었습니다`, 'success', 2000);
        }
    }
    
    // 테마 적용
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }
    
    // 컬러 테마 적용
    applyColorTheme() {
        document.documentElement.setAttribute('data-color-theme', this.currentColorTheme);
    }
    
    // 테마 저장
    saveTheme() {
        localStorage.setItem('app-theme', this.currentTheme);
        localStorage.setItem('app-color-theme', this.currentColorTheme);
    }
    
    // 테마 불러오기
    loadTheme() {
        const savedTheme = localStorage.getItem('app-theme');
        const savedColorTheme = localStorage.getItem('app-color-theme');
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
            this.applyTheme();
        }
        
        if (savedColorTheme) {
            this.currentColorTheme = savedColorTheme;
            this.applyColorTheme();
        }
        
        // 아이콘 초기화
        setTimeout(() => {
            const icon = document.querySelector('#theme-toggle .theme-icon');
            if (icon) {
                icon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
            }
        }, 100);
    }
    
    // 시스템 테마 변경 감지
    watchSystemTheme() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            darkModeQuery.addEventListener('change', (e) => {
                // 사용자가 수동으로 설정하지 않은 경우에만 시스템 테마 따라가기
                const userTheme = localStorage.getItem('app-theme');
                if (!userTheme) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                }
            });
        }
    }
    
    // 테마 리셋
    resetTheme() {
        this.currentTheme = 'light';
        this.currentColorTheme = 'purple';
        this.applyTheme();
        this.applyColorTheme();
        localStorage.removeItem('app-theme');
        localStorage.removeItem('app-color-theme');
        
        if (typeof showToast === 'function') {
            showToast('테마가 초기화되었습니다', 'info');
        }
    }
}

// 전역 인스턴스 생성
let themeManager;
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
    window.themeManager = themeManager;
});

console.log('✅ 테마 매니저 스크립트 로드 완료');
