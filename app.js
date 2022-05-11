const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const passportGoogle = require('passport-google-oauth20');
const cors = require('cors');
const googleStrategyConfig = require('./config/googleStrategy');
const sessionConfig = require('./config/sessionConfig');
const { sequelize, User } = require('./models');
const { generateDummy } = require('./models/dummy');

const app = express();
app.set('port', process.env.PORT);

const whiteList = [
  'http://localhost:3000',
  'https://www.hassil.shop'
]

// force가 true이면 DB reset
const force = false;

sequelize
  .sync({ force })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('DB 연결 성공');

    if (force) {
      generateDummy();
    }
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ 
  origin: (origin, callback) => {
    console.log(origin);
    if (origin && whiteList.indexOf(origin) == -1) callback(new Error('Not Allowed Origin'));
    else callback(null, true);
  },
  credentials: true,
}));

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
  try {
    const user = await User.findOne({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use('/api', require('./routes'));

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
