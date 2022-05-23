const express = require('express');
const moment = require('moment');
const utils = require('./utils');
const { sequelize } = require('../models');
const {
  studyRoomScheduleTestCase1,
  studyRoomScheduleTestCase2,
  studyRoomScheduleTestCase3,
  studyRoomScheduleTestCase4,
  studyRoomScheduleTestCase5,
} = require('../models/dummy');
const router = express.Router();

// global variables
let timeblocks;
let arr;
let minMovingCnt = 1000000;
let minPriceSum = 1000000;
let minPath;

function dfs(path, nextTime, priceSum, moveSum) {
  if (path.length == timeblocks) {
    if (
      moveSum < minMovingCnt ||
      (moveSum == minMovingCnt && minPriceSum > priceSum)
    ) {
      minMovingCnt = moveSum;
      minPriceSum = priceSum;
      minPath = new Array();
      for (let j = 0; j < path.length; j++) {
        minPath.push(path[j]); // deep copy
      }
    }
    return;
  }

  // backtracking
  if (moveSum > minMovingCnt) {
    return;
  }

  for (let i = 0; i < arr[nextTime].length; i++) {
    const m =
      arr[nextTime][i].studyRoomId == path[path.length - 1].studyRoomId ? 0 : 1;
    path.push(arr[nextTime][i]);
    dfs(
      path,
      nextTime + 1,
      priceSum + arr[nextTime][i].pricePerHour,
      moveSum + m,
    );
    path.pop();
  } // end of for i
} // end of dfs()

function getMinimalMoving() {
  for (let i = 0; i < arr[0].length; i++) {
    let path = new Array();
    path.push(arr[0][i]);
    dfs(path, 1, arr[0][i].pricePerHour, 0);
    path.pop();
  }
} // end of getMinimalMoving()

// test dataset API
router.route('/dummy').get(async (req, res) => {
  try {
    // study room schedule test case 생성 (답 맞추면 table delete 후 다음 test case)

    // 조건
    // 기준 시간 : 5월 20일 00시 ~ 5월 20일 06시
    // 반경 : 500m
    // 위도 경도 : 100, 100

    // studyRoomScheduleTestCase1();
    /* (최소 환승 정답) 1000 1000 1000 1000 1000 1000
     * (최소 요금 정답) 1000 1000 1000 1000 1000 1000
     */

    // studyRoomScheduleTestCase2();
    /* (최소 환승 정답) 3000 3000 3000 3000 3000 3000
     * (최소 요금 정답) 1000 3000 1000 1250 1000 1000
     * 1000 스터디 00    02    04 05
     * 1250 스터디 00    02 03    05
     * 3000 스터디 00 01 02 03 04 05
     * 500  스터디 00 01 02 03 04 05
     */

    // studyRoomScheduleTestCase3();
    /* (최소 환승 정답) 3000 3000 3000 1250 1250 1000 = total 12,500 / 환승 수 2회
     * (최소 요금 정답) 1000 1250 1000 1000 1250 1000 = total 8,250 / 환승 수 4회
     * 1000 스터디 00    02 03    05
     * 1250 스터디    01    03 04
     * 3000 스터디 00 01 02       05
     */

    // studyRoomScheduleTestCase4();
    /* (최소 환승 정답) 1000 1250 1000 1000 1250 1000 = total 6,500 / 환승 수 4회
     * (최소 요금 정답) 1000 1250 1000 1000 1250 1000 = total 6,500 / 환승 수 4회
     * 1000 스터디 00    02 03    05
     * 1250 스터디    01       04
     * 3000 스터디    01 02       05
     */

    // studyRoomScheduleTestCase5();
    /* (최소 환승 정답) 3000 3000 3000 1000 1000 1000 = total 10,000 / 환승 수 2회
     * (최소 요금 정답) 1000 3000 1250 1000 1000 1000 = total 8,250 / 환승 수 3회
     * 기준 - 1000 스터디 00
     * 1000 스터디 00       03 04 05
     * 1250 스터디 00    02 03 04
     * 3000 스터디 00 01 02       05
     */

    res.status(200).json({ message: '결과' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'error' });
  }
});

// 최소 비용 알고리즘
// API path 예시
// http://localhost:8080/api/scheduleRecommend/minimalCost?startTime=2022-05-22 00:00:00&endTime=2022-05-22 06:00:00&longitude=100&latitude=100
router.route('/minimalCost').get(async (req, res) => {
  try {
    const startTime = moment(req.query.startTime);
    const endTime = moment(req.query.endTime);
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;

    const distRange = 500; // 위도 경도 기준 반경 (m)

    timeblocks = moment.duration(endTime.diff(startTime)).asHours(); // 시간차
    arr = new Array(timeblocks);
    for (let i = 0; i < timeblocks; i++) {
      arr[i] = new Array();

      const schedules = await sequelize.query(
        'SELECT S.id, S.studyRoomId, S.datetime, R.pricePerHour, C.latitude, C.longitude FROM hassil.StudyRoomSchedule S LEFT JOIN hassil.StudyRoom R ON S.studyRoomId = R.id LEFT JOIN hassil.StudyCafe C ON R.studyCafeId = C.id WHERE S.status = 0 and S.datetime = "' +
          startTime.add(i, 'hours').format('YYYY-MM-DD HH:mm:ss') +
          '" ORDER BY R.pricePerHour',
      );
      startTime.subtract(i, 'hours');

      for (let j = 0; j < schedules[0].length; j++) {
        // 반경 distRange 이내
        if (
          utils.getDistance(
            latitude,
            longitude,
            schedules[0][j].latitude,
            schedules[0][j].longitude,
          ) <= distRange
        ) {
          arr[i].push(schedules[0][j]);
          break;
        }
      } // end of for j
    } // end of for i

    res.status(200).json(arr);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'error' });
  }
});

// 최소 환승 알고리즘
// API path 예시
// http://localhost:8080/api/scheduleRecommend/minimalMoving?startTime=2022-05-22 00:00:00&endTime=2022-05-22 06:00:00&longitude=100&latitude=100
router.route('/minimalMoving').get(async (req, res) => {
  try {
    const startTime = moment(req.query.startTime);
    const endTime = moment(req.query.endTime);
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;

    const distRange = 500; // 위도 경도 기준 반경 (m)

    timeblocks = moment.duration(endTime.diff(startTime)).asHours(); // 시간차
    arr = new Array(timeblocks);
    for (let i = 0; i < timeblocks; i++) {
      arr[i] = new Array();

      const schedules = await sequelize.query(
        'SELECT S.id, S.studyRoomId, S.datetime, R.pricePerHour, C.latitude, C.longitude FROM hassil.StudyRoomSchedule S LEFT JOIN hassil.StudyRoom R ON S.studyRoomId = R.id LEFT JOIN hassil.StudyCafe C ON R.studyCafeId = C.id WHERE S.status = 0 and S.datetime = "' +
          startTime.add(i, 'hours').format('YYYY-MM-DD HH:mm:ss') +
          '"',
      );
      startTime.subtract(i, 'hours');

      for (let j = 0; j < schedules[0].length; j++) {
        // 반경 distRange 이내
        if (
          utils.getDistance(
            latitude,
            longitude,
            schedules[0][j].latitude,
            schedules[0][j].longitude,
          ) <= distRange
        ) {
          arr[i].push(schedules[0][j]);
        }
      } // end of for j
    } // end of for i

    getMinimalMoving();

    res.status(200).json(minPath);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'error' });
  }
});

module.exports = router;
