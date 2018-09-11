let express     = require('express');
let path        = require('path');
let favicon     = require('serve-favicon');
let morgan      = require('morgan');
let cookieParer = require('cookie-parser');
let bodyParse   = require('body-parser');

let logger      = morgan('dev');

var app         = express();
var data        = require('./routes/data');
var log4js      = require("./config/log");

log4js.configure("master");
// view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(log4js.useLog());
app.use(logger);
//记录访客信息，建议在发布版本中开启此选项
//app.use(morgan('combined', {stream: log4js.accessLogStream}))

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:false}));
app.use(cookieParer());
app.use(express.static(path.join(__dirname,'public')));

//获取用户列表
app.use('/listUsers',data.listUsers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }
  
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {...err}
    });
});
  
module.exports = app;
  