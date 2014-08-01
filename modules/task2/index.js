exports.create = function(key,data,originData,callback){
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


	callback(null, data);
};

exports.restore = function(){

};
