
exports.run = function(modules, data, callback){
	var d = data;
	modules.forEach(function(module){
		module.create(d, function(err, newData){
			d = newData;
			console.log(d);
		});
	});
};
