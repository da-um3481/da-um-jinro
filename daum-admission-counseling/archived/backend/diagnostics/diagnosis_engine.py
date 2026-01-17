"""
진단 로직 엔진
입시형 진단의 핵심 알고리즘 구현
"""

from typing import Dict, List, Tuple
from dataclasses import dataclass


@dataclass
class DiagnosisResult:
    """진단 결과 데이터 클래스"""
    grade_type: str
    grade_score: int
    extracurricular_type: str
    extracurricular_score: int
    management_type: str
    management_score: int
    summary_type: str


class AcademicAnalyzer:
    """A. 성적 구조 진단"""
    
    GRADE_TYPE_DESCRIPTIONS = {
        "stable": "내신 성적이 안정적으로 유지되고 있으며, 교과전형 활용에 유리한 구조입니다.",
        "rising": "내신 성적이 지속적으로 상승하고 있어 향후 전망이 긍정적입니다.",
        "fluctuating": "내신 성적의 변동폭이 있어 안정적인 관리가 필요합니다.",
        "risky": "내신 성적 관리에 어려움이 있어 전략적 접근이 필요합니다."
    }
    
    @staticmethod
    def calculate_gpa_score(gpa_average: float) -> int:
        """평균 내신 점수 계산 (3점 만점)"""
        if gpa_average <= 2.0:
            return 3
        elif gpa_average <= 3.0:
            return 2
        else:
            return 1
    
    @staticmethod
    def calculate_trend_score(semesters: List[Dict]) -> int:
        """내신 추이 점수 계산 (3점 만점)"""
        if len(semesters) < 2:
            return 1
        
        gpas = [s['gpa_average'] for s in semesters]
        
        is_rising = all(gpas[i+1] - gpas[i] >= 0.3 for i in range(len(gpas)-1))
        is_stable = all(abs(gpas[i+1] - gpas[i]) <= 0.3 for i in range(len(gpas)-1))
        
        if is_rising:
            return 3
        elif is_stable:
            return 2
        else:
            return 0
    
    @staticmethod
    def calculate_variance_score(semester: Dict) -> int:
        """과목 편차 점수 계산 (2점 만점)"""
        grades = [
            semester.get('korean', 5),
            semester.get('math', 5),
            semester.get('english', 5),
            semester.get('science', 5),
            semester.get('social', 5)
        ]
        
        variance = max(grades) - min(grades)
        
        if variance <= 1:
            return 2
        elif variance <= 2:
            return 1
        else:
            return 0
    
    @staticmethod
    def calculate_major_subjects_score(semester: Dict) -> int:
        """주요 과목(국·수·영) 점수 계산 (2점 만점)"""
        major_avg = (
            semester.get('korean', 5) +
            semester.get('math', 5) +
            semester.get('english', 5)
        ) / 3
        
        if major_avg <= 2.0:
            return 2
        elif major_avg <= 3.0:
            return 1
        else:
            return 0
    
    @classmethod
    def analyze(cls, academic_data: Dict) -> Tuple[str, int, str]:
        """성적 구조 종합 분석"""
        semesters = academic_data.get('recent_semesters', [])
        
        if not semesters:
            return "unknown", 0, "성적 데이터가 부족합니다."
        
        latest_semester = semesters[-1]
        latest_gpa = latest_semester.get('gpa_average', 5.0)
        
        gpa_score = cls.calculate_gpa_score(latest_gpa)
        trend_score = cls.calculate_trend_score(semesters)
        variance_score = cls.calculate_variance_score(latest_semester)
        major_score = cls.calculate_major_subjects_score(latest_semester)
        
        total_score = gpa_score + trend_score + variance_score + major_score
        
        if total_score >= 8:
            grade_type = "stable"
        elif total_score >= 6:
            grade_type = "rising"
        elif total_score >= 4:
            grade_type = "fluctuating"
        else:
            grade_type = "risky"
        
        description = cls.GRADE_TYPE_DESCRIPTIONS.get(grade_type, "")
        
        return grade_type, total_score, description


