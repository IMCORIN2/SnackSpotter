// File을 Base64로 변환하는 함수
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 이미지 확장자 추출 함수 정의
function getImageFileExtension(filename) {
  const matches = filename.match(/\.(jpg|jpeg|png|gif)$/i);
  if (!matches || matches.length < 2) {
    return 'jpeg'; // 기본적으로 jpeg 확장자를 반환하도록 수정
  }
  return matches[1].toLowerCase();
}

// 이미지 사이즈 조정
async function resizeImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100; // 원하는 폭으로 설정
        canvas.height = (100 * img.height) / img.width; // 종횡비 유지

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
          // 이미지 확장자에 따라 ContentType 변경
          const resizedFile = new File([blob], file.name, {
            type: `image/${getImageFileExtension(file.name)}`,
          });
          resolve(resizedFile);
        }, `image/${getImageFileExtension(file.name)}`);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// 글쓰기
async function submitReview() {
  const convenienceStoreSelect = document.getElementById('convenienceStore');
  const starRatingSelect = document.getElementById('starRating');
  const imageInput = document.getElementById('image');
  const commentType = document.getElementById('comment');

  const name = convenienceStoreSelect.value;
  const rating = parseInt(starRatingSelect.value, 10);
  const imageFile = imageInput.files[0];
  const comment = commentType.value;
  const resizedImageFile = imageFile ? await resizeImage(imageFile) : null;
  let image = resizedImageFile ? await uploadImage(resizedImageFile) : null;

  if (name && rating && comment) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('rating', rating);
    formData.append('image', image); 
    formData.append('comment', comment);

    try {
      const response = await fetch('http://localhost:3000/api/store-reviews', {
        method: 'POST',
        body: formData,
        credentials: "include",
        mode: 'cors',
      });

      if (response.ok) {
        alert('리뷰 제출이 완료되었습니다!');
        window.location.href = `./community.html?`;
      } else {
        console.error('Error submitting review:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  } else {
    alert('입력에 오류가 있습니다!');
  }
}

 // 로그아웃
function logout() {

  // 서버에 로그아웃 요청 보냄
  fetch('http://localhost:3000/api/auth/logout/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    // 사용자 ID 전송
    body: JSON.stringify({}), // 더 이상 사용자 ID를 전송할 필요가 없음
  })
    .then(response => response.json())
    .then(data => {
      // 서버에서의 로그아웃이 성공했을 경우의 처리
      console.log(data);

      // 서버에서 로그아웃이 성공
      if (data.success) {
        alert('로그아웃이 성공적으로 처리되었습니다.');
      } else {
        // 서버에서 로그아웃이 실패한 경우
        alert('로그아웃 중에 오류가 발생했습니다. 다시 시도해주세요3.');
      }
    })
    .catch(error => {
      // 서버에서의 로그아웃이 실패했을 경우의 처리
      console.error('Error:', error);
      // alert('로그아웃 중에 오류가 발생했습니다. 다시 시도해주세요4.');
    });

  // 페이지 리로드
  window.location.reload();
}

 // 가게 목록을 가져오는 함수
async function getStores() {
    try {
      const response = await fetch('http://localhost:3000/api/stores');
      if (response.ok) {
        const data = await response.json();
        return data.stores;
      } else {
        console.error('Error fetching stores:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
  }
  
  // 가게 목록을 가져와서 select 엘리먼트를 업데이트하는 함수
  async function updateStoreSelect() {
    const stores = await getStores();
    const convenienceStoreSelect = document.getElementById('convenienceStore');
  
    // 기존 옵션을 모두 제거
    convenienceStoreSelect.innerHTML = '';
  
    // 새로운 옵션 추가
    stores.forEach(store => {
      const option = document.createElement('option');
      option.value = store.name;
      option.text = store.name;
      convenienceStoreSelect.appendChild(option);
    });
  }
  
  // 이미지를 업로드하고 URL을 반환하는 함수
async function uploadImage(image) {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await fetch('http://localhost:3000/api/store-reviews/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Image upload successful:', data.url);
      return data.url;
    } else {
      console.error('Error uploading image:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

  // 페이지 로딩이 완료되면 가게 목록을 가져와서 select 엘리먼트를 업데이트
  window.onload = updateStoreSelect;
  