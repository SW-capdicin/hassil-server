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
  StudyRoom,
  StudyCafe,
} = require('../models');
const { Op } = require('sequelize');
const createMailRequest = require('./createMailRequest');

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
            status: 1, // 1: 포인트 출금
            content: `보증금 (${req.body.name})`,
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

// 스터디 목록 조회 (가입한 스터디 목록)
router.route('/joined').get(async (req, res) => {
  if (!req.user) return res.status(400).json({ message: 'no user in session' });
  try {
    const study = await Study.findAll({
      include: [{ model: StudyMember, where: { userId: req.user.id } }],
    });
    res.status(200).json(study);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// 스터디 목록 조회 (검색)
router.route('/search').get(async (req, res) => {
  if (!req.user) return res.status(400).json({ message: 'no user in session' });
  const keyword = req.query.keyword;
  console.log(keyword);
  try {
    const studies = await Study.findAll({
      where: {
        name: {
          [Op.like]: '%' + keyword + '%',
        },
      },
    });
    res.status(200).json(studies);
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
      const joinedUsers = await StudyMember.findAll({
        attributes: ['userId'],
        where: { studyId: studyId },
      });
      const reward = Math.floor(study.rewardSum / aliveCnt);
      study.aliveCnt = aliveCnt; // 프론트에서 사용할 참여 인원수
      study.expectedReward = reward; // 프론트에서 사용할 예상환급액
      study.joinedUsers = joinedUsers; // 프론트에서 사용할 가입 멤버 리스트 (참가하기 버튼 비활성화용)

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
      const user = await User.findOne({
        where: { id: userId },
        transaction: t,
      });
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
            status: 1, // 1: 출금
            content: `보증금 (${study.name})`,
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
      {
        userId: userId,
        balance: newAmount,
        amount: refund,
        status: 0,
        content: `보증금 환급 (${study.name})`,
      },
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
      if (req.body.status == 3) {
        const reservation = await Reservation.create(
          {
            studyId: req.params.id,
            reservatingUserId: req.user.id,
            status: req.body.status,
            personCnt: req.body.personCnt,
          },
          { transaction: t },
        );
        await Study.increment(
          { meetingCnt: 1 },
          { where: { id: req.params.id }, transaction: t },
        );
        const meeting = await Meeting.create(
          {
            reservationId: reservation.id,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            address: req.body.address,
            datetime: req.body.datetime,
          },
          { transaction: t },
        );
        await t.commit();
        res.status(200).json({ reservation, meeting });
      } else if (req.body.status == 0) {
        const pricePerPerson = 10000;
        const members = await getAliveMembers(req.params.id);
        const nicknames = await getNoPointMemberNames(pricePerPerson, members);

        if (nicknames.length > 0) {
          res.status(402).json(nicknames);
        } else {
          const reservation = doReservation(
            req.user.id,
            req.params.id,
            req.body.studyRoomSchedules,
            pricePerPerson,
            members,
          );
          res.status(200).json({ reservation });
        }
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

async function getAliveMembers(studyId) {
  const members = await StudyMember.findAll({
    where: {
      studyId,
      isAlive: 1,
    },
    include: [
      { model: User, required: true, attributes: ['point', 'nickname'] },
    ],
  });
  return members;
}

async function getNoPointMemberNames(pricePerPerson, members) {
  let nicknames = [];
  for (let i = 0; i < members.length; i++) {
    if (members[i].User.point < pricePerPerson) {
      nicknames.push(members[i].User.nickname);
    }
  }
  return nicknames;
}

async function doReservation(
  userId,
  studyId,
  studyRoomSchedules,
  pricePerPerson,
  members,
) {
  const t = await sequelize.transaction();
  try {
    const study = await Study.findOne({ where: { id: studyId } });
    for (let i = 0; i < members.length; i++) {
      await User.increment(
        { point: -pricePerPerson },
        { where: { id: members[i].userId }, transaction: t },
      );
      await PointHistory.create(
        {
          userId: members[i].userId,
          balance: members[i].User.point - pricePerPerson,
          amount: pricePerPerson,
          content: `스터디(${study.name}) 장소 결제`,
          status: 1, // 0: 입금,  1 : 출금
        },
        { transaction: t },
      );
    } // end of for()

    const reservation = await Reservation.create(
      {
        studyId,
        reservatingUserId: userId,
        status: 0,
        personCnt: members.length,
      },
      { transaction: t },
    );

    await Study.increment(
      { meetingCnt: 1 },
      { where: { id: studyId }, transaction: t },
    );

    for (let i = 0; i < studyRoomSchedules.length; i++) {
      const result = await StudyRoomSchedule.update(
        {
          reservationId: reservation.id,
          status: 1,
        },
        {
          where: {
            id: studyRoomSchedules[i].id,
          },
          transaction: t,
        },
      );
      if (result == 0) {
        throw 'alert: This study room schedule cannot be reserved.';
      }
      const studyRoomSchedule = await StudyRoomSchedule.findOne({
        where: {
          id: studyRoomSchedules[i].id,
        },
      });
      const user = await User.findOne({
        where: { id: userId },
      });
      const studyRoom = await StudyRoom.findOne({
        where: { id: studyRoomSchedule.studyRoomId },
      });
      const studyCafe = await StudyCafe.findOne({
        where: { id: studyRoom.studyCafeId },
      });
      await createMailRequest(
        '예약확인 메일입니다.',
        '${userName}님! 안녕하세요? HASSIL을 이용해 주셔서 진심으로 감사드립니다.<br/> 스터디룸 예약이 정상적으로 이루어졌습니다. 아래 예약내역을 확인해주세요.<br/><br/>' +
          `예약자: ${user.name}, 스터디카페: ${studyCafe.name}, 스터디룸: ${studyRoom.name}, 이용일시: ${studyRoomSchedule.datetime}, 예약번호: ${studyRoomSchedule.reservationId}`,
        user,
      );
    }

    await t.commit();
    return reservation;
  } catch (err) {
    console.error(err);
    await t.rollback();
  }
}

// 추천받은 스터디 장소 예약 API
router.route('/:id/schedule-recommend/reservations').post(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'no user in session' });
  try {
    const userId = req.user.id;
    const studyId = req.params.id;
    const studyRoomSchedules = req.body.studyRoomScheduleIds;
    const pricePerPerson = req.body.pricePerPerson;
    const members = await getAliveMembers(studyId);
    const nicknames = await getNoPointMemberNames(pricePerPerson, members);

    if (nicknames.length > 0) {
      res.status(402).json(nicknames);
    } else {
      await doReservation(
        userId,
        studyId,
        studyRoomSchedules,
        pricePerPerson,
        members,
      );
      res.status(200).json({ message: 'success' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

module.exports = router;
