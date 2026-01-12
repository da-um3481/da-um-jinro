#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
실제 중학생이 활용 가능한 학습 스케줄 생성기
EBS 중학 무료강의 + EBS AI 단추 문제은행 + 자기주도학습법 기반
"""

import json
import csv
from datetime import datetime, timedelta
from typing import Dict, List
from learning_methods_db import get_learning_method

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

EXCLUDE_STUDENTS = ["정라미", "테스트"]

SUBJECT_MAPPING = {
    "math": "수학",
    "english": "영어",
    "korean": "국어",
    "social": "사회",
    "science": "과학"
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
    """학생별 26일 실전 학습 스케줄 생성"""
    name = student_data["name"]
    grade = student_data["grade"]
    subjects = student_data["subjects"]
    
    prioritized_subjects = prioritize_subjects(subjects)
    
    schedule = {
        "student_name": name,
        "grade": grade,
        "start_date": "2026-01-05",
        "end_date": "2026-01-30",
        "total_days": 26,
        "daily_schedules": []
    }
    
    start_date = datetime(2026, 1, 5)
    
    for day in range(26):
        current_date = start_date + timedelta(days=day)
        date_str = current_date.strftime("%Y-%m-%d")
        weekday = current_date.strftime("%A")
        weekday_kr = {
            "Monday": "월요일", "Tuesday": "화요일", "Wednesday": "수요일",
            "Thursday": "목요일", "Friday": "금요일", "Saturday": "토요일", "Sunday": "일요일"
        }[weekday]
        
        is_weekend = weekday in ["Saturday", "Sunday"]
        subjects_per_day = 3 if is_weekend else 5
        
        daily_tasks_morning = []
        daily_tasks_afternoon = []
        total_minutes = 0
        
        for i in range(min(subjects_per_day, len(prioritized_subjects))):
            subj_idx = (day + i) % len(prioritized_subjects)
            subj_en, level, _ = prioritized_subjects[subj_idx]
            subj_kr = SUBJECT_MAPPING[subj_en]
            
            # 실제 학습 방법 가져오기
            method = get_learning_method(grade, subj_en, level, day)
            
            if method:
                # 기초/표준: 복습 메시지 추가
                tip = method["tip"]
                if level in ["기초", "표준"]:
                    tip += " [💡 이전 학년 복습 필수]"
                
                # 심화 레벨 3~4주차: 예습 권장
                if level == "심화" and day >= 14:
                    tip += " [🔥 다음 학년 미리보기]"
                
                task = {
                    "subject": subj_kr,
                    "level": level,
                    "duration_minutes": method["duration"],
                    "unit": method["unit"],
                    "keyword": method["keyword"],
                    "tip": tip,
                    "step1": method["step1"],
                    "step2": method["step2"],
                    "step3": method["step3"],
                    "time_of_day": "오전" if i < 3 else "오후"
                }
                
                if i < 3:
                    daily_tasks_morning.append(task)
                else:
                    daily_tasks_afternoon.append(task)
                    
                total_minutes += method["duration"]
        
        daily_tasks = daily_tasks_morning + daily_tasks_afternoon
        
        if len(daily_tasks) > 1:
            total_minutes += (len(daily_tasks) - 1) * 10
        
        daily_goal = f"{len(daily_tasks)}과목 학습 완료 (오전 {len(daily_tasks_morning)}과목, 오후 {len(daily_tasks_afternoon)}과목)"
        if day % 7 == 6:
            daily_goal += " + 주간 복습"
        
        # 복습 및 3월 시험 관련 메시지 추가
        motivational_message = ""
        if day % 5 == 0:
            motivational_message = "💪 복습이 가장 중요합니다! 오늘 배운 내용을 다시 한 번 훑어보세요."
        elif day % 7 == 3:
            motivational_message = "📚 3월 새학년 시험은 전 학년 개념 완료를 묻습니다. 기초부터 탄탄히!"
        elif day == 13:
            motivational_message = "🎯 3주차 시작! 지금까지 배운 내용을 꼭 복습하세요."
        elif day == 20:
            motivational_message = "🚀 마지막 주차! 전체 내용을 정리하며 마무리합시다."
        
        schedule["daily_schedules"].append({
            "day": day + 1,
            "date": date_str,
            "weekday": weekday_kr,
            "is_weekend": is_weekend,
            "total_minutes": total_minutes,
            "tasks": daily_tasks,
            "tasks_morning": daily_tasks_morning,
            "tasks_afternoon": daily_tasks_afternoon,
            "daily_goal": daily_goal,
            "notes": f"{'주말 - 복습 중심' if is_weekend else '평일 - 오전 3과목, 오후 2과목'}",
            "motivational_message": motivational_message
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
        
        print(f"✅ {name} ({student['grade']}) - EBS 기반 실전 스케줄 생성 중...")
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
                    "시간대": task["time_of_day"],
                    "과목": task["subject"],
                    "레벨": task["level"],
                    "학습시간": f"{task['duration_minutes']}분",
                    "단원": task["unit"],
                    "학습팁": task["tip"],
                    "1단계_이해": task["step1"],
                    "2단계_연습": task["step2"],
                    "3단계_점검": task["step3"]
                }
                rows.append(row)
    
    if rows:
        with open(filename, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        print(f"📁 CSV 저장: {filename}")


if __name__ == "__main__":
    print("🚀 EBS 기반 실전 학습 스케줄 생성 시작...\n")
    print("📅 기간: 2026년 1월 5일(월) ~ 1월 30일(금) - 4주 (26일간)\n")
    print("📚 자기주도학습 3단계: 이해 → 연습 → 점검\n")
    print("🎯 활용 자료: EBS 중학 무료강의 + EBS AI 단추 문제은행\n")
    
    schedules = generate_all_schedules()
    
    print(f"\n✅ 총 {len(schedules)}명의 실전 스케줄 생성 완료!\n")
    
    timestamp = "2026-01-v4-ebs"
    
    json_file = f"학생별_맞춤_스케줄_{timestamp}.json"
    csv_file = f"학생별_맞춤_스케줄_{timestamp}.csv"
    
    save_schedules_json(schedules, json_file)
    save_schedules_csv(schedules, csv_file)
    
    print("\n" + "="*60)
    print("✨ EBS 기반 실전 학습 스케줄 생성 완료!")
    print("="*60)
