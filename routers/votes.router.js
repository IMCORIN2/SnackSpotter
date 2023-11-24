const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Products, Votes } = db;
const isAuthenticated = require('../middlewares/authMiddleware.js');

// 투표 생성 라우트 (로그인이 필요한 경우 isAuthenticated 미들웨어 적용)
router.post('/', isAuthenticated, async (req, res) => {
  try {
    // 클라이언트로부터 받은 투표 처리 로직
    const productId = req.body.productId;
    const userId = req.user.id; // 인증된 사용자의 ID

    // 사용자 ID를 활용하여 특정 사용자의 투표 처리 로직을 구현
    // 데이터베이스에 투표 기록 저장 
    const result = await vote(productId, userId);

    res.json({ status: 'success', pollId: result.pollId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: '서버 오류가 발생했습니다.' });
  }
});

// 투표 조회 라우트 (인증 필요 없음)
router.get('/', async (req, res) => {
  try {
    // 클라이언트로부터 받은 투표 조회
    // 데이터베이스에서 투표 결과를 가져오기
    const products = await Products.findAll();
    const voteResults = await getVoteResults(products);

    // 투표 조회 결과를 클라이언트에 응답
    res.json({ options: voteResults });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: '서버 오류가 발생했습니다.' });
  }
});

// 투표 처리 로직
const vote = async (productId, userId) => {
  try {
    // 데이터베이스에 투표 기록 저장 
    const product = await Products.findByPk(productId);

    if (!product) {
      throw new Error('투표하려는 제품이 존재하지 않습니다.');
    }

    const result = await Votes.create({
      productId,
      userId,
    });

    // 투표 결과의 pollId 등을 반환
    return { pollId: result.id };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 투표 조회 로직
const getVoteResults = async (products) => {
  try {
    const voteResults = [];
    for (const product of products) {
      const voteCount = await Votes.count({ where: { productId: product.id } });
      voteResults.push({ name: product.name, votes: voteCount });
    }
    return voteResults;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

module.exports = router;
