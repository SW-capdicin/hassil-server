const crypto = require('crypto');
const axios = require('axios');

const space = ' '; // 공백
const newLine = '\n'; // 줄바꿈
const method = 'POST'; // HTTP 메소드
const url = '/api/v1/mails'; // 도메인을 제외한 "/" 아래 전체 url (쿼리스트링 포함)
const timestamp = Date.now(); // 현재 타임스탬프 (epoch, millisecond)
const accessKey = process.env.NCP_ACCESS_KEY; // access key id (from portal or sub account)
const secretKey = process.env.NCP_SECRET_KEY; // secret key (from portal or sub account)

const message =
  method + space + url + newLine + timestamp + newLine + accessKey;
const hmac = crypto.createHmac('sha256', secretKey);
const signature = hmac.update(message).digest('base64');

function createMailRequest(title, body, user) {
  axios.post(
    'https://mail.apigw.ntruss.com/api/v1/mails',
    {
      senderAddress: 'hassil@gmail.com',
      title: title,
      body: body,
      recipients: [
        {
          address: user.email,
          name: user.name,
          type: 'R',
          parameters: {
            userName: user.name,
          },
        },
      ],
      individual: true,
      advertising: false,
    },
    {
      headers: {
        'Contenc-type': 'application/json; charset=utf-8',
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-signature-v2': signature,
      },
    },
  );
}

module.exports = createMailRequest;
