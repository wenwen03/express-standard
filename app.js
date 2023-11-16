const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const moment = require('moment-timezone');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

//ログの設定
app.use(logger('short'));
const logDirectory = path.join(__dirname, './logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log', {
  size:'10MB',
  interval: '1d',
  compress: 'gzip',
  path: logDirectory,
  rotate: 30
});
logger.token('date', function (req, res) {
  return moment().tz("Asia/Tokyo").format('YYYY-MM-DD HH:mm:ss');
});
app.use(logger(':date[clf] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));
app.use(logger('combined',{stream: accessLogStream}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
