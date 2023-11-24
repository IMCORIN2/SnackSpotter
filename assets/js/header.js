// Function to set up login buttons
function setupLoginButtons() {
    const isLoggedIn = localStorage.getItem('token') !== null;
    const loginContainer = document.getElementById('loginContainer');
  
    // Ensure loginContainer exists before proceeding
    if (!loginContainer) {
      console.error("Element with ID 'loginContainer' not found.");
      return;
    }
  
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'd-flex';
  
    // Login button
    const loginButton = document.createElement('button');
    loginButton.type = 'button';
    loginButton.className = 'btn btn-outline-primary me-2';
  
    if (isLoggedIn) {
      loginButton.innerText = 'logout';
      loginButton.addEventListener('click', function () {
        localStorage.removeItem('token');
        window.location.reload();
      });
    } else {
      loginButton.innerText = 'login';
      loginButton.addEventListener('click', function () {
        window.location.href = 'login.html';
      });
    }
  
    buttonContainer.appendChild(loginButton);
  
    // My Page button or Signup button
    if (isLoggedIn) {
      const myPageButton = document.createElement('button');
      myPageButton.type = 'button';
      myPageButton.className = 'btn btn-primary me-2';
      myPageButton.innerText = 'my page';
      myPageButton.addEventListener('click', function () {
        window.location.href = 'myPage.html';
      });
  
      buttonContainer.appendChild(myPageButton);
    } else {
      const registerBtn = document.createElement('button');
      registerBtn.type = 'button';
      registerBtn.className = 'btn btn-primary me-2';
      registerBtn.innerText = 'signup';
      registerBtn.addEventListener('click', function () {
        window.location.href = 'register.html';
      });
  
      buttonContainer.appendChild(registerBtn);
    }
  
    // Append button container to login container
    loginContainer.appendChild(buttonContainer);
  }
  
  // Call the function to set up login buttons
  setupLoginButtons();
  