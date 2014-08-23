var redis = require("redis");

/**
 * [CacheManager description]
 * var cacheManager = new CacheManager({
 *     some_config_key: 'value'
 * });
 *
 * cacheManager.set('key', 'value', function(err, obj){
 *     console.log(obj); // { key: value }
 * });
 */
var CacheManager = function (config) {
    this.client = redis.createClient();
    this.client.on('connect', function () {
        console.log('[CacheManager] redis is connected to server .');
    });
};

CacheManager.prototype.get = function (key, callback) {
    this.client.get(key, function (err, reply) {
        if (err) return callback(err);
        if (!reply)return callback(new Error(key + ' is not found .'));
        else callback(null, reply);
    });
};

CacheManager.prototype.set = function (key, value, callback) {
    var mCacheManager = this;
    this.client.set(key, JSON.stringify(value), function () {
        mCacheManager.get(key, callback);
    });
};

CacheManager.prototype.setHash = function (key, obj, callback) {
    var mCacheManager = this;
    if (/Object/.test(Object.prototype.toString(obj))){

        var tasks = [];
        _.each(obj, function (value,field) {
            tasks.push(function(cb){
                if(_.size(value) > 0){
                    mCacheManager.setHashField(key,field,value,function(err,value){
                        var map = {};
                        map[field] = value;
                        cb(err,map);
                    })
                }else{
                    cb(null,"obj value is empty");
                }
            })
        });

        async.parallel(tasks,function(err,results){
            callback(err,results);
        })
    }
};

CacheManager.prototype.setHashField = function(key,field,value,callback){
    var mCacheManager = this;
    if (/Object/.test(Object.prototype.toString(value))){
        mCacheManager.client.hset(key,field,JSON.stringify(value),function(){
            callback(null,value);
        });
    }else{
        callback("cannot save string as value");
    }
};



CacheManager.prototype.removeHashField = function(key,field,callback){
    var mCacheManager = this;
    mCacheManager.client.hdel(key,field,function(){
        callback(null);
    })
};

CacheManager.prototype.getHash = function(key,field,callback){
    var mCacheManager = this;
    if(arguments.length == 2){
        callback = field;
        mCacheManager.client.hgetall(key,function(error,reply){
            callback(null,reply);
        })
    }
    if(arguments.length == 3){
        mCacheManager.client.hget(key,field,function(error,reply){
            callback(null,reply);
        })
    }
};

CacheManager.prototype.getHashFields = function(key,callback){
    var mCacheManager = this;
    mCacheManager.client.hkeys(key, function (err, replies) {
        callback(null,replies);
    });
};

CacheManager.prototype.getKeys = function(pattern,callback){
    var mCacheManager = this;
    mCacheManager.client.keys(pattern,function(err,replies){
        callback(null,replies);
    })
};




module.exports = CacheManager;


//end by lsong , CacheManager class .


/**
 * Created by solomon on 14-7-29.
 */




// TODO: origin改为raw或者readonly， middle改为intermediate
var MEMORY_CACHE = {
    origin: {}, // readonly
    middle: {}
};

/*
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

 */
