const express = require('express');
const {
  sequelize,
  StudyCafe,
  Review,
  StudyRoom,
  StudyCafeImage,
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
          region_2depth_name: req.body.region_2depth_name,
          shopNumber: req.body.shopNumber,
          name: req.body.name,
          info: req.body.info,
          operationTime: req.body.operationTime,
        },
        { transaction: t },
      );

      let studyCafeImages;
      for (let bodyStudyCafeImage of req.body.StudyCafeImages) {
        const StudyCafeImage = await StudyCafeImage.create({
          studyCafeId: studyCafe.id,
          src: bodyStudyCafeImage.src,
        });
        studyCafeImages += StudyCafeImage;
      }

      let studyRooms;
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
        studyRooms += studyRoom;
      }
      await t.commit();
      res.status(200).json({ studyCafe, studyCafeImages, studyRooms });
    } catch (err) {
      await t.rollback();
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
    console.log(studyCafesList);
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
        include: [{ model: Review }, { model: StudyCafeImage }],
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
          region_2depth_name: req.body.region_2depth_name,
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

router.route('/:id/reviews').post(async (req, res) => {
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

router.route('/:id/reviews/:rid').delete(async (req, res) => {
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

module.exports = router;
