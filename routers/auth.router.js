const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/index.js');
const {
  PASSWORD_HASH_SALT_ROUNDS,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
} = require('../constants/security.constant.js');
const isAuthenticated = require('../middlewares/authMiddleware.js');
const { Users } = db;
const { RefreshTokens } = db;
const authRouter = express.Router();

// 이메일 중복 확인
authRouter.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;

    // 이미 등록된 이메일인지 확인
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: '이메일 중복 확인에 성공했습니다.',
        data: { isEmailAvailable: false },
      });
    } else {
      return res.status(200).json({
        success: true,
        message: '이메일 중복 확인에 성공했습니다.',
        data: { isEmailAvailable: true },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
    });
  }
});

// 회원가입
authRouter.post('/signup', async (req, res) => {
  try {
    const { name, email, password, passwordConfirm, gender, birthday } =
      req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '이메일 또는 비밀번호 입력이 필요합니다.',
      });
    }

    if (!passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: '비밀번호 확인 입력이 필요합니다.',
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: '이름 입력이 필요합니다.',
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: '입력한 비밀번호가 서로 일치하지 않습니다.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 최소 6자리 이상입니다.',
      });
    }

    let emailValidationRegex = new RegExp('[a-z0-9._]+@[a-z]+.[a-z]{2,3}');
    const isValidEmail = emailValidationRegex.test(email);
    if (!isValidEmail) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 형식이 아닙니다.',
      });
    }

    const existEmail = await Users.findOne({ where: { email } });
    if (existEmail) {
      return res.status(400).json({
        success: false,
        message: '이미 가입된 이메일입니다.',
      });
    }

    const hashedPassword = bcrypt.hashSync(password, PASSWORD_HASH_SALT_ROUNDS);

    const newUser = (
      await Users.create({
        name,
        email,
        password: hashedPassword,
        gender,
        birthday,
      })
    ).toJSON();
    delete newUser.password;

// 회원가입 성공 후 로그인 처리
const accessToken = jwt.sign(
  { userId: newUser.id },
  JWT_ACCESS_TOKEN_SECRET,
  {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
  },
);

const expires = new Date();
expires.setHours(expires.getHours() + 12);

res.cookie('authorization', `Bearer ${accessToken}`, {
  expires: expires,
});

const refreshToken = jwt.sign(
  { userId: newUser.id },
  JWT_REFRESH_TOKEN_SECRET,
  {
    expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
  },
);

const newRefreshToken = (
  await RefreshTokens.create({ value: refreshToken, userId: newUser.id })
).toJSON();

return res.status(201).json({
  success: true,
  message: '회원가입 및 로그인에 성공했습니다.',
  data: { accessToken },
});
} catch (error) {
console.error(error);
return res.status(500).json({
  success: false,
  message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
});
}
});

//로그인
authRouter.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '이메일 또는 비밀번호 입력이 필요합니다.',
      });
    }

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '일치하는 사용자 정보가 없습니다.',
      });
    }

    const hashedPassword = user.password;
    const isPasswordMatched = bcrypt.compareSync(password, hashedPassword);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    );

    const expires = new Date();
    expires.setHours(expires.getHours() + 12);

    res.cookie('authorization', `Bearer ${accessToken}`, {
      expires: expires,
    });

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
    );

    const newRefreshToken = (
      await RefreshTokens.create({ value: refreshToken, userId: user.id })
    ).toJSON();

    return res.status(200).json({
      success: true,
      message: '로그인에 성공했습니다.',
      data: { accessToken },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
    });
  }
});


authRouter.post('/logout', isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    res.clearCookie('authorization');

    // HTTP DELETE 메서드에서 destroy를 만들고 새로 GET메서드를 파야하나
    // db에 있는 refresh 토큰값과 그냥 가지고 있는 refresh 토큰 값을 비교해서 refresh 토큰이 존재한다고 조건을 걸면 되는건가
    const refreshToken = await RefreshTokens.destroy({
      where: { userId: user.id },
    });

    res.status(200).json({
      success: true,
      message: '정상적으로 로그아웃 되었습니다.',
      data: {},
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
    });
  }
});

module.exports = authRouter;
