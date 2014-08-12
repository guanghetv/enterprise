/**
 * Created by solomon on 14-7-29.
 */

exports.load = function(callback){
    if(global.mothership_cookie == undefined){
        callback("No cookie, cannot connect to mothership!");
    }else{
        var j = request.jar();
        var cookie = request.cookie(global.mothership_cookie);
        j.setCookie(cookie, 'http://localhost:3000/login');

        var getDataTasks = [];
        var tasks = [
            {key:'users',url:'http://localhost:3000/users'},
            {key:'schools',url:'http://localhost:3000/schools?mode=all'},
            {key:'courses',url:'http://localhost:3000/api/v1/courses'},
            //{key:'tracks',url:'http://localhost:3000/tracks'},
            {key:'tracks',url:'http://localhost:3000/tracks?query={"data.event":"AnswerProblem"}'}
        ];

        var getDataTask = function(key,url,callback){
            request({url: url, jar: j},  function(err, httpResponse, body) {
                if (err) {
                    callback(err);
                }else{
                    if(httpResponse.statusCode == 200){
                        console.info('[DataManager]: Load '+key +' data succeed!');
                        var data = {};
                        data[key] = body;
                        callback(null,data);
                    }else{
                        callback(body);
                    }
                }
            });
        };
        _.each(tasks,function(task){
            getDataTasks.push(function(cb){
                getDataTask(task.key,task.url,function(err,data){
                    if(err!=null){
                        console.error(err);
                    }else{
                        cb(err,data)
                    }
                });
            })
        });
        async.parallel(getDataTasks,function(err,results){
            if(err){
                callback(err);
            }else{
                var originData = {};
                _.each(results,function(result){
                    for(var key in result){
                        originData[key] = JSON.parse(result[key]);
                    }
                });
                callback(null,originData);
            }
        });
    }
};

exports.save = function(data, callback){
	console.info('[DataManager]: upload data %s', JSON.stringify(data.crew_0003));
    var finalStats = data.crew_0003;

    var postStats = function(data,callback){
        request(
            {
                method: 'POST',
                uri: 'http://localhost:3002/stats/individuals',
                headers:{'content-type': 'application/json'},
                body:JSON.stringify(data)
            },

            function (error, response, body) {
                if(response.statusCode == 200){
                    console.log(body);
                } else {
                    console.log('error: '+ response.statusCode);
                    console.log(body)
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
        console.log(result);
    });
};