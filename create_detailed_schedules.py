#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
학생별 맞춤형 학습 스케줄 생성기 (구체적 학습 내용 포함)
진단평가 결과를 바탕으로 교과서 단원별 구체적인 학습 내용 제시
"""

import json
import csv
from datetime import datetime, timedelta
from typing import Dict, List, Any

# 전체 학생 진단평가 결과 데이터
DIAGNOSTIC_DATA = [
    {"name": "박수은", "grade": "중1", "date": "2026-01-02", "total": 348, "level": "표준",
     "subjects": {"math": "기초", "english": "기초", "korean": "기초", "social": "기초", "science": "기초"}},
    {"name": "김예서", "grade": "중2", "date": "2026-01-03", "total": 0, "level": "기초",
     "subjects": {"math": "기초", "english": "기초", "korean": "기초", "social": "기초", "science": "기초"}},
    {"name": "성유정", "grade": "중3", "date": "2026-01-03", "total": 354, "level": "표준",
     "subjects": {"math": "표준", "english": "기초", "korean": "심화", "social": "심화", "science": "심화"}},
    {"name": "김태연", "grade": "중1", "date": "2026-01-04", "total": 475, "level": "심화",
     "subjects": {"math": "심화", "english": "심화", "korean": "심화", "social": "심화", "science": "심화"}},
    {"name": "신해림", "grade": "중1", "date": "2026-01-04", "total": 444, "level": "심화",
     "subjects": {"math": "심화", "english": "심화", "korean": "심화", "social": "심화", "science": "심화"}},
    {"name": "강예림", "grade": "중2", "date": "2026-01-04", "total": 325, "level": "표준",
     "subjects": {"math": "심화", "english": "심화", "korean": "표준", "social": "표준", "science": "표준"}},
    {"name": "이윤주", "grade": "중2", "date": "2026-01-04", "total": 303, "level": "표준",
     "subjects": {"math": "기초", "english": "심화", "korean": "기초", "social": "심화", "science": "심화"}},
    {"name": "박서연", "grade": "중2", "date": "2026-01-04", "total": 372, "level": "심화",
     "subjects": {"math": "심화", "english": "심화", "korean": "표준", "social": "표준", "science": "심화"}},
    {"name": "주은성", "grade": "중2", "date": "2026-01-04", "total": 340, "level": "표준",
     "subjects": {"math": "표준", "english": "표준", "korean": "표준", "social": "심화", "science": "심화"}},
    {"name": "김유진", "grade": "중1", "date": "2026-01-04", "total": 442, "level": "심화",
     "subjects": {"math": "심화", "english": "심화", "korean": "표준", "social": "심화", "science": "심화"}},
    {"name": "백효림", "grade": "중1", "date": "2026-01-04", "total": 383, "level": "심화",
     "subjects": {"math": "심화", "english": "표준", "korean": "심화", "social": "심화", "science": "심화"}},
    {"name": "김소민", "grade": "중2", "date": "2026-01-04", "total": 229, "level": "기초",
     "subjects": {"math": "표준", "english": "표준", "korean": "표준", "social": "기초", "science": "기초"}},
    {"name": "주가윤", "grade": "중2", "date": "2026-01-04", "total": 300, "level": "표준",
     "subjects": {"math": "기초", "english": "기초", "korean": "심화", "social": "심화", "science": "표준"}},
    {"name": "손희윤", "grade": "중1", "date": "2026-01-04", "total": 252, "level": "표준",
     "subjects": {"math": "심화", "english": "심화", "korean": "기초", "social": "기초", "science": "기초"}},
    {"name": "최지현", "grade": "중2", "date": "2026-01-04", "total": 475, "level": "심화",
     "subjects": {"math": "심화", "english": "심화", "korean": "심화", "social": "심화", "science": "심화"}},
    {"name": "고은채", "grade": "중2", "date": "2026-01-04", "total": 460, "level": "심화",
     "subjects": {"math": "심화", "english": "심화", "korean": "심화", "social": "심화", "science": "심화"}},
    {"name": "김다현", "grade": "중1", "date": "2026-01-04", "total": 475, "level": "심화",
     "subjects": {"math": "심화", "english": "심화", "korean": "심화", "social": "심화", "science": "심화"}},
    {"name": "정예빈", "grade": "중3", "date": "2026-01-04", "total": 462, "level": "심화",
     "subjects": {"math": "심화", "english": "심화", "korean": "심화", "social": "심화", "science": "심화"}},
    {"name": "조해인", "grade": "중1", "date": "2026-01-04", "total": 149, "level": "기초",
     "subjects": {"math": "기초", "english": "표준", "korean": "표준", "social": "기초", "science": "기초"}},
    {"name": "조예하", "grade": "중2", "date": "2026-01-04", "total": 323, "level": "표준",
     "subjects": {"math": "표준", "english": "표준", "korean": "표준", "social": "심화", "science": "표준"}},
    {"name": "이나연", "grade": "중2", "date": "2026-01-04", "total": 329, "level": "표준",
     "subjects": {"math": "심화", "english": "심화", "korean": "기초", "social": "표준", "science": "기초"}},
    {"name": "최정경", "grade": "중3", "date": "2026-01-04", "total": 372, "level": "심화",
     "subjects": {"math": "표준", "english": "표준", "korean": "심화", "social": "심화", "science": "심화"}},
    {"name": "백시연", "grade": "중1", "date": "2026-01-05", "total": 314, "level": "표준",
     "subjects": {"math": "기초", "english": "심화", "korean": "기초", "social": "심화", "science": "표준"}},
    {"name": "도연주", "grade": "중1", "date": "2026-01-05", "total": 229, "level": "기초",
     "subjects": {"math": "기초", "english": "기초", "korean": "기초", "social": "표준", "science": "표준"}},
    {"name": "김지호", "grade": "중2", "date": "2026-01-09", "total": 475, "level": "심화",
     "subjects": {"math": "심화", "english": "심화", "korean": "심화", "social": "심화", "science": "심화"}},
]

# 제외할 학생
EXCLUDE_STUDENTS = ["정라미", "테스트"]

# 과목 매핑
SUBJECT_MAPPING = {
    "math": "수학",
    "english": "영어",
    "korean": "국어",
    "social": "사회",
    "science": "과학"
}

# 구체적인 학습 내용 데이터베이스
LEARNING_CONTENT = {
    "중1": {
        "math": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "소인수분해", "content": "소수와 합성수 개념 (교과서 p.12-18)", "practice": "기본서 p.12-15 기본문제 5개"},
                    {"unit": "소인수분해", "content": "소인수분해 방법 익히기 (교과서 p.19-25)", "practice": "기본서 p.16-20 연습문제 5개"},
                    {"unit": "최대공약수", "content": "최대공약수 구하기 (교과서 p.26-30)", "practice": "기본서 p.21-24 문제 5개"},
                    {"unit": "정수", "content": "정수의 덧셈과 뺄셈 (교과서 p.38-45)", "practice": "기본서 p.28-32 계산문제 8개"},
                    {"unit": "유리수", "content": "유리수의 사칙연산 (교과서 p.54-60)", "practice": "기본서 p.38-42 혼합계산 5개"},
                    {"unit": "문자와 식", "content": "문자의 사용과 식의 값 (교과서 p.68-75)", "practice": "기본서 p.48-52 대입 계산 6개"},
                    {"unit": "일차식", "content": "일차식의 덧셈과 뺄셈 (교과서 p.76-82)", "practice": "기본서 p.53-57 계산 연습 7개"},
                ],
                "cycle": 7
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "소인수분해", "content": "최대공약수와 최소공배수 응용 (교과서 p.31-35)", "practice": "응용서 p.18-22 실생활 문제 7개"},
                    {"unit": "정수와 유리수", "content": "복잡한 사칙연산 (교과서 p.61-65)", "practice": "응용서 p.35-40 혼합문제 7개"},
                    {"unit": "일차방정식", "content": "일차방정식 풀이 전략 (교과서 p.101-110)", "practice": "응용서 p.55-62 유형별 문제 8개"},
                    {"unit": "일차방정식", "content": "일차방정식의 활용 (교과서 p.111-120)", "practice": "응용서 p.63-70 응용문제 7개"},
                ],
                "cycle": 4
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "소인수분해", "content": "고급 수론 개념 (심화교재 p.12-18)", "practice": "심화서 p.15-22 경시문제 10개"},
                    {"unit": "방정식", "content": "복잡한 일차방정식 (심화교재 p.45-55)", "practice": "심화서 p.50-60 고난도 10개"},
                    {"unit": "종합", "content": "창의적 문제해결 (심화교재 p.80-90)", "practice": "경시대회 기출 10개"},
                ],
                "cycle": 3
            }
        },
        "english": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "Be동사", "content": "am/are/is 현재형 (교과서 p.8-15) + 단어 15개", "practice": "문장 만들기 10개 + 단어 쓰기"},
                    {"unit": "일반동사", "content": "일반동사 현재형 (교과서 p.16-25) + 단어 15개", "practice": "영작 연습 12개 + 받아쓰기"},
                    {"unit": "의문문", "content": "Do/Does 의문문 (교과서 p.26-30) + 단어 10개", "practice": "질문-답변 연습 10세트"},
                    {"unit": "현재진행", "content": "be + -ing 형태 (교과서 p.38-45) + 단어 15개", "practice": "진행형 전환 15문장"},
                    {"unit": "과거형", "content": "규칙/불규칙 동사 (교과서 p.49-60) + 단어 20개", "practice": "과거형 쓰기 20개 + 영작"},
                ],
                "cycle": 5
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "시제 종합", "content": "현재/과거/진행형 비교 (교과서 p.70-80) + 단어 20개", "practice": "시제 전환 문제 15개 + 독해 1지문"},
                    {"unit": "조동사", "content": "can/may/must 용법 (교과서 p.85-95) + 단어 18개", "practice": "조동사 활용 문장 20개"},
                    {"unit": "명사와 대명사", "content": "셀수있는/없는 명사 (교과서 p.100-110) + 단어 20개", "practice": "명사 변환 15개 + 독해"},
                ],
                "cycle": 3
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "고급 문법", "content": "복잡한 문장 구조 (심화교재 p.30-45) + 단어 25개", "practice": "고난도 문법 15개 + 독해 2지문"},
                    {"unit": "독해", "content": "장문 독해 전략 (심화교재 p.60-75)", "practice": "고급 독해 3지문 + 요약 쓰기"},
                ],
                "cycle": 2
            }
        },
        "korean": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "문학", "content": "시의 운율과 표현 (교과서 p.10-20)", "practice": "시 감상문 쓰기 + 문제 5개"},
                    {"unit": "문학", "content": "소설의 구성 요소 (교과서 p.26-35)", "practice": "등장인물 분석 + 문제 5개"},
                    {"unit": "문법", "content": "품사의 이해 (교과서 p.150-160)", "practice": "품사 분류 연습 20개"},
                    {"unit": "쓰기", "content": "문장의 짜임 (교과서 p.54-65)", "practice": "문장 구조 분석 10개"},
                    {"unit": "읽기", "content": "중심 생각 파악 (교과서 p.100-110)", "practice": "지문 읽고 요약하기 3개"},
                ],
                "cycle": 5
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "문학", "content": "작품 심층 분석 (교과서 p.45-60)", "practice": "비평문 쓰기 + 응용문제 7개"},
                    {"unit": "비문학", "content": "설명문/논설문 구조 (교과서 p.120-135)", "practice": "구조 분석 + 문제 8개"},
                    {"unit": "문법", "content": "문장 성분 (교과서 p.170-180)", "practice": "성분 분석 15개 + 서술형"},
                ],
                "cycle": 3
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "고전 문학", "content": "고전 작품 해석 (심화교재 p.20-35)", "practice": "현대어 풀이 + 감상문"},
                    {"unit": "비판적 읽기", "content": "논리적 오류 찾기 (심화교재 p.50-65)", "practice": "고난도 독해 3지문"},
                ],
                "cycle": 2
            }
        },
        "social": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "지도", "content": "위도와 경도 (교과서 p.12-20)", "practice": "지도 읽기 연습 + 문제 5개"},
                    {"unit": "기후", "content": "세계의 기후 (교과서 p.44-55)", "practice": "기후 그래프 해석 + 5개"},
                    {"unit": "지형", "content": "지형의 형성 (교과서 p.56-68)", "practice": "지형도 분석 + 문제 6개"},
                    {"unit": "인구", "content": "인구 분포 (교과서 p.84-95)", "practice": "인구 피라미드 해석 + 5개"},
                ],
                "cycle": 4
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "지리 종합", "content": "지리적 현상 분석 (교과서 p.100-115)", "practice": "사례 분석 7개 + 서술형"},
                    {"unit": "환경", "content": "환경 문제와 해결 (교과서 p.120-135)", "practice": "사례 연구 + 의견 쓰기"},
                ],
                "cycle": 2
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "고급 지리", "content": "지리 정보 시스템 활용 (심화교재 p.30-50)", "practice": "프로젝트 과제 + 10개"},
                    {"unit": "종합", "content": "지역 분석 프로젝트 (심화교재 p.60-80)", "practice": "보고서 작성"},
                ],
                "cycle": 2
            }
        },
        "science": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "지권", "content": "지구의 구조 (교과서 p.10-18)", "practice": "그림 분석 + 문제 5개"},
                    {"unit": "암석", "content": "암석의 생성 (교과서 p.19-30)", "practice": "암석 분류 + 문제 6개"},
                    {"unit": "생물", "content": "생물의 분류 (교과서 p.46-58)", "practice": "분류 연습 + 문제 5개"},
                    {"unit": "물질", "content": "물질의 세 가지 상태 (교과서 p.90-100)", "practice": "상태 변화 + 문제 6개"},
                ],
                "cycle": 4
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "지구과학", "content": "지권의 변화 (교과서 p.35-50)", "practice": "탐구 활동 + 7개"},
                    {"unit": "생명과학", "content": "생태계 (교과서 p.75-90)", "practice": "먹이사슬 분석 + 7개"},
                ],
                "cycle": 2
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "고급 과학", "content": "과학 탐구 설계 (심화교재 p.20-40)", "practice": "실험 설계 + 10개"},
                    {"unit": "융합", "content": "과학 융합 문제 (심화교재 p.50-70)", "practice": "통합 탐구 과제"},
                ],
                "cycle": 2
            }
        }
    },
    "중2": {
        "math": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "유리수", "content": "유리수와 순환소수 (교과서 p.10-18)", "practice": "기본서 p.10-14 변환 연습 5개"},
                    {"unit": "지수법칙", "content": "지수법칙 기본 (교과서 p.42-50)", "practice": "기본서 p.22-26 계산 6개"},
                    {"unit": "다항식", "content": "다항식의 덧셈과 뺄셈 (교과서 p.53-60)", "practice": "기본서 p.30-34 정리 연습 7개"},
                    {"unit": "연립방정식", "content": "미지수 2개 방정식 (교과서 p.80-88)", "practice": "기본서 p.45-50 기본 5개"},
                    {"unit": "일차함수", "content": "함수의 개념 (교과서 p.120-128)", "practice": "기본서 p.65-70 그래프 5개"},
                ],
                "cycle": 5
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "식의 계산", "content": "다항식의 곱셈과 나눗셈 (교과서 p.65-78)", "practice": "응용서 p.35-42 복잡한 계산 8개"},
                    {"unit": "연립방정식", "content": "연립방정식 응용 (교과서 p.101-115)", "practice": "응용서 p.55-65 실생활 문제 7개"},
                    {"unit": "일차함수", "content": "일차함수의 활용 (교과서 p.143-158)", "practice": "응용서 p.80-90 그래프 해석 8개"},
                ],
                "cycle": 3
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "고급 함수", "content": "함수의 심화 개념 (심화교재 p.30-48)", "practice": "심화서 p.40-52 고난도 10개"},
                    {"unit": "종합", "content": "대수 종합 문제 (심화교재 p.70-90)", "practice": "경시 기출 10개"},
                ],
                "cycle": 2
            }
        },
        "english": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "현재완료", "content": "have/has + p.p. 기본 (교과서 p.10-20) + 단어 18개", "practice": "완료형 전환 15개 + 단어 쓰기"},
                    {"unit": "수동태", "content": "수동태 기본 형태 (교과서 p.52-62) + 단어 18개", "practice": "능동↔수동 전환 12개"},
                    {"unit": "to부정사", "content": "to부정사 용법 (교과서 p.96-106) + 단어 20개", "practice": "문장 완성 15개 + 영작"},
                    {"unit": "동명사", "content": "동명사 기본 (교과서 p.111-120) + 단어 15개", "practice": "동명사 활용 12개"},
                ],
                "cycle": 4
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "시제 심화", "content": "과거/현재완료 비교 (교과서 p.25-38) + 단어 22개", "practice": "시제 문제 15개 + 독해 2지문"},
                    {"unit": "수동태 응용", "content": "시제별 수동태 (교과서 p.70-85) + 단어 20개", "practice": "수동태 종합 18개"},
                    {"unit": "준동사", "content": "to부정사 vs 동명사 (교과서 p.130-145)", "practice": "비교 문제 15개 + 독해"},
                ],
                "cycle": 3
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "고급 문법", "content": "복잡한 문장 구조 (심화교재 p.40-60) + 단어 30개", "practice": "고난도 문법 20개 + 독해 3지문"},
                    {"unit": "독해", "content": "비판적 독해 (심화교재 p.80-100)", "practice": "심화 독해 4지문 + 논술"},
                ],
                "cycle": 2
            }
        },
        "korean": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "문학", "content": "현대시 이해 (교과서 p.8-20)", "practice": "시 분석 + 감상문 + 문제 5개"},
                    {"unit": "소설", "content": "소설의 시점과 서술 (교과서 p.25-40)", "practice": "서술자 분석 + 문제 6개"},
                    {"unit": "문법", "content": "품사의 기능 (교과서 p.62-75)", "practice": "품사 활용 연습 20개"},
                    {"unit": "논술", "content": "논증의 방법 (교과서 p.115-128)", "practice": "논증 구조 분석 5개"},
                ],
                "cycle": 4
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "문학", "content": "작품 비평 (교과서 p.45-62)", "practice": "비평문 쓰기 + 응용 7개"},
                    {"unit": "언어", "content": "문장의 확대와 축소 (교과서 p.80-98)", "practice": "문장 변형 15개 + 서술형"},
                    {"unit": "토론", "content": "토론 전략 (교과서 p.135-150)", "practice": "토론 개요 작성 + 연습"},
                ],
                "cycle": 3
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "고전문학", "content": "고전 심화 분석 (심화교재 p.25-45)", "practice": "작품 비교 + 논술"},
                    {"unit": "창작", "content": "창의적 글쓰기 (심화교재 p.60-80)", "practice": "작품 창작 + 비평"},
                ],
                "cycle": 2
            }
        },
        "social": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "고대사", "content": "고대 문명의 발생 (교과서 p.10-22)", "practice": "연표 정리 + 문제 5개"},
                    {"unit": "중세사", "content": "중세 사회 (교과서 p.58-72)", "practice": "시대 비교 + 문제 6개"},
                    {"unit": "경제", "content": "시장과 가격 (교과서 p.110-122)", "practice": "그래프 해석 + 5개"},
                    {"unit": "금융", "content": "금융의 이해 (교과서 p.123-135)", "practice": "사례 분석 + 문제 5개"},
                ],
                "cycle": 4
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "역사 종합", "content": "역사적 사건 분석 (교과서 p.90-108)", "practice": "사건 비교 7개 + 서술형"},
                    {"unit": "경제 응용", "content": "경제 현상 이해 (교과서 p.140-158)", "practice": "실생활 경제 8개"},
                ],
                "cycle": 2
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "역사 심화", "content": "역사 해석과 논쟁 (심화교재 p.30-55)", "practice": "사료 분석 + 논술 10개"},
                    {"unit": "경제 심화", "content": "경제 정책 분석 (심화교재 p.70-90)", "practice": "정책 평가 + 보고서"},
                ],
                "cycle": 2
            }
        },
        "science": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "물질", "content": "원자와 분자 (교과서 p.8-20)", "practice": "화학식 쓰기 + 문제 5개"},
                    {"unit": "이온", "content": "이온과 이온 결합 (교과서 p.35-48)", "practice": "이온식 연습 + 6개"},
                    {"unit": "전기", "content": "전류와 전압 (교과서 p.54-68)", "practice": "회로 분석 + 문제 5개"},
                    {"unit": "생물", "content": "소화계와 순환계 (교과서 p.105-120)", "practice": "기관 그림 + 문제 6개"},
                ],
                "cycle": 4
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "화학", "content": "화학 반응식 (교과서 p.50-70)", "practice": "반응식 완성 8개 + 탐구"},
                    {"unit": "물리", "content": "전기 회로 응용 (교과서 p.80-98)", "practice": "회로 설계 7개 + 계산"},
                ],
                "cycle": 2
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "과학 탐구", "content": "실험 설계 심화 (심화교재 p.30-55)", "practice": "탐구 보고서 + 10개"},
                    {"unit": "융합", "content": "과학 융합 프로젝트 (심화교재 p.70-95)", "practice": "프로젝트 수행"},
                ],
                "cycle": 2
            }
        }
    },
    "중3": {
        "math": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "제곱근", "content": "제곱근의 뜻과 성질 (교과서 p.8-18)", "practice": "기본서 p.8-12 제곱근 계산 6개"},
                    {"unit": "인수분해", "content": "인수분해 공식 (교과서 p.40-52)", "practice": "기본서 p.25-30 인수분해 8개"},
                    {"unit": "이차방정식", "content": "이차방정식 풀이 (교과서 p.75-88)", "practice": "기본서 p.45-52 기본 7개"},
                    {"unit": "이차함수", "content": "이차함수의 그래프 (교과서 p.110-125)", "practice": "기본서 p.65-72 그래프 6개"},
                ],
                "cycle": 4
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "제곱근 응용", "content": "제곱근 복잡한 계산 (교과서 p.25-38)", "practice": "응용서 p.15-24 계산 10개"},
                    {"unit": "이차방정식", "content": "이차방정식 활용 (교과서 p.92-108)", "practice": "응용서 p.55-68 응용 8개"},
                    {"unit": "이차함수", "content": "이차함수의 활용 (교과서 p.135-152)", "practice": "응용서 p.85-98 문제 해결 9개"},
                ],
                "cycle": 3
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "고급 대수", "content": "고차 방정식 (심화교재 p.40-60)", "practice": "심화서 p.50-65 고난도 12개"},
                    {"unit": "함수 심화", "content": "이차함수 최댓값/최솟값 (심화교재 p.80-100)", "practice": "경시 문제 10개"},
                ],
                "cycle": 2
            }
        },
        # 중3도 중2와 유사한 구조로 영어, 국어, 사회, 과학 추가
        "english": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "관계대명사", "content": "관계대명사 기본 (교과서 p.8-22) + 단어 20개", "practice": "문장 결합 15개"},
                    {"unit": "분사", "content": "분사의 용법 (교과서 p.50-65) + 단어 18개", "practice": "분사 활용 12개"},
                    {"unit": "가정법", "content": "가정법 과거 (교과서 p.90-105) + 단어 20개", "practice": "가정법 전환 15개"},
                ],
                "cycle": 3
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "관계사 응용", "content": "관계부사 포함 (교과서 p.30-48) + 단어 25개", "practice": "복합문장 18개 + 독해"},
                    {"unit": "고급 문법", "content": "분사구문 (교과서 p.70-88)", "practice": "문장 변형 20개"},
                ],
                "cycle": 2
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "종합 문법", "content": "고급 구문 (심화교재 p.50-75) + 단어 30개", "practice": "고난도 25개 + 독해 4지문"},
                ],
                "cycle": 1
            }
        },
        "korean": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "현대 문학", "content": "현대시/소설 깊이 읽기 (교과서 p.10-28)", "practice": "작품 분석 + 6개"},
                    {"unit": "고전", "content": "고전 시가/산문 (교과서 p.60-80)", "practice": "해석 연습 + 5개"},
                    {"unit": "작문", "content": "논술문 작성 (교과서 p.120-138)", "practice": "개요 작성 + 초고"},
                ],
                "cycle": 3
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "문학 비평", "content": "작품 비평 방법 (교과서 p.35-58)", "practice": "비평문 작성 + 8개"},
                    {"unit": "화법", "content": "발표와 토의 (교과서 p.145-165)", "practice": "발표문 작성"},
                ],
                "cycle": 2
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "문학 창작", "content": "창의적 문학 창작 (심화교재 p.30-60)", "practice": "작품 쓰기 + 감상"},
                ],
                "cycle": 1
            }
        },
        "social": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "근대사", "content": "근대 국가의 형성 (교과서 p.10-28)", "practice": "연표 정리 + 6개"},
                    {"unit": "현대사", "content": "현대 사회의 변화 (교과서 p.70-90)", "practice": "사건 분석 + 5개"},
                    {"unit": "경제", "content": "국제 경제 (교과서 p.130-148)", "practice": "무역 사례 + 6개"},
                ],
                "cycle": 3
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "역사 심화", "content": "역사적 쟁점 (교과서 p.45-68)", "practice": "사료 해석 8개"},
                    {"unit": "사회 문제", "content": "현대 사회 문제 (교과서 p.155-175)", "practice": "사례 연구 + 논술"},
                ],
                "cycle": 2
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "역사 논술", "content": "역사 논술 작성 (심화교재 p.40-70)", "practice": "논술 2편 작성"},
                ],
                "cycle": 1
            }
        },
        "science": {
            "기초": {
                "duration": 30,
                "topics": [
                    {"unit": "화학", "content": "산과 염기 (교과서 p.10-25)", "practice": "중화 반응 + 6개"},
                    {"unit": "물리", "content": "일과 에너지 (교과서 p.60-78)", "practice": "에너지 계산 + 5개"},
                    {"unit": "생물", "content": "유전 (교과서 p.110-130)", "practice": "유전 법칙 + 6개"},
                ],
                "cycle": 3
            },
            "표준": {
                "duration": 40,
                "topics": [
                    {"unit": "화학 반응", "content": "화학 반응 속도 (교과서 p.35-55)", "practice": "실험 분석 8개"},
                    {"unit": "지구과학", "content": "태양계 (교과서 p.140-160)", "practice": "천체 운동 7개"},
                ],
                "cycle": 2
            },
            "심화": {
                "duration": 50,
                "topics": [
                    {"unit": "과학 프로젝트", "content": "종합 탐구 (심화교재 p.50-85)", "practice": "프로젝트 수행 + 발표"},
                ],
                "cycle": 1
            }
        }
    }
}


def get_learning_content(grade, subject_en, level, day_index):
    """
    학년, 과목, 레벨, 날짜에 맞는 구체적인 학습 내용 반환
    """
    grade_content = LEARNING_CONTENT.get(grade, {})
    subject_content = grade_content.get(subject_en, {})
    level_content = subject_content.get(level, {})
    
    if not level_content:
        return None
    
    topics = level_content["topics"]
    cycle = level_content["cycle"]
    duration = level_content["duration"]
    
    # 순환 방식으로 주제 선택
    topic = topics[day_index % cycle]
    
    return {
        "duration": duration,
        "unit": topic["unit"],
        "content": topic["content"],
        "practice": topic["practice"]
    }


def prioritize_subjects(subjects: Dict) -> List[tuple]:
    """과목 우선순위 결정"""
    subject_list = []
    level_scores = {"기초": 100, "표준": 50, "심화": 10}
    
    for subj_en, level in subjects.items():
        priority_score = level_scores.get(level, 0)
        subject_list.append((subj_en, level, priority_score))
    
    subject_list.sort(key=lambda x: x[2], reverse=True)
    return subject_list


def create_weekly_schedule(student_data: Dict) -> Dict:
    """학생별 30일 구체적 학습 스케줄 생성"""
    name = student_data["name"]
    grade = student_data["grade"]
    subjects = student_data["subjects"]
    
    prioritized_subjects = prioritize_subjects(subjects)
    
    schedule = {
        "student_name": name,
        "grade": grade,
        "start_date": "2026-01-13",
        "end_date": "2026-02-11",
        "total_days": 30,
        "daily_schedules": []
    }
    
    start_date = datetime(2026, 1, 13)
    
    for day in range(30):
        current_date = start_date + timedelta(days=day)
        date_str = current_date.strftime("%Y-%m-%d")
        weekday = current_date.strftime("%A")
        weekday_kr = {
            "Monday": "월요일", "Tuesday": "화요일", "Wednesday": "수요일",
            "Thursday": "목요일", "Friday": "금요일", "Saturday": "토요일", "Sunday": "일요일"
        }[weekday]
        
        is_weekend = weekday in ["Saturday", "Sunday"]
        subjects_per_day = 2 if is_weekend else 3
        
        daily_tasks = []
        total_minutes = 0
        
        for i in range(min(subjects_per_day, len(prioritized_subjects))):
            subj_idx = (day + i) % len(prioritized_subjects)
            subj_en, level, _ = prioritized_subjects[subj_idx]
            subj_kr = SUBJECT_MAPPING[subj_en]
            
            # 구체적인 학습 내용 가져오기
            learning = get_learning_content(grade, subj_en, level, day)
            
            if learning:
                task = {
                    "subject": subj_kr,
                    "level": level,
                    "duration_minutes": learning["duration"],
                    "unit": learning["unit"],
                    "learning_content": learning["content"],
                    "practice_content": learning["practice"]
                }
                daily_tasks.append(task)
                total_minutes += learning["duration"]
        
        if len(daily_tasks) > 1:
            total_minutes += (len(daily_tasks) - 1) * 10
        
        daily_goal = f"{len(daily_tasks)}과목 학습 완료"
        if day % 7 == 6:
            daily_goal += " + 주간 복습"
        
        schedule["daily_schedules"].append({
            "day": day + 1,
            "date": date_str,
            "weekday": weekday_kr,
            "is_weekend": is_weekend,
            "total_minutes": total_minutes,
            "tasks": daily_tasks,
            "daily_goal": daily_goal,
            "notes": f"{'주말 - 복습 중심' if is_weekend else '평일 - 집중 학습'}"
        })
    
    return schedule


def generate_all_schedules():
    """전체 학생 스케줄 생성"""
    all_schedules = []
    
    for student in DIAGNOSTIC_DATA:
        name = student["name"]
        
        if name in EXCLUDE_STUDENTS:
            print(f"❌ {name} - 제외됨")
            continue
        
        print(f"✅ {name} ({student['grade']}) - 스케줄 생성 중...")
        schedule = create_weekly_schedule(student)
        all_schedules.append(schedule)
    
    return all_schedules


def save_schedules_json(schedules: List[Dict], filename: str):
    """JSON 저장"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(schedules, f, ensure_ascii=False, indent=2)
    print(f"\n📁 JSON 저장: {filename}")


