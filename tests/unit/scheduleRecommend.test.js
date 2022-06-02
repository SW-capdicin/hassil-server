const express = require('express');
const { sequelize } = require('../../models');
const router = express.Router();

const {
  clearCafesAndRoomsGTEid1000,
  generateDummyReservationDefault,
  clearSchedulesGTEid1000,
  studyRoomScheduleTestCase1,
  studyRoomScheduleTestCase2,
  studyRoomScheduleTestCase3,
  studyRoomScheduleTestCase4,
  studyRoomScheduleTestCase5,
  studyRoomScheduleTestCase6,
  studyRoomScheduleTestCase7,
  studyRoomScheduleTestCase8,
  studyRoomScheduleTestCase9,
  studyRoomScheduleTestCase10,
  studyRoomScheduleTestCase11,
} = require('../../models/dummy');

const { scheduleRecommend } = require('../../routes/scheduleRecommend');

const checkIsSame = (list, correct, key = 'pricePerHour') =>
  !list.filter((cur, i) => cur[key] != correct[i]).length;

const getPricePerHour = (list) => list.map(({ pricePerHour }) => pricePerHour);

const getScheduleRecommend = (option) => {
  return new Promise((res, rej) => {
    scheduleRecommend(
      {
        body: {
          reservatingUserId: 5,
          latitude: 100,
          longitude: 100,
          startTime: '2022-05-22T00:00:00+09',
          endTime: '2022-05-22T06:00:00+09',
          radius: 500,
          address: '',
          option,
        },
      },
      {
        status: () => ({ json: res }),
      },
    );
  });
};

const parser = (str) => str.split(' ').map(Number);

function printResult(path, resultCost, correctCost, resultPath, correctPath) {
  console.log('---------------------------------------');
  console.log(path);
  console.log('---------------------------------------');
  console.log('result', getPricePerHour(resultCost));
  console.log('correct', correctCost);
  console.log('---------------------------------------');
  console.log('result', getPricePerHour(resultPath));
  console.log('correct', correctPath);
  console.log('---------------------------------------');
}

function printCompare(path, resultCost, correctCost, resultPath, correctPath) {
  console.log({
    path,
    minimalCost: checkIsSame(resultCost, correctCost),
    minimalMoving: checkIsSame(resultPath, correctPath),
  });
}

const testSuccessCase = (
  testCase,
  correctCost,
  correctPath,
  correctNo1Cost,
  correctNo1Path,
  correctNo2Cost,
  correctNo2Path,
  correctNo3Cost,
  correctNo3Path,
  bit,
) => {
  return async (req, res) => {
    try {
      await clearSchedulesGTEid1000();
      await testCase();
      const {
        schedule: resultCost,
        number1: resultNo1Cost,
        number2: resultNo2Cost,
        number3: resultNo3Cost,
      } = await getScheduleRecommend(0);
      const {
        schedule: resultPath,
        number1: resultNo1Path,
        number2: resultNo2Path,
        number3: resultNo3Path,
      } = await getScheduleRecommend(1);

      // xxx|000 == 000 : path exists
      if (!(bit | '000')) {
        printResult(
          'path exists',
          resultCost,
          correctCost,
          resultPath,
          correctPath,
        );
        printCompare(
          'path exists',
          resultCost,
          correctCost,
          resultPath,
          correctPath,
        );
      }

      // xxx&001 == 001 : number 1
      if (bit & '001') {
        printResult(
          'number 1',
          resultNo1Cost,
          correctNo1Cost,
          resultNo1Path,
          correctNo1Path,
        );
        setTimeout(function () {
          printCompare(
            'number 1',
            resultNo1Cost,
            correctNo1Cost,
            resultNo1Path,
            correctNo1Path,
          );
        }, 1000);
      }

      // xxx&010 == 010 : number 2
      if (bit & '010') {
        printResult(
          'number 2',
          resultNo2Cost,
          correctNo1Cost,
          resultNo2Path,
          correctNo1Path,
        );
        setTimeout(function () {
          printCompare(
            'number 2',
            resultNo2Cost,
            correctNo2Cost,
            resultNo2Path,
            correctNo2Path,
          );
        }, 1000);
      }

      // xxx&100 == 100 : number 3
      if (bit & '100') {
        printResult(
          'number 3',
          resultNo3Cost,
          correctNo1Cost,
          resultNo3Path,
          correctNo1Path,
        );
        setTimeout(function () {
          printCompare(
            'number 3',
            resultNo3Cost,
            correctNo3Cost,
            resultNo3Path,
            correctNo3Path,
          );
        }, 1000);
      }
      res.send({ message: 'success' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'error' });
    }
  };
};

