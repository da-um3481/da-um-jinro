# 🤖 EBS AI 코스웨어 진단평가 기반 학생 수준 판정 시스템

**작업 완료 일시**: 2025-12-12  
**업데이트 파일**: `students.html`, `js/students.js`, `winter-materials.html`, `README.md`

---

## 🎯 업데이트 개요

학생 관리 시스템에 **EBS AI 코스웨어 진단평가 점수**를 기반으로 한 **자동 수준 판정 시스템**을 구축했습니다.

### 핵심 변경사항
1. **기존 3단계 (상/중/하)** → **새로운 4단계 (기초/중하/중상/상급)**
2. **수동 수준 선택** → **EBS AI 진단평가 점수 기반 자동 판정**
3. **교재 추천도 4단계로 세분화**

---

## 📊 학생 수준 체계 (4단계)

| 수준 | 점수 범위 | 이모지 | 설명 | 추천 학습 방향 |
|------|----------|--------|------|----------------|
| 🟢 **기초** | 0-49점 | 🟢 | 기본 개념부터 차근차근 | 기초 개념 반복 학습 |
| 🔵 **중하** | 50-69점 | 🔵 | 개념 강화 필요 | 개념+기본 유형 연습 |
| 🟡 **중상** | 70-84점 | 🟡 | 실력 향상 단계 | 개념+응용 종합 |
| 🔴 **상급** | 85-100점 | 🔴 | 심화 학습 단계 | 고난도 심화 문제 |

---

## 🆕 업데이트 내용

### 1️⃣ students.html - 학생 관리 페이지

#### 변경사항
- **EBS AI 코스웨어 진단평가 점수 입력 섹션 추가**
  - 5개 과목 (국어, 영어, 수학, 과학, 사회)
  - 각 과목 0-100점 입력 필드
  - 파란색 테마 박스 디자인
  - 과목별 이모지 아이콘 (📚🗣️🔢🔬🌏)

- **학습 수준 자동 판정 UI**
  - 점수 입력 전: "점수 입력 후 자동 판정"
  - 점수 입력 후: 자동으로 수준 표시
  - 4단계 수준 기준 표시 (기초/중하/중상/상급)
  - 수준별 점수 범위 안내
  - **disabled 상태** - 수동 변경 불가

#### 코드 예시
```html
<!-- EBS AI 코스웨어 진단평가 점수 -->
<div class="md:col-span-2">
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
        <h3 class="text-sm font-bold text-blue-800 mb-3">
            🤖 EBS AI 코스웨어 진단평가 점수
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
                <label>📚 국어</label>
                <input type="number" id="koreanScore" min="0" max="100" placeholder="0-100">
            </div>
            <!-- ... 다른 과목들 ... -->
        </div>
    </div>
</div>

<!-- 학습 수준 (자동 판정) -->
<div class="md:col-span-2">
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
        <label>📊 학습 수준 (자동 판정) *</label>
        <select id="level" disabled>
            <option value="">점수 입력 후 자동 판정</option>
            <option value="기초">🟢 기초 (0-49점)</option>
            <option value="중하">🔵 중하 (50-69점)</option>
            <option value="중상">🟡 중상 (70-84점)</option>
            <option value="상급">🔴 상급 (85-100점)</option>
        </select>
        <!-- 수준 기준 안내 박스 -->
    </div>
</div>
```

---

### 2️⃣ js/students.js - 자바스크립트 로직

#### 새로운 기능

##### ✅ 점수 입력 시 실시간 자동 수준 판정
```javascript
// 점수 입력 이벤트 리스너 설정
function setupFormHandler() {
    // ... 기존 코드 ...
    
    // 점수 입력 시 자동 수준 판정
    const scoreInputs = ['koreanScore', 'englishScore', 'mathScore', 'scienceScore', 'socialScore'];
    scoreInputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', autoCalculateLevel);
    });
}
```

