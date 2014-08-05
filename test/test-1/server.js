var express = require('express');

var app = express();

//simple logger
app.use(function(req, res, next){
	console.log("\033[0;32m%s \033[1;33m%s", req.method, req.url);
	next();
});
//serval static file
var fs = require('fs');
app.use(function(req, res, next){
	var url = req.url;
	if(url == '/'){
		//default index file.
		url += 'index.html';
	}
	var filename = __dirname + '/public' + url;
	if(fs.existsSync(filename)){
		res.send(fs.readFileSync(filename,{ encoding: 'utf-8' }));
	}else{
		next();
	}
});


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