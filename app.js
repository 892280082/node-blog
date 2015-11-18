var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var megerRoute = require('./routes/users');
var setttings = require('./settings');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var multer = require('multer');
var fs = require('fs');
var errorLOg = fs.createWriteStream('error.log',{flags:'a'});
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("port",3000);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err,req,res,next){
  var meta = '[' + new Date() +']' +req.url +'\n';
  errorLog.write(meta+err.stack+'\n');
  next();
});

app.use(multer({
  dest:'./public/images',
  rename:function(fieldname,filename){
    return filename;
  }
}));

app.use(session({
  secret:setttings.cookieSecret,
  key:setttings.db,
  cookie:{maxAge:1000*60*60*24*30},
  store:new MongoStore({
    db:setttings.db,
    host:setttings.host,
    port:setttings.port
  })
}));

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  routes(app);
  //megerRoute(app);
  app.use('/merges',require('./routes/merges'));

  app.use(function(req,res){
    res.render('404');
  });

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


app.listen(app.get('port'),function(){
    console.log('Express server listening on port:'+app.get('port'));
})

module.exports = app;
