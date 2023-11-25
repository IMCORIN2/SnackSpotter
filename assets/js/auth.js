function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

async function checkEmail() {
    const email = document.getElementById('inputEmail').value;
  
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/auth/check-email', {
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
  
    fetch('http://localhost:3000/api/auth/signup', {
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
        setCookie('token', result.data.accessToken, 7);
        window.history.back();
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

  fetch('http://localhost:3000/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    mode: 'cors', 
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      if (result.success) {
        alert('로그인 성공!');
        //localStorage.setItem('token', result.data.accessToken);
        setCookie('token', result.data.accessToken, 7);
        window.history.back();
      } else {
        alert(`로그인 실패: ${result.message}`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}