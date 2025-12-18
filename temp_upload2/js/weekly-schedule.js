// 주간 학습 스케줄 관리 스크립트

let currentStudent = null;
let currentSchedule = null;

// 평일/주말 학습 시간 (분 단위)
const WEEKDAY_HOURS = 4; // 평일 4시간
const WEEKEND_HOURS = 6; // 주말 6시간

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadStudentList();
});

// 학생 목록 로드
async function loadStudentList() {
    try {
        const response = await fetch('tables/students?limit=100');
        const data = await response.json();
        
        const select = document.getElementById('studentSelect');
        select.innerHTML = '<option value="">학생을 선택하세요</option>';
        
        data.data.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} (${student.grade}학년 ${student.class_num}반)`;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('학생 목록 로드 오류:', error);
    }
}

// 주간 스케줄 로드
async function loadWeeklySchedule() {
    const studentId = document.getElementById('studentSelect').value;
    if (!studentId) {
        hideSchedule();
        return;
    }
    
    try {
        // 학생 정보 로드
        const studentResponse = await fetch(`tables/students/${studentId}`);
        currentStudent = await studentResponse.json();
        
        // 스케줄 로드
        const scheduleResponse = await fetch('tables/weekly_schedules?limit=100');
        const scheduleData = await scheduleResponse.json();
        
        currentSchedule = scheduleData.data.find(s => s.student_id === studentId);
        
        if (currentSchedule) {
            displaySchedule();
        } else {
            // 스케줄이 없으면 자동 생성 제안
            if (confirm('이 학생의 주간 스케줄이 없습니다. 자동으로 생성하시겠습니까?')) {
                await generateAutoSchedule();
            }
        }
        
        showSchedule();
        
    } catch (error) {
        console.error('스케줄 로드 오류:', error);
    }
}

// 자동 스케줄 생성
async function generateAutoSchedule() {
    const studentId = document.getElementById('studentSelect').value;
    if (!studentId) {
        alert('학생을 먼저 선택해주세요.');
        return;
    }
    
    if (!currentStudent) {
        const studentResponse = await fetch(`tables/students/${studentId}`);
        currentStudent = await studentResponse.json();
    }
    
    try {
        // 이번 주 학교 수업 로드
        const lessonsResponse = await fetch('tables/school_lessons?limit=100');
        const lessonsData = await lessonsResponse.json();
        
        const thisWeekLessons = lessonsData.data.filter(l => 
            l.grade === currentStudent.grade
        );
        
        // 평일 스케줄 생성 (학교 수업 복습 + 주요 과목)
        const weekdaySchedule = generateWeekdaySchedule(thisWeekLessons);
        
        // 주말 스케줄 생성 (주간 복습 + 문제풀이)
        const weekendSchedule = generateWeekendSchedule();
        
        // 스케줄 데이터 준비
        const scheduleData = {
            student_id: studentId,
            student_name: currentStudent.name,
            student_grade: currentStudent.grade,
            monday: JSON.stringify(weekdaySchedule.monday),
            tuesday: JSON.stringify(weekdaySchedule.tuesday),
            wednesday: JSON.stringify(weekdaySchedule.wednesday),
            thursday: JSON.stringify(weekdaySchedule.thursday),
            friday: JSON.stringify(weekdaySchedule.friday),
            saturday: JSON.stringify(weekendSchedule.saturday),
            sunday: JSON.stringify(weekendSchedule.sunday),
            created_date: new Date().toISOString().split('T')[0]
        };
        
        // 기존 스케줄이 있으면 업데이트, 없으면 새로 생성
        let response;
        if (currentSchedule) {
            response = await fetch(`tables/weekly_schedules/${currentSchedule.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...currentSchedule, ...scheduleData})
            });
        } else {
            response = await fetch('tables/weekly_schedules', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(scheduleData)
            });
        }
        
        if (response.ok) {
            alert('주간 스케줄이 자동으로 생성되었습니다!');
            await loadWeeklySchedule();
        }
        
    } catch (error) {
        console.error('스케줄 생성 오류:', error);
        alert('스케줄 생성에 실패했습니다.');
    }
}

// 평일 스케줄 생성 (4시간 = 240분)
function generateWeekdaySchedule(lessons) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const schedule = {};
    
    days.forEach((day, index) => {
        schedule[day] = [
            {
                time: '15:00-16:00',
                duration: 60,
                type: '학교수업 복습',
                subject: '오늘 배운 내용',
                content: '오늘 학교에서 배운 주요 과목 복습 (노트 정리, 이해 안 되는 부분 체크)',
                importance: '높음'
            },
            {
                time: '16:00-17:30',
                duration: 90,
                type: '주요과목 학습',
                subject: getMainSubject(index),
                content: '교재 개념 학습 및 기본 문제 풀이',
                importance: '높음'
            },
            {
                time: '17:30-18:00',
                duration: 30,
                type: '휴식',
                subject: '저녁 식사',
                content: '충분한 휴식과 식사',
                importance: '보통'
            },
            {
                time: '18:00-19:30',
                duration: 90,
                type: '주요과목 학습',
                subject: getSecondarySubject(index),
                content: '교재 문제 풀이 및 오답 정리',
                importance: '높음'
            }
        ];
    });
    
    return schedule;
}

