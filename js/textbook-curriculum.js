/**
 * 중학교 교과서 단원 데이터베이스
 * 2022/2025 개정 교육과정 기준
 * 학년별, 과목별, 수준별 학습 내용 제공
 */

// 교과서 단원 데이터베이스
const textbookCurriculum = {
    // 중학교 1학년
    grade1: {
        // 수학
        math: {
            name: '중1 수학',
            units: [
                {
                    id: 'math1_1',
                    name: '소인수분해',
                    chapters: [
                        { id: 1, name: '소수와 합성수', concepts: ['소수', '합성수', '에라토스테네스의 체'] },
                        { id: 2, name: '거듭제곱', concepts: ['거듭제곱의 뜻', '거듭제곱의 표현'] },
                        { id: 3, name: '소인수분해', concepts: ['소인수', '소인수분해', '소인수분해의 활용'] },
                        { id: 4, name: '최대공약수와 최소공배수', concepts: ['최대공약수', '최소공배수', '서로소'] }
                    ]
                },
                {
                    id: 'math1_2',
                    name: '정수와 유리수',
                    chapters: [
                        { id: 1, name: '정수와 유리수', concepts: ['양수와 음수', '정수', '유리수', '수직선'] },
                        { id: 2, name: '정수와 유리수의 대소 관계', concepts: ['절댓값', '부등호', '대소 비교'] },
                        { id: 3, name: '정수와 유리수의 덧셈과 뺄셈', concepts: ['덧셈', '뺄셈', '교환법칙', '결합법칙'] },
                        { id: 4, name: '정수와 유리수의 곱셈과 나눗셈', concepts: ['곱셈', '나눗셈', '역수', '사칙연산'] }
                    ]
                },
                {
                    id: 'math1_3',
                    name: '문자와 식',
                    chapters: [
                        { id: 1, name: '문자의 사용과 식의 계산', concepts: ['문자의 사용', '식의 값', '일차식', '동류항'] },
                        { id: 2, name: '일차방정식', concepts: ['등식', '방정식', '일차방정식', '방정식의 풀이'] },
                        { id: 3, name: '일차방정식의 활용', concepts: ['연속하는 정수', '거리-속력-시간', '농도', '이익' ] }
                    ]
                },
                {
                    id: 'math1_4',
                    name: '좌표평면과 그래프',
                    chapters: [
                        { id: 1, name: '순서쌍과 좌표', concepts: ['순서쌍', '좌표', 'x좌표', 'y좌표', '원점'] },
                        { id: 2, name: '정비례와 반비례', concepts: ['정비례', '반비례', '정비례 관계식', '반비례 관계식'] },
                        { id: 3, name: '정비례와 반비례 그래프', concepts: ['정비례 그래프', '반비례 그래프', '그래프의 성질'] }
                    ]
                },
                {
                    id: 'math1_5',
                    name: '기본 도형',
                    chapters: [
                        { id: 1, name: '기본 도형', concepts: ['점', '선', '면', '각', '평행선', '수직'] },
                        { id: 2, name: '작도와 합동', concepts: ['작도', '수직이등분선', '각의 이등분선', '삼각형의 작도', '합동'] },
                        { id: 3, name: '삼각형의 합동 조건', concepts: ['SSS 합동', 'SAS 합동', 'ASA 합동'] }
                    ]
                },
                {
                    id: 'math1_6',
                    name: '평면도형의 성질',
                    chapters: [
                        { id: 1, name: '다각형', concepts: ['다각형의 대각선', '다각형의 내각', '다각형의 외각'] },
                        { id: 2, name: '원과 부채꼴', concepts: ['원의 구성요소', '중심각', '호의 길이', '부채꼴의 넓이'] }
                    ]
                },
                {
                    id: 'math1_7',
                    name: '입체도형의 성질',
                    chapters: [
                        { id: 1, name: '다면체와 회전체', concepts: ['다면체', '정다면체', '회전체', '회전축'] },
                        { id: 2, name: '입체도형의 겉넓이와 부피', concepts: ['기둥', '뿔', '구', '겉넓이', '부피'] }
                    ]
                },
                {
                    id: 'math1_8',
                    name: '자료의 정리와 해석',
                    chapters: [
                        { id: 1, name: '대푯값', concepts: ['평균', '중앙값', '최빈값'] },
                        { id: 2, name: '도수분포표', concepts: ['줄기와 잎 그림', '도수분포표', '계급', '도수'] },
                        { id: 3, name: '히스토그램과 상대도수', concepts: ['히스토그램', '도수분포다각형', '상대도수'] }
                    ]
                }
            ]
        },
        
        // 국어
        korean: {
            name: '중1 국어',
            units: [
                {
                    id: 'kor1_1',
                    name: '문학',
                    chapters: [
                        { id: 1, name: '문학의 즐거움', concepts: ['문학 작품 읽기', '상상력', '감동'] },
                        { id: 2, name: '시의 운율과 심상', concepts: ['운율', '심상', '표현 방법'] }
                    ]
                },
                {
                    id: 'kor1_2',
                    name: '독서와 쓰기',
                    chapters: [
                        { id: 1, name: '설명하는 글 읽기', concepts: ['설명문', '글의 구조', '핵심 내용'] },
                        { id: 2, name: '생각을 표현하는 글 쓰기', concepts: ['주장', '근거', '논리적 구성'] }
                    ]
                },
                {
                    id: 'kor1_3',
                    name: '문법',
                    chapters: [
                        { id: 1, name: '음운의 변동', concepts: ['음운', '음운 변동', '표준 발음법'] },
                        { id: 2, name: '품사와 어휘', concepts: ['품사', '단어의 짜임', '어휘'] }
                    ]
                },
                {
                    id: 'kor1_4',
                    name: '듣기와 말하기',
                    chapters: [
                        { id: 1, name: '대화와 공감', concepts: ['대화의 원리', '공감적 듣기', '소통'] },
                        { id: 2, name: '토의와 토론', concepts: ['토의', '토론', '근거', '반박'] }
                    ]
                },
                {
                    id: 'kor1_5',
                    name: '매체',
                    chapters: [
                        { id: 1, name: '매체 자료의 탐구', concepts: ['매체', '매체 언어', '비판적 읽기'] }
                    ]
                }
            ]
        },
        
        // 영어
        english: {
            name: '중1 영어',
            units: [
                {
                    id: 'eng1_1',
                    name: 'Grammar Basics',
                    chapters: [
                        { id: 1, name: 'Be동사와 일반동사', concepts: ['be동사', '일반동사', '현재형'] },
                        { id: 2, name: '대명사', concepts: ['인칭대명사', '지시대명사', '소유대명사'] },
                        { id: 3, name: '시제', concepts: ['현재', '과거', '미래', '진행형'] }
                    ]
                },
                {
                    id: 'eng1_2',
                    name: 'Reading & Writing',
                    chapters: [
                        { id: 1, name: 'Daily Life', concepts: ['일상생활', '학교생활', '취미'] },
                        { id: 2, name: 'Stories & Culture', concepts: ['이야기', '문화', '전통'] }
                    ]
                },
                {
                    id: 'eng1_3',
                    name: 'Communication',
                    chapters: [
                        { id: 1, name: 'Listening Skills', concepts: ['듣기 전략', '주제 파악', '세부 정보'] },
                        { id: 2, name: 'Speaking Skills', concepts: ['발음', '억양', '일상 대화'] }
                    ]
                }
            ]
        },
        
        // 과학
        science: {
            name: '중1 과학',
            units: [
                {
                    id: 'sci1_1',
                    name: '과학이란',
                    chapters: [
                        { id: 1, name: '과학의 탐구', concepts: ['관찰', '실험', '과학적 방법'] }
                    ]
                },
                {
                    id: 'sci1_2',
                    name: '생물의 특성',
                    chapters: [
                        { id: 1, name: '생물과 세포', concepts: ['생물의 특성', '세포', '현미경'] },
                        { id: 2, name: '식물과 에너지', concepts: ['광합성', '식물의 구조', '증산작용'] },
                        { id: 3, name: '소화와 순환', concepts: ['소화계', '순환계', '영양소'] },
                        { id: 4, name: '호흡과 배설', concepts: ['호흡', '배설', '에너지 생성'] }
                    ]
                },
                {
                    id: 'sci1_3',
                    name: '물질의 상태',
                    chapters: [
                        { id: 1, name: '물질의 세 가지 상태', concepts: ['고체', '액체', '기체', '입자 모형'] },
                        { id: 2, name: '상태 변화', concepts: ['융해', '응고', '기화', '액화', '승화'] }
                    ]
                },
                {
                    id: 'sci1_4',
                    name: '힘과 운동',
                    chapters: [
                        { id: 1, name: '힘', concepts: ['힘의 크기', '힘의 표현', '여러 가지 힘'] },
                        { id: 2, name: '운동', concepts: ['속력', '등속 운동', '상대 운동'] }
                    ]
                },
                {
                    id: 'sci1_5',
                    name: '지구계와 지권의 변화',
                    chapters: [
                        { id: 1, name: '지구계', concepts: ['지구계의 구성', '지권', '수권', '기권', '생물권'] },
                        { id: 2, name: '암석과 광물', concepts: ['광물', '암석', '퇴적암', '화성암', '변성암'] }
                    ]
                }
            ]
        },
        
        // 사회
        social: {
            name: '중1 사회',
            units: [
                {
                    id: 'soc1_1',
                    name: '인권과 헌법',
                    chapters: [
                        { id: 1, name: '인권의 의미와 변화', concepts: ['인권', '기본권', '인권의 역사'] },
                        { id: 2, name: '헌법과 국가 기관', concepts: ['헌법', '삼권분립', '국가 기관'] }
                    ]
                },
                {
                    id: 'soc1_2',
                    name: '시장 경제와 선택',
                    chapters: [
                        { id: 1, name: '경제생활과 선택', concepts: ['희소성', '합리적 선택', '기회비용'] },
                        { id: 2, name: '시장 경제의 이해', concepts: ['시장', '수요', '공급', '가격'] }
                    ]
                },
                {
                    id: 'soc1_3',
                    name: '지역 이해와 지리 정보',
                    chapters: [
                        { id: 1, name: '지도와 지리 정보', concepts: ['지도', '위도', '경도', 'GIS'] },
                        { id: 2, name: '우리나라의 지역 이해', concepts: ['자연환경', '인문환경', '지역 특성'] }
                    ]
                },
                {
                    id: 'soc1_4',
                    name: '문화와 다양성',
                    chapters: [
                        { id: 1, name: '문화의 이해', concepts: ['문화', '문화 다양성', '문화 상대주의'] },
                        { id: 2, name: '세계의 다양한 문화', concepts: ['세계 문화', '문화 교류', '다문화 사회'] }
                    ]
                }
            ]
        }
    },
    
    // 중학교 2학년 (간략하게)
    grade2: {
        math: {
            name: '중2 수학',
            units: [
                { id: 'math2_1', name: '유리수와 순환소수', chapters: [] },
                { id: 'math2_2', name: '식의 계산', chapters: [] },
                { id: 'math2_3', name: '일차부등식', chapters: [] },
                { id: 'math2_4', name: '연립일차방정식', chapters: [] },
                { id: 'math2_5', name: '일차함수', chapters: [] },
                { id: 'math2_6', name: '삼각형의 성질', chapters: [] },
                { id: 'math2_7', name: '사각형의 성질', chapters: [] },
                { id: 'math2_8', name: '확률', chapters: [] }
            ]
        },
        korean: { name: '중2 국어', units: [] },
        english: { name: '중2 영어', units: [] },
        science: { name: '중2 과학', units: [] },
        social: { name: '중2 사회', units: [] }
    },
    
    // 중학교 3학년 (간략하게)
    grade3: {
        math: {
            name: '중3 수학',
            units: [
                { id: 'math3_1', name: '제곱근과 실수', chapters: [] },
                { id: 'math3_2', name: '인수분해', chapters: [] },
                { id: 'math3_3', name: '이차방정식', chapters: [] },
                { id: 'math3_4', name: '이차함수', chapters: [] },
                { id: 'math3_5', name: '삼각비', chapters: [] },
                { id: 'math3_6', name: '원의 성질', chapters: [] },
                { id: 'math3_7', name: '통계', chapters: [] }
            ]
        },
        korean: { name: '중3 국어', units: [] },
        english: { name: '중3 영어', units: [] },
        science: { name: '중3 과학', units: [] },
        social: { name: '중3 사회', units: [] }
    }
};

