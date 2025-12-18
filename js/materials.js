// 교재 관리 스크립트

let allMaterials = [];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeMaterialsData();
    loadMaterials();
});

// 초기 교재 데이터 생성
function initializeMaterialsData() {
    const existingMaterials = localStorage.getItem('materials');
    if (!existingMaterials) {
        const defaultMaterials = [
            // 국어 교재
            {id: 'm1', type: '교재', subject: '국어', level: '상', title: '중학 국어 문법 완성', description: '문법 핵심 개념 정리 및 고난도 문제', publisher: '천재교육', url: ''},
            {id: 'm2', type: '교재', subject: '국어', level: '중', title: '중학 국어 독해 기본', description: '독해 전략과 실전 연습', publisher: '비상교육', url: ''},
            {id: 'm3', type: '교재', subject: '국어', level: '하', title: '중학 국어 기초 다지기', description: '기본 어휘 및 문법', publisher: '미래엔', url: ''},
            {id: 'm4', type: 'EBS강의', subject: '국어', level: '상', title: 'EBS 중학 국어 심화', description: '문학/비문학 심화 강의', publisher: 'EBS', url: 'https://www.ebs.co.kr'},
            
            // 영어 교재
            {id: 'm5', type: '교재', subject: '영어', level: '상', title: '중학 영문법 완성', description: '고난도 문법 및 독해', publisher: '능률', url: ''},
            {id: 'm6', type: '교재', subject: '영어', level: '중', title: '중학 영어 듣기·독해', description: '듣기 전략 및 독해 연습', publisher: '동아출판', url: ''},
            {id: 'm7', type: '교재', subject: '영어', level: '하', title: '중학 영어 기초', description: '기본 문법 및 어휘', publisher: '천재교육', url: ''},
            {id: 'm8', type: 'EBS강의', subject: '영어', level: '상', title: 'EBS 중학 영어 고급', description: '고급 문법 및 독해', publisher: 'EBS', url: 'https://www.ebs.co.kr'},
            
            // 수학 교재
            {id: 'm9', type: '교재', subject: '수학', level: '상', title: '중학 수학 실력편', description: '심화 문제 및 응용력 강화', publisher: '신사고', url: ''},
            {id: 'm10', type: '교재', subject: '수학', level: '중', title: '중학 수학 기본편', description: '개념 이해 및 기본 문제', publisher: '비상교육', url: ''},
            {id: 'm11', type: '교재', subject: '수학', level: '하', title: '중학 수학 기초편', description: '기초 연산 및 개념', publisher: '천재교육', url: ''},
            {id: 'm12', type: 'EBS강의', subject: '수학', level: '상', title: 'EBS 중학 수학 심화', description: '고난도 문제 풀이', publisher: 'EBS', url: 'https://www.ebs.co.kr'},
            
            // 과학 교재
            {id: 'm13', type: '교재', subject: '과학', level: '상', title: '중학 과학 탐구편', description: '실험 및 탐구 활동 중심', publisher: '비상교육', url: ''},
            {id: 'm14', type: '교재', subject: '과학', level: '중', title: '중학 과학 개념편', description: '핵심 개념 정리', publisher: '미래엔', url: ''},
            {id: 'm15', type: '교재', subject: '과학', level: '하', title: '중학 과학 기초편', description: '기초 과학 개념', publisher: '천재교육', url: ''},
            {id: 'm16', type: 'EBS강의', subject: '과학', level: '상', title: 'EBS 중학 과학 심화', description: '심화 개념 및 실험', publisher: 'EBS', url: 'https://www.ebs.co.kr'},
            
            // 사회 교재
            {id: 'm17', type: '교재', subject: '사회', level: '상', title: '중학 사회 심화편', description: '역사·지리 심화 학습', publisher: '천재교육', url: ''},
            {id: 'm18', type: '교재', subject: '사회', level: '중', title: '중학 사회 개념편', description: '핵심 개념 정리', publisher: '비상교육', url: ''},
            {id: 'm19', type: '교재', subject: '사회', level: '하', title: '중학 사회 기초편', description: '기본 개념 학습', publisher: '미래엔', url: ''},
            {id: 'm20', type: 'EBS강의', subject: '사회', level: '상', title: 'EBS 중학 사회 심화', description: '사회·역사 심화', publisher: 'EBS', url: 'https://www.ebs.co.kr'}
        ];
        localStorage.setItem('materials', JSON.stringify(defaultMaterials));
    }
}

