var path = require('path');

var dirname = __dirname;
console.log(dirname);
var server_path = path.dirname(dirname);
var enterprise_path = path.dirname(server_path);

module.exports = {
	development: {
		db_uri: 'mongodb://localhost/enterprise',
        server_path: server_path,
        enterprise_path: enterprise_path
	}
};
