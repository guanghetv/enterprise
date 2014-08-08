/**
 * Created by solomon on 14-8-5.
 */

module.exports = function(app) {

    var individuals = require('./app/controllers/individuals');

    //--------------------API2-----------------------
    app.post('/stats/individuals',individuals.testPost);
    //app.post('/stats/rooms');


    //--------------------API3-----------------------

    app.get('/stats/individuals',individuals.testGet);
    //app.get('/stats/rooms');

};