var express = require('express')
var router = express.Router()
var admin = require('firebase-admin')
var bcrypt = require('bcrypt')
var serviceAccount = require("../firebase-boxoffice.json")
var ref = require('./firebase.js')

// JorJor didn't show up in users right away
//if you hit cancel it breaks everythign

router.get('/', function(req, res, next) {
  if (req.cookies.userCode) {
    ref.once('value', function(snapshot){
      var data = snapshot.val()
      data = data.movies
      res.render('draft', {movies: data})
    })
  }
  else {
    res.redirect('/')
  }
})

module.exports = router
