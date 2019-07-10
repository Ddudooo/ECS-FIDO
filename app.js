var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//redis session
var redis = require('redis');
var connectRedis = require('connect-redis');
// mongoDB connection
var mongoose = require('mongoose');
var mongo_express = require('mongo-express/lib/middleware')
var mongo_express_config = require('./mongo_express_config')

// mongoDB MODELS
var User = require('./models/user');
var Concert = require('./models/concert');

var appRoot = require('app-root-path');

var RedisStore = connectRedis(session);
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var fidoRegRouter = require('./routes/fido/reg');
var fidoAuthRouter = require('./routes/fido/auth');

var qrcodeRouter = require('./routes/qrcode/test');

var userRouter = require('./routes/user/user');
var userAPI = require('./routes/user/user_api');

var marketRouter = require('./routes/market/main');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// DB connect
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  //Connected To MongoDB Server
  console.log("Connected to mongod server");
})
mongoose.connect('mongodb://localhost:27017/ecs-fido?authSource=admin', {
                        useNewUrlParser: true,
                        user: 'admin',
                        pass: '!db123',
                        keepAlive: true,
                      });
//redis config
const sess={
  resave: false,
  saveUninitialized: false,
  secret: 'sessionSecret',
  name: 'sessionId',
  cookie: {
  httpOnly: true,
  secure: false,
    },
  store: new RedisStore({
	  host: 'localhost', port: 6379, pass: '!db123', logErrors: true
  }),
 };
app.use(session(sess));
// app.use(session({
//   secret:'serverkey',
//   resave:false,
//   saveUninitialized:true
// }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/mongo_express', mongo_express(mongo_express_config));

app.use('/fido/reg', fidoRegRouter);
app.use('/fido/auth', fidoAuthRouter);

app.use('/qrcode', qrcodeRouter);

app.use('/user/', userRouter);
app.use('/user/api/', userAPI);

app.use('/market/', marketRouter);

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
