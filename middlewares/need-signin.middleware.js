const jwt = require('jsonwebtoken');
const { JWT_ACCESS_TOKEN_SECRET } = require('../constants/security.constant');
const db = require('../models/index.js');
const { Users } = db;

const needSignin = async (req, res, next) => {
  try {
    const authorizationHeaders = req.headers.authorization;
    console.log('여기');
    if (!authorizationHeaders) {
      return res.status(400).json({
        success: false,
        message: '인증 정보가 없습니다.',
      });
    }
    const [tokenType, accessToken] = req.headers.authorization?.split(' ');

    if (tokenType !== 'Bearer') {
      return res.status(400).json({
        success: false,
        message: '지원하지 않는 인증 방식입니다.',
      });
    }

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'AccessToken이 없습니다.',
      });
    }

    const decodedPayload = jwt.verify(accessToken, JWT_ACCESS_TOKEN_SECRET);

    const { userId } = decodedPayload;
    const user = (await Users.findByPk(userId)).toJSON();

    if (!user) {
      return res.status(400).json({
        success: false,
        message: '존재하지 않는 사용자입니다.',
      });
    }

    delete user.password;
    res.locals.user = user;

    next();
  } catch (error) {
    console.error(error.message);
    // 토큰의 유효기간이 지난 경우와 검증에 실패한 경우는 오류가 뜨지 때문에
    // catch의 error 부분에서 처리해줌
    let statusCode = 500;
    let errorMessage = '';

    switch (error) {
      case 'jwt expired':
        statusCode = 401;
        errorMessage = '인증 정보 유효기간이 지났습니다.';
        break;
      case 'invalid signature':
        statusCode = 401;
        errorMessage = '유효하지 않은 인증 정보입니다.';
        break;
      default:
        statusCode = 500;
        errorMessage = '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요';
        break;
    }
    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

module.exports = needSignin;
