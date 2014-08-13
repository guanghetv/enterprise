/**
 * Created by solomon on 14-7-29.
 */


// TODO: origin改为raw或者readonly， middle改为intermediate
var MEMORY_CACHE = {
	origin: {}, // readonly
	middle: {}
};


// TODO: storage是名词, data太宽泛了，saveRaw = function(object, callback)
// TODO: 如果确认origin只读，需要加判断禁止重复save
exports.storage = function(data, callback){
    _.each(Object.keys(data),function(key){
        MEMORY_CACHE.origin[key] = data[key];
    });

    //console.log('[CacheManager]: storage data',data);
	callback(null, MEMORY_CACHE['origin']);
};

// TODO: 参数name太宽泛，saveIntermediate = function(key, object, callback)
exports.save = function(name,data, callback){
    if(MEMORY_CACHE['middle'][name]==undefined){
        MEMORY_CACHE['middle'][name] = [];
    }

    MEMORY_CACHE['middle'][name].push(data);
    console.log('[CacheManager]: save data from: %s', name);
	callback(null, data);
};


// TODO: 'origin'和'middle'不应该暴露给外部，应改为loadRaw和loadIntermediate
exports.load = function(callback, source){
	callback(null, MEMORY_CACHE[ source ]);
};