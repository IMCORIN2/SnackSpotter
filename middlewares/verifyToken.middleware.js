const jwt = require('jsonwebtoken');
const { JWT_ACCESS_TOKEN_SECRET, JWT_ACCESS_TOKEN_EXPIRES_IN,  JWT_REFRESH_TOKEN_SECRET, JWT_REFRESH_TOKEN_EXPIRES_IN } = require('../constants/security.constant');
const db = require('../models/index.js');
const { Users, RefreshTokens } = db;

const verifyToken = async (req, res, next) => {
    try{
        const user = res.locals.user;
        const [tokenType, accessToken] = req.headers.authorization?.split(' ');
        // const refreshToken = await RefreshTokens.findOne({where : { userId : }})
        const refreshToken = RefreshTokens.findOne({where:{ userId : user.id }})
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

    } catch {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
        });
    }
}

module.exports = verifyToken;