/**
 * Created by solomon on 14-8-5.
 */


module.exports = function(app) {

    var individuals = require('./app/controllers/individuals');

    //--------------------API2-----------------------
    app.post('/stats/individuals',individuals.testPost);


    //--------------------API3-----------------------

    app.get('/stats/individuals',individuals.testGet);

};