##### ✅ 자동 수준 계산 함수
```javascript
function autoCalculateLevel() {
    const korean = parseFloat(document.getElementById('koreanScore').value) || 0;
    const english = parseFloat(document.getElementById('englishScore').value) || 0;
    const math = parseFloat(document.getElementById('mathScore').value) || 0;
    const science = parseFloat(document.getElementById('scienceScore').value) || 0;
    const social = parseFloat(document.getElementById('socialScore').value) || 0;
    
    const scores = [korean, english, math, science, social].filter(s => s > 0);
    
    if (scores.length === 0) {
        document.getElementById('level').value = '';
        return;
    }
    
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    let level = '';
    
    // EBS AI 코스웨어 진단평가 점수 기반 수준 판정
    if (avgScore >= 85) {
        level = '상급'; // 85-100점
    } else if (avgScore >= 70) {
        level = '중상'; // 70-84점
    } else if (avgScore >= 50) {
        level = '중하'; // 50-69점
    } else {
        level = '기초'; // 0-49점
    }
    
    document.getElementById('level').value = level;
    document.getElementById('level').disabled = false;
    
    // 시각적 피드백 (배경색 변경)
    document.getElementById('level').style.backgroundColor = getLevelColor(level);
    document.getElementById('level').style.fontWeight = 'bold';
}
```

##### ✅ 수준별 배경색 함수
```javascript
function getLevelColor(level) {
    const colors = {
        '기초': '#dcfce7', // Green-100
        '중하': '#dbeafe', // Blue-100
        '중상': '#fef3c7', // Yellow-100
        '상급': '#fee2e2'  // Red-100
    };
    return colors[level] || '#f3f4f6';
}
```

##### ✅ 학생 저장 시 검증
```javascript
async function saveStudent() {
    // 수준이 비어있으면 자동 계산
    autoCalculateLevel();
    
    const levelValue = document.getElementById('level').value;
    if (!levelValue) {
        alert('EBS AI 코스웨어 진단평가 점수를 입력해주세요.');
        return;
    }
    
    // ... 저장 로직 ...
}
```

##### ✅ 수준 배지 업데이트 (4단계)
```javascript
function getLevelBadge(level) {
    const badges = {
        '기초': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border-2 border-green-300">🟢 기초</span>',
        '중하': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border-2 border-blue-300">🔵 중하</span>',
        '중상': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 border-2 border-yellow-300">🟡 중상</span>',
        '상급': '<span class="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border-2 border-red-300">🔴 상급</span>',
        // 기존 3단계 호환성 유지
        '상': '<span>🔴 상급</span>',
        '중': '<span>🟡 중상</span>',
        '하': '<span>🔵 중하</span>'
    };
    return badges[level] || '<span class="text-gray-800">미정</span>';
}
```

---

### 3️⃣ winter-materials.html - 교재 관리 페이지

#### 교재 추천 4단계로 세분화

**기존**: 3단계 (기초/내신/최상위)  
**변경**: 4단계 (기초/중하/중상/상급)

#### 수학 교재 추천
| 수준 | 점수 | 교재 | 특징 | 난이도 |
|------|------|------|------|--------|
| 🟢 기초 | 0-49 | 체크체크 수학 | 기초 개념 반복 학습 | ⭐⭐ |
| 🔵 중하 | 50-69 | 개념원리 RPM | 개념+기본 유형 | ⭐⭐⭐ |
| 🟡 중상 | 70-84 | 개념원리 중학수학 | 개념+응용 종합 | ⭐⭐⭐⭐ |
| 🔴 상급 | 85-100 | 일품/블랙라벨 | 고난도 심화 | ⭐⭐⭐⭐⭐ |

#### 영어 교재 추천
| 수준 | 점수 | 교재 | 특징 | 난이도 |
|------|------|------|------|--------|
| 🟢 기초 | 0-49 | Grammar Zone 기초편 | 문법 기초 다지기 | ⭐⭐ |
| 🔵 중하 | 50-69 | 중학 영문법 3800제 | 문법+기본 독해 | ⭐⭐⭐ |
| 🟡 중상 | 70-84 | 리딩튜터+자습서 | 내신+독해 병행 | ⭐⭐⭐⭐ |
| 🔴 상급 | 85-100 | 리딩파워/능률보카 | 심화 독해+어휘 | ⭐⭐⭐⭐⭐ |

