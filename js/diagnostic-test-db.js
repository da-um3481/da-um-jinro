// ==========================================
// 학년별 과목별 진단평가 문제 데이터베이스
// 총 50문제: 수학(10) + 영어(10) + 국어(10) + 사회(10) + 과학(10)
// ==========================================

const diagnosticTestDB = {
    // ==========================================
    // 중학교 1학년
    // ==========================================
    1: {
        수학: [
            // 기초 (난이도: 1, 각 5점) - 2문제
            {id: 1, question: "12의 약수 중 가장 큰 것은?", options: ["4", "6", "12", "24"], answer: 2, difficulty: 1, points: 5, concept: "약수의 개념"},
            {id: 2, question: "(-3) + 5의 값은?", options: ["-8", "-2", "2", "8"], answer: 2, difficulty: 1, points: 5, concept: "정수의 덧셈"},
            
            // 표준 (난이도: 2, 각 8점) - 5문제
            {id: 3, question: "(-5) - (-3)의 값은?", options: ["-8", "-2", "2", "8"], answer: 1, difficulty: 2, points: 8, concept: "정수의 뺄셈"},
            {id: 4, question: "(-3) × (+4) + 6의 값은?", options: ["-18", "-6", "0", "6"], answer: 1, difficulty: 2, points: 8, concept: "정수의 사칙연산"},
            {id: 5, question: "60을 소인수분해하면?", options: ["2² × 3 × 5", "2 × 3² × 5", "2³ × 3 × 5", "2² × 15"], answer: 0, difficulty: 2, points: 8, concept: "소인수분해"},
            {id: 6, question: "12와 18의 최대공약수를 소인수분해로 구하면?", options: ["2", "3", "6", "2 × 3"], answer: 3, difficulty: 2, points: 8, concept: "최대공약수"},
            {id: 7, question: "3x - 5 = 10일 때, x의 값은?", options: ["3", "4", "5", "6"], answer: 2, difficulty: 2, points: 8, concept: "일차방정식 기초"},
            
            // 심화 (난이도: 3, 각 15점) - 3문제
            {id: 8, question: "48과 72의 최소공배수는?", options: ["24", "96", "144", "288"], answer: 2, difficulty: 3, points: 15, concept: "최소공배수"},
            {id: 9, question: "2(3x - 1) = 5(x + 2)일 때, x의 값은?", options: ["8", "10", "12", "14"], answer: 2, difficulty: 3, points: 15, concept: "일차방정식 응용"},
            {id: 10, question: "어떤 수의 3배에서 5를 뺀 값이 16일 때, 어떤 수는?", options: ["5", "6", "7", "8"], answer: 2, difficulty: 3, points: 15, concept: "문제 해결"}
        ],
        
        영어: [
            // 기초 (난이도: 1, 각 5점) - 2문제
            {id: 1, question: "'I ___ a student.' 빈칸에 알맞은 것은?", options: ["am", "is", "are", "be"], answer: 0, difficulty: 1, points: 5, concept: "be동사"},
            {id: 2, question: "'book'의 복수형은?", options: ["books", "bookes", "book", "bookies"], answer: 0, difficulty: 1, points: 5, concept: "명사 복수형"},
            
            // 표준 (난이도: 2, 각 8점) - 5문제
            {id: 3, question: "'She ___ a teacher.' 빈칸에 알맞은 것은?", options: ["am", "is", "are", "be"], answer: 1, difficulty: 2, points: 8, concept: "3인칭 단수"},
            {id: 4, question: "'___ you play soccer?' 빈칸에 알맞은 것은?", options: ["Do", "Does", "Are", "Is"], answer: 0, difficulty: 2, points: 8, concept: "일반동사 의문문"},
            {id: 5, question: "'I ___ to the library yesterday.' 빈칸에 알맞은 것은?", options: ["go", "goes", "went", "going"], answer: 2, difficulty: 2, points: 8, concept: "과거시제"},
            {id: 6, question: "'He is ___ a book now.' 빈칸에 알맞은 것은?", options: ["read", "reads", "reading", "readed"], answer: 2, difficulty: 2, points: 8, concept: "현재진행형"},
            {id: 7, question: "'There ___ two cats in the garden.' 빈칸에 알맞은 것은?", options: ["is", "are", "am", "be"], answer: 1, difficulty: 2, points: 8, concept: "There is/are"},
            
            // 심화 (난이도: 3, 각 15점) - 3문제
            {id: 8, question: "'I have ___ in Seoul since 2020.' 빈칸에 알맞은 것은?", options: ["live", "lived", "living", "lives"], answer: 1, difficulty: 3, points: 15, concept: "현재완료"},
            {id: 9, question: "'My mother told me ___ my homework.' 빈칸에 알맞은 것은?", options: ["do", "to do", "doing", "did"], answer: 1, difficulty: 3, points: 15, concept: "to부정사"},
            {id: 10, question: "'The man ___ is wearing a hat is my uncle.' 빈칸에 알맞은 것은?", options: ["who", "which", "whose", "where"], answer: 0, difficulty: 3, points: 15, concept: "관계대명사"}
        ],
        
        국어: [
            // 기초 (난이도: 1, 각 5점) - 2문제
            {id: 1, question: "'빨갛다'의 품사는?", options: ["명사", "동사", "형용사", "부사"], answer: 2, difficulty: 1, points: 5, concept: "품사"},
            {id: 2, question: "다음 중 높임 표현이 아닌 것은?", options: ["드시다", "계시다", "먹다", "주무시다"], answer: 2, difficulty: 1, points: 5, concept: "높임법"},
            
            // 표준 (난이도: 2, 각 8점) - 5문제
            {id: 3, question: "'하늘이 파랗다'에서 주어는?", options: ["하늘이", "파랗다", "하늘", "이"], answer: 0, difficulty: 2, points: 8, concept: "문장 성분"},
            {id: 4, question: "다음 중 사동 표현은?", options: ["먹다", "먹이다", "먹히다", "먹거나"], answer: 1, difficulty: 2, points: 8, concept: "사동/피동"},
            {id: 5, question: "'은유법'의 예로 적절한 것은?", options: ["내 마음은 호수요", "너처럼 예쁜", "매우 아름다운", "꽃이 피었다"], answer: 0, difficulty: 2, points: 8, concept: "비유법"},
            {id: 6, question: "다음 중 관형어는?", options: ["매우", "빨리", "예쁜", "천천히"], answer: 2, difficulty: 2, points: 8, concept: "문장 성분"},
            {id: 7, question: "다음 중 '의태어'는?", options: ["반짝반짝", "멍멍", "파랗다", "빨리"], answer: 0, difficulty: 2, points: 8, concept: "의태어"},
            
            // 심화 (난이도: 3, 각 15점) - 3문제
            {id: 8, question: "'역설법'의 예로 적절한 것은?", options: ["소리 없는 아우성", "빨간 장미", "높은 산", "맑은 하늘"], answer: 0, difficulty: 3, points: 15, concept: "표현법"},
            {id: 9, question: "시조의 형식은?", options: ["초장-중장-종장", "기-승-전-결", "서-본-결", "발단-전개-위기-절정-결말"], answer: 0, difficulty: 3, points: 15, concept: "시조"},
            {id: 10, question: "'춘향전'의 갈래는?", options: ["서사시", "판소리계 소설", "수필", "희곡"], answer: 1, difficulty: 3, points: 15, concept: "문학 갈래"}
        ],
        
        사회: [
            // 기초 (난이도: 1, 각 5점) - 2문제
            {id: 1, question: "위도 0도를 무엇이라 하는가?", options: ["북극", "남극", "적도", "자오선"], answer: 2, difficulty: 1, points: 5, concept: "위도와 경도"},
            {id: 2, question: "사막 기후의 특징은?", options: ["비가 많다", "눈이 많다", "매우 건조하다", "항상 춥다"], answer: 2, difficulty: 1, points: 5, concept: "기후"},
            
            // 표준 (난이도: 2, 각 8점) - 5문제
            {id: 3, question: "열대 기후 지역의 주요 작물은?", options: ["쌀", "밀", "바나나", "감자"], answer: 2, difficulty: 2, points: 8, concept: "열대 기후"},
            {id: 4, question: "우리나라의 4계절 구분은?", options: ["봄, 여름, 가을, 겨울", "건기, 우기", "여름, 겨울", "3계절"], answer: 0, difficulty: 2, points: 8, concept: "계절"},
            {id: 5, question: "지도에서 축척이 크면?", options: ["넓은 지역을 보여준다", "자세히 보여준다", "작게 보여준다", "색이 진하다"], answer: 1, difficulty: 2, points: 8, concept: "지도"},
            {id: 6, question: "온대 기후의 특징은?", options: ["1년 내내 덥다", "4계절이 뚜렷하다", "매우 춥다", "비가 안 온다"], answer: 1, difficulty: 2, points: 8, concept: "온대 기후"},
            {id: 7, question: "우리나라의 대표적인 산맥은?", options: ["히말라야", "태백산맥", "알프스", "로키산맥"], answer: 1, difficulty: 2, points: 8, concept: "한국 지리"},
            
            // 심화 (난이도: 3, 각 15점) - 3문제
            {id: 8, question: "경도 180도 선을 무엇이라 하는가?", options: ["본초 자오선", "적도", "날짜 변경선", "북회귀선"], answer: 2, difficulty: 3, points: 15, concept: "경도"},
            {id: 9, question: "한대 기후 지역의 생활 모습은?", options: ["벼농사", "목축업", "순록 유목", "과일 재배"], answer: 2, difficulty: 3, points: 15, concept: "한대 기후"},
            {id: 10, question: "세계 최대 사막은?", options: ["고비 사막", "사하라 사막", "칼라하리 사막", "아타카마 사막"], answer: 1, difficulty: 3, points: 15, concept: "세계 지리"}
        ],
        
        과학: [
            // 기초 (난이도: 1, 각 5점) - 2문제
            {id: 1, question: "물의 끓는점은?", options: ["0℃", "50℃", "100℃", "200℃"], answer: 2, difficulty: 1, points: 5, concept: "물의 상태 변화"},
            {id: 2, question: "지구의 공전 주기는?", options: ["1일", "1개월", "1년", "10년"], answer: 2, difficulty: 1, points: 5, concept: "지구의 운동"},
            
            // 표준 (난이도: 2, 각 8점) - 5문제
            {id: 3, question: "산성 용액의 pH는?", options: ["7보다 크다", "7보다 작다", "7이다", "0이다"], answer: 1, difficulty: 2, points: 8, concept: "산과 염기"},
            {id: 4, question: "식물 세포에만 있는 것은?", options: ["핵", "세포막", "세포벽", "세포질"], answer: 2, difficulty: 2, points: 8, concept: "세포"},
            {id: 5, question: "지진의 진앙은?", options: ["지진이 발생한 지하 지점", "진원 바로 위 지표면", "지진의 세기", "지진파"], answer: 1, difficulty: 2, points: 8, concept: "지진"},
            {id: 6, question: "혼합물을 분리하는 방법이 아닌 것은?", options: ["증류", "여과", "크로마토그래피", "중화"], answer: 3, difficulty: 2, points: 8, concept: "혼합물 분리"},
            {id: 7, question: "광합성을 하는 세포 소기관은?", options: ["핵", "엽록체", "미토콘드리아", "리보솜"], answer: 1, difficulty: 2, points: 8, concept: "광합성"},
            
            // 심화 (난이도: 3, 각 15점) - 3문제
            {id: 8, question: "광합성의 결과 생성되는 기체는?", options: ["산소", "이산화탄소", "질소", "수소"], answer: 0, difficulty: 3, points: 15, concept: "광합성 산물"},
            {id: 9, question: "암석의 종류가 아닌 것은?", options: ["화성암", "변성암", "퇴적암", "풍화암"], answer: 3, difficulty: 3, points: 15, concept: "암석"},
            {id: 10, question: "달의 위상 변화 원인은?", options: ["지구 자전", "달 자전", "달 공전", "태양 공전"], answer: 2, difficulty: 3, points: 15, concept: "달의 위상"}
        ]
    },
    
    // ==========================================
    // 중학교 2학년
    // ==========================================
    2: {
        수학: [
            {id: 1, question: "0.333...을 분수로 나타내면?", options: ["1/2", "1/3", "1/4", "2/3"], answer: 1, difficulty: 1, points: 5, concept: "순환소수"},
            {id: 2, question: "2x × 3x²의 값은?", options: ["5x³", "6x²", "6x³", "5x²"], answer: 2, difficulty: 1, points: 5, concept: "단항식의 곱셈"},
            {id: 3, question: "(x + 2)(x + 3)을 전개하면?", options: ["x² + 5x + 6", "x² + 6x + 5", "x² + 5x + 5", "x² + 6"], answer: 0, difficulty: 1, points: 5, concept: "다항식의 곱셈"},
            {id: 4, question: "일차함수 y = 2x + 1의 기울기는?", options: ["1", "2", "-1", "-2"], answer: 1, difficulty: 2, points: 7, concept: "일차함수"},
            {id: 5, question: "x + y = 5, x - y = 1일 때, x의 값은?", options: ["2", "3", "4", "5"], answer: 1, difficulty: 2, points: 7, concept: "연립방정식"},
            {id: 6, question: "부등식 2x + 1 > 5의 해는?", options: ["x > 2", "x < 2", "x > 3", "x < 3"], answer: 0, difficulty: 2, points: 7, concept: "일차부등식"},
            {id: 7, question: "정삼각형의 한 내각의 크기는?", options: ["30°", "45°", "60°", "90°"], answer: 2, difficulty: 2, points: 7, concept: "삼각형"},
            {id: 8, question: "이등변삼각형의 두 밑각의 크기가 같을 때, 한 밑각이 70°이면 꼭지각은?", options: ["20°", "40°", "50°", "70°"], answer: 1, difficulty: 3, points: 10, concept: "이등변삼각형"},
            {id: 9, question: "직각삼각형에서 빗변의 제곱은?", options: ["두 변의 합", "두 변의 제곱의 합", "두 변의 차", "두 변의 곱"], answer: 1, difficulty: 3, points: 10, concept: "피타고라스"},
            {id: 10, question: "평행사변형의 대각의 크기의 합은?", options: ["90°", "180°", "270°", "360°"], answer: 1, difficulty: 3, points: 10, concept: "평행사변형"}
        ],
        
        영어: [
            {id: 1, question: "'I ___ (see) this movie before.' 빈칸에 알맞은 것은?", options: ["see", "saw", "have seen", "seeing"], answer: 2, difficulty: 1, points: 5, concept: "현재완료"},
            {id: 2, question: "'I want ___ English.' 빈칸에 알맞은 것은?", options: ["learn", "to learn", "learning", "learned"], answer: 1, difficulty: 1, points: 5, concept: "to부정사"},
            {id: 3, question: "'She enjoys ___ music.' 빈칸에 알맞은 것은?", options: ["listen", "to listen", "listening", "listened"], answer: 2, difficulty: 1, points: 5, concept: "동명사"},
            {id: 4, question: "'This book is ___ than that one.' 빈칸에 알맞은 것은?", options: ["good", "better", "best", "well"], answer: 1, difficulty: 2, points: 7, concept: "비교급"},
            {id: 5, question: "'He is the ___ student in class.' 빈칸에 알맞은 것은?", options: ["tall", "taller", "tallest", "most tall"], answer: 2, difficulty: 2, points: 7, concept: "최상급"},
            {id: 6, question: "수동태: 'Tom wrote this letter.' → 'This letter ___ by Tom.'", options: ["writes", "wrote", "is written", "was written"], answer: 3, difficulty: 2, points: 7, concept: "수동태"},
            {id: 7, question: "'If it ___ tomorrow, I will stay home.' 빈칸에 알맞은 것은?", options: ["rain", "rains", "will rain", "rained"], answer: 1, difficulty: 2, points: 7, concept: "조건절"},
            {id: 8, question: "'I am interested ___ music.' 빈칸에 알맞은 것은?", options: ["in", "at", "on", "to"], answer: 0, difficulty: 3, points: 10, concept: "전치사"},
            {id: 9, question: "'The book ___ I bought is interesting.' 빈칸에 알맞은 것은?", options: ["who", "which", "whose", "where"], answer: 1, difficulty: 3, points: 10, concept: "관계대명사"},
            {id: 10, question: "'He told me ___ quiet.' 빈칸에 알맞은 것은?", options: ["be", "to be", "being", "been"], answer: 1, difficulty: 3, points: 10, concept: "명령문"}
        ],
        
        국어: [
            {id: 1, question: "설명문의 특징은?", options: ["감정 표현", "객관적 정보 전달", "주장과 근거", "인물의 갈등"], answer: 1, difficulty: 1, points: 5, concept: "설명문"},
            {id: 2, question: "토론에서 가장 중요한 것은?", options: ["큰 목소리", "근거 있는 주장", "많은 발언", "상대방 비판"], answer: 1, difficulty: 1, points: 5, concept: "토론"},
            {id: 3, question: "논설문의 구조는?", options: ["발단-전개-위기-절정-결말", "서론-본론-결론", "기-승-전-결", "초-중-종장"], answer: 1, difficulty: 1, points: 5, concept: "논설문"},
            {id: 4, question: "다음 중 '의성어'는?", options: ["반짝반짝", "멍멍", "파랗다", "빨리"], answer: 1, difficulty: 2, points: 7, concept: "의성어"},
            {id: 5, question: "'아버지가방에들어가신다'를 올바르게 띄어쓰면?", options: ["아버지 가방에 들어가신다", "아버지가 방에 들어가신다", "아버지 가 방에 들어가신다", "아버지가 방에들어가신다"], answer: 1, difficulty: 2, points: 7, concept: "띄어쓰기"},
            {id: 6, question: "소설의 3요소는?", options: ["운율-심상-비유", "인물-사건-배경", "기-승-전-결", "서론-본론-결론"], answer: 1, difficulty: 2, points: 7, concept: "소설"},
            {id: 7, question: "다음 중 '외래어' 표기가 맞는 것은?", options: ["컴퓨타", "컴퓨터", "컴퓨테", "컴퓨타"], answer: 1, difficulty: 2, points: 7, concept: "외래어"},
            {id: 8, question: "'메밀꽃 필 무렵'의 작가는?", options: ["김유정", "이효석", "황순원", "김동인"], answer: 1, difficulty: 3, points: 10, concept: "현대 소설"},
            {id: 9, question: "다음 중 '풍자'의 예는?", options: ["매우 아름답다", "겉과 속이 다르구나", "높은 산", "푸른 바다"], answer: 1, difficulty: 3, points: 10, concept: "풍자"},
            {id: 10, question: "희곡의 구성 요소가 아닌 것은?", options: ["대사", "지문", "무대", "운율"], answer: 3, difficulty: 3, points: 10, concept: "희곡"}
        ],
        
        사회: [
            {id: 1, question: "지형도에서 등고선 간격이 좁으면?", options: ["평지", "완만한 경사", "급경사", "분지"], answer: 2, difficulty: 1, points: 5, concept: "지형도"},
            {id: 2, question: "우리나라의 대표적인 반도는?", options: ["이탈리아", "한반도", "인도차이나", "아라비아"], answer: 1, difficulty: 1, points: 5, concept: "한국 지리"},
            {id: 3, question: "도시화의 문제점이 아닌 것은?", options: ["교통 혼잡", "주택 부족", "환경 오염", "인구 감소"], answer: 3, difficulty: 1, points: 5, concept: "도시화"},
            {id: 4, question: "우리나라의 1차 산업은?", options: ["농업", "제조업", "서비스업", "금융업"], answer: 0, difficulty: 2, points: 7, concept: "산업"},
            {id: 5, question: "교통이 발달하면서 나타난 현상은?", options: ["지역 간 교류 증가", "물가 상승", "인구 감소", "산업 쇠퇴"], answer: 0, difficulty: 2, points: 7, concept: "교통"},
            {id: 6, question: "대한민국 헌법의 기본 정신은?", options: ["자유", "평등", "민주주의", "모두"], answer: 3, difficulty: 2, points: 7, concept: "헌법"},
            {id: 7, question: "국회의 주요 기능은?", options: ["행정", "입법", "사법", "경제"], answer: 1, difficulty: 2, points: 7, concept: "삼권분립"},
            {id: 8, question: "환경 문제 해결을 위한 방법이 아닌 것은?", options: ["재활용", "쓰레기 줄이기", "대량 생산", "에너지 절약"], answer: 2, difficulty: 3, points: 10, concept: "환경"},
            {id: 9, question: "세계화의 특징이 아닌 것은?", options: ["국가 간 교류 증가", "문화 교류", "자급자족", "무역 확대"], answer: 2, difficulty: 3, points: 10, concept: "세계화"},
            {id: 10, question: "지역 축제의 목적이 아닌 것은?", options: ["지역 경제 활성화", "문화 계승", "주민 화합", "인구 감소"], answer: 3, difficulty: 3, points: 10, concept: "지역 문화"}
        ],
        
        과학: [
            {id: 1, question: "물질의 세 가지 상태는?", options: ["고체, 액체, 기체", "물, 얼음, 수증기", "원자, 분자, 이온", "산, 염기, 중성"], answer: 0, difficulty: 1, points: 5, concept: "물질의 상태"},
            {id: 2, question: "화학 반응의 예가 아닌 것은?", options: ["물 끓이기", "철 녹슬기", "종이 타기", "음식 소화"], answer: 0, difficulty: 1, points: 5, concept: "화학 반응"},
            {id: 3, question: "광합성에 필요한 것이 아닌 것은?", options: ["빛", "물", "이산화탄소", "산소"], answer: 3, difficulty: 1, points: 5, concept: "광합성"},
            {id: 4, question: "전류의 단위는?", options: ["볼트(V)", "암페어(A)", "와트(W)", "옴(Ω)"], answer: 1, difficulty: 2, points: 7, concept: "전류"},
            {id: 5, question: "소화 효소가 분비되는 곳이 아닌 것은?", options: ["침샘", "위", "간", "작은창자"], answer: 2, difficulty: 2, points: 7, concept: "소화"},
            {id: 6, question: "물의 밀도가 가장 큰 온도는?", options: ["0℃", "4℃", "10℃", "100℃"], answer: 1, difficulty: 2, points: 7, concept: "물의 특성"},
            {id: 7, question: "기압이 낮으면?", options: ["날씨가 맑다", "비가 온다", "바람이 없다", "기온이 높다"], answer: 1, difficulty: 2, points: 7, concept: "날씨"},
            {id: 8, question: "광합성 결과 생성되는 양분은?", options: ["단백질", "지방", "포도당", "물"], answer: 2, difficulty: 3, points: 10, concept: "광합성 산물"},
            {id: 9, question: "판의 경계에서 일어나는 현상이 아닌 것은?", options: ["지진", "화산", "해일", "일식"], answer: 3, difficulty: 3, points: 10, concept: "판구조론"},
            {id: 10, question: "별의 일주 운동 방향은?", options: ["동→서", "서→동", "남→북", "북→남"], answer: 0, difficulty: 3, points: 10, concept: "천체 운동"}
        ]
    },
    
    // ==========================================
    // 중학교 3학년
    // ==========================================
    3: {
        수학: [
            {id: 1, question: "√16의 값은?", options: ["2", "4", "8", "16"], answer: 1, difficulty: 1, points: 5, concept: "제곱근"},
            {id: 2, question: "√2 × √8의 값은?", options: ["2", "4", "8", "16"], answer: 1, difficulty: 1, points: 5, concept: "무리수의 곱셈"},
            {id: 3, question: "x² - 5x + 6을 인수분해하면?", options: ["(x-2)(x-3)", "(x+2)(x+3)", "(x-1)(x-6)", "(x+1)(x+6)"], answer: 0, difficulty: 1, points: 5, concept: "인수분해"},
            {id: 4, question: "x² = 9의 해는?", options: ["x = 3", "x = -3", "x = ±3", "x = 9"], answer: 2, difficulty: 2, points: 7, concept: "이차방정식"},
            {id: 5, question: "이차함수 y = x²의 꼭짓점은?", options: ["(0, 0)", "(1, 1)", "(-1, 1)", "(0, 1)"], answer: 0, difficulty: 2, points: 7, concept: "이차함수"},
            {id: 6, question: "직각삼각형에서 빗변이 5, 한 변이 3일 때 나머지 변은?", options: ["2", "3", "4", "5"], answer: 2, difficulty: 2, points: 7, concept: "피타고라스"},
            {id: 7, question: "sin 30°의 값은?", options: ["1/2", "√2/2", "√3/2", "1"], answer: 0, difficulty: 2, points: 7, concept: "삼각비"},
            {id: 8, question: "원의 중심각이 60°일 때 호의 길이는? (반지름 6cm)", options: ["2πcm", "3πcm", "4πcm", "6πcm"], answer: 0, difficulty: 3, points: 10, concept: "원과 부채꼴"},
            {id: 9, question: "자료 1, 2, 3, 4, 5의 평균은?", options: ["2", "3", "4", "5"], answer: 1, difficulty: 3, points: 10, concept: "통계"},
            {id: 10, question: "경우의 수: 주사위 2개를 던질 때 나오는 경우는?", options: ["12", "24", "36", "48"], answer: 2, difficulty: 3, points: 10, concept: "확률"}
        ],
        
        영어: [
            {id: 1, question: "'If I ___ you, I would study harder.' 빈칸에 알맞은 것은?", options: ["am", "was", "were", "be"], answer: 2, difficulty: 1, points: 5, concept: "가정법"},
            {id: 2, question: "'A cake is made ___ flour.' 빈칸에 알맞은 것은?", options: ["by", "of", "with", "from"], answer: 3, difficulty: 1, points: 5, concept: "전치사"},
            {id: 3, question: "'The book ___ I bought is interesting.' 빈칸에 알맞은 것은?", options: ["who", "which", "whose", "when"], answer: 1, difficulty: 1, points: 5, concept: "관계대명사"},
            {id: 4, question: "'___ hard, he passed the exam.' 빈칸에 알맞은 것은?", options: ["Study", "Studying", "Studied", "To study"], answer: 1, difficulty: 2, points: 7, concept: "분사구문"},
            {id: 5, question: "'He is too young ___ drive.' 빈칸에 알맞은 것은?", options: ["for", "to", "of", "at"], answer: 1, difficulty: 2, points: 7, concept: "too ~ to"},
            {id: 6, question: "'I am looking forward to ___ you.' 빈칸에 알맞은 것은?", options: ["see", "seeing", "saw", "seen"], answer: 1, difficulty: 2, points: 7, concept: "전치사 + 동명사"},
            {id: 7, question: "'Neither he nor I ___ right.' 빈칸에 알맞은 것은?", options: ["am", "is", "are", "be"], answer: 0, difficulty: 2, points: 7, concept: "상관접속사"},
            {id: 8, question: "'The girl ___ father is a doctor is my friend.' 빈칸에 알맞은 것은?", options: ["who", "which", "whose", "that"], answer: 2, difficulty: 3, points: 10, concept: "소유격 관계대명사"},
            {id: 9, question: "'I wish I ___ rich.' 빈칸에 알맞은 것은?", options: ["am", "was", "were", "be"], answer: 2, difficulty: 3, points: 10, concept: "I wish 가정법"},
            {id: 10, question: "'She said that she ___ busy.' 빈칸에 알맞은 것은?", options: ["is", "was", "were", "be"], answer: 1, difficulty: 3, points: 10, concept: "시제 일치"}
        ],
        
        국어: [
            {id: 1, question: "논설문의 구조는?", options: ["발단-전개-위기-절정-결말", "서론-본론-결론", "기-승-전-결", "초-중-종장"], answer: 1, difficulty: 1, points: 5, concept: "논설문"},
            {id: 2, question: "토론의 필수 요소가 아닌 것은?", options: ["주제", "근거", "감정", "반론"], answer: 2, difficulty: 1, points: 5, concept: "토론"},
            {id: 3, question: "비평문의 목적은?", options: ["감정 표현", "정보 전달", "작품 분석", "설득"], answer: 2, difficulty: 1, points: 5, concept: "비평문"},
            {id: 4, question: "'무궁화 삼천리 화려 강산'의 수사법은?", options: ["은유", "직유", "과장", "대유"], answer: 3, difficulty: 2, points: 7, concept: "수사법"},
            {id: 5, question: "한글의 창제 원리가 아닌 것은?", options: ["초성", "중성", "종성", "복성"], answer: 3, difficulty: 2, points: 7, concept: "한글"},
            {id: 6, question: "'소나기'의 주제는?", options: ["우정", "첫사랑", "가족애", "우애"], answer: 1, difficulty: 2, points: 7, concept: "소설"},
            {id: 7, question: "다음 중 '반어'의 예는?", options: ["참 잘했다 (빈정댐)", "매우 크다", "아주 작다", "정말 예쁘다"], answer: 0, difficulty: 2, points: 7, concept: "반어"},
            {id: 8, question: "'광화문 연가'의 갈래는?", options: ["시조", "가사", "자유시", "현대시"], answer: 3, difficulty: 3, points: 10, concept: "시"},
            {id: 9, question: "'허생전'의 작가는?", options: ["박지원", "정철", "김만중", "허균"], answer: 0, difficulty: 3, points: 10, concept: "고전 소설"},
            {id: 10, question: "매체 언어의 특성이 아닌 것은?", options: ["다양한 기호", "쌍방향 소통", "제한된 공간", "손글씨만 사용"], answer: 3, difficulty: 3, points: 10, concept: "매체"}
        ],
        
        사회: [
            {id: 1, question: "민주주의의 기본 원리가 아닌 것은?", options: ["국민 주권", "기본권 보장", "권력 분립", "독재"], answer: 3, difficulty: 1, points: 5, concept: "민주주의"},
            {id: 2, question: "시장 경제의 특징은?", options: ["계획 경제", "수요와 공급", "정부 통제", "배급제"], answer: 1, difficulty: 1, points: 5, concept: "시장 경제"},
            {id: 3, question: "우리나라의 국회는 몇 원제인가?", options: ["1원제", "2원제", "3원제", "4원제"], answer: 0, difficulty: 1, points: 5, concept: "국회"},
            {id: 4, question: "기본권의 종류가 아닌 것은?", options: ["자유권", "평등권", "참정권", "납세권"], answer: 3, difficulty: 2, points: 7, concept: "기본권"},
            {id: 5, question: "국제 연합(UN)의 주요 목적은?", options: ["경제 발전", "세계 평화", "무역 증진", "문화 교류"], answer: 1, difficulty: 2, points: 7, concept: "국제기구"},
            {id: 6, question: "수요가 증가하면 가격은?", options: ["상승", "하락", "변화 없음", "0"], answer: 0, difficulty: 2, points: 7, concept: "수요와 공급"},
            {id: 7, question: "대한민국 헌법의 최고 가치는?", options: ["경제", "국방", "인간 존엄", "교육"], answer: 2, difficulty: 2, points: 7, concept: "헌법"},
            {id: 8, question: "지속 가능한 발전의 핵심은?", options: ["경제 성장만", "환경 보호만", "경제+환경+사회", "인구 증가"], answer: 2, difficulty: 3, points: 10, concept: "지속 가능 발전"},
            {id: 9, question: "세계화의 문제점이 아닌 것은?", options: ["빈부 격차", "문화 획일화", "환경 파괴", "자급자족 증가"], answer: 3, difficulty: 3, points: 10, concept: "세계화"},
            {id: 10, question: "민주 정치의 발전 과정이 아닌 것은?", options: ["시민 혁명", "보통 선거", "삼권분립", "왕정 강화"], answer: 3, difficulty: 3, points: 10, concept: "민주 정치"}
        ],
        
        과학: [
            {id: 1, question: "화학 반응식에서 보존되는 것은?", options: ["질량", "부피", "온도", "압력"], answer: 0, difficulty: 1, points: 5, concept: "질량 보존"},
            {id: 2, question: "산과 염기가 반응하는 것은?", options: ["산화", "환원", "중화", "분해"], answer: 2, difficulty: 1, points: 5, concept: "중화 반응"},
            {id: 3, question: "유전 정보를 담고 있는 물질은?", options: ["단백질", "지방", "DNA", "물"], answer: 2, difficulty: 1, points: 5, concept: "유전"},
            {id: 4, question: "전기 분해에서 양극에 모이는 것은?", options: ["양이온", "음이온", "중성 입자", "전자"], answer: 1, difficulty: 2, points: 7, concept: "전기 분해"},
            {id: 5, question: "식물의 생장점이 있는 곳은?", options: ["잎", "줄기 끝", "뿌리 중간", "꽃"], answer: 1, difficulty: 2, points: 7, concept: "식물"},
            {id: 6, question: "작용 반작용의 법칙은?", options: ["관성의 법칙", "가속도의 법칙", "힘의 평형", "뉴턴 제3법칙"], answer: 3, difficulty: 2, points: 7, concept: "운동"},
            {id: 7, question: "태양계 행성 중 가장 큰 것은?", options: ["지구", "화성", "목성", "토성"], answer: 2, difficulty: 2, points: 7, concept: "태양계"},
            {id: 8, question: "효소의 특징이 아닌 것은?", options: ["촉매 역할", "단백질", "높은 온도에서 활성", "기질 특이성"], answer: 2, difficulty: 3, points: 10, concept: "효소"},
            {id: 9, question: "판의 경계 유형이 아닌 것은?", options: ["발산 경계", "수렴 경계", "보존 경계", "융합 경계"], answer: 3, difficulty: 3, points: 10, concept: "판구조론"},
            {id: 10, question: "별의 밝기를 나타내는 등급에서 숫자가 작을수록?", options: ["어둡다", "밝다", "멀다", "크다"], answer: 1, difficulty: 3, points: 10, concept: "별"}
        ]
    },
    
    // ==========================================
    // 고등학교 1학년 (grade: 4)
    // ==========================================
    4: {
        수학: [
            // 기초 (난이도: 1, 각 5점)
            {id: 1, question: "다항식 (x+2)(x+3)을 전개하면?", options: ["x²+5x+6", "x²+6x+5", "x²+5x+5", "x²+6"], answer: 0, difficulty: 1, points: 5, concept: "다항식의 곱셈"},
            {id: 2, question: "x²-9를 인수분해하면?", options: ["(x-3)(x-3)", "(x+3)(x+3)", "(x-3)(x+3)", "(x-9)(x+1)"], answer: 2, difficulty: 1, points: 5, concept: "인수분해"},
            {id: 3, question: "√25의 값은?", options: ["3", "4", "5", "6"], answer: 2, difficulty: 1, points: 5, concept: "제곱근"},
            
            // 중급 (난이도: 2, 각 7점)
            {id: 4, question: "이차방정식 x²-5x+6=0의 해는?", options: ["x=1,6", "x=2,3", "x=1,5", "x=2,4"], answer: 1, difficulty: 2, points: 7, concept: "이차방정식"},
            {id: 5, question: "이차함수 y=(x-1)²+2의 꼭짓점은?", options: ["(1,2)", "(-1,2)", "(1,-2)", "(2,1)"], answer: 0, difficulty: 2, points: 7, concept: "이차함수"},
            {id: 6, question: "부등식 2x+3>7의 해는?", options: ["x>2", "x<2", "x>5", "x<5"], answer: 0, difficulty: 2, points: 7, concept: "부등식"},
            {id: 7, question: "집합 A={1,2,3}, B={2,3,4}일 때, A∩B는?", options: ["{1,2,3,4}", "{2,3}", "{1}", "{4}"], answer: 1, difficulty: 2, points: 7, concept: "집합"},
            
            // 고급 (난이도: 3, 각 10점)
            {id: 8, question: "절댓값 방정식 |x-3|=5의 해는?", options: ["x=8", "x=-2", "x=8 또는 x=-2", "x=2"], answer: 2, difficulty: 3, points: 10, concept: "절댓값"},
            {id: 9, question: "무리수의 덧셈 √2+√8을 간단히 하면?", options: ["√10", "3√2", "2√2", "√16"], answer: 1, difficulty: 3, points: 10, concept: "무리수"},
            {id: 10, question: "이차함수 y=x²-4x+3의 최솟값은?", options: ["-1", "0", "1", "3"], answer: 0, difficulty: 3, points: 10, concept: "이차함수의 최대최소"}
        ],
        
        영어: [
            // 기초 (난이도: 1, 각 5점)
            {id: 1, question: "'I have lived here ___ 5 years.' 빈칸에 알맞은 것은?", options: ["since", "for", "during", "while"], answer: 1, difficulty: 1, points: 5, concept: "현재완료"},
            {id: 2, question: "'The book ___ is on the table is mine.' 빈칸에 알맞은 것은?", options: ["who", "which", "whose", "when"], answer: 1, difficulty: 1, points: 5, concept: "관계대명사"},
            {id: 3, question: "수동태: 'People speak English.' → 'English ___ by people.'", options: ["speaks", "spoke", "is spoken", "was spoken"], answer: 2, difficulty: 1, points: 5, concept: "수동태"},
            
            // 중급 (난이도: 2, 각 7점)
            {id: 4, question: "'If it ___ tomorrow, we will cancel the trip.' 빈칸에 알맞은 것은?", options: ["rain", "rains", "will rain", "rained"], answer: 1, difficulty: 2, points: 7, concept: "조건절"},
            {id: 5, question: "'She made me ___ the dishes.' 빈칸에 알맞은 것은?", options: ["wash", "to wash", "washing", "washed"], answer: 0, difficulty: 2, points: 7, concept: "사역동사"},
            {id: 6, question: "'I saw him ___ the piano.' 빈칸에 알맞은 것은?", options: ["play", "to play", "playing", "played"], answer: 2, difficulty: 2, points: 7, concept: "지각동사"},
            {id: 7, question: "'It is important ___ study hard.' 빈칸에 알맞은 것은?", options: ["for", "to", "of", "that"], answer: 1, difficulty: 2, points: 7, concept: "가주어"},
            
            // 고급 (난이도: 3, 각 10점)
            {id: 8, question: "'I wish I ___ rich.' 빈칸에 알맞은 것은?", options: ["am", "was", "were", "be"], answer: 2, difficulty: 3, points: 10, concept: "가정법 과거"},
            {id: 9, question: "'Having finished homework, he went out.' 이 문장의 분사구문 시제는?", options: ["현재", "과거", "완료", "미래"], answer: 2, difficulty: 3, points: 10, concept: "완료 분사구문"},
            {id: 10, question: "'The man ___ daughter is a doctor is my teacher.' 빈칸에 알맞은 것은?", options: ["who", "which", "whose", "that"], answer: 2, difficulty: 3, points: 10, concept: "소유격 관계대명사"}
        ],
        
        국어: [
            // 기초 (난이도: 1, 각 5점)
            {id: 1, question: "현대시의 3요소는?", options: ["운율-심상-비유", "인물-사건-배경", "기-승-전-결", "서론-본론-결론"], answer: 0, difficulty: 1, points: 5, concept: "현대시"},
            {id: 2, question: "소설의 3요소는?", options: ["운율-심상-비유", "인물-사건-배경", "주제-구성-문체", "발단-전개-결말"], answer: 1, difficulty: 1, points: 5, concept: "소설"},
            {id: 3, question: "논설문의 구조는?", options: ["발단-전개-위기-절정-결말", "서론-본론-결론", "기-승-전-결", "초-중-종장"], answer: 1, difficulty: 1, points: 5, concept: "논설문"},
            
            // 중급 (난이도: 2, 각 7점)
            {id: 4, question: "'님의 침묵'의 작가는?", options: ["윤동주", "한용운", "김소월", "정지용"], answer: 1, difficulty: 2, points: 7, concept: "현대시"},
            {id: 5, question: "수필의 특징이 아닌 것은?", options: ["자유로운 형식", "개성적 표현", "운문 형식", "일상적 소재"], answer: 2, difficulty: 2, points: 7, concept: "수필"},
            {id: 6, question: "설의법의 예는?", options: ["이것이 나인가?", "매우 크다", "빨간 장미", "높은 산"], answer: 0, difficulty: 2, points: 7, concept: "수사법"},
            {id: 7, question: "'무정'의 작가는?", options: ["이광수", "염상섭", "김동인", "현진건"], answer: 0, difficulty: 2, points: 7, concept: "현대소설"},
            
            // 고급 (난이도: 3, 각 10점)
            {id: 8, question: "역설법의 예는?", options: ["소리 없는 아우성", "빨간 장미", "높은 산", "맑은 하늘"], answer: 0, difficulty: 3, points: 10, concept: "수사법"},
            {id: 9, question: "'광장'의 작가는?", options: ["최인훈", "이청준", "황순원", "김승옥"], answer: 0, difficulty: 3, points: 10, concept: "현대소설"},
            {id: 10, question: "한글의 창제 원리인 '천지인' 삼재는?", options: ["ㄱㄴㄷ", "ㆍㅡㅣ", "ㅏㅓㅗ", "ㄱㅁㅅ"], answer: 1, difficulty: 3, points: 10, concept: "한글"}
        ],
        
        사회: [
            // 기초 (난이도: 1, 각 5점)
            {id: 1, question: "시장경제의 기본 원리는?", options: ["계획경제", "수요와 공급", "배급제", "통제경제"], answer: 1, difficulty: 1, points: 5, concept: "시장경제"},
            {id: 2, question: "대한민국 정부 형태는?", options: ["대통령제", "내각제", "이원집정부제", "군주제"], answer: 0, difficulty: 1, points: 5, concept: "정부형태"},
            {id: 3, question: "삼권분립의 세 권력은?", options: ["입법-행정-사법", "대통령-국회-법원", "중앙-지방-자치", "정당-언론-시민"], answer: 0, difficulty: 1, points: 5, concept: "삼권분립"},
            
            // 중급 (난이도: 2, 각 7점)
            {id: 4, question: "GDP는 무엇의 약자인가?", options: ["국민총생산", "국내총생산", "국민소득", "국내소득"], answer: 1, difficulty: 2, points: 7, concept: "경제지표"},
            {id: 5, question: "기본권의 종류가 아닌 것은?", options: ["자유권", "평등권", "재산권", "납세의무"], answer: 3, difficulty: 2, points: 7, concept: "기본권"},
            {id: 6, question: "인플레이션이란?", options: ["물가 상승", "물가 하락", "실업 증가", "경제 성장"], answer: 0, difficulty: 2, points: 7, concept: "경제현상"},
            {id: 7, question: "대한민국 국회의원 임기는?", options: ["3년", "4년", "5년", "6년"], answer: 1, difficulty: 2, points: 7, concept: "정치제도"},
            
            // 고급 (난이도: 3, 각 10점)
            {id: 8, question: "완전경쟁시장의 특징이 아닌 것은?", options: ["다수의 공급자", "동질적 상품", "진입장벽", "완전한 정보"], answer: 2, difficulty: 3, points: 10, concept: "시장구조"},
            {id: 9, question: "케인즈 경제학의 핵심은?", options: ["자유방임", "정부개입", "금본위제", "보호무역"], answer: 1, difficulty: 3, points: 10, concept: "경제이론"},
            {id: 10, question: "사회계약론을 주장한 사상가가 아닌 것은?", options: ["홉스", "로크", "루소", "애덤 스미스"], answer: 3, difficulty: 3, points: 10, concept: "정치사상"}
        ],
        
        과학: [
            // 기초 (난이도: 1, 각 5점)
            {id: 1, question: "운동량은 무엇과 무엇의 곱인가?", options: ["질량×속도", "힘×시간", "질량×가속도", "속도×시간"], answer: 0, difficulty: 1, points: 5, concept: "운동량"},
            {id: 2, question: "화학반응에서 보존되는 것은?", options: ["질량", "부피", "온도", "압력"], answer: 0, difficulty: 1, points: 5, concept: "질량보존"},
            {id: 3, question: "DNA의 구성 단위는?", options: ["아미노산", "뉴클레오타이드", "포도당", "지방산"], answer: 1, difficulty: 1, points: 5, concept: "DNA"},
            
            // 중급 (난이도: 2, 각 7점)
            {id: 4, question: "뉴턴의 운동 제1법칙은?", options: ["관성의 법칙", "가속도의 법칙", "작용반작용의 법칙", "만유인력의 법칙"], answer: 0, difficulty: 2, points: 7, concept: "운동법칙"},
            {id: 5, question: "산화란 무엇을 잃는 반응인가?", options: ["전자", "양성자", "중성자", "원자핵"], answer: 0, difficulty: 2, points: 7, concept: "산화환원"},
            {id: 6, question: "감수분열의 결과 염색체 수는?", options: ["2배", "같음", "1/2배", "4배"], answer: 2, difficulty: 2, points: 7, concept: "세포분열"},
            {id: 7, question: "지구의 자전 방향은?", options: ["동→서", "서→동", "남→북", "북→남"], answer: 1, difficulty: 2, points: 7, concept: "지구의 운동"},
            
            // 고급 (난이도: 3, 각 10점)
            {id: 8, question: "이상기체 상태방정식 PV=nRT에서 R은?", options: ["압력상수", "기체상수", "온도상수", "부피상수"], answer: 1, difficulty: 3, points: 10, concept: "기체법칙"},
            {id: 9, question: "멘델의 유전법칙이 아닌 것은?", options: ["우열의 법칙", "분리의 법칙", "독립의 법칙", "연관의 법칙"], answer: 3, difficulty: 3, points: 10, concept: "유전"},
            {id: 10, question: "별의 진화 과정에서 초신성 폭발 후 생성되는 것은?", options: ["백색왜성", "중성자별", "행성", "혜성"], answer: 1, difficulty: 3, points: 10, concept: "천체"}
        ]
    },
    
    // ==========================================
    // 고등학교 2학년 (grade: 5)
    // ==========================================
    5: {
        수학: [
            // 기초
            {id: 1, question: "등차수열 2,5,8,11,...의 공차는?", options: ["2", "3", "4", "5"], answer: 1, difficulty: 1, points: 5, concept: "등차수열"},
            {id: 2, question: "등비수열 2,6,18,...의 공비는?", options: ["2", "3", "4", "6"], answer: 1, difficulty: 1, points: 5, concept: "등비수열"},
            {id: 3, question: "log₂8의 값은?", options: ["2", "3", "4", "8"], answer: 1, difficulty: 1, points: 5, concept: "로그"},
            
            // 중급
            {id: 4, question: "삼각형 ABC에서 sin²A+cos²A의 값은?", options: ["0", "1", "2", "sinA"], answer: 1, difficulty: 2, points: 7, concept: "삼각함수"},
            {id: 5, question: "수열의 합 Σ(k=1 to 5) k의 값은?", options: ["10", "15", "20", "25"], answer: 1, difficulty: 2, points: 7, concept: "수열의 합"},
            {id: 6, question: "지수법칙 2³×2⁴의 값은?", options: ["2⁷", "2¹²", "4⁷", "8⁴"], answer: 0, difficulty: 2, points: 7, concept: "지수"},
            {id: 7, question: "원의 방정식 x²+y²=9의 반지름은?", options: ["3", "6", "9", "81"], answer: 0, difficulty: 2, points: 7, concept: "원의 방정식"},
            
            // 고급
            {id: 8, question: "극한 lim(x→∞) (2x+1)/(x+2)의 값은?", options: ["0", "1", "2", "∞"], answer: 2, difficulty: 3, points: 10, concept: "극한"},
            {id: 9, question: "미분 d/dx(x³)의 값은?", options: ["x²", "2x²", "3x²", "3x"], answer: 2, difficulty: 3, points: 10, concept: "미분"},
            {id: 10, question: "벡터 (1,2)·(3,4)의 내적은?", options: ["7", "10", "11", "14"], answer: 2, difficulty: 3, points: 10, concept: "벡터"}
        ],
        
        영어: [
            // 기초
            {id: 1, question: "'He suggested ___ early.' 빈칸에 알맞은 것은?", options: ["leave", "to leave", "leaving", "left"], answer: 2, difficulty: 1, points: 5, concept: "동명사"},
            {id: 2, question: "'This is the house ___ I was born.' 빈칸에 알맞은 것은?", options: ["which", "where", "when", "that"], answer: 1, difficulty: 1, points: 5, concept: "관계부사"},
            {id: 3, question: "'Not only A but also B' 구문에서 동사는 무엇에 일치하나?", options: ["A", "B", "둘 다", "단수"], answer: 1, difficulty: 1, points: 5, concept: "상관접속사"},
            
            // 중급
            {id: 4, question: "'If I had known, I ___ you.' 빈칸에 알맞은 것은?", options: ["tell", "told", "would tell", "would have told"], answer: 3, difficulty: 2, points: 7, concept: "가정법 과거완료"},
            {id: 5, question: "'The work ___ by tomorrow.' 빈칸에 알맞은 것은?", options: ["must finish", "must be finished", "must finishing", "must to finish"], answer: 1, difficulty: 2, points: 7, concept: "조동사 수동태"},
            {id: 6, question: "'She is said ___ rich.' 빈칸에 알맞은 것은?", options: ["be", "to be", "being", "been"], answer: 1, difficulty: 2, points: 7, concept: "to부정사"},
            {id: 7, question: "'What he said was true.' 이 문장에서 What은?", options: ["의문사", "관계대명사", "접속사", "지시대명사"], answer: 1, difficulty: 2, points: 7, concept: "관계대명사 what"},
            
            // 고급
            {id: 8, question: "'Were it not for water, we could not live.' 이 문장의 가정법 종류는?", options: ["가정법 과거", "가정법 과거완료", "가정법 미래", "혼합 가정법"], answer: 0, difficulty: 3, points: 10, concept: "도치 가정법"},
            {id: 9, question: "'It was not until 2000 that he came back.' 강조 구문의 의미는?", options: ["2000년에 돌아왔다", "2000년까지 안 돌아왔다", "2000년 전에 돌아왔다", "2000년부터 돌아왔다"], answer: 1, difficulty: 3, points: 10, concept: "강조구문"},
            {id: 10, question: "'He is anything but smart.' 의 의미는?", options: ["매우 똑똑하다", "전혀 똑똑하지 않다", "조금 똑똑하다", "똑똑할 수도 있다"], answer: 1, difficulty: 3, points: 10, concept: "관용표현"}
        ],
        
        국어: [
            // 기초
            {id: 1, question: "'운수 좋은 날'의 작가는?", options: ["현진건", "김유정", "이상", "채만식"], answer: 0, difficulty: 1, points: 5, concept: "현대소설"},
            {id: 2, question: "고전소설 '춘향전'의 갈래는?", options: ["군담소설", "판소리계 소설", "역사소설", "전기소설"], answer: 1, difficulty: 1, points: 5, concept: "고전소설"},
            {id: 3, question: "현대시 '진달래꽃'의 작가는?", options: ["김소월", "윤동주", "서정주", "정지용"], answer: 0, difficulty: 1, points: 5, concept: "현대시"},
            
            // 중급
            {id: 4, question: "'삼포 가는 길'의 작가는?", options: ["황석영", "조세희", "이청준", "박완서"], answer: 0, difficulty: 2, points: 7, concept: "현대소설"},
            {id: 5, question: "중세국어의 특징이 아닌 것은?", options: ["방점", "아래아(ㆍ)", "띄어쓰기", "이어적기"], answer: 2, difficulty: 2, points: 7, concept: "국어사"},
            {id: 6, question: "'관동별곡'의 작가는?", options: ["정철", "박인로", "윤선도", "송순"], answer: 0, difficulty: 2, points: 7, concept: "고전시가"},
            {id: 7, question: "비평문의 구성이 아닌 것은?", options: ["작품 소개", "분석", "평가", "창작"], answer: 3, difficulty: 2, points: 7, concept: "비평문"},
            
            // 고급
            {id: 8, question: "'박씨전'에 나타난 주제 의식은?", options: ["신분 제도 비판", "전쟁 극복 의지", "충효 사상", "권선징악"], answer: 1, difficulty: 3, points: 10, concept: "고전소설"},
            {id: 9, question: "'민족의 노래'를 지은 시인은?", options: ["신동엽", "김지하", "고은", "김수영"], answer: 0, difficulty: 3, points: 10, concept: "현대시"},
            {id: 10, question: "훈민정음 창제 원리 중 가획의 원리는?", options: ["ㄱ→ㅋ", "ㅏ→ㅑ", "ㅂ→ㅍ", "모두"], answer: 3, difficulty: 3, points: 10, concept: "훈민정음"}
        ],
        
        사회: [
            // 기초
            {id: 1, question: "수요의 가격 탄력성이 크다는 것은?", options: ["가격에 민감", "가격에 둔감", "수요 불변", "공급 증가"], answer: 0, difficulty: 1, points: 5, concept: "수요탄력성"},
            {id: 2, question: "독점시장의 특징은?", options: ["다수 공급자", "한 명의 공급자", "완전경쟁", "자유진입"], answer: 1, difficulty: 1, points: 5, concept: "시장구조"},
            {id: 3, question: "법치주의의 핵심은?", options: ["권력분립", "법에 의한 지배", "국민주권", "기본권 보장"], answer: 1, difficulty: 1, points: 5, concept: "법치주의"},
            
            // 중급
            {id: 4, question: "통화량 증가의 효과는?", options: ["물가 상승", "물가 하락", "실업 증가", "환율 상승만"], answer: 0, difficulty: 2, points: 7, concept: "통화정책"},
            {id: 5, question: "외부효과의 예가 아닌 것은?", options: ["환경오염", "교육", "국방", "개인소비"], answer: 3, difficulty: 2, points: 7, concept: "시장실패"},
            {id: 6, question: "대한민국 헌법 개정은 몇 분의 몇 찬성이 필요한가?", options: ["1/2", "2/3", "3/4", "만장일치"], answer: 1, difficulty: 2, points: 7, concept: "헌법"},
            {id: 7, question: "경제성장률은 무엇의 증가율인가?", options: ["물가", "GDP", "인구", "수출"], answer: 1, difficulty: 2, points: 7, concept: "경제성장"},
            
            // 고급
            {id: 8, question: "필립스 곡선이 나타내는 관계는?", options: ["실업률-물가상승률", "이자율-투자", "소득-소비", "수출-수입"], answer: 0, difficulty: 3, points: 10, concept: "거시경제"},
            {id: 9, question: "로렌츠 곡선이 나타내는 것은?", options: ["경제성장", "소득분배", "물가수준", "무역수지"], answer: 1, difficulty: 3, points: 10, concept: "분배"},
            {id: 10, question: "국제연합(UN) 안전보장이사회 상임이사국 수는?", options: ["3개국", "5개국", "7개국", "10개국"], answer: 1, difficulty: 3, points: 10, concept: "국제기구"}
        ],
        
        과학: [
            // 기초
            {id: 1, question: "세포호흡의 최종 산물은?", options: ["산소", "이산화탄소", "물", "이산화탄소와 물"], answer: 3, difficulty: 1, points: 5, concept: "세포호흡"},
            {id: 2, question: "전류의 방향은?", options: ["+→-", "-→+", "양쪽", "없음"], answer: 0, difficulty: 1, points: 5, concept: "전류"},
            {id: 3, question: "화학반응식에서 계수의 의미는?", options: ["질량비", "몰비", "부피비", "농도비"], answer: 1, difficulty: 1, points: 5, concept: "화학반응식"},
            
            // 중급
            {id: 4, question: "작용 반작용 법칙은 뉴턴 제몇 법칙인가?", options: ["제1법칙", "제2법칙", "제3법칙", "제4법칙"], answer: 2, difficulty: 2, points: 7, concept: "운동법칙"},
            {id: 5, question: "산화수가 증가하는 반응은?", options: ["산화", "환원", "중화", "분해"], answer: 0, difficulty: 2, points: 7, concept: "산화환원"},
            {id: 6, question: "멘델의 분리의 법칙이 적용되는 것은?", options: ["체세포분열", "감수분열", "수정", "발생"], answer: 1, difficulty: 2, points: 7, concept: "유전"},
            {id: 7, question: "판의 경계 중 새로운 지각이 생성되는 곳은?", options: ["발산경계", "수렴경계", "보존경계", "변환경계"], answer: 0, difficulty: 2, points: 7, concept: "판구조론"},
            
            // 고급
            {id: 8, question: "광전효과에서 빛의 성질은?", options: ["파동성", "입자성", "둘 다", "없음"], answer: 1, difficulty: 3, points: 10, concept: "현대물리"},
            {id: 9, question: "DNA 복제에서 사용되는 효소는?", options: ["DNA 중합효소", "RNA 중합효소", "제한효소", "연결효소만"], answer: 0, difficulty: 3, points: 10, concept: "DNA"},
            {id: 10, question: "우주의 팽창을 발견한 법칙은?", options: ["케플러 법칙", "뉴턴 법칙", "허블 법칙", "아인슈타인 법칙"], answer: 2, difficulty: 3, points: 10, concept: "우주"}
        ]
    },
    
    // ==========================================
    // 고등학교 3학년 (grade: 6)
    // ==========================================
    6: {
        수학: [
            // 기초
            {id: 1, question: "적분 ∫x dx의 값은?", options: ["x", "x²", "x²/2", "x³/3"], answer: 2, difficulty: 1, points: 5, concept: "적분"},
            {id: 2, question: "정규분포의 그래프 모양은?", options: ["일직선", "종 모양", "U자형", "포물선"], answer: 1, difficulty: 1, points: 5, concept: "통계"},
            {id: 3, question: "공간좌표 (1,2,3)에서 z좌표는?", options: ["1", "2", "3", "6"], answer: 2, difficulty: 1, points: 5, concept: "공간좌표"},
            
            // 중급
            {id: 4, question: "도함수 f'(x)가 0이 되는 점에서 함수는?", options: ["불연속", "극값 가능", "증가", "감소"], answer: 1, difficulty: 2, points: 7, concept: "미분"},
            {id: 5, question: "정적분 ∫(0 to 1) x dx의 값은?", options: ["1/2", "1", "2", "0"], answer: 0, difficulty: 2, points: 7, concept: "정적분"},
            {id: 6, question: "확률변수 X의 기댓값 E(X+3)은?", options: ["E(X)", "E(X)+3", "3E(X)", "E(X)/3"], answer: 1, difficulty: 2, points: 7, concept: "확률"},
            {id: 7, question: "행렬 A의 역행렬이 존재하는 조건은?", options: ["det(A)=0", "det(A)≠0", "A=0", "A=I"], answer: 1, difficulty: 2, points: 7, concept: "행렬"},
            
            // 고급
            {id: 8, question: "미분방정식 dy/dx=y의 일반해는?", options: ["y=ex", "y=Cex", "y=x", "y=Cx"], answer: 1, difficulty: 3, points: 10, concept: "미분방정식"},
            {id: 9, question: "이항정리에서 (a+b)ⁿ 전개식의 항의 개수는?", options: ["n", "n+1", "2n", "2ⁿ"], answer: 1, difficulty: 3, points: 10, concept: "이항정리"},
            {id: 10, question: "평면 벡터 (a,b)에 수직인 벡터는?", options: ["(a,b)", "(b,a)", "(-b,a)", "(a,-b)"], answer: 2, difficulty: 3, points: 10, concept: "벡터"}
        ],
        
        영어: [
            // 기초
            {id: 1, question: "'Having been tired, he went to bed.' 분사구문의 시제는?", options: ["현재", "과거", "완료", "미래"], answer: 2, difficulty: 1, points: 5, concept: "분사구문"},
            {id: 2, question: "'No sooner A than B' 구문의 의미는?", options: ["A보다 B", "A하자마자 B", "A가 아니라 B", "A 또는 B"], answer: 1, difficulty: 1, points: 5, concept: "상관접속사"},
            {id: 3, question: "'should have p.p.' 구문의 의미는?", options: ["~했어야 했다", "~해야 한다", "~했을 것이다", "~하고 있다"], answer: 0, difficulty: 1, points: 5, concept: "조동사 완료"},
            
            // 중급
            {id: 4, question: "'It is no use crying.' 에서 it이 가리키는 것은?", options: ["crying", "use", "no", "문장 전체"], answer: 0, difficulty: 2, points: 7, concept: "가주어"},
            {id: 5, question: "'The more, the better' 구문의 문법은?", options: ["비교급", "최상급", "원급", "혼합"], answer: 0, difficulty: 2, points: 7, concept: "비교구문"},
            {id: 6, question: "'as if 가정법' 구문에서 현재 사실의 반대는?", options: ["as if + 현재", "as if + 과거", "as if + 과거완료", "as if + 미래"], answer: 1, difficulty: 2, points: 7, concept: "가정법"},
            {id: 7, question: "'used to'와 'would'의 차이점은?", options: ["시제", "상태동사", "의미", "형태"], answer: 1, difficulty: 2, points: 7, concept: "조동사"},
            
            // 고급
            {id: 8, question: "'Hardly had he arrived when it rained.' 도치 구문의 시제는?", options: ["과거", "과거완료", "현재완료", "미래완료"], answer: 1, difficulty: 3, points: 10, concept: "도치"},
            {id: 9, question: "'so ~ that 구문'에서 so 다음에 올 수 없는 것은?", options: ["형용사", "부사", "명사", "동사"], answer: 3, difficulty: 3, points: 10, concept: "접속사"},
            {id: 10, question: "'whether A or B' 구문에서 동사는?", options: ["A에 일치", "B에 일치", "단수", "복수"], answer: 1, difficulty: 3, points: 10, concept: "상관접속사"}
        ],
        
        국어: [
            // 기초
            {id: 1, question: "'토지'의 작가는?", options: ["박경리", "이문열", "조정래", "황석영"], answer: 0, difficulty: 1, points: 5, concept: "현대소설"},
            {id: 2, question: "'서동요'는 어느 시대 작품인가?", options: ["고려시대", "조선시대", "신라시대", "현대"], answer: 2, difficulty: 1, points: 5, concept: "고전시가"},
            {id: 3, question: "희곡의 3요소는?", options: ["대사-지문-무대", "인물-사건-배경", "발단-전개-결말", "기승전결"], answer: 0, difficulty: 1, points: 5, concept: "희곡"},
            
            // 중급
            {id: 4, question: "'태평천하'의 작가는?", options: ["염상섭", "채만식", "이상", "김동인"], answer: 1, difficulty: 2, points: 7, concept: "현대소설"},
            {id: 5, question: "'용비어천가'의 형식은?", options: ["시조", "가사", "악장", "속요"], answer: 2, difficulty: 2, points: 7, concept: "고전시가"},
            {id: 6, question: "판소리 다섯 마당이 아닌 것은?", options: ["춘향가", "심청가", "흥부가", "배비장가"], answer: 3, difficulty: 2, points: 7, concept: "판소리"},
            {id: 7, question: "'광야'를 쓴 시인은?", options: ["이육사", "윤동주", "서정주", "김소월"], answer: 0, difficulty: 2, points: 7, concept: "현대시"},
            
            // 고급
            {id: 8, question: "'만세전'의 작가는?", options: ["염상섭", "이광수", "김동인", "현진건"], answer: 0, difficulty: 3, points: 10, concept: "현대소설"},
            {id: 9, question: "판소리 '수궁가'의 다른 이름은?", options: ["토끼전", "별주부전", "토생전", "모두"], answer: 3, difficulty: 3, points: 10, concept: "고전문학"},
            {id: 10, question: "'한글맞춤법'의 대원칙은?", options: ["소리대로", "어법에 맞도록", "쉽게", "간단하게"], answer: 1, difficulty: 3, points: 10, concept: "한글맞춤법"}
        ],
        
        사회: [
            // 기초
            {id: 1, question: "비교우위론을 주장한 경제학자는?", options: ["애덤 스미스", "리카도", "케인즈", "맑스"], answer: 1, difficulty: 1, points: 5, concept: "무역이론"},
            {id: 2, question: "환율 상승의 효과는?", options: ["수출 증가", "수입 증가", "물가 하락", "경기 둔화"], answer: 0, difficulty: 1, points: 5, concept: "환율"},
            {id: 3, question: "대한민국 대통령 임기는?", options: ["3년", "4년", "5년", "6년"], answer: 2, difficulty: 1, points: 5, concept: "정치제도"},
            
            // 중급
            {id: 4, question: "완전고용 GDP는 다음 중 어느 것인가?", options: ["명목GDP", "실질GDP", "잠재GDP", "국민GDP"], answer: 2, difficulty: 2, points: 7, concept: "거시경제"},
            {id: 5, question: "재정정책의 수단이 아닌 것은?", options: ["세금", "정부지출", "공채 발행", "금리 조절"], answer: 3, difficulty: 2, points: 7, concept: "재정정책"},
            {id: 6, question: "WTO의 주요 기능은?", options: ["환율 안정", "무역 자유화", "경제 원조", "개발 지원"], answer: 1, difficulty: 2, points: 7, concept: "국제기구"},
            {id: 7, question: "중앙은행의 통화정책 수단이 아닌 것은?", options: ["공개시장조작", "지급준비율", "재할인율", "법인세율"], answer: 3, difficulty: 2, points: 7, concept: "통화정책"},
            
            // 고급
            {id: 8, question: "IS-LM 모형에서 IS곡선은?", options: ["화폐시장", "재화시장", "외환시장", "노동시장"], answer: 1, difficulty: 3, points: 10, concept: "거시경제모형"},
            {id: 9, question: "구축효과(crowding out)가 발생하는 경우는?", options: ["재정정책 확대", "통화정책 확대", "수출 증가", "소비 증가"], answer: 0, difficulty: 3, points: 10, concept: "재정정책"},
            {id: 10, question: "헥셔-올린 정리가 설명하는 것은?", options: ["절대우위", "비교우위", "요소부존", "규모의 경제"], answer: 2, difficulty: 3, points: 10, concept: "무역이론"}
        ],
        
        과학: [
            // 기초
            {id: 1, question: "열역학 제1법칙은?", options: ["에너지 보존", "엔트로피 증가", "절대온도", "열평형"], answer: 0, difficulty: 1, points: 5, concept: "열역학"},
            {id: 2, question: "DNA의 구조를 발견한 과학자는?", options: ["멘델", "왓슨과 크릭", "다윈", "파스퇴르"], answer: 1, difficulty: 1, points: 5, concept: "DNA"},
            {id: 3, question: "전자기파 중 파장이 가장 긴 것은?", options: ["가시광선", "자외선", "적외선", "전파"], answer: 3, difficulty: 1, points: 5, concept: "전자기파"},
            
            // 중급
            {id: 4, question: "카르노 사이클의 효율은?", options: ["100%", "항상 100% 미만", "0%", "온도에 무관"], answer: 1, difficulty: 2, points: 7, concept: "열역학"},
            {id: 5, question: "유전자 발현의 중심 원리는?", options: ["DNA→RNA→단백질", "RNA→DNA→단백질", "단백질→DNA→RNA", "DNA→단백질→RNA"], answer: 0, difficulty: 2, points: 7, concept: "분자생물학"},
            {id: 6, question: "전자의 파동성을 나타내는 것은?", options: ["광전효과", "간섭", "방사능", "핵분열"], answer: 1, difficulty: 2, points: 7, concept: "양자역학"},
            {id: 7, question: "진화의 증거가 아닌 것은?", options: ["화석", "상동기관", "발생", "광합성"], answer: 3, difficulty: 2, points: 7, concept: "진화"},
            
            // 고급
            {id: 8, question: "불확정성 원리를 발표한 과학자는?", options: ["보어", "하이젠베르크", "슈뢰딩거", "플랑크"], answer: 1, difficulty: 3, points: 10, concept: "양자역학"},
            {id: 9, question: "PCR 기술의 원리는?", options: ["DNA 절단", "DNA 증폭", "DNA 염기서열 분석", "DNA 합성"], answer: 1, difficulty: 3, points: 10, concept: "생명공학"},
            {id: 10, question: "우주의 나이는 약 몇 년인가?", options: ["46억년", "138억년", "1000억년", "무한대"], answer: 1, difficulty: 3, points: 10, concept: "우주론"}
        ]
    }
};

