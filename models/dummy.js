const {
  User,
  Category,
  Study,
  StudyMember,
  StudyCafe,
  StudyRoom,
  StudyRoomSchedule,
  Reservation,
  Meeting,
  PointHistory,
  StudyCafeImage,
} = require('../models');
const { Op } = require('sequelize');

async function generateDummy() {
  await User.bulkCreate([
    {
      email: 'ysy02268@ajou.ac.kr',
      pid: '104751642392806411583',
      nickname: '채련',
      phoneNumber: '01012345678',
      point: 10000000,
      type: 1,
      name: '채련',
      bankName: '국민은행',
      bankAccount: '92929292929292',
    },
    {
      email: 'gus6359@gmail.com',
      pid: '118208928285494419963',
      nickname: '주현',
      phoneNumber: '01012345678',
      point: 10000000,
      type: 1,
      name: '주현',
      bankName: '국민은행',
      bankAccount: '92929292929292',
    },
    {
      email: 'dlsxjzld@ajou.ac.kr',
      pid: '105701619520345911333',
      nickname: '종욱',
      phoneNumber: '01012345678',
      point: 10000000,
      type: 1,
      name: '종욱',
      bankName: '국민은행',
      bankAccount: '92929292929292',
    },
    {
      email: 'dydwls0669@gmail.com',
      pid: '116712059751867590119',
      nickname: '용진',
      phoneNumber: '01012345678',
      point: 10000000,
      type: 1,
      name: '용진',
      bankName: '국민은행',
      bankAccount: '92929292929292',
    },
  ]);

  await Category.bulkCreate([
    { name: '코딩' },
    { name: '영어' },
    { name: '중국어' },
    { name: '수학' },
    { name: 'NCS' },
  ]);

  await Study.bulkCreate([
    {
      categoryId: 1,
      name: 'Study with Me',
      info: '공무원 준비 스터디입니다',
      meetingCnt: 10,
      startDate: '2022-05-20',
      endDate: '2022-06-30',
      depositPerPerson: 100000,
      location: '수원역',
      operationTime: '매일 아침 8:00 - 11:00',
      minPerson: 3,
      maxPerson: 8,
      absentFee: 3000,
      lateFee: 1000,
      src: '../src/study1.jpg',
    },
  ]);
}

module.exports.generateDummy = generateDummy;

