const deleteProduct = document.querySelectorAll('.remove');
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

// 서버에서 데이터 가져오기
async function fetchCart() {
  try {
    const response = await fetch('http://localhost:3000/api/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${getCookie('token')}`,
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('에러 ---', error);
    throw error;
  }
}

async function cartGet() {
  try {
    const data = await fetchCart();

    const itemBox = document.querySelector('.Cart-ItemBox');
    const totalAmount = document.querySelector('.total-amount');
    const totalItems = document.querySelector('.items');
    const deleteProducts = document.querySelectorAll('.remove');

    let totalPrice = 0;

    const { carts, products } = data;

    for (let i = 0; i < carts.length; i++) {
      const cart = carts[i];
      const product = products[i];
      const imageUrl = `https://tqklhszfkvzk6518638.cdn.ntruss.com/product/${product.image}`;

      const productNum = product.price.replace(',', '');

      const amount = parseInt(productNum) * cart.quantity;

      totalPrice += amount;

      itemBox.innerHTML += `
    <div class="Cart-Items">
    <div class="image-box">
      <img src="${imageUrl}" style="height: 120px" />
    </div>
    <div class="about">
      <h3 class="title">${product.name}</h3>
    </div>
    <div class="counter">
      <div class="btn plus">+</div>
      <div class="count">${cart.quantity}</div>
      <div class="btn minus">-</div>
    </div>
    <div class="prices">
      <div class="amount">${amount}원</div>
      <div class="remove"><u>Remove</u></div>
    </div>
  </div>
    `;
    }
    totalAmount.innerText = `${totalPrice} 원`;
    totalItems.innerText = `total items ${carts.length}`;

    // 각각의 "Remove" 링크에 클릭 이벤트 핸들러 바인딩
    deleteProducts.forEach((deleteProduct, index) => {
      deleteProduct.addEventListener('click', async () => {
        try {
          const response = await fetch('http://localhost:3000/api/cart', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${getCookie('token')}`,
            },
            body: JSON.stringify({
              productId: carts[index].productId, // id를 적절한 방식으로 수정
            }),
          });
          location.reload();
        } catch (error) {
          console.error('에러 ---', error);
          throw error;
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

const deleteAll = document.querySelector('.Action');

deleteAll.addEventListener('click', deleteCart);

async function deleteCart() {
  try {
    const response = await fetch('http://localhost:3000/api/cart/all', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${getCookie('token')}`,
      },
    });
    location.reload();
    return data;
  } catch (error) {
    console.error('에러 ---', error);
    throw error;
  }
}

window.onload = cartGet;
