# 🚀 성장테스트 페이지 배포 가이드

## ✅ 완료된 작업
- [x] 중1/중2/중3 성장테스트 독립 페이지 생성
  - `growth-test-grade1.html`
  - `growth-test-grade2.html`
  - `growth-test-grade3.html`
- [x] 날짜 표기: **2026년 1월 30일 (금)** 확정
- [x] GitHub 리포지토리 푸시 완료
- [x] 학생 포털 연동 코드 준비 완료

## ⚠️ 현재 상태
- **GitHub Pages 비활성화 상태**: API 조회 결과 404 (Pages not configured)
- **배포 URL 접근 불가**: https://da-um3481.github.io/da-um-jinro/growth-test-grade1.html → 404

## 🔧 배포 활성화 방법

### 방법 1: GitHub Pages 수동 활성화 (추천)
1. **리포지토리 설정 페이지 접속**:
   ```
   https://github.com/da-um3481/da-um-jinro/settings/pages
   ```

2. **Source 설정**:
   - Branch: `main`
   - Folder: `/ (root)`
   
3. **Save 클릭** → 약 1~2분 후 배포 완료

4. **배포 확인**:
   - https://da-um3481.github.io/da-um-jinro/growth-test-grade1.html
   - https://da-um3481.github.io/da-um-jinro/growth-test-grade2.html
   - https://da-um3481.github.io/da-um-jinro/growth-test-grade3.html

### 방법 2: GitHub Actions 워크플로우 추가
만약 자동 배포를 원한다면:
```yaml
# .github/workflows/pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### 방법 3: Netlify 대체 배포 (빠른 임시 배포)
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 배포
cd /home/user/webapp
netlify deploy --prod
```

## 📋 배포 후 검증 체크리스트
- [ ] growth-test-grade1.html 접근 가능 (200 OK)
- [ ] growth-test-grade2.html 접근 가능 (200 OK)
- [ ] growth-test-grade3.html 접근 가능 (200 OK)
- [ ] 날짜 표기: 2026-01-30 (금)
- [ ] 학생 포털에서 링크 작동
- [ ] 50문항 로딩 정상
- [ ] 진단평가 결과 비교 기능 작동

## 🔗 주요 URL
- **리포지토리**: https://github.com/da-um3481/da-um-jinro
- **배포 URL (활성화 후)**:
  - https://da-um3481.github.io/da-um-jinro/growth-test-grade1.html
  - https://da-um3481.github.io/da-um-jinro/growth-test-grade2.html
  - https://da-um3481.github.io/da-um-jinro/growth-test-grade3.html
- **학생 포털**: geunhwa-student-portal.html

## 📝 기술 세부사항
- **오픈일**: 2026-01-30 (금)
- **문항 구성**: 50문항 (수학 10, 영어 10, 국어 10, 사회 10, 과학 10)
- **데이터베이스**: diagnostic-test-db.js 활용
- **진단평가 비교**: localStorage의 diagnostic_results와 비교하여 성장 측정
- **시간 제한**: 없음
