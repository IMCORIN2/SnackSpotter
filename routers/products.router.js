const express = require('express');
const { Products } = require('../models');
const router = express.Router();
const path = require('path');

router.get('/products', async (req, res) => {
  try {
    const products = await Products.findAll();
    res.json({ products });
  } catch (error) {
    console.error('에러 ---', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
    return; // 응답을 보낸 후 함수 종료
  } catch (error) {
    console.error('에러 ---', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다' });
    return; // 응답을 보낸 후 함수 종료
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Products.findOne({
      where: { id: productId },
    });

    if (!product) {
      res
        .status(404)
        .json({ success: false, message: '상품 조회에 실패하였습니다' });
      return; // 응답을 보낸 후 함수 종료
    }

    res.status(200).json({
      success: true,
      message: '상품 조회 성공했습니다',
      data: product,
    });
    return; // 응답을 보낸 후 함수 종료
  } catch (error) {
    console.error('에러 ---', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다' });
    return; // 응답을 보낸 후 함수 종료
  }
});

router.get('/html', async (req, res) => {
  try {
    const products = await Products.findAll({
      attributes: ['id', 'name', 'description', 'image', 'price', 'category'],
    });

    const html = products
      .map(
        (product) => `<div>
          <img src="${product.image}" alt="${product.name}">
          <p>${product.name}</p>
          <p>${product.description}</p>
          <p>${product.price}</p>
        </div>`,
      )
      .join('');

    res.send(html);
    return; // 응답을 보낸 후 함수 종료
  } catch (error) {
    console.error('에러 ---', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다' });
    return; // 응답을 보낸 후 함수 종료
  }
});

module.exports = router;
