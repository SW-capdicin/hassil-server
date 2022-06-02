const express = require('express');
const {
  sequelize,
  StudyCafe,
  Review,
  StudyRoom,
  StudyCafeImage,
  User,
  StudyRoomSchedule,
} = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    try {
      const studyCafes = await StudyCafe.findAll({
        include: { model: StudyCafeImage },
      });
      res.status(200).json(studyCafes);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .post(async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const studyCafe = await StudyCafe.create(
        {
          userId: req.user.id,
          longitude: req.body.longitude,
          latitude: req.body.latitude,
          address: req.body.address,
          region2DepthName: req.body.region_2depth_name,
          shopNumber: req.body.shopNumber,
          name: req.body.name,
          info: req.body.info,
          operationTime: req.body.operationTime,
        },
        { transaction: t },
      );

      let studyCafeImages = [];
      for (let bodyStudyCafeImage of req.body.StudyCafeImages) {
        const studyCafeImage = await StudyCafeImage.create(
          {
            studyCafeId: studyCafe.id,
            src: bodyStudyCafeImage.src,
          },
          { transaction: t },
        );
        studyCafeImages.push(studyCafeImage);
      }

      let studyRooms = [];
      for (let bodyStudyRoom of req.body.studyRooms) {
        const studyRoom = await StudyRoom.create(
          {
            studyCafeId: studyCafe.id,
            name: bodyStudyRoom.studyRoomName,
            maxPerson: bodyStudyRoom.maxPerson,
            pricePerHour: bodyStudyRoom.pricePerHour,
            src: bodyStudyRoom.src,
          },
          { transaction: t },
        );
        studyRooms.push(studyRoom);

        const today = new Date();
        const startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
        ).getDate();
        const endDate = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
        ).getDate();

        const yyyy = String(today.getFullYear());
        const mm =
          today.getMonth() + 1 < 10
            ? '0' + String(today.getMonth() + 1)
            : String(today.getMonth());

        for (let curDate = startDate; curDate <= endDate; curDate += 1) {
          for (let curTime = 0; curTime <= 23; curTime += 1) {
            StudyRoomSchedule.create({
              studyRoomId: studyRoom.id,
              datetime:
                yyyy +
                '-' +
                mm +
                '-' +
                `${curDate < 10 ? '0' + curDate : curDate}` +
                ' ' +
                curTime +
                ':00',
              status: 0,
            });
          }
        }
      }
      await t.commit();
      res.status(200).json({ studyCafe, studyCafeImages, studyRooms });
    } catch (err) {
      await t.rollback();
      console.error(err);
      res.status(400).json(err);
    }
  });

router.route('/mine').get(async (req, res) => {
  if (!req.user) return res.status(401);

  try {
    const study = await StudyCafe.findAll({
      include: [{ model: Review }, { model: StudyCafeImage }],
      where: { userId: req.user.id },
    });
    res.status(200).json(study);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.route('/search').get(async (req, res) => {
  if (!req.user) return res.status(401);

  const keyword = req.query.keyword;
  try {
    const studyCafes = await StudyCafe.findAll({
      where: {
        name: {
          [Op.like]: '%' + keyword + '%',
        },
      },
      include: { model: StudyCafeImage },
    });
    res.status(200).json(studyCafes);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.route('/region2DepthNames').get(async (req, res) => {
  try {
    const studyCafeRegion2DepthNames = await StudyCafe.findAll({
      attributes: ['region2DepthName'],
      group: ['region2DepthName'],
      raw: true,
    });

    let studyCafesList = [];
    for (let studyCafeRegion2DepthName of studyCafeRegion2DepthNames) {
      const region2DepthName = studyCafeRegion2DepthName.region2DepthName;
      const studyCafes = await StudyCafe.findAll({
        where: { region2DepthName: region2DepthName },
        include: { model: StudyCafeImage },
      });
      studyCafesList.push({
        region2DepthName: region2DepthName,
        studyCafes: studyCafes,
      });
    }
    res.status(200).json(studyCafesList);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      const studyCafe = await StudyCafe.findOne({
        where: { id: req.params.id },
        include: [
          { model: Review, include: { model: User } },
          { model: StudyCafeImage },
        ],
      });
      res.status(200).json(studyCafe);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .patch(async (req, res) => {
    try {
      const result = await StudyCafe.update(
        {
          longitude: req.body.longitude,
          latitude: req.body.latitude,
          address: req.body.address,
          region2DepthName: req.body.region_2depth_name,
          shopNumber: req.body.shopNumber,
          name: req.body.name,
          info: req.body.info,
          operationTime: req.body.operationTime,
          rating: req.body.rating,
        },
        {
          where: { id: req.params.id },
        },
      );
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await StudyCafe.destroy({
        where: { id: req.params.id },
      });
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

router
  .route('/:id/reviews')
  .get(async (req, res) => {
    try {
      const reviews = await Review.findAll({
        where: { studyCafeId: req.params.id },
        include: { model: User },
      });
      const reviewsCnt = await Review.count({
        where: { studyCafeId: req.params.id },
      });
      const reviewsSum = await Review.sum('rating', {
        where: { studyCafeId: req.params.id },
      });
      const reviewsAvg = reviewsSum / reviewsCnt;
      res.status(200).json({ reviews, reviewsCnt, reviewsAvg });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .post(async (req, res) => {
    try {
      const review = await Review.create({
        studyCafeId: req.params.id,
        userId: req.user.id,
        contents: req.body.contents,
        rating: req.body.rating,
      });
      res.status(200).json(review);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

router
  .route('/:id/reviews/:rid')
  .get(async (req, res) => {
    try {
      const review = await Review.findOne({
        where: { id: req.params.rid },
        include: { model: User },
      });
      res.status(200).json(review);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .patch(async (req, res) => {
    try {
      const review = await Review.update(
        {
          contents: req.body.contents,
          rating: req.body.rating,
        },
        { where: { id: req.params.rid } },
      );
      res.status(200).json(review);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await Review.destroy({
        where: { id: req.params.rid },
      });
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

router
  .route('/:id/rooms')
  .get(async (req, res) => {
    try {
      const studyRooms = await StudyRoom.findAll({
        where: { studyCafeId: req.params.id },
      });
      res.status(200).json(studyRooms);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .post(async (req, res) => {
    try {
      const studyRoom = await StudyRoom.create({
        studyCafeId: req.params.id,
        name: req.body.name,
        maxPerson: req.body.maxPerson,
        pricePerHour: req.body.pricePerHour,
        src: req.body.src,
      });
      res.status(200).json(studyRoom);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

router
  .route('/:id/rooms/:rid')
  .get(async (req, res) => {
    try {
      const studyRoom = await StudyRoom.findOne({
        where: { id: req.params.rid },
      });
      res.status(200).json(studyRoom);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .patch(async (req, res) => {
    try {
      const result = await StudyRoom.update(
        {
          name: req.body.name,
          maxPerson: req.body.maxPerson,
          pricePerHour: req.body.pricePerHour,
          src: req.body.src,
        },
        {
          where: { id: req.params.rid },
        },
      );
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await StudyRoom.destroy({
        where: { id: req.params.rid },
      });
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

router.route('/:id/rooms/:rid/study-room-schedules').get(async (req, res) => {
  try {
    const studyRoomSchedules = await StudyRoomSchedule.findAll({
      where: { studyRoomId: req.params.rid },
    });
    res.status(200).json(studyRoomSchedules);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

module.exports = router;
