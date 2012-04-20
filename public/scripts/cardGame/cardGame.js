/*
* 문서가 로드되면 순위보기 버튼에 대해서 바인딩 한다.
* 순위보기 버튼이 클릭되면 서버에서 게임클리어 시간을 오름차순으로 정렬한 리스트를 반환한다.
* 반환된 리스트를 가지고 TABLE UI를 꾸미도록 한다.
*/

//alert($('input#selectMapSize').val());
//tr의 아이디를 정함

$(document).ready(function() {
	$('#start').bind('click', start);
	bindGetScoreBtn();
});
var mapSize;
var IMG_PATH = '/images/cardGame/';
var passGameTime = {
	'id' : '',
	'second' : 0
};
var isDevelop = true;

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

	clearTimeout(passGameTime.id);
	passGameTime.second = 0;
	appendTimeArea();
	// p태그 time 경과시간 엘리먼트 append
	passTime();
	// 시간 경과 시작
	var startTime = new Date().getTime();

	//카드 아이디 보여주기 (삭제예정)
	for(var i = 1; i <= mapSize; i++) {
		console.log(cards[i].id);
	}

	var fadeInSpeed = 100;
	var fadeOutSpeed = 100;
	var delaySpeed = fadeInSpeed + fadeOutSpeed;
	// $('.cardImg').delegate('', 'click', function(event){
	// //alert('클릭됨');
	// event.stopPropagation();
	// var sequence = this.id;
	// if(!cards[sequence].isEvert) {
	// cards[sequence].isEvert = true;
	// showCard(sequence, IMG_PATH + cards[sequence].id + ".png", fadeOutSpeed, fadeInSpeed);
	// if(!check.id) {
	// check.id = cards[sequence].id;
	// check.sequence = sequence;
	// } else {
	// //$('#' + check.sequence).delay(delaySpeed);
	// if(check.id == cards[sequence].id) {
	// checkFinishGame(cards, startTime);
	// } else {
	// showCard(cards[sequence].sequence, IMG_PATH + "background.png", fadeOutSpeed, fadeInSpeed);
	// $('#' + check.sequence).delay(delaySpeed);
	// showCard(check.sequence, IMG_PATH + "background.png", fadeOutSpeed, fadeInSpeed);
	// cards[sequence].isEvert = false;
	// cards[check.sequence].isEvert = false;
	// }
	// check.id = "";
	// }
	// }
	// });
	$('.cardImg').click(function(event) {

		var sequence = this.id;
		if(!cards[sequence].isEvert) {
			cards[sequence].isEvert = true;
			showCard(cards[sequence].sequence, 'background', fadeOutSpeed, fadeInSpeed);
			if(!check.id) {
				check.id = cards[sequence].id;
				check.sequence = sequence;
			} else {
				//$('#' + check.sequence).delay(delaySpeed);
				if(check.id == cards[sequence].id) {
					checkFinishGame(cards, startTime);
				} else {
					showCard(cards[sequence].sequence, cards[sequence].id, fadeOutSpeed, fadeInSpeed);
					$('#' + check.sequence).delay(delaySpeed);
					showCard(check.sequence, cards[check.sequence].id, fadeOutSpeed, fadeInSpeed);
					cards[sequence].isEvert = false;
					cards[check.sequence].isEvert = false;
				}
				check.id = '';
			}
		}
	});
}

function drawMap() {
	$('#gameMap').children().remove();
	mapSize = $('#selectMapSize').val();
	var backgroundImgSrc = IMG_PATH + 'background.png';
	for(var i = 1; i <= mapSize; i++) {
		if(i % Math.pow(mapSize, 0.5) == 1) {
			var tr = $('<tr/>');
			$('#gameMap').append(tr);
		}
		$(tr).append('<td><img class="cardImg" id=' + i + ' src="' + backgroundImgSrc + '"/></td>');
	}
	cardImgSizeChange(mapSize);
}

