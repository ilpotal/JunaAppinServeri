// Tämä on lainattu koodia opettajan (Tommi Tuikka) kurssilla läpkäydyistä koodeista. IT
// Olen kommentoinut kohdat, joita olen muuttanut. IT

// cors-toiminnallisuudet olen lisännyt. IT

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const mongoose = require('mongoose');
require('dotenv').config();

// reititystiedostojen määrittelyt
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const trainsRouter = require('./routes/trains'); // tämän lisäsin. IT

// restart
// toinen restart

const app = express();

const corsOptions = {
  //origin: 'http://localhost:4200',
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

mongoose.set('useUnifiedTopology', true);

mongoose
  .connect(
    process.env.MONGODB_URL, // tässä pitää olla @-merkki, vaihdoin käytettävän kannan nimen.
    { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }
    // herjasi aluksi: (node:13500) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
  ) // tällä loppuosalla voi tarkastaa kantayhteyden ;
  .then(() => {
    console.log('Database connection succesfull');
  })
  .catch((err) => {
    console.error('Database connection error: ' + err);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// reittien käyttöönotto
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trains', trainsRouter); // tämän lisäsin. IT

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
