// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('./Schema/User')
passport.use(new BasicStrategy(
    function(username, password, done) {
        //hard coded

        User.findOne({username: username,password: password},function(err,result){
            if(!result)  return done(null, false);
            else
                return done(null, result.username);

        })
    }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });
