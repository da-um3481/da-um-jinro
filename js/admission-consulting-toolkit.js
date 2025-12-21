/**
 * ================================================================
 * 입시 컨설팅 툴킷 - 고등학교 교사 대시보드
 * 2027/2028학년도 대입 전문 컨설팅 시스템
 * ================================================================
 * 
 * 이 파일은 제공된 강의 자료를 바탕으로 실전 컨설팅 도구를 제공합니다:
 * - 교과전형 분석 및 학생 매칭
 * - 종합전형 역량 평가
 * - 정시/수능 전략 수립
 * - 세특 작성 실시간 가이드
 * - 입시 로드맵 및 체크리스트
 * - 성적 분석 및 목표 설정
 */

// ================================================================
// 1. 학생 데이터 구조 (전체 데이터베이스)
// ================================================================
const studentDatabase = {
    students: [
        {
            id: 'S001',
            name: '김민준',
            grade: 2, // 고2
            class: 1,
            academicGrade: 1.8, // 내신 평균
            mockExamGrade: 2.1, // 모의고사 평균
            targetMajor: '경영학과',
            targetUniv: '서울대',
            extracurriculars: 15,
            leadership: true,
            specialSkills: ['경영 동아리장', '경제 탐구 대회 금상'],
            readingCount: 25,
            counselStatus: '완료'
        },
        {
            id: 'S002',
            name: '이서윤',
            grade: 2,
            class: 1,
            academicGrade: 1.5,
            mockExamGrade: 1.8,
            targetMajor: '컴퓨터공학',
            targetUniv: '연세대',
            extracurriculars: 18,
            leadership: false,
            specialSkills: ['코딩 동아리', '정보올림피아드 은상'],
            readingCount: 20,
            counselStatus: '예정'
        },
        {
            id: 'S003',
            name: '박지호',
            grade: 2,
            class: 1,
            academicGrade: 2.5,
            mockExamGrade: 2.8,
            targetMajor: '기계공학',
            targetUniv: '성균관대',
            extracurriculars: 10,
            leadership: false,
            specialSkills: ['로봇 제작 동아리'],
            readingCount: 12,
            counselStatus: '예정'
        }
    ]
};

// ================================================================
// 2. 교과전형 분석 시스템
// ================================================================

/**
 * 교과전형 적합도 분석 (강의 118, 120, 121, 88 기반)
 * 
 * 핵심 기준:
 * - 내신 1~2등급대: 교과전형 매우 적합
 * - 내신 3등급대: 교과전형 적합 (지방 국립대)
 * - 수능최저 충족 가능성
 */
