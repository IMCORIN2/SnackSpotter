const express = require('express')
const router = express.Router()
const isAuthenticated = require('../middlewares/authMiddleware.js');
const verifyToken = require("../middlewares/verifyToken.middleware.js");

const { Cart } = require("../models")

// 장바구니 조회
router.get('/', isAuthenticated, verifyToken, async (req, res)=>{
    // 맞는 User에게만 보여야함
    const cart = await Cart.findAll({ where:res.locals.user.id===Cart.userId, attributes: [productId, quantity] })

    res.status(200).json({success:true, message: "장바구니 목록 조회 성공하였습니다", data: { cart }})
})

// 장바구니에 물품 추가
router.post('/', isAuthenticated, verifyToken, async (req, res)=>{
    const {productId, quantity}= req.body

    await Cart.create({userId: res.locals.user.id, productId, quantity});

    res.status(200).json({success:true,message:"장바구니에 담기 성공하였습니다"})
})

module.exports = router