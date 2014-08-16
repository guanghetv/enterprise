/**
 * Created by solomon on 14-8-5.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var IndividualSchema = new Schema({
    user:Schema.Types.Mixed,
    stats:Schema.Types.Mixed,
    timestamp:{type:Date,default:Date.now}
});

mongoose.model('Individuals',IndividualSchema,'individuals');
mongoose.model('NewIndividuals',IndividualSchema,'individuals_new');