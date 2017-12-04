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
  var newUser = usersRef.push()
  newUser.set(req.body)
  res.render('index', {user: req.body.username})
})

router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

module.exports = router;
