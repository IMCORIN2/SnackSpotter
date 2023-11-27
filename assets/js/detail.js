// URL에서 제품 ID를 가져오기
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
// 제품 ID가 null이 아닌 경우에만 서버에서 제품 정보를 가져옴
if (productId) {
  // 서버에서 특정 제품 가져오기
  async function fetchProductDetails() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/products/${productId}`,
      );
      return response.data.data;
    } catch (error) {
      console.error('에러 ---', error);
      throw error;
    }
  }

  // 제품 상세 정보 렌더링하기
  async function renderProductDetails() {
    try {
      const product = await fetchProductDetails();
      const productDetailContainer = document.getElementById('productDetail');
      const quantityInput = document.getElementById('quantity');
      const addToCartBtn = document.getElementById('addToCartBtn');
      const directPurchaseBtn = document.getElementById('directPurchaseBtn');
      const totalAmountSpan = document.getElementById('totalAmount');

      const imageUrl = `https://tqklhszfkvzk6518638.cdn.ntruss.com/product/${product.image}`;

      productDetailContainer.innerHTML = `
        <div class="col-md-4">
          <img src="${imageUrl}" class="img-fluid" alt="${product.name}">
        </div>
        <div class="col-md-8">
          <h3 class="text-primary">${product.name}</h3>
          <p class="text-muted">${product.description}</p>
          <p class="text-primary">가격: ${product.price}원</p>
          <!-- 추가적인 상세 정보를 여기에 표시하세요 -->
        </div>
      `;

      // 수량 변경 및 버튼에 대한 이벤트 리스너 등록
      quantityInput.addEventListener('input', updateTotalAmount);

      addToCartBtn.addEventListener('click', function () {
        addToCart(product, parseInt(quantityInput.value, 10));
      });

      directPurchaseBtn.addEventListener('click', function () {
        directPurchase(product, parseInt(quantityInput.value, 10));
      });

      // 초기 총액 계산
      updateTotalAmount();
    } catch (error) {
      console.error('에러 ---', error);
    }
  }

  // 수량에 따라 총액 업데이트
  async function updateTotalAmount() {
    try {
      const quantityInput = document.getElementById('quantity');
      const totalAmountSpan = document.getElementById('totalAmount');

      // 제품 가격 가져오기
      const product = await fetchProductDetails();

      // 가격에서 쉼표 제거하고 정수로 변환
      const productPrice = parseInt(product.price.replace(',', ''));

      // 총액 계산
      const totalAmount = productPrice * parseInt(quantityInput.value, 10);

      // 총액 화면에 업데이트
      totalAmountSpan.innerText = `${totalAmount}원`;
    } catch (error) {
      console.error('에러 ---', error);
    }
  }

  async function addToCart(product, quantity) {
    try {
      const response = await fetch('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        console.log(
          `${quantity}개의 ${product.name}을 장바구니에 추가했습니다.`,
        );
        // 모달 열기
        openModal();
      } else {
        console.error('오류:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('오류:', error);
    }
  }

  // 페이지 로드 시 모달 초기화
  const myModal = new bootstrap.Modal(document.getElementById('myModal'));

  // 모달 열기 함수
  function openModal() {
    myModal.show();
  }

  // 모달 닫기 함수
  function closeModal() {
    myModal.hide();
  }

  // 직접 구매 로직
  function directPurchase(product, quantity) {
    // 직접 구매를 위한 로직 구현
    // 결제 처리 또는 체크아웃 페이지로 이동하는 것과 관련될 수 있음
    console.log(`${quantity}개의 ${product.name}을 직접 구매했습니다.`);
  }

  // 페이지 로드 시 자동으로 제품 상세 정보 렌더링 함수 호출
  if (productId) {
    window.onload = renderProductDetails;
  }
} else {
  console.error('상품 ID가 없습니다.');
  // 상품 ID가 없을 경우에 대한 처리를 추가
}
