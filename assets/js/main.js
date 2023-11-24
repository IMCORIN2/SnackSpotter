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
            <a href="#" class="btn btn-primary view-details" data-product-id="${product.id}">View Details</a>
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

// 페이지 로드 시 로그인 버튼 동적으로 추가
const isLoggedIn = localStorage.getItem('token') !== null;
const loginContainer = document.getElementById('loginContainer');
const buttonContainer = document.createElement('div');
buttonContainer.className = 'd-flex';

// 로그인 버튼 추가
const loginButton = document.createElement('button');
loginButton.type = 'button';
loginButton.className = 'btn btn-outline-primary me-2';

if (isLoggedIn) {
  loginButton.innerText = 'logout';
  loginButton.addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.reload();
  });
} else {
  loginButton.innerText = 'login';
  loginButton.addEventListener('click', function () {
    window.location.href = 'login.html';
  });
}

buttonContainer.appendChild(loginButton);

// myPage 버튼 추가
if (isLoggedIn) {
  const myPageButton = document.createElement('button');
  myPageButton.type = 'button';
  myPageButton.className = 'btn btn-primary me-2';
  myPageButton.innerText = 'my page';
  myPageButton.addEventListener('click', function () {
    window.location.href = 'myPage.html';
  });

  buttonContainer.appendChild(myPageButton);
} else {
  const registerBtn = document.createElement('button');
  registerBtn.type = 'button';
  registerBtn.className = 'btn btn-primary me-2';
  registerBtn.innerText = 'signup';
  registerBtn.addEventListener('click', function () {
    window.location.href = 'register.html';
  });

  buttonContainer.appendChild(registerBtn);
}

loginContainer.appendChild(buttonContainer);

// 페이지 로드 시 상품 카드 렌더링 함수 호출
window.onload = renderProductCards;
