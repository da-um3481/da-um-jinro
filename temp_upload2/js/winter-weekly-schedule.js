// ❄️ 겨울방학 30일 프로그램 - 주간 학습 스케줄 관리 스크립트
// 평일 3.5시간 + 주말 5시간 (주간 25시간) / 하루 3과목 학습

let currentStudent = null;
let currentSchedule = null;

// ⏰ 평일/주말 학습 시간 (분 단위)
const WEEKDAY_HOURS = 3.5; // 평일 3.5시간 (210분)
const WEEKEND_HOURS = 5;   // 주말 5시간 (300분)
const WEEKDAY_MINUTES = 210;
const WEEKEND_MINUTES = 300;

// 📚 하루 3과목 학습 시스템
const SUBJECTS_PER_DAY = 3;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadStudentList();
});

// 학생 목록 로드 (이름으로 검색 가능)
async function loadStudentList() {
    try {
        const response = await fetch('tables/students?limit=100');
        const data = await response.json();
        
        // 전역 변수로 저장
        window.allStudents = data.data;
        
    } catch (error) {
        console.error('학생 목록 로드 오류:', error);
    }
}

// 주간 스케줄 로드 (이름으로 검색)
async function loadWeeklySchedule() {
    const studentName = document.getElementById('studentSelect').value.trim();
    if (!studentName) {
        hideSchedule();
        return;
    }
    
    try {
        // 학생 이름으로 검색
        const studentResponse = await fetch('tables/students?limit=100');
        const studentData = await studentResponse.json();
        
        currentStudent = studentData.data.find(s => s.name === studentName);
        
        if (!currentStudent) {
            alert('해당 이름의 학생을 찾을 수 없습니다.');
            return;
        }
        
        // 스케줄 로드
        const scheduleResponse = await fetch('tables/weekly_schedules?limit=100');
        const scheduleData = await scheduleResponse.json();
        
        currentSchedule = scheduleData.data.find(s => s.student_id === currentStudent.id);
        
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

// 🎯 자동 스케줄 생성 (3과목/일, 210분 평일, 300분 주말)
async function generateAutoSchedule() {
    const studentName = document.getElementById('studentSelect').value.trim();
    if (!studentName) {
        alert('학생 이름을 먼저 입력해주세요.');
        return;
    }
    
    if (!currentStudent) {
        const studentResponse = await fetch('tables/students?limit=100');
        const studentData = await studentResponse.json();
        currentStudent = studentData.data.find(s => s.name === studentName);
        
        if (!currentStudent) {
            alert('해당 이름의 학생을 찾을 수 없습니다.');
            return;
        }
    }
    
    try {
        // 평일 스케줄 생성 (3.5시간 = 210분, 3과목)
        const weekdaySchedule = generateWeekdaySchedule();
        
        // 주말 스케줄 생성 (5시간 = 300분, 3과목)
        const weekendSchedule = generateWeekendSchedule();
        
        // 스케줄 데이터 준비
        const scheduleData = {
            student_id: currentStudent.id,
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
            alert('✅ 주간 스케줄이 자동으로 생성되었습니다!\n\n평일: 3.5시간 (3과목)\n주말: 5시간 (3과목)\n주간 총 학습 시간: 25시간');
            await loadWeeklySchedule();
        }
        
    } catch (error) {
        console.error('스케줄 생성 오류:', error);
        alert('스케줄 생성에 실패했습니다.');
    }
}

// 📅 평일 스케줄 생성 (3.5시간 = 210분, 3과목)
function generateWeekdaySchedule() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const schedule = {};
    
    // 과목 순환 (3과목/일)
    const subjectRotation = [
        ['수학', '영어', '국어'],   // 월: 수학 70분, 영어 70분, 국어 70분
        ['수학', '과학', '영어'],   // 화: 수학 70분, 과학 70분, 영어 70분
        ['수학', '영어', '사회'],   // 수: 수학 70분, 영어 70분, 사회 70분
        ['수학', '국어', '과학'],   // 목: 수학 70분, 국어 70분, 과학 70분
        ['수학', '영어', '복습']    // 금: 수학 70분, 영어 70분, 주간복습 70분
    ];
    
    days.forEach((day, index) => {
        const subjects = subjectRotation[index];
        
        schedule[day] = [
            {
                time: '15:00-16:10',
                duration: 70,
                type: '주요과목 학습',
                subject: subjects[0],
                content: getSubjectContent(subjects[0], 1),
                importance: subjects[0] === '수학' ? '높음' : '보통'
            },
            {
                time: '16:10-17:20',
                duration: 70,
                type: '주요과목 학습',
                subject: subjects[1],
                content: getSubjectContent(subjects[1], 2),
                importance: subjects[1] === '영어' ? '높음' : '보통'
            },
            {
                time: '17:20-18:30',
                duration: 70,
                type: subjects[2] === '복습' ? '주간 복습' : '주요과목 학습',
                subject: subjects[2],
                content: getSubjectContent(subjects[2], 3),
                importance: subjects[2] === '복습' ? '높음' : '보통'
            }
        ];
    });
    
    return schedule;
}

// 🏖️ 주말 스케줄 생성 (5시간 = 300분, 3과목)
function generateWeekendSchedule() {
    return {
        saturday: [
            {
                time: '09:00-11:00',
                duration: 120,
                type: '주간 총복습',
                subject: '수학',
                content: '이번 주 배운 수학 전체 복습 및 문제 풀이',
                importance: '높음'
            },
            {
                time: '11:00-12:40',
                duration: 100,
                type: '주간 총복습',
                subject: '영어',
                content: '이번 주 배운 영어 전체 복습 (문법, 독해, 단어)',
                importance: '높음'
            },
            {
                time: '12:40-14:00',
                duration: 80,
                type: '문제풀이',
                subject: '과학',
                content: '과학 단원 문제 풀이 및 오답 정리',
                importance: '보통'
            }
        ],
        sunday: [
            {
                time: '09:00-11:00',
                duration: 120,
                type: '문제풀이',
                subject: '수학',
                content: '수학 심화 문제 풀이 및 오답 정리',
                importance: '높음'
            },
            {
                time: '11:00-12:40',
                duration: 100,
                type: '주간 총복습',
                subject: '국어',
                content: '국어 독해 복습 및 문법 정리',
                importance: '보통'
            },
            {
                time: '12:40-14:00',
                duration: 80,
                type: '다음 주 예습',
                subject: '다음 주 준비',
                content: '다음 주에 배울 내용 미리 읽어보기 및 계획 수립',
                importance: '보통'
            }
        ]
    };
}

// 과목별 학습 내용 생성
function getSubjectContent(subject, sessionNumber) {
    const contents = {
        '수학': [
            '교재 개념 학습 및 기본 문제 풀이',
            '교재 문제 풀이 (심화 포함)',
            '수학 단원 종합 문제 풀이'
        ],
        '영어': [
            '영어 교재 Grammar 학습 및 연습',
            '영어 독해 지문 학습 (3-5지문)',
            '영어 단어 암기 및 복습'
        ],
        '국어': [
            '국어 독해 지문 학습 (3-4지문)',
            '국어 문법 개념 정리',
            '국어 종합 복습'
        ],
        '과학': [
            '과학 교재 개념 학습',
            '과학 실험 정리 및 문제 풀이',
            '과학 단원 복습'
        ],
        '사회': [
            '사회 교재 개념 학습',
            '사회 자료 분석 및 정리',
            '사회 단원 복습'
        ],
        '복습': [
            '이번 주 틀린 문제 다시 풀기',
            '주간 전체 복습 (모든 과목)',
            '주간 학습 마무리 및 점검'
        ]
    };
    
    return contents[subject] ? contents[subject][sessionNumber - 1] : `${subject} 학습`;
}

// 📊 스케줄 표시
function displaySchedule() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        const scheduleData = JSON.parse(currentSchedule[day] || '[]');
        const container = document.getElementById(`${day}Schedule`);
        
        if (scheduleData.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">스케줄이 없습니다.</p>';
            return;
        }
        
        // 총 학습 시간 계산
        const totalMinutes = scheduleData.reduce((sum, item) => sum + item.duration, 0);
        const totalHours = (totalMinutes / 60).toFixed(1);
        
        container.innerHTML = scheduleData.map((item, index) => {
            const typeColor = getTypeColor(item.type);
            const hours = Math.floor(item.duration / 60);
            const minutes = item.duration % 60;
            const durationText = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
            
            return `
                <div class="bg-white rounded-lg p-4 border-l-4 border-${typeColor}-500 hover:shadow-md transition mb-3">
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
        }).join('') + `
            <div class="mt-3 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border-2 border-cyan-300">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-gray-700">총 학습 시간</span>
                    <span class="text-lg font-black text-cyan-600">${totalHours}시간 (${scheduleData.length}과목)</span>
                </div>
            </div>
        `;
    });
}

// 🎨 유형별 색상
function getTypeColor(type) {
    const colors = {
        '학교수업 복습': 'blue',
        '주요과목 학습': 'green',
        '주간 총복습': 'purple',
        '문제풀이': 'red',
        '오답정리': 'orange',
        '휴식': 'gray',
        '다음 주 예습': 'indigo',
        '주간 복습': 'orange'
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

// 📌 학습 시간 통계 정보
function getWeeklyStats() {
    return {
        weekdayHours: WEEKDAY_HOURS,
        weekendHours: WEEKEND_HOURS,
        totalWeeklyHours: (WEEKDAY_HOURS * 5) + (WEEKEND_HOURS * 2), // 25시간
        subjectsPerDay: SUBJECTS_PER_DAY
    };
}
