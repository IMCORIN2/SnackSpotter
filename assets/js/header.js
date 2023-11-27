// 로그인 버튼 설정 함수
async function setupLoginButtons() {
  const loginContainer = document.getElementById('loginContainer');

  // loginContainer가 존재하는지 확인
  if (!loginContainer) {
    console.error("ID가 'loginContainer'인 엘리먼트를 찾을 수 없습니다.");
    return;
  }

  // 기존에 생성된 버튼이 있다면 삭제
  const existingButtonContainer = loginContainer.querySelector('.d-flex');
  if (existingButtonContainer) {
    existingButtonContainer.remove();
  }

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'd-flex flex-row';
  buttonContainer.style.flexDirection = 'row'; 

  // 로그인 버튼
  const loginButton = document.createElement('button');
  loginButton.type = 'button';
  loginButton.className = 'btn btn-outline-primary me-2';

  // 로그인 중이면 로그아웃 버튼 표시
  const isLoggedIn = await checkLoggedIn();

  console.log(isLoggedIn);
  if (isLoggedIn) {
    loginButton.innerText = 'logout';
    loginButton.addEventListener('click', function () {
      logout();
    });
  } else {
    // 로그인 중이 아니면 로그인 버튼 표시
    loginButton.innerText = 'login';
    loginButton.addEventListener('click', function () {
      window.location.href = 'login.html';
    });
  }

  buttonContainer.appendChild(loginButton);

  // My Page 버튼 또는 회원가입 버튼
  if (isLoggedIn) {
    const myPageButton = document.createElement('button');
    myPageButton.type = 'button';
    myPageButton.className = 'btn btn-primary me-2';
    myPageButton.innerText = 'mypage';
    myPageButton.addEventListener('click', function () {
      window.location.href = 'myPage.html';
    });

    buttonContainer.appendChild(myPageButton);
  } if (!isLoggedIn) {
    const signupButton = document.createElement('button');
    signupButton.type = 'button';
    signupButton.className = 'btn btn-primary me-2';
    signupButton.innerText = 'signup';
    signupButton.addEventListener('click', function () {
      window.location.href = 'register.html';
    });

    buttonContainer.appendChild(signupButton);
  }

  // 버튼 컨테이너를 로그인 컨테이너에 추가
  loginContainer.appendChild(buttonContainer);

}

// 로그인 여부 확인
async function checkLoggedIn() {

   // 서버에 내정보 요청 보냄
   try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'GET',
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return true;
    } else {
      console.error('Error uploading image:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return false;
  }
}


// 로그아웃
function logout() {
  // 서버에 로그아웃 요청 보냄
  fetch('http://localhost:3000/api/auth/logout/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    // 사용자 ID 전송
    body: JSON.stringify({}), // 더 이상 사용자 ID를 전송할 필요가 없음
  })
    .then(response => response.json())
    .then(data => {
      // 서버에서의 로그아웃이 성공했을 경우의 처리
      console.log(data);

      // 서버에서 로그아웃이 성공
      if (data.success) {
        alert('로그아웃이 성공적으로 처리되었습니다.');
      } else {
        // 서버에서 로그아웃이 실패한 경우
        alert('로그아웃 중에 오류가 발생했습니다. 다시 시도해주세요3.');
      }
    })
    .catch(error => {
      // 서버에서의 로그아웃이 실패했을 경우의 처리
      console.error('Error:', error);
      // alert('로그아웃 중에 오류가 발생했습니다. 다시 시도해주세요4.');
    });

  // 페이지 리로드
  window.location.reload();
}


// 로그인 버튼 설정 함수 호출
setupLoginButtons();
