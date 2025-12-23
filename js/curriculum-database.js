// ==========================================
// 📚 중학교 교과서 단원별 학습 내용 데이터베이스
// ==========================================
// 2015 개정 교육과정 + 2022 개정 교육과정 통합
// 학년별(중1/2/3) × 과목별(수학/영어/국어/과학/사회) × 수준별(기본/표준/심화)

const CURRICULUM_DB = {
    // ==========================================
    // 📐 중학교 1학년 수학
    // ==========================================
    middle1_math: {
        semester1: [
            {
                unit: "I. 소인수분해",
                chapters: [
                    {
                        name: "1. 소수와 합성수",
                        concepts: {
                            basic: ["소수의 뜻", "합성수의 뜻", "1은 소수도 합성수도 아님", "거듭제곱의 뜻"],
                            standard: ["소수 판별하기", "에라토스테네스의 체", "거듭제곱으로 나타내기"],
                            advanced: ["100 이하의 소수 찾기", "거듭제곱의 밑과 지수"]
                        },
                        keywords: ["소수", "합성수", "거듭제곱", "밑", "지수"]
                    },
                    {
                        name: "2. 소인수분해",
                        concepts: {
                            basic: ["소인수의 뜻", "소인수분해의 뜻", "소인수분해하는 방법"],
                            standard: ["소인수분해를 이용하여 약수 구하기", "약수의 개수 구하기"],
                            advanced: ["거듭제곱 형태로 만들기", "여러 수의 소인수분해 비교"]
                        },
                        keywords: ["소인수", "소인수분해", "약수", "약수의 개수"]
                    },
                    {
                        name: "3. 최대공약수와 최소공배수",
                        concepts: {
                            basic: ["공약수와 최대공약수", "공배수와 최소공배수"],
                            standard: ["소인수분해를 이용한 최대공약수", "소인수분해를 이용한 최소공배수"],
                            advanced: ["세 수의 최대공약수와 최소공배수", "실생활 문제 해결"]
                        },
                        keywords: ["공약수", "최대공약수", "공배수", "최소공배수"]
                    }
                ]
            },
            {
                unit: "II. 정수와 유리수",
                chapters: [
                    {
                        name: "1. 정수와 유리수",
                        concepts: {
                            basic: ["양수와 음수", "정수와 유리수의 뜻", "수직선"],
                            standard: ["절댓값", "수의 대소 관계"],
                            advanced: ["수직선 위의 두 점 사이의 거리"]
                        },
                        keywords: ["양수", "음수", "정수", "유리수", "절댓값", "수직선"]
                    },
                    {
                        name: "2. 정수와 유리수의 덧셈과 뺄셈",
                        concepts: {
                            basic: ["정수의 덧셈", "정수의 뺄셈", "유리수의 덧셈"],
                            standard: ["유리수의 뺄셈", "덧셈과 뺄셈의 혼합 계산"],
                            advanced: ["복잡한 식의 계산"]
                        },
                        keywords: ["덧셈", "뺄셈", "부호", "계산 순서"]
                    },
                    {
                        name: "3. 정수와 유리수의 곱셈과 나눗셈",
                        concepts: {
                            basic: ["정수의 곱셈", "유리수의 곱셈", "곱셈의 교환법칙·결합법칙"],
                            standard: ["정수의 나눗셈", "유리수의 나눗셈", "사칙연산의 혼합 계산"],
                            advanced: ["복잡한 분수의 계산", "역수를 이용한 나눗셈"]
                        },
                        keywords: ["곱셈", "나눗셈", "역수", "사칙연산"]
                    }
                ]
            },
            {
                unit: "III. 문자와 식",
                chapters: [
                    {
                        name: "1. 문자의 사용과 식의 값",
                        concepts: {
                            basic: ["문자를 사용한 식", "곱셈 기호의 생략", "나눗셈을 분수로"],
                            standard: ["식의 값 구하기", "대입"],
                            advanced: ["복잡한 식의 값"]
                        },
                        keywords: ["문자", "식", "대입", "식의 값"]
                    },
                    {
                        name: "2. 일차식의 계산",
                        concepts: {
                            basic: ["다항식, 항, 계수, 차수", "동류항", "일차식"],
                            standard: ["일차식의 덧셈과 뺄셈", "일차식과 수의 곱셈과 나눗셈"],
                            advanced: ["복잡한 일차식의 계산"]
                        },
                        keywords: ["다항식", "일차식", "동류항", "계수", "차수"]
                    }
                ]
            },
            {
                unit: "IV. 좌표평면과 그래프",
                chapters: [
                    {
                        name: "1. 좌표평면",
                        concepts: {
                            basic: ["순서쌍", "좌표", "좌표평면"],
                            standard: ["사분면", "점의 위치"],
                            advanced: ["대칭이동한 점의 좌표"]
                        },
                        keywords: ["순서쌍", "좌표", "좌표평면", "사분면"]
                    },
                    {
                        name: "2. 그래프",
                        concepts: {
                            basic: ["그래프의 뜻", "정비례 관계"],
                            standard: ["정비례 관계 y=ax의 그래프", "반비례 관계"],
                            advanced: ["반비례 관계 y=a/x의 그래프", "그래프 해석"]
                        },
                        keywords: ["그래프", "정비례", "반비례"]
                    }
                ]
            }
        ],
        semester2: [
            {
                unit: "I. 일차방정식",
                chapters: [
                    {
                        name: "1. 방정식과 그 해",
                        concepts: {
                            basic: ["방정식", "등식의 성질", "일차방정식"],
                            standard: ["방정식의 해", "일차방정식의 풀이"],
                            advanced: ["계수가 분수, 소수인 방정식"]
                        },
                        keywords: ["방정식", "해", "미지수", "일차방정식"]
                    },
                    {
                        name: "2. 일차방정식의 활용",
                        concepts: {
                            basic: ["실생활 문제를 방정식으로 나타내기"],
                            standard: ["수에 관한 문제", "속력·거리·시간 문제"],
                            advanced: ["비율·농도 문제", "복잡한 활용 문제"]
                        },
                        keywords: ["활용", "문장제", "속력", "농도"]
                    }
                ]
            },
            {
                unit: "II. 기본 도형",
                chapters: [
                    {
                        name: "1. 점, 선, 면, 각",
                        concepts: {
                            basic: ["점, 선, 면", "교점, 교선", "각"],
                            standard: ["맞꼭지각", "수직과 수선"],
                            advanced: ["평행선의 성질"]
                        },
                        keywords: ["점", "선", "면", "각", "맞꼭지각", "평행"]
                    },
                    {
                        name: "2. 위치 관계",
                        concepts: {
                            basic: ["두 직선의 위치 관계", "점과 직선의 거리"],
                            standard: ["직선과 평면의 위치 관계", "두 평면의 위치 관계"],
                            advanced: ["평행선과 선분의 길이"]
                        },
                        keywords: ["평행", "수직", "꼬인 위치", "위치 관계"]
                    },
                    {
                        name: "3. 작도와 합동",
                        concepts: {
                            basic: ["삼각형의 작도", "선분의 수직이등분선"],
                            standard: ["각의 이등분선", "도형의 합동"],
                            advanced: ["합동인 도형의 성질"]
                        },
                        keywords: ["작도", "합동", "수직이등분선", "각의 이등분선"]
                    }
                ]
            },
            {
                unit: "III. 평면도형",
                chapters: [
                    {
                        name: "1. 다각형",
                        concepts: {
                            basic: ["다각형의 대각선", "정다각형"],
                            standard: ["다각형의 내각의 크기의 합", "다각형의 외각의 크기의 합"],
                            advanced: ["정다각형의 한 내각과 한 외각"]
                        },
                        keywords: ["다각형", "대각선", "내각", "외각", "정다각형"]
                    },
                    {
                        name: "2. 원과 부채꼴",
                        concepts: {
                            basic: ["원의 구성 요소", "부채꼴의 호와 중심각"],
                            standard: ["원주와 원의 넓이", "부채꼴의 호의 길이와 넓이"],
                            advanced: ["복잡한 도형의 둘레와 넓이"]
                        },
                        keywords: ["원", "부채꼴", "호", "중심각", "원주", "원주율"]
                    }
                ]
            },
            {
                unit: "IV. 입체도형",
                chapters: [
                    {
                        name: "1. 다면체와 회전체",
                        concepts: {
                            basic: ["다면체", "정다면체", "회전체"],
                            standard: ["회전체의 성질", "회전축"],
                            advanced: ["단면의 모양"]
                        },
                        keywords: ["다면체", "정다면체", "회전체", "회전축", "단면"]
                    },
                    {
                        name: "2. 입체도형의 겉넓이와 부피",
                        concepts: {
                            basic: ["기둥의 겉넓이와 부피", "뿔의 겉넓이와 부피"],
                            standard: ["구의 겉넓이와 부피"],
                            advanced: ["복잡한 입체도형의 겉넓이와 부피"]
                        },
                        keywords: ["겉넓이", "부피", "기둥", "뿔", "구"]
                    }
                ]
            },
            {
                unit: "V. 통계",
                chapters: [
                    {
                        name: "1. 자료의 정리",
                        concepts: {
                            basic: ["줄기와 잎 그림", "도수분포표"],
                            standard: ["히스토그램", "도수분포다각형"],
                            advanced: ["상대도수와 그 그래프"]
                        },
                        keywords: ["도수분포표", "히스토그램", "상대도수", "계급"]
                    },
                    {
                        name: "2. 자료의 해석",
                        concepts: {
                            basic: ["평균", "중앙값", "최빈값"],
                            standard: ["대푯값의 활용"],
                            advanced: ["산포도와 분산", "표준편차"]
                        },
                        keywords: ["평균", "중앙값", "최빈값", "대푯값", "산포도"]
                    }
                ]
            }
        ]
    },

    // ==========================================
    // 📚 중학교 1학년 영어
    // ==========================================
    middle1_english: {
        semester1: [
            {
                unit: "Lesson 1: Nice to Meet You",
                chapters: [
                    {
                        name: "인사와 소개",
                        concepts: {
                            basic: ["자기소개", "인사 표현", "be동사 현재형"],
                            standard: ["상대방 소개하기", "간단한 대화", "의문문 만들기"],
                            advanced: ["다양한 인사 상황", "문화적 차이"]
                        },
                        keywords: ["greeting", "introduction", "be동사", "self-introduction"]
                    }
                ]
            },
            {
                unit: "Lesson 2: My Family",
                chapters: [
                    {
                        name: "가족 소개",
                        concepts: {
                            basic: ["가족 구성원 어휘", "소유격", "have/has"],
                            standard: ["가족 관계 설명", "외모와 성격 묘사"],
                            advanced: ["가족 나무 만들기", "확장 가족 소개"]
                        },
                        keywords: ["family", "possessive", "have", "relationship"]
                    }
                ]
            }
        ],
        semester2: []
    },

    // ==========================================
    // 📖 중학교 1학년 국어
    // ==========================================
    middle1_korean: {
        semester1: [
            {
                unit: "1. 문학의 즐거움",
                chapters: [
                    {
                        name: "시의 표현과 이해",
                        concepts: {
                            basic: ["시의 형식", "운율", "비유적 표현"],
                            standard: ["심상과 분위기", "시적 화자", "주제 파악"],
                            advanced: ["시의 감상과 비평", "창작 활동"]
                        },
                        keywords: ["시", "운율", "비유", "심상", "시적 화자"]
                    }
                ]
            },
            {
                unit: "2. 능동적 읽기와 쓰기",
                chapters: [
                    {
                        name: "읽기와 쓰기의 원리",
                        concepts: {
                            basic: ["글의 구조", "중심 내용 파악"],
                            standard: ["필자의 관점", "논리적 구성"],
                            advanced: ["비판적 읽기", "창의적 쓰기"]
                        },
                        keywords: ["읽기", "쓰기", "구조", "논리", "비판"]
                    }
                ]
            }
        ],
        semester2: []
    },

    // ==========================================
    // 🔬 중학교 1학년 과학
    // ==========================================
    middle1_science: {
        semester1: [
            {
                unit: "I. 지권의 변화",
                chapters: [
                    {
                        name: "1. 지구계와 암석",
                        concepts: {
                            basic: ["지구계의 구성", "지각의 구성 물질", "암석의 순환"],
                            standard: ["화성암", "퇴적암", "변성암"],
                            advanced: ["암석의 생성 환경과 특징"]
                        },
                        keywords: ["지구계", "암석", "광물", "암석의 순환"]
                    },
                    {
                        name: "2. 지각변동",
                        concepts: {
                            basic: ["풍화와 침식", "지진", "화산"],
                            standard: ["판의 경계", "조산운동"],
                            advanced: ["지진대와 화산대의 분포"]
                        },
                        keywords: ["지진", "화산", "판", "조산운동"]
                    }
                ]
            },
            {
                unit: "II. 여러 가지 힘",
                chapters: [
                    {
                        name: "1. 힘의 이해",
                        concepts: {
                            basic: ["힘의 표시", "중력", "탄성력", "마찰력"],
                            standard: ["힘의 합성", "힘의 분해"],
                            advanced: ["여러 힘이 작용할 때의 운동"]
                        },
                        keywords: ["힘", "중력", "탄성력", "마찰력", "합력"]
                    }
                ]
            },
            {
                unit: "III. 생물의 다양성",
                chapters: [
                    {
                        name: "1. 생물 분류",
                        concepts: {
                            basic: ["생물의 특징", "생물 분류 기준"],
                            standard: ["5계 분류", "종의 개념"],
                            advanced: ["생물 다양성의 가치"]
                        },
                        keywords: ["분류", "종", "5계", "생물 다양성"]
                    }
                ]
            }
        ],
        semester2: []
    },

    // ==========================================
    // 🌍 중학교 1학년 사회
    // ==========================================
    middle1_social: {
        semester1: [
            {
                unit: "I. 내가 사는 세계",
                chapters: [
                    {
                        name: "1. 지도로 보는 세계",
                        concepts: {
                            basic: ["위도와 경도", "지도의 종류"],
                            standard: ["지도의 해석", "축척"],
                            advanced: ["GIS와 원격탐사"]
                        },
                        keywords: ["위도", "경도", "지도", "축척", "GIS"]
                    },
                    {
                        name: "2. 세계의 다양한 자연환경",
                        concepts: {
                            basic: ["기후", "지형", "생태계"],
                            standard: ["기후대별 특징", "자연재해"],
                            advanced: ["인간과 자연환경의 상호작용"]
                        },
                        keywords: ["기후", "지형", "열대", "건조", "온대"]
                    }
                ]
            },
            {
                unit: "II. 우리와 다른 기후, 다른 생활",
                chapters: [
                    {
                        name: "1. 지역에 따라 다른 주민 생활",
                        concepts: {
                            basic: ["열대 기후 지역", "건조 기후 지역"],
                            standard: ["온대 기후 지역", "냉대·한대 기후 지역"],
                            advanced: ["기후 변화와 생활 변화"]
                        },
                        keywords: ["열대", "건조", "온대", "냉대", "한대"]
                    }
                ]
            }
        ],
        semester2: []
    }
};

