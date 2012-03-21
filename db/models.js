
exports.defineModel = function(mongoose, fn){
	
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var Score = new Schema({
		userName : { type : String },
		clearTime : { type : Number },
		regDate : { type : Date, default : Date.now }
	});
	
	mongoose.model('Score', Score);
	
	fn();
}

