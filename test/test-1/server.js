var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var mongoose = require('mongoose');
var db = mongoose.connect("mongodb://localhost/enterprise");

//simple logger
app.use(function(req, res, next){
	console.log("\033[0;32m%s \033[1;33m%s", req.method, req.url);
	next();
});
//serval static file
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./route')(app);

//error handler
app.use(function(req, res, next){
	res.status(404).end('404 Not Found .');
	next();
});

var server = app.listen(3002, function(){
	console.log("server is running at %s", server.address().port);
});

//expose app
module.exports = app;
