/*exports.create = function(key,data,originData,callback){
    console.log('-------添加 course 信息-------');
    var courses = originData.courses;
    _.each(data,function(track){
        var courseObject = _.find(courses,function(course){
            return course.chapterId == track.chapterId;
        });
        track['chapter'] = courseObject;
    });
    console.log(JSON.stringify(data));
    callback(null, data);
};*/


exports.create = function(key,data,originData,callback){
    console.log('-------添加 course 信息-------');
    var courses = originData.courses;
    _.each(data,function(track){
        var courseObject = _.find(courses,function(course){
            return course._id.oid == track.data.properties.ChapterId;
        });

        if(track.data.properties.ChapterId!=undefined &&
            track.data.properties.LayerId!=undefined &&
            track.data.properties.LessonId!=undefined &&
            track.data.properties.ActivityId!=undefined &&
            track.data.properties.ProblemId!=undefined){

            track['course'] = {};
            track['course']['ChapterTitle'] = courseObject.name;
            track['course']['ChapterId'] = track.data.properties.ChapterId;
            var currentLesson = _.find(_.find(courseObject.layers,function(layer){
                return layer._id.oid == track.data.properties.LayerId;
            }).lessons,function(lesson){
                return lesson._id.oid == track.data.properties.LessonId;
            });
            track['course']['LessonId'] = track.data.properties.LessonId;
            track['course']['LessonTitle'] = currentLesson.title;
            track['course']['ProblemId'] = track.data.properties.ProblemId;
            track['course']['ProblemBody'] = _.find(_.find(currentLesson.activities,function(activity){
                return activity._id.oid == track.data.properties.ActivityId;
            }).problems,function(problem){
                return problem._id.oid = track.data.properties.ProblemId;
            }).body;
        }
    });

    console.log(JSON.stringify(data));
    callback(null, data);
};

exports.restore = function(){

};
