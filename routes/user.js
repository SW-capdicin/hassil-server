const express = require('express');
const passport = require('passport');
const { User, PointHistory, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
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
    } catch (e) {
      console.error(e);
    }
  })
  // 회원 가입 및 회원 정보 수정
  .patch(async (req, res) => {
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
      res.status(200).end();
    } catch (e) {
      res.status(400).end();
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

router.post('/logout', (req, res, next) => {
  try {
    req.logout();
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

router.get('/studies', async (req, res) => {
  try {
    const uid = req.user.id;
    const studies = await sequelize.query(
      'SELECT * FROM study WHERE id IN (SELECT studyId FROM studymember WHERE userId=:uid)',
      { replacements: { uid }, type: QueryTypes.SELECT },
    );
    res.json(studies);
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// 사용자 포인트 내역 조회
router.route('/:id/point-history').get(async (req, res) => {
  const userId = req.user.id;
  try {
    const data = await PointHistory.findAll({ where: { userId } });
    res.send(data);
  } catch (e) {
    res.send('error');
  }
});

module.exports = router;