async function generateDummyForDemo() {
  await User.bulkCreate([
    {
      email: 'iamuser@gmail.com',
      pid: '111111111111111111111',
      nickname: '나사용',
      phoneNumber: '010-1234-5678',
      point: 0,
      type: 1,
      name: '나사용',
      bankName: '국민은행',
      bankAccount: '3333333333333331',
      src: 'src',
    },
    {
      email: 'iamowner@gmail.com',
      pid: '111111111111111111112',
      nickname: '나사장',
      phoneNumber: '010-1234-5678',
      point: 0,
      type: 2,
      name: '나사장',
      bankName: '국민은행',
      bankAccount: '3333333333333332',
      src: 'src',
    },
  ]);
  await PointHistory.bulkCreate([
    {
      userId: 1,
      balance: 0,
      amount: 0,
      status: 0,
      content: '테스트 history',
    },
  ]);
  // await Category.bulkCreate([
  //   { name: '코딩' },
  //   { name: '영어' },
  //   { name: '중국어' },
  //   { name: '수학' },
  //   { name: 'NCS' },
  //   { name: '기상' },
  // ]);
  await Study.bulkCreate([
    {
      categoryId: 1,
      name: 'Coding With Me',
      info: '코딩테스트 준비 스터디입니다.',
      meetingCnt: 0,
      startDate: '2022-05-14',
      endDate: '2022-07-30',
      depositPerPerson: 10000,
      location: '수원역',
      operationTime: '화, 목 19:00 - 21:00',
      minPerson: 3,
      maxPerson: 10,
      absentFee: 1000,
      lateFee: 1000,
      src: 'https://kr.object.ncloudstorage.com/hassil-image/demo_study1_pexels-olia-danilevich-4974912.jpg',
      rewardSum: 0,
    },
    {
      categoryId: 5,
      name: '공기업 같이 준비하실 분!',
      info: '광교중앙역 근처에서 진행할 생각이고, 나머지 사항들은 만나서 협의하는 방식으로 진행하려고 합니다! 저도 딱히 진행해본 적은 없지만 같이 동기부여 하면서 공부하실 분 구해봐요.',
      meetingCnt: 0,
      startDate: '2022-05-30',
      endDate: '2022-08-30',
      depositPerPerson: 10000,
      location: '광교중앙역',
      operationTime: '주말 14:00 - 18:00',
      minPerson: 4,
      maxPerson: 6,
      absentFee: 1000,
      lateFee: 1000,
      src: 'https://kr.object.ncloudstorage.com/hassil-image/demo_study2_stairs-g8fecf2bc6_1920.jpg',
      rewardSum: 0,
    },
    {
      categoryId: 6,
      name: '도서관 출근, 기상 스터디하실 분?',
      info: '너무 게을러진거 같아 같이 으쌰으쌰할 분 연락주세용. 모르는 분이랑 해야 시너지가 날 것 같네요!',
      meetingCnt: 0,
      startDate: '2022-05-14',
      endDate: '2022-06-30',
      depositPerPerson: 50000,
      location: '아주대학교 중앙도서관',
      operationTime: '매일 아침 09:00 - 12:00',
      minPerson: 3,
      maxPerson: 10,
      absentFee: 5000,
      lateFee: 2000,
      src: 'https://kr.object.ncloudstorage.com/hassil-image/demo_study3_pexels-pixabay-159711.jpg',
      rewardSum: 0,
    },
  ]);
  await StudyMember.bulkCreate([
    {
      studyId: 1,
      userId: 1,
      attendCnt: 0,
      lateCnt: 0,
      isAlive: 1,
    },
  ]);
  await StudyCafe.bulkCreate([
    {
      userId: 2,
      latitude: 127.04353367898165,
      longitude: 37.27511348605205,
      address:
        '경기 수원시 팔달구 중부대로 251 3층, 아주대 삼거리 올리브영 옆 건물 3층',
      region2DepthName: '수원시 팔달구',
      shopNumber: '050714395682',
      name: '르하임스터디카페 수원아주대점',
      info: '공부맛집, 합격명당 고객만족도 1위 스터디카페. 24시간, 365일 운영되는 프리미엄 스터디카페입니다.',
      operationTime: '연중무휴',
      rating: 4.8,
    },
    {
      userId: 2,
      latitude: 127.04227188088157,
      longitude: 37.276952065489276,
      address: '경기 수원시 팔달구 중부대로239번길 35 2층',
      region2DepthName: '수원시 팔달구',
      shopNumber: '050714395682',
      name: '안다미로스터디카페 아주대점',
      info: '지식이 차고 넘치는 공간 안다미로 스터디카페를 찾아주신 고객 여러분께 감사 말슴드립니다.',
      operationTime: '연중무휴',
      rating: 4.6,
    },
  ]);
  await StudyCafeImage.bulkCreate([
    {
      studyCafeId: 1,
      src: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210514_199%2F1620980762011swYfL_JPEG%2FS09zjWD9-jG4Wp1O0WPdKWj8.jpg',
    },
    {
      studyCafeId: 2,
      src: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210205_165%2F1612484772113mtrTF_JPEG%2FrrYGLTE24Bsq5fMKAPjxgUr2.jpg',
    },
  ]);
  await StudyRoom.bulkCreate([
    {
      studyCafeId: 1,
      maxPerson: 8,
      pricePerHour: 1250,
      src: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210112_48%2F161043565887171O5D_JPEG%2FqFrOx9aGiMP1eYID7F31XBYJ.jpg',
    },
    {
      studyCafeId: 1,
      maxPerson: 6,
      pricePerHour: 1330,
      src: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210112_184%2F1610435658807PATfn_JPEG%2F9OnoAOMj07_p7rDqmyFpAYfA.jpg',
    },
    {
      studyCafeId: 1,
      maxPerson: 4,
      pricePerHour: 1500,
      src: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210112_76%2F16104356588377SCVJ_JPEG%2FdBCV--4pCwQxBWMvAT8M8VoL.jpg',
    },
    {
      studyCafeId: 2,
      maxPerson: 6,
      pricePerHour: 1330,
      src: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210205_282%2F1612485024443hsyT5_JPEG%2F4In41cyvaHnJHIvAJ0d-JyD4.jpg',
    },
    {
      studyCafeId: 2,
      maxPerson: 4,
      pricePerHour: 1500,
      src: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210205_44%2F1612484791955IETk5_JPEG%2FZ_RUME0GMGS01Zi8oQXCgk0B.jpg',
    },
  ]);
  await StudyRoomSchedule.bulkCreate([
    {
      reservationId: null,
      studyRoomId: 1,
      datetime: '2022-05-14 09:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1,
      datetime: '2022-05-14 10:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1,
      datetime: '2022-05-14 11:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1,
      datetime: '2022-05-14 12:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 4,
      datetime: '2022-05-14 09:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 4,
      datetime: '2022-05-14 10:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 4,
      datetime: '2022-05-14 11:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 4,
      datetime: '2022-05-14 12:00',
      status: 0,
    },
  ]);

  await Reservation.bulkCreate([
    {
      studyId: 1,
      reservatingUserId: 1,
      status: 0,
      attendCnt: 0,
      lateCnt: 0,
    },
    {
      studyId: 1,
      reservatingUserId: 1,
      status: 0,
      attendCnt: 0,
      lateCnt: 0,
    },
  ]);
  await Meeting.bulkCreate([
    {
      reservationId: 1,
      latitude: 37.2661358572731,
      longitude: 126.9997378819232,
      address: '경기도 수원시 팔달구 덕영대로 924 수원역 1호선',
      datetime: '2022-05-14 09:00',
    },
  ]);
  await StudyRoomSchedule.update(
    {
      reservationId: 2,
      status: 1,
    },
    {
      where: { studyRoomId: 1, datetime: '2022-05-14 09:00' },
    },
  );
}

