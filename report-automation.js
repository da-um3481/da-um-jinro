/**
 * ========================================
 * 📊 주간/프로그램 종합 보고서 자동화 시스템
 * ========================================
 * 
 * 프로그램 기간: 2025년 1월 5일 ~ 1월 30일 (26일간)
 * 
 * 기능:
 * 1. 일일 피드백 → 주간 요약 (매주 토요일)
 * 2. 주간 요약 → 프로그램 종합 보고서 (1월 30일)
 * 3. 학생별 26일간 종합 보고서 생성 및 다운로드
 * 
 * 주간 보고서 생성 일정:
 * - 1주차: 1/5(일) ~ 1/11(토) → 1/11 생성 (7일)
 * - 2주차: 1/12(일) ~ 1/18(토) → 1/18 생성 (7일)
 * - 3주차: 1/19(일) ~ 1/25(토) → 1/25 생성 (7일)
 * - 4주차: 1/26(일) ~ 1/30(목) → 1/30 생성 (5일)
 */

// 프로그램 설정
const PROGRAM_CONFIG = {
    START_DATE: '2025-01-05', // 일요일
    END_DATE: '2025-01-30',   // 목요일
    TOTAL_DAYS: 26,
    PROGRAM_NAME: '겨울방학 26일 특별 프로그램'
};

// ========================================
// 1️⃣ 주간 피드백 자동 집계
// ========================================

/**
 * 일일 피드백을 주간 요약으로 집계
 * @param {string} studentId - 학생 ID
 * @param {Date} weekEndDate - 주의 마지막 날 (토요일)
 * @returns {Object} 주간 요약 데이터
 */
