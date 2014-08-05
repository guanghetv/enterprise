/**
 * Created by solomon on 14-8-5.
 */
var mongoose = require('mongoose');
require('../models/individuals');
var Individuals = mongoose.model('Individuals');

exports.testPost = function(req,res){
    console.log(req.body);
    Individuals.create(req.body,function(err,result){
        if(!err){
            res.status(200).send({"message":"successfully created this stats"});
        }else{
            res.status(500).send({"message":err});
        }
    })
};

exports.testGet = function(req,res){
    var query = req.query;
    res.send(query);
};