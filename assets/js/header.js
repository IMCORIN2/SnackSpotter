
// 비동기 함수로 로그인 여부 확인
async function checkLoggedIn() {
  try {
    const response = await fetch(`/api/users`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return true;
    } else {
      console.error('Error checking login status:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
}

// 로그인 버튼 설정 함수 호출
document.addEventListener('DOMContentLoaded', function () {
  checkLoggedIn()
    .then((isLoggedIn) => {
      setupLoginButtons(isLoggedIn);
    })
    .catch((error) => {
      console.error('Error during login check:', error);
    });
});

// 로그인 버튼 설정 함수
function setupLoginButtons(isLoggedIn) {
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

  const loginButton = document.createElement('button');
  loginButton.type = 'button';
  loginButton.className = 'btn btn-outline-primary me-2';

  if (isLoggedIn) {
    loginButton.innerText = 'logout';
    loginButton.addEventListener('click', function () {
      logout();
    });
  } else {
    loginButton.innerText = 'login';
    loginButton.addEventListener('click', function () {
      window.location.href = 'login.html';
    });
  }

  buttonContainer.appendChild(loginButton);

  if (isLoggedIn) {
    const myPageButton = document.createElement('button');
    myPageButton.type = 'button';
    myPageButton.className = 'btn btn-primary me-2';
    myPageButton.innerText = 'mypage';
    myPageButton.addEventListener('click', function () {
      window.location.href = 'myPage.html';
    });

    buttonContainer.appendChild(myPageButton);
  } else {
    const signupButton = document.createElement('button');
    signupButton.type = 'button';
    signupButton.className = 'btn btn-primary me-2';
    signupButton.innerText = 'signup';
    signupButton.addEventListener('click', function () {
      window.location.href = 'register.html';
    });

    buttonContainer.appendChild(signupButton);
  }

  loginContainer.appendChild(buttonContainer);
}

// 로그아웃
async function logout() {
  try {
    const response = await fetch(`/api/auth/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({}),
    });

    const data = await response.json();

    console.log(data);

    if (data.success) {
      alert('로그아웃이 성공적으로 처리되었습니다.');
    } else {
      alert('로그아웃 중에 오류가 발생했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
  }

  window.location.reload();
}
