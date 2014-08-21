/**
 * Created by solomon on 14-8-21.
 */

exports.create = function(mDataManager,callback){
	console.log('hello world');
    mDataManager.getChapterById('538fe05c76cb8a0068b14031',function(err,response){
        console.log(JSON.parse(response).name);
        callback(null);
    })
};

exports.restore = function(){

};
