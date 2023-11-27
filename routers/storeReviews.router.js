const express = require('express');
const router = express.Router();
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const isAuthenticated = require('../middlewares/authMiddleware.js');
const { StoreReviews, Stores, Users } = require('../models');

// AWS S3 설정
const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

// Multer 및 Multer-S3 설정
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'snack-spotter-bucket-01',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, 'uploads/' + Date.now() + '-' + file.originalname);
    },
  }),
});

//이미지 업로드 라우터
router.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  if (req.file) {
    res.json({ url: req.file.location });
  } else {
    res.status(400).json({ message: '이미지 업로드에 실패했습니다.' });
  }
});

router.delete('/delete-all', async (req, res) => {
  try {
    // 모든 리뷰 삭제
    await StoreReviews.destroy({ where: {} });

    res.json({
      status: 'success',
      message: '모든 리뷰가 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '오류가 발생했습니다.' });
  }
});

// router.post('/', upload.single('image'), isAuthenticated, async (req, res) => {
//   // 파일이 제공되었는지 확인
//   if (req.file) {
//     // 파일 업로드 처리
//     res.json({ url: req.file.key});
//   } else {
//     // 리뷰 제출 처리
//     const { name, rating, comment, imageUrl } = req.body;

//   // 업로드된 파일 확인
//   const image = imageUrl ? imageUrl : null;

//   if (!name || !comment || !rating) {
//     return res.status(400).json({ message: '입력이 올바르지 않습니다.' });
//   }

//   try {
//     const userId = req.user.id;
//     // 이름으로 가게 찾기
//     const store = await Stores.findOne({ where: { name } });
//     // 가게가 존재하는지 확인
//     if (!store) {
//       console.error(`가게를 찾을 수 없습니다. 가게 이름: ${name}`);
//       return res.status(400).json({ message: '가게를 찾을 수 없습니다.' });
//     }

//     // 새 리뷰 작성
//     const review = await StoreReviews.create({
//       storeId: store.id,
//       userId,
//       rating: rating,
//       image: image,
//       comment: comment,
//     });

//     res.json({
//       status: 'success',
//       data: {
//         id: review.id,
//         name: name,
//         comment: comment,
//         rating: rating,
//         image: image,
//         user: req.user.name,
//       },
//     });
//   } catch (error) {
//     console.error(`가게 이름: ${name}`, error);
//     res.status(500).json({ message: '오류가 발생했습니다.' });
//   }
// }
// });

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

router.get('/:id', isAuthenticated, async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await StoreReviews.findByPk(reviewId);

    // 리뷰가 존재하는지 확인
    if (!review) {
      return res.status(400).json({ message: '리뷰를 찾을 수 없습니다.' });
    }

    // 사용자가 리뷰를 수정할 권한이 있는지 확인
    if (review.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: '리뷰를 수정할 권한이 없습니다.' });
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
      return res
        .status(403)
        .json({ message: '리뷰를 삭제할 권한이 없습니다.' });
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

router.post('/', upload.single('image'), isAuthenticated, async (req, res) => {
  // 리뷰 제출 처리
  const { name, rating, comment, image } = req.body;

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
    // 새 리뷰 작성
    const review = await StoreReviews.create({
      storeId: store.id,
      userId,
      rating: rating,
      image: image,
      comment: comment,
    });
    console.log(image);
    res.json({
      status: 'success',
      data: {
        id: review.id,
        name: name,
        comment: comment,
        rating: rating,
        image: image,
        user: req.user.name,
      },
    });
  } catch (error) {
    console.error(`가게 이름: ${name}`, error);
    res.status(500).json({ message: '오류가 발생했습니다.' });
  }
});

// 리뷰 업데이트
router.put('/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  const { name, rating, comment, image } = req.body;
  const reviewId = req.params.id;

  if (!comment || !rating) {
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
    const updateFields = {
      rating: rating,
      comment: comment,
    };

    // 이미지 파일이 업로드된 경우에만 업데이트
    if (req.file) {
      updateFields.image = image;
    }

    await review.update(updateFields);

    res.json({
      status: 'success',
      data: {
        id: review.id,
        name: review.store.name,
        comment: comment,
        image: image,
        rating: rating,
        user: req.user.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '오류가 발생했습니다.' });
  }
});
module.exports = router;
