exports.create = function(key,data,originData,callback){
    console.log('-------计算做题率-------');
    console.log("|||||||||||||||||||||||||||||||||||||",data);
    _.each(data,function(singleChapterSituation){
        var chapterId = singleChapterSituation.stats.chapter.chapterId;
        var chapterObject = _.find(originData.courses,function(chapter){
            return chapter._id == chapterId;
        });
        //console.log("|||||||||||||||||||||||||||||||||||||",chapterObject);
        _.each(singleChapterSituation.stats.lessons,function(singleLessonSituation){
            var lessonId = singleLessonSituation.lesson.lessonId;
            var layerId =singleLessonSituation.lesson.layerId;
            var layerObject = _.find(chapterObject.layers,function(layer){
                return layer._id == layerId;
            });
            var lessonObject = _.find(layerObject.lessons,function(lesson){
                return lesson._id == lessonId;
            });
            var quizObject;
            if(lessonObject.type === 'learn'){
                quizObject = _.find(lessonObject.activities,function(activity){
                    return activity.type === 'gonggu';
                })
            }else if(lessonObject.type === 'practice'){
                quizObject = _.find(lessonObject.activities,function(activity){
                    return activity.type === 'lianxi';
                })
            }

            //console.log("|||||||||||||||||||||||||||||||||||||",quizObject);
        })
    });
    callback(null, data);
};

/*
exports.restore = function(){

};*/
