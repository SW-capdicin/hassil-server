const express = require('express');
const utils = require('./utils');
const {
  sequelize,
  Study,
  Comment,
  StudyMember,
  User,
  PointHistory,
  Reservation,
  Meeting,
  StudyRoomSchedule,
} = require('../models');

const router = express.Router();

router
  .route('/')
  // 스터디 목록 조회
  .get(async (req, res) => {
    try {
      const studies = await Study.findAll({});
      res.status(200).json(studies);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  // 스터디 생성
  .post(async (req, res) => {
    if (!req.user)
      return res.status(400).json({ message: 'no user in session' });
    const t = await sequelize.transaction();
    const userId = req.user.id;
    try {
      // 검증 logic 필요
      const user = await User.findOne({
        where: { id: userId },
        transaction: t,
      });

      const newAmount = user.point - req.body.depositPerPerson;

      if (newAmount < 0) {
        res.status(400).json({ message: 'not enough points' });
      } else {
        await User.update(
          {
            point: newAmount,
          },
          {
            where: { id: userId },
            transaction: t,
          },
        );
        await PointHistory.create(
          {
            userId: userId,
            balance: newAmount,
            amount: req.body.depositPerPerson,
            status: 1,
          },
          { transaction: t },
        );
        const study = await Study.create(req.body, { transaction: t });
        await StudyMember.create(
          { studyId: study.id, userId: userId },
          { transaction: t },
        );

        await t.commit();

        res.status(200).json(study);
      } // end of else
    } catch (err) {
      console.error(err);
      await t.rollback();
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
    res.status(200).json(study);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// 스터디 글 상세 조회
router
  .route('/:id')
  .get(async (req, res) => {
    const studyId = req.params.id;
    try {
      const aliveCnt = await StudyMember.count({
        where: {
          studyId: studyId,
          isAlive: [1, 2],
        },
      });
      const study = await Study.findOne({
        where: { id: studyId },
        raw: true,
      });
      const reservation = await Reservation.findAll({
        where: { studyId: studyId },
        order: [['createdAt', 'DESC']],
        limit: 1,
      });
      const reward = Math.floor(study.rewardSum / aliveCnt);
      study.aliveCnt = aliveCnt; // 프론트에서 사용할 참여 인원수
      study.expectedReward = reward; // 프론트에서 사용할 예상환급액
      study.reservationId = reservation[0].id;

      console.log(study);
      res.status(200).json(study);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })

  // 스터디 글 삭제
  .delete(async (req, res) => {
    try {
      // TODO -- 중간평가 이후
      // transaction 적용 필요
      // 잔여 point 환불 (User update)
      // pointHistory create
      // study destroy
      const result = await Study.destroy({
        where: { id: req.params.id },
      });
      console.log(result);
      res.status(200).json(result);
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
      res.status(200).json(comments);
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
      res.status(200).json(result);
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
      res.status(200).json(result);
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
      res.status(200).json(members);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

router
  .route('/:id/member')
  // 스터디 참여
  .post(async (req, res) => {
    if (!req.user)
      return res.status(400).json({ message: 'no user in session' });
    const t = await sequelize.transaction();
    const userId = req.user.id;

    try {
      const user = await User.findOne(
        { where: { id: userId } },
        { transaction: t },
      );
      const study = await Study.findOne({
        where: { id: req.params.id },
        transaction: t,
      });
      const newAmount = user.point - study.depositPerPerson;

      // 이미 참여중인 경우 (already joined) 처리 필요

      if (newAmount < 0) {
        res.status(400).json({ message: 'not enough points' });
      } else {
        await User.update(
          {
            point: newAmount,
          },
          {
            where: { id: userId },
            transaction: t,
          },
        );
        await PointHistory.create(
          {
            userId: userId,
            balance: newAmount,
            amount: study.depositPerPerson,
            status: 1,
          },
          { transaction: t },
        );
        const member = await StudyMember.create(
          {
            studyId: req.params.id,
            userId: userId,
          },
          { transaction: t },
        );
        await t.commit();

        res.status(200).json(member);
      } // end of else
    } catch (err) {
      console.error(err);
      await t.rollback();
      res.status(400).json(err);
    }
  })
  // 스터디 멤버 조회
  .get(async (req, res) => {
    if (!req.user)
      return res.status(400).json({ message: 'no user in session' });
    try {
      const member = await StudyMember.findOne({
        where: { studyId: req.params.id, userId: req.user.id },
      });
      console.log(member);
      res.status(200).json(member);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

// 스터디 멤버 중도포기
router.route('/:id/member/drop').patch(async (req, res) => {
  if (!req.user) return res.status(400).json({ message: 'no user in session' });
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const studyId = req.params.id;

    const study = await Study.findOne({
      where: { id: studyId },
      transaction: t,
    });

    const studyMembers = await StudyMember.findAll({
      where: { studyId: studyId },
      transaction: t,
    });

    const result = await StudyMember.update(
      { isAlive: 0 },
      { where: { studyId: studyId, userId: userId }, transaction: t },
    );

    // study의 rewardSum 재계산
    const rewardSum = utils.getRewardSum(study, studyMembers);
    await Study.update(
      { rewardSum: rewardSum },
      { where: { id: studyId }, transaction: t },
    );

    await t.commit();
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(400).json(err);
  }
});

// 스터디 종료 후 포인트 환급
router.route('/:id/member/point').patch(async (req, res) => {
  if (!req.user) return res.status(400).json({ message: 'no user in session' });
  const t = await sequelize.transaction();
  const userId = req.user.id;
  const studyId = req.params.id;

  try {
    const user = await User.findOne({
      where: { id: userId },
      transaction: t,
    });

    const aliveCnt = await StudyMember.count({
      where: {
        studyId: studyId,
        isAlive: [1, 2],
      },
      transaction: t,
    });

    const study = await Study.findOne({
      where: {
        id: studyId,
      },
      transaction: t,
    });

    const refund = Math.floor(study.rewardSum / aliveCnt);
    const newAmount = user.point + refund;

    await User.increment(
      { point: refund },
      { where: { id: userId }, transaction: t },
    );

    await PointHistory.create(
      { userId: userId, balance: newAmount, amount: refund, status: 0 },
      { transaction: t },
    );

    await StudyMember.update(
      { isAlive: 2 },
      { where: { studyId: studyId, userId: userId }, transaction: t },
    );

    await t.commit();

    res.status(200).json();
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(400).json(err);
  }
});

router
  .route('/:id/reservations')
  .get(async (req, res) => {
    try {
      const reservations = await Reservation.findAll({
        where: { studyId: req.params.id },
        include: [{ model: Meeting }, { model: StudyRoomSchedule }],
      });
      console.log(reservations);
      res.status(200).json(reservations);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  })
  .post(async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const reservation = await Reservation.create(
        {
          studyId: req.params.id,
          reservationPersonName: req.body.reservationPersonName,
        },
        { transaction: t },
      );
      console.log(reservation);

      await Study.increment(
        { meetingCnt: 1 },
        { where: { id: req.params.id }, transaction: t },
      );

      if (reservation.status == 3) {
        const meeting = await Meeting.create(
          {
            reservationId: reservation.id,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            address: req.body.address,
            startTime: req.body.startTime,
          },
          { transaction: t },
        );
        console.log(meeting);
        res.status(200).json({ reservation, meeting });
      } else {
        const result = await StudyRoomSchedule.update(
          {
            reservationId: reservation.id,
            status: 1,
          },
          {
            where: {
              studyRoomId: req.body.studyRoomId,
              time: req.body.time,
              status: 0,
            },
            transaction: t,
          },
        );
        if (result == 0) {
          // A result is the number of affected rows.
          throw 'alert: This study room schedule cannot be reserved.';
        }
        await t.commit();
        res.status(200).json({ reservation, result });
      }
    } catch (err) {
      await t.rollback();
      console.log(err);
      res.status(400).json(err);
    }
  });

router
  .route('/:id/reservations/:rid')
  .get(async (req, res) => {
    try {
      const reservation = await Reservation.findOne({
        where: { id: req.params.rid },
        include: [{ model: Meeting }, { model: StudyRoomSchedule }],
      });
      console.log(reservation);
      res.status(200).json(reservation);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  })
  .patch(async (req, res) => {
    try {
      const result = await Reservation.update(
        {
          status: req.body.status,
        },
        {
          where: { id: req.params.rid },
        },
      );
      console.log(result);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await Reservation.destroy({
        where: { id: req.params.rid },
      });
      console.log(result);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  });

module.exports = router;
