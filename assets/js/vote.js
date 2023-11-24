async function vote(productId) {
    try {
        const response = await fetch('http://localhost:3000/api/votes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // 성공적으로 투표 처리된 경우
            updateResults();
        } else {
            // 투표 실패 시 메시지 처리
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateResults() {
    // 서버에서 투표 결과를 가져와서 화면 업데이트
    fetch('http://localhost:3000/api/votes')
        .then(response => response.json())
        .then(data => {
            // data.options를 순회하면서 각 투표 옵션에 대한 화면 업데이트
            data.options.forEach((option, index) => {
                const elementId = `option${index + 1}-votes`;
                document.getElementById(elementId).innerText = `${option.name}: ${option.votes} 표`;
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// 초기화면 로딩 시 투표 결과 업데이트
updateResults();
