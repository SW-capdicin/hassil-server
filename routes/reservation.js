const express = require('express');
const moment = require('moment');
const {
  sequelize,
  StudyMember,
  Study,
  Reservation,
  Meeting,
  StudyRoomSchedule,
  StudyRoom,
  StudyCafe,
  User,
} = require('../models');
const router = express.Router();

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
  if (!req.user) return res.status(400).json({ message: 'no user in session' });
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const reservationId = req.params.id;

    const distErrRange = 1000; // 거리 오차 범위 (출석 허용 거리차) (단위 : m)
    const lateRange = 10; // 지각 기준(단위 : 분)
    let result = ''; // 출석 결과 (pass / late / fail)

    const currentLatitude = req.body.latitude; // 현재 latitude
    const currentLongitude = req.body.longitude; // 현재 longitude
    const currentTime = moment(); // 한국 현재시간

    let targetLatitude = 0; // 스터디 장소 latitude
    let targetLongitude = 0; // 스터디 장소 longitude
    let targetTime = 0; // 스터디 시작 시간

    let isAttend = 0; // 출석 여부
    let isLate = 0; // 지각 여부

    const user = await User.findOne(
      { where: { id: userId } },
      { transaction: t },
    );

    const reservation = await Reservation.findOne(
      {
        where: { id: reservationId },
      },
      { transaction: t },
    );

    const study = await Study.findOne(
      { where: { id: reservation.studyId } },
      { transaction: t },
    );

    // 예약 이용 모임 장소, 시간 구하기
    if (reservation.status == 0) {
      const studyRoomSchedule = await StudyRoomSchedule.findAll(
        {
          where: { reservationId: reservationId },
          order: [['time', 'ASC']],
          limit: 1,
        },
        { transaction: t },
      );
      const studyRoom = await StudyRoom.findOne(
        {
          where: { id: studyRoomSchedule[0].studyRoomId },
        },
        { transaction: t },
      );
      const studyCafe = await StudyCafe.findOne({
        where: { id: studyRoom.studyCafeId },
      });
      targetLatitude = studyCafe.latitude;
      targetLongitude = studyCafe.longitude;
      targetTime = moment(studyRoomSchedule.time).subtract(9, 'hours'); // 한국 시간으로 맞추기

      // 예약 미이용 모임 장소, 시간 구하기
    } else {
      const meeting = await Meeting.findOne(
        { where: { reservationId: reservationId } },
        { transaction: t },
      );
      targetLatitude = meeting.latitude;
      targetLongitude = meeting.longitude;
      targetTime = moment(meeting.startTime).subtract(9, 'hours'); // 한국 시간으로 맞추기
    }

    // 지각 기준 시각 구하기
    const passTime = moment(targetTime).add(lateRange, 'minutes');

    // 사용자와 목적지의 거리 차이
    const distance = getDistance(
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

        // 지각 포인트 납부
        const lateFee = user.point < study.lateFee ? user.point : study.lateFee;

        await User.increment(
          { point: -lateFee },
          { where: { id: userId } },
          { transaction: t },
        );

        await Study.increment(
          { rewardSum: lateFee },
          { where: { id: study.id } },
          { transaction: t },
        );

        // 포인트 부족시 퇴출
        if (user.point == 0) {
          await StudyMember.update(
            { isAlive: 0 },
            { where: { studyId: study.id, userId: userId } },
            { transaction: t },
          );
        }
      }
      // 위치 불일치
    } else {
      result = 'fail';
    }

    await StudyMember.increment(
      { lateCnt: isLate, attendCnt: isAttend },
      { where: { studyId: study.id, userId: userId } },
      { transaction: t },
    );
    await Reservation.increment(
      { lateCnt: isLate, attendCnt: isAttend },
      { where: { id: reservationId } },
      { transaction: t },
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
