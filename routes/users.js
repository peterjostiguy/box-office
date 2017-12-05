var express = require('express')
var router = express.Router()
var admin = require('firebase-admin')
var bcrypt = require('bcrypt')
var serviceAccount = require("../firebase-boxoffice.json")
var ref = require('./firebase')

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
    dataKeys = Object.keys(data)
    var dataValues = Object.values(data)
    var userExist = false
    for (var i = 0; i < dataValues.length; i++) {
      if (dataValues[i].username === req.body.username) {
        userExist = true
        var user = dataValues[i]
        bcrypt.compare(req.body.password, user.password, function(err, isMatch){
          if (isMatch) {
            var userCode = dataKeys[i]
            var authMessage = "Welcome back " + user.username
            res.cookie('userCode', userCode)
            next()
            res.cookie('isAdmin', user.isAdmin)
            // next()
            var url = '/users?user=' + userCode
            res.redirect(url)
          }
          else {
            res.render('index', {message: 'Wrong Password Dum Dum'})
          }
        })
        break
      }
    }
    if (!userExist) {
      res.render('index', {message: "User Doesn't Exist"})
    }
  })
})

router.get('/', function(req, res, next) {
  if (req.cookies.userCode) {
    res.render('users')
  }
  else {
    res.redirect('/')
  }
})

module.exports = router
