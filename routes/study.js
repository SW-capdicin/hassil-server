const express = require('express');
const { sequelize, Study, Comment, StudyMember, User } = require('../models');

const router = express.Router();

router
  .route('/')
  // 스터디 목록 조회
  .get(async (req, res) => {
    try {
      const studies = await Study.findAll({});
      res.json(studies);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  // 스터디 생성
  .post(async (req, res) => {
    try {
      // transaction 적용 필요
      // point 결제 (User update)
      // pointHistory create
      // study create
      // study rewardSum ++
      // study member create

      // 검증 logic 필요
      const study = await Study.create(req.body);
      res.status(200).json(study);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

// 스터디 목록 조회 (카테고리별)
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

// 스터디 글 상세 조회
router
  .route('/:id')
  .get(async (req, res) => {
    try {
      // transaction 적용 필요
      // Study rewardSum/cnt(alive) 최종환급 예상액 추가 필요
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

  // 스터디 글 삭제
  .delete(async (req, res) => {
    try {
      // transaction 적용 필요
      // 잔여 point 환불 (User update)
      // pointHistory create
      // study destroy
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

  // 스터디 댓글 목록 조회
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

  // 스터디 댓글 작성
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

  // 스터디 댓글 수정
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

  // 스터디 댓글 삭제
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

  // 스터디 멤버 조회
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

  // 스터디 참여
  .post(async (req, res) => {
    const userId = req.user.id;
    try {
      const t = await sequelize.transaction();
      const exUser = await User.findOne({ where: { id: userId } });
      const study = await Study.findOne({ where: { id: req.params.id } });
      const newAmount = exUser.point - study.depositPerPerson;

      // 이미 참여중인 경우 (already joined) 처리 필요

      if (newAmount < 0) {
        res.send('not enough points');
      } else {
        // user point update-- (보증금 납부)
        await User.update(
          {
            point: newAmount,
          },
          {
            where: { id: userId },
          },
          { transaction: t },
        );
        // transaction 적용 필요
        // point history create
        // study rewardSum ++
        // studyMember create
        const member = await StudyMember.create(
          {
            studyId: req.params.id,
            userId: userId,
          },
          { transaction: t },
        );
        await t.commit();

        res.status(200).json(member);
      }
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

// 스터디 멤버 중도포기
router.route('/:id/members/:mid').patch(async (req, res) => {
  try {
    // transaction 적용 필요
    // studyMember update
    // study reward ++
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

// 출석 인증
router.route('/:id/members/:mid/attendance').post(async (req, res) => {
  try {
    // 여기에 출석 인증하는 코드 필요
    // transaction 적용 필요
    // 거리비교 후 출석/지각/결석/위치불일치 판단
    // studyMember increment (lateCnt, absentCnt)
    // studyMember isalive update (잔액 부족시 중도포기로 변경)
    // study rewardSum update ++

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

// 스터디 종료 후 포인트 환급
router.route('/:id/members/:mid/point').post(async (req, res) => {
  try {
    // transaction 적용 필요
    // 최종 환급액(rewardSum) 컬럼 테이블에 추가하기
    // Study rewardSum/cnt(alive) 최종환급 예상액 계산 필요
    // User point ++
    // studyMember 환급 완료로 update

    // 여기에 환급 포인트 계산 코드 필요
    const refund = -0;

    const studyMember = await StudyMember.findOne({
      where: { id: req.params.mid },
    });

    // user point update
    await User.increment(
      { point: refund },
      { where: { id: studyMember.userID } },
    );

    // studymember 환급 완료로 update
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
