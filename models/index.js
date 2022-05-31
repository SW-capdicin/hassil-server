const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/dbConfig')[env];

const User = require('./user');
const StudyCafe = require('./studyCafe');
const PointHistory = require('./pointHistory');
const Answer = require('./answer');
const Question = require('./question');
const Notice = require('./notice');
const Review = require('./review');
const Study = require('./study');
const Category = require('./category');
const Comment = require('./comment');
const StudyMember = require('./studyMember');
const Reservation = require('./reservation');
const StudyCafeImage = require('./studyCafeImage');
const StudyRoom = require('./studyRoom');
const StudyRoomSchedule = require('./studyRoomSchedule');
const Meeting = require('./meeting');
const AttendHistory = require('./attendHistory');

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;
db.User = User;
db.StudyCafe = StudyCafe;
db.PointHistory = PointHistory;
db.Answer = Answer;
db.Question = Question;
db.Notice = Notice;
db.Review = Review;
db.Study = Study;
db.Category = Category;
db.Comment = Comment;
db.StudyMember = StudyMember;
db.Reservation = Reservation;
db.StudyCafeImage = StudyCafeImage;
db.StudyRoom = StudyRoom;
db.StudyRoomSchedule = StudyRoomSchedule;
db.Meeting = Meeting;
db.AttendHistory = AttendHistory;

User.init(sequelize);
StudyCafe.init(sequelize);
PointHistory.init(sequelize);
Answer.init(sequelize);
Question.init(sequelize);
Notice.init(sequelize);
Review.init(sequelize);
Study.init(sequelize);
Category.init(sequelize);
Comment.init(sequelize);
StudyMember.init(sequelize);
Reservation.init(sequelize);
StudyCafeImage.init(sequelize);
StudyRoom.init(sequelize);
StudyRoomSchedule.init(sequelize);
Meeting.init(sequelize);
AttendHistory.init(sequelize);

User.associate(db);
StudyCafe.associate(db);
PointHistory.associate(db);
Answer.associate(db);
Question.associate(db);
Notice.associate(db);
Review.associate(db);
Study.associate(db);
Category.associate(db);
Comment.associate(db);
StudyMember.associate(db);
Reservation.associate(db);
StudyCafeImage.associate(db);
StudyRoom.associate(db);
StudyRoomSchedule.associate(db);
Meeting.associate(db);
AttendHistory.associate(db);

module.exports = db;