const GyogwaAnalyzer = {
    /**
     * 학생의 교과전형 적합도 점수 계산
     */
    calculateFitScore: function(student) {
        let score = 0;
        let details = [];

        // 1) 내신 성적 평가 (70점 만점)
        if (student.academicGrade <= 1.5) {
            score += 70;
            details.push({ category: '내신', score: 70, desc: '최상위권 (1.5등급 이내)', status: 'excellent' });
        } else if (student.academicGrade <= 2.0) {
            score += 60;
            details.push({ category: '내신', score: 60, desc: '상위권 (2.0등급 이내)', status: 'good' });
        } else if (student.academicGrade <= 2.5) {
            score += 50;
            details.push({ category: '내신', score: 50, desc: '중상위권 (2.5등급 이내)', status: 'fair' });
        } else if (student.academicGrade <= 3.0) {
            score += 40;
            details.push({ category: '내신', score: 40, desc: '중위권 (3.0등급 이내)', status: 'caution' });
        } else {
            score += 20;
            details.push({ category: '내신', score: 20, desc: '3등급 이하', status: 'weak' });
        }

        // 2) 수능 모의고사 성적 (20점 만점) - 수능최저 충족 가능성
        if (student.mockExamGrade <= 2.0) {
            score += 20;
            details.push({ category: '수능최저', score: 20, desc: '충족 가능성 매우 높음', status: 'excellent' });
        } else if (student.mockExamGrade <= 3.0) {
            score += 15;
            details.push({ category: '수능최저', score: 15, desc: '충족 가능성 높음', status: 'good' });
        } else if (student.mockExamGrade <= 4.0) {
            score += 10;
            details.push({ category: '수능최저', score: 10, desc: '충족 불확실', status: 'caution' });
        } else {
            score += 5;
            details.push({ category: '수능최저', score: 5, desc: '충족 어려움', status: 'weak' });
        }

        // 3) 학년 (10점 만점) - 고2는 개선 가능성
        if (student.grade === 1 || student.grade === 2) {
            score += 10;
            details.push({ category: '학년', score: 10, desc: '성적 향상 가능 학년', status: 'good' });
        } else {
            score += 5;
            details.push({ category: '학년', score: 5, desc: '고3 (현재 성적 중시)', status: 'fair' });
        }

        return {
            totalScore: score,
            percentage: Math.round(score),
            details: details,
            recommendation: this.getRecommendation(score, student)
        };
    },

    /**
     * 추천 전략 생성
     */
    getRecommendation: function(score, student) {
        let recommendation = {
            fit: '',
            targetUnivs: [],
            strategy: '',
            warnings: []
        };

        if (score >= 80) {
            recommendation.fit = '매우 적합';
            recommendation.targetUnivs = ['서울대', '연세대', '고려대', '서강대', '성균관대'];
            recommendation.strategy = `
                <strong>교과전형 최우선 전략:</strong><br>
                • 주요 15개 대학 교과전형 6개 중 3~4개 배정<br>
                • 학교장추천전형 적극 활용 (서울대, 고려대 등)<br>
                • 수능최저 2개 합 4~5 목표 (국/수/영/탐)<br>
                • 내신 유지 전략: ${student.academicGrade}등급 → 1.5등급 이내 유지
            `;
        } else if (score >= 70) {
            recommendation.fit = '적합';
            recommendation.targetUnivs = ['성균관대', '한양대', '중앙대', '경희대', '한국외대'];
            recommendation.strategy = `
                <strong>교과전형 주력 전략:</strong><br>
                • 서울권 중상위 대학 교과전형 집중<br>
                • 수능최저 완화 대학 적극 공략<br>
                • 2학기 내신 ${student.academicGrade - 0.3}등급대 목표<br>
                • 비교과 우수 시 학생부종합 병행 고려
            `;
        } else if (score >= 60) {
            recommendation.fit = '보통';
            recommendation.targetUnivs = ['건국대', '동국대', '홍익대', '지방 국립대'];
            recommendation.strategy = `
                <strong>교과전형 + 타 전형 병행:</strong><br>
                • 수능최저 없는 교과전형 우선 탐색<br>
                • 지방 국립대 지역인재전형 적극 활용<br>
                • 학생부종합 가능성 동시 검토<br>
                • 정시 대비도 병행 필수
            `;
        } else {
            recommendation.fit = '낮음';
            recommendation.targetUnivs = ['수능 정시 중심 전략 권장'];
            recommendation.strategy = `
                <strong>교과전형 보다는 타 전형 우선:</strong><br>
                • 교과전형 지원 시 수능최저 없는 곳만 선택<br>
                • 학생부종합 또는 정시(수능) 집중 권장<br>
                • 내신 개선 가능 시간 활용 (고1~2의 경우)<br>
                • 모의고사 성적 향상에 주력
            `;
        }

        // 경고 사항
        if (student.academicGrade > 2.5) {
            recommendation.warnings.push('⚠️ 내신 3등급 이상: 서울권 교과전형 합격 가능성 낮음');
        }
        if (student.mockExamGrade > 3.5) {
            recommendation.warnings.push('⚠️ 수능최저 충족 위험: 모의고사 성적 개선 필수');
        }
        if (student.grade === 3 && student.academicGrade > 2.0) {
            recommendation.warnings.push('⚠️ 고3 현재 성적: 개선 시간 부족, 현실적 목표 설정 필요');
        }

        return recommendation;
    },

    /**
     * 2026 교과전형 서류 평가 대학 리스트 (강의 자료 기반)
     */
    get서류평가대학(): string[] {
        return [
            '서울대 (지역균형)',
            '고려대 (학교추천)',
            '연세대 (추천형)',
            '서강대 (학교장추천)',
            '성균관대 (학교장추천)',
            '한양대 (지역균형발전)',
            '경희대 (지역균형)',
            '중앙대 (지역균형)',
            '이화여대 (고교추천)',
            '한국외대 (학교장추천)'
        ];
    },

    /**
     * 수능최저 없는 교과전형 대학 (전략적 활용)
     */
    get수능최저없는대학(): string[] {
        return [
            '건국대 (KU지역균형)',
            '동국대 (학교장추천인재)',
            '홍익대 (학교장추천)',
            '숙명여대 (지역균형)',
            '세종대 (지역균형)',
            '가톨릭대 (지역균형)'
        ];
    }
};

// ================================================================
// 3. 종합전형 역량 평가 시스템
// ================================================================

/**
 * 학생부종합 전형 역량 분석 (강의 123, 124, 126, 127, 129 기반)
 * 
 * 평가 요소:
 * 1) 학업역량 (40%)
 * 2) 진로역량 (30%)
 * 3) 공동체역량 (20%)
 * 4) 전공적합성 (10%)
 */