function generateWeeklySummary(studentId, weekEndDate = new Date()) {
    // 주의 시작일 계산 (토요일 - 6일 = 일요일)
    const weekStartDate = new Date(weekEndDate);
    weekStartDate.setDate(weekStartDate.getDate() - 6);
    
    // 프로그램 기간 체크
    const programStart = new Date(PROGRAM_CONFIG.START_DATE);
    const programEnd = new Date(PROGRAM_CONFIG.END_DATE);
    
    // 시작일이 프로그램 시작일보다 이전이면 프로그램 시작일로 조정
    if (weekStartDate < programStart) {
        weekStartDate.setTime(programStart.getTime());
    }
    
    // 일일 피드백 가져오기
    const dailyFeedbacks = JSON.parse(localStorage.getItem('daily_feedback_records')) || [];
    
    // 해당 주의 피드백만 필터링
    const weekFeedbacks = dailyFeedbacks.filter(record => {
        if (record.student_id !== studentId) return false;
        
        const recordDate = new Date(record.date);
        return recordDate >= weekStartDate && recordDate <= weekEndDate;
    });
    
    if (weekFeedbacks.length === 0) {
        console.log(`ℹ️ ${studentId} 학생의 ${weekStartDate.toLocaleDateString()}~${weekEndDate.toLocaleDateString()} 주간 피드백이 없습니다.`);
        return null;
    }
    
    // 학습 기록 가져오기
    const studyRecords = JSON.parse(localStorage.getItem('study_records')) || [];
    const weekStudyRecords = studyRecords.filter(record => {
        if (record.student_id !== studentId) return false;
        
        const recordDate = new Date(record.date);
        return recordDate >= weekStartDate && recordDate <= weekEndDate;
    });
    
    // 주간 통계 계산
    const stats = calculateWeeklyStats(weekStudyRecords, weekFeedbacks);
    
    // 실제 학습 일수 계산
    const actualDays = Math.ceil((weekEndDate - weekStartDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // 주간 요약 생성
    const weeklySummary = {
        student_id: studentId,
        week_start: weekStartDate.toISOString().split('T')[0],
        week_end: weekEndDate.toISOString().split('T')[0],
        generated_at: new Date().toISOString(),
        
        // 학습 통계
        total_study_days: stats.studyDays,
        total_study_time_minutes: stats.totalMinutes,
        average_daily_study_minutes: Math.round(stats.totalMinutes / actualDays),
        actual_period_days: actualDays, // 실제 기간 일수
        
        // 과목별 통계
        subject_stats: stats.subjectStats,
        
        // 주요 강점 (빈도 높은 강점)
        key_strengths: extractTopItems(weekFeedbacks, 'strengths', 3),
        
        // 주요 개선 과제 (빈도 높은 개선사항)
        key_improvements: extractTopItems(weekFeedbacks, 'improvements', 3),
        
        // 학습 패턴 분석
        study_pattern: analyzeStudyPattern(weekStudyRecords),
        
        // 주간 종합 평가
        overall_assessment: generateWeeklyAssessment(stats, weekFeedbacks, actualDays),
        
        // 원본 피드백 개수
        daily_feedback_count: weekFeedbacks.length
    };
    
    console.log('✅ 주간 요약 생성 완료:', weeklySummary);
    return weeklySummary;
}

/**
 * 주간 통계 계산
 */
function calculateWeeklyStats(studyRecords, feedbacks) {
    const stats = {
        studyDays: 0,
        totalMinutes: 0,
        subjectStats: {}
    };
    
    // 학습일 계산 (중복 제거)
    const studyDates = new Set();
    
    studyRecords.forEach(record => {
        studyDates.add(record.date);
        
        // 총 학습 시간
        if (record.total_seconds) {
            stats.totalMinutes += Math.round(record.total_seconds / 60);
        }
        
        // 과목별 통계
        if (record.subjects) {
            Object.keys(record.subjects).forEach(subject => {
                if (!stats.subjectStats[subject]) {
                    stats.subjectStats[subject] = {
                        study_count: 0,
                        total_minutes: 0,
                        pages_completed: 0
                    };
                }
                
                const subjectData = record.subjects[subject];
                stats.subjectStats[subject].study_count++;
                
                if (subjectData.study_seconds) {
                    stats.subjectStats[subject].total_minutes += Math.round(subjectData.study_seconds / 60);
                }
                
                if (subjectData.pages && subjectData.pages.count) {
                    stats.subjectStats[subject].pages_completed += subjectData.pages.count;
                }
            });
        }
    });
    
    stats.studyDays = studyDates.size;
    
    return stats;
}

/**
 * 빈도 높은 항목 추출 (강점, 개선사항)
 */
function extractTopItems(feedbacks, key, topN = 3) {
    const itemCount = {};
    
    feedbacks.forEach(record => {
        const items = record.feedback[key] || [];
        items.forEach(item => {
            itemCount[item] = (itemCount[item] || 0) + 1;
        });
    });
    
    // 빈도순 정렬
    const sorted = Object.entries(itemCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN);
    
    return sorted.map(([item, count]) => ({
        text: item,
        frequency: count
    }));
}

/**
 * 학습 패턴 분석
 */
function analyzeStudyPattern(studyRecords) {
    if (studyRecords.length === 0) {
        return {
            regularity: '데이터 부족',
            preferred_time: '알 수 없음',
            consistency_score: 0
        };
    }
    
    // 요일별 학습 패턴
    const dayPattern = {};
    studyRecords.forEach(record => {
        const day = new Date(record.date).getDay();
        dayPattern[day] = (dayPattern[day] || 0) + 1;
    });
    
    // 시간대별 학습 패턴 (timestamp 기준)
    const hourPattern = {};
    studyRecords.forEach(record => {
        if (record.timestamp) {
            const hour = new Date(record.timestamp).getHours();
            hourPattern[hour] = (hourPattern[hour] || 0) + 1;
        }
    });
    
    // 가장 많이 공부한 시간대
    const topHour = Object.entries(hourPattern)
        .sort((a, b) => b[1] - a[1])[0];
    
    const preferredTime = topHour 
        ? `${topHour[0]}시~${parseInt(topHour[0]) + 1}시` 
        : '알 수 없음';
    
    // 규칙성 점수 (7일 중 공부한 날 수)
    const consistencyScore = Math.round((studyRecords.length / 7) * 100);
    
    return {
        regularity: consistencyScore >= 70 ? '규칙적' : consistencyScore >= 40 ? '보통' : '불규칙적',
        preferred_time: preferredTime,
        consistency_score: consistencyScore
    };
}

/**
 * 주간 종합 평가 생성
 */
function generateWeeklyAssessment(stats, feedbacks, actualDays) {
    const avgMinutes = Math.round(stats.totalMinutes / actualDays);
    
    let assessment = '';
    
    // 학습량 평가
    if (avgMinutes >= 120) {
        assessment += '매우 성실하게 학습했습니다. ';
    } else if (avgMinutes >= 60) {
        assessment += '꾸준히 학습했습니다. ';
    } else {
        assessment += '학습 시간을 늘려볼 필요가 있습니다. ';
    }
    
    // 학습일 평가
    const studyRate = (stats.studyDays / actualDays) * 100;
    if (studyRate >= 85) {
        assessment += '거의 매일 학습하는 훌륭한 습관을 보였습니다. ';
    } else if (studyRate >= 60) {
        assessment += '규칙적인 학습 패턴을 유지하고 있습니다. ';
    } else {
        assessment += '더 규칙적인 학습 습관이 필요합니다. ';
    }
    
    // 과목 균형 평가
    const subjectCount = Object.keys(stats.subjectStats).length;
    if (subjectCount >= 4) {
        assessment += '여러 과목을 골고루 학습하고 있습니다.';
    } else if (subjectCount >= 2) {
        assessment += '주요 과목 위주로 학습하고 있습니다.';
    } else {
        assessment += '다양한 과목을 학습해보는 것을 권장합니다.';
    }
    
    return assessment;
}

/**
 * 주간 요약 저장
 */
function saveWeeklySummary(weeklySummary) {
    if (!weeklySummary) return false;
    
    let weeklySummaries = JSON.parse(localStorage.getItem('weekly_summary_records')) || [];
    
    // 중복 체크 (같은 학생, 같은 주)
    const existingIndex = weeklySummaries.findIndex(s => 
        s.student_id === weeklySummary.student_id &&
        s.week_start === weeklySummary.week_start
    );
    
    if (existingIndex >= 0) {
        weeklySummaries[existingIndex] = weeklySummary; // 업데이트
        console.log('📝 기존 주간 요약 업데이트');
    } else {
        weeklySummaries.push(weeklySummary); // 새로 추가
        console.log('📝 새 주간 요약 추가');
    }
    
    localStorage.setItem('weekly_summary_records', JSON.stringify(weeklySummaries));
    console.log('✅ 주간 요약 저장 완료');
    
    return true;
}

// ========================================
// 2️⃣ 프로그램 종합 보고서 자동 생성 (26일간)
// ========================================

/**
 * 주간 요약을 프로그램 종합 보고서로 집계
 * @param {string} studentId - 학생 ID
 * @returns {Object} 프로그램 종합 보고서 데이터
 */
function generateProgramReport(studentId) {
    const programStart = new Date(PROGRAM_CONFIG.START_DATE);
    const programEnd = new Date(PROGRAM_CONFIG.END_DATE);
    
    // 주간 요약 가져오기
    const weeklySummaries = JSON.parse(localStorage.getItem('weekly_summary_records')) || [];
    
    // 프로그램 기간의 주간 요약만 필터링
    const programSummaries = weeklySummaries.filter(summary => {
        if (summary.student_id !== studentId) return false;
        
        const weekEnd = new Date(summary.week_end);
        return weekEnd >= programStart && weekEnd <= programEnd;
    });
    
    if (programSummaries.length === 0) {
        console.log(`ℹ️ ${studentId} 학생의 프로그램 기간 주간 요약이 없습니다.`);
        return null;
    }
    
    // 프로그램 통계 계산
    const programStats = calculateProgramStats(programSummaries);
    
    // 진단평가 결과 가져오기
    const diagnosticResults = JSON.parse(localStorage.getItem('diagnostic_results')) || [];
    const studentDiagnostic = diagnosticResults.find(r => r.studentId === studentId);
    
    // 프로그램 종합 보고서 생성
    const programReport = {
        student_id: studentId,
        program_start: PROGRAM_CONFIG.START_DATE,
        program_end: PROGRAM_CONFIG.END_DATE,
        program_days: PROGRAM_CONFIG.TOTAL_DAYS,
        program_name: PROGRAM_CONFIG.PROGRAM_NAME,
        generated_at: new Date().toISOString(),
        
        // 기본 정보
        student_info: {
            name: localStorage.getItem('currentStudentName') || '학생',
            grade: localStorage.getItem('currentStudentGrade') || '?'
        },
        
        // 진단평가 결과
        diagnostic_assessment: studentDiagnostic ? {
            total_score: studentDiagnostic.totalScore || 0,
            level: studentDiagnostic.level || '미평가',
            subject_scores: studentDiagnostic.subjectScores || {}
        } : null,
        
        // 프로그램 학습 통계 (26일간)
        program_stats: programStats,
        
        // 주간 요약 목록
        weekly_summaries: programSummaries.map(s => ({
            week: `${s.week_start} ~ ${s.week_end}`,
            study_days: s.total_study_days,
            study_time_minutes: s.total_study_time_minutes,
            overall_assessment: s.overall_assessment
        })),
        
        // 프로그램 종합 평가
        program_assessment: generateProgramAssessment(programStats, programSummaries),
        
        // 향후 학습 계획 제안
        future_plan: generateFuturePlan(programStats, studentDiagnostic)
    };
    
    console.log('✅ 프로그램 종합 보고서 생성 완료:', programReport);
    return programReport;
}

/**
 * 프로그램 통계 계산 (26일간)
 */
function calculateProgramStats(weeklySummaries) {
    const stats = {
        total_weeks: weeklySummaries.length,
        total_study_days: 0,
        total_study_time_minutes: 0,
        total_study_hours: 0,
        average_daily_study_minutes: 0,
        subject_stats: {},
        top_strengths: [],
        top_improvements: [],
        overall_consistency: 0
    };
    
    // 합산
    weeklySummaries.forEach(week => {
        stats.total_study_days += week.total_study_days || 0;
        stats.total_study_time_minutes += week.total_study_time_minutes || 0;
        
        // 과목별 통계 합산
        if (week.subject_stats) {
            Object.entries(week.subject_stats).forEach(([subject, data]) => {
                if (!stats.subject_stats[subject]) {
                    stats.subject_stats[subject] = {
                        total_minutes: 0,
                        total_hours: 0,
                        total_pages: 0,
                        study_count: 0
                    };
                }
                
                stats.subject_stats[subject].total_minutes += data.total_minutes || 0;
                stats.subject_stats[subject].total_pages += data.pages_completed || 0;
                stats.subject_stats[subject].study_count += data.study_count || 0;
            });
        }
    });
    
    // 시간 변환 및 평균 계산
    stats.total_study_hours = Math.round(stats.total_study_time_minutes / 60 * 10) / 10; // 소수점 1자리
    stats.average_daily_study_minutes = Math.round(stats.total_study_time_minutes / PROGRAM_CONFIG.TOTAL_DAYS);
    stats.overall_consistency = Math.round((stats.total_study_days / PROGRAM_CONFIG.TOTAL_DAYS) * 100);
    
    // 과목별 시간 계산
    Object.keys(stats.subject_stats).forEach(subject => {
        stats.subject_stats[subject].total_hours = 
            Math.round(stats.subject_stats[subject].total_minutes / 60 * 10) / 10;
    });
    
    // 최다 강점/개선사항 추출
    const allStrengths = {};
    const allImprovements = {};
    
    weeklySummaries.forEach(week => {
        (week.key_strengths || []).forEach(item => {
            allStrengths[item.text] = (allStrengths[item.text] || 0) + item.frequency;
        });
        
        (week.key_improvements || []).forEach(item => {
            allImprovements[item.text] = (allImprovements[item.text] || 0) + item.frequency;
        });
    });
    
    stats.top_strengths = Object.entries(allStrengths)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([text, count]) => ({ text, count }));
    
    stats.top_improvements = Object.entries(allImprovements)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([text, count]) => ({ text, count }));
    
    return stats;
}

