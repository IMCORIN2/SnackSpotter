// 쿠키 삭제 함수 (비동기)
async function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;

  // 서버에 로그아웃 요청 보냄
  try {
    const token = getCookie('token'); // 쿠키에서 토큰 가져오기
    const decodedToken = decodeToken(token); // 토큰 디코딩

 if (decodedToken) {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 토큰을 헤더에 추가
        },
        // 사용자 ID 전송
        body: JSON.stringify({ userId: decodedToken.userId }), // 디코딩된 토큰에서 사용자 ID 가져옴
      });

    const data = await response.json();

    // 서버에서의 로그아웃이 성공했을 경우의 처리
    console.log(data);

    // 서버에서 로그아웃이 성공
    if (data.success) {
      alert('로그아웃이 성공적으로 처리되었습니다.');
    } else {
      // 서버에서 로그아웃이 실패한 경우
      alert('로그아웃 중에 오류가 발생했습니다. 다시 시도해주세요.');
    }
  } else {
    console.error('토큰 디코딩 실패');
  }
} catch (error) {
  // 서버에서의 로그아웃이 실패했을 경우의 처리
  console.error('Error:', error);
  alert('로그아웃 중에 오류가 발생했습니다. 다시 시도해주세요.');
}
}

// 로그인 버튼 설정 함수
function setupLoginButtons() {
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
  const isLoggedIn = checkLoggedIn();

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

  // 버튼 컨테이너를 로그인 컨테이너에 추가
  loginContainer.appendChild(buttonContainer);

  // 토큰 만료 여부 확인 및 처리
  checkTokenExpiration();
}

// 로그인 버튼 설정 함수 호출
setupLoginButtons();

// 토큰 만료 여부 확인 및 처리
function checkTokenExpiration() {
  const isLoggedIn = checkLoggedIn();

  if (isLoggedIn) {
    const token = getCookie('token');
    const decodedToken = decodeToken(token);

    if (decodedToken.exp * 1000 < Date.now()) {
      // 토큰이 만료되었을 때의 처리
      alert('토큰이 만료되었습니다. 자동으로 로그아웃됩니다.');

      // 로그아웃
      logout();
    }
  }
}

// 쿠키에서 토큰 가져오기
function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

// 토큰 디코딩
function decodeToken(token) {
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('토큰 디코딩 오류:', error);
    }
  }

  return null;
}

// 로그인 여부 확인
function checkLoggedIn() {
  return document.cookie.includes('token=');
}

// 로그아웃
function logout() {
  // 쿠키 삭제
  deleteCookie('token');

  // 서버에 로그아웃 요청 보냄
  fetch('/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getCookie('token')}`, // 토큰을 헤더에 추가
    },
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
        alert('로그아웃 중에 오류가 발생했습니다. 다시 시도해주세요.');
      }
    })
    .catch(error => {
      // 서버에서의 로그아웃이 실패했을 경우의 처리
      console.error('Error:', error);
      alert('로그아웃 중에 오류가 발생했습니다. 다시 시도해주세요.');
    });

  // 페이지 리로드
  window.location.reload();
}


// 로그인 버튼 설정 함수 호출
setupLoginButtons();