const JonghapAnalyzer = {
    /**
     * 종합전형 역량 평가
     */
    evaluateCapabilities: function(student) {
        const scores = {
            academic: this.evaluateAcademic(student),
            career: this.evaluateCareer(student),
            community: this.evaluateCommunity(student),
            majorFit: this.evaluateMajorFit(student)
        };

        const totalScore = 
            scores.academic.score * 0.4 +
            scores.career.score * 0.3 +
            scores.community.score * 0.2 +
            scores.majorFit.score * 0.1;

        return {
            totalScore: Math.round(totalScore),
            scores: scores,
            grade: this.getGrade(totalScore),
            recommendation: this.getJonghapRecommendation(totalScore, scores, student)
        };
    },

    /**
     * 1) 학업역량 평가 (40%)
     */
    evaluateAcademic: function(student) {
        let score = 0;
        let feedback = [];

        // 내신 성적 (50점)
        if (student.academicGrade <= 2.0) {
            score += 50;
            feedback.push('✓ 내신 2등급 이내: 우수');
        } else if (student.academicGrade <= 3.0) {
            score += 40;
            feedback.push('△ 내신 3등급: 보통 (전공 관련 과목 성적 중요)');
        } else {
            score += 25;
            feedback.push('✗ 내신 3등급 이하: 학업역량 보완 필요');
        }

        // 세특 질적 수준 (30점) - 실제로는 상담 시 확인
        const estimatedSetukScore = 25; // 기본값
        score += estimatedSetukScore;
        feedback.push('※ 세특 수준은 개별 확인 필요');

        // 독서 활동 (20점)
        if (student.readingCount >= 20) {
            score += 20;
            feedback.push(`✓ 독서 ${student.readingCount}권: 우수`);
        } else if (student.readingCount >= 10) {
            score += 15;
            feedback.push(`△ 독서 ${student.readingCount}권: 보통`);
        } else {
            score += 5;
            feedback.push(`✗ 독서 ${student.readingCount}권: 부족`);
        }

        return {
            score: score,
            feedback: feedback,
            category: '학업역량'
        };
    },

    /**
     * 2) 진로역량 평가 (30%)
     */
    evaluateCareer: function(student) {
        let score = 0;
        let feedback = [];

        // 진로 탐색 활동 (50점)
        if (student.extracurriculars >= 15) {
            score += 50;
            feedback.push(`✓ 비교과 ${student.extracurriculars}개: 진로 탐색 활발`);
        } else if (student.extracurriculars >= 10) {
            score += 40;
            feedback.push(`△ 비교과 ${student.extracurriculars}개: 보통`);
        } else {
            score += 20;
            feedback.push(`✗ 비교과 ${student.extracurriculars}개: 부족`);
        }

        // 전공 관련 심화 활동 (30점)
        if (student.specialSkills && student.specialSkills.length > 0) {
            score += 25;
            feedback.push(`✓ 전공 관련 활동: ${student.specialSkills.join(', ')}`);
        } else {
            score += 10;
            feedback.push('△ 전공 관련 심화 활동 보완 필요');
        }

        // 진로 명확성 (20점)
        if (student.targetMajor && student.targetUniv) {
            score += 20;
            feedback.push(`✓ 진로 목표: ${student.targetUniv} ${student.targetMajor}`);
        } else {
            score += 5;
            feedback.push('✗ 진로 목표 불명확');
        }

        return {
            score: score,
            feedback: feedback,
            category: '진로역량'
        };
    },

    /**
     * 3) 공동체역량 평가 (20%)
     */
    evaluateCommunity: function(student) {
        let score = 50; // 기본 점수
        let feedback = [];

        if (student.leadership) {
            score += 30;
            feedback.push('✓ 리더십 활동: 있음');
        } else {
            feedback.push('△ 리더십 활동: 확인 필요');
        }

        feedback.push('※ 봉사활동, 팀 프로젝트 참여도 개별 확인 필요');

        return {
            score: score,
            feedback: feedback,
            category: '공동체역량'
        };
    },

    /**
     * 4) 전공적합성 평가 (10%)
     */
    evaluateMajorFit: function(student) {
        let score = 60; // 기본 점수
        let feedback = [];

        if (student.specialSkills && student.specialSkills.length > 0) {
            score += 30;
            feedback.push('✓ 전공 연계 활동 보유');
        } else {
            feedback.push('△ 전공 연계 활동 강화 필요');
        }

        feedback.push('※ 세특 내 전공 연계성 개별 점검 필요');

        return {
            score: score,
            feedback: feedback,
            category: '전공적합성'
        };
    },

    /**
     * 종합 평가 등급
     */
    getGrade: function(score) {
        if (score >= 85) return 'A (매우 우수)';
        if (score >= 75) return 'B (우수)';
        if (score >= 65) return 'C (보통)';
        if (score >= 50) return 'D (미흡)';
        return 'F (매우 미흡)';
    },

    /**
     * 종합전형 추천 전략
     */
    getJonghapRecommendation: function(totalScore, scores, student) {
        let recommendation = {
            fit: '',
            targetUnivs: [],
            strategy: '',
            improvements: []
        };

        if (totalScore >= 80) {
            recommendation.fit = '매우 적합';
            recommendation.targetUnivs = ['서울대', '연세대', '고려대'];
            recommendation.strategy = '학생부종합 최우선 전략 (6개 중 4~5개 배정)';
        } else if (totalScore >= 70) {
            recommendation.fit = '적합';
            recommendation.targetUnivs = ['서강대', '성균관대', '한양대', '경희대'];
            recommendation.strategy = '학생부종합 주력 전략 (6개 중 3~4개 배정)';
        } else if (totalScore >= 60) {
            recommendation.fit = '보통';
            recommendation.targetUnivs = ['중앙대', '경희대', '한국외대', '건국대'];
            recommendation.strategy = '학생부종합 + 교과 병행 전략';
        } else {
            recommendation.fit = '낮음';
            recommendation.targetUnivs = ['교과전형 또는 정시 중심 권장'];
            recommendation.strategy = '종합전형 지원 시 하향 안정 전략';
        }

        // 개선 필요 사항
        if (scores.academic.score < 70) {
            recommendation.improvements.push('📌 학업역량 강화: 세특 질적 개선, 심화 독서 활동');
        }
        if (scores.career.score < 70) {
            recommendation.improvements.push('📌 진로역량 강화: 전공 관련 심화 활동, 프로젝트 수행');
        }
        if (scores.community.score < 70) {
            recommendation.improvements.push('📌 공동체역량 강화: 팀 활동, 리더십 경험, 봉사활동');
        }
        if (scores.majorFit.score < 70) {
            recommendation.improvements.push('📌 전공적합성 강화: 세특에 전공 연계성 명시, 관련 대회/활동 참여');
        }

        return recommendation;
    }
};

