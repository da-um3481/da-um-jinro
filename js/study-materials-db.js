// 📚 중학교 1-2학년 학습 자료 데이터베이스
// 교과서, EBS 강의, 유튜브, 개념서, 문제집 종합

const STUDY_MATERIALS_DB = {
    // 🔢 수학 (Mathematics)
    math: {
        grade1: {
            semester1: {
                textbooks: [
                    { name: "중학교 수학 1-1", publisher: "천재교육/비상교육/신사고", type: "교과서" },
                    { name: "교사용 지도서", publisher: "교육부", type: "참고자료" }
                ],
                conceptBooks: [
                    {
                        name: "개념원리 중학수학 1-1",
                        publisher: "개념원리",
                        price: "15,000원",
                        features: ["기본 개념 충실", "단계별 문제", "내신 대비"],
                        link: "https://www.aladin.co.kr",
                        difficulty: "기초~중급"
                    },
                    {
                        name: "숨마쿰라우데 중학수학 개념기본서 1-1",
                        publisher: "이룸이앤비",
                        price: "16,000원",
                        features: ["개념 상세 설명", "스토리텔링", "사고력 향상"],
                        link: "https://www.erumenb.com",
                        difficulty: "중급"
                    },
                    {
                        name: "디딤돌 중학수학 개념기본 1-1",
                        publisher: "디딤돌",
                        price: "16,200원",
                        features: ["체계적 개념 학습", "기초 탄탄", "문제 다양"],
                        link: "https://www.ddstone.com",
                        difficulty: "기초~중급"
                    }
                ],
                workbooks: [
                    {
                        name: "개념+유형 라이트 중등 수학 1-1",
                        publisher: "비상교육",
                        price: "14,850원",
                        features: ["개념+문제", "유형 정리", "내신 필수"],
                        difficulty: "기초"
                    },
                    {
                        name: "쎈 중등 수학 1-1",
                        publisher: "좋은책신사고",
                        price: "15,000원",
                        features: ["유형별 문제", "난이도별", "문제 풍부"],
                        difficulty: "중급~고급"
                    },
                    {
                        name: "일품 중등 수학 1-1",
                        publisher: "좋은책신사고",
                        price: "16,000원",
                        features: ["최상위 문제", "심화 학습", "경시 대비"],
                        difficulty: "고급"
                    }
                ],
                ebsLectures: [
                    {
                        name: "EBS 중학 뉴런 수학1(상)",
                        teacher: "손석민",
                        link: "https://mid.ebs.co.kr",
                        features: ["2025 개정교육과정", "기본 개념", "내신 대비"],
                        free: true
                    },
                    {
                        name: "에이급 수학 중1-1",
                        teacher: "김철진",
                        link: "https://mid.ebs.co.kr",
                        features: ["심화 학습", "A급 문제", "상위권 대비"],
                        free: true
                    }
                ],
                youtube: [
                    {
                        channel: "수학의 정석 TV",
                        link: "https://www.youtube.com/@MathPrinciple",
                        description: "중학 수학 개념 강의",
                        subscribers: "100만+"
                    },
                    {
                        channel: "대치동캐슬",
                        link: "https://www.youtube.com/@Daechi_Castle",
                        description: "중등 수학 무료 강의",
                        subscribers: "50만+"
                    },
                    {
                        channel: "강윤구 수학",
                        link: "https://www.youtube.com/@etoosmathkang",
                        description: "개념 설명 전문",
                        subscribers: "30만+"
                    }
                ],
                units: [
                    {
                        unit: "1단원",
                        name: "소인수분해",
                        topics: ["소수와 합성수", "거듭제곱", "소인수분해", "최대공약수", "최소공배수"],
                        studyHours: 6
                    },
                    {
                        unit: "2단원",
                        name: "정수와 유리수",
                        topics: ["정수", "유리수", "유리수의 사칙연산"],
                        studyHours: 8
                    },
                    {
                        unit: "3단원",
                        name: "문자와 식",
                        topics: ["문자의 사용", "식의 값", "일차식과 수의 곱셈·나눗셈", "일차식의 덧셈·뺄셈"],
                        studyHours: 7
                    },
                    {
                        unit: "4단원",
                        name: "일차방정식",
                        topics: ["방정식과 그 해", "일차방정식의 풀이", "일차방정식의 활용"],
                        studyHours: 8
                    }
                ]
            },
            semester2: {
                conceptBooks: [
                    { name: "개념원리 중학수학 1-2", publisher: "개념원리", difficulty: "기초~중급" },
                    { name: "숨마쿰라우데 중학수학 개념기본서 1-2", publisher: "이룸이앤비", difficulty: "중급" },
                    { name: "디딤돌 중학수학 개념기본 1-2", publisher: "디딤돌", difficulty: "기초~중급" }
                ],
                units: [
                    {
                        unit: "1단원",
                        name: "기본 도형",
                        topics: ["점·선·면·각", "위치 관계", "평행선의 성질"],
                        studyHours: 6
                    },
                    {
                        unit: "2단원",
                        name: "평면도형",
                        topics: ["다각형", "원과 부채꼴"],
                        studyHours: 7
                    },
                    {
                        unit: "3단원",
                        name: "입체도형",
                        topics: ["다면체", "회전체", "겉넓이와 부피"],
                        studyHours: 8
                    },
                    {
                        unit: "4단원",
                        name: "통계",
                        topics: ["줄기와 잎 그림", "도수분포표", "히스토그램", "상대도수"],
                        studyHours: 6
                    }
                ]
            }
        },
        grade2: {
            semester1: {
                conceptBooks: [
                    { name: "개념원리 중학수학 2-1", publisher: "개념원리", difficulty: "기초~중급" },
                    { name: "숨마쿰라우데 중학수학 개념기본서 2-1", publisher: "이룸이앤비", difficulty: "중급" },
                    { name: "디딤돌 중학수학 개념기본 2-1", publisher: "디딤돌", difficulty: "기초~중급" }
                ],
                units: [
                    {
                        unit: "1단원",
                        name: "유리수와 순환소수",
                        topics: ["유리수와 순환소수", "순환소수의 분수 표현"],
                        studyHours: 5
                    },
                    {
                        unit: "2단원",
                        name: "식의 계산",
                        topics: ["지수법칙", "다항식의 계산", "단항식의 곱셈·나눗셈", "다항식의 곱셈"],
                        studyHours: 8
                    },
                    {
                        unit: "3단원",
                        name: "연립방정식",
                        topics: ["미지수가 2개인 일차방정식", "연립방정식의 풀이", "연립방정식의 활용"],
                        studyHours: 9
                    },
                    {
                        unit: "4단원",
                        name: "부등식",
                        topics: ["일차부등식의 풀이", "일차부등식의 활용"],
                        studyHours: 6
                    }
                ]
            },
            semester2: {
                conceptBooks: [
                    { name: "개념원리 중학수학 2-2", publisher: "개념원리", difficulty: "기초~중급" },
                    { name: "숨마쿰라우데 중학수학 개념기본서 2-2", publisher: "이룸이앤비", difficulty: "중급" }
                ],
                units: [
                    {
                        unit: "1단원",
                        name: "일차함수",
                        topics: ["일차함수의 의미", "일차함수의 그래프", "일차함수의 활용"],
                        studyHours: 10
                    },
                    {
                        unit: "2단원",
                        name: "삼각형의 성질",
                        topics: ["이등변삼각형", "직각삼각형의 합동", "삼각형의 외심과 내심"],
                        studyHours: 8
                    },
                    {
                        unit: "3단원",
                        name: "사각형의 성질",
                        topics: ["평행사변형", "여러 가지 사각형"],
                        studyHours: 7
                    },
                    {
                        unit: "4단원",
                        name: "확률",
                        topics: ["경우의 수", "확률의 계산", "확률의 성질"],
                        studyHours: 6
                    }
                ]
            }
        }
    },

    // 🔤 영어 (English)
    english: {
        grade1: {
            semester1: {
                conceptBooks: [
                    {
                        name: "Grammar Zone 기초편",
                        publisher: "NE능률",
                        price: "14,000원",
                        features: ["기초 문법", "상세한 설명", "실용 예문"],
                        link: "https://www.nebooks.co.kr",
                        difficulty: "기초"
                    },
                    {
                        name: "Grammar Zone 중등 필수",
                        publisher: "NE능률",
                        price: "15,000원",
                        features: ["중등 핵심 문법", "단계별 학습", "독해 연계"],
                        link: "https://www.nebooks.co.kr",
                        difficulty: "중급"
                    },
                    {
                        name: "Grammar Inside 1",
                        publisher: "능률교육",
                        price: "13,500원",
                        features: ["중1 문법 완성", "개념+문제", "내신 대비"],
                        difficulty: "기초~중급"
                    }
                ],
                workbooks: [
                    {
                        name: "중학 영단어 2000",
                        publisher: "천재교육",
                        features: ["필수 단어", "예문", "MP3"],
                        difficulty: "기초"
                    },
                    {
                        name: "리딩튜터 중등 1",
                        publisher: "능률",
                        features: ["독해 연습", "다양한 지문", "배경지식"],
                        difficulty: "중급"
                    }
                ],
                ebsLectures: [
                    {
                        name: "EBS 중학 영어 1학년",
                        teacher: "정수영",
                        link: "https://mid.ebs.co.kr",
                        features: ["기초 문법", "교과서 학습", "내신 대비"],
                        free: true
                    },
                    {
                        name: "문법 완성",
                        teacher: "송시원",
                        link: "https://mid.ebs.co.kr",
                        features: ["중1 필수 문법", "체계적 학습"],
                        free: true
                    }
                ],
                youtube: [
                    {
                        channel: "정승익의 교육연구소",
                        link: "https://www.youtube.com/@jungseungik",
                        description: "중등 영어 문법 강의",
                        subscribers: "20만+"
                    },
                    {
                        channel: "영어병원",
                        link: "https://www.youtube.com/@EnglishHospital",
                        description: "중등 영어 기초",
                        subscribers: "15만+"
                    }
                ],
                units: [
                    { unit: "1과", name: "be동사", topics: ["am/is/are", "be동사 의문문·부정문"], studyHours: 3 },
                    { unit: "2과", name: "일반동사", topics: ["일반동사 현재형", "의문문·부정문"], studyHours: 4 },
                    { unit: "3과", name: "시제", topics: ["현재진행형", "과거시제"], studyHours: 4 },
                    { unit: "4과", name: "조동사", topics: ["can, may, must", "will, should"], studyHours: 4 }
                ]
            }
        },
        grade2: {
            semester1: {
                conceptBooks: [
                    { name: "Grammar Zone 중등 필수", publisher: "NE능률", difficulty: "중급" },
                    { name: "Grammar Inside 2", publisher: "능률교육", difficulty: "중급" }
                ],
                units: [
                    { unit: "1과", name: "문장의 형식", topics: ["1~5형식", "목적어·보어"], studyHours: 5 },
                    { unit: "2과", name: "시제", topics: ["현재완료", "과거완료"], studyHours: 5 },
                    { unit: "3과", name: "to부정사", topics: ["명사적·형용사적·부사적 용법"], studyHours: 5 },
                    { unit: "4과", name: "동명사", topics: ["동명사 vs to부정사", "동명사 관용 표현"], studyHours: 4 }
                ]
            }
        }
    },

    // 📖 국어 (Korean)
    korean: {
        grade1: {
            semester1: {
                conceptBooks: [
                    { name: "비문학 독해 워크북 1", publisher: "키출판사", difficulty: "기초~중급" },
                    { name: "국어 문법 총정리", publisher: "천재교육", difficulty: "중급" }
                ],
                ebsLectures: [
                    {
                        name: "EBS 중학 국어 1학년",
                        teacher: "김경욱",
                        link: "https://mid.ebs.co.kr",
                        features: ["교과서 분석", "독해 전략", "문법 기초"],
                        free: true
                    }
                ],
                youtube: [
                    {
                        channel: "강용철의 국어 교실",
                        link: "https://www.youtube.com/@KangYongChul",
                        description: "중등 국어 전문",
                        subscribers: "25만+"
                    }
                ],
                units: [
                    { unit: "1단원", name: "문학의 이해", topics: ["시·소설·수필", "문학 감상"], studyHours: 6 },
                    { unit: "2단원", name: "독서와 쓰기", topics: ["설명문·논설문", "글쓰기 전략"], studyHours: 6 },
                    { unit: "3단원", name: "문법", topics: ["음운·단어·문장", "품사"], studyHours: 5 }
                ]
            }
        },
        grade2: {
            semester1: {
                units: [
                    { unit: "1단원", name: "문학", topics: ["시·소설 심화", "작품 감상"], studyHours: 7 },
                    { unit: "2단원", name: "독서", topics: ["비문학 독해", "논리적 사고"], studyHours: 6 },
                    { unit: "3단원", name: "문법", topics: ["문장 성분", "문법 심화"], studyHours: 5 }
                ]
            }
        }
    },

    // 🔬 과학 (Science)
    science: {
        grade1: {
            semester1: {
                conceptBooks: [
                    { name: "오투 중등 과학 1-1", publisher: "비상교육", difficulty: "기초~중급" },
                    { name: "완자 중등 과학 1-1", publisher: "비상교육", difficulty: "기초~중급" }
                ],
                ebsLectures: [
                    {
                        name: "EBS 중학 과학 1학년",
                        teacher: "최사랑",
                        link: "https://mid.ebs.co.kr",
                        features: ["기본 개념", "실험 설명", "내신 대비"],
                        free: true
                    }
                ],
                youtube: [
                    {
                        channel: "은혜로운 과학생활",
                        link: "https://www.youtube.com/@EunHyeScience",
                        description: "중등 과학 전문",
                        subscribers: "30만+"
                    }
                ],
                units: [
                    { unit: "1단원", name: "지권의 변화", topics: ["지각·맨틀·핵", "판구조론", "화산·지진"], studyHours: 8 },
                    { unit: "2단원", name: "여러 가지 힘", topics: ["중력·탄성력·마찰력"], studyHours: 6 },
                    { unit: "3단원", name: "생물의 다양성", topics: ["생물 분류", "생물 다양성"], studyHours: 7 }
                ]
            }
        },
        grade2: {
            semester1: {
                units: [
                    { unit: "1단원", name: "물질의 구성", topics: ["원자·분자·이온"], studyHours: 8 },
                    { unit: "2단원", name: "전기와 자기", topics: ["전류·전압·저항", "자기장"], studyHours: 8 },
                    { unit: "3단원", name: "식물과 에너지", topics: ["광합성·호흡"], studyHours: 6 }
                ]
            }
        }
    },

    // 🌍 사회 (Social Studies)
    social: {
        grade1: {
            semester1: {
                conceptBooks: [
                    { name: "오투 중등 사회 1-1", publisher: "비상교육", difficulty: "기초~중급" }
                ],
                ebsLectures: [
                    {
                        name: "EBS 중학 역사①",
                        teacher: "강현태",
                        link: "https://mid.ebs.co.kr",
                        features: ["한국사 기초", "내신 대비"],
                        free: true
                    }
                ],
                youtube: [
                    {
                        channel: "빡공시대",
                        link: "https://www.youtube.com/@PpakGong",
                        description: "역사 전문 채널",
                        subscribers: "40만+"
                    }
                ],
                units: [
                    { unit: "1단원", name: "선사·고대", topics: ["구석기·신석기", "삼국시대"], studyHours: 7 },
                    { unit: "2단원", name: "고려·조선", topics: ["고려시대", "조선시대"], studyHours: 8 }
                ]
            }
        },
        grade2: {
            semester1: {
                units: [
                    { unit: "1단원", name: "근대 사회", topics: ["개항·개화", "일제강점기"], studyHours: 8 },
                    { unit: "2단원", name: "현대 사회", topics: ["대한민국 수립", "민주화"], studyHours: 7 }
                ]
            }
        }
    }
};

