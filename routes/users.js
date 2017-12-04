var express = require('express')
var router = express.Router()
var admin = require('firebase-admin')
var bcrypt = require('bcrypt')

var serviceAccount = require("../firebase-boxoffice.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://box-office-fantasy.firebaseio.com/"
})

var db = admin.database()
var ref = db.ref()
ref.once("value", function(snapshot) {
  //This returns all data from FB DB
  // console.log(snapshot.val())
})
var usersRef = ref.child("users")

router.post('/signup', function(req, res, next) {
  // This doesn't protect against duplicates
  bcrypt.hash(req.body.password, 10, function(err, hash){
    req.body.password = hash
    usersRef.push().set(req.body)
  })
  res.render('index', {user: req.body.username})
})

router.post('/signin', function(req, res, next){
  ref.once('value', function(snapshot){
    var data = snapshot.val()
    data = data['users']
    dataValues = Object.values(data)
    console.log(dataValues);
    for (var i = 0; i < dataValues.length; i++) {
      if (dataValues[i].username === req.body.username) {
        var user = dataValues[i]
        bcrypt.compare(req.body.password, user.password, function(err, isMatch){
          if (isMatch) {
            res.send("welcome back", user)
          }
          else {
            res.send("You done fucked up", user)
          }
        })
        // var user = dataValues[i]
        // res.send(user)
        break
      }
    }
    res.send("You didn't sign up ya dumb bitch")
  })
})

router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

module.exports = router;
