const express = require('express');
const req = require('express/lib/request');
const { Study, Comment, StudyMember, User } = require('../models');

const router = express.Router();

router
  .route('/')
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
      res.status(200).json(study);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
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
    res.status(400).json(err);
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
      res.status(400).json(err);
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
      res.status(200).json(comment);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
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

router
  .route('/:id/members')
  .get(async (req, res) => {
    try {
      const members = await StudyMember.findAll({
        where: { studyId: req.params.id },
      });
      res.json(members);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .post(async (req, res) => {
    try {
      const member = await StudyMember.create({
        studyId: req.params.id,
        userId: req.body.userId,
      });
      console.log(member);
      res.status(200).json(member);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

router.route('/:id/members/:mid').patch(async (req, res) => {
  try {
    const result = await StudyMember.update(
      {
        isAlive: 0,
      },
      { where: { id: req.params.mid } },
    );
    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.route('/:id/members/:mid/attendance').post(async (req, res) => {
  try {
    // 여기에 출석 인증하는 코드

    const isLateness = 0;
    const isAbsence = 0;

    const result = await StudyMember.increment(
      { lateCnt: isLateness, absentCnt: isAbsence },
      { where: { id: req.params.mid } },
    );
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.route('/:id/members/:mid/point').post(async (req, res) => {
  try {
    // 여기에 환급 포인트 계산 코드
    const refund = -0;

    const studyMember = await StudyMember.findOne({
      where: { id: req.params.mid },
    });
    await User.increment(
      { point: refund },
      { where: { id: studyMember.userID } },
    );

    const result = await StudyMember.update(
      {
        isAlive: 2,
      },
      { where: { id: req.params.mid } },
    );
    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
