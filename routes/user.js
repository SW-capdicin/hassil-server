const express = require('express');
const passport = require('passport');
const { User, PointHistory } = require('../models');
require('dotenv').config();

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['email'] }));
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  req.user.nickname
    ? res.redirect(process.env.GOOGLE_LOGIN_HOME_REDIRECT_URL)
    : res.redirect(process.env.GOOGLE_LOGIN_SIGNUP_REDIRECT_URL);
});

router
  .route('/')
  // 회원 정보 조회
  .get(async (req, res) => {
    try {
      // 로그인 확인
      if (req.user) {
        const id = req.user.id; // from user session
        const user = await User.findOne({
          where: { id },
        });
        // 회원가입 확인
        user.nickname ? res.json(user) : res.json({ id });
      } else {
        res.json({});
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'error' });
    }
  })
  // 회원 가입 및 회원 정보 수정
  .patch(async (req, res) => {
    if (!req.user)
      return res.status(401).json({ message: 'no user in session' });
    const id = req.user.id;
    try {
      await User.update(
        {
          nickname: req.body.nickname,
          phoneNumber: req.body.phoneNumber,
          type: req.body.type,
          name: req.body.name,
          bankName: req.body.bankName,
          bankAccount: req.body.bankAccount,
        },
        { where: { id } },
      );
      res.status(200).json({ message: 'success' });
    } catch (err) {
      res.status(400).json({ message: 'error' });
    }
  })
  // 회원 탈퇴
  .delete(async (req, res) => {
    if (!req.user)
      return res.status(401).json({ message: 'no user in session' });
    const id = req.user.id;
    try {
      await User.destroy({ where: { id } });
      res.status(200).json({ message: 'success' });
    } catch (err) {
      res.status(400).json({ message: 'error' });
    }
  });

router.post('/logout', (req, res, next) => {
  try {
    req.logout();
    res.status(200).json({ message: 'success' });
  } catch (err) {
    next(err);
  }
});

// 사용자 포인트 내역 조회
router.route('/:id/point-history').get(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'no user in session' });
  const userId = req.user.id;
  try {
    const data = await PointHistory.findAll({ where: { userId } });
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'error' });
  }
});

module.exports = router;