class ExtracurricularAnalyzer:
    """B. 비교과 & 학생부 진단"""
    
    EXTRACURRICULAR_DESCRIPTIONS = {
        "suitable": "비교과 활동이 학생부종합전형에 적합한 구조를 갖추고 있습니다.",
        "needs_improvement": "비교과 활동의 방향성은 있으나, 전공 연계성과 심화 과정이 보완되어야 합니다.",
        "insufficient": "비교과 활동의 누적과 체계화가 필요한 상태로, 종합전형 활용에 어려움이 있습니다."
    }
    
    @classmethod
    def analyze(cls, questionnaire_data: Dict) -> Tuple[str, int, str]:
        """비교과 활동 종합 분석"""
        total_score = (
            questionnaire_data.get('activity_continuity', 0) +
            questionnaire_data.get('major_connection', 0) +
            questionnaire_data.get('thinking_process', 0) +
            questionnaire_data.get('depth_progression', 0)
        )
        
        if total_score >= 6:
            extra_type = "suitable"
        elif total_score >= 3:
            extra_type = "needs_improvement"
        else:
            extra_type = "insufficient"
        
        description = cls.EXTRACURRICULAR_DESCRIPTIONS.get(extra_type, "")
        
        return extra_type, total_score, description


class LearningAttitudeAnalyzer:
    """C. 학습 태도 & 관리 가능성 진단"""
    
    MANAGEMENT_DESCRIPTIONS = {
        "autonomous": "자기주도적 학습이 가능하며 장기 전략 수립에 유리합니다.",
        "managed": "체계적 관리가 병행될 경우 효과적인 성과를 기대할 수 있습니다.",
        "intensive_care": "집중적인 외부 관리와 학습 습관 개선이 우선되어야 합니다."
    }
    
    @classmethod
    def analyze(cls, questionnaire_data: Dict) -> Tuple[str, int, str]:
        """학습 태도 종합 분석"""
        total_score = (
            questionnaire_data.get('execution_rate', 0) +
            questionnaire_data.get('assignment_completion', 0) +
            questionnaire_data.get('feedback_response', 0) +
            questionnaire_data.get('management_effectiveness', 0)
        )
        
        if total_score >= 6:
            mgmt_type = "autonomous"
        elif total_score >= 3:
            mgmt_type = "managed"
        else:
            mgmt_type = "intensive_care"
        
        description = cls.MANAGEMENT_DESCRIPTIONS.get(mgmt_type, "")
        
        return mgmt_type, total_score, description


class DiagnosisEngine:
    """진단 엔진 통합 클래스"""
    
    GRADE_KOREAN = {
        "stable": "내신 안정형",
        "rising": "내신 상승형",
        "fluctuating": "내신 변동형",
        "risky": "내신 위험형",
        "unknown": "내신 미분석"
    }
    
    EXTRA_KOREAN = {
        "suitable": "종합 적합",
        "needs_improvement": "종합 보완 필요",
        "insufficient": "종합 재설계 필요"
    }
    
    MGMT_KOREAN = {
        "autonomous": "자율형",
        "managed": "관리형",
        "intensive_care": "집중관리필요형"
    }
    
    @classmethod
    def run_full_diagnosis(
        cls,
        academic_data: Dict,
        extracurricular_questionnaire: Dict,
        learning_questionnaire: Dict
    ) -> DiagnosisResult:
        """전체 진단 실행"""
        grade_type, grade_score, _ = AcademicAnalyzer.analyze(academic_data)
        extra_type, extra_score, _ = ExtracurricularAnalyzer.analyze(extracurricular_questionnaire)
        mgmt_type, mgmt_score, _ = LearningAttitudeAnalyzer.analyze(learning_questionnaire)
        
        summary = f"{cls.GRADE_KOREAN[grade_type]}·{cls.EXTRA_KOREAN[extra_type]}·{cls.MGMT_KOREAN[mgmt_type]} 학생"
        
        return DiagnosisResult(
            grade_type=grade_type,
            grade_score=grade_score,
            extracurricular_type=extra_type,
            extracurricular_score=extra_score,
            management_type=mgmt_type,
            management_score=mgmt_score,
            summary_type=summary
        )
