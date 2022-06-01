const express = require('express');
const moment = require('moment');
const utils = require('./utils');
const {
  sequelize,
  StudyMember,
  Study,
  Reservation,
  Meeting,
  StudyRoomSchedule,
  StudyRoom,
  StudyCafe,
  AttendHistory,
} = require('../models');
const router = express.Router();

router.route('/history').get(async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { reservatingUserId: 1, status: 0 },
      include: { model: StudyRoomSchedule, include: { model: StudyRoom } },
    });
    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// 출석 인증 API
router.route('/:id/member/attendance').patch(async (req, res) => {
  if (!req.user) return res.status(400).json({ message: 'no user in session' });
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const reservationId = req.params.id;

    const distErrRange = 1000; // 거리 오차 범위 (출석 허용 거리차) (단위 : m)
    const lateRange = 30; // 지각 기준(단위 : 분)
    let result = ''; // 출석 결과 (pass / late / fail)

    const currentLatitude = req.body.latitude; // 현재 latitude
    const currentLongitude = req.body.longitude; // 현재 longitude
    const currentTime = moment(); // 한국 현재시간

    let targetLatitude = 0; // 스터디 장소 latitude
    let targetLongitude = 0; // 스터디 장소 longitude
    let targetTime = 0; // 스터디 시작 시간

    let isAttend = 0; // 출석 여부
    let isLate = 0; // 지각 여부

    const reservation = await Reservation.findOne({
      where: { id: reservationId },
    });

    const study = await Study.findOne({
      where: { id: reservation.studyId },
    });

    const studyMember = await StudyMember.findOne({
      where: { userId: userId, studyId: reservation.studyId },
    });

    // 예약 이용 모임 장소, 시간 구하기
    if (reservation.status == 0) {
      const studyRoomSchedule = await StudyRoomSchedule.findAll({
        where: { reservationId: reservationId },
        order: [['time', 'ASC']],
        limit: 1,
        transaction: t,
      });
      const studyRoom = await StudyRoom.findOne({
        where: { id: studyRoomSchedule[0].studyRoomId },
        transaction: t,
      });
      const studyCafe = await StudyCafe.findOne({
        where: { id: studyRoom.studyCafeId },
      });
      targetLatitude = studyCafe.latitude;
      targetLongitude = studyCafe.longitude;
      targetTime = moment(studyRoomSchedule.time).subtract(9, 'hours'); // 한국 시간으로 맞추기

      // 예약 미이용 모임 장소, 시간 구하기
    } else {
      const meeting = await Meeting.findOne({
        where: { reservationId: reservationId },
        transaction: t,
      });
      targetLatitude = meeting.latitude;
      targetLongitude = meeting.longitude;
      targetTime = moment(meeting.datetime).subtract(9, 'hours'); // 한국 시간으로 맞추기
    }

    // 지각 기준 시각 구하기
    const passTime = moment(targetTime).add(lateRange, 'minutes');

    // 사용자와 목적지의 거리 차이
    const distance = utils.getDistance(
      currentLatitude,
      currentLongitude,
      targetLatitude,
      targetLongitude,
    );

    // 위치 일치
    if (distance < distErrRange) {
      // 출석
      if (currentTime.isBefore(passTime)) {
        result = 'pass';
        isAttend = 1;
        // 지각
      } else {
        result = 'late';
        isLate = 1;
      }
      // 위치 불일치
    } else {
      result = 'fail';
    }

    if (result != 'fail') {
      await AttendHistory.create(
        {
          reservationId: reservationId,
          studyMemberId: studyMember.id,
          status: isLate, // 0: 출석,  1 : 지각
        },
        { transaction: t },
      );
    }

    await StudyMember.increment(
      { lateCnt: isLate, attendCnt: isAttend },
      { where: { studyId: study.id, userId: userId }, transaction: t },
    );
    await Reservation.increment(
      { lateCnt: isLate, attendCnt: isAttend },
      { where: { id: reservationId }, transaction: t },
    );

    const studyMembers = await StudyMember.findAll({
      where: { studyId: study.id },
      raw: true,
      transaction: t,
    });

    // member의 남은 보증금 계산 -- 0보다 아래면 퇴출
    for (let i = 0; i < studyMembers.length; i++) {
      const myLeftDeposit = utils.getMyLeftDeposit(study, studyMembers[i]);
      if (myLeftDeposit < 0) {
        await StudyMember.update(
          { isAlive: 0 },
          { where: { id: studyMembers[i].id }, transaction: t },
        );
        studyMembers[i].isAlive = 0;
      }
    }
    // study의 rewardSum 재계산
    const rewardSum = utils.getRewardSum(study, studyMembers);
    await Study.update(
      { rewardSum: rewardSum },
      { where: { id: study.id }, transaction: t },
    );

    await t.commit();
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(400).json(err);
  }
});

module.exports = router;
