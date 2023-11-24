function createReview() {
  const isLoggedIn = checkLoginStatus();

  if (!isLoggedIn) {
      // 로그인되어 있지 않으면 메시지 표시 후 함수 종료
      alert('로그인을 해주세요.');
      return;
  }

  // 로그인이 되어 있으면 포스트 작성 페이지로 이동
  window.location.href = './storeReview.html';
}


function checkLoginStatus() {
  //세션에 키가 있는지 확인
  // const sessionData = sessionStorage.getItem('loggedIn');
  // const isLoggedIn = sessionData === 'true';
  const isLoggedIn = true;
  return isLoggedIn;
}

// 서버에서 데이터 가져오기
async function fetchReviews() {
  try {
    const response = await axios.get('http://localhost:3000/api/storeReviews');
    return response.data.data;
  } catch (error) {
    console.error('에러 ---', error);
    throw error;
  }
}

// 편의점 리뷰 렌더링하기
async function renderReviewCards() {
  try {
    const reviews = await fetchReviews();
    const reviewCardsContainer = document.getElementById('productCardsContainer');

    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      const imageUrl = `/storeReviews/${review.image}`;

      reviewCardsContainer.innerHTML += `
        <div class="col">
          <div class="card h-100">
            <img src="${imageUrl}" class="card-img-top" alt="${review.name}">
            <div class="card-body">
              <h5 class="card-title">${review.name}</h5>
              <p class="card-text">${review.rating}</p>
              <a href="detail.html?id=${review.id}" class="btn btn-primary">View Details</a>
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('에러 ---', error);
  }
}

// 페이지 로드 시 자동으로 리뷰 카드 렌더링 함수 호출
window.onload = renderReviewCards;
