var express = require('express')
var router = express.Router()
var admin = require('firebase-admin')
var bcrypt = require('bcrypt')
var serviceAccount = require("../firebase-boxoffice.json")
var ref = require('./firebase')
var GoogleSpreadsheet = require('google-spreadsheet')
var async = require('async')

var doc = new GoogleSpreadsheet('1L9DhmZlw1yNtk0O4mV0vTdEf92mz63AjTaN8_4BxmpU')
var sheet

var usersRef = ref.child("users")
var moviesRef = ref.child("movies")

router.post('/signup', function(req, res, next) {
  // This doesn't protect against duplicates
  bcrypt.hash(req.body.password, 10, function(err, hash){
    req.body.password = hash
    req.body.leagues = {exists: false}
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
            res.cookie('isAdmin', user.isAdmin)
            var url = '/users?user=' + userCode
            res.redirect(url)
          }
          else {
            console.log("wrong password");
            res.render('index', {message: 'Wrong Password Dum Dum'})
          }
        })
        break
      }
    }
    if (!userExist) {
      console.log("!user doesn't")
      res.render('index', {message: "User Doesn't Exist"})
    }
  })
})

router.get('/', function(req, res, next) {
  if (req.cookies.userCode) {
    console.log(req.cookies.userCode)
    usersRef.once('value')
    .then(function(snapshot){
      console.log(snapshot.val()[req.cookies.userCode]);
      var usersLeagues = Object.values(snapshot.val()[req.cookies.userCode].leagues)
      var username = snapshot.val()[req.cookies.userCode].username
      res.render('users', {leagues: usersLeagues, username: username})
    })
  }
  else {
    res.redirect('/')
  }
})

router.get('/donezo', function(req, res, next){
  moviesRef.once('value', function(snapshot){
    movieDatabase = snapshot.val()
    movieDB = []
    for (var movie in movieDatabase) {
      if (movieDatabase.hasOwnProperty(movie)) {
        movieDB.push(movieDatabase[movie])
      }
    }
    async.series([
      function setAuth(step) {
        var creds = require('../google-generated-creds.json')
        doc.useServiceAccountAuth(creds, step);
      },
      function getInfoAndWorksheets(step) {
        doc.getInfo(function(err, info) {
          sheet = info.worksheets[8]
          step()
        })
      },
      function workingWithCells(step){
        sheet.getCells({
          'min-row': 2,
          'max-row': movieDB.length+1,
          'max-col': 3,
          'return-empty': true
        }, function(err, cells) {
          //change i to row*3 to populate lower bits
          for (var i = 0; i < cells.length; i++) {
            currentMovie = movieDB[Math.floor(i/3)]
            if (i%3 === 0) {
              cells[i].value = currentMovie.owner
            }
            else if (i%3 === 1) {
              cells[i].value = currentMovie.title
            }
            else if (i%3 === 2){
              cells[i].value = currentMovie.boughtFor
            }
            cells[i].save()
          }
          step()
        })
      }
    ])
  })
  res.render('done')
})

module.exports = router