// ==========================================
// 🔍 단원 검색 및 조회 함수
// ==========================================

/**
 * 특정 과목의 단원 정보 가져오기
 * @param {string} grade - 학년 (middle1, middle2, middle3)
 * @param {string} subject - 과목 (math, english, korean, science, social)
 * @param {number} semester - 학기 (1 or 2)
 * @returns {Array} 단원 목록
 */
function getUnits(grade, subject, semester) {
    const key = `${grade}_${subject}`;
    const semesterKey = `semester${semester}`;
    
    if (CURRICULUM_DB[key] && CURRICULUM_DB[key][semesterKey]) {
        return CURRICULUM_DB[key][semesterKey];
    }
    return [];
}

/**
 * 특정 단원의 상세 정보 가져오기
 * @param {string} grade - 학년
 * @param {string} subject - 과목
 * @param {number} semester - 학기
 * @param {number} unitIndex - 단원 인덱스
 * @returns {Object} 단원 상세 정보
 */
function getUnitDetail(grade, subject, semester, unitIndex) {
    const units = getUnits(grade, subject, semester);
    return units[unitIndex] || null;
}

/**
 * 수준별 학습 내용 가져오기
 * @param {Object} chapter - 챕터 객체
 * @param {string} level - 수준 (basic, standard, advanced)
 * @returns {Array} 학습 내용 목록
 */
