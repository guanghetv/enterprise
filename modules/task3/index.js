
exports.create = function(key,data,originData,callback){
    console.log('-------计算个人做题状况-------');

    var problemSituation = {};

    _.each(data,function(track){
        if(problemSituation[track.problemId] == null){
            problemSituation[track.problemId] = {};
            problemSituation[track.problemId]['correct_count'] = 0;
            problemSituation[track.problemId]['wrong_count'] = 0;
        }

        if(track.correct === 'true'){
            problemSituation[track.problemId]['correct_count'] ++;
        }else{
            problemSituation[track.problemId]['wrong_count'] ++;
        }
    });

    console.log(problemSituation);



    callback(null, data);
};

exports.restore = function(){

};
