const express = require('express');
const router = express.Router();
const {
  sequelize,
  StudyRoomSchedule,
  Reservation,
  User,
  StudyRoom,
  StudyCafe,
} = require('../models');
const createMailRequest = require('./createMailRequest');

router.route('/reservations').get(async (req, res) => {
  try {
    const studyRoomSchedules = await sequelize.query(
      `SELECT * FROM Reservation WHERE (SELECT reservationId FROM StudyRoomSchedule WHERE studyRoomId IN (SELECT id FROM StudyRoom WHERE studyCafeId IN (SELECT id FROM StudyCafe WHERE userId=${req.user.id})))`,
    );

    console.log(studyRoomSchedules);
    res.status(200).json(studyRoomSchedules);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.route('/:id/').patch(async (req, res) => {
  const t = await sequelize.transaction();
  try {
    await StudyRoomSchedule.update(
      {
        status: 2,
      },
      {
        where: { id: req.params.id },
        transaction: t,
      },
    );

    const studyRoomSchedule = await StudyRoomSchedule.findOne({
      where: { id: req.params.id },
      transaction: t,
    });

    const result = await Reservation.update(
      {
        status: 2,
      },
      {
        where: { id: studyRoomSchedule.reservationId },
        transaction: t,
      },
    );

    const reservation = await Reservation.findOne({
      where: { id: studyRoomSchedule.reservationId },
    });
    const user = await User.findOne({
      where: { id: reservation.reservatingUserId },
    });
    const studyRoom = await StudyRoom.findOne({
      where: { id: studyRoomSchedule.studyRoomId },
    });
    const studyCafe = await StudyCafe.findOne({
      where: { id: studyRoom.studyCafeId },
    });
    await createMailRequest(
      '예약거절 안내 메일입니다.',
      '${userName}님! 안녕하세요? HASSIL을 이용해 주셔서 진심으로 감사드립니다.<br/> 스터디룸 예약이 거절되었습니다. 아래 예약내역을 확인해 주세요.<br/><br/>' +
        `예약자: ${user.name}, 스터디카페: ${studyCafe.name}, 스터디룸: ${studyRoom.name}, 이용일시: ${studyRoomSchedule.datetime}, 예약번호: ${studyRoomSchedule.reservationId}`,
      user,
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

module.exports = router;
