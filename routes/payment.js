const express = require('express');
const got = require('got');
const axios = require('axios');

const router = express.Router();

const secretKey = process.env.TOSS_SECRET_KEY;

// 결제 승인 API
// path : localhost:8080/api/payment/success
router.get('/success', function (req, res) {
  console.log('서버 결제승인 api 실행');
  console.log(secretKey);
  console.log(req.query);

  axios
    .post(
      'https://api.tosspayments.com/v1/payments/' + req.query.paymentKey,
      {
        orderId: req.query.orderId,
        amount: req.query.amount,
      },
      {
        headers: {
          Authorization:
            'Basic dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg==',
          'Content-Type': 'application/json',
        },
      },
    )
    .then(function (response) {
      console.log('성공!!!');
      // console.log(response.body);
      console.log(response);
      res.send('success');
      // TODO: 구매 완료 비즈니스 로직 구현
    })
    .catch(function (e) {
      console.log(e);
      res.redirect(
        `http://localhost:3000/payment-fail?code=${e.response?.body?.code}&message=${e.response?.body?.message}`,
      );
    });
});

module.exports = router;
