/**
 * Created by solomon on 14-8-5.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IndividualSchema = new Schema({
    user:Schema.Types.Mixed,
    stats:Schema.Types.Mixed
});

mongoose.model('Individuals',IndividualSchema,'individuals');