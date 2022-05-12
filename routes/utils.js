// 모인 벌금 확인
function getRewardSum(study, studyMembers) {
  let rewardSum = 0;
  for (let i = 0; i < studyMembers.length; i++) {
    if (studyMembers[i].isAlive == 0) {
      rewardSum += study.depositPerPerson;
    } else {
      rewardSum +=
        study.depositPerPerson - getMyLeftDeposit(study, studyMembers[i]);
    }
  }
  return rewardSum;
}

// 잔여 보증금 확인
function getMyLeftDeposit(study, studyMember) {
  let absentCnt =
    study.meetingCnt - studyMember.attendCnt - studyMember.lateCnt;
  absentCnt = absentCnt > 0 ? absentCnt : 0; // meetingCnt ++ 시점 고려
  let leftDeposit =
    study.depositPerPerson -
    study.lateFee * studyMember.lateCnt -
    study.absentFee * absentCnt;
  leftDeposit = leftDeposit > 0 ? leftDeposit : 0;
  return leftDeposit;
}

// 위도, 경도로 거리 계산해주는 함수 (임시용)
function getDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == lat2 && lon1 == lon2) return 0;

  const radLat1 = (Math.PI * lat1) / 180;
  const radLat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radTheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radLat1) * Math.sin(radLat2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
  if (dist > 1) dist = 1;

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515 * 1.609344 * 1000;
  if (dist < 100) dist = Math.round(dist / 10) * 10;
  else dist = Math.round(dist / 100) * 100;

  return dist;
}

exports.getRewardSum = getRewardSum;
exports.getMyLeftDeposit = getMyLeftDeposit;
exports.getDistance = getDistance;
