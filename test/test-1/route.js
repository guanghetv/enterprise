/**
 * Created by solomon on 14-8-5.
 */

module.exports = function(app) {

    var individuals = require('./app/controllers/individuals');
    var rooms = require('./app/controllers/rooms');

    //--------------------API2-----------------------
    app.post('/stats/individuals',individuals.testPost);
    app.post('/stats/rooms',rooms.testPost);

    //--------------------API3-----------------------

    app.get('/stats/individuals',individuals.testGet);
    app.get('/stats/rooms',rooms.testGet);

};