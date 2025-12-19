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
            // 기초 (난이도: 1, 각 5점)
            {id: 1, question: "다음 중 소수가 아닌 것은?", options: ["2", "3", "4", "5"], answer: 2, difficulty: 1, points: 5, concept: "소수의 정의"},
            {id: 2, question: "12의 약수가 아닌 것은?", options: ["1", "2", "5", "6"], answer: 2, difficulty: 1, points: 5, concept: "약수 구하기"},
            {id: 3, question: "(-3) + 5의 값은?", options: ["-8", "-2", "2", "8"], answer: 2, difficulty: 1, points: 5, concept: "정수의 덧셈"},
            
            // 중급 (난이도: 2, 각 7점)
            {id: 4, question: "60을 소인수분해하면?", options: ["2² × 3 × 5", "2 × 3² × 5", "2² × 15", "4 × 15"], answer: 0, difficulty: 2, points: 7, concept: "소인수분해"},
            {id: 5, question: "12와 18의 최대공약수는?", options: ["2", "3", "6", "36"], answer: 2, difficulty: 2, points: 7, concept: "최대공약수"},
            {id: 6, question: "(-5) - (-3)의 값은?", options: ["-8", "-2", "2", "8"], answer: 1, difficulty: 2, points: 7, concept: "정수의 뺄셈"},
            {id: 7, question: "x = 3일 때, 2x + 1의 값은?", options: ["5", "6", "7", "8"], answer: 2, difficulty: 2, points: 7, concept: "문자와 식"},
            
            // 고급 (난이도: 3, 각 10점)
            {id: 8, question: "48과 72의 최소공배수는?", options: ["24", "96", "144", "288"], answer: 2, difficulty: 3, points: 10, concept: "최소공배수"},
            {id: 9, question: "3(x - 2) = 2(x + 1)일 때, x의 값은?", options: ["4", "6", "8", "10"], answer: 2, difficulty: 3, points: 10, concept: "일차방정식"},
            {id: 10, question: "x : y = 2 : 3이고 x + y = 15일 때, x의 값은?", options: ["3", "6", "9", "12"], answer: 1, difficulty: 3, points: 10, concept: "비와 비율"}
        ],
        
        영어: [
            // 기초 (난이도: 1, 각 5점)
            {id: 1, question: "'I ___ a student.' 빈칸에 알맞은 것은?", options: ["am", "is", "are", "be"], answer: 0, difficulty: 1, points: 5, concept: "be동사"},
            {id: 2, question: "'She ___ a teacher.' 빈칸에 알맞은 것은?", options: ["am", "is", "are", "be"], answer: 1, difficulty: 1, points: 5, concept: "3인칭 단수"},
            {id: 3, question: "다음 중 복수형이 틀린 것은?", options: ["books", "childs", "boxes", "tomatoes"], answer: 1, difficulty: 1, points: 5, concept: "명사 복수형"},
            
            // 중급 (난이도: 2, 각 7점)
            {id: 4, question: "'___ you like pizza?' 빈칸에 알맞은 것은?", options: ["Do", "Does", "Are", "Is"], answer: 0, difficulty: 2, points: 7, concept: "일반동사 의문문"},
            {id: 5, question: "'I am reading a book now.' 이 문장의 시제는?", options: ["현재", "과거", "현재진행", "미래"], answer: 2, difficulty: 2, points: 7, concept: "현재진행형"},
            {id: 6, question: "'She ___ to school yesterday.' 빈칸에 알맞은 것은?", options: ["go", "goes", "went", "going"], answer: 2, difficulty: 2, points: 7, concept: "과거시제"},
            {id: 7, question: "'There ___ many students.' 빈칸에 알맞은 것은?", options: ["is", "are", "am", "be"], answer: 1, difficulty: 2, points: 7, concept: "There is/are"},
            
            // 고급 (난이도: 3, 각 10점)
            {id: 8, question: "'I have ___ here for 5 years.' 빈칸에 알맞은 것은?", options: ["live", "lives", "lived", "living"], answer: 2, difficulty: 3, points: 10, concept: "현재완료"},
            {id: 9, question: "'She asked me ___ the door.' 빈칸에 알맞은 것은?", options: ["close", "to close", "closing", "closed"], answer: 1, difficulty: 3, points: 10, concept: "to부정사"},
            {id: 10, question: "'The boy ___ is playing is my brother.' 빈칸에 알맞은 것은?", options: ["who", "which", "whose", "when"], answer: 0, difficulty: 3, points: 10, concept: "관계대명사"}
        ],
        
        국어: [
            // 기초 (난이도: 1, 각 5점)
            {id: 1, question: "'빨갛다'의 품사는?", options: ["명사", "동사", "형용사", "부사"], answer: 2, difficulty: 1, points: 5, concept: "품사"},
            {id: 2, question: "'먹다'를 과거형으로 바꾸면?", options: ["먹었다", "먹는다", "먹을다", "먹니다"], answer: 0, difficulty: 1, points: 5, concept: "시제"},
            {id: 3, question: "다음 중 높임 표현이 아닌 것은?", options: ["드시다", "계시다", "먹다", "주무시다"], answer: 2, difficulty: 1, points: 5, concept: "높임법"},
            
            // 중급 (난이도: 2, 각 7점)
            {id: 4, question: "'하늘이 파랗다'에서 주어는?", options: ["하늘이", "파랗다", "하늘", "이"], answer: 0, difficulty: 2, points: 7, concept: "문장 성분"},
            {id: 5, question: "다음 중 사동 표현은?", options: ["먹다", "먹이다", "먹히다", "먹거나"], answer: 1, difficulty: 2, points: 7, concept: "사동/피동"},
            {id: 6, question: "'은유법'의 예로 적절한 것은?", options: ["내 마음은 호수요", "너처럼 예쁜", "매우 아름다운", "꽃이 피었다"], answer: 0, difficulty: 2, points: 7, concept: "비유법"},
            {id: 7, question: "다음 중 관형어는?", options: ["매우", "빨리", "예쁜", "천천히"], answer: 2, difficulty: 2, points: 7, concept: "문장 성분"},
            
            // 고급 (난이도: 3, 각 10점)
            {id: 8, question: "'역설법'의 예로 적절한 것은?", options: ["소리 없는 아우성", "빨간 장미", "높은 산", "맑은 하늘"], answer: 0, difficulty: 3, points: 10, concept: "표현법"},
            {id: 9, question: "시조의 형식은?", options: ["초장-중장-종장", "기-승-전-결", "서-본-결", "발단-전개-위기-절정-결말"], answer: 0, difficulty: 3, points: 10, concept: "시조"},
            {id: 10, question: "'춘향전'의 갈래는?", options: ["서사시", "판소리계 소설", "수필", "희곡"], answer: 1, difficulty: 3, points: 10, concept: "문학 갈래"}
        ],
        
        사회: [
            // 기초 (난이도: 1, 각 5점)
            {id: 1, question: "위도 0도를 무엇이라 하는가?", options: ["북극", "남극", "적도", "자오선"], answer: 2, difficulty: 1, points: 5, concept: "위도와 경도"},
            {id: 2, question: "우리나라의 수도는?", options: ["부산", "서울", "인천", "대구"], answer: 1, difficulty: 1, points: 5, concept: "한국 지리"},
            {id: 3, question: "사막 기후의 특징은?", options: ["비가 많다", "눈이 많다", "매우 건조하다", "항상 춥다"], answer: 2, difficulty: 1, points: 5, concept: "기후"},
            
            // 중급 (난이도: 2, 각 7점)
            {id: 4, question: "열대 기후 지역의 주요 작물은?", options: ["쌀", "밀", "바나나", "감자"], answer: 2, difficulty: 2, points: 7, concept: "열대 기후"},
            {id: 5, question: "우리나라의 4계절 구분은?", options: ["봄, 여름, 가을, 겨울", "건기, 우기", "여름, 겨울", "3계절"], answer: 0, difficulty: 2, points: 7, concept: "계절"},
            {id: 6, question: "지도에서 축척이 크면?", options: ["넓은 지역을 보여준다", "자세히 보여준다", "작게 보여준다", "색이 진하다"], answer: 1, difficulty: 2, points: 7, concept: "지도"},
            {id: 7, question: "온대 기후의 특징은?", options: ["1년 내내 덥다", "4계절이 뚜렷하다", "매우 춥다", "비가 안 온다"], answer: 1, difficulty: 2, points: 7, concept: "온대 기후"},
            
            // 고급 (난이도: 3, 각 10점)
            {id: 8, question: "경도 180도 선을 무엇이라 하는가?", options: ["본초 자오선", "적도", "날짜 변경선", "북회귀선"], answer: 2, difficulty: 3, points: 10, concept: "경도"},
            {id: 9, question: "한대 기후 지역의 생활 모습은?", options: ["벼농사", "목축업", "순록 유목", "과일 재배"], answer: 2, difficulty: 3, points: 10, concept: "한대 기후"},
            {id: 10, question: "세계 최대 사막은?", options: ["고비 사막", "사하라 사막", "칼라하리 사막", "아타카마 사막"], answer: 1, difficulty: 3, points: 10, concept: "세계 지리"}
        ],
        
        과학: [
            // 기초 (난이도: 1, 각 5점)
            {id: 1, question: "물의 끓는점은?", options: ["0℃", "50℃", "100℃", "200℃"], answer: 2, difficulty: 1, points: 5, concept: "물의 상태 변화"},
            {id: 2, question: "광합성을 하는 세포 소기관은?", options: ["핵", "엽록체", "미토콘드리아", "리보솜"], answer: 1, difficulty: 1, points: 5, concept: "광합성"},
            {id: 3, question: "지구의 공전 주기는?", options: ["1일", "1개월", "1년", "10년"], answer: 2, difficulty: 1, points: 5, concept: "지구의 운동"},
            
            // 중급 (난이도: 2, 각 7점)
            {id: 4, question: "산성 용액의 pH는?", options: ["7보다 크다", "7보다 작다", "7이다", "0이다"], answer: 1, difficulty: 2, points: 7, concept: "산과 염기"},
            {id: 5, question: "식물 세포에만 있는 것은?", options: ["핵", "세포막", "세포벽", "세포질"], answer: 2, difficulty: 2, points: 7, concept: "세포"},
            {id: 6, question: "지진의 진원지로부터 가장 먼 곳은?", options: ["진앙", "진원", "단층", "판"], answer: 0, difficulty: 2, points: 7, concept: "지진"},
            {id: 7, question: "혼합물을 분리하는 방법이 아닌 것은?", options: ["증류", "여과", "크로마토그래피", "중화"], answer: 3, difficulty: 2, points: 7, concept: "혼합물 분리"},
            
            // 고급 (난이도: 3, 각 10점)
            {id: 8, question: "광합성의 결과 생성되는 기체는?", options: ["산소", "이산화탄소", "질소", "수소"], answer: 0, difficulty: 3, points: 10, concept: "광합성 산물"},
            {id: 9, question: "암석의 종류가 아닌 것은?", options: ["화성암", "변성암", "퇴적암", "풍화암"], answer: 3, difficulty: 3, points: 10, concept: "암석"},
            {id: 10, question: "달의 위상 변화 원인은?", options: ["지구 자전", "달 자전", "달 공전", "태양 공전"], answer: 2, difficulty: 3, points: 10, concept: "달의 위상"}
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
