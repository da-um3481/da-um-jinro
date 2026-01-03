// ==========================================
// EBS 강의 데이터베이스
// 학년별 > 과목별 > 단원별 > 수준별 강의 정보
// ==========================================

const ebsLectureDB = {
    // ==========================================
    // 중학교 1학년
    // ==========================================
    중1: {
        수학: {
            "소인수분해": {
                기초: {
                    title: "개념원리 중학수학 1-1 (소인수분해)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE1M1A0101",
                    thumbnail: "https://via.placeholder.com/320x180?text=소인수분해+기초",
                    duration: "25분",
                    description: "소수와 합성수, 소인수분해의 기본 개념 학습"
                },
                표준: {
                    title: "숨마쿰라우데 중학수학 1-상 (소인수분해)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE1M1A0102",
                    thumbnail: "https://via.placeholder.com/320x180?text=소인수분해+표준",
                    duration: "30분",
                    description: "최대공약수와 최소공배수 구하기, 응용문제"
                },
                심화: {
                    title: "최고수준 중1 수학 (소인수분해 심화)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE1M1A0103",
                    thumbnail: "https://via.placeholder.com/320x180?text=소인수분해+심화",
                    duration: "35분",
                    description: "복잡한 응용문제, 실생활 활용"
                }
            },
            "정수와 유리수": {
                기초: {
                    title: "개념원리 중학수학 1-1 (정수와 유리수)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE1M1A0201",
                    thumbnail: "https://via.placeholder.com/320x180?text=정수+기초",
                    duration: "28분",
                    description: "정수의 덧셈과 뺄셈, 음수의 개념"
                },
                표준: {
                    title: "숨마쿰라우데 중학수학 1-상 (정수와 유리수)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE1M1A0202",
                    thumbnail: "https://via.placeholder.com/320x180?text=정수+표준",
                    duration: "32분",
                    description: "정수의 사칙연산, 혼합계산"
                },
                심화: {
                    title: "최고수준 중1 수학 (정수와 유리수)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE1M1A0203",
                    thumbnail: "https://via.placeholder.com/320x180?text=정수+심화",
                    duration: "38분",
                    description: "복잡한 계산 문제, 규칙 찾기"
                }
            },
            "일차방정식": {
                기초: {
                    title: "개념원리 중학수학 1-1 (일차방정식)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE1M1A0301",
                    thumbnail: "https://via.placeholder.com/320x180?text=일차방정식+기초",
                    duration: "30분",
                    description: "방정식의 뜻, 등식의 성질"
                },
                표준: {
                    title: "숨마쿰라우데 중학수학 1-상 (일차방정식)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE1M1A0302",
                    thumbnail: "https://via.placeholder.com/320x180?text=일차방정식+표준",
                    duration: "35분",
                    description: "일차방정식 풀이, 괄호가 있는 방정식"
                },
                심화: {
                    title: "최고수준 중1 수학 (일차방정식 활용)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE1M1A0303",
                    thumbnail: "https://via.placeholder.com/320x180?text=일차방정식+심화",
                    duration: "40분",
                    description: "문장제 문제, 실생활 활용"
                }
            }
        },
        
        영어: {
            "be동사와 일반동사": {
                기초: {
                    title: "Grammar Zone 입문편 (be동사)",
                    teacher: "최현수",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1E1A0101",
                    thumbnail: "https://via.placeholder.com/320x180?text=be동사+기초",
                    duration: "25분",
                    description: "be동사의 현재형, 부정문과 의문문"
                },
                표준: {
                    title: "Grammar Zone 기본편 (be동사와 일반동사)",
                    teacher: "최현수",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1E1A0102",
                    thumbnail: "https://via.placeholder.com/320x180?text=be동사+표준",
                    duration: "30분",
                    description: "일반동사의 현재형, 3인칭 단수"
                },
                심화: {
                    title: "Grammar Zone 완성편 (동사 종합)",
                    teacher: "최현수",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1E1A0103",
                    thumbnail: "https://via.placeholder.com/320x180?text=동사+심화",
                    duration: "35분",
                    description: "be동사와 일반동사 구분, 복잡한 문장"
                }
            },
            "시제": {
                기초: {
                    title: "Grammar Zone 입문편 (과거시제)",
                    teacher: "최현수",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1E1A0201",
                    thumbnail: "https://via.placeholder.com/320x180?text=과거시제+기초",
                    duration: "25분",
                    description: "과거시제의 개념, 규칙동사"
                },
                표준: {
                    title: "Grammar Zone 기본편 (과거/현재진행형)",
                    teacher: "최현수",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1E1A0202",
                    thumbnail: "https://via.placeholder.com/320x180?text=시제+표준",
                    duration: "30분",
                    description: "불규칙동사, 현재진행형"
                },
                심화: {
                    title: "Grammar Zone 완성편 (시제 종합)",
                    teacher: "최현수",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1E1A0203",
                    thumbnail: "https://via.placeholder.com/320x180?text=시제+심화",
                    duration: "35분",
                    description: "현재완료, 시제 혼합 문제"
                }
            }
        },
        
        국어: {
            "문학": {
                기초: {
                    title: "완자 중등 국어1 (문학의 이해)",
                    teacher: "박지영",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1K1A0101",
                    thumbnail: "https://via.placeholder.com/320x180?text=문학+기초",
                    duration: "30분",
                    description: "시의 3요소, 비유법"
                },
                표준: {
                    title: "숨마쿰라우데 국어 (문학 감상)",
                    teacher: "박지영",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1K1A0102",
                    thumbnail: "https://via.placeholder.com/320x180?text=문학+표준",
                    duration: "35분",
                    description: "소설의 3요소, 갈등과 주제"
                },
                심화: {
                    title: "최고수준 국어 (문학 종합)",
                    teacher: "박지영",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1K1A0103",
                    thumbnail: "https://via.placeholder.com/320x180?text=문학+심화",
                    duration: "40분",
                    description: "작품 분석, 비평적 감상"
                }
            },
            "문법": {
                기초: {
                    title: "완자 중등 국어1 (품사와 문장 성분)",
                    teacher: "박지영",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1K1A0201",
                    thumbnail: "https://via.placeholder.com/320x180?text=문법+기초",
                    duration: "25분",
                    description: "품사의 종류, 기본 문장 성분"
                },
                표준: {
                    title: "숨마쿰라우데 국어 (문법 완성)",
                    teacher: "박지영",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1K1A0202",
                    thumbnail: "https://via.placeholder.com/320x180?text=문법+표준",
                    duration: "30분",
                    description: "문장 성분, 올바른 문장 쓰기"
                },
                심화: {
                    title: "최고수준 국어 (문법 심화)",
                    teacher: "박지영",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1K1A0203",
                    thumbnail: "https://via.placeholder.com/320x180?text=문법+심화",
                    duration: "35분",
                    description: "복잡한 문장 구조, 문법 응용"
                }
            }
        },
        
        사회: {
            "세계지리": {
                기초: {
                    title: "완자 중등 사회1 (세계의 기후)",
                    teacher: "김민수",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1S1A0101",
                    thumbnail: "https://via.placeholder.com/320x180?text=세계지리+기초",
                    duration: "28분",
                    description: "위도와 경도, 기후 구분"
                },
                표준: {
                    title: "숨마쿰라우데 사회 (세계지리 완성)",
                    teacher: "김민수",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1S1A0102",
                    thumbnail: "https://via.placeholder.com/320x180?text=세계지리+표준",
                    duration: "32분",
                    description: "기후와 생활, 지역별 특징"
                },
                심화: {
                    title: "최고수준 사회 (세계지리 심화)",
                    teacher: "김민수",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1S1A0103",
                    thumbnail: "https://via.placeholder.com/320x180?text=세계지리+심화",
                    duration: "38분",
                    description: "지역 간 비교, 종합 분석"
                }
            }
        },
        
        과학: {
            "지구과학": {
                기초: {
                    title: "완자 중등 과학1 (지구계와 지권)",
                    teacher: "이동훈",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1SC1A0101",
                    thumbnail: "https://via.placeholder.com/320x180?text=지구과학+기초",
                    duration: "30분",
                    description: "지구계의 구성, 암석의 순환"
                },
                표준: {
                    title: "숨마쿰라우데 과학 (지구과학)",
                    teacher: "이동훈",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1SC1A0102",
                    thumbnail: "https://via.placeholder.com/320x180?text=지구과학+표준",
                    duration: "35분",
                    description: "풍화와 침식, 퇴적 작용"
                },
                심화: {
                    title: "최고수준 과학 (지구과학 심화)",
                    teacher: "이동훈",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1SC1A0103",
                    thumbnail: "https://via.placeholder.com/320x180?text=지구과학+심화",
                    duration: "40분",
                    description: "복잡한 지질 현상, 종합 문제"
                }
            },
            "생명과학": {
                기초: {
                    title: "완자 중등 과학1 (생물의 다양성)",
                    teacher: "이동훈",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1SC1A0201",
                    thumbnail: "https://via.placeholder.com/320x180?text=생명과학+기초",
                    duration: "28분",
                    description: "세포의 구조, 생물의 분류"
                },
                표준: {
                    title: "숨마쿰라우데 과학 (생명과학)",
                    teacher: "이동훈",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1SC1A0202",
                    thumbnail: "https://via.placeholder.com/320x180?text=생명과학+표준",
                    duration: "32분",
                    description: "광합성, 호흡, 생태계"
                },
                심화: {
                    title: "최고수준 과학 (생명과학 심화)",
                    teacher: "이동훈",
                    url: "https://mid.ebs.co.kr/course/view?courseId=BE1SC1A0203",
                    thumbnail: "https://via.placeholder.com/320x180?text=생명과학+심화",
                    duration: "38분",
                    description: "복잡한 생명 현상, 실험 분석"
                }
            }
        }
    },
    
    // ==========================================
    // 중학교 2학년, 3학년도 동일한 구조로 확장 가능
    // ==========================================
    중2: {
        수학: {
            "유리수와 순환소수": {
                기초: {
                    title: "개념원리 중학수학 2-1 (유리수)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE2M1A0101",
                    thumbnail: "https://via.placeholder.com/320x180?text=유리수+기초",
                    duration: "25분",
                    description: "유리수와 순환소수의 개념"
                }
            },
            "일차함수": {
                기초: {
                    title: "개념원리 중학수학 2-1 (일차함수)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE2M1A0201",
                    thumbnail: "https://via.placeholder.com/320x180?text=일차함수+기초",
                    duration: "30분",
                    description: "일차함수의 그래프와 기울기"
                }
            }
        }
    },
    
    중3: {
        수학: {
            "제곱근": {
                기초: {
                    title: "개념원리 중학수학 3-1 (제곱근)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE3M1A0101",
                    thumbnail: "https://via.placeholder.com/320x180?text=제곱근+기초",
                    duration: "28분",
                    description: "제곱근의 뜻과 성질"
                }
            },
            "이차함수": {
                기초: {
                    title: "개념원리 중학수학 3-2 (이차함수)",
                    teacher: "김성은",
                    url: "https://www.ebsmath.co.kr/emat/course/courseView?courseId=BE3M1A0201",
                    thumbnail: "https://via.placeholder.com/320x180?text=이차함수+기초",
                    duration: "35분",
                    description: "이차함수의 그래프와 꼭짓점"
                }
            }
        }
    }
};

// ==========================================
// 단원명 매핑 (자동 강의 추천용)
// ==========================================
const unitToLectureMapping = {
    "소인수분해": "소인수분해",
    "정수와 유리수": "정수와 유리수",
    "일차방정식": "일차방정식",
    "be동사와 일반동사": "be동사와 일반동사",
    "시제": "시제",
    "문학": "문학",
    "문법": "문법",
    "세계지리": "세계지리",
    "지구과학": "지구과학",
    "생명과학": "생명과학"
};