function makeCards(cards) {
	var randomId = [];
	var cardCount = 283;

	for(var i = 1; i <= mapSize; i++) {
		cards[i] = {
			sequence : i,
			id : '',
			isEvert : false
		};
	}
	for(var i = 1; i <= mapSize / 2; i++) {

		randomId[i] = random(cardCount);
		for(var j = 1; j <= mapSize / 2; j++) {
			if(i != j && randomId[i] == randomId[j]) {
				i--;
				break;
			}
		}
	}
	for(var i = 1, j = 0; i <= mapSize; i++) {
		var ransequence = random(mapSize);

		if(cards[ransequence].id == "") {
			if(i % 2 == 1) {
				j++;
			}
			cards[ransequence].id = randomId[j];
			//i % (Math.pow(mapSize, 0.5) * 2) + 1;
		} else {
			i--;
		}
	}
}

function showCard(id, atrributeValue, fadeOutSpeed, fadeInSpeed) {
	atrributeValue = IMG_PATH + atrributeValue + '.png';
	$('#' + id).fadeOut(fadeOutSpeed, function() {
		$('#' + id).attr('src', atrributeValue);
	});
	$('#' + id).fadeIn(fadeInSpeed);
}

function random(cardCount) {
	return Math.ceil(Math.random() * cardCount);
}

function checkFinishGame(cards, startTime) {
	for(var i = 1; i <= mapSize; i++) {
		if(cards[i].isEvert) {
			if(i == mapSize) {
				clearTimeout(passGameTime.id);
				saveResult();
			}
		} else {
			break;
		}
	}
}

function saveResult() {
	var userName = prompt('게임을 완료하였습니다. 아이디를 입력하여 주세요.');
	if ( !userName ){
		userName = '___';
	}
	var url = '/game/card/saveScore';
	var param = {};
	param.userName = userName;
	param.clearTime = passGameTime.second;

	$.get(url, param, function(result) {
		if(result) {
			alert('클리어시간이 저장되었습니다.');
		} else {
			alert('저장을 실패하였습니다.');
		}
	});
}

function showAllCards(cards) {
	var fadeInSpeed = 1000;
	var fadeOutSpeed = 500;
	for(var i = 1; i <= mapSize; i++) {
		showCard(i, cards[i].id, fadeOutSpeed, fadeInSpeed);
	}
}

function appendTimeArea() {
	if($('#time').length > 0) {
		return;
	}
	var clearTime = $('<span/>').attr('id', 'time');
	var timeArea = $('<p/>').append('경과시간 : ').append(clearTime).append(' 초 ');
	$('#gameMap').before(timeArea);
}

function passTime() {
	$('#time').html(passGameTime.second++);
	passGameTime.id = setTimeout('passTime()', 1000);
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function bindGetScoreBtn() {
	$('#rankBtn').one('click', function() {
		getScoreList(appendScoreList);
		$('#rankBtn').click(function(){
			$('#scoreArea').toggle();	
		});
		
	});
}

function getScoreList(appendScoreList) {
	var url = '/game/card/findScore';
	$.get(url, function(resultSet) {
		var scoreObjList = [];
		for(var i = 0, max = resultSet.length; i < max; i++) {
			var scoreObj = {};
			scoreObj.userName = resultSet[i].userName;
			scoreObj.clearTime = resultSet[i].clearTime;
			scoreObj.regDate = new Date(resultSet[i].regDate).toLocaleString();
			scoreObjList.push(scoreObj);
		}
		appendScoreList(scoreObjList);
	});
}

function appendScoreList(scoreObjList) {
	console.dir(scoreObjList);
	if ( scoreObjList.length < 1){
		alert('저장된 점수가 없습니다.');
	}else {
		for( var index in scoreObjList ){
			var score = scoreObjList[index];
			var html = '<li><span>' + score.userName + '</span><span>' + ' : ' + score.clearTime + ' 초 </span>' + '</li>'; 
			$('#scoreArea').append(html);
		}
	}
	// HTML TABLE 에 데이터 뿌리기 결과 있는경우 와 없는 경우 고려 ex) scoreObjList.length 체크
}

////
//http://cbkim.wkhc.ac.kr/dframebox/d_frame95.html//시간계산참고사항//