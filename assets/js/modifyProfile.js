function checkLoginStatus() {
    // 클라이언트에서 쿠키에서 토큰 읽기
    const cookieString = document.cookie;
    
    // 토큰이 있다면 사용
    if (cookieString) {
      const token = cookieString
        .split('; ')
        .find(row => row.startsWith('token='))
        .split('=')[1];
  
      return !!token;
    } else {
      console.log('No cookies found');
      return false;
    }
  }
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

function modifyProfile() {
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
  
    fetch(`/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(data),
      mode: 'cors', 
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      if (result.success) {
        alert('회원 수정 성공!');
        window.history.back();
      } else {
        window.history.back();
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }