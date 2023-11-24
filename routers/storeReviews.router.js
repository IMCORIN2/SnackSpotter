const express = require('express');
const router = express.Router();
const { StoreReviews } = require('../models/storeReviews.js');
const { Stores } = require('../models/stores.js');
const { Users } = require('../models/users.js');
const isAuthenticated = require('../middlewares/authMiddleware.js');

router.get('/', async (req, res) => {
  try {
    // 연관된 가게 및 사용자 정보를 포함하여 리뷰를 가져옵니다.
    console.log('Reached here 1');
    const reviews = await StoreReviews.findAll({
      include: [
        { model: Stores, as: 'store', attributes: ['id', 'name'] },
        { model: Users, as: 'user', attributes: ['name'] },
      ],
      attributes: ['id', 'rating', 'comment'],
    });
    console.log('Reached here 1');
    res.json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '오류가 발생했습니다.' });
  }
});

  router.post('/', isAuthenticated, async (req, res) => {
    const { name, content, rating } = req.body;
  
    try {
      // 토큰에서 userId를 추출하기 위한 인증 미들웨어를 가정합니다.
      const userId = req.user.id;
  
      // 이름으로 가게 찾기
      const store = await Stores.findOne({ where: { name } });
  
      // 가게가 존재하는지 확인합니다.
      if (!store) {
        return res.status(400).json({ message: '입력값이 유효하지 않습니다.' });
      }
  
      // 새 리뷰 작성
      const review = await StoreReviews.create({
        storeId: store.id,
        userId,
        rating,
        comment: content,
      });
  
      res.json({
        status: 'success',
        data: {
          id: review.id,
          name: name,
          content,
          rating,
          user: req.user.name,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '오류가 발생했습니다.' });
    }
  });
  router.put('/:id', isAuthenticated, async (req, res) => {
    const { content, rating } = req.body;
    const reviewId = req.params.id;
  
    try {
      // ID로 리뷰 찾기
      const review = await StoreReviews.findByPk(reviewId);
  
      // 리뷰가 존재하는지 확인합니다.
      if (!review) {
        return res.status(400).json({ message: '입력값이 유효하지 않습니다.' });
      }
  
      // 사용자가 리뷰를 수정할 권한이 있는지 확인합니다.
      if (review.userId !== req.user.id) {
        return res.status(403).json({ message: '리뷰를 수정할 권한이 없습니다.' });
      }
  
      // 리뷰 업데이트
      await review.update({
        rating,
        comment: content,
      });
  
      res.json({
        status: 'success',
        data: {
          id: review.id,
          name: review.store.name,
          content,
          rating,
          user: req.user.name,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '오류가 발생했습니다.' });
    }
  });

//리뷰 삭제
router.delete('/:id', isAuthenticated, async (req, res) => {
    const reviewId = req.params.id;
  
    try {
      // ID로 리뷰 찾기
      const review = await StoreReviews.findByPk(reviewId);
  
      // 리뷰가 존재하는지 확인
      if (!review) {
        return res.status(400).json({ message: '입력값이 유효하지 않습니다.' });
      }
  
      // 사용자가 리뷰를 삭제할 권한이 있는지 확인
      if (review.userId !== req.user.id) {
        return res.status(403).json({ message: '리뷰를 삭제할 권한이 없습니다.' });
      }
  
      // 리뷰 삭제
      await review.destroy();
  
      res.json({
        status: 'success',
        message: '리뷰가 성공적으로 삭제되었습니다.',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '오류가 발생했습니다.' });
    }
  });
  module.exports = router;