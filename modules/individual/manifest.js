var _ = require('underscore');

module.exports = {
	"name": "individual",
    "seq":1,
    "async":function(dataManager){
    	dataManager.getAllTracks(function(err, tracks){
    		_.each(tracks, function(set, key){
    			console.log(JSON.parse(set));
    		});
    	});
    },
    "limit":3,
    "disabled":true

};