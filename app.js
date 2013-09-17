var express = require('express');
var index = require('./routes/index');
var verifyapi = require("./routes/verifyapi");
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get("/", index.index);
app.get("/verifyapi", verifyapi.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
