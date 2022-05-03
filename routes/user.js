const express = require('express');
const passport = require('passport');
const { User, PointHistory } = require('../models');
require('dotenv').config();

const router = express.Router();

// 구글 로그인
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
    // 로그인 되어 있을 때
    if (req.user) {
      const { id } = req.user.dataValues; // from user session
      // 회원가입 되어 있을 때
      if (req.user.nickname) {
        res.json({
          id: id,
          nickname: req.user.nickname,
          phone_number: req.user.phone_number,
          point: req.user.point,
          type: req.user.type,
          name: req.user.name,
          bank_name: req.user.bank_name,
          bank_account: req.user.bank_account,
          src: req.user.src,
        });
      } else {
        res.json(id);
      }
    } else {
      res.json();
    }
  })

  // 회원 가입 및 회원 정보 수정
  .patch(async (req, res) => {
    const id = req.user.id;
    try {
      await User.update(
        {
          nickname: req.body.nickname,
          phone_number: req.body.phone_number,
          type: req.body.type,
          name: req.body.name,
          bank_name: req.body.bank_name,
          bank_account: req.body.bank_account,
        },
        { where: { id } },
      );
      res.send('success');
    } catch (e) {
      res.send('error');
    }
  })

  // 회원 탈퇴
  .delete(async (req, res) => {
    const id = req.user.id;
    try {
      await User.destroy({ where: { id } });
      res.send('success');
    } catch (e) {
      res.send('error');
    }
  });

// 사용자 포인트 내역 조회
router.route('/:id/point-history').get(async (req, res) => {
  const user_id = req.user.id;
  try {
    const data = await PointHistory.findAll({ where: { user_id } });
    res.send(data);
  } catch (e) {
    res.send('error');
  }
});

module.exports = router;
