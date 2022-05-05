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
      res.status(400).json(err);
    }
  })
  .post(async (req, res) => {
    try {
      // 검증 logic 필요
      const study = await Study.create(req.body);
      console.log(study);
      res.status(200).json(study);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
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
    res.status(400).json(err);
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
      res.status(400).json(err);
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
      res.status(400).json(err);
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
      res.status(400).json(err);
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
      res.status(200).json(comment);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
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
      res.status(400).json(err);
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
      res.status(400).json(err);
    }
  });

module.exports = router;
