const express = require('express');
const cors = require('cors');
const apiRouter = require("./routers/index");
const { startCronJob } = require('./routers/cron.router');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const app = express();
const { SERVER_PORT } = require("./constants/app.constant");

// CORS 설정
const corsOptions = {
  origin: 'http://127.0.0.1:5500', // 허용된 오리진
  optionsSuccessStatus: 200, // 일부 레거시 브라우저에서 204 응답에 문제가 있을 때
};

// 모든 라우트에 대해 CORS 활성화
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", apiRouter);

app.set('view engine', 'ejs');

// 정적 파일 제공
const staticPath = path.join(__dirname, 'assets');
app.use('/assets', express.static(staticPath));

// 프록시 라우트
app.get('/proxy', async (req, res) => {
  try {
    const response = await axios.get('https://cu.bgfretail.com/actual-api-endpoint');
    res.json(response.data);
  } catch (error) {
    console.error('에러:', error.message);
    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 샘플 리뷰 데이터
const reviews = [
  {
    id: 1,
    store_name: '좋은편의점',
    content: '좋은 군것질이 많아서 좋아요!',
    rating: 4.5,
    user: 'user123',
  },
  {
    id: 2,
    store_name: '편리마트',
    content: '빵 종류가 풍부해서 자주 이용합니다.',
    rating: 5.0,
    user: 'user456',
  },
];

// 리뷰 라우트
app.route('/store-reviews')
  .get((req, res) => {
    res.json({ reviews });
  })
  .post((req, res) => {
    const { store_name, content, rating } = req.body;

    if (!store_name || !content || !rating) {
      return res.status(400).json({ message: '유효하지 않은 입력값입니다.' });
    }

    const newReview = {
      id: reviews.length + 1,
      store_name,
      content,
      rating,
      user: 'newUser', // 여기서는 사용자 정보를 임의로 생성
    };

    reviews.push(newReview);

    res.status(201).json({ status: '성공', data: newReview });
  });

// 서버 시작
app.listen(SERVER_PORT, () => {
  console.log(`예제 앱이 포트 ${SERVER_PORT}에서 수신 대기 중`);
  startCronJob();
});
