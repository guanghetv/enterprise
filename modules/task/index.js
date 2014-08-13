exports.create = function(data,originData, callback){
    console.log("--------按用户分类事件--------");
    var userifyTracks = {};
    var tracks = originData.tracks;
    console.log(tracks);
    for(var key in tracks){
        tracks[key].forEach(function(item){
            var distinct_id = item.data.properties.distinct_id;
            if(userifyTracks[distinct_id]==undefined){
                userifyTracks[distinct_id] = {};
            }
            if(userifyTracks[distinct_id][key]==undefined){
                userifyTracks[distinct_id][key] = [];
            }
            userifyTracks[distinct_id][key].push(item);
        });
    }
    callback(null, userifyTracks);
};

exports.restore = function(){

};