// ================================================================
// 4. 5등급제-9등급제 목표 설정 도구
// ================================================================

/**
 * 5등급제-9등급제 변환 및 목표 설정 (강의 자료 기반)
 */
const GradeTargetCalculator = {
    /**
     * 9등급제 → 5등급제 변환표
     */
    convert9to5: function(grade9) {
        if (grade9 <= 1.5) return 1;
        if (grade9 <= 2.5) return 2;
        if (grade9 <= 3.5) return 3;
        if (grade9 <= 4.5) return 4;
        return 5;
    },

    /**
     * 5등급제 → 9등급제 역추정
     */
    convert5to9: function(grade5) {
        const ranges = {
            1: '1.0 ~ 1.5등급',
            2: '1.6 ~ 2.5등급',
            3: '2.6 ~ 3.5등급',
            4: '3.6 ~ 4.5등급',
            5: '4.6등급 이상'
        };
        return ranges[grade5] || '범위 없음';
    },

    /**
     * 목표 대학별 필요 등급 (2027 vs 2028)
     */
    getTargetGradeByUniv: function(univName, year) {
        const gradeMap2027 = {
            '서울대': { gyogwa: '1.3 이내', jonghap: '1.5 이내', jeongsi: '1.2 이내' },
            '연세대': { gyogwa: '1.5 이내', jonghap: '1.7 이내', jeongsi: '1.4 이내' },
            '고려대': { gyogwa: '1.5 이내', jonghap: '1.8 이내', jeongsi: '1.5 이내' },
            '서강대': { gyogwa: '1.7 이내', jonghap: '2.0 이내', jeongsi: '1.7 이내' },
            '성균관대': { gyogwa: '1.8 이내', jonghap: '2.1 이내', jeongsi: '1.8 이내' },
            '한양대': { gyogwa: '2.0 이내', jonghap: '2.3 이내', jeongsi: '2.0 이내' }
        };

        const gradeMap2028 = {
            '서울대': { gyogwa: '1등급 (10% 이내)', jonghap: '1등급', jeongsi: '1등급' },
            '연세대': { gyogwa: '1~2등급 (34% 이내)', jonghap: '1~2등급', jeongsi: '1~2등급' },
            '고려대': { gyogwa: '1~2등급', jonghap: '1~2등급', jeongsi: '1~2등급' },
            '서강대': { gyogwa: '1~2등급', jonghap: '1~2등급', jeongsi: '1~2등급' },
            '성균관대': { gyogwa: '1~2등급', jonghap: '2등급 이내', jeongsi: '1~2등급' },
            '한양대': { gyogwa: '2등급 이내', jonghap: '2등급 이내', jeongsi: '2등급 이내' }
        };

        if (year === 2027 || year === 2026) {
            return gradeMap2027[univName] || { gyogwa: 'N/A', jonghap: 'N/A', jeongsi: 'N/A' };
        } else {
            return gradeMap2028[univName] || { gyogwa: 'N/A', jonghap: 'N/A', jeongsi: 'N/A' };
        }
    },

    /**
     * 학생별 목표 등급 계산 (현재 → 목표)
     */
    calculateTargetGrade: function(student) {
        const currentGrade = student.academicGrade;
        const targetUniv = student.targetUniv;
        const yearSystem = (student.grade <= 1) ? 2028 : 2027; // 고1 이하는 2028학년도

        const targetGrades = this.getTargetGradeByUniv(targetUniv, yearSystem);

        // 교과전형 기준으로 목표 설정 (가장 일반적)
        let targetGradeNumeric = 2.0; // 기본값
        if (targetGrades.gyogwa.includes('1.3')) targetGradeNumeric = 1.3;
        else if (targetGrades.gyogwa.includes('1.5')) targetGradeNumeric = 1.5;
        else if (targetGrades.gyogwa.includes('1.7')) targetGradeNumeric = 1.7;
        else if (targetGrades.gyogwa.includes('1.8')) targetGradeNumeric = 1.8;
        else if (targetGrades.gyogwa.includes('2.0')) targetGradeNumeric = 2.0;

        const gap = currentGrade - targetGradeNumeric;
        const needsImprovement = gap > 0;

        return {
            current: currentGrade,
            target: targetGradeNumeric,
            gap: gap.toFixed(2),
            needsImprovement: needsImprovement,
            yearSystem: yearSystem,
            univRequirements: targetGrades,
            recommendation: needsImprovement 
                ? `${Math.abs(gap).toFixed(1)}등급 향상 필요 (학기당 ${(Math.abs(gap) / 2).toFixed(2)}등급 향상 목표)`
                : '목표 등급 달성 중 - 유지 전략 필요'
        };
    }
};

// ================================================================
// 5. 세특 작성 실시간 피드백 시스템
// ================================================================

/**
 * 세특 작성 가이드 및 실시간 평가 (강의 135, 49, 64, 75 기반)
 */
