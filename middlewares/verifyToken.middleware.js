const jwt = require('jsonwebtoken');
const { JWT_ACCESS_TOKEN_SECRET, JWT_ACCESS_TOKEN_EXPIRES_IN } = require('../constants/security.constant');
const db = require('../models/index.js');
const { Users, RefreshTokens } = db;

const verifyToken = async (req, res, next) => {
    try{
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
          res.locals.user = user;

        const refreshToken = await RefreshTokens.findOne({where:{ userId : user.id }})

        if(!accessToken && !refreshToken) {
            return res.status(400).json({
                success: false,
                message: '인증되지 않은 사용자입니다.',
              });
        }
        
        if(!accessToken && refreshToken) {
            const accessToken = jwt.sign({ userId: user.id }, JWT_ACCESS_TOKEN_SECRET,{
                expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN
              });
          
              const expires = new Date();
              expires.setHours(expires.getHours() + 12);
          
              res.cookie("authorization",`Bearer + ${accessToken}`,{
                  "expires" : expires,
              })
        }

        if(accessToken && refreshToken) {
            return next();
        }

    } catch (error) {
        console.error(error.message);
    // 토큰의 유효기간이 지난 경우와 검증에 실패한 경우는 오류가 뜨기 때문에
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
}

module.exports = verifyToken;