// 수준 판정 기준 (총점 기준 - 50문제 기준으로 조정)
// 총점: 기초 15문제(5점) + 중급 21문제(7점) + 고급 14문제(10점) = 75 + 147 + 140 = 362점
const levelCriteria = {
    beginner: { min: 0, max: 200, label: "기초", description: "기본 개념부터 차근차근" },
    intermediate: { min: 201, max: 280, label: "중급", description: "표준 교과 과정" },
    advanced: { min: 281, max: 362, label: "고급", description: "심화 학습 권장" }
};

// 진단평가 문제 가져오기
function getDiagnosticTest(grade, subject) {
    if (!diagnosticTestDB[grade] || !diagnosticTestDB[grade][subject]) {
        console.error(`진단평가 문제를 찾을 수 없습니다: 학년=${grade}, 과목=${subject}`);
        return [];
    }
    
    return diagnosticTestDB[grade][subject];
}

// 모든 과목의 진단평가 문제 가져오기 (50문제)
function getAllDiagnosticTests(grade) {
    const subjects = ['수학', '영어', '국어', '사회', '과학'];
    let allTests = [];
    
    subjects.forEach(subject => {
        const tests = getDiagnosticTest(grade, subject);
        if (tests && tests.length > 0) {
            // 과목 정보 추가
            tests.forEach(test => {
                test.subject = subject;
            });
            allTests = allTests.concat(tests);
        }
    });
    
    return allTests;
}

// 수준 판정
function determineLevel(totalScore) {
    if (totalScore >= levelCriteria.advanced.min) return 'advanced';
    if (totalScore >= levelCriteria.intermediate.min) return 'intermediate';
    return 'beginner';
}
