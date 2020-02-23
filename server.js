const express = require('express')
const app = express()
const authController  = require('./auth')
const authJwtController = require('./auth_jwt')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
db = require('./db.js')()
const passport = require('passport')
const port = process.env.PORT || 3000
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
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

    return json;
}
app.use('/',router)
router.post('/signup', (req, res) =>
{
    if(req.body.username && req.body.password){
        var newUser = {
            username: req.body.username,
            password: req.body.password
        };
        db.save(newUser)
        res.send({success: true, msg: 'Successful created new user.'})
    }
    else{
        res.send("In valid request")
    }

})


router.post('/signin', (req, res) => {
    var user = db.findOne(req.body.username);

    if(!user  || user.length === 0)
   {
       res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    }
  else
    {
        if(user.password  === req.body.password) {
            var userToken = { id : user.id, username: user.username };
            var token = jwt.sign(userToken, process.env.UNIQUE_KEY);
            res.json({success: true, token: 'Bearer ' + token})
        }
        else{
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
    }

})

router.route('/post')
    .post(authController.isAuthenticated, function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            var o = getJSONObject(req);
            res.json(o);
        }
    );

router.route('/postjwt')
    .post(authJwtController.isAuthenticated, function (req, res) {
            res = res.status(200);
            if (req.get('Content-Type')) {
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            res.send(req.body);
        }
    );

app.listen(port, () => console.log(`HW2 app listening on port ${port}!`))

module.exports = app