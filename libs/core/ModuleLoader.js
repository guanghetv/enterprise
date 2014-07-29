

exports.load = function(callback){
	var modules = [];

	modules.push({
		name: 'test',
		create: function(data, callback){
			callback(null, data);
		},
		restore: function(){

		}
	});

	console.info('[ModulesLoader]: load modules %s', modules);
	callback(null, modules);
};

exports.watch = function(){
	console.info('[ModulesLoader]: watch started.');
};
