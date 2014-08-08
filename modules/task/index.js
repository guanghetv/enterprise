/*exports.create = function(data,originData, callback){
    console.log("--------按用户分类事件--------");
    var userifyTracks = {};
    var tracks = originData.tracks;
    tracks.forEach(function(item){
        if(userifyTracks[item.user.name]==null){
            userifyTracks[item.user.name] = [];
        }
        userifyTracks[item.user.name].push(item);
    });

    callback(null, userifyTracks);
};*/

exports.create = function(data,originData, callback){
    console.log("--------按用户分类事件--------");
    var userifyTracks = {};
    var tracks = originData.tracks;
    tracks.forEach(function(item){
        if(userifyTracks[item.data.properties.distinct_id]==null){
            userifyTracks[item.data.properties.distinct_id] = [];
        }
        userifyTracks[item.data.properties.distinct_id].push(item);
    });

    callback(null, userifyTracks);
};

exports.restore = function(){

};