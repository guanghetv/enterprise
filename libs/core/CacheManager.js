
exports.storage = function(data, callback){
	//TODO:  
	console.log('[CacheManager]: storage data', data);
	callback(null, data);
};

exports.save = function(name, data, callback){
	console.log('[CacheManager]: save data from: %s', name);
	callback(null, data);
};
