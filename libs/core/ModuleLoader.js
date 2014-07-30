var fileSystem = require('fs');
var path = require('path');

var loadModule = function(dir){
	var manifest = path.join(dir, 'manifest.json');
	if(fileSystem.existsSync(manifest)){
		var manifestJSON = JSON.parse(fileSystem.readFileSync(manifest, 'utf8'));
		var module = require(path.join(dir, manifestJSON['entrance']));
		if(module['create'] && module['restore']){
			for(var key in module){
				var val = module[key];
				manifestJSON[key] = val;
			}
			module = manifestJSON;
			return module;
		}else{
			console.warn('module must be have "create" and "restore" methods .', module.name);
		}
	}else{
		console.warn(' "%s" have not manifest.json .', dir);
	}
};

exports.load = function(config, callback){
	var modules = [];
	fileSystem.readdirSync(config.modules_path).forEach(function(filename){
		var module = loadModule(path.join(config.modules_path, filename));
		if(module){
			modules.push(module);
		}
	});
	callback(null, modules);
};

exports.watch = function(config){
	fileSystem.watch(config.modules_path, function(ev, filename){
		filename = path.join(config.modules_path, filename);
		if(ev == 'rename') ev = fileSystem.existsSync(filename) ? 'create' : 'remove';
		if(ev == 'create'){
			var module = loadModule(filename);
			if(module)callback(err, module);
		}
	});
	console.info('[ModulesLoader]: watch has started.');
};
