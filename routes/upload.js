const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

const router = express.Router();

const accessKeyId = `${process.env.NCP_ACCESS_KEY}`;
const secretAccessKey = `${process.env.NCP_SECRET_KEY}`;

const s3 = new AWS.S3({
  endpoint: 'https://kr.object.ncloudstorage.com',
  region: 'kr-standard',
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const upload = bucket => multer({
  storage: multerS3({
    s3,
    bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 용량 제한
});

router.post('/image', upload('hassil-image').single('image'), (req, res) => {
  res.send(req.file.location);
});

module.exports = router;