// test dataset API - generate parent dummy data
router.route('/parentDummy').get(async (req, res) => {
  try {
    await clearCafesAndRoomsGTEid1000();
    await generateDummyReservationDefault();

    res.status(200).json({ message: '결과' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'error' });
  }
});

// test case 1
// [path exists 예제]
// (최소 요금 정답) 1000 1000 1000 1000 1000 1000
/* (최소 환승 정답) 1000 1000 1000 1000 1000 1000
 */
router
  .route('/testcase1')
  .get(
    testSuccessCase(
      studyRoomScheduleTestCase1,
      [1000, 1000, 1000, 1000, 1000, 1000],
      [1000, 1000, 1000, 1000, 1000, 1000],
      null,
      null,
      null,
      null,
      '000',
    ),
  );

// test case 2
// [path exists 예제]
// (최소 요금 정답) 1000 3000 1000 1250 1000 1000
/* (최소 환승 정답) 3000 3000 3000 3000 3000 3000
 * 1000 스터디 00    02    04 05
 * 1250 스터디 00    02 03    05
 * 3000 스터디 00 01 02 03 04 05
 * 500  스터디 00 01 02 03 04 05
 */
router
  .route('/testcase2')
  .get(
    testSuccessCase(
      studyRoomScheduleTestCase2,
      [1000, 3000, 1000, 1250, 1000, 1000],
      [3000, 3000, 3000, 3000, 3000, 3000],
      null,
      null,
      null,
      null,
      '000',
    ),
  );

// test case 3
// [path exists 예제]
// (최소 요금 정답) 1000 1250 1000 1000 1250 1000
/* (최소 환승 정답) 1000 1250 1000 1000 1250 1000
 * 1000 스터디 00    02 03    05
 * 1250 스터디    01    03 04
 * 3000 스터디 00 01 02       05
 */
router
  .route('/testcase3')
  .get(
    testSuccessCase(
      studyRoomScheduleTestCase3,
      parser('1000 1250 1000 1000 1250 1000'),
      parser('1000 1250 1000 1000 1250 1000'),
      null,
      null,
      null,
      null,
      '000',
    ),
  );

// test case 4
// [path exists 예제]
// (최소 요금 정답) 1000 1250 1000 1000 1250 1000
/* (최소 환승 정답) 1000 1250 1000 1000 1250 1000
 * 1000 스터디 00    02 03    05
 * 1250 스터디    01       04
 * 3000 스터디    01 02       05
 */
router
  .route('/testcase4')
  .get(
    testSuccessCase(
      studyRoomScheduleTestCase4,
      parser('1000 1250 1000 1000 1250 1000'),
      parser('1000 1250 1000 1000 1250 1000'),
      null,
      null,
      null,
      null,
      '000',
    ),
  );
// test case 5
// [path exists 예제]
// (최소 요금 정답) 1000 3000 1250 1000 1000 1000
/* (최소 환승 정답) 3000 3000 1250 1000 1000 1000
 * 1000 스터디 00       03 04 05
 * 1250 스터디 00    02 03 04
 * 3000 스터디 00 01 02       05
 */
router
  .route('/testcase5')
  .get(
    testSuccessCase(
      studyRoomScheduleTestCase5,
      parser('1000 3000 1250 1000 1000 1000'),
      parser('3000 3000 1250 1000 1000 1000'),
      null,
      null,
      null,
      null,
      '000',
    ),
  );

// test case 6
router.route('/testcase6').get(async (req, res) => {
  try {
    await clearSchedulesGTEid1000();
    await studyRoomScheduleTestCase6();
    // [cannot find anything 예제]
    /* (최소 환승 정답) 없음
     * (최소 요금 정답) 없음
     * 1000 스터디 00       03 04 05
     * 1250 스터디 00    02 03 04
     * 3000 스터디 00    02       05
     */

    res.status(200).json({ message: '결과' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'error' });
  }
});

// test case 7
// [how about these - number 1 예제(반경 1000m로 넓히면 path 생기는 상황)]
// 위도 경도 (100, 100) 과 (100.007, 100.007) 거리 = 800m
// [number1]
// (최소 요금 정답) 1000 2000 1250 1000 1000 1000
/* (최소 환승 정답) 1000 2000 1250 1000 1000 1000
 * 1000 스터디(100,100)       00       03 04 05
 * 1250 스터디(100,100)       00    02 03 04
 * 3000 스터디(100,100)       00    02       05
 * 2000 스터디(100.07,100.07)    01
 */