const SetukAssistant = {
    /**
     * 세특 작성 평가 (6가지 원칙 기반)
     */
    evaluateSetuk: function(text) {
        const evaluation = {
            score: 0,
            maxScore: 60,
            checks: []
        };

        // 1) 구체성 평가 (10점)
        const hasSpecificDetails = this.checkSpecificity(text);
        if (hasSpecificDetails.passed) {
            evaluation.score += 10;
            evaluation.checks.push({ criterion: '구체성', passed: true, feedback: '구체적 내용 포함' });
        } else {
            evaluation.checks.push({ criterion: '구체성', passed: false, feedback: hasSpecificDetails.feedback });
        }

        // 2) 개별성 평가 (10점)
        const hasIndividuality = this.checkIndividuality(text);
        if (hasIndividuality.passed) {
            evaluation.score += 10;
            evaluation.checks.push({ criterion: '개별성', passed: true, feedback: '학생 고유 활동 포함' });
        } else {
            evaluation.checks.push({ criterion: '개별성', passed: false, feedback: hasIndividuality.feedback });
        }

        // 3) 성장 과정 (10점)
        const hasGrowth = this.checkGrowthProcess(text);
        if (hasGrowth.passed) {
            evaluation.score += 10;
            evaluation.checks.push({ criterion: '성장 과정', passed: true, feedback: '변화 과정 기술' });
        } else {
            evaluation.checks.push({ criterion: '성장 과정', passed: false, feedback: hasGrowth.feedback });
        }

        // 4) 전공 적합성 (10점)
        const hasMajorConnection = this.checkMajorFit(text);
        if (hasMajorConnection.passed) {
            evaluation.score += 10;
            evaluation.checks.push({ criterion: '전공 적합성', passed: true, feedback: '전공 연계성 명시' });
        } else {
            evaluation.checks.push({ criterion: '전공 적합성', passed: false, feedback: hasMajorConnection.feedback });
        }

        // 5) 교과 연계성 (10점)
        const hasCurriculumLink = this.checkCurriculumConnection(text);
        if (hasCurriculumLink.passed) {
            evaluation.score += 10;
            evaluation.checks.push({ criterion: '교과 연계성', passed: true, feedback: '과목 간 연결성 표현' });
        } else {
            evaluation.checks.push({ criterion: '교과 연계성', passed: false, feedback: hasCurriculumLink.feedback });
        }

        // 6) 탐구 능력 (10점)
        const hasInquiry = this.checkInquiryAbility(text);
        if (hasInquiry.passed) {
            evaluation.score += 10;
            evaluation.checks.push({ criterion: '탐구 능력', passed: true, feedback: '탐구 과정 및 결과 기술' });
        } else {
            evaluation.checks.push({ criterion: '탐구 능력', passed: false, feedback: hasInquiry.feedback });
        }

        evaluation.grade = this.getSetukGrade(evaluation.score);
        evaluation.overallFeedback = this.getOverallFeedback(evaluation.score, evaluation.checks);

        return evaluation;
    },

    /**
     * 구체성 체크
     */
    checkSpecificity: function(text) {
        // 숫자, 구체적 활동명, 상세한 설명이 있는지 확인
        const hasNumbers = /\d+/.test(text);
        const hasDetailedActivity = text.length > 100; // 최소 100자 이상
        const hasSpecificTerms = /(분석|탐구|실험|조사|연구|발표|토론|작성|제작)/.test(text);

        if (hasNumbers && hasDetailedActivity && hasSpecificTerms) {
            return { passed: true };
        }
        return { 
            passed: false, 
            feedback: '구체적인 수치, 활동명, 과정을 추가하세요. 예: "3가지 사례를 분석하여", "5회 측정하여"'
        };
    },

    /**
     * 개별성 체크
     */
    checkIndividuality: function(text) {
        // 집단 활동이 아닌 개인의 역할이 명시되었는지
        const hasIndividualRole = /(개인|스스로|독자적으로|자기주도적)/.test(text) || 
                                   !/모둠|조별|팀/.test(text);

        if (hasIndividualRole || text.includes('자신의') || text.includes('본인의')) {
            return { passed: true };
        }
        return {
            passed: false,
            feedback: '학생 개인의 역할과 기여를 명확히 표현하세요. "모둠 활동에서 ○○ 역할을 맡아..."'
        };
    },

    /**
     * 성장 과정 체크
     */
    checkGrowthProcess: function(text) {
        const hasGrowthKeywords = /(처음|초기|점차|이후|결과적으로|향상|발전|깨달|이해|습득)/.test(text);

        if (hasGrowthKeywords) {
            return { passed: true };
        }
        return {
            passed: false,
            feedback: '학습 과정에서의 변화를 기술하세요. "초기에는 ○○했으나, 이후 △△하며 성장함"'
        };
    },

    /**
     * 전공 적합성 체크
     */
    checkMajorFit: function(text) {
        // 전공 관련 키워드가 있는지 (실제로는 학생 전공 정보와 매칭)
        const hasMajorKeywords = /(전공|진로|직업|학과|계열|분야)/.test(text);

        if (hasMajorKeywords) {
            return { passed: true };
        }
        return {
            passed: false,
            feedback: '전공 연계성을 명시하세요. "○○학과 진학 희망을 바탕으로..."'
        };
    },

    /**
     * 교과 연계성 체크
     */
    checkCurriculumConnection: function(text) {
        const hasCurriculumLink = /(과목|교과|단원|수업|학습|이론|개념)/.test(text);

        if (hasCurriculumLink) {
            return { passed: true };
        }
        return {
            passed: false,
            feedback: '학습한 과목/단원을 명시하세요. "○○ 단원에서 학습한 △△ 개념을 활용하여..."'
        };
    },

    /**
     * 탐구 능력 체크
     */
    checkInquiryAbility: function(text) {
        const hasInquiryProcess = /(의문|질문|가설|방법|결과|분석|결론|시사점|한계)/.test(text);

        if (hasInquiryProcess) {
            return { passed: true };
        }
        return {
            passed: false,
            feedback: '탐구 과정 (문제 → 방법 → 결과)을 포함하세요.'
        };
    },

    /**
     * 세특 등급 평가
     */
    getSetukGrade: function(score) {
        if (score >= 50) return 'A (우수)';
        if (score >= 40) return 'B (양호)';
        if (score >= 30) return 'C (보통)';
        if (score >= 20) return 'D (미흡)';
        return 'F (매우 미흡)';
    },

    /**
     * 종합 피드백
     */
    getOverallFeedback: function(score, checks) {
        const failedChecks = checks.filter(c => !c.passed);

        if (failedChecks.length === 0) {
            return '✅ 우수한 세특입니다! 6가지 원칙을 모두 충족합니다.';
        } else {
            const improvements = failedChecks.map(c => `• ${c.criterion}: ${c.feedback}`).join('\n');
            return `📌 보완 필요 사항:\n${improvements}`;
        }
    },

    /**
     * NG 예시 감지
     */
    detectNGPatterns: function(text) {
        const ngPatterns = [
            {
                pattern: /(우수|뛰어남|잘|열심히|성실|적극적)(?!.*구체)/,
                warning: '❌ NG 1: 추상적 표현 감지 → 구체적 활동으로 대체하세요'
            },
            {
                pattern: /\d+등급|점수|석차/,
                warning: '❌ NG 2: 성적 평가 표현 감지 → 학습 과정을 기술하세요'
            },
            {
                pattern: /학원|과외|교외/,
                warning: '❌ NG 4: 교외 활동 언급 감지 → 교내 활동만 기재 가능'
            },
            {
                pattern: /^(.{1,50})$/,
                warning: '❌ 너무 짧음: 최소 100자 이상 권장 (구체성 부족)'
            }
        ];

        const warnings = [];
        ngPatterns.forEach(ng => {
            if (ng.pattern.test(text)) {
                warnings.push(ng.warning);
            }
        });

        return warnings;
    }
};

