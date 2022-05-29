const express = require('express');
const moment = require('moment');
const utils = require('./utils');
const { sequelize } = require('../models');
const router = express.Router();

// global variables
let timeblocks;
let possibleSchedules;
let minCostPath;
let minMovingPath;
let alternativePath = [];
let result = [];
let minMovingCnt = 1000000;
let minPriceSum = 1000000;
let message = '';
const maxRadius = 1000; // 단위 (m)

function clearGlobalVariables() {
  timeblocks = null;
  possibleSchedules = null;
  minCostPath = null;
  minMovingPath = null;
  alternativePath = [];
  minMovingCnt = 1000000;
  minPriceSum = 1000000;
  message = '';
}

function clearResult() {
  result = [];
}

function dfs(path, nextTime, priceSum, moveSum) {
  if (path.length == timeblocks) {
    if (
      moveSum < minMovingCnt ||
      (moveSum == minMovingCnt && minPriceSum > priceSum)
    ) {
      minMovingCnt = moveSum;
      minPriceSum = priceSum;
      minMovingPath = new Array();
      for (let j = 0; j < path.length; j++) {
        minMovingPath.push(path[j]); // deep copy
      }
    }
    return;
  }

  // backtracking
  if (moveSum > minMovingCnt) {
    return;
  }

  for (let i = 0; i < possibleSchedules[nextTime].length; i++) {
    const m =
      possibleSchedules[nextTime][i].studyRoomId ==
      path[path.length - 1].studyRoomId
        ? 0
        : 1;
    path.push(possibleSchedules[nextTime][i]);
    dfs(
      path,
      nextTime + 1,
      priceSum + possibleSchedules[nextTime][i].pricePerHour,
      moveSum + m,
    );
    path.pop();
  } // end of for i
} // end of dfs()

async function getMinimalMovingPath(
  radius,
  startTime,
  endTime,
  longitude,
  latitude,
) {
  timeblocks = moment.duration(endTime.diff(startTime)).asHours(); // 시간차
  possibleSchedules = new Array(timeblocks);
  for (let i = 0; i < timeblocks; i++) {
    possibleSchedules[i] = new Array();

    const schedules = await sequelize.query(
      'SELECT S.id, S.studyRoomId, S.datetime, R.pricePerHour, C.id AS "studyCafeId", C.name AS "studyCafeName", R.name AS "studyRoomName", C.latitude, C.longitude FROM hassil.StudyRoomSchedule S LEFT JOIN hassil.StudyRoom R ON S.studyRoomId = R.id LEFT JOIN hassil.StudyCafe C ON R.studyCafeId = C.id WHERE S.status = 0 and S.datetime = "' +
        startTime.add(i, 'hours').format('YYYY-MM-DD HH:mm:ss') +
        '"',
    );
    startTime.subtract(i, 'hours');

    for (let j = 0; j < schedules[0].length; j++) {
      if (
        utils.getDistance(
          latitude,
          longitude,
          schedules[0][j].latitude,
          schedules[0][j].longitude,
        ) <= radius
      ) {
        possibleSchedules[i].push(schedules[0][j]);
      }
    } // end of for j
  } // end of for i

  for (let i = 0; i < possibleSchedules[0].length; i++) {
    let path = new Array();
    path.push(possibleSchedules[0][i]);
    dfs(path, 1, possibleSchedules[0][i].pricePerHour, 0);
    path.pop();
  }
} // end of getMinimalMovingPath()

async function getMinimalCostPath(
  radius,
  startTime,
  endTime,
  longitude,
  latitude,
) {
  timeblocks = moment.duration(endTime.diff(startTime)).asHours();
  minCostPath = new Array();
  for (let i = 0; i < timeblocks; i++) {
    const schedules = await sequelize.query(
      'SELECT S.id, S.studyRoomId, S.datetime, R.pricePerHour, C.id AS "studyCafeId", C.name AS "studyCafeName", R.name AS "studyRoomName", C.latitude, C.longitude FROM hassil.StudyRoomSchedule S LEFT JOIN hassil.StudyRoom R ON S.studyRoomId = R.id LEFT JOIN hassil.StudyCafe C ON R.studyCafeId = C.id WHERE S.status = 0 and S.datetime = "' +
        startTime.add(i, 'hours').format('YYYY-MM-DD HH:mm:ss') +
        '" ORDER BY R.pricePerHour',
    );
    startTime.subtract(i, 'hours');

    for (let j = 0; j < schedules[0].length; j++) {
      if (
        utils.getDistance(
          latitude,
          longitude,
          schedules[0][j].latitude,
          schedules[0][j].longitude,
        ) <= radius
      ) {
        minCostPath.push(schedules[0][j]);
        break;
      }
    } // end of for j
  } // end of for i
} // end of getMinimalCostPath()

