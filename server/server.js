var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

console.log(config);

var mongoose = require('mongoose');
var dataFactoryCron = require('./app/services/data_factory');

//simple logger
app.use(function(req, res, next){
	console.log("\033[0;32m%s \033[1;33m%s", req.method, req.url);
	//disallow corss origin .
	//res.set('Access-Control-Allow-Origin', '*');
	next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//
mongoose.connect(config.db_uri, function(){
	console.log('mongodb is connected .');
	require('./config/route')(app);

    dataFactoryCron.start();
});

//error handler
app.use(function(req, res, next){
	//res.status(404).end('404 Not Found .');
	next();
});

var server = app.listen(3002, function(){
	console.log("server is running at %s", server.address().port);
});

//expose app
module.exports = app;
