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
    },
  ]);
  await Category.bulkCreate([
    { name: '코딩' },
    { name: '영어' },
    { name: '중국어' },
    { name: '수학' },
    { name: 'NCS' },
    { name: '기상' },
  ]);
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
