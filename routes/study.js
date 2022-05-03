const express = require('express');
const { Study, Comment } = require('../models');

const router = express.Router();

router.route('/')
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
        category_id: req.body.category_id,
        name: req.body.name,
        info: req.body.info,
        meeting_cnt: req.body.meeting_cnt,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        deposit_per_person: req.body.deposit_per_person,
        location: req.body.location,
        operation_time: req.body.operation_time,
        min_person: req.body.min_person,
        max_person: req.body.max_person,
        absent_fee: req.body.absent_fee,
        late_fee: req.body.late_fee,
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
      where: { category_id: req.params.cid },
    });
    console.log(study);
    res.json(study);
  } catch (err) {
    console.error(err);
  }
});

router.route('/:id')
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

router.route('/:id/comments')
  .get(async (req, res) => {
    try {
      const comments = await Comment.findAll({
        where: { study_id: req.params.id },
      });
      res.json(comments);
    } catch (err) {
      console.error(err);
    }
  })
  .post(async (req, res) => {
    try {
      const comment = await Comment.create({
        study_id: req.params.id,
        user_id: req.body.user_id,
        contents: req.body.contents,
      });
      console.log(comment);
      res.status(201).json(comment);
    } catch (err) {
      console.log(err);
    }
  });

router.route('/:id/comments/:cid')
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
