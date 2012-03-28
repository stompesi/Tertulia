function cardImgSizeChange(mapSize){
	mapSize = parseInt(mapSize);
	
	var className = '';
	var cardImg_4X4 = 'cardImg_4X4';
	var cardImg_6X6 = 'cardImg_6X6';
	var cardImg_8X8 = 'cardImg_8X8';
	var cardImg_10X10 = 'cardImg_10X10';
	
	switch(mapSize){
		case 36 :
			className = cardImg_6X6;
			break;
		case 64 :
			className = cardImg_8X8;
			break;
		case 100 :
			className = cardImg_10X10;
			break;
		default :
			className = cardImg_4X4;
			break;
		
	}
	
	$('.cardImg').removeClass(cardImg_4X4);
	$('.cardImg').removeClass(cardImg_6X6);
	$('.cardImg').removeClass(cardImg_8X8);
	$('.cardImg').removeClass(cardImg_10X10);
	$('.cardImg').addClass(className);
}