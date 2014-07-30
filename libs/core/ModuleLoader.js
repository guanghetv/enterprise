var fileSystem = require('fs');
var path = require('path');

var loadModules = function(){

};

exports.load = function(config, callback){

	var modules = [];
	fileSystem.readdir(config.modules_path, function(err, files){
		files.forEach(function(filename){
			var manifest = path.join(config.modules_path, filename, 'manifest.json'); 
			fileSystem.exists(manifest, function(exists){
				if(!exists)return;
				var options = {
					encoding: 'utf8'
				};
				fileSystem.readFile(manifest, options, function(err, stream){
					var json = JSON.parse(stream);
					console.log(json);
				});
			});
		});

		console.info('[ModulesLoader]: load modules %s', modules);
		callback(null, modules);
	});
};

exports.watch = function(){
	console.info('[ModulesLoader]: watch started.');
};
