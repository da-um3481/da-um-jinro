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
    
    // 중학교 2학년
    grade2: {
        math: {
            name: '중2 수학',
            units: [
                {
                    id: 'math2_1',
                    name: '유리수와 순환소수',
                    chapters: [
                        { id: 1, name: '유리수와 순환소수', concepts: ['유한소수', '무한소수', '순환소수', '순환마디'] },
                        { id: 2, name: '순환소수의 분수 표현', concepts: ['순환소수를 분수로', '분수를 순환소수로'] }
                    ]
                },
                {
                    id: 'math2_2',
                    name: '식의 계산',
                    chapters: [
                        { id: 1, name: '지수법칙', concepts: ['거듭제곱의 곱셈', '거듭제곱의 나눗셈', '거듭제곱의 거듭제곱'] },
                        { id: 2, name: '단항식의 계산', concepts: ['단항식의 곱셈', '단항식의 나눗셈'] },
                        { id: 3, name: '다항식의 계산', concepts: ['다항식의 덧셈과 뺄셈', '다항식의 곱셈', '등식의 변형'] }
                    ]
                },
                {
                    id: 'math2_3',
                    name: '일차부등식',
                    chapters: [
                        { id: 1, name: '부등식과 그 해', concepts: ['부등식', '부등식의 해', '부등식의 성질'] },
                        { id: 2, name: '일차부등식', concepts: ['일차부등식의 풀이', '일차부등식의 활용'] }
                    ]
                },
                {
                    id: 'math2_4',
                    name: '연립일차방정식',
                    chapters: [
                        { id: 1, name: '연립방정식', concepts: ['미지수가 2개인 일차방정식', '연립일차방정식', '연립방정식의 해'] },
                        { id: 2, name: '연립방정식의 풀이', concepts: ['가감법', '대입법', '해가 특수한 경우'] },
                        { id: 3, name: '연립방정식의 활용', concepts: ['속력 문제', '농도 문제', '개수와 금액'] }
                    ]
                },
                {
                    id: 'math2_5',
                    name: '일차함수',
                    chapters: [
                        { id: 1, name: '일차함수', concepts: ['함수', '함숫값', '일차함수'] },
                        { id: 2, name: '일차함수의 그래프', concepts: ['일차함수의 그래프', '기울기', 'y절편', '그래프의 평행과 일치'] },
                        { id: 3, name: '일차함수의 활용', concepts: ['일차함수식 구하기', '일차함수의 활용'] }
                    ]
                },
                {
                    id: 'math2_6',
                    name: '삼각형의 성질',
                    chapters: [
                        { id: 1, name: '이등변삼각형', concepts: ['이등변삼각형의 성질', '이등변삼각형이 되는 조건'] },
                        { id: 2, name: '삼각형의 외심과 내심', concepts: ['외심', '내심', '외접원', '내접원'] }
                    ]
                },
                {
                    id: 'math2_7',
                    name: '사각형의 성질',
                    chapters: [
                        { id: 1, name: '평행사변형', concepts: ['평행사변형의 성질', '평행사변형이 되는 조건'] },
                        { id: 2, name: '여러 가지 사각형', concepts: ['직사각형', '마름모', '정사각형', '등변사다리꼴'] }
                    ]
                },
                {
                    id: 'math2_8',
                    name: '확률',
                    chapters: [
                        { id: 1, name: '경우의 수', concepts: ['경우의 수', '합의 법칙', '곱의 법칙'] },
                        { id: 2, name: '확률', concepts: ['확률의 뜻', '확률의 계산', '확률의 성질'] }
                    ]
                }
            ]
        },
        
        korean: {
            name: '중2 국어',
            units: [
                {
                    id: 'kor2_1',
                    name: '문학의 표현',
                    chapters: [
                        { id: 1, name: '문학과 표현', concepts: ['표현의 효과', '비유', '상징'] },
                        { id: 2, name: '시의 화자와 어조', concepts: ['화자', '어조', '정서'] }
                    ]
                },
                {
                    id: 'kor2_2',
                    name: '설득과 주장',
                    chapters: [
                        { id: 1, name: '논설문의 구조', concepts: ['서론', '본론', '결론', '논리적 구성'] },
                        { id: 2, name: '설득하는 글 쓰기', concepts: ['주장', '논거', '반론'] }
                    ]
                },
                {
                    id: 'kor2_3',
                    name: '문법 - 단어와 문장',
                    chapters: [
                        { id: 1, name: '단어의 형성', concepts: ['단일어', '복합어', '파생어', '합성어'] },
                        { id: 2, name: '문장의 짜임', concepts: ['홑문장', '겹문장', '이어진문장', '안은문장'] }
                    ]
                },
                {
                    id: 'kor2_4',
                    name: '매체와 의사소통',
                    chapters: [
                        { id: 1, name: '매체 자료의 활용', concepts: ['인터넷', 'SNS', '뉴스', '광고'] }
                    ]
                }
            ]
        },
        
        english: {
            name: '중2 영어',
            units: [
                {
                    id: 'eng2_1',
                    name: 'Grammar',
                    chapters: [
                        { id: 1, name: '시제', concepts: ['과거', '현재완료', '미래'] },
                        { id: 2, name: '조동사', concepts: ['can', 'may', 'must', 'should', 'will'] },
                        { id: 3, name: '부정사와 동명사', concepts: ['to부정사', '동명사', '용법'] }
                    ]
                },
                {
                    id: 'eng2_2',
                    name: 'Reading & Writing',
                    chapters: [
                        { id: 1, name: 'Reading Skills', concepts: ['주제 찾기', '세부 정보', '추론'] },
                        { id: 2, name: 'Writing Practice', concepts: ['편지쓰기', '일기', '설명문'] }
                    ]
                },
                {
                    id: 'eng2_3',
                    name: 'Communication',
                    chapters: [
                        { id: 1, name: 'Speaking & Listening', concepts: ['일상 대화', '의견 표현', '듣기 전략'] }
                    ]
                }
            ]
        },
        
        science: {
            name: '중2 과학',
            units: [
                {
                    id: 'sci2_1',
                    name: '물질의 구성',
                    chapters: [
                        { id: 1, name: '물질의 구성 입자', concepts: ['원자', '분자', '이온'] },
                        { id: 2, name: '원소', concepts: ['원소 기호', '주기율표', '원자 구조'] },
                        { id: 3, name: '화학식과 화학 반응식', concepts: ['화학식', '화학 반응식', '계수 맞추기'] }
                    ]
                },
                {
                    id: 'sci2_2',
                    name: '전기와 자기',
                    chapters: [
                        { id: 1, name: '전류', concepts: ['전류', '전압', '저항', '옴의 법칙'] },
                        { id: 2, name: '자기', concepts: ['자기장', '전자석', '전동기'] }
                    ]
                },
                {
                    id: 'sci2_3',
                    name: '식물과 에너지',
                    chapters: [
                        { id: 1, name: '식물의 구조와 기능', concepts: ['뿌리', '줄기', '잎', '광합성'] },
                        { id: 2, name: '식물의 호흡과 증산', concepts: ['호흡', '증산 작용'] }
                    ]
                },
                {
                    id: 'sci2_4',
                    name: '동물과 에너지',
                    chapters: [
                        { id: 1, name: '소화와 순환', concepts: ['소화계', '순환계', '영양소'] },
                        { id: 2, name: '호흡과 배설', concepts: ['호흡계', '배설계'] }
                    ]
                },
                {
                    id: 'sci2_5',
                    name: '물질의 특성',
                    chapters: [
                        { id: 1, name: '물질의 특성', concepts: ['밀도', '용해도', '끓는점', '녹는점'] }
                    ]
                },
                {
                    id: 'sci2_6',
                    name: '수권과 해수의 순환',
                    chapters: [
                        { id: 1, name: '수권', concepts: ['지구의 물', '해수', '담수'] },
                        { id: 2, name: '해류', concepts: ['해류의 발생', '해류의 영향'] }
                    ]
                },
                {
                    id: 'sci2_7',
                    name: '기권과 날씨',
                    chapters: [
                        { id: 1, name: '기권', concepts: ['대기의 구조', '기압', '바람'] },
                        { id: 2, name: '날씨', concepts: ['구름', '강수', '일기도'] }
                    ]
                }
            ]
        },
        
        social: {
            name: '중2 사회',
            units: [
                {
                    id: 'soc2_1',
                    name: '세계 여러 지역의 자연과 문화',
                    chapters: [
                        { id: 1, name: '세계 지리 개관', concepts: ['대륙', '국가', '지역 구분'] },
                        { id: 2, name: '아시아', concepts: ['동아시아', '남아시아', '서아시아'] },
                        { id: 3, name: '유럽과 아프리카', concepts: ['유럽', '아프리카', '지역 특성'] },
                        { id: 4, name: '아메리카와 오세아니아', concepts: ['북아메리카', '남아메리카', '오세아니아'] }
                    ]
                },
                {
                    id: 'soc2_2',
                    name: '인권과 헌법',
                    chapters: [
                        { id: 1, name: '인권 보장', concepts: ['인권', '인권 보장', '인권 보호'] },
                        { id: 2, name: '근로자의 권리', concepts: ['근로권', '노동조합', '근로 기준'] }
                    ]
                },
                {
                    id: 'soc2_3',
                    name: '경제 생활과 선택',
                    chapters: [
                        { id: 1, name: '가계와 기업', concepts: ['가계', '기업', '경제 순환'] },
                        { id: 2, name: '시장과 가격', concepts: ['시장', '수요', '공급', '균형 가격'] }
                    ]
                }
            ]
        }
    },
    
    // 중학교 3학년
    grade3: {
        math: {
            name: '중3 수학',
            units: [
                {
                    id: 'math3_1',
                    name: '제곱근과 실수',
                    chapters: [
                        { id: 1, name: '제곱근', concepts: ['제곱근', '제곱근의 성질', '무리수'] },
                        { id: 2, name: '무리수와 실수', concepts: ['무리수', '실수', '실수의 대소 관계'] },
                        { id: 3, name: '근호를 포함한 식의 계산', concepts: ['근호의 곱셈과 나눗셈', '분모의 유리화', '근호의 덧셈과 뺄셈'] }
                    ]
                },
                {
                    id: 'math3_2',
                    name: '인수분해',
                    chapters: [
                        { id: 1, name: '다항식의 곱셈', concepts: ['곱셈 공식', '곱셈 공식의 변형'] },
                        { id: 2, name: '인수분해', concepts: ['인수분해', '인수분해 공식', '완전제곱식'] }
                    ]
                },
                {
                    id: 'math3_3',
                    name: '이차방정식',
                    chapters: [
                        { id: 1, name: '이차방정식', concepts: ['이차방정식', '이차방정식의 풀이'] },
                        { id: 2, name: '이차방정식의 근의 공식', concepts: ['완전제곱식', '근의 공식', '근과 계수의 관계'] },
                        { id: 3, name: '이차방정식의 활용', concepts: ['활용 문제', '속력', '넓이'] }
                    ]
                },
                {
                    id: 'math3_4',
                    name: '이차함수',
                    chapters: [
                        { id: 1, name: '이차함수', concepts: ['이차함수', '이차함수의 그래프'] },
                        { id: 2, name: '이차함수의 활용', concepts: ['최댓값과 최솟값', '이차함수의 활용'] }
                    ]
                },
                {
                    id: 'math3_5',
                    name: '삼각비',
                    chapters: [
                        { id: 1, name: '삼각비', concepts: ['삼각비', '사인', '코사인', '탄젠트'] },
                        { id: 2, name: '삼각비의 활용', concepts: ['삼각비의 값', '삼각비의 활용'] }
                    ]
                },
                {
                    id: 'math3_6',
                    name: '원의 성질',
                    chapters: [
                        { id: 1, name: '원과 직선', concepts: ['현', '접선', '접선의 성질'] },
                        { id: 2, name: '원주각', concepts: ['원주각', '중심각', '원주각의 성질'] }
                    ]
                },
                {
                    id: 'math3_7',
                    name: '통계',
                    chapters: [
                        { id: 1, name: '산포도', concepts: ['산포도', '분산', '표준편차'] },
                        { id: 2, name: '상관관계', concepts: ['산점도', '상관관계', '상관표'] }
                    ]
                }
            ]
        },
        
        korean: {
            name: '중3 국어',
            units: [
                {
                    id: 'kor3_1',
                    name: '문학과 삶',
                    chapters: [
                        { id: 1, name: '문학의 가치', concepts: ['문학의 기능', '문학과 현실', '카타르시스'] },
                        { id: 2, name: '소설의 구성', concepts: ['구성', '인물', '배경', '주제'] }
                    ]
                },
                {
                    id: 'kor3_2',
                    name: '비판적 읽기와 쓰기',
                    chapters: [
                        { id: 1, name: '비판적 읽기', concepts: ['논리적 오류', '비판적 사고', '객관성'] },
                        { id: 2, name: '논증적 글쓰기', concepts: ['논증', '귀납', '연역', '논리적 글쓰기'] }
                    ]
                },
                {
                    id: 'kor3_3',
                    name: '문법 - 국어의 규범',
                    chapters: [
                        { id: 1, name: '한글 맞춤법', concepts: ['표준어', '맞춤법', '띄어쓰기'] },
                        { id: 2, name: '표준 발음법', concepts: ['표준 발음', '음운 변동'] }
                    ]
                },
                {
                    id: 'kor3_4',
                    name: '효과적인 의사소통',
                    chapters: [
                        { id: 1, name: '발표와 토론', concepts: ['발표', '토론', '질의응답'] }
                    ]
                }
            ]
        },
        
        english: {
            name: '중3 영어',
            units: [
                {
                    id: 'eng3_1',
                    name: 'Grammar',
                    chapters: [
                        { id: 1, name: '수동태', concepts: ['수동태', '능동태와 수동태', '시제별 수동태'] },
                        { id: 2, name: '관계대명사', concepts: ['주격', '목적격', '소유격', '관계대명사 what'] },
                        { id: 3, name: '가정법', concepts: ['가정법 과거', '가정법 과거완료', 'I wish'] }
                    ]
                },
                {
                    id: 'eng3_2',
                    name: 'Reading & Writing',
                    chapters: [
                        { id: 1, name: 'Advanced Reading', concepts: ['긴 지문', '추론', '요약'] },
                        { id: 2, name: 'Essay Writing', concepts: ['에세이', '논리적 구성', '의견 제시'] }
                    ]
                },
                {
                    id: 'eng3_3',
                    name: 'Communication',
                    chapters: [
                        { id: 1, name: 'Discussion & Debate', concepts: ['토론', '주장', '반박'] }
                    ]
                }
            ]
        },
        
        science: {
            name: '중3 과학',
            units: [
                {
                    id: 'sci3_1',
                    name: '화학 반응의 규칙',
                    chapters: [
                        { id: 1, name: '물질 변화', concepts: ['물리 변화', '화학 변화', '화학 반응'] },
                        { id: 2, name: '화학 반응의 규칙', concepts: ['질량 보존 법칙', '일정 성분비 법칙'] }
                    ]
                },
                {
                    id: 'sci3_2',
                    name: '기권과 우리 생활',
                    chapters: [
                        { id: 1, name: '날씨의 변화', concepts: ['기압', '전선', '고기압', '저기압'] },
                        { id: 2, name: '기후 변화', concepts: ['온실 효과', '지구 온난화'] }
                    ]
                },
                {
                    id: 'sci3_3',
                    name: '운동과 에너지',
                    chapters: [
                        { id: 1, name: '운동', concepts: ['속력', '속도', '가속도'] },
                        { id: 2, name: '일과 에너지', concepts: ['일', '운동 에너지', '위치 에너지', '역학적 에너지 보존'] }
                    ]
                },
                {
                    id: 'sci3_4',
                    name: '생식과 유전',
                    chapters: [
                        { id: 1, name: '생식', concepts: ['무성 생식', '유성 생식', '세포 분열'] },
                        { id: 2, name: '유전', concepts: ['유전자', 'DNA', '멘델의 유전 법칙'] }
                    ]
                },
                {
                    id: 'sci3_5',
                    name: '태양계',
                    chapters: [
                        { id: 1, name: '태양계 구성원', concepts: ['행성', '위성', '소행성', '혜성'] },
                        { id: 2, name: '지구와 달', concepts: ['달의 운동', '일식', '월식', '조석'] }
                    ]
                },
                {
                    id: 'sci3_6',
                    name: '과학 기술과 인류 문명',
                    chapters: [
                        { id: 1, name: '과학 기술의 발달', concepts: ['과학 혁명', '산업 혁명', '정보화 사회'] }
                    ]
                }
            ]
        },
        
        social: {
            name: '중3 사회',
            units: [
                {
                    id: 'soc3_1',
                    name: '인권과 시민 참여',
                    chapters: [
                        { id: 1, name: '인권 보장과 헌법', concepts: ['기본권', '헌법', '헌법 재판소'] },
                        { id: 2, name: '정치 과정과 시민 참여', concepts: ['선거', '정당', '시민 단체'] }
                    ]
                },
                {
                    id: 'soc3_2',
                    name: '경제 생활과 경제 문제',
                    chapters: [
                        { id: 1, name: '국민 경제', concepts: ['국내 총생산', '경제 성장', '물가'] },
                        { id: 2, name: '국제 거래와 환율', concepts: ['수출', '수입', '환율', '무역'] }
                    ]
                },
                {
                    id: 'soc3_3',
                    name: '지속 가능한 미래',
                    chapters: [
                        { id: 1, name: '환경 문제', concepts: ['기후 변화', '환경 보전', '지속 가능한 발전'] },
                        { id: 2, name: '미래 사회', concepts: ['과학 기술', '윤리', '세계화'] }
                    ]
                }
            ]
        }
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
