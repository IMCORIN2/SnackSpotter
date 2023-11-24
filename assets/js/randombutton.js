const API_KEY = 'AIzaSyBiBSVB9c-0pIt-Ogjs2ME7ziaN4CLzT68';
const CX = '518b23407ec824f6e';

// 음식 목록 배열
const foods = [
    '모찌', '삼각김밥', '신라면', '샌드위치', '스윙칩', '햄버거', '소세지', '샐러드', '타코', '피자'
];
// 랜덤 음식 추천 함수
function getRandomFood() {
    // 배열에서 랜덤으로 음식 선택
    const randomIndex = Math.floor(Math.random() * foods.length);
    const query = foods[randomIndex];
    // 화면에 표시
    document.getElementById('foodDisplay').innerText = '오늘 메뉴는 ' + query + '어때요?';
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${CX}&key=${API_KEY}&searchType=image`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
    if (data.items && data.items.length > 0) {
  const firstImageUrl = data.items[0].link;
  const imageElement = document.createElement('img');
      imageElement.src = firstImageUrl;
      const previousImageElement = document.getElementById('imageContainer').firstChild;
      document.getElementById('imageContainer').replaceChild(imageElement, previousImageElement);
    } else {
      console.log('No images found.');
    }
  })
      .catch(error => console.error('Error:', error));
}