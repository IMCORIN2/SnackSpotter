const jwt = require('jsonwebtoken');
const {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRES_IN,
} = require('../constants/security.constant');
const db = require('../models/index.js');
const { Users, RefreshTokens } = db;

const isAuthenticated = async (req, res, next) => {
  try {
    const authorizationHeaders = req.headers.authorization;
    if (!authorizationHeaders) {
      return res.status(400).json({
        success: false,
        message: '인증 정보가 없습니다.',
      });
    }

    const [tokenType, accessToken] = authorizationHeaders.split(' ');

    if (tokenType !== 'Bearer') {
      return res.status(400).json({
        success: false,
        message: '지원하지 않는 인증 방식입니다.',
      });
    }

    // 토큰이 유효한지 확인
    const decodedPayload = jwt.verify(accessToken, JWT_ACCESS_TOKEN_SECRET);

    const { userId } = decodedPayload;
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: '존재하지 않는 사용자입니다.',
      });
    }

    req.user = user; // 사용자 정보를 req.user에 할당

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
    });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const [tokenType, accessToken] = req.headers.authorization?.split(' ');

    if (tokenType !== 'Bearer') {
      return res.status(400).json({
        success: false,
        message: '지원하지 않는 인증 방식입니다.',
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
    req.user = user;

    const refreshToken = await RefreshTokens.findOne({
      where: { userId: user.id },
    });

    if (!accessToken && !refreshToken) {
      return res.status(400).json({
        success: false,
        message: '인증되지 않은 사용자입니다.',
      });
    }

    if (refreshToken && !accessToken) {
      // 기존 코드에서 사용되지 않는 refreshToken 변수를 지움
      const newAccessToken = jwt.sign(
        { userId: user.id },
        JWT_ACCESS_TOKEN_SECRET,
        {
          expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
        },
      );

      const expires = new Date();
      expires.setHours(expires.getHours() + 12);

      res.cookie('authorization', `Bearer ${newAccessToken}`, {
        expires: expires,
      });
    }

    if (accessToken && refreshToken) {
      return next();
    }
  } catch (error) {
    console.error('error message=>', error.message);

    let statusCode = 500;
    let errorMessage = '';

    switch (error.message) {
      case 'jwt expired':
        // 여기서 refreshToken을 얻어오기
        const refreshToken = req.cookies.authorization.split(' ')[2];

        // refreshToken이 존재하면 새로운 accessToken을 발급하고 쿠키를 업데이트
        if (refreshToken) {
          const newAccessToken = jwt.sign(
            { userId: decodedPayload.userId },
            JWT_ACCESS_TOKEN_SECRET,
            {
              expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
            },
          );

          const expires = new Date();
          expires.setHours(expires.getHours() + 12);

          res.cookie('authorization', `Bearer ${newAccessToken}`, {
            expires: expires,
          });
        }
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

module.exports = isAuthenticated;
