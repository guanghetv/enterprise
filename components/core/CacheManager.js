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

CacheManager.prototype.flushAllData = function(callback){
    var mCacheManager = this;
    mCacheManager.client.flushall(function(err){
        callback(err);
    })
};

module.exports = CacheManager;