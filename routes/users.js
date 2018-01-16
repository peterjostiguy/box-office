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
  usersRef.once('value', function(snapshot){
    var data = snapshot.val()
    dataKeys = Object.keys(data)
    var dataValues = Object.values(data)
    var userExist = false
    for (var i = 0; i < dataValues.length; i++) {
      if (dataValues[i].username === req.body.username.toLowerCase()) {
        userExist = true
      }
    }
    if (userExist) {
      res.render('index', {message: "User Already Exists"})
    }
    else {
      bcrypt.hash(req.body.password, 10, function(err, hash){
        req.body.password = hash
        req.body.leagues = {exists: false}
        req.body.username = req.body.username.toLowerCase()
        usersRef.push().set(req.body)
        .then(function(){
          usersRef.once('value', function(snapshot){
            var data = snapshot.val()
            dataKeys = Object.keys(data)
            var dataValues = Object.values(data)
            var userExist = false
            for (var i = 0; i < dataValues.length; i++) {
              if (dataValues[i].username === req.body.username.toLowerCase()) {
                userExist = true
                var user = dataValues[i]
                var userCode = dataKeys[i]
                res.cookie('userCode', userCode)
                res.cookie('isAdmin', user.isAdmin)
                var url = '/users?user=' + userCode
                res.redirect(url)
              }
            }
          })
        })
      })
    }
  })
})

