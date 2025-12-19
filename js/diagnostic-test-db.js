// ==========================================
// 학년별 과목별 진단평가 문제 데이터베이스
// ==========================================

const diagnosticTestDB = {
    // 중학교 1학년
    1: {
        수학: [
            // 기초 (난이도: 1, 각 5점)
            {
                id: 1,
                question: "다음 중 소수가 아닌 것은?",
                options: ["2", "3", "4", "5"],
                answer: 2,
                difficulty: 1,
                points: 5,
                concept: "소수의 정의"
            },
            {
                id: 2,
                question: "12의 약수가 아닌 것은?",
                options: ["1", "2", "5", "6"],
                answer: 2,
                difficulty: 1,
                points: 5,
                concept: "약수 구하기"
            },
            {
                id: 3,
                question: "(-3) + 5의 값은?",
                options: ["-8", "-2", "2", "8"],
                answer: 2,
                difficulty: 1,
                points: 5,
                concept: "정수의 덧셈"
            },
            {
                id: 4,
                question: "(-2) × 3의 값은?",
                options: ["-6", "-1", "1", "6"],
                answer: 0,
                difficulty: 1,
                points: 5,
                concept: "정수의 곱셈"
            },
            {
                id: 5,
                question: "1/2 + 1/4의 값은?",
                options: ["1/8", "2/6", "3/4", "2/4"],
                answer: 2,
                difficulty: 1,
                points: 5,
                concept: "분수의 덧셈"
            },
            
            // 중급 (난이도: 2, 각 7점)
            {
                id: 6,
                question: "60을 소인수분해하면?",
                options: ["2² × 3 × 5", "2 × 3² × 5", "2² × 15", "4 × 15"],
                answer: 0,
                difficulty: 2,
                points: 7,
                concept: "소인수분해"
            },
            {
                id: 7,
                question: "12와 18의 최대공약수는?",
                options: ["2", "3", "6", "36"],
                answer: 2,
                difficulty: 2,
                points: 7,
                concept: "최대공약수"
            },
            {
                id: 8,
                question: "(-5) - (-3)의 값은?",
                options: ["-8", "-2", "2", "8"],
                answer: 1,
                difficulty: 2,
                points: 7,
                concept: "정수의 뺄셈"
            },
            {
                id: 9,
                question: "2/3 × 3/4의 값은?",
                options: ["1/2", "5/12", "6/12", "9/8"],
                answer: 0,
                difficulty: 2,
                points: 7,
                concept: "분수의 곱셈"
            },
            {
                id: 10,
                question: "x = 3일 때, 2x + 1의 값은?",
                options: ["5", "6", "7", "8"],
                answer: 2,
                difficulty: 2,
                points: 7,
                concept: "문자와 식"
            },
            {
                id: 11,
                question: "3x - 2 = 10일 때, x의 값은?",
                options: ["2", "3", "4", "5"],
                answer: 2,
                difficulty: 2,
                points: 7,
                concept: "일차방정식"
            },
            {
                id: 12,
                question: "원의 넓이를 구하는 공식은? (반지름 r)",
                options: ["2πr", "πr²", "πr", "4πr²"],
                answer: 1,
                difficulty: 2,
                points: 7,
                concept: "원의 넓이"
            },
            
            // 고급 (난이도: 3, 각 10점)
            {
                id: 13,
                question: "48과 72의 최소공배수는?",
                options: ["24", "96", "144", "288"],
                answer: 2,
                difficulty: 3,
                points: 10,
                concept: "최소공배수"
            },
            {
                id: 14,
                question: "(-2)³의 값은?",
                options: ["-8", "-6", "6", "8"],
                answer: 0,
                difficulty: 3,
                points: 10,
                concept: "정수의 거듭제곱"
            },
            {
                id: 15,
                question: "2x + 3y = 12, x = 3일 때 y의 값은?",
                options: ["1", "2", "3", "4"],
                answer: 1,
                difficulty: 3,
                points: 10,
                concept: "연립방정식"
            },
            {
                id: 16,
                question: "3(x - 2) = 2(x + 1)일 때, x의 값은?",
                options: ["4", "6", "8", "10"],
                answer: 2,
                difficulty: 3,
                points: 10,
                concept: "복잡한 일차방정식"
            },
            {
                id: 17,
                question: "반지름이 5cm인 원의 둘레는? (π = 3.14)",
                options: ["15.7cm", "25cm", "31.4cm", "78.5cm"],
                answer: 2,
                difficulty: 3,
                points: 10,
                concept: "원의 둘레"
            },
            {
                id: 18,
                question: "100의 약수의 개수는?",
                options: ["6개", "7개", "8개", "9개"],
                answer: 3,
                difficulty: 3,
                points: 10,
                concept: "약수의 개수"
            },
            {
                id: 19,
                question: "(-1/2) ÷ (-1/4)의 값은?",
                options: ["-2", "-1/2", "1/2", "2"],
                answer: 3,
                difficulty: 3,
                points: 10,
                concept: "유리수의 나눗셈"
            },
            {
                id: 20,
                question: "x : y = 2 : 3이고 x + y = 15일 때, x의 값은?",
                options: ["3", "6", "9", "12"],
                answer: 1,
                difficulty: 3,
                points: 10,
                concept: "비와 비율"
            }
        ],
        
        영어: [
            // 기초 (난이도: 1, 각 5점)
            {
                id: 1,
                question: "다음 중 be동사가 아닌 것은?",
                options: ["am", "is", "are", "do"],
                answer: 3,
                difficulty: 1,
                points: 5,
                concept: "be동사"
            },
            {
                id: 2,
                question: "'I ___ a student.' 빈칸에 알맞은 것은?",
                options: ["am", "is", "are", "be"],
                answer: 0,
                difficulty: 1,
                points: 5,
                concept: "be동사 인칭변화"
            },
            {
                id: 3,
                question: "'She ___ a teacher.' 빈칸에 알맞은 것은?",
                options: ["am", "is", "are", "be"],
                answer: 1,
                difficulty: 1,
                points: 5,
                concept: "3인칭 단수 be동사"
            },
            {
                id: 4,
                question: "다음 중 복수형이 틀린 것은?",
                options: ["book - books", "child - childs", "box - boxes", "tomato - tomatoes"],
                answer: 1,
                difficulty: 1,
                points: 5,
                concept: "명사의 복수형"
            },
            {
                id: 5,
                question: "'He ___ play soccer.' 빈칸에 알맞은 것은?",
                options: ["don't", "doesn't", "isn't", "aren't"],
                answer: 1,
                difficulty: 1,
                points: 5,
                concept: "일반동사 부정문"
            },
            
            // 중급 (난이도: 2, 각 7점)
            {
                id: 6,
                question: "'___ you like pizza?' 빈칸에 알맞은 것은?",
                options: ["Do", "Does", "Are", "Is"],
                answer: 0,
                difficulty: 2,
                points: 7,
                concept: "일반동사 의문문"
            },
            {
                id: 7,
                question: "'I am reading a book now.' 이 문장의 시제는?",
                options: ["현재", "과거", "현재진행", "미래"],
                answer: 2,
                difficulty: 2,
                points: 7,
                concept: "현재진행형"
            },
            {
                id: 8,
                question: "'She ___ (go) to school yesterday.' 빈칸에 알맞은 것은?",
                options: ["go", "goes", "went", "going"],
                answer: 2,
                difficulty: 2,
                points: 7,
                concept: "과거시제"
            },
            {
                id: 9,
                question: "다음 중 셀 수 없는 명사는?",
                options: ["apple", "water", "dog", "student"],
                answer: 1,
                difficulty: 2,
                points: 7,
                concept: "가산명사/불가산명사"
            },
            {
                id: 10,
                question: "'There ___ many students in the classroom.' 빈칸에 알맞은 것은?",
                options: ["is", "are", "am", "be"],
                answer: 1,
                difficulty: 2,
                points: 7,
                concept: "There is/are"
            },
            {
                id: 11,
                question: "'I will ___ my homework.' 빈칸에 알맞은 것은?",
                options: ["do", "does", "did", "doing"],
                answer: 0,
                difficulty: 2,
                points: 7,
                concept: "미래시제"
            },
            {
                id: 12,
                question: "'This book is ___ than that one.' 빈칸에 알맞은 것은?",
                options: ["good", "better", "best", "well"],
                answer: 1,
                difficulty: 2,
                points: 7,
                concept: "비교급"
            },
            
            // 고급 (난이도: 3, 각 10점)
            {
                id: 13,
                question: "'I have ___ (live) here for 5 years.' 빈칸에 알맞은 것은?",
                options: ["live", "lives", "lived", "living"],
                answer: 2,
                difficulty: 3,
                points: 10,
                concept: "현재완료"
            },
            {
                id: 14,
                question: "'If I ___ you, I would study harder.' 빈칸에 알맞은 것은?",
                options: ["am", "was", "were", "be"],
                answer: 2,
                difficulty: 3,
                points: 10,
                concept: "가정법"
            },
            {
                id: 15,
                question: "다음 중 수동태 문장은?",
                options: ["He makes a cake.", "A cake is made by him.", "He is making a cake.", "He made a cake."],
                answer: 1,
                difficulty: 3,
                points: 10,
                concept: "수동태"
            },
            {
                id: 16,
                question: "'She asked me ___ the door.' 빈칸에 알맞은 것은?",
                options: ["close", "to close", "closing", "closed"],
                answer: 1,
                difficulty: 3,
                points: 10,
                concept: "to부정사"
            },
            {
                id: 17,
                question: "'The boy ___ is playing soccer is my brother.' 빈칸에 알맞은 것은?",
                options: ["who", "which", "whose", "when"],
                answer: 0,
                difficulty: 3,
                points: 10,
                concept: "관계대명사"
            },
            {
                id: 18,
                question: "'He is too young ___ drive.' 빈칸에 알맞은 것은?",
                options: ["for", "to", "of", "at"],
                answer: 1,
                difficulty: 3,
                points: 10,
                concept: "too ~ to"
            },
            {
                id: 19,
                question: "'I am looking forward to ___ you.' 빈칸에 알맞은 것은?",
                options: ["see", "seeing", "saw", "seen"],
                answer: 1,
                difficulty: 3,
                points: 10,
                concept: "동명사"
            },
            {
                id: 20,
                question: "'Neither he nor I ___ right.' 빈칸에 알맞은 것은?",
                options: ["am", "is", "are", "be"],
                answer: 0,
                difficulty: 3,
                points: 10,
                concept: "상관접속사"
            }
        ],
        
        국어: [
            // 기초 (난이도: 1, 각 5점)
            {
                id: 1,
                question: "다음 중 명사가 아닌 것은?",
                options: ["하늘", "예쁘다", "나무", "학교"],
                answer: 1,
                difficulty: 1,
                points: 5,
                concept: "품사-명사"
            },
            {
                id: 2,
                question: "'빨갛다'의 품사는?",
                options: ["명사", "동사", "형용사", "부사"],
                answer: 2,
                difficulty: 1,
                points: 5,
                concept: "품사-형용사"
            },
            {
                id: 3,
                question: "다음 중 맞춤법이 틀린 것은?",
                options: ["안녕하세요", "안녕히 계세요", "만나서 반갑습니다", "웬지 모르게"],
                answer: 3,
                difficulty: 1,
                points: 5,
                concept: "맞춤법"
            },
            {
                id: 4,
                question: "'먹다'를 과거형으로 바꾸면?",
                options: ["먹었다", "먹는다", "먹을다", "먹니다"],
                answer: 0,
                difficulty: 1,
                points: 5,
                concept: "시제"
            },
            {
                id: 5,
                question: "다음 중 높임 표현이 아닌 것은?",
                options: ["드시다", "계시다", "먹다", "주무시다"],
                answer: 2,
                difficulty: 1,
                points: 5,
                concept: "높임법"
            },
            
            // 중급 (난이도: 2, 각 7점)
            {
                id: 6,
                question: "'하늘이 파랗다'에서 주어는?",
                options: ["하늘이", "파랗다", "하늘", "이"],
                answer: 0,
                difficulty: 2,
                points: 7,
                concept: "문장 성분"
            },
            {
                id: 7,
                question: "다음 중 사동 표현은?",
                options: ["먹다", "먹이다", "먹히다", "먹거나"],
                answer: 1,
                difficulty: 2,
                points: 7,
                concept: "사동/피동"
            },
            {
                id: 8,
                question: "'은유법'의 예로 적절한 것은?",
                options: ["내 마음은 호수요", "너처럼 예쁜", "매우 아름다운", "꽃이 피었다"],
                answer: 0,
                difficulty: 2,
                points: 7,
                concept: "비유법"
            },
            {
                id: 9,
                question: "다음 중 복합문은?",
                options: ["나는 학생이다", "비가 오다", "비가 오고 바람이 분다", "매우 춥다"],
                answer: 2,
                difficulty: 2,
                points: 7,
                concept: "문장의 종류"
            },
            {
                id: 10,
                question: "'소나기'에서 '소나기'가 상징하는 것은?",
                options: ["비", "사랑", "슬픔", "기쁨"],
                answer: 1,
                difficulty: 2,
                points: 7,
                concept: "문학 작품 이해"
            },
            {
                id: 11,
                question: "다음 중 관형어는?",
                options: ["매우", "빨리", "예쁜", "천천히"],
                answer: 2,
                difficulty: 2,
                points: 7,
                concept: "문장 성분-관형어"
            },
            {
                id: 12,
                question: "'의성어'의 예로 적절한 것은?",
                options: ["반짝반짝", "멍멍", "파랗다", "크다"],
                answer: 1,
                difficulty: 2,
                points: 7,
                concept: "의성어/의태어"
            },
            
            // 고급 (난이도: 3, 각 10점)
            {
                id: 13,
                question: "'역설법'의 예로 적절한 것은?",
                options: ["소리 없는 아우성", "빨간 장미", "높은 산", "맑은 하늘"],
                answer: 0,
                difficulty: 3,
                points: 10,
                concept: "표현법-역설"
            },
            {
                id: 14,
                question: "시조의 형식으로 적절한 것은?",
                options: ["초장-중장-종장", "기-승-전-결", "서-본-결", "발단-전개-위기-절정-결말"],
                answer: 0,
                difficulty: 3,
                points: 10,
                concept: "시조의 구조"
            },
            {
                id: 15,
                question: "'춘향전'의 갈래는?",
                options: ["서사시", "판소리계 소설", "수필", "희곡"],
                answer: 1,
                difficulty: 3,
                points: 10,
                concept: "문학 갈래"
            },
            {
                id: 16,
                question: "다음 중 객관적 상관물의 예로 적절한 것은?",
                options: ["봄꽃-희망", "겨울-추위", "여름-더위", "가을-낙엽"],
                answer: 0,
                difficulty: 3,
                points: 10,
                concept: "시어의 상징"
            },
            {
                id: 17,
                question: "'관동별곡'의 작가는?",
                options: ["정철", "김시습", "박지원", "허균"],
                answer: 0,
                difficulty: 3,
                points: 10,
                concept: "고전 문학"
            },
            {
                id: 18,
                question: "다음 중 '인물의 내적 갈등'을 나타내는 것은?",
                options: ["주인공과 악당의 싸움", "주인공의 고민과 망설임", "친구 사이의 다툼", "가족 간의 대립"],
                answer: 1,
                difficulty: 3,
                points: 10,
                concept: "소설의 갈등"
            },
            {
                id: 19,
                question: "'이효석의 메밀꽃 필 무렵'의 배경은?",
                options: ["강원도", "제주도", "서울", "부산"],
                answer: 0,
                difficulty: 3,
                points: 10,
                concept: "현대 소설"
            },
            {
                id: 20,
                question: "다음 중 '외재율'에 해당하는 것은?",
                options: ["음수율", "자유시", "산문시", "현대시"],
                answer: 0,
                difficulty: 3,
                points: 10,
                concept: "운율"
            }
        ]
    },
    
    // 중학교 2학년 (간략 버전 - 추후 확장 가능)
    2: {
        수학: [
            {id: 1, question: "유리수와 순환소수: 0.333...을 분수로 나타내면?", options: ["1/2", "1/3", "1/4", "2/3"], answer: 1, difficulty: 1, points: 5, concept: "순환소수"},
            {id: 2, question: "단항식의 곱셈: 2x × 3x²의 값은?", options: ["5x³", "6x²", "6x³", "5x²"], answer: 2, difficulty: 1, points: 5, concept: "단항식의 곱셈"},
            // ... (20문제 구성, 여기서는 2개만 예시)
        ],
        영어: [
            {id: 1, question: "현재완료: 'I ___ (see) this movie before.' 빈칸에 알맞은 것은?", options: ["see", "saw", "have seen", "seeing"], answer: 2, difficulty: 1, points: 5, concept: "현재완료"},
            {id: 2, question: "to부정사: 'I want ___ English.' 빈칸에 알맞은 것은?", options: ["learn", "to learn", "learning", "learned"], answer: 1, difficulty: 1, points: 5, concept: "to부정사"},
            // ... (20문제 구성)
        ],
        국어: [
            {id: 1, question: "설명문의 특징으로 적절한 것은?", options: ["감정 표현", "객관적 정보 전달", "주장과 근거", "인물의 갈등"], answer: 1, difficulty: 1, points: 5, concept: "설명문"},
            {id: 2, question: "토론에서 가장 중요한 것은?", options: ["큰 목소리", "근거 있는 주장", "많은 발언", "상대방 비판"], answer: 1, difficulty: 1, points: 5, concept: "토론"},
            // ... (20문제 구성)
        ]
    },
    
    // 중학교 3학년 (간략 버전 - 추후 확장 가능)
    3: {
        수학: [
            {id: 1, question: "제곱근: √16의 값은?", options: ["2", "4", "8", "16"], answer: 1, difficulty: 1, points: 5, concept: "제곱근"},
            {id: 2, question: "피타고라스 정리: 직각삼각형에서 빗변의 길이가 5, 한 변이 3일 때 나머지 변의 길이는?", options: ["2", "3", "4", "5"], answer: 2, difficulty: 2, points: 7, concept: "피타고라스"},
            // ... (20문제 구성)
        ],
        영어: [
            {id: 1, question: "관계대명사: 'The book ___ I bought yesterday is interesting.' 빈칸에 알맞은 것은?", options: ["who", "which", "whose", "when"], answer: 1, difficulty: 2, points: 7, concept: "관계대명사"},
            {id: 2, question: "분사구문: '___ hard, he passed the exam.' 빈칸에 알맞은 것은?", options: ["Study", "Studying", "Studied", "To study"], answer: 1, difficulty: 3, points: 10, concept: "분사구문"},
            // ... (20문제 구성)
        ],
        국어: [
            {id: 1, question: "논설문의 구조로 적절한 것은?", options: ["발단-전개-위기-절정-결말", "서론-본론-결론", "기-승-전-결", "초-중-종장"], answer: 1, difficulty: 1, points: 5, concept: "논설문 구조"},
            {id: 2, question: "다음 중 '풍자'의 예로 적절한 것은?", options: ["매우 아름답다", "겉과 속이 다르구나", "높은 산", "푸른 바다"], answer: 1, difficulty: 2, points: 7, concept: "풍자"},
            // ... (20문제 구성)
        ]
    }
};

// 수준 판정 기준 (총점 기준)
const levelCriteria = {
    beginner: { min: 0, max: 90, label: "기초", description: "기본 개념부터 차근차근" },
    intermediate: { min: 91, max: 130, label: "중급", description: "표준 교과 과정" },
    advanced: { min: 131, max: 160, label: "고급", description: "심화 학습 권장" }
};

// 진단평가 문제 가져오기
function getDiagnosticTest(grade, subject) {
    if (!diagnosticTestDB[grade] || !diagnosticTestDB[grade][subject]) {
        console.error(`진단평가 문제를 찾을 수 없습니다: 학년=${grade}, 과목=${subject}`);
        return [];
    }
    return diagnosticTestDB[grade][subject];
}

// 수준 판정
function determineLevel(totalScore) {
    if (totalScore >= levelCriteria.advanced.min) return 'advanced';
    if (totalScore >= levelCriteria.intermediate.min) return 'intermediate';
    return 'beginner';
}
