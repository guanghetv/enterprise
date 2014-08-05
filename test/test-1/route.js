/**
 * Created by solomon on 14-8-5.
 */

module.exports = function(app) {

    //--------------------API-----------------------

    app.get('/stats/individuals',function(req,res){
        var query = req.query;
        res.send(query);
    });

};