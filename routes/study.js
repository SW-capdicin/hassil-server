const express = require('express');
const { Study, Comment } = require('../models');

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    try {
      const studies = await Study.findAll({});
      res.json(studies);
    } catch (err) {
      console.error(err);
    }
  })
  .post(async (req, res) => {
    try {
      const study = await Study.create({
        categoryId: req.body.categoryId,
        name: req.body.name,
        info: req.body.info,
        meetingCnt: req.body.meetingCnt,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        depositPerPerson: req.body.depositPerPerson,
        location: req.body.location,
        operationTime: req.body.operationTime,
        minPerson: req.body.minPerson,
        maxPerson: req.body.maxPerson,
        absentFee: req.body.absentFee,
        lateFee: req.body.lateFee,
        src: req.body.src,
      });
      console.log(study);
      res.status(201).json(study);
    } catch (err) {
      console.error(err);
    }
  });

router.route('/categories/:cid').get(async (req, res) => {
  try {
    const study = await Study.findAll({
      where: { categoryId: req.params.cid },
    });
    console.log(study);
    res.json(study);
  } catch (err) {
    console.error(err);
  }
});

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      const study = await Study.findOne({
        where: { id: req.params.id },
      });
      console.log(study);
      res.json(study);
    } catch (err) {
      console.error(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await Study.destroy({
        where: { id: req.params.id },
      });
      console.log(result);
      res.json(result);
    } catch (err) {
      console.error(err);
    }
  });

router
  .route('/:id/comments')
  .get(async (req, res) => {
    try {
      const comments = await Comment.findAll({
        where: { studyId: req.params.id },
      });
      res.json(comments);
    } catch (err) {
      console.error(err);
    }
  })
  .post(async (req, res) => {
    try {
      const comment = await Comment.create({
        studyId: req.params.id,
        userId: req.body.userId,
        contents: req.body.contents,
      });
      console.log(comment);
      res.status(201).json(comment);
    } catch (err) {
      console.log(err);
    }
  });

router
  .route('/:id/comments/:cid')
  .patch(async (req, res) => {
    try {
      const result = await Comment.update(
        {
          contents: req.body.contents,
        },
        { where: { id: req.params.cid } },
      );
      console.log(result);
      res.json(result);
    } catch (err) {
      console.log(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await Comment.destroy({
        where: { id: req.params.cid },
      });
      console.log(result);
      res.json(result);
    } catch (err) {
      console.error(err);
    }
  });

module.exports = router;
