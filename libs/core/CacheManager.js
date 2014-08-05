/**
 * Created by solomon on 14-7-29.
 */

var MEMORY_CACHE = {
	origin: {},
	middle: {}
};

exports.storage = function(data, callback){
    MEMORY_CACHE.origin['tracks'] = data['tracks'];
    MEMORY_CACHE.origin['users'] = data['users'];
    MEMORY_CACHE.origin['rooms'] = data['rooms'];
    MEMORY_CACHE.origin['courses'] = data['courses'];

    console.log('[CacheManager]: storage data',data);
	callback(null, MEMORY_CACHE['origin']);
};

exports.save = function(name,data, callback){
    if(MEMORY_CACHE['middle'][name]==undefined){
        MEMORY_CACHE['middle'][name] = [];
    }

    MEMORY_CACHE['middle'][name].push(data);
    console.log('[CacheManager]: save data from: %s', name);
	callback(null, data);
};

exports.load = function(callback, source){
	callback(null, MEMORY_CACHE[ source ]);
};