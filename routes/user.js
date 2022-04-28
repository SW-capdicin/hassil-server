const express = require('express');
const router = express.Router();
const { User } = require('../models')

/* GET */
// 회원 정보 조회
router.get('/', async (req, res, next) => {
  const id = 1; // from user session
  res.send(await User.findOne({ where: { id } }));
});
// login
router.get('/login', async (req, res, next) => {
  const pid = null; // from user session
  try {
    const data = await User.findOne({ where: { pid } });
    res.send(data);
  } catch (e) {
    res.send("error");
  }
});

/* POST */
// 회원가입
router.post('/', async (req, res, next) => {
  try {
    await User.create(req.body);
    res.send("success");
  } catch (e) {
    res.send("error");
  }
});

/* PATCH */
// 회원 정보 수정
router.patch('/', async (req, res, next) => {
  const id = null; // from user session
  try {
    await User.update(req.body, { where: { id } });
    res.send("success");
  } catch (e) {
    res.send("error");
  }
})

/* DELETE */
// 회원 탈퇴
router.delete('/', async (req, res, next) => {
  const id = null; // from user session
  try {
    await User.destroy({ where: { id } });
    res.send("success");
  } catch (e) {
    res.send("error");
  }
})

module.exports = router;