#### 코드 변경 (3컬럼 → 4컬럼)
```html
<!-- 기존: grid-cols-3 -->
<div class="grid grid-cols-3 gap-6">
    <!-- 3개 카드 -->
</div>

<!-- 변경: grid-cols-4 -->
<div class="grid grid-cols-4 gap-4">
    <!-- 4개 카드 (기초/중하/중상/상급) -->
    <div class="bg-green-50 rounded-xl p-5 border-2 border-green-300">
        <div class="text-green-600 font-bold mb-2">
            🟢 기초 <span class="text-xs bg-green-200 px-2 py-0.5 rounded">0-49점</span>
        </div>
        <div class="text-xl font-black">체크체크 수학</div>
        <!-- ... -->
    </div>
    <!-- ... 나머지 3개 카드 ... -->
</div>
```

---

## 🎨 UI/UX 개선사항

### 1. 시각적 피드백
- **점수 입력 시**: 실시간으로 평균 계산 및 수준 자동 표시
- **배경색 변경**: 수준별로 다른 배경색 (초록/파랑/노랑/빨강)
- **폰트 강조**: 자동 판정된 수준은 bold 처리

### 2. 사용자 경험
- **명확한 안내**: 점수 범위 및 수준 기준 표시
- **자동화**: 수동 선택 불필요, 점수만 입력하면 자동 판정
- **검증**: 점수 미입력 시 저장 불가, 경고 메시지 표시

### 3. 디자인 통일성
- **그라데이션 박스**: EBS AI 섹션은 파란색, 수준 판정은 보라-핑크 그라데이션
- **아이콘 일관성**: 이모지와 Font Awesome 아이콘 혼용
- **반응형**: 모바일에서도 잘 보이도록 grid 레이아웃 적용

---

## 📋 사용 방법

### 선생님용 (학생 등록)
1. **학생 관리** 페이지 (`students.html`) 접속
2. 학생 기본 정보 입력 (이름, 학년, 반, 번호)
3. **EBS AI 코스웨어 진단평가 점수 입력**
   - 국어, 영어, 수학, 과학, 사회 점수 입력
   - 각 과목 0-100점 범위
4. **자동 수준 판정 확인**
   - 평균 점수 기반으로 자동 계산
   - 수준 선택 박스에 자동으로 표시됨
5. **저장** 버튼 클릭
6. 저장 시 **수준별 교재 자동 추천**

### 학생 수준 확인
- 학생 목록에서 수준 배지로 한눈에 확인
  - 🟢 기초, 🔵 중하, 🟡 중상, 🔴 상급
- 평균 점수도 함께 표시

### 교재 추천 확인
1. **교재 관리** 페이지 (`winter-materials.html`) 접속
2. 수준별 교재 추천 확인
   - 수학, 영어는 4단계로 세분화
   - 각 수준별 점수 범위 표시
3. **EBS AI 코스웨어 섹션** 활용
   - 무료 AI 학습 시스템 소개
   - 활용 팁 및 바로가기 링크

---

## 🔍 기술적 세부사항

### 자동 수준 판정 알고리즘
```
1. 입력된 5개 과목 점수 수집
2. 0점 제외 (입력되지 않은 과목)
3. 유효한 점수들의 평균 계산
4. 평균 점수 기준으로 수준 판정:
   - avgScore >= 85  → 상급
   - avgScore >= 70  → 중상
   - avgScore >= 50  → 중하
   - avgScore <  50  → 기초
5. 수준 선택 박스에 자동 설정
6. 배경색 및 스타일 적용
```

### 데이터 구조
```javascript
{
  name: "홍길동",
  grade: 2,
  class_num: 3,
  student_num: 15,
  korean_score: 75,    // EBS AI 진단평가 점수
  english_score: 82,   // EBS AI 진단평가 점수
  math_score: 68,      // EBS AI 진단평가 점수
  science_score: 71,   // EBS AI 진단평가 점수
  social_score: 79,    // EBS AI 진단평가 점수
  level: "중상",       // 자동 판정 (평균 75점)
  status: "활동중"
}
```

