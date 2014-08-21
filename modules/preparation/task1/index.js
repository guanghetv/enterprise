/**
 * Created by solomon on 14-8-21.
 */

exports.create = function(mDataManager,callback){
    mDataManager.getChapterById('538fe05c76cb8a0068b14031',function(err,response){
        console.log(important,JSON.parse(response).name);
        callback(null);
    })

};

exports.restore = function(){

};