module.exports.generateDummyForDemo = generateDummyForDemo;

module.exports.generateDummyReservationDefault = async () => {
  // study, studycafe, studyroom
  await Study.bulkCreate([
    {
      id: 1000,
      categoryId: 1,
      name: '환승 드가자',
      info: '코딩테스트 준비 스터디입니다.',
      meetingCnt: 0,
      startDate: '2022-05-14',
      endDate: '2022-07-30',
      depositPerPerson: 10000,
      location: '수원역',
      operationTime: '화, 목 19:00 - 21:00',
      minPerson: 3,
      maxPerson: 10,
      absentFee: 1000,
      lateFee: 1000,
      src: 'https://kr.object.ncloudstorage.com/hassil-image/demo_study1_pexels-olia-danilevich-4974912.jpg',
      rewardSum: 0,
    },
  ]);

  await StudyCafe.bulkCreate([
    {
      id: 1000,
      userId: 2,
      latitude: 100,
      longitude: 100,
      address: '지구 어딘가',
      region2DepthName: '수원시 영통구',
      shopNumber: '050714395682',
      name: '환승(100,100) 1000원',
      info: '공부맛집, 합격명당 고객만족도 1위 스터디카페. 24시간, 365일 운영되는 프리미엄 스터디카페입니다.',
      operationTime: '연중무휴',
      rating: 4.8,
    },
    {
      id: 1001,
      userId: 2,
      latitude: 100,
      longitude: 100,
      address: '지구 어딘가',
      region2DepthName: '수원시 영통구',
      shopNumber: '050714395682',
      name: '환승(100, 100) 3000원',
      info: '공부맛집, 합격명당 고객만족도 1위 스터디카페. 24시간, 365일 운영되는 프리미엄 스터디카페입니다.',
      operationTime: '연중무휴',
      rating: 4.8,
    },
    {
      id: 1002,
      userId: 2,
      latitude: 200,
      longitude: 200,
      address: '지구 어딘가',
      region2DepthName: '수원시 영통구',
      shopNumber: '050714395682',
      name: '환승(200, 200) 500원',
      info: '공부맛집, 합격명당 고객만족도 1위 스터디카페. 24시간, 365일 운영되는 프리미엄 스터디카페입니다.',
      operationTime: '연중무휴',
      rating: 4.8,
    },
    {
      id: 1003,
      userId: 2,
      latitude: 100.007,
      longitude: 100.007,
      address: '800m 떨어진 카메',
      region2DepthName: '수원시 영통구',
      shopNumber: '050714395682',
      name: '환승(100.007, 100.007) 2000원',
      info: '공부맛집, 합격명당 고객만족도 1위 스터디카페. 24시간, 365일 운영되는 프리미엄 스터디카페입니다.',
      operationTime: '연중무휴',
      rating: 4.8,
    },
  ]);

  await StudyRoom.bulkCreate([
    {
      id: 1000,
      studyCafeId: 1000,
      name: 'A',
      maxPerson: 8,
      pricePerHour: 1000,
      src: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210112_48%2F161043565887171O5D_JPEG%2FqFrOx9aGiMP1eYID7F31XBYJ.jpg',
    },
    {
      id: 1001,
      studyCafeId: 1000,
      name: 'B',
      maxPerson: 8,
      pricePerHour: 1250,
      src: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210112_48%2F161043565887171O5D_JPEG%2FqFrOx9aGiMP1eYID7F31XBYJ.jpg',
    },
    {
      id: 1002,
      studyCafeId: 1001,
      name: 'A',
      maxPerson: 8,
      pricePerHour: 3000,
      src: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210112_48%2F161043565887171O5D_JPEG%2FqFrOx9aGiMP1eYID7F31XBYJ.jpg',
    },
    {
      id: 1003,
      studyCafeId: 1002,
      name: 'A',
      maxPerson: 8,
      pricePerHour: 500,
      src: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210112_48%2F161043565887171O5D_JPEG%2FqFrOx9aGiMP1eYID7F31XBYJ.jpg',
    },
    {
      id: 1004,
      studyCafeId: 1003,
      name: 'A',
      maxPerson: 8,
      pricePerHour: 2000,
      src: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210112_48%2F161043565887171O5D_JPEG%2FqFrOx9aGiMP1eYID7F31XBYJ.jpg',
    },
  ]);
};