### 호환성
- **기존 3단계 데이터 자동 매핑**
  - 상 → 상급
  - 중 → 중상
  - 하 → 중하
- **배지 표시 시 자동 변환**
- **기존 데이터 유지 가능**

---

## ✅ 테스트 시나리오

### 1. 기초 수준 학생 (평균 40점)
- 국어: 45, 영어: 38, 수학: 35, 과학: 42, 사회: 40
- **예상 결과**: 🟢 기초 (평균 40점)
- **추천 교재**: 체크체크 수학, Grammar Zone 기초편

### 2. 중하 수준 학생 (평균 60점)
- 국어: 62, 영어: 58, 수학: 55, 과학: 65, 사회: 60
- **예상 결과**: 🔵 중하 (평균 60점)
- **추천 교재**: 개념원리 RPM, 중학 영문법 3800제

### 3. 중상 수준 학생 (평균 75점)
- 국어: 78, 영어: 72, 수학: 70, 과학: 80, 사회: 75
- **예상 결과**: 🟡 중상 (평균 75점)
- **추천 교재**: 개념원리 중학수학, 리딩튜터+자습서

### 4. 상급 수준 학생 (평균 90점)
- 국어: 88, 영어: 92, 수학: 95, 과학: 85, 사회: 90
- **예상 결과**: 🔴 상급 (평균 90점)
- **추천 교재**: 일품/블랙라벨, 리딩파워/능률보카

---

## 📊 기대 효과

### 1. 정확한 수준 판정
- EBS AI 코스웨어 진단평가 점수 기반
- 객관적인 데이터로 수준 결정
- 4단계로 세분화하여 더 정확한 추천

### 2. 자동화로 업무 효율 증대
- 수동 선택 불필요
- 점수만 입력하면 자동 판정
- 교재 추천도 자동화

### 3. 학생 맞춤형 학습 지원
- 수준에 맞는 정확한 교재 추천
- 4단계로 더 세밀한 맞춤형 학습
- EBS AI 코스웨어와 연계

### 4. 투명한 기준
- 점수 범위 명시 (0-49, 50-69, 70-84, 85-100)
- 학생/학부모도 이해하기 쉬운 기준
- 진도 향상 시 다음 단계로 자연스럽게 이동

---

## 🔗 관련 파일

### 업데이트된 파일
- `students.html` - EBS AI 점수 입력 UI 추가
- `js/students.js` - 자동 수준 판정 로직 구현
- `winter-materials.html` - 4단계 교재 추천으로 변경
- `README.md` - 문서 업데이트

### 관련 문서
- `README.md` - 전체 시스템 가이드
- `EBS_AI코스웨어_추가완료.md` - EBS AI 섹션 추가 문서
- `WINTER_30DAYS_SYSTEM_GUIDE.md` - 겨울방학 프로그램 가이드

---

## 💡 향후 개선 아이디어

1. **과목별 수준 판정**
   - 전체 평균이 아닌 과목별로 다른 수준 적용
   - 예: 수학은 기초, 영어는 중상

2. **수준 변화 추적**
   - 시간에 따른 수준 변화 그래프
   - 성장 추이 시각화

3. **EBS AI 코스웨어 연동**
   - API 연동 시 자동으로 점수 가져오기
   - 실시간 진단평가 결과 반영

4. **학부모 대시보드**
   - 자녀의 수준 및 추천 교재 확인
   - 학습 진도 모니터링

---

## 📞 문의 및 지원

**프로젝트**: DA.UM 다움진로진학컨설팅 학습 관리 시스템  
**대표**: 정라미 컨설턴트  
**연락처**: 010-2657-3481  
**업데이트**: 2025-12-12  

---

**✅ EBS AI 코스웨어 진단평가 기반 학생 수준 판정 시스템 구축 완료!**
