
var MEMORY_CACHE = {
	origin: [],
	stats: []
};

exports.storage = function(data, callback){
	//TODO:  
	MEMORY_CACHE['origin'] = data;
	console.log('[CacheManager]: storage data', data);
	callback(null, data);
};

exports.save = function(name, data, callback){
	var d = {};
	d[ name ] = data;
	MEMORY_CACHE['stats'].push(d);
	console.log('[CacheManager]: save data from: %s', name);
	callback(null, data);
};

exports.load = function(callback, source){
	callback(null, MEMORY_CACHE[ source ]);
};