const express = require('express');
const axios = require('axios');
const router = express.Router();
const { sequelize, User, PointHistory } = require('../models');
const secretKey = process.env.TOSS_SECRET_KEY;

// 결제 승인 API
router.get('/success', function (req, res) {
  if (!req.user) return res.status(401).json({ message: 'no user in session' });
  const paymentKey = req.query.paymentKey;
  const orderId = req.query.orderId;
  const amount = req.query.amount;
  const userId = req.user.id;

  axios
    .post(
      'https://api.tosspayments.com/v1/payments/' + paymentKey,
      {
        orderId: orderId,
        amount: amount,
      },
      {
        headers: {
          Authorization:
            'Basic ' + Buffer.from(secretKey + ':').toString('base64'),
          'Content-Type': 'application/json',
        },
      },
    )
    .then(async function (response) {
      const t = await sequelize.transaction();
      try {
        const exUser = await User.findOne({ where: { id: userId } });
        const newAmount = exUser.point + parseInt(amount);
        // user의 point update
        await User.update(
          {
            point: newAmount,
          },
          { where: { id: userId }, transaction: t },
        );
        // pointHistory create
        await PointHistory.create(
          {
            userId: userId,
            balance: newAmount,
            amount: amount,
            status: 0, // 0: 입금,  1 : 출금
            content: `포인트 입금`,
          },
          { transaction: t },
        );

        await t.commit();
        res.status(200).json({ message: 'success' });
      } catch (err) {
        console.error(err);
        await t.rollback();
        res.status(400).json({ message: 'error in db logic' });
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(400).json({ message: 'error' });
    });
});

// 포인트를 현금화
router.route('/cash').patch(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'no user in session' });
  const t = await sequelize.transaction();
  const userId = req.user.id;
  const amount = req.body.amount;

  try {
    const exUser = await User.findOne({ where: { id: userId } });
    let newAmount = 0;

    if (exUser.point < amount) {
      res.status(402).json({ message: 'not enough points' });
    } else {
      newAmount = exUser.point - parseInt(amount);
      // user의 point update
      await User.update(
        {
          point: newAmount,
        },
        { where: { id: userId }, transaction: t },
      );
      // pointHistory create
      await PointHistory.create(
        {
          userId: userId,
          balance: newAmount,
          amount: amount,
          status: 1, // 0: 입금,  1 : 출금
        },
        { transaction: t },
      );

      await t.commit();
      res.status(200).json({ message: 'success' });
    }
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(400).json({ message: 'error' });
  }
});

module.exports = router;
