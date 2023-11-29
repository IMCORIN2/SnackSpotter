async function checkEmail() {
    const email = document.getElementById('inputEmail').value;

    if (!email) {
        alert('이메일을 입력해주세요.');
        return;
    }

    try {
        const response = await fetch(`/api/auth/check-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
            mode: 'cors',
        });

        const result = await response.json();

        if (result.success) {
            alert('사용 가능한 이메일입니다.');
        } else {
            alert('이미 사용 중인 이메일입니다.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function sign_up() {
    const name = document.getElementById('inputNickname').value;
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword1').value;
    const passwordConfirm = document.getElementById('inputPassword2').value;
    const gender = document.getElementById('inputGender').value;
    const birthday = document.getElementById('inputBirthday').value;
    const data = {
        name,
        email,
        password,
        passwordConfirm,
        gender,
        birthday,
    };

    fetch(`/api/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors',
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if (result.success) {
            alert('회원가입 성공!');
            window.location.href = 'login.html';
        } else {
            alert(`회원가입 실패: ${result.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function sign_in() {
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;

    fetch(`/api/auth/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors',
        credentials: "include",
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if (result.success) {
            alert('로그인 성공!');
            window.location.href = 'main.html';
        } else {
            alert(`로그인 실패: ${result.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// 음식 목록 배열
const foods = [
  '모찌', '삼각김밥', '신라면', '샌드위치', '스윙칩', '햄버거', '소세지', '샐러드', '타코', '피자'
];
// 랜덤 음식 추천 함수
function getRandomFood() {
  // 배열에서 랜덤으로 음식 선택
  const randomIndex = Math.floor(Math.random() * foods.length);
  const query = foods[randomIndex];
  // 화면에 표시
  document.getElementById('foodDisplay').innerText = '오늘 메뉴는 ' + query + '어때요?';
  const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${CX}&key=${API_KEY}&searchType=image`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
  if (data.items && data.items.length > 0) {
const firstImageUrl = data.items[0].link;
const imageElement = document.createElement('img');
    imageElement.src = firstImageUrl;
    const previousImageElement = document.getElementById('imageContainer').firstChild;
    document.getElementById('imageContainer').replaceChild(imageElement, previousImageElement);
  } else {
    console.log('No images found.');
  }
})
    .catch(error => console.error('Error:', error));
}

