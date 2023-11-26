const AWS = require('aws-sdk');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const { StoreReviews, Stores, Users } = require('../models');
const isAuthenticated = require('../middlewares/authMiddleware.js');
const {accessKeyId,secretAccessKey,region,bucket} = require('../config/config.js');
const mime = require('mime');

// AWS S3 인증 정보 설정
AWS.config.update({
  accessKey: process.env.ACCESS_KEY,
  secretAccessKey:process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
// S3 객체 생성
const s3 = new AWS.S3();

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

// 이미지 확장자 추출 함수 정의
function getImageFileExtension(filename) {
  const matches = filename.match(/\.(jpg|jpeg|png|gif)$/i);
  if (!matches || matches.length < 1) {
    return 'jpeg'; // 기본적으로 jpeg 확장자를 반환하도록 수정
  }
  return matches[0].toLowerCase();
}

router.post('/', isAuthenticated, async (req, res) => {
  const { name, rating, image, comment } = req.body;
  if (!name || !comment || !rating) {
    return res.status(400).json({ message: '입력이 올바르지 않습니다.' });
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

    let imageFileUrl = null; // S3에 업로드된 이미지 URL

    // 이미지가 전송되었을 경우에만 S3에 업로드
    if (image) {
      // 이미지 파일을 Buffer로 변환
      const imageBuffer = Buffer.from(image, 'base64');

      // 이미지 확장자 추출
      const imageFileExtension = getImageFileExtension(name);
      // S3에 이미지 업로드
      const uploadParams = {
        Bucket: 'snack-spotter-bucket-01',
        Key: `images/${Date.now()}_${name}_review.${imageFileExtension}`, // 확장자 추가
        Body: imageBuffer,
        ContentType: mime.lookup(imageFileExtension) || 'application/octet-stream',
        ACL: 'public-read',
      };

      const s3UploadResult = await s3.upload(uploadParams).promise();
      imageFileUrl = s3UploadResult.Location;
    }

    // 새 리뷰 작성
    const review = await StoreReviews.create({
      storeId: store.id,
      userId,
      rating: rating,
      image: imageFileUrl,
      comment: comment,
    });

    res.json({
      status: 'success',
      data: {
        id: review.id,
        name: name,
        comment: comment,
        rating: rating,
        image: imageFileUrl,
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

router.get('/:id/edit', isAuthenticated, async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await StoreReviews.findByPk(reviewId);

    // 리뷰가 존재하는지 확인
    if (!review) {
      return res.status(400).json({ message: '리뷰를 찾을 수 없습니다.' });
    }

    // 사용자가 리뷰를 수정할 권한이 있는지 확인
    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: '리뷰를 수정할 권한이 없습니다.' });
    }

    res.json({ message: '권한 확인 성공' });
  } catch (error) {
    console.error('Error checking review permission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
