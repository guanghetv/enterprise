var fileSystem = require('fs');
var path = require('path');
/**
 * [ModuleLoader description]
 * @param {[type]} config [description]
 */
var ModuleLoader = function(config){
	this.config = config;
};
/**
 * [parseFolder description]
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
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
		console.warn('[ModuleLoader] "%s" have no manifest.json .', dir);
	}
};
/**
 * [loadModules from modules .]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
ModuleLoader.prototype.loadModules = function(callback) {
	var that = this;
	var modules = [];
	fileSystem.readdirSync(that.config.modules_path).forEach(function(filename){
		var module = ModuleLoader.parseFolder(path.join(that.config.modules_path, filename));
		//disabled is avaliable now .
		if(module && !module.disabled) modules.push(module);
	});
    console.log('[ModuleLoader]: load %s modules', modules.length);
    callback(null, modules);
};
/**
 * [watch fileSystem]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
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
	console.info('[ModuleLoader]: watch has started.');
};
/**
 * [exports]
 * @type {[type]}
 */
module.exports = ModuleLoader;
