// 서버에서 데이터 가져오기
async function fetchProducts() {
  try {
    const response = await axios.get('http://localhost:3000/api/products');
    return response.data.data;
  } catch (error) {
    console.error('에러 ---', error);
    throw error;
  }
}

// 상품 카드 렌더링하기
async function renderProductCards() {
  try {
    const products = await fetchProducts();

    // 상품 목록을 담을 Carousel 요소
    const productCarousel = document.getElementById('productCarousel');
    const productCardsContainer = document.getElementById('productCards');

    // 기존 상품 카드 초기화
    productCardsContainer.innerHTML = '';

    // 상품을 Carousel에 추가
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imageUrl = `https://tqklhszfkvzk6518638.cdn.ntruss.com/product/${product.image}`;

      const productCard = document.createElement('div');
      productCard.className = `carousel-item ${i === 0 ? 'active' : ''}`;

      productCard.innerHTML = `
        <div class="card h-100">
          <img src="${imageUrl}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <div class="d-flex justify-content-center">
          <a href="#" class="btn btn-primary view-details" data-product-id="${product.id}">View Details</a>
        </div>
          </div>
        </div>
      `;

      // Carousel에 상품 카드 추가
      productCardsContainer.appendChild(productCard);
    }

    // Carousel 초기화
    const carousel = new bootstrap.Carousel(productCarousel, {
      interval: 1500, // 1.5초 간격으로 슬라이딩
      wrap: false // 루프 비활성화
    });

    // "다음" 버튼 클릭 시 이벤트 리스너 추가
    const nextButton = document.querySelector('.carousel-control-next');
    nextButton.addEventListener('click', function () {
      const activeItem = productCarousel.querySelector('.carousel-item.active');
      const nextItem = activeItem.nextElementSibling;

      // 현재 활성화된 항목이 마지막 이미지일 경우, 다음에 보여줄 이미지를 처음 이미지로 설정
      if (!nextItem) {
        carousel.to(0); // 처음 이미지로 이동
      }
    });

    // 마우스가 Carousel 영역에 들어가면 자동 슬라이딩을 비활성화
    productCarousel.addEventListener('mouseenter', function () {
      carousel.pause();
    });

    // 마우스가 Carousel 영역에서 나가면 다시 자동 슬라이딩을 활성화
    productCarousel.addEventListener('mouseleave', function () {
      carousel.cycle();
    });

    // 이벤트 위임을 사용하여 "View Details" 버튼 클릭 이벤트 처리
    productCardsContainer.addEventListener('click', function (event) {
      const target = event.target;

      // "View Details" 버튼 클릭한 경우
      if (target.classList.contains('view-details')) {
        event.preventDefault();

        // 클릭한 상품의 ID를 가져와서 출력
        const productId = target.getAttribute('data-product-id');
        console.log('View Details clicked for product ID:', productId);

        // 상세 페이지로 이동
        window.location.href = `detail.html?id=${productId}`;
      }
    });

  } catch (error) {
    console.error('에러 ---', error);
  }
}

async function fetchReviews() {
  try {
    const response = await fetch('http://localhost:3000/api/store-reviews');
    if (!response.ok) {
      throw new Error('서버 응답이 실패하였습니다.');
    }

    const data = await response.json();
    console.log('Response Data:', data);
    return data.reviews;
  } catch (error) {
    console.error('에러 ---', error);
    throw error;
  }
}

// 편의점 리뷰 렌더링하기
async function renderReviewCards() {
  try {
    const reviews = await fetchReviews();
    const reviewCardsContainer = document.getElementById('reviewCardsContainer');

    // 기존 내용을 지우고 새로운 리뷰 카드를 추가할 요소 생성
    reviewCardsContainer.innerHTML = '';

    for (let i = 0; i < 3; i++) {
      const review = reviews[i];
      const storeName = review.store ? review.store.name : 'No Store Name';
      const userName = review.user ? review.user.name : 'No User Name';

      function getStarRating(rating) {
        const stars = '⭐'.repeat(rating);
        return stars || 'No Rating';
      }

      // 새로운 리뷰 카드를 생성하고 추가
      const card = document.createElement('div');
      card.className = 'col';
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title" style="color: #0D6EFD;">${storeName}</h5>
            <p class="card-text">별점: ${getStarRating(review.rating)}</p>
            <p class="card-text">내용: ${review.comment}</p>
            <p class="card-text">글쓴이: ${userName}</p>
          </div>
        </div>`;

      // 이미지가 있는 경우 이미지 엘리먼트를 생성하고 추가
      if (review.image) {
        const imgElement = document.createElement('img');
        imgElement.src = review.image;
        imgElement.alt = storeName;
        imgElement.className = 'card-img-top';
        card.querySelector('.card-body').prepend(imgElement);

        // 이미지 크기를 조절
        imgElement.style.maxHeight = '100px';
        imgElement.style.maxWidth = '100px';
      }

      reviewCardsContainer.appendChild(card);
    }
  } catch (error) {
    console.error('에러 ---', error);
  }
}

// 페이지 로드 시 상품 카드 렌더링 함수 호출
document.addEventListener('DOMContentLoaded', function () {
  // 상품 카드 렌더링 함수 호출
  renderProductCards();

  // 편의점 리뷰 카드 렌더링 함수 호출
  renderReviewCards();
});
