function submitPost() {
  const isLoggedIn = checkLoginStatus();

  if (!isLoggedIn) {
      // 로그인되어 있지 않으면 메시지 표시 후 함수 종료
      alert('로그인을 해주세요.');
      return;
  }

  const postTitle = document.getElementById('postTitle').value;
  const postContent = document.getElementById('postContent').value;

  if (postTitle && postContent) {
      const postList = document.getElementById('posts');
      const newPost = document.createElement('li');
      newPost.innerHTML = `
          <h3>${postTitle}</h3>
          <p>${postContent}</p>
      `;
      postList.appendChild(newPost);

      // 지우기
      document.getElementById('postTitle').value = '';
      document.getElementById('postContent').value = '';
  } else {
      alert('제목과 내용을 모두 입력하세요.');
  }
}

function checkLoginStatus() {
  //세션에 키가 있는지 확인
  const sessionData = sessionStorage.getItem('loggedIn');
  const isLoggedIn = sessionData === 'true';

  return isLoggedIn;
}
