const express = require('express');
const cors = require('cors');
const apiRouter = require("./routers/index");
const { startCronJob } = require('./routers/cron.router');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const path = require('path');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const app = express();
const { SERVER_PORT } = require("./constants/app.constant");
app.use(cookieParser());
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
app.use(cors());  // 모든 경로에 대해 CORS 허용
app.use(bodyParser.json({ limit: '50mb' }));
app.use("/api", apiRouter);

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

// 서버 시작
app.listen(SERVER_PORT, () => {
  console.log(`예제 앱이 포트 ${SERVER_PORT}에서 수신 대기 중`);
  startCronJob();
});