/**
 * 프로그램 종합 평가 생성
 */
function generateProgramAssessment(stats, weeklySummaries) {
    let assessment = '';
    
    // 전반적인 학습량 평가
    assessment += `${PROGRAM_CONFIG.PROGRAM_NAME} 기간 동안 총 ${stats.total_study_days}일 동안 ${stats.total_study_hours}시간을 학습했습니다. `;
    
    if (stats.overall_consistency >= 80) {
        assessment += '거의 매일 규칙적으로 학습하는 훌륭한 습관을 보였습니다. ';
    } else if (stats.overall_consistency >= 60) {
        assessment += '전반적으로 꾸준히 학습했으나, 더 규칙적인 학습이 필요합니다. ';
    } else {
        assessment += '학습 일수가 부족합니다. 매일 조금씩이라도 학습하는 습관을 만들어보세요. ';
    }
    
    // 과목별 평가
    const subjects = Object.keys(stats.subject_stats);
    if (subjects.length > 0) {
        const topSubject = subjects.reduce((a, b) => 
            stats.subject_stats[a].total_minutes > stats.subject_stats[b].total_minutes ? a : b
        );
        
        assessment += `가장 집중한 과목은 ${topSubject}(${stats.subject_stats[topSubject].total_hours}시간)입니다. `;
    }
    
    // 강점 언급
    if (stats.top_strengths.length > 0) {
        assessment += `특히 "${stats.top_strengths[0].text}"에서 강점을 보였습니다. `;
    }
    
    // 개선 필요 사항
    if (stats.top_improvements.length > 0) {
        assessment += `앞으로는 "${stats.top_improvements[0].text}"에 집중해보세요.`;
    }
    
    return assessment;
}