router.post('/signin', function(req, res, next){
  usersRef.once('value', function(snapshot){
    var data = snapshot.val()
    dataKeys = Object.keys(data)
    var dataValues = Object.values(data)
    var userExist = false
    for (var i = 0; i < dataValues.length; i++) {
      if (dataValues[i].username === req.body.username.toLowerCase()) {
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
    usersRef.once('value')
    .then(function(snapshot){
      var usersLeagues = Object.values(snapshot.val()[req.cookies.userCode].leagues)
      var username = snapshot.val()[req.cookies.userCode].username
      if (req.cookies.isAdmin === 'true') {
        res.render('users', {leagues: usersLeagues, username: username, admin: true})
      }
      else {
        res.render('users', {leagues: usersLeagues, username: username})
      }
    })
  }
  else {
    res.redirect('/')
  }
})

router.get('/donezo/:league', function(req, res, next){
  ref.once('value')
  .then(function(snapshot){
    sheetIndex = snapshot.val().leagues[req.params.league].spreadsheetIndex
    usernameDB = snapshot.val().users
  })
  .then(function(){
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
            sheet = info.worksheets[sheetIndex]
            step()
          })
        },
        function workingWithCells(step){
          console.log(movieDB.length)
          sheet.getCells({
            'min-row': 2,
            'max-row': 15,
            'max-col': 3,
            'return-empty': true
          }, function(err, cells) {
            for (var i = 0; i < cells.length; i++) {
              currentMovie = movieDB[Math.floor(i/3)]
              console.log(currentMovie)
              if (i%3 === 0) {
                if (currentMovie.owner) {
                  cells[i].value = usernameDB[currentMovie.owner].username
                }
              }
              else if (i%3 === 1) {
                cells[i].value = currentMovie.boughtFor
              }
              else if (i%3 === 2) {
                cells[i].value = currentMovie.title
              }
              cells[i].save()
            }
            step()
          })
        },
        function workingWithCells1(step){
          sheet.getCells({
            'min-row': 16,
            'max-row': 30,
            'max-col': 3,
            'return-empty': true
          }, function(err, cells) {
            console.log("NEW LINE");
            for (var i = 0; i < cells.length; i++) {
              currentMovie = movieDB[Math.floor((i+42)/3)]
              console.log(currentMovie)
              if (i%3 === 0) {
                if (currentMovie.owner) {
                  cells[i].value = usernameDB[currentMovie.owner].username
                }
              }
              else if (i%3 === 1) {
                cells[i].value = currentMovie.boughtFor
              }
              else if (i%3 === 2) {
                cells[i].value = currentMovie.title
              }
              cells[i].save()
            }
            step()
          })
        },
        function workingWithCells2(step){
          sheet.getCells({
            'min-row':31,
            'max-row':45,
            'max-col': 3,
            'return-empty': true
          }, function(err, cells) {
            console.log("NEW LINE");
            for (var i = 0; i < cells.length; i++) {
              currentMovie = movieDB[Math.floor((i+87)/3)]
              console.log(currentMovie);
              if (i%3 === 0) {
                if (currentMovie.owner) {
                  cells[i].value = usernameDB[currentMovie.owner].username
                }
              }
              else if (i%3 === 1) {
                cells[i].value = currentMovie.boughtFor
              }
              else if (i%3 === 2) {
                cells[i].value = currentMovie.title
              }
              cells[i].save()
            }
            step()
          })
        },
        function workingWithCells2(step){
          sheet.getCells({
            'min-row':46,
            'max-row':60,
            'max-col': 3,
            'return-empty': true
          }, function(err, cells) {
            console.log("NEW LINE");
            for (var i = 0; i < cells.length; i++) {
              currentMovie = movieDB[Math.floor((i+132)/3)]
              console.log(currentMovie);
              if (i%3 === 0) {
                if (currentMovie.owner) {
                  cells[i].value = usernameDB[currentMovie.owner].username
                }
              }
              else if (i%3 === 1) {
                cells[i].value = currentMovie.boughtFor
              }
              else if (i%3 === 2) {
                cells[i].value = currentMovie.title
              }
              cells[i].save()
            }
            step()
          })
        },
        function workingWithCells2(step){
          sheet.getCells({
            'min-row':61,
            'max-row':75,
            'max-col': 3,
            'return-empty': true
          }, function(err, cells) {
            console.log("NEW LINE");
            //change i to row*3 to populate lower bits
            for (var i = 0; i < cells.length; i++) {
              currentMovie = movieDB[Math.floor((i+177)/3)]
              console.log(currentMovie);
              if (i%3 === 0) {
                if (currentMovie.owner) {
                  cells[i].value = usernameDB[currentMovie.owner].username
                }
              }
              else if (i%3 === 1) {
                cells[i].value = currentMovie.boughtFor
              }
              else if (i%3 === 2) {
                cells[i].value = currentMovie.title
              }
              cells[i].save()
            }
            step()
          })
        },
        function workingWithCells2(step){
          sheet.getCells({
            'min-row':76,
            'max-row':90,
            'max-col': 3,
            'return-empty': true
          }, function(err, cells) {
            //change i to row*3 to populate lower bits
            for (var i = 0; i < cells.length; i++) {
              currentMovie = movieDB[Math.floor((i+222)/3)]
                            console.log(currentMovie);
              if (i%3 === 0) {
                if (currentMovie.owner) {
                  cells[i].value = usernameDB[currentMovie.owner].username
                }
              }
              else if (i%3 === 1) {
                cells[i].value = currentMovie.boughtFor
              }
              else if (i%3 === 2) {
                cells[i].value = currentMovie.title
              }
              cells[i].save()
            }
            step()
          })
        },
        function workingWithCells2(step){
          sheet.getCells({
            'min-row':91,
            'max-row':105,
            'max-col': 3,
            'return-empty': true
          }, function(err, cells) {
            //change i to row*3 to populate lower bits
            for (var i = 0; i < cells.length; i++) {
              currentMovie = movieDB[Math.floor((i+267)/3)]
                            console.log(currentMovie);
              if (i%3 === 0) {
                if (currentMovie.owner) {
                  cells[i].value = usernameDB[currentMovie.owner].username
                }
              }
              else if (i%3 === 1) {
                cells[i].value = currentMovie.boughtFor
              }
              else if (i%3 === 2) {
                cells[i].value = currentMovie.title
              }
              cells[i].save()
            }
            step()
          })
        },
        function workingWithCells2(step){
          sheet.getCells({
            'min-row':106,
            'max-row':127,
            'max-col': 3,
            'return-empty': true
          }, function(err, cells) {
            //change i to row*3 to populate lower bits
            for (var i = 0; i < cells.length; i++) {
              currentMovie = movieDB[Math.floor((i+312)/3)]
                            console.log(currentMovie);
              if (i%3 === 0) {
                if (currentMovie.owner) {
                  cells[i].value = usernameDB[currentMovie.owner].username
                }
              }
              else if (i%3 === 1) {
                cells[i].value = currentMovie.boughtFor
              }
              else if (i%3 === 2) {
                cells[i].value = currentMovie.title
              }
              cells[i].save()
            }
            step()
          })
        }
      ])
    })
    if (req.cookies.isAdmin === 'true') {
      console.log("did this");
      res.render('done', {user: true})
    }
    else {
      console.log("did that");
      res.render('done')
    }
  })
})

module.exports = router
