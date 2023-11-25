const express = require("express");
const usersRouter = express.Router();
const isAuthenticated = require("../middlewares/authMiddleware");
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const {PASSWORD_HASH_SALT_ROUNDS} = require('../constants/security.constant.js');

// 이메일 중복 확인
usersRouter.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;

    // 이미 등록된 이메일인지 확인
    const existingUser = await Users.findOne({ where: { email } });

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

usersRouter.get("/", isAuthenticated, (req, res) => {
  try {
    const me = req.user;
    console.log(me);
    return res.status(200).json({
      success: true,
      message: "내 정보 조회에 성공했습니다.",
      data: me,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
    });
  }
});

// 회원 수정
usersRouter.put('/', isAuthenticated, async (req, res) => {
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
    console.log(req.user.id)
    const user = await Users.findOne({ where: { id: req.user.id } });

    // 이미 등록된 이메일인지 확인
    const existingUser = await Users.findOne({ where: { email } });
    console.log(existingUser)
    
    try {
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({
          success: false,
          message: '이미 가입된 이메일입니다.',
        });
      } else {
        const hashedPassword = bcrypt.hashSync(password, PASSWORD_HASH_SALT_ROUNDS);

        const [numOfAffectedRows, updatedUser] = await Users.update({
          name,
          email,
          password: hashedPassword,
          gender,
          birthday,
        }, {
          where: { id: req.user.id },
          returning: true, 
        });
        console.log(numOfAffectedRows)
        if (numOfAffectedRows > 0) {
          return res.status(200).json({
            success: true,
            message: '회원 수정에 성공했습니다.',
            data: updatedUser[0], // updatedUser가 배열이므로 첫 번째 요소를 반환
          });
        } else {
          return res.status(404).json({
            success: false,
            message: '회원을 찾을 수 없습니다.',
          });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
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

module.exports = usersRouter;
