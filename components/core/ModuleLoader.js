var fileSystem = require('fs');
var path = require('path');

var ModuleLoader = function(config){
	this.config = config;
};

ModuleLoader.parseFolder = function(dir){
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

ModuleLoader.prototype.loadModules = function(callback) {
	var that = this;
	var modules = [];
	fileSystem.readdirSync(that.config.modules_path).forEach(function(filename){
		var module = ModuleLoader.parseFolder(path.join(that.config.modules_path, filename));
		if(module) modules.push(module);
	});
    console.log('[ModulesLoader]: load %s modules', modules.length);
    callback(null, modules);
};

ModuleLoader.prototype.watch = function(callback) {
	var that = this;
	fileSystem.watch(this.config.modules_path, function(ev, filename){
		filename = path.join(that.config.modules_path, filename);
		if(ev == 'rename') ev = fileSystem.existsSync(filename) ? 'create' : 'remove';
		if(ev == 'create'){
			var module = ModuleLoader.parseFolder(filename);
            // TODO: where is this callback?
			if(module) callback(null, module);
		}
	});
	console.info('[ModulesLoader]: watch has started.');
};

module.exports = ModuleLoader;
