var fileSystem = require('fs');
var path = require('path');

// TODO: loadModule->parseFolder
var loadModule = function(dir){
	var manifest = path.join(dir, 'manifest.json');
	if(fileSystem.existsSync(manifest)){
		var manifestJSON = JSON.parse(fileSystem.readFileSync(manifest, 'utf8'));
		var module = require(path.join(dir, manifestJSON['entrance']));
		if(module['create'] && module['restore']){
			for(var key in module){
                // TODO: manifestJSON[key] = module[key]
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

// TODO: 直接传参config.modules_path
exports.load = function(config, callback){
	var modules = [];
	fileSystem.readdirSync(config.modules_path).forEach(function(filename){
		var module = loadModule(path.join(config.modules_path, filename));
		if(module){
			modules.push(module);
		}
	});
    console.info('[ModulesLoader]: load modules %s', JSON.stringify(modules));
    callback(null, modules);
};

// TODO: 直接传参config.modules_path
exports.watch = function(config){
	fileSystem.watch(config.modules_path, function(ev, filename){
		filename = path.join(config.modules_path, filename);
		if(ev == 'rename') ev = fileSystem.existsSync(filename) ? 'create' : 'remove';
		if(ev == 'create'){
			var module = loadModule(filename);
            // TODO: where is this callback?
			if(module)callback(err, module);
		}
	});
	console.info('[ModulesLoader]: watch has started.');
};
