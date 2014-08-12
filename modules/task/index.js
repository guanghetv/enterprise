exports.create = function(data,originData, callback){
    console.log("--------按用户分类事件--------");
    var userifyTracks = {};
    var tracks = originData.tracks;
    tracks.forEach(function(item){
        var distinct_id = item.data.properties.distinct_id;
        if(userifyTracks[distinct_id]==null){
            userifyTracks[distinct_id] = [];
        }
        userifyTracks[distinct_id].push(item);
    });

    callback(null, userifyTracks);
};

exports.restore = function(){

};