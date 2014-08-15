/**
 * Created by solomon on 14-8-5.
 */

module.exports = function(app) {

    var individuals = require('./app/controllers/individuals');
    var rooms = require('./app/controllers/rooms');

    //--------------------API2-----------------------
    app.post('/stats/individuals',individuals.addIndividualChapterStats);
    app.post('/stats/rooms',rooms.addRoomChapterStats);

    //--------------------API3-----------------------

    app.get('/stats/individuals',individuals.getIndividualChapterStats);
    app.get('/stats/rooms',rooms.getRoomChapterStats);

};