function getConceptsByLevel(chapter, level = 'standard') {
    if (chapter && chapter.concepts && chapter.concepts[level]) {
        return chapter.concepts[level];
    }
    return [];
}

// ==========================================
// 📋 HTML 생성 함수
// ==========================================

/**
 * 단원 선택 드롭다운 HTML 생성
 */
function generateUnitSelector(grade, subject, semester) {
    const units = getUnits(grade, subject, semester);
    let html = '<select class="unit-selector px-3 py-2 border-2 border-gray-300 rounded-lg">';
    html += '<option value="">단원을 선택하세요</option>';
    
    units.forEach((unit, index) => {
        html += `<option value="${index}">${unit.unit}</option>`;
    });
    
    html += '</select>';
    return html;
}

/**
 * 단원별 학습 내용 카드 HTML 생성
 */
function generateUnitCard(unitData, level = 'standard') {
    if (!unitData) return '';
    
    let html = `
        <div class="unit-card p-4 bg-white border-2 border-green-300 rounded-xl">
            <h4 class="text-lg font-bold text-gray-800 mb-3">${unitData.unit}</h4>
            <div class="space-y-3">
    `;
    
    unitData.chapters.forEach((chapter, idx) => {
        const concepts = getConceptsByLevel(chapter, level);
        
        html += `
            <div class="chapter-item p-3 bg-gray-50 rounded-lg">
                <div class="text-sm font-bold text-green-700 mb-2">${chapter.name}</div>
                <ul class="text-xs space-y-1">
        `;
        
        concepts.forEach(concept => {
            html += `<li class="flex items-start gap-2">
                <span class="text-green-600">✓</span>
                <span>${concept}</span>
            </li>`;
        });
        
        html += `
                </ul>
                <div class="mt-2 flex flex-wrap gap-1">
        `;
        
        chapter.keywords.forEach(keyword => {
            html += `<span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">#${keyword}</span>`;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}
