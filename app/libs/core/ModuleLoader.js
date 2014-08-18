var fileSystem = require('fs');
var path = require('path');

var parseFolder = function(dir){
	var manifest = path.join(dir, 'manifest.json');
	if(fileSystem.existsSync(manifest)){
		var manifestJSON = JSON.parse(fileSystem.readFileSync(manifest, 'utf8'));
		var module = require(path.join(dir, manifestJSON['entrance']));
		if(module['create'] && module['restore']){
			for(var key in module){
                manifestJSON[key] = module[key];
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
		var module = parseFolder(path.join(config.modules_path, filename));
		if(module){
			modules.push(module);
		}
	});
    console.info('[ModulesLoader]: load modules %s', JSON.stringify(modules));
    callback(null, modules);
};

exports.watch = function(config,callback){
	fileSystem.watch(config.modules_path, function(ev, filename){
		filename = path.join(config.modules_path, filename);
		if(ev == 'rename') ev = fileSystem.existsSync(filename) ? 'create' : 'remove';
		if(ev == 'create'){
			var module = parseFolder(filename);
            // TODO: where is this callback?
			if(module)callback(null, module);
		}
	});
	console.info('[ModulesLoader]: watch has started.');
};
