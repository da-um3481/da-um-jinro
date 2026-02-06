/**
 * DA.UM Classroom V2 - 사진 업로드 관리
 * 
 * 기능:
 * - 사진 파일 선택
 * - Base64 인코딩
 * - 미리보기 생성
 * - 크기 제한 (각 2MB)
 * - 최대 3장 제한
 */

// 사진 업로드 상태
let uploadedPhotos = [];
const MAX_PHOTOS = 3;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * 사진 업로드 처리
 */
async function handlePhotoUpload(event) {
    const files = Array.from(event.target.files);
    const photoPreview = document.getElementById('photoPreview');
    
    if (!photoPreview) {
        console.error('photoPreview 요소를 찾을 수 없습니다.');
        return;
    }
    
    // 최대 3장 제한
    if (uploadedPhotos.length + files.length > MAX_PHOTOS) {
        alert(`❌ 사진은 최대 ${MAX_PHOTOS}장까지만 첨부할 수 있습니다.`);
        event.target.value = ''; // 파일 선택 초기화
        return;
    }
    
    // 각 파일 처리
    for (const file of files) {
        // 파일 크기 체크
        if (file.size > MAX_FILE_SIZE) {
            alert(`❌ "${file.name}"은(는) 크기가 너무 큽니다. (최대 2MB)`);
            continue;
        }
        
        // 이미지 파일인지 체크
        if (!file.type.startsWith('image/')) {
            alert(`❌ "${file.name}"은(는) 이미지 파일이 아닙니다.`);
            continue;
        }
        
        try {
            // Base64 인코딩
            const base64 = await fileToBase64(file);
            
            // 사진 데이터 저장
            const photoData = {
                id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                filename: file.name,
                size: file.size,
                type: file.type,
                base64: base64,
                uploadedAt: new Date().toISOString()
            };
            
            uploadedPhotos.push(photoData);
            
            // 미리보기 추가
            addPhotoPreview(photoData);
            
            console.log(`✅ 사진 업로드 완료: ${file.name} (${formatFileSize(file.size)})`);
        } catch (error) {
            console.error(`❌ 사진 업로드 실패: ${file.name}`, error);
            alert(`❌ "${file.name}" 업로드 중 오류가 발생했습니다.`);
        }
    }
    
    // 파일 선택 초기화
    event.target.value = '';
    
    // 파일 선택 버튼 비활성화 (3장 제한)
    if (uploadedPhotos.length >= MAX_PHOTOS) {
        event.target.disabled = true;
    }
}

/**
 * 파일을 Base64로 변환
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            resolve(reader.result);
        };
        
        reader.onerror = () => {
            reject(new Error('파일 읽기 실패'));
        };
        
        reader.readAsDataURL(file);
    });
}

/**
 * 사진 미리보기 추가
 */
function addPhotoPreview(photoData) {
    const photoPreview = document.getElementById('photoPreview');
    if (!photoPreview) return;
    
    const previewItem = document.createElement('div');
    previewItem.className = 'relative group';
    previewItem.id = `preview_${photoData.id}`;
    
    previewItem.innerHTML = `
        <img 
            src="${photoData.base64}" 
            alt="${photoData.filename}"
            class="w-full h-24 md:h-32 object-cover rounded-xl border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition"
            onclick="viewPhotoFullSize('${photoData.id}')"
        >
        <button 
            onclick="removePhoto('${photoData.id}')"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
        >
            ✕
        </button>
        <div class="text-xs text-gray-600 mt-1 truncate font-semibold" title="${photoData.filename}">
            ${photoData.filename}
        </div>
    `;
    
    photoPreview.appendChild(previewItem);
}

/**
 * 사진 삭제
 */
function removePhoto(photoId) {
    // 배열에서 삭제
    uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== photoId);
    
    // 미리보기 삭제
    const previewItem = document.getElementById(`preview_${photoId}`);
    if (previewItem) {
        previewItem.remove();
    }
    
    // 파일 선택 버튼 다시 활성화
    const photoUpload = document.getElementById('photoUpload');
    if (photoUpload && uploadedPhotos.length < MAX_PHOTOS) {
        photoUpload.disabled = false;
    }
    
    console.log(`🗑️ 사진 삭제: ${photoId}`);
}

/**
 * 사진 전체 화면 보기
 */
function viewPhotoFullSize(photoId) {
    const photo = uploadedPhotos.find(p => p.id === photoId);
    if (!photo) return;
    
    // 모달 생성
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4';
    modal.onclick = () => modal.remove();
    
    modal.innerHTML = `
        <div class="max-w-4xl max-h-screen">
            <img 
                src="${photo.base64}" 
                alt="${photo.filename}"
                class="max-w-full max-h-screen object-contain rounded-lg"
            >
            <div class="text-white text-center mt-4 font-semibold">
                ${photo.filename}
                <button 
                    onclick="event.stopPropagation(); this.closest('.fixed').remove();"
                    class="ml-4 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition"
                >
                    닫기
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * 파일 크기 포맷팅
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 학습 일지 저장 시 사진 포함
 */
function getUploadedPhotos() {
    return uploadedPhotos.map(photo => ({
        id: photo.id,
        filename: photo.filename,
        base64: photo.base64,
        uploadedAt: photo.uploadedAt
    }));
}

/**
 * 사진 초기화
 */
function resetPhotos() {
    uploadedPhotos = [];
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview) {
        photoPreview.innerHTML = '';
    }
    const photoUpload = document.getElementById('photoUpload');
    if (photoUpload) {
        photoUpload.value = '';
        photoUpload.disabled = false;
    }
}

/**
 * 저장된 사진 불러오기 (학습 기록 보기)
 */
function displaySavedPhotos(photos, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !photos || photos.length === 0) return;
    
    container.innerHTML = '';
    
    photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.base64;
        img.alt = photo.filename;
        img.className = 'w-full h-24 md:h-32 object-cover rounded-xl border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition';
        img.onclick = () => viewPhotoFullSize(photo.id);
        
        const wrapper = document.createElement('div');
        wrapper.appendChild(img);
        container.appendChild(wrapper);
    });
}

console.log('✅ 사진 업로드 모듈 로드 완료');
