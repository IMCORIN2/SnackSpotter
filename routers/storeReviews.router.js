const express = require('express');
const router = express.Router();
const { StoreReviews, Stores, Users } = require('../models');
const isAuthenticated = require('../middlewares/authMiddleware.js');

router.get('/', async (req, res) => {
  try {
    const reviews = await StoreReviews.findAll({
      include: [
        { model: Stores, as: 'store', attributes: ['id', 'name'] },
        { model: Users, as: 'user', attributes: ['name'] },
      ],
      attributes: ['id', 'rating', 'image', 'comment'],
    });
    res.json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '오류가 발생했습니다.' });
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  const { name,rating, image, comment } = req.body;
  if (!name || !comment || !rating) {
    return res.status(400).json({ message: '입력이 올바르지않습니다.' });
  }
  try {
    const userId = req.user.id; 
    // 이름으로 가게 찾기
    const store = await Stores.findOne({ where: { name } });
    // 가게가 존재하는지 확인
    if (!store) {
      console.error(`가게를 찾을 수 없습니다. 가게 이름: ${name}`);
      return res.status(400).json({ message: '가게를 찾을 수 없습니다.' });
    }

    // 새 리뷰 작성
    const review = await StoreReviews.create({
      storeId: store.id, 
      userId,
      rating: rating,
      image: image,
      comment: comment,
    });

    res.json({
      status: 'success',
      data: {
        id: review.id,
        name: name,
        comment: comment,
        rating:rating,
        image: imageFile.filename ? image : null,
        user: req.user.name,
      },
    });
  } catch (error) {
    console.error(`가게 이름: ${name}`, error);
    res.status(500).json({ message: '오류가 발생했습니다.' });
  }
});

router.get('/:id', isAuthenticated, async (req, res) => {

    const reviewId = req.params.id;
    try {
      const review = await StoreReviews.findByPk(reviewId);
  
      // 리뷰가 존재하는지 확인
      if (!review) {
        return res.status(400).json({ message: '리뷰를 찾을 수 없습니다.' });
      }

    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', isAuthenticated, async (req, res) => {
  const { content, rating } = req.body;
  const reviewId = req.params.id;

  if (!content || !rating) {
    return res.status(400).json({ message: '입력이 올바르지 않습니다.' });
  }
  try {
    const review = await StoreReviews.findByPk(reviewId, {
      include: [{ model: Stores, as: 'store' }], 
    });

    // 리뷰가 존재하는지 확인
    if (!review) {
      return res.status(400).json({ message: '리뷰를 찾을 수 없습니다.' });
    }

    // 사용자가 리뷰를 수정할 권한이 있는지 확인
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

router.delete('/:id', isAuthenticated, async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await StoreReviews.findByPk(reviewId);

    // 리뷰가 존재하는지 확인
    if (!review) {
      return res.status(400).json({ message: '리뷰를 찾을 수 없습니다.' });
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