router
  .route('/testcase7')
  .get(
    testSuccessCase(
      studyRoomScheduleTestCase7,
      null,
      null,
      parser('1000 2000 1250 1000 1000 1000'),
      parser('1000 2000 1250 1000 1000 1000'),
      [],
      [],
      null,
      null,
      '001',
    ),
  );

// test case 8
// [how about these - number 2 예제(시간대 +1) 옮기면 path 생기는 상황)]
// 위도 경도 (100, 100) 과 (100.007, 100.007) 거리 = 800m
// [number2]
// (최소 요금 정답) 3000 1250 1000 1000 1000 1000
// (최소 환승 정답) 3000 1250 1000 1000 1000 1000
// [number3]
// (최소 요금 정답) 3000 1250 1000 1000 1000 1000
// (최소 환승 정답) 3000 1250 1000 1000 1000 1000
/*
 * 1000 스터디          03 04 05 06
 * 1250 스터디       02 03 04
 * 3000 스터디    01 02       05
 */
router
  .route('/testcase8')
  .get(
    testSuccessCase(
      studyRoomScheduleTestCase8,
      [],
      [],
      parser('3000 1250 1000 1000 1000 1000'),
      parser('3000 1250 1000 1000 1000 1000'),
      parser('3000 1250 1000 1000 1000 1000'),
      parser('3000 1250 1000 1000 1000 1000'),
      [],
      [],
      '110',
    ),
  );
// test case 9
// [how about these - number 2 예제(시간대 +1, +2) 옮기면 path 생기는 상황)]
// 위도 경도 (100, 100) 과 (100.007, 100.007) 거리 = 800m
// (최소 요금 정답) 3000 1250 1000 1000 1000 1250
/* (최소 환승 정답) 3000 3000 1000 1000 1000 1250
 * 1000 스터디          03 04 05    07
 * 1250 스터디       02 03 04    06
 * 3000 스터디    01 02       05
 */
router
  .route('/testcase9')
  .get(
    testSuccessCase(
      studyRoomScheduleTestCase9,
      parser('3000 1250 1000 1000 1000 1250'),
      parser('3000 3000 1000 1000 1000 1250'),
    ),
  );

// test case 10
router.route('/testcase10').get(async (req, res) => {
  try {
    await clearSchedulesGTEid1000();
    await studyRoomScheduleTestCase10();
    // [how about these - number 3 예제(시간대 +1, +2) 옮기고 반경 1000m로 넓히면 path 생기는 상황)]
    // 위도 경도 (100, 100) 과 (100.007, 100.007) 거리 = 800m
    // (최소 요금 정답) 2000 1250 1000 1000 1000 1000
    /* (최소 환승 정답) 2000 2000 1000 1000 1000 1000
     * 1000 스터디(100,100)                03 04 05 06
     * 1250 스터디(100,100)             02 03 04
     * 3000 스터디(100,100)             02       05    07
     * 2000 스터디(100.07,100.07)    01 02
     */

    res.status(200).json({ message: '결과' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'error' });
  }
});
// test case 11
router.route('/testcase11').get(async (req, res) => {
  try {
    await clearSchedulesGTEid1000();
    await studyRoomScheduleTestCase11();
    // [how about these - number 1,2,3 예제 (반경만/시간만/둘다 모두 path 검색 가능한 경우)]
    // 위도 경도 (100, 100) 과 (100.007, 100.007) 거리 = 800m
    // (number 1 최소 요금 정답) 2000 1000 1250 1000 1000 1000
    /* (number 1 최소 환승 정답) 2000 2000 2000 1000 1000 1000
     * (number 2 최소 요금 정답) 1000 1250 1000 1000 1000 1000
     * (number 2 최소 환승 정답) 1000 1250 1000 1000 1000 1000
     * 1000 스터디(100,100)          01    03 04 05 06
     * 1250 스터디(100,100)             02 03 04
     * 3000 스터디(100,100)             02       05    07
     * 2000 스터디(100.07,100.07) 00 01 02
     */

    res.status(200).json({ message: '결과' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'error' });
  }
});

// [TODO: 모킹 사용해서 router 대신 jest 로 테스트 방식 변경]
// describe('원하는 시간, 원하는 반경 내에 스터디 장소 존재하는 경우', () => {
//   test('first test', () => {
//     expect(2 + 2).toBe(4);
//   });
//   test('second test', async () => {
//     // await clearAllSchedules();
//     expect(2 + 2).toBe(4);
//   });
// });

module.exports = router;