// 교재 목록 로드 (localStorage 기반)
async function loadMaterials() {
    try {
        allMaterials = JSON.parse(localStorage.getItem('materials')) || [];
        
        // 필터 적용
        let filteredMaterials = allMaterials;
        
        const filterType = document.getElementById('filterType').value;
        const filterSubject = document.getElementById('filterSubject').value;
        const filterLevel = document.getElementById('filterLevel').value;
        
        if (filterType) {
            filteredMaterials = filteredMaterials.filter(m => m.type === filterType);
        }
        if (filterSubject) {
            filteredMaterials = filteredMaterials.filter(m => m.subject === filterSubject);
        }
        if (filterLevel) {
            filteredMaterials = filteredMaterials.filter(m => m.level === filterLevel);
        }
        
        displayMaterials(filteredMaterials);
        
    } catch (error) {
        console.error('교재 목록 로드 오류:', error);
        alert('교재 목록을 불러오는데 실패했습니다.');
    }
}

// 교재 검색
function searchMaterials() {
    const searchText = document.getElementById('searchText').value.toLowerCase();
    
    let filteredMaterials = allMaterials;
    
    // 기존 필터 적용
    const filterType = document.getElementById('filterType').value;
    const filterSubject = document.getElementById('filterSubject').value;
    const filterLevel = document.getElementById('filterLevel').value;
    
    if (filterType) {
        filteredMaterials = filteredMaterials.filter(m => m.type === filterType);
    }
    if (filterSubject) {
        filteredMaterials = filteredMaterials.filter(m => m.subject === filterSubject);
    }
    if (filterLevel) {
        filteredMaterials = filteredMaterials.filter(m => m.level === filterLevel);
    }
    
    // 검색어 적용
    if (searchText) {
        filteredMaterials = filteredMaterials.filter(m => 
            m.title.toLowerCase().includes(searchText) ||
            m.description.toLowerCase().includes(searchText)
        );
    }
    
    displayMaterials(filteredMaterials);
}

// 교재 목록 표시
function displayMaterials(materials) {
    const container = document.getElementById('materialsList');
    document.getElementById('materialCount').textContent = materials.length;
    
    if (materials.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                <i class="fas fa-search text-4xl mb-4"></i>
                <p>조건에 맞는 교재가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    const subjectColors = {
        '국어': 'red',
        '영어': 'blue',
        '수학': 'green',
        '과학': 'purple',
        '사회': 'orange'
    };
    
    const levelBadges = {
        '상': '<span class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">상</span>',
        '중': '<span class="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">중</span>',
        '하': '<span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">하</span>'
    };
    
    container.innerHTML = materials.map(material => {
        const color = subjectColors[material.subject] || 'gray';
        const typeIcon = material.type === 'EBS강의' ? 
            '<i class="fas fa-video text-red-500"></i>' : 
            '<i class="fas fa-book text-blue-500"></i>';
        
        return `
            <div class="border rounded-lg p-5 hover:shadow-lg transition">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center space-x-2">
                        ${typeIcon}
                        <span class="text-xs px-2 py-1 bg-${color}-100 text-${color}-700 rounded-full font-semibold">
                            ${material.subject}
                        </span>
                    </div>
                    ${levelBadges[material.level]}
                </div>
                
                <h3 class="text-lg font-bold text-gray-800 mb-2">${material.title}</h3>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">${material.description}</p>
                
                <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div class="text-xs text-gray-500">
                        <i class="fas fa-building mr-1"></i>
                        ${material.publisher}
                    </div>
                    ${material.url ? `
                        <a href="${material.url}" target="_blank" 
                            class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                            <i class="fas fa-external-link-alt mr-1"></i>바로가기
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}
