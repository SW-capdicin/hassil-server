const express = require('express');
const moment = require('moment');
const utils = require('../libs/utils');
const { sequelize } = require('../models');
const router = express.Router();

// global variables
let timeblocks;
let possibleSchedules;
let minCostPath = [];
let minMovingPath = [];
let number1Path = [];
let number2Path = [];
let number3Path = [];
let result = [];
let minMovingCnt = 1000000;
let minPriceSum = 1000000;
let message = '';
const maxRadius = 1000; // 단위 (m)

function clearAlternativePaths() {
  number1Path = [];
  number2Path = [];
  number3Path = [];
}

function clearGlobalVariables() {
  timeblocks = null;
  possibleSchedules = null;
  minCostPath = [];
  minMovingPath = [];
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
      minMovingPath = [...path]; // deep copy
    }
    return;
  }

  // backtracking
  if (moveSum > minMovingCnt) {
    return;
  }

  for (let i = 0; i < possibleSchedules[nextTime].length; i++) {
    const m =
      possibleSchedules[nextTime][i].studyCafeId ==
      path[path.length - 1].studyCafeId
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
    possibleSchedules[i] = [];

    const [schedules] = await sequelize.query(
      'SELECT S.id, S.studyRoomId, S.datetime, R.pricePerHour, C.id AS "studyCafeId", C.name AS "studyCafeName", R.name AS "studyRoomName", C.latitude, C.longitude FROM hassil.StudyRoomSchedule S LEFT JOIN hassil.StudyRoom R ON S.studyRoomId = R.id LEFT JOIN hassil.StudyCafe C ON R.studyCafeId = C.id WHERE S.status = 0 and S.datetime = "' +
        startTime.add(i, 'hours').format('YYYY-MM-DD HH:mm:ss') +
        '"',
    );
    startTime.subtract(i, 'hours');

    for (let j = 0; j < schedules.length; j++) {
      if (
        utils.getDistance(
          latitude,
          longitude,
          schedules[j].latitude,
          schedules[j].longitude,
        ) <= radius
      ) {
        possibleSchedules[i].push(schedules[j]);
      }
    } // end of for j
  } // end of for i

  for (let i = 0; i < possibleSchedules[0].length; i++) {
    let path = new Array();
    path.push(possibleSchedules[0][i]);
    dfs(path, 1, possibleSchedules[0][i].pricePerHour, 0);
    path.pop();
  }
  return [...minMovingPath];
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
  return [...minCostPath];
} // end of getMinimalCostPath()

async function getNumber1Path(
  option,
  radius,
  startTime,
  endTime,
  longitude,
  latitude,
) {
  if (option == 0) {
    const minCostPath = await getMinimalCostPath(
      maxRadius,
      startTime,
      endTime,
      longitude,
      latitude,
    );
    if (minCostPath.length == timeblocks) {
      number1Path = minCostPath;
    }
  } else if (option == 1) {
    await getMinimalMovingPath(
      maxRadius,
      startTime,
      endTime,
      longitude,
      latitude,
    );
    if (minMovingPath.length == timeblocks) {
      number1Path = minMovingPath;
    }
  }
} // end of getNumber1Path()

async function getNumber2Path(
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
      if (minCostPath.length == timeblocks) {
        number2Path = minCostPath;
        // break; // 왜 이걸 주석 처리하면 잘 될까??
      }
    } else if (option == 1) {
      await getMinimalMovingPath(
        radius,
        startTime,
        endTime,
        longitude,
        latitude,
      );
      if (minMovingPath.length == timeblocks) {
        number2Path = minMovingPath;
        // break; // 왜 이걸 주석 처리하면 잘 될까??
      }
    }
    startTime.subtract(timeDiff[i], 'hours');
    endTime.subtract(timeDiff[i], 'hours');
  }
} // end of getNumber2Path()

const getCost = (list) => list.reduce((acc, cur) => acc + cur.pricePerHour, 0);

const getMovingCount = (list) => {
  const mapR = {};
  const mapC = {};
  list.map(({ studyRoomId, studyCafeId }) => {
    mapR[studyRoomId] = true;
    mapC[studyCafeId] = true;
  });
  return Object.keys(mapC).length;
};

async function getNumber3Path(
  option,
  radius,
  startTime,
  endTime,
  longitude,
  latitude,
) {
  const timeDiff = [1, -1, 2, -2];
  clearGlobalVariables();
  let best = null;
  for (let i = 0; i < timeDiff.length; i++) {
    startTime.add(timeDiff[i], 'hours');
    endTime.add(timeDiff[i], 'hours');
    if (option == 0) {
      const minCostPath = await getMinimalCostPath(
        maxRadius,
        startTime,
        endTime,
        longitude,
        latitude,
      );
      if (minCostPath.length == timeblocks) {
        number3Path = minCostPath;
        if (!best) {
          best = minCostPath;
        } else {
          getCost(best) > getCost(minCostPath) && (best = minCostPath);
        }
      }
    } else if (option == 1) {
      const minMovingPath = await getMinimalMovingPath(
        maxRadius,
        startTime,
        endTime,
        longitude,
        latitude,
      );
      if (minMovingPath.length == timeblocks) {
        number3Path = minMovingPath;
        if (!best) {
          best = minMovingPath;
        } else {
          getMovingCount(best) > getMovingCount(minMovingPath) &&
            (best = minMovingPath);
        }
      }
    }
    startTime.subtract(timeDiff[i], 'hours');
    endTime.subtract(timeDiff[i], 'hours');
  }
  console.log('best', best);
  number3Path = best;
  return best;
} // end of getNumber3Path()

async function getAlternativePaths(
  option,
  radius,
  startTime,
  endTime,
  longitude,
  latitude,
) {
  clearGlobalVariables();
  await getNumber1Path(option, radius, startTime, endTime, longitude, latitude);
  clearGlobalVariables();
  await getNumber2Path(option, radius, startTime, endTime, longitude, latitude);
  clearGlobalVariables();
  await getNumber3Path(option, radius, startTime, endTime, longitude, latitude);
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
    await getAlternativePaths(
      option,
      radius,
      startTime,
      endTime,
      longitude,
      latitude,
    );
    if (
      (number1Path && number1Path.length == timeblocks) ||
      (number2Path && number2Path.length == timeblocks) ||
      (number3Path && number3Path.length == timeblocks)
    ) {
      message = 'how about these';
    } else {
      message = 'cannot find anything';
    }
  }
} // end of getResult()

// 스터디룸 환승 경로 추천 API
// http://localhost:8080/api/schedule-recommend/
router.route('/').post(async (req, res) => {
  try {
    let answer;
    clearGlobalVariables();
    clearAlternativePaths();
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
    };

    if (message == 'how about these') {
      answer.number1 = number1Path;
      answer.number2 = number2Path;
      answer.number3 = number3Path;
    } else if (message == 'path exists') {
      answer.schedule = result;
    }

    res.status(200).json(answer);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'error' });
  }
});

module.exports = router;
