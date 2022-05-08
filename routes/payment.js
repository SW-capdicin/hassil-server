const express = require('express');
const axios = require('axios');
const router = express.Router();
const { sequelize, User, PointHistory } = require('../models');
const secretKey = process.env.TOSS_SECRET_KEY;

// 결제 승인 API
router.get('/success', function (req, res) {
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
      try {
        const t = await sequelize.transaction();
        const exUser = await User.findOne({ where: { id: userId } });
        const newAmount = exUser.point + parseInt(amount);
        // user의 point update
        await User.update(
          {
            point: newAmount,
          },
          { where: { id: userId } },
          { transaction: t },
        );
        // pointHistory create
        await PointHistory.create(
          {
            userId: userId,
            balance: newAmount,
            amount: amount,
            status: 0, // 0: 입금,  1 : 출금
          },
          { transaction: t },
        );

        await t.commit();

        res.send('success');
      } catch (e) {
        console.error(e);
        res.send('error in db logic');
      }
    })
    .catch(function (e) {
      console.error(e);
      res.send('error');
    });
});

// 포인트를 현금화
router.route('/cash').patch(async (req, res) => {
  const userId = req.user.id;
  const amount = req.body.amount;

  try {
    const exUser = await User.findOne({ where: { id: userId } });
    let newAmount = 0;

    if (exUser.point < amount) {
      res.send('not enough points');
    } else {
      newAmount = exUser.point - parseInt(amount);
      const t = await sequelize.transaction();
      // user의 point update
      await User.update(
        {
          point: newAmount,
        },
        { where: { id: userId } },
        { transaction: t },
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

      res.send('success');
    }
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});

module.exports = router;
