var express = require('express')
var router = express.Router()
var admin = require('firebase-admin')
var bcrypt = require('bcrypt')
var serviceAccount = require("../firebase-boxoffice.json")
var ref = require('./firebase.js')

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