// ================================================================
// 6. 입시 로드맵 체크리스트 (강의 5, 6, 7, 110, 111 기반)
// ================================================================

/**
 * 학년별 입시 로드맵
 */
const AdmissionRoadmap = {
    /**
     * 예비 고1 로드맵
     */
    getHigh1Roadmap: function() {
        return {
            title: '예비 고1 (고등학교 1학년) 로드맵',
            periods: [
                {
                    period: '1학기 (3~7월)',
                    tasks: [
                        '고등학교 내신 체계 이해 (9등급제, 상대평가)',
                        '첫 중간고사 철저 준비 (1등급 목표)',
                        '희망 진로·전공·계열 방향 설정',
                        '동아리 활동 시작 (전공 관련)',
                        '독서 활동 꾸준히 (학기당 5권 이상)'
                    ],
                    importance: 'high'
                },
                {
                    period: '여름방학 (8월)',
                    tasks: [
                        '1학기 성적 분석 및 2학기 목표 설정',
                        '대입 전형 기초 이해 (교과/종합/정시)',
                        '세특 작성 가이드 숙지',
                        '2학기 선택과목 결정'
                    ],
                    importance: 'medium'
                },
                {
                    period: '2학기 (9~12월)',
                    tasks: [
                        '내신 관리 지속 (1학년 전 과목 중요)',
                        '창의적 체험활동 충실히 참여',
                        '학생부 점검 (교사와 상담)',
                        '겨울방학 계획 수립'
                    ],
                    importance: 'high'
                }
            ]
        };
    },

    /**
     * 예비 고2 로드맵
     */
    getHigh2Roadmap: function() {
        return {
            title: '예비 고2 (고등학교 2학년) 로드맵',
            periods: [
                {
                    period: '1학기 (3~7월)',
                    tasks: [
                        '내신 1등급대 목표 (교과전형 대비)',
                        '전공 관련 세특 심화 작성',
                        '3월/4월 학력평가 응시 및 분석',
                        '독서 활동 전공 연계 (10권 이상)',
                        '교과/종합/정시 본인 적합도 판단'
                    ],
                    importance: 'high'
                },
                {
                    period: '여름방학 (8월)',
                    tasks: [
                        '6월 모평 성적 분석',
                        '대학별 전형 방법 탐색 시작',
                        '수시 지원 가능 대학 1차 선정',
                        '자소서 작성법 학습 (종합전형 준비)'
                    ],
                    importance: 'high'
                },
                {
                    period: '2학기 (9~12월)',
                    tasks: [
                        '2학년 내신 최종 마무리',
                        '학생부 종합 점검',
                        '9월 모평 분석',
                        '3학년 학습 계획 수립'
                    ],
                    importance: 'high'
                }
            ]
        };
    },

    /**
     * 예비 고3 (수시 중심) 로드맵
     */
    getHigh3RoadmapSusi: function() {
        return {
            title: '예비 고3 (수시 중심 전략) 로드맵',
            periods: [
                {
                    period: '3~5월 (1학기)',
                    tasks: [
                        '학생부 1차 점검 (교과·비교과)',
                        '3월/4월 학력평가 성적 분석',
                        '대학별 전형 방법 정밀 조사',
                        '희망 전공·계열 최종 결정'
                    ],
                    importance: 'high'
                },
                {
                    period: '6~8월 (여름)',
                    tasks: [
                        '6월 모평 성적 분석',
                        '수시 지원 대학 1차 선정 (안정/적정/상향)',
                        '자소서/면접 준비 시작',
                        '학생부 최종 마감 (8월 말)'
                    ],
                    importance: 'high'
                },
                {
                    period: '9월 (수시 원서)',
                    tasks: [
                        '9월 모평 → 수시 최종 결정',
                        '수시 원서 접수 (6개 대학)',
                        '수능최저 충족 전략 수립'
                    ],
                    importance: 'critical'
                },
                {
                    period: '10~11월 (면접/논술)',
                    tasks: [
                        '대학별 고사/면접 준비',
                        '수능 최종 마무리',
                        '수능 응시 (11월)'
                    ],
                    importance: 'critical'
                },
                {
                    period: '12월 (수시 결과)',
                    tasks: [
                        '수시 합격 발표 확인',
                        '정시 지원 가능 대학 탐색',
                        '수능 성적 분석'
                    ],
                    importance: 'high'
                }
            ]
        };
    },

    /**
     * 원서 접수 후 (정시 대비) 로드맵
     */
    getPostApplicationRoadmap: function() {
        return {
            title: '원서 접수 후 (정시 대비) 로드맵',
            periods: [
                {
                    period: '수능 직후 (11월)',
                    tasks: [
                        '수능 성적표 분석 (영역별 등급/백분위)',
                        '가채점 결과로 정시 가능 대학 1차 탐색',
                        '대학별 환산 점수 계산'
                    ],
                    importance: 'high'
                },
                {
                    period: '12월 (수시 발표 전)',
                    tasks: [
                        '정시 지원 전략 구체화',
                        '가/나/다군 배치 전략 수립',
                        '추가합격 가능성 고려'
                    ],
                    importance: 'high'
                },
                {
                    period: '12월 말 ~ 1월 (정시 원서)',
                    tasks: [
                        '정시 가/나/다군 원서 접수',
                        '최종 합격 발표 확인',
                        '등록 및 추가합격 대기'
                    ],
                    importance: 'critical'
                }
            ]
        };
    }
};

