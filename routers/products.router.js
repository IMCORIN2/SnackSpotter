const express = require('express');
const { Products } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Products.findAll({
      attributes: ['id', 'name', 'description', 'image', 'price', 'category'],
    });

    res.status(200).json({
      success: true,
      message: '상품 목록 조회했습니다',
      data: products,
    });
  } catch (error) {
    console.error('에러 ---', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다' });
  }
});

router.get(`/:productId`, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Products.findOne({
      where: { id: productId },
    });

    if (!product) {
      res
        .status(404)
        .json({ success: false, message: '상품 조회에 실패하였습니다' });
    }

    res.status(200).json({
      success: true,
      message: '상품 조회 성공했습니다',
      data: product,
    });
  } catch (error) {
    console.error('에러 ---', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다' });
  }
});

module.exports = router;
