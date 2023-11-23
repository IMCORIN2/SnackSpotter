const express = require('express');
const { SERVER_PORT, GENDER } = require("./constants/app.constant");
const apiRouter = require("./routers/index")
const bodyParser = require('body-parser');
const morgan = require("morgan");
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
app.use(morgan())
app.use(express.json());
app.use(cookieParser());
app.use("/api", apiRouter);
const staticPath = path.join(__dirname, 'assets');
app.use('/assets', express.static(staticPath));


console.log('Static Path:', staticPath);
const reviews = [
  {
    id: 1,
    store_name: "좋은편의점",
    content: "좋은 군것질이 많아서 좋아요!",
    rating: 4.5,
    user: "user123"
  },
  {
    id: 2,
    store_name: "편리마트",
    content: "빵 종류가 풍부해서 자주 이용합니다.",
    rating: 5.0,
    user: "user456"
  }
];

app.route('/store-reviews')
  .get((req, res) => {
    res.json({ reviews });
  })
  .post((req, res) => {
    const { store_name, content, rating } = req.body;

    if (!store_name || !content || !rating) {
      return res.status(400).json({ message: "입력값이 유효하지 않습니다." });
    }

    const newReview = {
      id: reviews.length + 1,
      store_name,
      content,
      rating,
      user: "newUser" // 사용자 정보는 여기서는 임의로 생성
    };

    reviews.push(newReview);

    res.status(201).json({ status: "success", data: newReview });
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
