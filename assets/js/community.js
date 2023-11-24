// function createVote() {
//   const isLoggedIn = checkLoginStatus();

//   if (!isLoggedIn) {
//       // 로그인되어 있지 않으면 메시지 표시 후 함수 종료
//       alert('로그인을 해주세요.');
//       return;
//   }

//   // 로그인이 되어 있으면 포스트 작성 페이지로 이동
//   window.location.href = './vote.html';
// }

function createReview() {
  const isLoggedIn = checkLoginStatus();

  if (!isLoggedIn) {
      // 로그인되어 있지 않으면 메시지 표시 후 함수 종료
      alert('로그인을 해주세요.');
      return;
  }

  // 로그인이 되어 있으면 포스트 작성 페이지로 이동
  window.location.href = './storeReview.html';
}


function checkLoginStatus() {
  //세션에 키가 있는지 확인
  // const sessionData = sessionStorage.getItem('loggedIn');
  // const isLoggedIn = sessionData === 'true';
  const isLoggedIn = true;
  return isLoggedIn;
}
