var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username:  {type: String, unique: true, required: true}, // String is shorthand for {type: String}
    password: {type: String, required: true},
    name:   {type:String, required: true}
});

var User = mongoose.model('User', userSchema);
module.exports = User