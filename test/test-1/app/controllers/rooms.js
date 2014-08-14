/**
 * Created by solomon on 14-8-14.
 */

var mongoose = require('mongoose');
require('../models/rooms');
var Rooms = mongoose.model('Rooms');

exports.testPost = function(req,res){
    console.log(req.body);
    Rooms.create(req.body,function(err,result){
        if(!err){
            res.status(200).send({"message":"successfully created this stats"});
        }else{
            console.log(err);
            res.status(500).send({"message":err});
        }
    })
};

exports.testGet = function(req,res){
    var query = req.query;
    Rooms
        .find({"stats.chapter.chapterId":query.chapterId})
        .where('rooms._id').equals(query.roomId)
        .exec(function(err,result){
            res.send(result);
        });
};