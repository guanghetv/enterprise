/**
 * Created by solomon on 14-8-14.
 */
exports.create = function(key,data,callback){
    console.log("--------按章节分类事件--------");
    var chapterifyStats = _.groupBy(_.flatten(data),function(item){
        return item.stats.chapter.chapterId;
    });
    callback(null,chapterifyStats);
};

exports.restore = function(){

};