const express = require('express');
const passport = require('passport');
const router = express.Router();
const { User } = require('../models');
const { PointHistory } = require('../models');
require('dotenv').config();

// 구글 로그인
router.get('/google', passport.authenticate('google', { scope: ['email'] }));
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  req.user.nickname
    ? res.redirect(process.env.GOOGLE_LOGIN_HOME_REDIRECT_URL)
    : res.redirect(process.env.GOOGLE_LOGIN_SIGNUP_REDIRECT_URL);
});

// 회원 정보 조회
router.get('/', (req, res) => {
  if (req.user) {
    const { id } = req.user.dataValues;
    res.send({ id });
  } else {
    res.send({});
  }
});

/* POST */
// 회원가입
router.post('/', async (req, res) => {
  try {
    await User.create({
      email: req.body.email,
      pid: req.body.pid,
      nickname: req.body.nickname,
      phone_number: req.body.phone_number,
      point: req.body.point,
      type: req.body.type,
      name: req.body.name,
      bank_name: req.body.bank_name,
      bank_account: req.body.bank_account,
      src: req.body.src,
    });
    res.send('success');
  } catch (e) {
    res.send('error');
  }
});

/* PATCH */
// 회원 정보 수정
router.patch('/', async (req, res) => {
  const id = req.user.id; // from user session
  try {
    await User.update(
      {
        nickname: req.body.nickname,
        phone_number: req.body.phone_number,
        bank_name: req.body.bank_name,
        bank_account: req.body.bank_account,
      },
      { where: { id } },
    );
    res.send('success');
  } catch (e) {
    res.send('error');
  }
});

// 회원 탈퇴
router.delete('/', async (req, res) => {
  const id = req.user.id; // from user session
  try {
    await User.destroy({ where: { id } });
    res.send('success');
  } catch (e) {
    res.send('error');
  }
});

// 사용자 포인트 내역 조회
router.get('/:id/point-history', async (req, res, next) => {
  const user_id = req.user.id; // from user session
  try {
    const data = await PointHistory.findAll({ where: { user_id } });
    res.send(data);
  } catch (e) {
    res.send('error');
  }
});

module.exports = router;
