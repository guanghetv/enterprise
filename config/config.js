var path = require('path');

var app_path = path.dirname(__dirname);
var modules_path = path.join(app_path, 'modules/individual/');

module.exports = {
	test: {

	},
	production: {

	},
	development: {
		'modules_path': modules_path
	}
};
