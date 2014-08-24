var _ = require('underscore');
var request = require('request');
var ProgressBar = require('progress');


/**
 * [DataManager description]
 * @param {[type]} config [description]
 * @param {[type]} cache [description]
 */
var DataManager = function (config, cache) {
    var mDataManager = this;
    this.config = config;
    this.eventQueue = {};
    if (cache) this.cache = cache;
    this.login(function (err) {
        if (err) return console.error(err);
        mDataManager.trigger('login_succeed', {});
    });
};

DataManager.prototype.trigger = function(event, args){
    if(event in this.eventQueue) {
        this.eventQueue[event].forEach(function(handler){
            handler(args);
        });
    }
};

DataManager.prototype.on = function(event, handler){
    if(!(event in this.eventQueue)) this.eventQueue[event] = [];
    this.eventQueue[ event ].push(handler);
}; 
/**
 * [setCacheProvider description]
 * @param {[type]} cache [description]
 */
DataManager.prototype.setCacheProvider = function (cache) {
    //CacheProvider must be impl* 'set' and 'get' methods .
    this.cache = cache;
};
/**
 * [getCache description]
 * @param  {[type]} key            [description]
 * @param  {[type]} cachedHandler  [description]
 * @param  {[type]} requestHandler [description]
 * @return {[type]}                [description]
 */
DataManager.prototype.getCache = function (key, cachedHandler, requestHandler) {
    this.cache.get(key, function (err, data) {
        if (data) cachedHandler(err, JSON.parse(data));
        else requestHandler(err);
    });
};
/**
 * [login Created by solomon on 14-8-12.]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
DataManager.prototype.login = function (callback) {
    var mDataManager = this;
    var loginUrl = this.config.mothership_url + '/login';
    var jar = request.jar();
    var form = request({
        jar: jar,
        method: 'POST',
        url: loginUrl
    }, function (err, httpResponse, body) {
        if (httpResponse.statusCode != 200 || !body)
            return callback(new Error('login error'));

        mDataManager.cookieString = jar.getCookieString(loginUrl);
        var cookies = jar.getCookies(loginUrl);
        callback(null, cookies);
    }).form();
    //
    form.append('username', this.config.username || 'admin1');
    form.append('password', this.config.password || 'xiaoshu815');
};
/**
 * [getJar description]
 * @return {[Object]} [description]
 */
DataManager.prototype.getJar = function () {
    var jar = request.jar();
    var cookie = request.cookie(this.cookieString);
    jar.setCookie(cookie, this.config.mothership_url + '/login');
    return jar;
};

/**
 * [request description]
 * @param  {[Object]}   options  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
DataManager.prototype.request = function (options, callback) {
    var defaults = {
        methods: 'GET'
    };
    for (var key in options) {
        defaults[key] = options[key];
    }
    options = defaults;
    options.jar = this.getJar();
    console.log('request %s', options.uri || options.url);
    var req = request(options, function (err, response, body) {
        if (err) return callback(err);
        if (response.statusCode == 200) {
            callback(null, body);
        } else {
            callback(err, response.statusCode);
        }
    });

    req.on('response', function(res){
         var len = parseInt(res.headers['content-length'], 10);
          console.log();
          var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
            complete: '=',
            incomplete: ' ',
            width: 20,
            total: len
          });

          res.on('data', function (chunk) {
            bar.tick(chunk.length);
          });

          res.on('end', function () {
            console.log('\n');
          });
    });
};


/**
 * [exports description]
 * @type {[type]}
 */
module.exports = DataManager;