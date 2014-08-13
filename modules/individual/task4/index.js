exports.create = function(key,data,originData,callback){
    console.log('-------计算做题率-------');
    // TODO: 这种log前缀请去掉，很不专业
    console.log("|||||||||||||||||||||||||||||||||||||",data);
    // TODO: 起名字能短点么...，下面的代码看着真的很乱
    // TODO: 请把很长名字的参数改为注释+短名
    _.each(data,function(singleChapterSituation){
        var chapterId = singleChapterSituation.stats.chapter.chapterId;
        var chapterObject = _.find(originData.courses,function(chapter){
            return chapter._id == chapterId;
        });
        // TODO: 这种log前缀请去掉，很不专业
        //console.log("|||||||||||||||||||||||||||||||||||||",chapterObject);
        // TODO: 请把很长名字的参数改为注释+短名
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
                // TODO: quizObject在哪里定义？被用在哪里
                quizObject = _.find(lessonObject.activities,function(activity){
                    return activity.type === 'gonggu';
                })
            }else if(lessonObject.type === 'practice'){
                quizObject = _.find(lessonObject.activities,function(activity){
                    return activity.type === 'lianxi';
                })
            }

            // TODO: 这种log前缀请去掉改为对面变量的描述，比如"quizObject: "
            //console.log("|||||||||||||||||||||||||||||||||||||",quizObject);
        })
    });
    callback(null, data);
};

/*
exports.restore = function(){

};*/