async function firstPathExists(
  option,
  radius,
  startTime,
  endTime,
  longitude,
  latitude,
) {
  if (option == 0) {
    await getMinimalCostPath(
      maxRadius,
      startTime,
      endTime,
      longitude,
      latitude,
    );
    alternativePath = minCostPath;
  } else if (option == 1) {
    await getMinimalMovingPath(
      maxRadius,
      startTime,
      endTime,
      longitude,
      latitude,
    );
    alternativePath = minMovingPath;
  }
  if (alternativePath && alternativePath.length == timeblocks) {
    return true;
  }
  return false;
} // end of firstPathExists()

async function secondPathExists(
  option,
  radius,
  startTime,
  endTime,
  longitude,
  latitude,
) {
  const timeDiff = [1, -1, 2, -2];

  for (let i = 0; i < timeDiff.length; i++) {
    startTime.add(timeDiff[i], 'hours');
    endTime.add(timeDiff[i], 'hours');
    if (option == 0) {
      await getMinimalCostPath(radius, startTime, endTime, longitude, latitude);
      alternativePath = minCostPath;
    } else if (option == 1) {
      await getMinimalMovingPath(
        radius,
        startTime,
        endTime,
        longitude,
        latitude,
      );
      alternativePath = minMovingPath;
    }
    startTime.subtract(timeDiff[i], 'hours');
    endTime.subtract(timeDiff[i], 'hours');
    if (alternativePath && alternativePath.length == timeblocks) {
      return true;
    }
  }

  return false;
} // end of secondPathExists()

async function thirdPathExists(
  option,
  radius,
  startTime,
  endTime,
  longitude,
  latitude,
) {
  const timeDiff = [1, -1, 2, -2];

  for (let i = 0; i < timeDiff.length; i++) {
    startTime.add(timeDiff[i], 'hours');
    endTime.add(timeDiff[i], 'hours');
    if (option == 0) {
      await getMinimalCostPath(
        maxRadius,
        startTime,
        endTime,
        longitude,
        latitude,
      );
      alternativePath = minCostPath;
    } else if (option == 1) {
      await getMinimalMovingPath(
        maxRadius,
        startTime,
        endTime,
        longitude,
        latitude,
      );
      alternativePath = minMovingPath;
    }
    startTime.subtract(timeDiff[i], 'hours');
    endTime.subtract(timeDiff[i], 'hours');
    if (alternativePath && alternativePath.length == timeblocks) {
      return true;
    }
  }

  return false;
} // end of thirdPathExists()

async function getAlternativePaths(
  option,
  radius,
  startTime,
  endTime,
  longitude,
  latitude,
) {
  clearGlobalVariables();

  if (
    await firstPathExists(
      option,
      radius,
      startTime,
      endTime,
      longitude,
      latitude,
    )
  ) {
    result.push({ number1: alternativePath });
  }
  clearGlobalVariables();
  if (
    await secondPathExists(
      option,
      radius,
      startTime,
      endTime,
      longitude,
      latitude,
    )
  ) {
    result.push({ number2: alternativePath });
  }
  clearGlobalVariables();
  if (
    await thirdPathExists(
      option,
      radius,
      startTime,
      endTime,
      longitude,
      latitude,
    )
  ) {
    result.push({ number3: alternativePath });
  }
} // end of getAlternativePaths()

async function getResult(
  option,
  radius,
  startTime,
  endTime,
  longitude,
  latitude,
) {
  if (option == 0) {
    await getMinimalCostPath(radius, startTime, endTime, longitude, latitude);
    result = minCostPath;
  } else if (option == 1) {
    await getMinimalMovingPath(radius, startTime, endTime, longitude, latitude);
    result = minMovingPath;
  }

  if (result && result.length == timeblocks) {
    message = 'path exists';
  } else {
    clearResult();
    await getAlternativePaths(
      option,
      radius,
      startTime,
      endTime,
      longitude,
      latitude,
    );
    if (result.length == 0) {
      message = 'cannot find anything';
    } else {
      message = 'how about these';
    }
  }
} // end of getResult()

// 스터디룸 환승 경로 추천 API
// http://localhost:8080/api/scheduleRecommend/
router.route('/').post(async (req, res) => {
  try {
    let answer;
    clearGlobalVariables();
    clearResult();

    await getResult(
      req.body.option, // 0: 최소요금, 1: 최소이동
      req.body.radius,
      moment(req.body.startTime),
      moment(req.body.endTime),
      req.body.longitude,
      req.body.latitude,
    );

    answer = {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      radius: req.body.radius,
      message: message,
      schedule: result,
    };

    res.status(200).json(answer);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'error' });
  }
});

module.exports = router;
