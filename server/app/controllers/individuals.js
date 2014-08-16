/**
 * Created by solomon on 14-8-5.
 */
var mongoose = require('mongoose');
require('../models/individuals');
var Individuals = mongoose.model('Individuals');
var NewIndividuals = mongoose.model('NewIndividuals');
var _ = require('underscore');

exports.addIndividualChapterStats = function(req,res){
    Individuals.create(req.body,function(err,result){
        if(!err){
            res.status(200).send({"message":"successfully created this stats"});
            NewIndividuals.create(req.body,function(err,result){
                if(!err){
                    console.log(result.timestamp);
                    NewIndividuals.find({"user._id":result.user._id,"stats.chapter.chapterId":result.stats.chapter.chapterId},
                        function(err,docs){
                            if(!err){
                                var idArray = _.map(_.sortBy(docs,function(doc){
                                    return doc.timestamp.getTime();
                                }),function(record){
                                    return record._id;
                                });

                                idArray.splice(-1,1); // 最后一条（也就是最新的一条）予以保留
                                _.each(idArray,function(id){
                                    NewIndividuals.remove({_id:id},function(err){
                                        if(err){
                                            console.error(err);
                                        }
                                    });
                                })
                            }else{
                                console.error(err);
                            }
                        })
                }else{
                    console.error(err);
                }
            })
        }else{
            console.error(err);
            res.status(500).send({"message":err});
        }
    });

};

exports.getIndividualChapterStats = function(req,res){
    var query = req.query;
    NewIndividuals.find({"stats.chapter.chapterId":query.chapterId,"user.rooms._id":query.roomId},function(err,docs){
        var ret = [];
        var userifyRecords = {};
        _.each(docs,function(doc){
            if(userifyRecords[doc.user._id] == undefined){
                userifyRecords[doc.user._id] = [];
            }
            userifyRecords[doc.user._id].push(doc);
        });

        _.each(userifyRecords,function(userRecordArray){
            ret.push(_.last(_.sortBy(userRecordArray,function(record){
                return record.timestamp.getTime();
            })))
        });
        res.send (ret);
    });
};