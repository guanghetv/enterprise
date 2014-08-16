/**
 * Created by solomon on 14-8-14.
 */

var mongoose = require('mongoose');
require('../models/rooms');
var Rooms = mongoose.model('Rooms');
var NewRooms = mongoose.model('NewRooms');
var _ = require('underscore');

exports.addRoomChapterStats = function(req,res){
    Rooms.create(req.body,function(err,result){
        if(!err){
            res.status(200).send({"message":"successfully created this stats"});
            NewRooms.create(req.body,function(err,result){
                if(!err){
                    NewRooms.find({"room._id":result.room._id,"stats.chapter.chapterId":result.stats.chapter.chapterId},
                        function(err,docs){
                            if(!err){
                                var idArray = _.map(_.sortBy(docs,function(doc){
                                    return doc.timestamp.getTime();
                                }),function(record){
                                    return record._id;
                                });

                                idArray.splice(-1,1); // 最后一条（也就是最新的一条）予以保留
                                _.each(idArray,function(id){
                                    NewRooms.remove({_id:id},function(err){
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

exports.getRoomChapterStats = function(req,res){
    var query = req.query;
    NewRooms.find({"stats.chapter.chapterId":query.chapterId,"room._id":query.roomId},function(err,docs){
        var ret = [];
        var roomifyRecords = {};
        _.each(docs,function(doc){
            if(roomifyRecords[doc.room._id] == undefined){
                roomifyRecords[doc.room._id] = [];
            }
            roomifyRecords[doc.room._id].push(doc);
        });

        _.each(roomifyRecords,function(roomRecordArray){
            ret.push(_.last(_.sortBy(roomRecordArray,function(record){
                return record.timestamp.getTime();
            })))
        });
        res.send (ret);
    });
};