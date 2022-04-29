const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const passportGoogle = require('passport-google-oauth20');
const dotenv = require('dotenv');
const googleStrategyConfig = require('./config/googleStrategy');
dotenv.config();

const { sequelize } = require('./models');
const { User } = require('./models');

const app = express();
app.set('port', process.env.PORT);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('DB 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }),
);

const GoogleStrategy = passportGoogle.Strategy;
passport.use(
  new GoogleStrategy(
    googleStrategyConfig,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const exUser = await User.findOne({
          where: { pid: profile.id },
        });
        if (exUser) {
          done(null, exUser);
        } else {
          const newUser = await User.create({
            pid: profile.id,
            email: profile.emails[0].value,
          });
          done(null, newUser);
        }
      } catch (e) {
        done(e);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  User.findOnd({ where: { id } })
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
