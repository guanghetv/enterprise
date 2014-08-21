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
ModuleLoader.parseTask = function(dir){
	var manifest = path.join(dir, 'manifest.json');
	if(fileSystem.existsSync(manifest)){
		var manifestJSON = JSON.parse(fileSystem.readFileSync(manifest, 'utf8'));
		var task = require(path.join(dir, manifestJSON['entrance']));
		if(task['create'] && task['restore']){
			for(var key in manifestJSON){
                task[key] = task[key];
			}
			return task;
		}else{
			console.warn('task must be have "create" and "restore" methods .', task.name);
		}
	}else{
		console.warn('task "%s" have not manifest.json .', dir);
	}
};

ModuleLoader.parseModule = function(dir){
	var module = {
		tasks: []
	};
	var manifest = path.join(dir, 'manifest.json');
	if(fileSystem.existsSync(manifest)){
		var manifestJSON = JSON.parse(fileSystem.readFileSync(manifest, 'utf8'));
		for(var key in manifestJSON){
			module[key] = manifestJSON[key];
		}
		fileSystem.readdirSync(dir).forEach(function(filename){
			var task = ModuleLoader.parseTask(path.join(dir, filename));
			if(task) module.tasks.push(task);
		});
		return module;
	}else{
		console.warn('module "%s" have not manifest.json .', dir);
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
		var module = ModuleLoader.parseModule(path.join(that.config.modules_path, filename));
		//disabled is avaliable now .
		if(module && !module.disabled){
			modules.push(module)
			console.log('[ModulesLoader]: load %s %s tasks .', module.name, module.tasks.length);
		}
	});
    
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
            // TODO: where is this callback? //see arguments .
			if(module) callback(null, module);
		}
	});
	console.info('[ModulesLoader]: watch has started.');
};
/**
 * [exports]
 * @type {[type]}
 */
module.exports = ModuleLoader;
