#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
학생별 맞춤형 학습 스케줄 생성기
진단평가 결과를 기반으로 개별 맞춤 학습 스케줄을 생성합니다.
"""

import json
import csv
from datetime import datetime, timedelta
from typing import Dict, List, Any

# 진단평가 결과 데이터 (구글 시트에서 가져온 데이터)
# 실제 데이터로 교체 필요
DIAGNOSTIC_DATA = [
    {
        "name": "김예서",
        "grade": "중2",
        "diagnostic_date": "2026-01-03",
        "total_score": 0,
        "subjects": {
            "math": {"correct": 0, "total": 10, "score": 0, "level": "기초"},
            "english": {"correct": 0, "total": 10, "score": 0, "level": "기초"},
            "korean": {"correct": 0, "total": 10, "score": 0, "level": "기초"},
            "social": {"correct": 0, "total": 10, "score": 0, "level": "기초"},
            "science": {"correct": 0, "total": 10, "score": 0, "level": "기초"}
        }
    },
    {
        "name": "박수은",
        "grade": "중1",
        "diagnostic_date": "2026-01-02",
        "total_score": 348,
        "subjects": {
            "math": {"correct": 10, "total": 10, "score": 73, "level": "기초"},
            "english": {"correct": 10, "total": 10, "score": 73, "level": "기초"},
            "korean": {"correct": 9, "total": 10, "score": 66, "level": "기초"},
            "social": {"correct": 9, "total": 10, "score": 63, "level": "기초"},
            "science": {"correct": 0, "total": 0, "score": 0, "level": "미평가"}
        }
    },
    {
        "name": "윤다운",
        "grade": "중2",
        "diagnostic_date": "2026-01-02",
        "total_score": 408,
        "subjects": {
            "math": {"correct": 9, "total": 10, "score": 86, "level": "표준"},
            "english": {"correct": 9, "total": 10, "score": 86, "level": "표준"},
            "korean": {"correct": 8, "total": 10, "score": 76, "level": "표준"},
            "social": {"correct": 8, "total": 10, "score": 70, "level": "기초"},
            "science": {"correct": 0, "total": 0, "score": 0, "level": "미평가"}
        }
    },
    {
        "name": "이유나",
        "grade": "중2",
        "diagnostic_date": "2026-01-02",
        "total_score": 400,
        "subjects": {
            "math": {"correct": 10, "total": 10, "score": 90, "level": "표준"},
            "english": {"correct": 9, "total": 10, "score": 83, "level": "표준"},
            "korean": {"correct": 8, "total": 10, "score": 73, "level": "기초"},
            "social": {"correct": 8, "total": 10, "score": 70, "level": "기초"},
            "science": {"correct": 0, "total": 0, "score": 0, "level": "미평가"}
        }
    },
    {
        "name": "최희원",
        "grade": "중2",
        "diagnostic_date": "2026-01-02",
        "total_score": 421,
        "subjects": {
            "math": {"correct": 10, "total": 10, "score": 93, "level": "표준"},
            "english": {"correct": 9, "total": 10, "score": 83, "level": "표준"},
            "korean": {"correct": 9, "total": 10, "score": 83, "level": "표준"},
            "social": {"correct": 9, "total": 10, "score": 73, "level": "기초"},
            "science": {"correct": 0, "total": 0, "score": 0, "level": "미평가"}
        }
    }
]

# 제외할 학생 리스트
EXCLUDE_STUDENTS = ["정라미", "테스트"]

# 학습 전략 정의
LEARNING_STRATEGIES = {
    "기초": {
        "duration": 30,  # 분
        "activities": [
            "개념 강의 영상 시청 (10분)",
            "개념 노트 정리 (10분)",
            "기본 문제 3~5개 풀이 (10분)"
        ],
        "difficulty": "easy"
    },
    "표준": {
        "duration": 40,
        "activities": [
            "개념 복습 및 예제 학습 (10분)",
            "응용 문제 5~7개 풀이 (20분)",
            "오답 정리 및 복습 (10분)"
        ],
        "difficulty": "medium"
    },
    "심화": {
        "duration": 50,
        "activities": [
            "심화 개념 학습 (10분)",
            "고난도 문제 7~10개 풀이 (30분)",
            "풀이 과정 정리 및 분석 (10분)"
        ],
        "difficulty": "hard"
    },
    "미평가": {
        "duration": 20,
        "activities": [
            "과목 소개 영상 시청 (10분)",
            "흥미 유발 활동 (10분)"
        ],
        "difficulty": "intro"
    }
}

# 과목 한글-영어 매핑
SUBJECT_MAPPING = {
    "math": "수학",
    "english": "영어",
    "korean": "국어",
    "social": "사회",
    "science": "과학"
}


def prioritize_subjects(subjects: Dict) -> List[tuple]:
    """
    과목 우선순위 결정
    1. 점수가 낮은 과목 우선
    2. 기초 레벨 우선
    """
    subject_list = []
    for subj_en, data in subjects.items():
        if data["level"] == "미평가":
            continue
        
        priority_score = 0
        # 점수가 낮을수록 높은 우선순위
        priority_score += (100 - data["score"]) * 2
        
        # 기초 레벨에 가산점
        if data["level"] == "기초":
            priority_score += 50
        elif data["level"] == "표준":
            priority_score += 20
            
        subject_list.append((subj_en, data, priority_score))
    
    # 우선순위 높은 순으로 정렬
    subject_list.sort(key=lambda x: x[2], reverse=True)
    return subject_list


def create_weekly_schedule(student_data: Dict) -> Dict:
    """
    학생별 주간 학습 스케줄 생성
    """
    name = student_data["name"]
    grade = student_data["grade"]
    subjects = student_data["subjects"]
    
    # 과목 우선순위 결정
    prioritized_subjects = prioritize_subjects(subjects)
    
    # 30일 스케줄 생성 (4주간)
    schedule = {
        "student_name": name,
        "grade": grade,
        "start_date": "2026-01-13",
        "end_date": "2026-02-11",
        "total_days": 30,
        "daily_schedules": []
    }
    
    # 일별 스케줄 생성
    start_date = datetime(2026, 1, 13)
    
    for day in range(30):
        current_date = start_date + timedelta(days=day)
        date_str = current_date.strftime("%Y-%m-%d")
        weekday = current_date.strftime("%A")
        weekday_kr = {
            "Monday": "월요일",
            "Tuesday": "화요일",
            "Wednesday": "수요일",
            "Thursday": "목요일",
            "Friday": "금요일",
            "Saturday": "토요일",
            "Sunday": "일요일"
        }[weekday]
        
        # 주말 여부 확인
        is_weekend = weekday in ["Saturday", "Sunday"]
        
        # 하루 학습 과목 수 결정 (평일 2-3과목, 주말 1-2과목)
        if is_weekend:
            subjects_per_day = min(2, len(prioritized_subjects))
        else:
            subjects_per_day = min(3, len(prioritized_subjects))
        
        daily_tasks = []
        total_minutes = 0
        
        # 순환 방식으로 과목 배정 (우선순위 순)
        for i in range(subjects_per_day):
            subj_idx = (day + i) % len(prioritized_subjects)
            subj_en, subj_data, _ = prioritized_subjects[subj_idx]
            subj_kr = SUBJECT_MAPPING[subj_en]
            level = subj_data["level"]
            score = subj_data["score"]
            
            strategy = LEARNING_STRATEGIES[level]
            
            task = {
                "subject": subj_kr,
                "level": level,
                "score": score,
                "duration_minutes": strategy["duration"],
                "activities": strategy["activities"],
                "difficulty": strategy["difficulty"]
            }
            
            daily_tasks.append(task)
            total_minutes += strategy["duration"]
        
        # 휴식 시간 추가 (과목 사이 10분)
        if len(daily_tasks) > 1:
            total_minutes += (len(daily_tasks) - 1) * 10
        
        # 일일 목표 설정
        daily_goal = f"{len(daily_tasks)}과목 학습 완료"
        if day % 7 == 6:  # 일주일에 한 번
            daily_goal += " + 주간 복습"
        
        schedule["daily_schedules"].append({
            "day": day + 1,
            "date": date_str,
            "weekday": weekday_kr,
            "is_weekend": is_weekend,
            "total_minutes": total_minutes,
            "tasks": daily_tasks,
            "daily_goal": daily_goal,
            "notes": f"{'주말 - 가벼운 복습 중심' if is_weekend else '평일 - 집중 학습'}"
        })
    
    return schedule


def generate_all_schedules():
    """
    모든 학생의 스케줄 생성
    """
    all_schedules = []
    
    for student in DIAGNOSTIC_DATA:
        name = student["name"]
        
        # 제외할 학생 체크
        if name in EXCLUDE_STUDENTS:
            print(f"❌ {name} - 제외됨")
            continue
        
        print(f"✅ {name} - 스케줄 생성 중...")
        schedule = create_weekly_schedule(student)
        all_schedules.append(schedule)
    
    return all_schedules


def save_schedules_json(schedules: List[Dict], filename: str):
    """
    스케줄을 JSON 파일로 저장
    """
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(schedules, f, ensure_ascii=False, indent=2)
    print(f"\n📁 JSON 저장 완료: {filename}")


def save_schedules_csv(schedules: List[Dict], filename: str):
    """
    스케줄을 CSV 파일로 저장
    """
    rows = []
    
    for schedule in schedules:
        student_name = schedule["student_name"]
        grade = schedule["grade"]
        
        for daily in schedule["daily_schedules"]:
            for task_idx, task in enumerate(daily["tasks"], 1):
                row = {
                    "학생명": student_name,
                    "학년": grade,
                    "날짜": daily["date"],
                    "요일": daily["weekday"],
                    "주말여부": "주말" if daily["is_weekend"] else "평일",
                    "과목순서": f"{task_idx}/{len(daily['tasks'])}",
                    "과목": task["subject"],
                    "레벨": task["level"],
                    "점수": task["score"],
                    "학습시간(분)": task["duration_minutes"],
                    "학습활동": " / ".join(task["activities"]),
                    "난이도": task["difficulty"],
                    "일일목표": daily["daily_goal"],
                    "비고": daily["notes"]
                }
                rows.append(row)
    
    if rows:
        with open(filename, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        print(f"📁 CSV 저장 완료: {filename}")


def save_schedules_markdown(schedules: List[Dict], filename: str):
    """
    스케줄을 마크다운 파일로 저장
    """
    with open(filename, 'w', encoding='utf-8') as f:
        f.write("# 🎓 학생별 맞춤형 학습 스케줄 (30일)\n\n")
        f.write(f"**생성일**: {datetime.now().strftime('%Y년 %m월 %d일')}\n\n")
        f.write("**기간**: 2026년 1월 13일 ~ 2026년 2월 11일 (30일간)\n\n")
        f.write("---\n\n")
        
        for schedule in schedules:
            name = schedule["student_name"]
            grade = schedule["grade"]
            
            f.write(f"## 📚 {name} ({grade})\n\n")
            
            # 주차별로 그룹핑
            for week in range(5):
                week_start = week * 7
                week_end = min(week_start + 7, 30)
                
                if week_start >= 30:
                    break
                
                f.write(f"### 📅 {week + 1}주차 (Day {week_start + 1} ~ Day {week_end})\n\n")
                
                for day_idx in range(week_start, week_end):
                    if day_idx >= len(schedule["daily_schedules"]):
                        break
                    
                    daily = schedule["daily_schedules"][day_idx]
                    
                    f.write(f"#### Day {daily['day']} - {daily['date']} ({daily['weekday']})\n\n")
                    f.write(f"**총 학습시간**: {daily['total_minutes']}분  \n")
                    f.write(f"**일일 목표**: {daily['daily_goal']}  \n")
                    f.write(f"**비고**: {daily['notes']}\n\n")
                    
                    for task_idx, task in enumerate(daily["tasks"], 1):
                        f.write(f"**{task_idx}. {task['subject']}** ({task['level']}, {task['score']}점) - {task['duration_minutes']}분\n")
                        for activity in task["activities"]:
                            f.write(f"   - {activity}\n")
                        f.write("\n")
                    
                    f.write("---\n\n")
                
                f.write("\n")
            
            f.write("\n\n")
    
    print(f"📁 Markdown 저장 완료: {filename}")


def print_summary(schedules: List[Dict]):
    """
    생성된 스케줄 요약 출력
    """
    print("\n" + "="*60)
    print("📊 학습 스케줄 생성 완료 요약")
    print("="*60)
    
    for schedule in schedules:
        name = schedule["student_name"]
        grade = schedule["grade"]
        total_days = schedule["total_days"]
        
        print(f"\n👤 {name} ({grade})")
        print(f"   - 총 학습 일수: {total_days}일")
        
        # 과목별 총 학습 시간 계산
        subject_times = {}
        for daily in schedule["daily_schedules"]:
            for task in daily["tasks"]:
                subj = task["subject"]
                if subj not in subject_times:
                    subject_times[subj] = 0
                subject_times[subj] += task["duration_minutes"]
        
        print("   - 과목별 총 학습 시간:")
        for subj, minutes in sorted(subject_times.items(), key=lambda x: x[1], reverse=True):
            hours = minutes // 60
            mins = minutes % 60
            print(f"      • {subj}: {hours}시간 {mins}분")


if __name__ == "__main__":
    print("🚀 학생별 맞춤형 학습 스케줄 생성 시작...\n")
    
    # 스케줄 생성
    schedules = generate_all_schedules()
    
    print(f"\n✅ 총 {len(schedules)}명의 스케줄 생성 완료!\n")
    
    # 파일 저장
    timestamp = datetime.now().strftime("%Y-%m")
    
    json_file = f"학생별_맞춤_스케줄_{timestamp}.json"
    csv_file = f"학생별_맞춤_스케줄_{timestamp}.csv"
    md_file = f"학생별_맞춤_스케줄_{timestamp}.md"
    
    save_schedules_json(schedules, json_file)
    save_schedules_csv(schedules, csv_file)
    save_schedules_markdown(schedules, md_file)
    
    # 요약 출력
    print_summary(schedules)
    
    print("\n" + "="*60)
    print("✨ 모든 작업이 완료되었습니다!")
    print("="*60)
