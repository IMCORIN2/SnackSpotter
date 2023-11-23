

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
        // 로그인에 성공하면 토큰을 저장하고 원하는 페이지로 이동
        localStorage.setItem('token', result.data.accessToken);
        window.location.replace('./html/goods.html');
      } else {
        alert(`로그인 실패: ${result.message}`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}