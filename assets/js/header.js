// Function to delete a cookie
function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Function to set up login buttons
function setupLoginButtons() {
  const isLoggedIn = document.cookie.includes('token=');
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
    loginButton.innerText = 'Logout';
    loginButton.addEventListener('click', function () {
      deleteCookie('token');
      window.location.reload();
    });
  } else {
    loginButton.innerText = 'Login';
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
    myPageButton.innerText = 'My Page';
    myPageButton.addEventListener('click', function () {
      window.location.href = 'myPage.html';
    });

    buttonContainer.appendChild(myPageButton);
  } else {
    const signupButton = document.createElement('button');
    signupButton.type = 'button';
    signupButton.className = 'btn btn-primary me-2';
    signupButton.innerText = 'Signup';
    signupButton.addEventListener('click', function () {
      window.location.href = 'signup.html';
    });

    buttonContainer.appendChild(signupButton);
  }

  // Append button container to login container
  loginContainer.appendChild(buttonContainer);
}

// Call the function to set up login buttons
setupLoginButtons();
