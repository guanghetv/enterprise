var path = require('path');

require('./global');

var app_path = path.dirname(__dirname);
var modules_path = path.join(app_path, 'modules/preparation/');

module.exports = {
	test: {

	},
	production: {


	},
	development: {
		'modules_path': modules_path,
		'mothership_url': 'http://localhost:3000',
		'datapipe_url': 'http://localhost:3002',
        'db_url': 'mongodb://localhost/enterprise'
	}
};
