const express = require('express')
const app = express()
const authController  = require('./auth')
const authJwtController = require('./auth_jwt')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
//db = require('./db.js')()
const passport = require('passport')
const port = process.env.PORT || 3000
const User = require('./Schema/User')
const Movie = require('./Schema/Movie')
var cors = require('cors');
const sha1 = require('sha1');


app.use(cors());
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
mongoose.connect(`mongodb://${process.env.USER_NAME_DB}:${process.env.PASSWORD_DB}@ds125453.mlab.com:25453/hw2`)
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


var router = express.Router()

function getJSONObject(req) {
    var json = {
        headers : "No Headers",
        key: process.env.UNIQUE_KEY,
        body : "No Body"
    };

    if (req.body != null) {
        json.body = req.body;
    }
    if (req.headers != null) {
        json.headers = req.headers;
    }
    if (req.query != null) {
        json.query = req.query;
    }
    return json;
}
app.use('/',router)
router.post('/signup', (req, res) =>
{
    if(req.body.username && req.body.password && req.body.name){
        var password = sha1(req.body.password);
        var newUser = new User({
            username: req.body.username,
            password: password,
            name: req.body.name
        });
        newUser.save(function (err, result) {
            if (err) {
              console.error(err);
              res.status(200).send({success: false,msg:"User already in the database"})
              return
            }
              res.status(200).send({success: true, msg: 'Successful created new user.'})
        });


    }
    else{
        res.status(500).send({success: false, msg:"In valid request"})
    }

})


router.post('/signin', (req, res) => {
    //var user = db.findOne(req.body.username);

        if(typeof req.body.username == "undefined"|| typeof req.body.password == "undefined" ){
            return res.status(401).send({success: false, msg: 'Please input username or passwpord'});
        }
        var password = sha1(req.body.password);
        User.findOne({username: req.body.username,password: password},function(err,result){

                if (err) res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});

                    if(!result) res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                    else {
                        var userToken = {id: result._id, username: result.username,name:result.name};
                        var token = jwt.sign(userToken, process.env.SECRET_KEY);
                        res.json({success: true, token: 'Bearer ' + token})
                    }

            })
})


router.route('/movies')
    .get(authJwtController.isAuthenticated, function(req,res){
     Movie.find({Title:req.body.title},function(err,result){
         if(err) {
             console.log(err)
             res.status(500).send({success: false, msg: "Some thing wrong with your input"})
         }
         if(!result){
             res.status(200).send({success: false, msg: "Movies are not in the database"})
         }
         else{
             res.status(200).send({success: true, result:result })
         }
     })
})
router.route('/movies')
    .post(authJwtController.isAuthenticated, function(req,res){

    if(req.body.Actor.length < 3){
        return res.status(200).send({success:false, msg:"Check your input, your actor field is less than 3"})
    }
    let newMovie = new Movie({Title:req.body.title, yearReleased: req.body.yearReleased,Genre:req.body.Genre, Actor:req.body.Actor})

        newMovie.save(function (err, result) {
            if (err) {
                //console.error(err);
                return res.status(200).send({success:false, msg:"Something wrong with your input"})

            }
            if(!result) return res.status(200).send({success:false, msg:"Movies already in the database"})
            return res.status(200).send({success: true, msg: 'Successful store new movies.'})
        });

    })
router.route('/movies')
    .put(authJwtController.isAuthenticated, function (req, res) {
        if(req.body.Actor.length < 3){
            return res.status(200).send({success:false, msg:"Check your input, your actor field is less than 3"})
        }
        Movie.findOneAndUpdate({Title: req.body.title}, {Title:req.body.title, yearReleased: req.body.yearReleased,Genre:req.body.Genre, Actor:req.body.Actor}, function(err, result) {
            if (err) return res.status(500).send({success:false,msg:"There is something wrong with the database"})
            if(!result) return res.status(200).send({success:false,msg:"There is something wrong with your input"})

            return res.status(200).send({success:true,msg:'Succesfully saved.'});
        })

    })
router.route('/movies')
    .delete(authJwtController.isAuthenticated, function(req,res){

    Movie.findOneAndDelete({ Title: req.body.title }, function(err, result) {

            if (err) {
                return res.status(500).send({sucess:false,msg:"Something wrong, Please contact your admin"});
            }
            if(!result)
            {
                return res.status(200).send({success:false,msg:"Movie not in the database"});
            }
            else{
                return res.status(200).send({success:true, msg:"Movie is deleted"});
            }
        });
    })


app.listen(port, () => console.log(`HW2 app listening on port ${port}!`))

module.exports = app