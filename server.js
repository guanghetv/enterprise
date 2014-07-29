/**
 * Created by solomon on 14-7-28.
 */

var testData = [{"event":"AnswerProblem","problemId":"001","correct":"true","user":{"name":"lsong","rooms":["r01"]},"time":"1406538560"},
    {"event":"AnswerProblem","problemId":"001","correct":"false","user":{"name":"lsong","rooms":["r01"]},"time":"1406538561"},
    {"event":"AnswerProblem","problemId":"001","correct":"true","user":{"name":"lsong","rooms":["r01"]},"time":"1406538562"},
    {"event":"AnswerProblem","problemId":"001","correct":"false","user":{"name":"yanan","rooms":["r01"]},"time":"1406538560"},
    {"event":"AnswerProblem","problemId":"001","correct":"false","user":{"name":"yanan","rooms":["r01"]},"time":"1406538561"},
    {"event":"AnswerProblem","problemId":"001","correct":"true","user":{"name":"yanan","rooms":["r01"]},"time":"1406538562"}];

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify(testData));
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