module.exports.clearSchedulesGTEid1000 = async () => {
  await StudyRoomSchedule.destroy({
    where: {
      studyRoomId: {
        [Op.gte]: 1000,
      },
    },
  });
};
module.exports.clearCafesAndRoomsGTEid1000 = async () => {
  await Study.destroy({
    where: {
      id: {
        [Op.gte]: 1000,
      },
    },
  });
  await StudyCafe.destroy({
    where: {
      id: {
        [Op.gte]: 1000,
      },
    },
  });
  await StudyRoom.destroy({
    where: {
      id: {
        [Op.gte]: 1000,
      },
    },
  });
};

/* [path exists 예제]
 * (최소 환승 정답) 1000 1000 1000 1000 1000 1000
 * (최소 요금 정답) 1000 1000 1000 1000 1000 1000
 */
module.exports.studyRoomScheduleTestCase1 = async () => {
  await StudyRoomSchedule.bulkCreate([
    // 1000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    // 1250원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    // 3000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
  ]);
};

/* [path exists 예제]
 * (최소 환승 정답) 3000 3000 3000 3000 3000 3000
 * (최소 요금 정답) 1000 3000 1000 1250 1000 1000
 * 1000 스터디 00    02    04 05
 * 1250 스터디 00    02 03    05
 * 3000 스터디 00 01 02 03 04 05
 * 500  스터디 00 01 02 03 04 05
 */
