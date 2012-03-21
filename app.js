
/**
 * Module dependencies.
 */

var sys = require('sys');
var clog = require('clog');
var express = require('express');
var mongoose = require('mongoose');
var routes = require('./routes/index.js');
var models = require('./db/models.js');
var app = module.exports = express.createServer();
var Score;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.set('view engine', 'ejs');
  //app.set('view options', {layout : false}); 
  app.register('.html', require('ejs'));
  //app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "string", cookie:{expires:false} })); 
  // 쿠키 객체의 expires 속성을 false로하면 브라우저 종료시 세션 삭제, maxAge 속성도존재함 
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.dynamicHelpers({
  	session : function(req, res){
  		return req.session;
  	}
  });
});

app.configure('development', function(){
  app.set('db-uri', 'mongodb://localhost/webgameset');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// DB ORM init
models.defineModel(mongoose, function(){
	mongoose.connect(app.set('db-uri'));
	Score = mongoose.model('Score');
});



// Routes

app.get('/', function(req, res){
  res.local('title', 'HomePage');
  res.render('index.html');
});

app.get('/game', function(req, res){
	res.local('title', 'Game Index');
	res.render('game/index.html');
});


app.get('/game/card', function(req, res){
	res.local('title', 'Card Game');
	res.render('game/card/index.html');
});


app.get('/game/card/saveScore', function(req, res){
	var score = new Score();
	score.userName = req.query.userName;
	score.clearTime = req.query.clearTime;
	clog.info(score.userName);
	clog.info(score.clearTime);
	score.save(function(err){
		var result = null;
		if(err){
			result = false;
		}else{
			result = true;
		}
		res.send(result);
	});
});

app.get('/game/card/findScore', function(req, res){
	var query = Score.find();
	query.asc('clearTime').run(function(err, scoreList){
		if( err ){
			res.send(false);
		}else{
			res.send(scoreList);
		}
	});
});


app.get('/game/du', function(req, res){
	res.local('title', 'Du Game');
	res.render('game/du/index.html');
});


app.get('/chat', function(req, res){
	res.local('title', 'Chat Index');
	res.render('chat/index.html');
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
