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

router.post('signin', function(req, res, next){
  return knex('my_user').insert({agentName: agentName, password: password}, "password")
  ref.once('/users/').once('value', function(snapshot){
    console.log(snapshot)
    return snapshot
  })
  .then(function(user){
    console.log(user)
    bcrypt.compare(req.body.password, user.password, function(err, isMatch){
      if (isMatch) {
        res.send('Welome back, ' + user.username)
      }
      else {
        res.render('index', { title: 'Box Office', message: 'Incorrect login. Contents will self destruct' })
      }
    })
  })
})

router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

module.exports = router;