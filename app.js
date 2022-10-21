var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
dotenv.config();

const session = require("express-session");

var hbs = require("express-handlebars");

const connectDatabase = require('./config/database')

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'user-layout',layoutsDir:__dirname+'/views/layout/',
partialsDir  : 
  //  path to your partials
  path.join(__dirname, 'views/partials'), 
  helpers: {
    inc: function (value,context) {  
      return parseInt(value) + 1;
    },
    formatString(date) {
      newdate = date.toUTCString()
      return newdate.slice(0, 16)
    },
    total: function (amount, discount, quantity) {
      return (amount - discount) * quantity;
    },
    singleTotal: function (amount, discount) {
      return (amount - discount);
    }
} }));

app.use(logger('dev'));

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



app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  res.render('error')
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
