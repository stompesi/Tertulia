
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.local('title', 'HomePage');
  res.render('index.html');
};

exports.gameIndex = function(req, res){
	res.local('title', 'Game Index');
	res.render('game/index.html');
}

exports.cardGame = function(req, res){
	res.local('title', 'Card Game');
	res.render('game/card/index.html');
}

exports.duGame = function(req, res){
	res.local('title', 'Du Game');
	res.render('game/du/index.html');
}


exports.chatIndex = function(req, res){
	res.local('title', 'Chat Index');
	res.render('chat/index.html');
}