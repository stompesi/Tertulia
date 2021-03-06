//alert($('input#selectMapSize').val());
//tr의 아이디를 정함

window.onload= function(){
	$('#start').bind('click',start);
};

var mapSize;
function start() {
	
	//게임맵을 그림
	drawMap();

	var check = {
		id : '',
		sequence : ''
	};

	//카드를 만듬
	var cards = [];
	makeCards(cards);

	//카드전체 보여주기
	showAllCards(cards);

	//카드 아이디 보여주기 (삭제예정)
	for(var i = 1; i <= mapSize; i++) {
		console.log(cards[i].id);
	}

	$('img').click(function() {
		var sequence = this.id;
		var fadeInSpeed = 300;
		var fadeOutSpeed = 200;
		var delaySpeed = 500;
		if(cards[sequence].isEvert) {
			cards[sequence].isEvert = false;
			showCard(sequence, +cards[sequence].id + ".jpg", fadeOutSpeed, fadeInSpeed);
			if(check.id == "") {
				check.id = cards[sequence].id;
				check.sequence = cards[sequence].sequence;
			} else {
				$('#' + check.sequence).delay(delaySpeed);
				if(check.id == cards[sequence].id) {
					check.id = "";
					checkFinishGame(cards);
				} else {
					showCard(cards[sequence].sequence, "background.jpg", fadeOutSpeed, fadeInSpeed);
					showCard(check.sequence, "background.jpg", fadeOutSpeed, fadeInSpeed);
					cards[sequence].isEvert = true;
					cards[check.sequence].isEvert = true;
					check.id = "";
				}
			}
		}
	});
}
function drawMap() {
	$('#gameMap').children().remove();
	mapSize = $('#selectMapSize').val();
	for(var i = 1; i <= mapSize; i++) {
		if(i % Math.pow(mapSize, 0.5) == 1) {
			var trId = $('<tr/>');
			$('#gameMap').append(trId);
		}
		$(trId).append('<td><img id=' + i + ' src="background.jpg"/></td>');
	}
}

function makeCards(cards) {
	var randomId = [];
	for(var i = 1; i <= mapSize; i++) {
		cards[i] = {
			sequence : i,
			id : '',
			isEvert : true
		};
	}
	for(var i=1; i<=mapSize/2; i++){
		
		randomId[i]= random(50);
		for(var j = 1 ; j<= mapSize/2 ; j++){
			if(i!=j && randomId[i]==randomId[j] ){
				i--;
				break;
			}
		}
		
	}
	for(var i = 1 ,j=0; i <= mapSize; i++) {
		var ransequence = random(mapSize);
		
		if(cards[ransequence].id == "") {
			if(i%2==1){
				j++;
			}
			cards[ransequence].id = randomId[j] ;//i % (Math.pow(mapSize, 0.5) * 2) + 1;
		} else {
			i--;
		}
	}
}

function showCard(id, atrributeValue, fadeOutSpeed, fadeInSpeed) {
	$('#' + id).fadeOut(fadeOutSpeed, function() {
		$('#' + id).attr('src', atrributeValue);
	});
	$('#' + id).fadeIn(fadeInSpeed);
}

function random(randomSize) {
	return Math.ceil(Math.random() * randomSize);
}

function checkFinishGame(cards) {
	for(var i = 1; i <= mapSize; i++) {
		if(cards[i].isEvert == false) {
			if(i == mapSize)
				alert('게임을 완료하였습니다.');
		} else {
			break;
		}
	}
}

function showAllCards(cards) {
	var fadeInSpeed = 1000;
	var fadeOutSpeed = 500;
	for(var i = 1; i <= mapSize; i++) {
		showCard(i, cards[i].id + ".jpg", fadeOutSpeed, fadeInSpeed);
		showCard(i, "background.jpg", fadeOutSpeed, fadeInSpeed);
	}
}

function bindGetScoreBtn(){
	$('#scoreBtn').click(function(){
		getScoreList(appendScoreList);
	});
}


function getScoreList(appendScoreList){
	var url = '/game/card/findScore';
	$.get(url, function(resultSet){
		
		var scoreObjList = [];
		for ( var i = 0, max = resultSet.length; i < max; i ++){
			var scoreObj = {};
			scoreObj.userName = resultSet[i].userName; 
			scoreObj.clearTime = resultSet[i].clearTime;
			scoreObj.regDate = new Date(resultSet[i].regDate).toLocaleString();
			
			scoreObjList.push(scoreObj);
			
			appendScoreList(scoreObjList);
		}
	});
}

function appendScoreList(scoreObjList){
	console.dir(scoreObjList);
	// HTML TABLE 에 데이터 뿌리기 결과 있는경우 와 없는 경우 고려 ex) scoreObjList.length 체크
}


////////////////////////////////////////////////
// 게임종료후 이름 / 클리어시간 DB저장 호출 함수
////////////////////////////////////////////////
function saveScore(userName, clearTime){
	var url = '/game/card/findScore';
	var param = {};
	param.userName = userName;
	param.clearTime = clearTime;
	
	$.get(url, param, function(result){
		if ( result ){
			alert('저장되었습니다.');
		}else{
			alert('저장을 실패하였습니다.');
		}
	});
}