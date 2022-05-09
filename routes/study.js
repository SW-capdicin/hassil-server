const express = require('express');
const {
  sequelize,
  Study,
  Comment,
  StudyMember,
  User,
  PointHistory,
} = require('../models');

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
    const userId = req.user.id;
    try {
      // 검증 logic 필요
      const t = await sequelize.transaction();
      const user = await User.findOne(
        { where: { id: userId } },
        { transaction: t },
      );

      const newAmount = user.point - req.body.depositPerPerson;

      if (newAmount < 0) {
        res.send('not enough points');
      } else {
        await User.update(
          {
            point: newAmount,
          },
          {
            where: { id: userId },
          },
          { transaction: t },
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
      const reward = Math.floor(study.rewardSum / aliveCnt);
      study.aliveCnt = aliveCnt; // 프론트에서 사용할 참여 인원수
      study.expectedReward = reward; // 프론트에서 사용할 예상환급액

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
      // TODO -- 중간평가 이후
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
  });

// 스터디 참여
router
  .route('/:id/member')
  .post(async (req, res) => {
    const userId = req.user.id;

    try {
      const t = await sequelize.transaction();
      const user = await User.findOne(
        { where: { id: userId } },
        { transaction: t },
      );
      const study = await Study.findOne(
        { where: { id: req.params.id } },
        { transaction: t },
      );
      const newAmount = user.point - study.depositPerPerson;

      // 이미 참여중인 경우 (already joined) 처리 필요

      if (newAmount < 0) {
        res.send('not enough points');
      } else {
        await User.update(
          {
            point: newAmount,
          },
          {
            where: { id: userId },
          },
          { transaction: t },
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
      res.status(400).json(err);
    }
  })
  .get(async (req, res) => {
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
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const studyId = req.params.id;

    const studyMember = await StudyMember.findOne(
      {
        where: { userId: userId, studyId: studyId },
      },
      { transaction: t },
    );

    const study = await Study.findOne(
      { where: { id: studyId } },
      { transaction: t },
    );

    const leftReward =
      study.depositPerPerson -
      study.lateFee * studyMember.lateCnt -
      study.absentFee * studyMember.absentCnt;

    await Study.increment(
      { rewardSum: leftReward },
      { where: { id: studyId } },
      { transaction: t },
    );

    const result = await StudyMember.update(
      { isAlive: 0 },
      { where: { studyId: studyId, userId: userId } },
      { transaction: t },
    );

    await t.commit();
    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// 위도, 경도로 거리 계산해주는 함수 (임시용)
function getDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == lat2 && lon1 == lon2) return 0;

  const radLat1 = (Math.PI * lat1) / 180;
  const radLat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radTheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radLat1) * Math.sin(radLat2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
  if (dist > 1) dist = 1;

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515 * 1.609344 * 1000;
  if (dist < 100) dist = Math.round(dist / 10) * 10;
  else dist = Math.round(dist / 100) * 100;

  return dist;
}

// 출석 인증
router.route('/:id/member/attendance').patch(async (req, res) => {
  try {
    // TODO
    // 여기에 출석 인증하는 코드 필요
    // transaction 적용 필요
    // 거리비교 후 출석/지각/결석/위치불일치 판단
    // studyMember increment (lateCnt, absentCnt)
    // studyMember isalive update (잔액 부족시 중도포기로 변경)
    // study rewardSum update ++

    // [거리 계산 관련]
    // 실제 거리측정 방법 : https://support.google.com/maps/answer/1628031?hl=ko&co=GENIE.Platform%3DDesktop
    // 아주대 본관
    // const lat1 = 37.28304709309341;
    // const lon1 = 127.04366510804743;
    // 아주대 팔달관
    // const lat2 = 37.28438935993838;
    // const lon2 = 127.04442141691622;
    // console.log('***거리계산결과: ');
    // console.log('[모범답안] 260m');
    // console.log(getDistance(lat1, lon1, lat2, lon2));

    const isLateness = 0;
    const isAbsence = 0;

    const result = await StudyMember.increment(
      { lateCnt: isLateness, absentCnt: isAbsence },
      { where: { studyId: req.params.id, userId: req.user.id } },
    );
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// 스터디 종료 후 포인트 환급
router.route('/:id/member/point').patch(async (req, res) => {
  const t = await sequelize.transaction();

  const userId = req.user.id;
  const studyId = req.params.id;

  try {
    const user = await User.findOne(
      {
        where: { id: userId },
      },
      { transaction: t },
    );

    const aliveCnt = await StudyMember.count(
      {
        where: {
          studyId: studyId,
          isAlive: [1, 2],
        },
      },
      { transaction: t },
    );

    const study = await Study.findOne(
      {
        where: {
          id: studyId,
        },
      },
      { transaction: t },
    );

    const refund = Math.floor(study.rewardSum / aliveCnt);
    const newAmount = user.point + refund;

    await User.update(
      { point: newAmount },
      { where: { id: userId } },
      { transaction: t },
    );

    await PointHistory.create(
      { userId: userId, balance: newAmount, amount: refund, status: 0 },
      { transaction: t },
    );

    await StudyMember.update(
      { isAlive: 2 },
      { where: { studyId: studyId, userId: userId } },
      { transaction: t },
    );

    await t.commit();

    res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

module.exports = router;
