// 선행학습 프로그램 관리 스크립트

let currentStudent = null;
let currentPlan = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadStudentList();
    initAdvancedMaterialsData();
});

// 학생 목록 로드
async function loadStudentList() {
    try {
        const response = await fetch('tables/students?limit=100');
        const data = await response.json();
        
        // 상위권 학생만 필터링 (평균 80점 이상)
        const topStudents = data.data.filter(student => {
            const avgScore = calculateAverageScore(student);
            return avgScore >= 80;
        });
        
        const select = document.getElementById('studentSelect');
        const planSelect = document.getElementById('planStudentSelect');
        
        select.innerHTML = '<option value="">학생을 선택하세요</option>';
        planSelect.innerHTML = '<option value="">선택하세요</option>';
        
        topStudents.forEach(student => {
            const avgScore = calculateAverageScore(student);
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} (${student.grade}학년 ${student.class_num}반) - 평균 ${avgScore.toFixed(1)}점`;
            select.appendChild(option);
            
            const option2 = option.cloneNode(true);
            planSelect.appendChild(option2);
        });
        
        if (topStudents.length === 0) {
            select.innerHTML = '<option value="">평균 80점 이상 학생이 없습니다</option>';
        }
        
    } catch (error) {
        console.error('학생 목록 로드 오류:', error);
    }
}

// 평균 성적 계산
function calculateAverageScore(student) {
    const scores = [
        student.korean_score || 0,
        student.english_score || 0,
        student.math_score || 0,
        student.science_score || 0,
        student.social_score || 0
    ];
    const validScores = scores.filter(s => s > 0);
    return validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
}

// 선행학습 계획 로드
async function loadStudentAdvancedPlan() {
    const studentId = document.getElementById('studentSelect').value;
    if (!studentId) {
        hideAllSections();
        return;
    }
    
    try {
        // 학생 정보 로드
        const studentResponse = await fetch(`tables/students/${studentId}`);
        currentStudent = await studentResponse.json();
        
        // 선행학습 계획 로드
        const planResponse = await fetch('tables/advanced_plans?limit=100');
        const planData = await planResponse.json();
        
        currentPlan = planData.data.find(p => p.student_id === studentId);
        
        if (currentPlan) {
            displayStudentInfo();
            displayAdvancedTarget();
            displaySubjectProgress();
            displayMaterials();
            displayWeeklyPlan();
        } else {
            displayStudentInfo();
            alert('선행학습 계획이 없습니다. 새로 생성해주세요.');
        }
        
    } catch (error) {
        console.error('선행학습 계획 로드 오류:', error);
    }
}

// 학생 정보 표시
function displayStudentInfo() {
    document.getElementById('studentInfoCard').classList.remove('hidden');
    document.getElementById('studentName').textContent = currentStudent.name;
    document.getElementById('studentInfo').textContent = 
        `${currentStudent.grade}학년 ${currentStudent.class_num}반 - 평균 ${calculateAverageScore(currentStudent).toFixed(1)}점`;
    
    if (currentPlan) {
        document.getElementById('advancedProgress').textContent = 
            (currentPlan.overall_progress || 0).toFixed(0) + '%';
    }
}

// 선행 목표 표시
function displayAdvancedTarget() {
    document.getElementById('advancedTargetCard').classList.remove('hidden');
    
    const rangeText = currentPlan.target_range === 'next_semester' ? 
        '다음 학기' : '고등학교 1학년 1학기';
    
    document.getElementById('targetRange').textContent = rangeText;
    document.getElementById('targetProgress').textContent = currentPlan.target_progress + '%';
    document.getElementById('targetDuration').textContent = currentPlan.duration + '주';
}

// 과목별 진도 표시
function displaySubjectProgress() {
    document.getElementById('subjectProgressSection').classList.remove('hidden');
    
    const subjects = JSON.parse(currentPlan.subjects || '[]');
    const container = document.getElementById('subjectProgressContainer');
    
    container.innerHTML = subjects.map(subject => {
        const progress = currentPlan[`${subject}_progress`] || 0;
        const color = getSubjectColor(subject);
        
        return `
            <div class="border rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-semibold text-lg">${subject}</h4>
                    <span class="text-${color}-600 font-bold">${progress}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="bg-${color}-500 h-3 rounded-full transition-all" style="width: ${progress}%"></div>
                </div>
                <div class="mt-2 text-sm text-gray-600">
                    목표: ${currentPlan.target_progress}% | 
                    ${progress >= currentPlan.target_progress ? '✓ 달성' : `${currentPlan.target_progress - progress}% 남음`}
                </div>
            </div>
        `;
    }).join('');
}

// 추천 교재 표시
function displayMaterials() {
    document.getElementById('materialsSection').classList.remove('hidden');
    
    const targetRange = currentPlan.target_range;
    const subjects = JSON.parse(currentPlan.subjects || '[]');
    
    const materials = getRecommendedMaterials(targetRange, subjects);
    
    const container = document.getElementById('materialsContainer');
    container.innerHTML = materials.map(material => {
        const typeIcon = material.type === 'EBS강의' ? 
            '<i class="fas fa-video text-red-500"></i>' : 
            '<i class="fas fa-book text-blue-500"></i>';
        
        return `
            <div class="border rounded-lg p-6 hover:shadow-lg transition">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <div class="flex items-center space-x-2 mb-2">
                            ${typeIcon}
                            <span class="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">${material.subject}</span>
                        </div>
                        <h4 class="font-bold text-lg">${material.title}</h4>
                    </div>
                </div>
                <p class="text-sm text-gray-600 mb-4">${material.description}</p>
                <div class="space-y-2 mb-4">
                    <div class="text-sm"><strong>대상:</strong> ${material.target}</div>
                    <div class="text-sm"><strong>특징:</strong> ${material.features}</div>
                    ${material.chapters ? `<div class="text-sm"><strong>주요 단원:</strong> ${material.chapters}</div>` : ''}
                </div>
                ${material.url ? `
                    <a href="${material.url}" target="_blank" class="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
                        <i class="fas fa-external-link-alt mr-2"></i>바로가기
                    </a>
                ` : ''}
            </div>
        `;
    }).join('');
}

// 주간 계획 표시
async function displayWeeklyPlan() {
    document.getElementById('weeklyPlanSection').classList.remove('hidden');
    
    try {
        const response = await fetch('tables/advanced_weekly_plans?limit=100');
        const data = await response.json();
        
        const plans = data.data
            .filter(p => p.plan_id === currentPlan.id)
            .sort((a, b) => a.week_number - b.week_number);
        
        const container = document.getElementById('weeklyPlanContainer');
        
        if (plans.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-calendar-plus text-4xl mb-4"></i>
                    <p>아직 주간 계획이 없습니다. 계획을 추가해주세요.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = plans.map(plan => {
            const completed = plan.completed || false;
            const statusColor = completed ? 'green' : 'gray';
            const statusIcon = completed ? 'fa-check-circle' : 'fa-circle';
            
            return `
                <div class="border rounded-lg p-4 ${completed ? 'bg-green-50' : 'bg-white'}">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-2">
                                <i class="fas ${statusIcon} text-${statusColor}-600"></i>
                                <span class="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">${plan.subject}</span>
                                <span class="font-semibold">${plan.week_number}주차</span>
                            </div>
                            <h4 class="font-bold mb-1">${plan.chapter}</h4>
                            <p class="text-sm text-gray-600 mb-2">${plan.content}</p>
                            <div class="text-xs text-gray-500">
                                <i class="fas fa-clock mr-1"></i>예상 시간: ${plan.estimated_hours}시간
                            </div>
                        </div>
                        <div class="ml-4">
                            ${!completed ? `
                                <button onclick="completeWeeklyPlan('${plan.id}')" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">
                                    완료 체크
                                </button>
                            ` : `
                                <span class="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                                    ✓ 완료
                                </span>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('주간 계획 로드 오류:', error);
    }
}

// 선행학습 계획 생성
async function createAdvancedPlan() {
    const studentId = document.getElementById('planStudentSelect').value;
    const range = document.getElementById('planRange').value;
    const targetProgress = parseInt(document.getElementById('planTargetProgress').value);
    const duration = parseInt(document.getElementById('planDuration').value);
    
    const subjects = Array.from(document.querySelectorAll('.subject-check:checked'))
        .map(cb => cb.value);
    
    if (!studentId || subjects.length === 0) {
        alert('학생과 과목을 선택해주세요.');
        return;
    }
    
    try {
        const plan = {
            student_id: studentId,
            target_range: range,
            target_progress: targetProgress,
            duration: duration,
            subjects: JSON.stringify(subjects),
            overall_progress: 0,
            created_date: new Date().toISOString().split('T')[0]
        };
        
        // 과목별 진도율 초기화
        subjects.forEach(subject => {
            plan[`${subject}_progress`] = 0;
        });
        
        const response = await fetch('tables/advanced_plans', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(plan)
        });
        
        if (response.ok) {
            alert('선행학습 계획이 생성되었습니다!');
            closeCreatePlanModal();
            document.getElementById('studentSelect').value = studentId;
            await loadStudentAdvancedPlan();
        }
        
    } catch (error) {
        console.error('계획 생성 오류:', error);
        alert('계획 생성에 실패했습니다.');
    }
}

// 주간 계획 추가
async function addWeeklyPlan() {
    if (!currentPlan) {
        alert('선행학습 계획을 먼저 생성해주세요.');
        return;
    }
    
    const subject = document.getElementById('weeklySubject').value;
    const chapter = document.getElementById('weeklyChapter').value;
    const content = document.getElementById('weeklyContent').value;
    const hours = parseInt(document.getElementById('weeklyHours').value);
    
    if (!chapter || !content) {
        alert('모든 항목을 입력해주세요.');
        return;
    }
    
    try {
        // 현재 주차 번호 계산
        const plansResponse = await fetch('tables/advanced_weekly_plans?limit=100');
        const plansData = await plansResponse.json();
        const existingPlans = plansData.data.filter(p => p.plan_id === currentPlan.id);
        const weekNumber = existingPlans.length + 1;
        
        const weeklyPlan = {
            plan_id: currentPlan.id,
            student_id: currentStudent.id,
            week_number: weekNumber,
            subject: subject,
            chapter: chapter,
            content: content,
            estimated_hours: hours,
            completed: false
        };
        
        const response = await fetch('tables/advanced_weekly_plans', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(weeklyPlan)
        });
        
        if (response.ok) {
            alert('주간 계획이 추가되었습니다!');
            closeAddWeeklyPlanModal();
            await displayWeeklyPlan();
        }
        
    } catch (error) {
        console.error('주간 계획 추가 오류:', error);
        alert('주간 계획 추가에 실패했습니다.');
    }
}

// 주간 계획 완료 체크
async function completeWeeklyPlan(planId) {
    try {
        const response = await fetch(`tables/advanced_weekly_plans/${planId}`);
        const plan = await response.json();
        
        plan.completed = true;
        plan.completed_date = new Date().toISOString().split('T')[0];
        
        const updateResponse = await fetch(`tables/advanced_weekly_plans/${planId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(plan)
        });
        
        if (updateResponse.ok) {
            // 과목별 진도율 업데이트
            await updateSubjectProgress(plan.subject);
            await displayWeeklyPlan();
            await displaySubjectProgress();
        }
        
    } catch (error) {
        console.error('완료 체크 오류:', error);
    }
}

// 과목별 진도율 업데이트
async function updateSubjectProgress(subject) {
    try {
        // 해당 과목의 전체 계획과 완료된 계획 계산
        const response = await fetch('tables/advanced_weekly_plans?limit=100');
        const data = await response.json();
        
        const subjectPlans = data.data.filter(p => 
            p.plan_id === currentPlan.id && p.subject === subject
        );
        const completedPlans = subjectPlans.filter(p => p.completed);
        
        const progress = subjectPlans.length > 0 ? 
            (completedPlans.length / subjectPlans.length * 100).toFixed(0) : 0;
        
        // 전체 계획 업데이트
        currentPlan[`${subject}_progress`] = parseInt(progress);
        
        // 전체 진도율 계산
        const subjects = JSON.parse(currentPlan.subjects || '[]');
        let totalProgress = 0;
        subjects.forEach(s => {
            totalProgress += currentPlan[`${s}_progress`] || 0;
        });
        currentPlan.overall_progress = (totalProgress / subjects.length).toFixed(0);
        
        await fetch(`tables/advanced_plans/${currentPlan.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(currentPlan)
        });
        
        displayStudentInfo();
        
    } catch (error) {
        console.error('진도율 업데이트 오류:', error);
    }
}

// 모달 열기/닫기
function openCreatePlanModal() {
    document.getElementById('createPlanModal').classList.remove('hidden');
}

function closeCreatePlanModal() {
    document.getElementById('createPlanModal').classList.add('hidden');
}

function openAddWeeklyPlanModal() {
    if (!currentPlan) {
        alert('선행학습 계획을 먼저 선택해주세요.');
        return;
    }
    document.getElementById('addWeeklyPlanModal').classList.remove('hidden');
}

function closeAddWeeklyPlanModal() {
    document.getElementById('addWeeklyPlanModal').classList.add('hidden');
}

// 모든 섹션 숨기기
function hideAllSections() {
    document.getElementById('studentInfoCard').classList.add('hidden');
    document.getElementById('advancedTargetCard').classList.add('hidden');
    document.getElementById('subjectProgressSection').classList.add('hidden');
    document.getElementById('materialsSection').classList.add('hidden');
    document.getElementById('weeklyPlanSection').classList.add('hidden');
}

// 과목 색상
function getSubjectColor(subject) {
    const colors = {
        '수학': 'green',
        '영어': 'blue',
        '과학': 'purple',
        '국어': 'red',
        '사회': 'orange'
    };
    return colors[subject] || 'gray';
}

// 추천 교재 데이터 (선행학습용)
function getRecommendedMaterials(targetRange, subjects) {
    const materials = {
        'next_semester': {
            '수학': [
                {
                    type: '교재',
                    subject: '수학',
                    title: '신사고 쎈 수학 (다음 학기)',
                    description: '개념부터 심화까지 단계별 학습',
                    target: '중등 선행학습',
                    features: '개념 정리, 유형별 문제, 심화 문제',
                    chapters: '다항식, 방정식, 부등식, 함수'
                },
                {
                    type: 'EBS강의',
                    subject: '수학',
                    title: 'EBS 중학 수학 선행 강의',
                    description: '다음 학기 수학 개념 완벽 정리',
                    target: '중등 선행학습',
                    features: '개념 강의, 문제 풀이, 핵심 정리',
                    url: 'https://www.ebs.co.kr'
                }
            ],
            '영어': [
                {
                    type: '교재',
                    subject: '영어',
                    title: '능률 보카 어원편',
                    description: '어근으로 배우는 고급 어휘',
                    target: '중등 선행학습',
                    features: '어원 학습, 문맥 활용, 연습 문제',
                    chapters: '접두사, 어근, 접미사'
                },
                {
                    type: 'EBS강의',
                    subject: '영어',
                    title: 'EBS 중학 영어 독해',
                    description: '다음 학기 독해 실력 향상',
                    target: '중등 선행학습',
                    features: '독해 전략, 지문 분석, 문제 풀이',
                    url: 'https://www.ebs.co.kr'
                }
            ],
            '과학': [
                {
                    type: '교재',
                    subject: '과학',
                    title: '완자 과학 (다음 학기)',
                    description: '탐구 중심 과학 학습서',
                    target: '중등 선행학습',
                    features: '개념 정리, 실험 이해, 서술형 대비',
                    chapters: '화학 반응, 전기, 운동과 에너지'
                },
                {
                    type: 'EBS강의',
                    subject: '과학',
                    title: 'EBS 중학 과학 개념',
                    description: '과학 개념 완벽 마스터',
                    target: '중등 선행학습',
                    features: '개념 강의, 실험 영상, 문제 풀이',
                    url: 'https://www.ebs.co.kr'
                }
            ]
        },
        'high_1_1': {
            '수학': [
                {
                    type: '교재',
                    subject: '수학',
                    title: '수학의 정석 (고등 수학 상)',
                    description: '고등 수학의 기본서',
                    target: '고1 선행학습',
                    features: '체계적 개념, 단계별 문제, 심화 학습',
                    chapters: '다항식, 방정식과 부등식, 도형의 방정식'
                },
                {
                    type: '교재',
                    subject: '수학',
                    title: '개념원리 고등 수학 상',
                    description: '쉬운 설명의 개념서',
                    target: '고1 선행학습',
                    features: '친절한 설명, 개념 정리, 기본 문제',
                    chapters: '다항식의 연산, 방정식, 부등식, 도형'
                },
                {
                    type: 'EBS강의',
                    subject: '수학',
                    title: 'EBS 고1 수학 개념 완성',
                    description: '고등 수학의 기초를 다지는 강의',
                    target: '고1 선행학습',
                    features: '개념 강의, 문제 풀이, 심화 학습',
                    url: 'https://www.ebs.co.kr'
                }
            ],
            '영어': [
                {
                    type: '교재',
                    subject: '영어',
                    title: '수능 어법 기본서',
                    description: '고등 영어 어법의 기초',
                    target: '고1 선행학습',
                    features: '필수 어법 정리, 예문 분석, 연습 문제',
                    chapters: '문장 구조, 동사, 준동사, 관계사'
                },
                {
                    type: '교재',
                    subject: '영어',
                    title: '영어 독해 기본서',
                    description: '고등 독해의 시작',
                    target: '고1 선행학습',
                    features: '독해 전략, 지문 분석, 어휘 학습',
                    chapters: '주제 찾기, 요지 파악, 추론'
                },
                {
                    type: 'EBS강의',
                    subject: '영어',
                    title: 'EBS 고1 영어 듣기',
                    description: '고등 영어 듣기 완벽 대비',
                    target: '고1 선행학습',
                    features: '듣기 전략, 유형별 학습, 실전 문제',
                    url: 'https://www.ebs.co.kr'
                }
            ],
            '과학': [
                {
                    type: '교재',
                    subject: '과학',
                    title: '완자 통합과학',
                    description: '고1 통합과학의 정석',
                    target: '고1 선행학습',
                    features: '개념 정리, 탐구 활동, 서술형 대비',
                    chapters: '물질과 규칙성, 시스템과 상호작용, 변화와 다양성'
                },
                {
                    type: 'EBS강의',
                    subject: '과학',
                    title: 'EBS 통합과학 개념 완성',
                    description: '고1 과학의 시작',
                    target: '고1 선행학습',
                    features: '개념 강의, 실험 이해, 문제 풀이',
                    url: 'https://www.ebs.co.kr'
                }
            ],
            '국어': [
                {
                    type: '교재',
                    subject: '국어',
                    title: '고등 국어 문학 기본서',
                    description: '문학 개념과 작품 분석',
                    target: '고1 선행학습',
                    features: '갈래별 정리, 작품 분석, 문제 풀이',
                    chapters: '시, 소설, 수필, 극'
                },
                {
                    type: 'EBS강의',
                    subject: '국어',
                    title: 'EBS 고1 국어 독서',
                    description: '독서 영역 완벽 대비',
                    target: '고1 선행학습',
                    features: '독해 전략, 지문 분석, 문제 풀이',
                    url: 'https://www.ebs.co.kr'
                }
            ]
        }
    };
    
    const result = [];
    subjects.forEach(subject => {
        if (materials[targetRange] && materials[targetRange][subject]) {
            result.push(...materials[targetRange][subject]);
        }
    });
    
    return result;
}

// 초기 선행학습 교재 데이터 생성
async function initAdvancedMaterialsData() {
    // 이미 데이터가 있는지 확인
    try {
        const response = await fetch('tables/advanced_materials?limit=1');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            return; // 이미 데이터가 있으면 종료
        }
    } catch (error) {
        // 테이블이 없을 수 있으므로 계속 진행
    }
}
