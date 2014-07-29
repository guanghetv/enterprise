
exports.load = function(callback){
	//TODO: load data from database .
	var data = [];

	data.push({ user: 'lsong', age: 25 });
	
	console.info('[DataManager]: load data %s', data);
	callback(null, data);
};

exports.save = function(data, callback){
	//TODO: storage data to database . 
	console.info('[DataManager]: save data %s', data);
	callback(null, data);
};
