# 📚 근화 학생 포털 프로젝트

학생들의 자기주도 학습을 돕는 웹 기반 학습 관리 시스템

---

## 🚀 프로그램

### 겨울방학 30일 프로그램
- **파일**: `geunhwa-student-portal.html`
- **URL**: https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal.html
- **대상**: 자기주도 학습 집중 프로그램

### 학기중 100일 프로그램
- **파일**: `geunhwa-student-portal-semester.html`
- **URL**: https://da-um3481.github.io/da-um-jinro/geunhwa-student-portal-semester.html
- **대상**: 학교 수업 + 자기주도 학습 병행

---

## 📖 문서

### 사용자용
- **STUDENT_USER_GUIDE.md** - 학생들을 위한 사용 설명서

### 개발자용
- **DEVELOPER_GUIDE.md** ⭐ - 개발자를 위한 완전한 가이드
- **TIMER_SYSTEM_GUIDE.md** - 타이머 시스템 상세 설명
- **AI_FEEDBACK_SYSTEM.md** - AI 피드백 시스템 설명
- **PROGRAM_COMPARISON.md** - 30일 vs 100일 프로그램 비교

---

## 🔧 개발 시작하기

### 백업 먼저!
```bash
# 현재 작동하는 버전 백업
./backup.sh
```

### 파일 구조
```
/home/user/webapp/
├── geunhwa-student-portal.html          # 30일 프로그램
├── geunhwa-student-portal-semester.html # 100일 프로그램
├── backup.sh                             # 백업 스크립트
├── README.md                             # 이 파일
└── docs/
    ├── DEVELOPER_GUIDE.md                # 개발자 가이드 ⭐
    └── ...
```

### 개발 워크플로우

1. **백업**
   ```bash
   ./backup.sh
   ```

2. **개발**
   - 코드 수정
   - 로컬 테스트

3. **테스트 시나리오**
   - 로그인 → 타이머 시작 → 로그아웃 → 재로그인
   - 여러 번 반복해서 타이머 작동 확인

4. **커밋 & 푸시**
   ```bash
   git add .
   git commit -m "설명"
   git push origin main
   ```

5. **배포 확인**
   - 1-2분 후 GitHub Pages에서 확인

---

## ⚠️ 개발 시 주의사항

### 절대 하지 말 것 ❌
1. 타이머 관련 코드 함부로 수정
2. `timerStartTime` localStorage 키 임의 삭제
3. 테스트 없이 배포
4. 여러 기능 동시 수정

### 꼭 할 것 ✅
1. 수정 전 백업
2. 작은 단위로 테스트
3. 커밋 메시지 명확히
4. 문서 업데이트

---

## 🐛 문제 발생 시

### 타이머 문제
1. **DEVELOPER_GUIDE.md** 의 "디버깅 팁" 참고
2. 콘솔에서 localStorage 확인
3. 백업 버전으로 복원

### 복원 방법
```bash
# 백업 목록 확인
ls -lht backups/

# 특정 백업 복원
cp backups/backup_YYYYMMDD_HHMMSS/geunhwa-student-portal.html .
```

---

## 📞 도움말

- 학생 사용법: **STUDENT_USER_GUIDE.md**
- 개발 가이드: **DEVELOPER_GUIDE.md** ⭐
- 타이머 문제: **TIMER_SYSTEM_GUIDE.md**

---

**최종 업데이트**: 2025-12-29  
**버전**: 1.0  
**배포**: GitHub Pages
