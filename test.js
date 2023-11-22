
const API_KEY = 'AIzaSyBiBSVB9c-0pIt-Ogjs2ME7ziaN4CLzT68';
const CX = '12345';
const query = 'your search query';

const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${CX}&key=${API_KEY}&searchType=image`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data.items && data.items.length > 0) {
      const firstImageUrl = data.items[0].link;
      console.log(`First image URL: ${firstImageUrl}`);
    } else {
      console.log('No images found.');
    }
  })
  .catch(error => console.error('Error:', error));