// 난이도별 학습 가이드
const difficultyGuides = {
    basic: {
        label: '기본',
        description: '기초 개념 이해와 교과서 기본 문제 풀이',
        icon: '🌱',
        color: 'orange'
    },
    standard: {
        label: '표준',
        description: '핵심 개념 심화와 다양한 유형 문제 풀이',
        icon: '📚',
        color: 'blue'
    },
    advanced: {
        label: '심화',
        description: '응용 문제와 실전 문제 풀이',
        icon: '⭐',
        color: 'purple'
    }
};

// 단원 정보 가져오기
function getCurriculumData(grade, subject) {
    const gradeKey = `grade${grade}`;
    if (textbookCurriculum[gradeKey] && textbookCurriculum[gradeKey][subject]) {
        return textbookCurriculum[gradeKey][subject];
    }
    return null;
}

// 특정 단원 가져오기
function getUnitById(grade, subject, unitId) {
    const curriculum = getCurriculumData(grade, subject);
    if (curriculum && curriculum.units) {
        return curriculum.units.find(unit => unit.id === unitId);
    }
    return null;
}

// 모든 단원 목록 가져오기
function getAllUnits(grade, subject) {
    const curriculum = getCurriculumData(grade, subject);
    return curriculum ? curriculum.units : [];
}

// 단원의 소단원(chapters) 목록 가져오기
function getChapters(grade, subject, unitId) {
    const unit = getUnitById(grade, subject, unitId);
    return unit ? unit.chapters : [];
}

// 개념 키워드 가져오기
function getConcepts(grade, subject, unitId, chapterId) {
    const unit = getUnitById(grade, subject, unitId);
    if (unit && unit.chapters) {
        const chapter = unit.chapters.find(ch => ch.id === chapterId);
        return chapter ? chapter.concepts : [];
    }
    return [];
}
