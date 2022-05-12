const { sequelize, User, Category, Study } = require('../models');

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
