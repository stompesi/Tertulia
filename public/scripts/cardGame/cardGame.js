/*
 * 문서가 로드되면 순위보기 버튼에 대해서 바인딩 한다.
 * 순위보기 버튼이 클릭되면 서버에서 게임클리어 시간을 오름차순으로 정렬한 리스트를 반환한다.
 * 반환된 리스트를 가지고 TABLE UI를 꾸미도록 한다.
 */

$(document).ready(function(){
	bindGetScoreBtn();
});

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