// 학습 자료 검색 함수
function getStudyMaterials(subject, grade, semester, type = 'all') {
    try {
        const materials = STUDY_MATERIALS_DB[subject]?.[`grade${grade}`]?.[`semester${semester}`];
        
        if (!materials) {
            return null;
        }
        
        if (type === 'all') {
            return materials;
        }
        
        return materials[type] || [];
    } catch (error) {
        console.error('학습 자료 검색 오류:', error);
        return null;
    }
}

// 특정 단원 학습 자료 검색
function getUnitMaterials(subject, grade, semester, unitNumber) {
    try {
        const materials = getStudyMaterials(subject, grade, semester);
        if (!materials || !materials.units) {
            return null;
        }
        
        return materials.units.find(u => u.unit === `${unitNumber}단원`) || 
               materials.units.find(u => u.unit === `${unitNumber}과`);
    } catch (error) {
        console.error('단원 자료 검색 오류:', error);
        return null;
    }
}

// 일일 학습 계획 생성
function generateDailyStudyPlan(subject, grade, targetDate = new Date()) {
    const dayOfWeek = targetDate.getDay(); // 0: 일요일, 1-5: 월-금, 6: 토요일
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    
    // 과목별 학습 시간 배분 (분)
    const studyTimeMap = {
        math: isWeekday ? 45 : 60,
        english: isWeekday ? 45 : 60,
        korean: isWeekday ? 45 : 60,
        science: isWeekday ? 45 : 60,
        social: isWeekday ? 45 : 60
    };
    
    const materials = getStudyMaterials(subject, grade, 1); // 1학기 기준
    
    if (!materials) {
        return null;
    }
    
    return {
        subject: subject,
        grade: grade,
        date: targetDate.toISOString().split('T')[0],
        studyTime: studyTimeMap[subject],
        materials: {
            textbook: materials.textbooks?.[0]?.name || "중학교 교과서",
            conceptBook: materials.conceptBooks?.[0]?.name || null,
            ebsLecture: materials.ebsLectures?.[0]?.name || null,
            youtube: materials.youtube?.[0]?.channel || null
        },
        plan: {
            concept: `${materials.conceptBooks?.[0]?.name || '교과서'} 개념 학습`,
            practice: `${materials.workbooks?.[0]?.name || '문제집'} 문제 풀이`,
            review: "오답 정리 및 복습"
        }
    };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STUDY_MATERIALS_DB,
        getStudyMaterials,
        getUnitMaterials,
        generateDailyStudyPlan
    };
}
