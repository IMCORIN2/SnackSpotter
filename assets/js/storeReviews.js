const voteRecommendButton = document.getElementById('voteRecommend');
const voteNotRecommendButton = document.getElementById('voteNotRecommend');
const scoreSelect = document.querySelector('.score-select');
const scoreSelectStars = document.querySelectorAll(".score-select-star");
let voteType = null;

function vote(type) {
    voteRecommendButton.classList.remove('selected-button');
    voteNotRecommendButton.classList.remove('selected-button');

    // 선택된 버튼에 대한 스타일 변경
    if (type === '추천') {
        voteRecommendButton.classList.add('selected-button');
    } else if (type === '비추천') {
        voteNotRecommendButton.classList.add('selected-button');
    }

    voteType = type;
}

scoreSelectStars.forEach((element) => {
    element.addEventListener("click", (e) => {
        clickReviewStar(e);
    });
});

let selectedStar = 0;
//별표 (최대 5개) 표시
function displayStars(scoreInputValue) {
    const starCharacter = '\u2B50'; // 별 이모티콘 유니코드 (⭐)
    const stars = new Array(5).fill(starCharacter).fill(' ', scoreInputValue, 5).join('');
    return stars;
  }
// 리뷰 별 선택 초기화
function clearReviewStar() {
    scoreSelectStars.forEach((star) => {
      star.textContent = "☆";
      star.style.fontSize = "24px";
      star.style.lineHeight = "150%";
    });
    scoreSelect.dataset.value = "0";
  }
// 리뷰 별 클릭 이벤트
function clickReviewStar(e) {
    const target = e.currentTarget;
    const value = target.getAttribute("data-value");
    selectedStar = parseInt(value, 5);
  
    clearReviewStar();
  
    for (let i=0; i<value; i++) {
      scoreSelectStars[i].textContent = '\u2B50';
      scoreSelectStars[i].style.fontSize = "20px";
      scoreSelectStars[i].style.lineHeight = "190%";
    }
    scoreSelect.dataset.value = value;
  }

  function getSelectedStar() {
    return selectedStar;
}
async function submitReview() {
    const storeSelect = document.getElementById('convenienceStore');
    const reviewTextarea = document.getElementById('review');
    const selectedStore = storeSelect.value;
    const reviewText = reviewTextarea.value;

    if (selectedStore && reviewText) {
        try {
            const response = await fetch('http://localhost:3000/store-reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    store_name: selectedStore,
                    content: reviewText,
                    rating: getSelectedStar(),
                    vote: voteType,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);

                const reviewList = document.getElementById('reviewList');
                const reviewItem = document.createElement('div');
                reviewItem.className = 'reviewItem';
                reviewItem.innerHTML = `<strong>${result.data.store_name}:</strong> ${result.data.content}`;
                reviewList.appendChild(reviewItem);
                voteRecommendButton.disabled = false;
                voteNotRecommendButton.disabled = false;
                storeSelect.value = '';
                reviewTextarea.value = '';
            } else {
                console.error('서버 응답이 실패했습니다.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    } else {
        alert('모든 필드를 채워주세요!');
    }
}

async function fetchReviews() {
    try {
        const response = await fetch('http://localhost:3000/store-reviews');
        if (response.ok) {
            const result = await response.json();
            displayStars(selectedStar);
            displayReviews(result.reviews);
        } else {
            console.error('Error fetching reviews:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

function displayReviews(reviews) {
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = '';

    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'reviewItem';
        reviewItem.innerHTML = `<strong>${review.store_name}:</strong> ${review.content}`;
        reviewList.appendChild(reviewItem);
    });
}

window.addEventListener('load', () => {
    fetchReviews();
});