/**
 * 향후 학습 계획 제안
 */
function generateFuturePlan(stats, diagnosticResult) {
    const plan = {
        target_daily_hours: 2,
        priority_subjects: [],
        recommended_actions: []
    };
    
    // 현재 취약 과목 파악 (진단평가 기준)
    if (diagnosticResult && diagnosticResult.subjectScores) {
        const weakSubjects = Object.entries(diagnosticResult.subjectScores)
            .filter(([_, score]) => score < 6) // 10점 만점 중 6점 미만
            .sort((a, b) => a[1] - b[1])
            .slice(0, 2)
            .map(([subject, _]) => subject);
        
        plan.priority_subjects = weakSubjects.length > 0 
            ? weakSubjects 
            : ['수학', '영어']; // 기본값
    } else {
        plan.priority_subjects = ['수학', '영어'];
    }
    
    // 권장 사항 생성
    if (stats.overall_consistency < 80) {
        plan.recommended_actions.push('매일 최소 2시간 이상 꾸준히 학습하기');
    }
    
    plan.recommended_actions.push(`${plan.priority_subjects[0]} 집중 복습하기`);
    
    if (stats.top_improvements.length > 0) {
        plan.recommended_actions.push(stats.top_improvements[0].text);
    }
    
    plan.recommended_actions.push('학습 후 복습 시간 갖기');
    plan.recommended_actions.push('어려운 문제는 선생님께 질문하기');
    plan.recommended_actions.push('개학 전 전체 내용 총정리하기');
    
    return plan;
}