def save_schedules_csv(schedules: List[Dict], filename: str):
    """CSV 저장"""
    rows = []
    
    for schedule in schedules:
        for daily in schedule["daily_schedules"]:
            for task_idx, task in enumerate(daily["tasks"], 1):
                row = {
                    "학생명": schedule["student_name"],
                    "학년": schedule["grade"],
                    "날짜": daily["date"],
                    "요일": daily["weekday"],
                    "주말": "주말" if daily["is_weekend"] else "평일",
                    "과목": task["subject"],
                    "레벨": task["level"],
                    "학습시간": f"{task['duration_minutes']}분",
                    "단원": task["unit"],
                    "학습내용": task["learning_content"],
                    "연습문제": task["practice_content"]
                }
                rows.append(row)
    
    if rows:
        with open(filename, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        print(f"📁 CSV 저장: {filename}")


if __name__ == "__main__":
    print("🚀 구체적인 학습 스케줄 생성 시작...\n")
    
    schedules = generate_all_schedules()
    
    print(f"\n✅ 총 {len(schedules)}명의 스케줄 생성 완료!\n")
    
    timestamp = "2026-01-v2"
    
    json_file = f"학생별_맞춤_스케줄_{timestamp}.json"
    csv_file = f"학생별_맞춤_스케줄_{timestamp}.csv"
    
    save_schedules_json(schedules, json_file)
    save_schedules_csv(schedules, csv_file)
    
    print("\n" + "="*60)
    print("✨ 구체적인 학습 내용이 포함된 스케줄 생성 완료!")
    print("="*60)
