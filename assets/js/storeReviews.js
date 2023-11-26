// 쿠키 가져오기
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }
  
  // 쿠키 지우기
  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
  
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


//글쓰기
async function submitReview() {
  const convenienceStoreSelect = document.getElementById('convenienceStore');
  const starRatingSelect = document.getElementById('starRating');
  const imageInput = document.getElementById('image');
  const commentTextarea = document.getElementById('comment');

  const name = convenienceStoreSelect.value;
  const rating = parseInt(starRatingSelect.value, 10);
  const imageFile = imageInput.files[0];

  // 이미지 파일이 존재할 때만 리사이징
  const resizedImageFile = imageFile ? await resizeImage(imageFile) : null;
  const comment = commentTextarea.value;

  // 토큰 가져오기
  const token = getCookie('token');

  if (name && rating && comment && token) {
    const data = {
      name,
      rating,
      image: resizedImageFile ? await fileToBase64(resizedImageFile) : "", // 이미지가 없으면 빈 문자열
      comment,
    };

    try {
      const response = await fetch('http://localhost:3000/api/store-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        mode: 'cors',
      });

      if (response.ok) {
        const result = await response.json();
        alert('리뷰 제출이 완료되었습니다!');
        window.location.replace('./community.html'); // 페이지 이동
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
    deleteCookie('token'); // 토큰 삭제
    window.location.href = './community.html';
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
  
  // 페이지 로딩이 완료되면 가게 목록을 가져와서 select 엘리먼트를 업데이트
  window.onload = updateStoreSelect;
  