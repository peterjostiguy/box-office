var express = require('express')
var router = express.Router()
var admin = require("firebase-admin")

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

router.post('/', function(req, res, next) {
  console.log(req.body)
  res.render('index', {title: "Auth"})
})

router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

module.exports = router;
