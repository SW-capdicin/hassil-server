const express = require('express');
const router = express.Router();
const { sequelize, StudyRoomSchedule, Reservation } = require('../models');

router.route('/').get(async (req, res) => {
  try {
    const studyRoomSchedules = await sequelize.query(
      `SELECT * FROM StudyRoomSchedule WHERE studyRoomId IN (SELECT id FROM StudyRoom WHERE studyCafeId IN (SELECT id FROM Studycafe WHERE userId=${req.user.id}));`,
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

    await t.commit();

    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    await t.rollback();

    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
