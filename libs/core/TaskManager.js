
exports.run = function(modules, data, callback){
	for(var i in data){
		var item = data[i];
		console.log('[TaskManager]: analysis data');
		for(var j in modules){
			var module = modules[j];
			console.log('[TaskManager]: module: %s', module.name);
			module.create(item, function(err, data){
				if(err) module.restore();
				else callback(err, module.name, data);
			});
		}
	}
};
