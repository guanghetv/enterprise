/**
 * Created by solomon on 14-7-28.
 */

var testData = require('./test/data.json');
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(testData));
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');