
exports.create = function(data, callback){
	data['email'] = 'hi@lsong.org';
	callback(null, data);
};

exports.restore = function(){

};