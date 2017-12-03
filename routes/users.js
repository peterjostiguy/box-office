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
  console.log(snapshot.val())
})
var usersRef = ref.child("users")
console.log("hmmm")

router.post('/', function(req, res, next) {
  console.log("dun did it");
  res.send('this is the users page')
})

router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

module.exports = router;
