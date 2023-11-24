const jwt = require('jsonwebtoken');
const { JWT_ACCESS_TOKEN_SECRET } = require('../constants/security.constant');
const db = require('../models/index.js');
const { Users } = db;

const isAuthenticated = async (req, res, next) => {
  try {
    const authorizationHeaders = req.headers.authorization;
    if (!authorizationHeaders) {
      return res.status(400).json({
        success: false,
        message: '인증 정보가 없습니다.',
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
    });
  }
};

module.exports = isAuthenticated;
