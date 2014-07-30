/**
 * Created by solomon on 14-7-28.
 */

var testTracks = [{"event":"AnswerProblem","problemId":"001","correct":"true","user":{"name":"lsong","rooms":["r01"]},"time":"1406538560"},
    {"event":"AnswerProblem","problemId":"001","correct":"false","user":{"name":"lsong","rooms":["r01"]},"time":"1406538561"},
    {"event":"AnswerProblem","problemId":"001","correct":"true","user":{"name":"lsong","rooms":["r01"]},"time":"1406538562"},
    {"event":"AnswerProblem","problemId":"001","correct":"false","user":{"name":"yanan","rooms":["r01"]},"time":"1406538560"},
    {"event":"AnswerProblem","problemId":"001","correct":"false","user":{"name":"yanan","rooms":["r01"]},"time":"1406538561"},
    {"event":"AnswerProblem","problemId":"001","correct":"true","user":{"name":"yanan","rooms":["r01"]},"time":"1406538562"}];

var testUsers = [{"name":"lsong","age":"25"},{"name":"yanan","age":"23"}];
var testRooms = [{"roomId":"r01","school":"光合新知厨师挖掘机学校"}];
var testCourses = [{"chapterId":"c01","chapterTitle":"第一章",lessons:[{"lessonId":"l01","problems":[{"problemId":"001","problemBody":"1+1=?","choices":[{"choiceId":"choice0","choiceBody":"2","is_correct":"true"},{"choiceId":"choice1","choiceBody":"1","is_correct":"false"}]}]}]}];

var originData = {
    tracks:testTracks,
    users:testUsers,
    rooms:testRooms,
    courses:testCourses
};

var express = require('express');
var app = express();

app.get('/origin', function(req, res){
    res.send(originData);
});

var server = app.listen(2333, function() {
    console.log('Listening on port %d', server.address().port);
});