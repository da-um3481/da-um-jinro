# 🔴 브리핑 전 필수 체크!

## ⚠️ TEST_MODE 끄기 (매우 중요!)

파일: `geunhwa-student-portal.html`

찾아서 수정:
```javascript
const TEST_MODE = true;  // 🔴 브리핑 전 false로 변경!
```

다음으로 변경:
```javascript
const TEST_MODE = false;  // ✅ 실제 운영 모드
```

## 왜 중요한가?

- **TEST_MODE = true**: 30초만 학습해도 완료 가능 (테스트용)
- **TEST_MODE = false**: 30분 학습해야 완료 가능 (실제 운영)

## 수정 방법

1. `geunhwa-student-portal.html` 파일 열기
2. 1231번째 줄 근처 찾기
3. `const TEST_MODE = true;` → `const TEST_MODE = false;` 변경
4. 저장
5. Git commit & push

```bash
git add geunhwa-student-portal.html
git commit -m "Switch to production mode - 30 minutes minimum"
git push origin main
```

## 언제 바꿔야 하나?

**브리핑 1시간 전!**

테스트는 TEST_MODE=true로 하고,
실제 브리핑 때는 TEST_MODE=false로!
