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
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#productModal${product.id}">
                  View Details
                </button>
              </div>
            </div>
          </div>
        `;
  
        // Dynamically create the corresponding modal for each product
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
      <!-- Modal for Product ${product.id} -->
      <div class="modal fade" id="productModal${product.id}" tabindex="-1" aria-labelledby="productModalLabel${product.id}" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="productModalLabel${product.id}">Product Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Product details go here -->
              <h2 class="text-primary">${product.name}</h2>
              <p>Description: ${product.description}</p>
              <p>Price: $${product.price}</p>
              <!-- Add more details as needed -->
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
  
  // 페이지 로드 시 자동으로 상품 카드 렌더링 함수 호출
  window.onload = renderProductCards;
  