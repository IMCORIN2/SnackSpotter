// 서버에서 데이터 가져오기
// async function fetchProducts() {
//     try {
//       const response = await axios.get('http://localhost:3000/api/products');
//       return response.data.data;
//     } catch (error) {
//       console.error('에러 ---', error);
//       throw error;
//     }
//   }
  
  // 상품 카드 렌더링하기
  // async function renderProductCards() {
  //   try {
  //     const products = await fetchProducts();
  //     const productCardsContainer = document.getElementById('productCards');
  //     const modalsContainer = document.getElementById('modalsContainer');
  
  //     for (let i = 0; i < 3 && i < products.length; i++) {
  //       const product = products[i];
  //       const imageUrl = `https://tqklhszfkvzk6518638.cdn.ntruss.com/product/${product.category}/${product.image}`;
  
  //       productCardsContainer.innerHTML += `
  //         <div class="col">
  //           <div class="card h-100">
  //             <img src="${imageUrl}" class="card-img-top" alt="${product.name}">
  //             <div class="card-body">
  //               <h5 class="card-title">${product.name}</h5>
  //               <p class="card-text">${product.description}</p>
  //               <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#productModal${product.id}">
  //                 View Details
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       `;
  
  //       // Dynamically create the corresponding modal for each product
  //       createProductModal(product);
  //     }
  //   } catch (error) {
  //     console.error('에러 ---', error);
  //   }
  // }
  
  // 동적으로 상품 모달 생성하기
  // function createProductModal(product) {
  //   const modalsContainer = document.getElementById('modalsContainer');
  
  //   modalsContainer.innerHTML += `
  //     <!-- Modal for Product ${product.id} -->
  //     <div class="modal fade" id="productModal${product.id}" tabindex="-1" aria-labelledby="productModalLabel${product.id}" aria-hidden="true">
  //       <div class="modal-dialog modal-dialog-centered modal-lg">
  //         <div class="modal-content">
  //           <div class="modal-header">
  //             <h5 class="modal-title" id="productModalLabel${product.id}">Product Details</h5>
  //             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  //           </div>
  //           <div class="modal-body">
  //             <!-- Product details go here -->
  //             <h2 class="text-primary">${product.name}</h2>
  //             <p>Description: ${product.description}</p>
  //             <p>Price: $${product.price}</p>
  //             <!-- Add more details as needed -->
  //           </div>
  //           <div class="modal-footer">
  //             <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Close</button>
  //             <button type="button" class="btn btn-primary">Add to Cart</button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   `;
  // }

  // modal 작동부분
  const body = document.querySelector('body');
  const modal = document.querySelector('.modal');
  const btnOpenPopup = document.querySelector('.btn-open-popup');

  btnOpenPopup.addEventListener('click', () => {
    modal.classList.toggle('show');

    if (modal.classList.contains('show')) {
      body.style.overflow = 'hidden';
    }
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.toggle('show');

      if (!modal.classList.contains('show')) {
        body.style.overflow = 'auto';
      }
    }
  });
  const $OKBtn = document.querySelector(".OKBtn");
  const $cancleBtn = document.querySelector(".cancleBtn");
  const $nameInputValue = document.querySelector(".name-input").value;
  const $emailInputValue = document.querySelector(".email-input").value;
  const $commentInputValue = document.querySelector(".comment-input").value;
  const $passwordInputValue = document.querySelector(".password-input").value;

  $OKBtn.addEventListener("click", sendInfo());

  async function sendInfo() {
    try{
      
      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: $nameInputValue,
            email: $emailInputValue,
            introduce: $commentInputValue,
            password: $passwordInputValue
          }),
        
      });
      if(!response.ok){
        throw new Error("response 전달 확인")
      }
      console.log("check")
      const result = await response.json();
      console.log(result)
      if (result.success) {
        console.log("check1")
        alert('수정이 완료되었습니다.');
      } else {
        console.log("check2")
        alert(` Error Message : ${ result.message }`);
      }
    } catch(error) {
      console.log("check3")
      console.error('Error:', error);
    }
  }
  
  $cancleBtn.addEventListener("click", turnoffModal());

  async function turnoffModal() {
    alert("click")
  }

  // 페이지 로드 시 자동으로 상품 카드 렌더링 함수 호출
  // window.onload = renderProductCards;
  