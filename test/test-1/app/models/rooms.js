/**
 * Created by solomon on 14-8-14.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
    room:Schema.Types.Mixed,
    stats:Schema.Types.Mixed
});

mongoose.model('Rooms',RoomSchema,'rooms');