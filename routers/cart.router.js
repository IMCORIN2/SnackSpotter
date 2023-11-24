const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/authMiddleware.js');
const verifyToken = require('../middlewares/verifyToken.middleware.js');

const { Carts, Products } = require('../models');

// 장바구니 조회
router.get('/', isAuthenticated, verifyToken, async (req, res) => {
  const cart = await Carts.findAll({
    where: { userId: res.locals.user.id },
    attributes: ['productId', 'quantity'],
  });

  const cartWithProductName = await Promise.all(
    cart.map(async (cartItem) => {
      const product = await Products.findByPk(cartItem.productId, {
        attributes: ['name'],
      });

      return {
        productName: product ? product.name : null,
      };
    }),
  );

  res.status(200).json({
    success: true,
    message: '장바구니 목록 조회 성공하였습니다',
    data: { cartWithProductName, cart },
  });
});

// 장바구니에 물품 추가
router.post('/', isAuthenticated, verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    await Carts.create({
      userId: res.locals.user.id,
      productId,
      quantity,
    });

    res.status(200).json({
      success: true,
      message: '장바구니에 담기 성공하였습니다',
    });
  } catch (error) {
    console.error('에러 --- ', error);
  }
});

module.exports = router;