module.exports.studyRoomScheduleTestCase2 = async () => {
  await StudyRoomSchedule.bulkCreate([
    // 1000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 01:00',
      status: 1,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 03:00',
      status: 1,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    // 1250원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 01:00',
      status: 1,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 04:00',
      status: 1,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    // 3000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    // 500원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1003,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1003,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1003,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1003,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1003,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1003,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
  ]);
};

// [path exists 예제]
/* (최소 환승 정답) 3000 3000 3000 1250 1250 1000 = total 12,500 / 환승 수 2회
 * (최소 요금 정답) 1000 3000 1000 1000 1250 1000 = total 8,250 / 환승 수 4회
 * 1000 스터디 00    02 03    05
 * 1250 스터디 00       03 04
 * 3000 스터디 00 01 02       05
 */
module.exports.studyRoomScheduleTestCase3 = async () => {
  await StudyRoomSchedule.bulkCreate([
    // 1000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    // 1250원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    // 3000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
  ]);
};

// [path exists 예제]
/* (최소 환승 정답) 1000 1250 1000 1000 1250 1000 = total 6,500 / 환승 수 4회
 * (최소 요금 정답) 1000 1250 1000 1000 1250 1000 = total 6,500 / 환승 수 4회
 * 1000 스터디 00    02 03    05
 * 1250 스터디    01       04
 * 3000 스터디    01 02       05
 */
module.exports.studyRoomScheduleTestCase4 = async () => {
  await StudyRoomSchedule.bulkCreate([
    // 1000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    // 1250원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    // 3000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
  ]);
};

// [path exists 예제]
/* (최소 환승 정답) 3000 3000 3000 1000 1000 1000 = total 12,000 / 환승 수 2회
 * (최소 요금 정답) 1000 3000 1250 1000 1000 1000 = total 8,250 / 환승 수 3회
 * 1000 스터디 00       03 04 05
 * 1250 스터디 00    02 03 04
 * 3000 스터디 00 01 02       05
 */
module.exports.studyRoomScheduleTestCase5 = async () => {
  await StudyRoomSchedule.bulkCreate([
    // 1000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    // 1250원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    // 3000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
  ]);
};

// [cannot find anything 예제]
/* (최소 환승 정답) 없음
 * (최소 요금 정답) 없음
 * 1000 스터디 00       03 04 05
 * 1250 스터디 00    02 03 04
 * 3000 스터디 00    02       05
 */
module.exports.studyRoomScheduleTestCase6 = async () => {
  await StudyRoomSchedule.bulkCreate([
    // 1000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    // 1250원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    // 3000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
  ]);
};

// [how about these - number 1 예제(반경 1000m로 넓히면 path 생기는 상황)]
// 위도 경도 (100, 100) 과 (100.007, 100.007) 거리 = 800m
/* (최소 환승 정답) 1000 2000 1250 1000 1000 1000 = total 7,250 / 환승 수 3회
 * (최소 요금 정답) 1000 2000 1250 1000 1000 1000 = total 7,250 / 환승 수 3회
 * 1000 스터디(100,100)       00       03 04 05
 * 1250 스터디(100,100)       00    02 03 04
 * 3000 스터디(100,100)       00    02       05
 * 2000 스터디(100.07,100.07)    01
 */
module.exports.studyRoomScheduleTestCase7 = async () => {
  await StudyRoomSchedule.bulkCreate([
    // 1000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    // 1250원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    // 3000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    // 2000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1004,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
  ]);
};

// [how about these - number 2 예제(시간대 +1) 옮기면 path 생기는 상황)]
// 위도 경도 (100, 100) 과 (100.007, 100.007) 거리 = 800m
/* (최소 환승 정답) 3000 3000 1000 1000 1000 1000 = total 10,000 / 환승 수 1회
 * (최소 요금 정답) 3000 1250 1000 1000 1000 1000 = total 8,250 / 환승 수 2회
 * 1000 스터디          03 04 05 06
 * 1250 스터디       02 03 04
 * 3000 스터디    01 02       05
 */
