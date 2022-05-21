const express = require('express');
const { StudyCafe, Review } = require('../models');

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    try {
      const studyCafes = await StudyCafe.findAll({});
      res.status(200).json(studyCafes);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .post(async (req, res) => {
    try {
      const studyCafe = await StudyCafe.create({
        userId: req.user.id,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        address: req.body.address,
        shopNumber: req.body.shopNumber,
        name: req.body.name,
        info: req.body.info,
        operationTime: req.body.operationTime,
        rating: req.body.rating,
      });
      res.status(200).json(studyCafe);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      const studyCafes = await StudyCafe.findOne({
        where: { id: req.params.id },
        include: { model: Review },
      });
      res.status(200).json(studyCafes);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .patch(async (req, res) => {
    try {
      const result = await StudyCafe.update(
        {
          longitude: req.body.longitude,
          latitude: req.body.latitude,
          address: req.body.address,
          shopNumber: req.body.shopNumber,
          name: req.body.name,
          info: req.body.info,
          operationTime: req.body.operationTime,
          rating: req.body.rating,
        },
        {
          where: { id: req.params.id },
        },
      );
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await StudyCafe.destroy({
        where: { id: req.params.id },
      });
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

router.route('/:id/reviews').post(async (req, res) => {
  try {
    const review = await Review.create({
      studyCafeId: req.params.id,
      userId: req.user.id,
      contents: req.body.contents,
      rating: req.body.rating,
    });
    res.status(200).json(review);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.route('/:id/reviews/:rid').delete(async (req, res) => {
  try {
    const result = await Review.destroy({
      where: { id: req.params.rid },
    });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

module.exports = router;
