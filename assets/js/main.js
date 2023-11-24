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
    const productCardsContainer = document.getElementById('productCards');
    const modalsContainer = document.getElementById('modalsContainer');

    for (let i = 0; i < 3 && i < products.length; i++) {
      const product = products[i];
      const imageUrl = `https://tqklhszfkvzk6518638.cdn.ntruss.com/product/${product.image}`;

      productCardsContainer.innerHTML += `
        <div class="col">
          <div class="card h-100">
            <img src="${imageUrl}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#productModal${product.id}">
                View Details
              </button>
            </div>
          </div>
        </div>
      `;

      // 동적으로 해당 제품에 대한 모달 생성
      createProductModal(product);
    }
  } catch (error) {
    console.error('에러 ---', error);
  }
}

// 동적으로 상품 모달 생성하기
function createProductModal(product) {
  const modalsContainer = document.getElementById('modalsContainer');

  modalsContainer.innerHTML += `
    <!-- Product ${product.id}에 대한 모달 -->
    <div class="modal fade" id="productModal${product.id}" tabindex="-1"
      aria-labelledby="productModalLabel${product.id}" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="productModalLabel${product.id}">Product Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- 제품 상세 정보가 여기에 들어갑니다 -->
            <h2 class="text-primary">${product.name}</h2>
            <p>Description: ${product.description}</p>
            <p>Price: $${product.price}</p>
            <!-- 필요에 따라 더 많은 정보 추가 -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  `;
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
}
else {
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

// 상품 카드 렌더링 함수 호출
renderProductCards();