// 주말 스케줄 생성 (6시간 = 360분)
function generateWeekendSchedule() {
    return {
        saturday: [
            {
                time: '09:00-10:30',
                duration: 90,
                type: '주간 총복습',
                subject: '국어+영어',
                content: '이번 주 배운 국어, 영어 내용 전체 복습 및 핵심 정리',
                importance: '높음'
            },
            {
                time: '10:30-12:00',
                duration: 90,
                type: '주간 총복습',
                subject: '수학',
                content: '이번 주 배운 수학 내용 전체 복습 및 개념 재정리',
                importance: '높음'
            },
            {
                time: '12:00-13:00',
                duration: 60,
                type: '휴식',
                subject: '점심 식사',
                content: '충분한 휴식과 식사',
                importance: '보통'
            },
            {
                time: '13:00-15:00',
                duration: 120,
                type: '문제풀이',
                subject: '수학 단원 문제',
                content: '이번 주 배운 단원의 종합 문제 풀이 (교재, 문제집)',
                importance: '높음'
            },
            {
                time: '15:00-16:00',
                duration: 60,
                type: '오답정리',
                subject: '주간 오답',
                content: '이번 주 틀린 문제 다시 풀기 및 개념 보완',
                importance: '높음'
            }
        ],
        sunday: [
            {
                time: '09:00-10:30',
                duration: 90,
                type: '주간 총복습',
                subject: '과학+사회',
                content: '이번 주 배운 과학, 사회 내용 전체 복습 및 핵심 정리',
                importance: '높음'
            },
            {
                time: '10:30-12:00',
                duration: 90,
                type: '문제풀이',
                subject: '영어 단원 문제',
                content: '이번 주 배운 영어 단원의 종합 문제 풀이 (독해, 문법)',
                importance: '높음'
            },
            {
                time: '12:00-13:00',
                duration: 60,
                type: '휴식',
                subject: '점심 식사',
                content: '충분한 휴식과 식사',
                importance: '보통'
            },
            {
                time: '13:00-15:00',
                duration: 120,
                type: '문제풀이',
                subject: '과학+사회 단원 문제',
                content: '이번 주 배운 과학, 사회 단원의 종합 문제 풀이',
                importance: '높음'
            },
            {
                time: '15:00-16:00',
                duration: 60,
                type: '다음 주 예습',
                subject: '다음 주 준비',
                content: '다음 주에 배울 내용 미리 읽어보기 및 계획 수립',
                importance: '보통'
            }
        ]
    };
}

// 요일별 주요 과목 (순환)
function getMainSubject(dayIndex) {
    const subjects = ['수학', '영어', '수학', '영어', '수학'];
    return subjects[dayIndex];
}

// 요일별 보조 과목 (순환)
function getSecondarySubject(dayIndex) {
    const subjects = ['국어', '과학', '국어', '사회', '과학'];
    return subjects[dayIndex];
}

// 스케줄 표시
function displaySchedule() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        const scheduleData = JSON.parse(currentSchedule[day] || '[]');
        const container = document.getElementById(`${day}Schedule`);
        
        if (scheduleData.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">스케줄이 없습니다.</p>';
            return;
        }
        
        container.innerHTML = scheduleData.map((item, index) => {
            const typeColor = getTypeColor(item.type);
            const totalMinutes = item.duration;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const durationText = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
            
            return `
                <div class="bg-white rounded-lg p-4 border-l-4 border-${typeColor}-500 hover:shadow-md transition">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-1">
                                <span class="px-2 py-1 text-xs bg-${typeColor}-100 text-${typeColor}-700 rounded-full font-semibold">
                                    ${item.type}
                                </span>
                                <span class="text-sm text-gray-600">${item.time}</span>
                                <span class="text-sm font-semibold text-gray-700">${durationText}</span>
                            </div>
                            <h4 class="font-bold text-lg text-gray-900 mb-1">${item.subject}</h4>
                            <p class="text-sm text-gray-600">${item.content}</p>
                        </div>
                        <div>
                            ${item.importance === '높음' ? 
                                '<span class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">중요</span>' : 
                                '<span class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">보통</span>'}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    });
}

// 유형별 색상
function getTypeColor(type) {
    const colors = {
        '학교수업 복습': 'blue',
        '주요과목 학습': 'green',
        '주간 총복습': 'purple',
        '문제풀이': 'red',
        '오답정리': 'orange',
        '휴식': 'gray',
        '다음 주 예습': 'indigo'
    };
    return colors[type] || 'gray';
}

// 스케줄 표시/숨김
function showSchedule() {
    document.getElementById('timeGuideCard').classList.remove('hidden');
    document.getElementById('scheduleSection').classList.remove('hidden');
}

function hideSchedule() {
    document.getElementById('timeGuideCard').classList.add('hidden');
    document.getElementById('scheduleSection').classList.add('hidden');
}

// 요일별 스케줄 수정 (추후 구현)
function editDaySchedule(day) {
    alert(`${getDayKorean(day)} 스케줄 수정 기능은 곧 추가됩니다.`);
}

// 영어 요일 → 한글
function getDayKorean(day) {
    const days = {
        'monday': '월요일',
        'tuesday': '화요일',
        'wednesday': '수요일',
        'thursday': '목요일',
        'friday': '금요일',
        'saturday': '토요일',
        'sunday': '일요일'
    };
    return days[day] || day;
}
