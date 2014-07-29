var testModule = require('../../modules/test/index.js');

exports.load = function(callback){
	var modules = [];

	testModule['name'] = 'test';

	modules.push(testModule);

	console.info('[ModulesLoader]: load modules %s', modules);
	callback(null, modules);
};

exports.watch = function(){
	console.info('[ModulesLoader]: watch started.');
};
