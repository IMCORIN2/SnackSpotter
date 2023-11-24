function submitPost() {
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
  
      // Clear the form fields
      document.getElementById('postTitle').value = '';
      document.getElementById('postContent').value = '';
    } else {
      alert('제목과 내용을 모두 입력하세요.');
    }
  }
  