// ================================================================
// 7. 성적 분석 및 목표 설정 도구
// ================================================================

/**
 * 중간고사/기말고사/모의고사 성적 분석
 */
const ExamAnalyzer = {
    /**
     * 시험 성적 분석
     */
    analyzeExam: function(examType, scores, previousScores) {
        // examType: 'midterm', 'final', 'mockExam'
        // scores: { korean: 85, math: 90, english: 88, ... }
        // previousScores: 이전 시험 점수

        const analysis = {
            examType: examType,
            currentScores: scores,
            previousScores: previousScores || {},
            improvements: [],
            declines: [],
            averageGrade: this.calculateAverageGrade(scores),
            recommendations: []
        };

        // 과목별 변화 분석
        Object.keys(scores).forEach(subject => {
            const current = scores[subject];
            const previous = previousScores[subject];

            if (previous) {
                const change = current - previous;
                if (change > 0) {
                    analysis.improvements.push({ subject, change: `+${change}점` });
                } else if (change < 0) {
                    analysis.declines.push({ subject, change: `${change}점` });
                }
            }
        });

        // 추천 사항 생성
        if (analysis.declines.length > 0) {
            analysis.recommendations.push(`🔻 하락 과목 집중 학습: ${analysis.declines.map(d => d.subject).join(', ')}`);
        }
        if (analysis.averageGrade > 2.5) {
            analysis.recommendations.push('⚠️ 내신 3등급 이상: 교과전형 어려움, 학습 전략 재점검 필요');
        }
        if (analysis.averageGrade <= 2.0) {
            analysis.recommendations.push('✅ 상위권 유지: 교과전형 적극 고려, 수능최저 대비 필수');
        }

        return analysis;
    },

    /**
     * 평균 등급 계산 (간이 버전)
     */
    calculateAverageGrade: function(scores) {
        const values = Object.values(scores);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

        // 점수를 등급으로 변환 (간이)
        if (avg >= 95) return 1.0;
        if (avg >= 90) return 1.5;
        if (avg >= 85) return 2.0;
        if (avg >= 80) return 2.5;
        if (avg >= 75) return 3.0;
        if (avg >= 70) return 3.5;
        if (avg >= 65) return 4.0;
        return 5.0;
    }
};

// ================================================================
// 8. 수시 지원 전략표 생성기
// ================================================================

/**
 * 수시 6개 포트폴리오 생성 (강의 78, 99, 100, 107 기반)
 */
