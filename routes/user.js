const express = require('express');
const passport = require('passport');
const router = express.Router();
const { User } = require('../models');

// 구글 로그인
router.get('/google', passport.authenticate('google', { scope: ['email'] }));
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  req.user.nickname
    ? res.redirect('http://localhost:3000')
    : res.redirect('http://localhost:3000/users/signup');
  res.redirect('http://localhost:3000');
});

/* GET */
// 회원 정보 조회
router.get('/', async (req, res, next) => {
  const id = req.user.id; // from user session
  const data = await User.findOne({ where: { id } });
  res.send(data);
});

// login
router.get('/login', async (req, res, next) => {
  const id = req.user.id; // from user session
  try {
    const data = await User.findOne({ where: { id } });
    res.send(data);
  } catch (e) {
    res.send('error');
  }
});

/* POST */
// 회원가입
router.post('/', async (req, res, next) => {
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
router.patch('/', async (req, res, next) => {
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

/* DELETE */
// 회원 탈퇴
router.delete('/', async (req, res, next) => {
  const id = req.user.id; // from user session
  try {
    await User.destroy({ where: { id } });
    res.send('success');
  } catch (e) {
    res.send('error');
  }
});

module.exports = router;
