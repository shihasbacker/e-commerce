var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require("body-parser")
const session = require("express-session");

var hbs = require("express-handlebars");

const connectDatabase = require('./model/database')

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'user-layout',layoutsDir:__dirname+'/views/layout/',partialsDir  : [
  //  path to your partials
  path.join(__dirname, 'views/partials'),
]}))

app.use(logger('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    // key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   maxAge: 60 * 1000,
    // },
  })
);

// app.use((req, res, next) => {
//   res.set("Cache-Control", "no-store");
//   next();
// });

app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use('/', userRouter);
app.use('/admin', adminRouter);

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
