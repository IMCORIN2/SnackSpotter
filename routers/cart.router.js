const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/authMiddleware.js');

const { Carts, Products } = require('../models');
const { where } = require('sequelize');

// 장바구니 조회
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const carts = await Carts.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'productId', 'quantity'],
    });

    const products = await Promise.all(
      carts.map(async (cartItem) => {
        const product = await Products.findByPk(cartItem.productId, {
          attributes: ['name', 'price', 'image'],
        });

        return {
          price: product.price,
          name: product.name,
          image: product.image,
        };
      }),
    );

    res.status(200).json({
      success: true,
      message: '장바구니 목록 조회 성공하였습니다',
      products,
      carts,
    });
  } catch (error) {
    console.error('에러 --- ', error);
    res.status(500).json({
      success: false,
      message: '장바구니 목록 조회에 실패하였습니다',
    });
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  try {
    if (!req.user) {
      // 토큰이 없거나 유효하지 않은 경우 401 에러를 클라이언트에게 반환
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.',
      });
    }

    const { productId, quantity } = req.body;

    const existProduct = await Carts.findOne({
      where: { userId: req.user.id, productId: productId },
      attributes: ['quantity'],
    });

    if (existProduct) {
      await Carts.update(
        { quantity: quantity + (existProduct.quantity || 0) },
        { where: { userId: req.user.id, productId: productId } },
      );
    } else {
      await Carts.create({
        userId: req.user.id,
        productId,
        quantity,
      });
    }

    // 성공 메시지 및 버튼과 함께 응답
    res.status(200).json({
      success: true,
      message: '장바구니에 담기 성공하였습니다',
    });
  } catch (error) {
    console.error('에러 --- ', error);
    res.status(500).json({
      success: false,
      message: '장바구니에 담기 실패하였습니다',
    });
  }
});

// 장바구니의 물품 삭제
router.delete('/', isAuthenticated, async (req, res) => {
  const { productId } = req.body;

  console.log(req.user.id);
  console.log(productId);

  try {
    const deleteProduct = await Carts.findOne({
      where: { userId: req.user.id, productId },
    });
    if (deleteProduct) {
      await deleteProduct.destroy();
      res.json({ success: true, message: '상품을 삭제하였습니다' });
    } else {
      return res
        .status(400)
        .json({ success: false, errorMessage: '상품을 찾을 수 없습니다' });
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: '상품 삭제에 실패했습니다', error });
  }
});

router.delete('/all', isAuthenticated, async (req, res) => {
  try {
    await Carts.destroy({ where: { userId: req.user.id } });
    res.json({ success: true, message: '상품을 삭제하였습니다' });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: '상품 삭제에 실패했습니다', error });
  }
});

// 장바구니의 물품 수정
router.put('/', isAuthenticated, async (req, res) => {
  const { id, quantity } = req.body;

  try {
    const findProduct = await Carts.findOne({ where: { id: id } });
    if (findProduct) {
      const updatedRows = await findProduct.update({ quantity: quantity });
      console.log('Updated Rows:', updatedRows);
      return res.json({
        success: true,
        message: '상품 정보를 수정하였습니다',
      });
    } else {
      return res
        .status(400)
        .json({ success: false, errorMessage: '상품을 찾을 수 없습니다' });
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: '상품 수정 실패했습니다', error });
  }
});

router.put('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const findProduct = await Products.findByPk(id);

    if (findProduct) {
      await findProduct.update({ quantity });
      return res.json({
        success: true,
        message: '상품 정보를 수정하였습니다',
      });
    } else {
      return res
        .status(400)
        .json({ success: false, errorMessage: '상품을 찾을 수 없습니다' });
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: '상품 수정 실패했습니다', error });
  }
});

module.exports = router;
