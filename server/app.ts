const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const io = require('socket.io')();
require('./socket/socket')(io)

const app = express();

const buildPath = path.join(__dirname, '../client/dist', 'client');
app.set('views', buildPath);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(logger("dev"));
app.use(express.static(buildPath));

app.get('/*', function (req, res) {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app, io };
