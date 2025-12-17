// 교재 관리 스크립트

let allMaterials = [];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadMaterials();
});

// 교재 목록 로드
async function loadMaterials() {
    try {
        const response = await fetch('tables/materials?limit=500');
        const data = await response.json();
        
        allMaterials = data.data;
        
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