const SusiStrategy = {
    /**
     * 수시 6개 배치 전략
     */
    generateSusiPortfolio: function(student) {
        const gyogwaFit = GyogwaAnalyzer.calculateFitScore(student);
        const jonghapEval = JonghapAnalyzer.evaluateCapabilities(student);

        // 교과/종합 적합도에 따라 비율 조정
        let gyogwaCount = 0;
        let jonghapCount = 0;

        if (gyogwaFit.totalScore >= 80) {
            gyogwaCount = 4; // 교과 우선
            jonghapCount = 2;
        } else if (gyogwaFit.totalScore >= 70) {
            gyogwaCount = 3;
            jonghapCount = 3;
        } else if (jonghapEval.totalScore >= 75) {
            gyogwaCount = 2;
            jonghapCount = 4; // 종합 우선
        } else {
            gyogwaCount = 3;
            jonghapCount = 3;
        }

        const portfolio = {
            gyogwaSlots: gyogwaCount,
            jonghapSlots: jonghapCount,
            universities: this.assignUniversities(student, gyogwaCount, jonghapCount),
            strategy: this.getStrategyDescription(gyogwaCount, jonghapCount),
            warnings: []
        };

        // 경고 사항
        if (student.academicGrade > 3.0 && gyogwaCount > 2) {
            portfolio.warnings.push('⚠️ 내신 3등급 이상: 교과전형 합격 가능성 낮음, 종합 비율 높이기 권장');
        }
        if (student.mockExamGrade > 3.5) {
            portfolio.warnings.push('⚠️ 수능최저 위험: 수능최저 없는 전형 우선 배치');
        }

        return portfolio;
    },

    /**
     * 대학 배정 (상향/적정/안정)
     */
    assignUniversities: function(student, gyogwaCount, jonghapCount) {
        // 실제로는 학생 성적에 따라 동적으로 배정
        // 여기서는 예시
        return {
            gyogwa: [
                { univ: '연세대 (상향)', jeonhyung: '교과', level: '상향' },
                { univ: '성균관대 (적정)', jeonhyung: '교과', level: '적정' },
                { univ: '경희대 (안정)', jeonhyung: '교과', level: '안정' }
            ],
            jonghap: [
                { univ: '고려대 (상향)', jeonhyung: '종합', level: '상향' },
                { univ: '한양대 (적정)', jeonhyung: '종합', level: '적정' },
                { univ: '중앙대 (안정)', jeonhyung: '종합', level: '안정' }
            ]
        };
    },

    /**
     * 전략 설명
     */
    getStrategyDescription: function(gyogwaCount, jonghapCount) {
        return `
            <strong>수시 6개 배치 전략:</strong><br>
            • 교과전형 ${gyogwaCount}개 (상향 1 / 적정 ${Math.floor(gyogwaCount/2)} / 안정 ${Math.ceil(gyogwaCount/2)})<br>
            • 종합전형 ${jonghapCount}개 (상향 1 / 적정 ${Math.floor(jonghapCount/2)} / 안정 ${Math.ceil(jonghapCount/2)})<br><br>
            
            <strong>주의사항:</strong><br>
            • 상향: 목표 대학 (합격 가능성 30% 이하)<br>
            • 적정: 합격 가능성 50~70%<br>
            • 안정: 합격 가능성 80% 이상 (최저 1개 필수)
        `;
    }
};

// ================================================================
// 9. 통합 컨설팅 리포트 생성
// ================================================================

/**
 * 학생별 종합 컨설팅 리포트
 */
function generateComprehensiveReport(studentId) {
    const student = studentDatabase.students.find(s => s.id === studentId);
    if (!student) {
        return { error: '학생을 찾을 수 없습니다.' };
    }

    // 각 분석 모듈 실행
    const gyogwaAnalysis = GyogwaAnalyzer.calculateFitScore(student);
    const jonghapAnalysis = JonghapAnalyzer.evaluateCapabilities(student);
    const gradeTarget = GradeTargetCalculator.calculateTargetGrade(student);
    const susiPortfolio = SusiStrategy.generateSusiPortfolio(student);
    const roadmap = (student.grade === 1) ? AdmissionRoadmap.getHigh1Roadmap() : 
                    (student.grade === 2) ? AdmissionRoadmap.getHigh2Roadmap() : 
                    AdmissionRoadmap.getHigh3RoadmapSusi();

    return {
        student: student,
        gyogwaAnalysis: gyogwaAnalysis,
        jonghapAnalysis: jonghapAnalysis,
        gradeTarget: gradeTarget,
        susiPortfolio: susiPortfolio,
        roadmap: roadmap,
        generatedAt: new Date().toISOString()
    };
}

// ================================================================
// Export (브라우저 환경)
// ================================================================
if (typeof window !== 'undefined') {
    window.AdmissionConsultingToolkit = {
        GyogwaAnalyzer,
        JonghapAnalyzer,
        GradeTargetCalculator,
        SetukAssistant,
        AdmissionRoadmap,
        ExamAnalyzer,
        SusiStrategy,
        generateComprehensiveReport,
        studentDatabase
    };

    console.log('✅ 입시 컨설팅 툴킷 로드 완료');
    console.log('사용 예시: AdmissionConsultingToolkit.generateComprehensiveReport("S001")');
}
