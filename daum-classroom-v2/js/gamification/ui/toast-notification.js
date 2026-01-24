/**
 * DA.UM 토스트 알림 시스템
 * 사용자에게 즉각적인 피드백 제공
 */

class ToastNotification {
  constructor() {
    this.container = this.createContainer();
    this.queue = [];
    this.isShowing = false;
  }

  /**
   * 토스트 컨테이너 생성
   */
  createContainer() {
    let container = document.getElementById('toast-container');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    return container;
  }

  /**
   * 토스트 표시
   * @param {object} options - 토스트 옵션
   */
  show(options = {}) {
    const toast = {
      id: Date.now(),
      type: options.type || 'info', // success, error, warning, info, levelup
      title: options.title || '',
      message: options.message || '',
      duration: options.duration || 3000,
      icon: this.getIcon(options.type),
      rewards: options.rewards || null
    };

    this.queue.push(toast);
    
    if (!this.isShowing) {
      this.showNext();
    }
  }

  /**
   * 다음 토스트 표시
   */
  showNext() {
    if (this.queue.length === 0) {
      this.isShowing = false;
      return;
    }

    this.isShowing = true;
    const toast = this.queue.shift();
    
    this.displayToast(toast);
  }

  /**
   * 토스트 표시 처리
   */
  displayToast(toast) {
    const toastElement = this.createToastElement(toast);
    this.container.appendChild(toastElement);

    // 애니메이션 시작
    setTimeout(() => {
      toastElement.classList.add('show');
    }, 10);

    // 자동 제거
    setTimeout(() => {
      this.removeToast(toastElement);
    }, toast.duration);
  }

  /**
   * 토스트 요소 생성
   */
  createToastElement(toast) {
    const element = document.createElement('div');
    element.className = `toast toast-${toast.type}`;
    element.dataset.toastId = toast.id;

    let content = `
      <div class="toast-content">
        <div class="toast-icon">${toast.icon}</div>
        <div class="toast-body">
          ${toast.title ? `<div class="toast-title">${toast.title}</div>` : ''}
          ${toast.message ? `<div class="toast-message">${toast.message.replace(/\n/g, '<br>')}</div>` : ''}
        </div>
    `;

    // 보상 정보 추가
    if (toast.rewards) {
      content += `<div class="toast-rewards">`;
      if (toast.rewards.exp) {
        content += `<span class="reward-item">+${toast.rewards.exp} EXP</span>`;
      }
      if (toast.rewards.coins) {
        content += `<span class="reward-item">+${toast.rewards.coins} 💰</span>`;
      }
      content += `</div>`;
    }

    content += `
        <button class="toast-close" onclick="toastNotification.removeToastById(${toast.id})">
          ✕
        </button>
      </div>
    `;

    element.innerHTML = content;
    return element;
  }

  /**
   * 토스트 제거
   */
  removeToast(element) {
    element.classList.remove('show');
    element.classList.add('hide');

    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.showNext();
    }, 300);
  }

  /**
   * ID로 토스트 제거
   */
  removeToastById(id) {
    const element = this.container.querySelector(`[data-toast-id="${id}"]`);
    if (element) {
      this.removeToast(element);
    }
  }

  /**
   * 타입별 아이콘 반환
   */
  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      exp: '⭐',
      coin: '💰',
      levelup: '🎉'
    };
    return icons[type] || icons.info;
  }
}

// 전역 인스턴스 생성
let toastNotification = null;

// 편의 함수
function showToast(options) {
  if (!toastNotification) {
    toastNotification = new ToastNotification();
    window.toastNotification = toastNotification;
  }
  toastNotification.show(options);
}

// DOMContentLoaded 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  if (!toastNotification) {
    toastNotification = new ToastNotification();
    window.toastNotification = toastNotification;
    window.showToast = showToast;
  }
});
