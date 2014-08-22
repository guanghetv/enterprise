var path = require('path');

var app_path 		= path.dirname(__dirname);
var modules_path 	= path.join(app_path, 'modules');
require('./global');

module.exports = {
	development: {
		'modules_path': modules_path,
		'mothership_url': 'http://localhost:3000',
		//'mothership_url': 'http://yangcong345.com',
		'datapipe_url': 'http://localhost:3002',
        'db_url': 'mongodb://localhost/enterprise'
	},
	test: {

	},
	production: {


	}
};
