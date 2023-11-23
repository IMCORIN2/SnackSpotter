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
  
  // 동적으로 모달 생성하기
  function createProductModal(product) {
    const modalsContainer = document.getElementById('modalsContainer');
  
    // 모달 HTML 생성 (이 부분을 실제 모달 구현 코드로 교체하세요)
    const modalHTML = `
      <div class="modal fade" id="productModal${product.id}" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="productModalLabel">${product.name} Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>${product.description}</p>
              <!-- 여기에 추가적인 상세 정보를 표시하세요 -->
            </div>
          </div>
        </div>
      </div>
    `;
  
    // 모달을 모달 컨테이너에 추가
    modalsContainer.innerHTML += modalHTML;
  }
  
  // 상품 카드 렌더링하기
  async function renderProductCards() {
    try {
      const products = await fetchProducts();
      const productCardsContainer = document.getElementById('productCards');
      const modalsContainer = document.getElementById('modalsContainer');
  
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const imageUrl = `https://tqklhszfkvzk6518638.cdn.ntruss.com/product/${product.image}`;
  
        productCardsContainer.innerHTML += `
          <div class="col">
            <div class="card h-100">
              <img src="${imageUrl}" class="card-img-top" alt="${product.name}">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#productModal${product.id}">
                  View Details
                </button>
              </div>
            </div>
          </div>
        `;
  
        // 상품에 대한 모달 생성
        createProductModal(product);
      }
    } catch (error) {
      console.error('에러 ---', error);
    }
  }
  
  // 페이지 로드 시 자동으로 상품 카드 렌더링 함수 호출
  window.onload = renderProductCards;
  