module.exports.studyRoomScheduleTestCase8 = async () => {
  await StudyRoomSchedule.bulkCreate([
    // 1000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 06:00',
      status: 0,
    },
    // 1250원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    // 3000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
  ]);
};

// [how about these - number 2 예제(시간대 +1, +2) 옮기면 path 생기는 상황)]
// 위도 경도 (100, 100) 과 (100.007, 100.007) 거리 = 800m
/* (최소 환승 정답) 3000 3000 1000 1000 1000 1250 = total 10,250 / 환승 수 2회
 * (최소 요금 정답) 3000 1250 1000 1000 1000 1250 = total 8,500 / 환승 수 3회
 * 1000 스터디          03 04 05    07
 * 1250 스터디       02 03 04    06
 * 3000 스터디    01 02       05
 */
module.exports.studyRoomScheduleTestCase9 = async () => {
  await StudyRoomSchedule.bulkCreate([
    // 1000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 07:00',
      status: 0,
    },
    // 1250원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 06:00',
      status: 0,
    },
    // 3000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
  ]);
};
// [how about these - number 3 예제(시간대 +1, +2) 옮기고 반경 1000m로 넓히면 path 생기는 상황)]
// 위도 경도 (100, 100) 과 (100.007, 100.007) 거리 = 800m
/* (최소 환승 정답) 2000 2000 1000 1000 1000 1000 = total 8,000 / 환승 수 1회
 * (최소 요금 정답) 2000 1250 1000 1000 1000 1000 = total 7,250 / 환승 수 2회
 * 1000 스터디(100,100)                03 04 05 06
 * 1250 스터디(100,100)             02 03 04
 * 3000 스터디(100,100)             02       05    07
 * 2000 스터디(100.07,100.07)    01 02
 */
module.exports.studyRoomScheduleTestCase10 = async () => {
  await StudyRoomSchedule.bulkCreate([
    // 1000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 06:00',
      status: 0,
    },
    // 1250원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    // 3000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 07:00',
      status: 0,
    },
    // 2000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1004,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1004,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
  ]);
};
// [how about these - number 1,2,3 예제 (반경만/시간만/둘다 모두 path 검색 가능한 경우)]
// 위도 경도 (100, 100) 과 (100.007, 100.007) 거리 = 800m
/* (number 1 최소 환승 정답) 2000 2000 2000 1000 1000 1000
 * (number 1 최소 요금 정답) 2000 1000 1250 1000 1000 1000
 * (number 2 최소 환승 정답) 1000 1250 1000 1000 1000 1000
 * (number 2 최소 요금 정답) 1000 1250 1000 1000 1000 1000
 * 1000 스터디(100,100)          01    03 04 05 06
 * 1250 스터디(100,100)             02 03 04
 * 3000 스터디(100,100)             02       05    07
 * 2000 스터디(100.07,100.07) 00 01 02
 */
module.exports.studyRoomScheduleTestCase11 = async () => {
  await StudyRoomSchedule.bulkCreate([
    // 1000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1000,
      datetime: '2022-05-22 06:00',
      status: 0,
    },
    // 1250원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 03:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1001,
      datetime: '2022-05-22 04:00',
      status: 0,
    },
    // 3000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 05:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1002,
      datetime: '2022-05-22 07:00',
      status: 0,
    },
    // 2000원 룸 스케줄
    {
      reservationId: null,
      studyRoomId: 1004,
      datetime: '2022-05-22 00:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1004,
      datetime: '2022-05-22 01:00',
      status: 0,
    },
    {
      reservationId: null,
      studyRoomId: 1004,
      datetime: '2022-05-22 02:00',
      status: 0,
    },
  ]);
};