/**
 * 프로그램 종합 보고서 저장
 */
function saveProgramReport(programReport) {
    if (!programReport) return false;
    
    let programReports = JSON.parse(localStorage.getItem('program_reports')) || [];
    
    // 중복 체크 (같은 학생)
    const existingIndex = programReports.findIndex(r => 
        r.student_id === programReport.student_id
    );
    
    if (existingIndex >= 0) {
        programReports[existingIndex] = programReport; // 업데이트
        console.log('📝 기존 프로그램 보고서 업데이트');
    } else {
        programReports.push(programReport); // 새로 추가
        console.log('📝 새 프로그램 보고서 추가');
    }
    
    localStorage.setItem('program_reports', JSON.stringify(programReports));
    console.log('✅ 프로그램 종합 보고서 저장 완료');
    
    return true;
}

// ========================================
// 3️⃣ 자동 실행 스케줄러
// ========================================

/**
 * 주간 요약 자동 생성 (매주 토요일)
 */
function autoGenerateWeeklySummary() {
    const currentStudentId = localStorage.getItem('currentStudentId');
    if (!currentStudentId) {
        console.log('ℹ️ 로그인된 학생이 없습니다.');
        return;
    }
    
    const today = new Date();
    const dayOfWeek = today.getDay(); // 6 = 토요일
    
    if (dayOfWeek === 6) { // 토요일
        console.log('📊 오늘은 토요일! 주간 요약을 생성합니다...');
        
        const weeklySummary = generateWeeklySummary(currentStudentId, today);
        if (weeklySummary) {
            saveWeeklySummary(weeklySummary);
            alert('📊 이번 주 학습 요약이 자동으로 생성되었습니다!');
        }
    }
}

