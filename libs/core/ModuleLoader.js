var fileSystem = require('fs');
var path = require('path');

var findModules = function(modules_path){
	var manifests = [];
	var files = fileSystem.readdirSync(modules_path);
	files.forEach(function(filename){
		console.log(path.join(modules_path, filename, 'manifest.json'));
	});
};

exports.load = function(config, callback){

	var modules = [];
	findModules(config.modules_path);
	
};

exports.watch = function(){
	console.info('[ModulesLoader]: watch started.');
};
