var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    movie_name:  {type: String, required:true}, // String is shorthand for {type: String}
    review: {type: String, required:true},
    Rating:   {type: String, required:true},
    author_name: {type: String, required:true}





});

var Review = mongoose.model('review', reviewSchema);
module.exports = Review