/**
 * 프로그램 종합 보고서 자동 생성 (1월 30일)
 */
function autoGenerateProgramReport() {
    const currentStudentId = localStorage.getItem('currentStudentId');
    if (!currentStudentId) {
        console.log('ℹ️ 로그인된 학생이 없습니다.');
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // 프로그램 종료일 (1월 30일)
    if (today === PROGRAM_CONFIG.END_DATE) {
        console.log('🎉 오늘은 프로그램 종료일! 종합 보고서를 생성합니다...');
        
        const programReport = generateProgramReport(currentStudentId);
        
        if (programReport) {
            saveProgramReport(programReport);
            alert(`🎉 ${PROGRAM_CONFIG.PROGRAM_NAME} 종합 보고서가 자동으로 생성되었습니다!`);
        }
    }
}

/**
 * 페이지 로드 시 자동 실행 체크
 */
function checkAndRunAutoReports() {
    // 마지막 실행 날짜 확인
    const lastCheck = localStorage.getItem('last_report_check');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastCheck === today) {
        console.log('✅ 오늘 이미 보고서 자동 생성을 확인했습니다.');
        return;
    }
    
    // 주간 요약 체크
    autoGenerateWeeklySummary();
    
    // 프로그램 종합 보고서 체크
    autoGenerateProgramReport();
    
    // 마지막 체크 날짜 저장
    localStorage.setItem('last_report_check', today);
}

// ========================================
// 4️⃣ 수동 실행 함수 (교사 대시보드용)
// ========================================

/**
 * 특정 학생의 주간 요약 수동 생성
 */
function manualGenerateWeeklySummary(studentId, weekEndDateString) {
    const weekEndDate = weekEndDateString ? new Date(weekEndDateString) : new Date();
    const summary = generateWeeklySummary(studentId, weekEndDate);
    
    if (summary) {
        saveWeeklySummary(summary);
        return summary;
    }
    
    return null;
}

/**
 * 특정 학생의 프로그램 종합 보고서 수동 생성
 */
function manualGenerateProgramReport(studentId) {
    const report = generateProgramReport(studentId);
    
    if (report) {
        saveProgramReport(report);
        return report;
    }
    
    return null;
}

/**
 * 모든 학생의 프로그램 종합 보고서 일괄 생성
 */
function generateAllStudentsProgramReports() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const reports = [];
    
    students.forEach(student => {
        const report = generateProgramReport(student.id);
        if (report) {
            saveProgramReport(report);
            reports.push(report);
        }
    });
    
    console.log(`✅ 총 ${reports.length}명의 프로그램 종합 보고서 생성 완료`);
    return reports;
}

// ========================================
// 5️⃣ Export 함수
// ========================================

// 전역으로 export
window.ReportAutomation = {
    // 프로그램 설정
    PROGRAM_CONFIG,
    
    // 주간 요약
    generateWeeklySummary,
    saveWeeklySummary,
    autoGenerateWeeklySummary,
    
    // 프로그램 종합 보고서
    generateProgramReport,
    saveProgramReport,
    autoGenerateProgramReport,
    
    // 자동 실행
    checkAndRunAutoReports,
    
    // 수동 실행
    manualGenerateWeeklySummary,
    manualGenerateProgramReport,
    generateAllStudentsProgramReports
};

console.log('✅ 보고서 자동화 시스템 로드 완료!');
console.log(`📅 프로그램 기간: ${PROGRAM_CONFIG.START_DATE} ~ ${PROGRAM_CONFIG.END_DATE} (${PROGRAM_CONFIG.TOTAL_DAYS}일간)`);
