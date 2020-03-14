var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moviesSchema = new Schema({
    Title:  {type: String, unique: true, required:true}, // String is shorthand for {type: String}
    yearReleased: {type: String, required:true},
    Genre:   {type:String, required:true},
    Actor: [{ActorName:{type:String, required:true}, characterName:{type:String, required:true} }]
});

var Movie = mongoose.model('movie', moviesSchema);
module.exports = Movie