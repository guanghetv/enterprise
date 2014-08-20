/**
 * [DataManager description]
 * @param {[type]} config [description]
 */
var DataManager = function(config, cache){
    this.config = config;
    //
    if(cache) this.cache = cache;
};

DataManager.prototype.setCacheProvider = function(cache){
    //CacheProvider must be impl* 'set' and 'get' methods .
    this.cache = cache;
};

DataManager.prototype.getCache = function(key, success, error){
    this.cache.get(key, function(err, data){
        if(err) error(err, key);
        else success(err, data);
    });
};


// ----------------- 零拉 -------------------

DataManager.prototype.pullChapterById = function(chapterId, callback){
    this.request('/courses/+chapterId',saveChapterById(chapterId,callback(data)))
}





DataManager.prototype.request = function(url, callback){
    request({
        methods : 'POST',
        uri     : config.datapipe_url + url,
        headers : { 'content-type': 'application/json' }
    },function (err, response, body){
        if(err) return callback(err);
        if(response.statusCode == 200){
            callback(null, body);
        } else {
            callback(err, response.statusCode);
        }
    });
};

//------------- 整存 ——---------------
DataManager.prototype.saveChapterById = function(chapterId,callback){
    return function(data){
        this.cache.set('course_'+chapterId,callback);
    }
}




// ------------ 零取 -----------------
/**
 * example
 * @param  {[type]}   key      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
DataManager.prototype.getEventsBy = function(key, callback){
    var that = this;
    this.getCache(key, callback, function(err, key){
        that.request('/url', callback);
    });
};

module.exports.DataManager = DataManager;

/**
 * Created by solomon on 14-7-29.
 */

// TODO: http://localhost:3000/ 这个URL头需要放入config/config.js [development]，变为可配置 \
// TODO: 重新设计TASK的schema，如下:
// taskSchema = [
//      {
//          "name":"tracks",
//          "domain":config.domain, // 从config/config.js[env]里面取
//          "path":"/tracks"
//          "collection":[
//              {
//                  "name":"finish_lesson" // 不要到带tracks_前缀
//                  "qs": {
//                      "data.event" : "FinishLesson"
//                      }"
//              }
//          ]
//      }
// ]
/*
var config;

exports.load = function(_config, callback){
    config = _config;
    if(global.mothership_cookie == undefined){
        callback("No cookie, cannot connect to mothership!");
    }else{
        // TODO: 以下代码应挪入login.js, mothership_cookie应为login本地变量，cookie应作为全局变量。
        var j = request.jar();
        var cookie = request.cookie(global.mothership_cookie);
        j.setCookie(cookie,  config.mothership_url + '/login');
        // TODO: 以上


        // TODO: getDataTask -> dataTasks
        var getDataTasks = [];

        // TODO: 此task应该单独设立文件并放入config文件夹，具体修改格式请参看上方schema
        var tasks = [
            {key:'users',urls:[{sub_key:'all',url: config.mothership_url + '/users'}]},
            {key:'schools',urls:[{sub_key:'all',url: config.mothership_url + '/schools?mode=all'}]},
            {key:'courses',urls:[{sub_key:'all',url: config.mothership_url + '/api/v1/courses'}]},
            {key:'tracks',urls:[
                {sub_key:'tracks_finishLesson',url: config.mothership_url + '/tracks?$and=[{"data.event":"FinishLesson"},{"$or":[{"data.properties.usergroup":"student"},{"data.properties.roles":"student"}]}]'},
                {sub_key:'tracks_finishVideo',url: config.mothership_url + '/tracks?$and=[{"data.event":"FinishVideo"},{"$or":[{"data.properties.usergroup":"student"},{"data.properties.roles":"student"}]}]'},
                {sub_key:'tracks_startProblemSet',url: config.mothership_url + '/tracks?$and=[{"data.event":"StartProblemSet"},{"$or":[{"data.properties.usergroup":"student"},{"data.properties.roles":"student"}]}]'},
                {sub_key:'tracks_answerProblem',url: config.mothership_url + '/tracks?$and=[{"data.event":"AnswerProblem"},{"$or":[{"data.properties.usergroup":"student"},{"data.properties.roles":"student"}]}]'},
                {sub_key:'tracks_finishProblemSet',url: config.mothership_url + '/tracks?$and=[{"data.event":"FinishProblemSet"},{"$or":[{"data.properties.usergroup":"student"},{"data.properties.roles":"student"}]}]'}
            ]}
        ];

        // getDataTask -> downloadData
        var getDataTask = function(key,sub_key,url,callback){
            request({url: url, jar: j},  function(err, httpResponse, body) {
                if (err) {
                    // TODO: 重试机制在这里非常必要！
                    callback(err);
                }else{
                    if(httpResponse.statusCode == 200){
                        console.info('[DataManager]: Load '+key+'|'+sub_key +' data succeed!');
                        var data = {};
                        data[key] = {};
                        data[key][sub_key] = body;
                        callback(null,data);
                    }else{
                        callback(body);
                    }
                }
            });
        };
        _.each(tasks,function(task){
            _.each(task.urls,function(urlObject){
                // TODO: dataTasks[]
                getDataTasks.push(function(cb){
                    getDataTask(task.key,urlObject.sub_key,urlObject.url,function(err,data){
                        if(err!=null){
                            console.error(err);
                        }else{
                            cb(err,data)
                        }
                    });
                })
            });

        });
        async.parallel(getDataTasks,function(err,results){
            if(err){
                callback(err);
            }else{
                var originData = {};
                _.each(results,function(result){
                    for(var key in result){
                        if(originData[key]==undefined){
                            originData[key] = {};
                        }
                        for(var sub_key in result[key]){
                            if(originData[key][sub_key]==undefined){
                                originData[key][sub_key] = {};
                            }
                            // TODO: 此举非常危险，当数据量足够大时，速度以及内存空间都值得考虑
                            // TODO: 建议直接存入Cache, CacheManager需要提供足够细致的API提供对于collection级别的单独存储
                            originData[key][sub_key] = JSON.parse(result[key][sub_key]);
                        }
                    }
                });
                callback(null,originData);
            }
        });
    }
};

exports.save = function(dimension,data, callback){
    // TODO: 此处硬代码需要调整为统一task的输出
    var finalStats;
    switch (dimension){
        case 'individuals':
            //console.info('[DataManager]: upload data %s', JSON.stringify(data.crew_0003));
            finalStats = data.crew_0003;
            break;
        case 'rooms':
            finalStats = data.crew_room_0001;
            break;
        default :
    }

    var postStats = function(data,callback){
        request(
            {
                // TODO: 此对象中个参数应该调整至config文件夹
                method: 'POST',
                uri:  config.datapipe_url + '/stats/'+dimension,
                headers:{'content-type': 'application/json'},
                body:JSON.stringify(data)
            },

            function (error, response, body) {
                if(response.statusCode == 200){
                    console.log(body);
                } else {
                    // TODO: 必要的重试机制
                    console.error(response.statusCode+":"+body);
                }
                callback(error,response.statusCode);
            }
        );
    };

    var uploadTasks = [];
    _.each(finalStats,function(stats){
        _.each(stats,function(stat){
            uploadTasks.push(function(cb){
                postStats(stat,function(err,statusCode){
                    cb(err,statusCode);
                });
            });
        });
    });

    async.parallelLimit(uploadTasks,10,function(err,result){
        // TODO: 对于err的异常处理
        console.log(result);
        if(dimension === 'rooms'){
            console.log("data analysis done");
            process.exit(0);
        }
    });
};
*/