async function cart(productId,quantity) {
    try {
        fetch('http://localhost:3000/api/cart', {
            method: 'POST',
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                productId,quantity,
            }),
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateResults() {
    // 서버에서 투표 결과를 가져와서 화면 업데이트
    fetch('http://localhost:3000/api/cart'),{
        method:"GET",
        headers:{authorization: `Bearer ${localStorage.getItem("token")}`,},
        
    }
        .then(response => response.json())
        .then(data => {
            // data.options를 순회하면서 각 투표 옵션에 대한 화면 업데이트
            const html = document.querySelector(".card")
             data.data.map((data)=>{
            html.innerHTML += `
            <div>${data.productId}</div>
            <div>${data.quantity}</div>
            `
            })
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// 초기화면 로딩 시 투표 결과 업데이트
updateResults();
