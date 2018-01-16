var express = require('express')
var router = express.Router()
var admin = require('firebase-admin')
var GoogleSpreadsheet = require('google-spreadsheet')
var async = require('async')
var serviceAccount = require("../firebase-boxoffice.json")
var ref = require('./firebase.js')

var db = admin.database()
var ref = db.ref()
var moviesRef = ref.child("movies")

router.post('/', function(req, res, next) {

  var doc = new GoogleSpreadsheet('1L9DhmZlw1yNtk0O4mV0vTdEf92mz63AjTaN8_4BxmpU')
  var sheet

  function sortMovies(cells){
    movieData = {}
    for (var i = 1; i < cells.length; i++) {
      if (i % 2 === 1) {
        movieData[cells[i].value] = {}
        movieData[cells[i].value].title = cells[i].value
        movieData[cells[i].value].releaseDate = cells[i - 1].value
      }
    }
    moviesRef.set(movieData)
  }

  async.series([
    function setAuth(step) {
      var creds = require('../google-generated-creds.json')
      doc.useServiceAccountAuth(creds, step)
    },
    function getInfoAndWorksheets(step) {
      doc.getInfo(function(err, info) {
        sheet = info.worksheets[0]
        step()
      })
    },
    function workingWithCells(step) {
      sheet.getCells({
        //Hard Code last row
        'min-row': 2,
        'max-row': 127,
        'min-col': 1,
        'max-col': 2,
        'return-empty': false
      }, function(err, cells) {
        sortMovies(cells)
        step();
      });
    }
  ], function(err){
      if( err ) {
        console.log('Error: '+err);
      }
  })
  res.redirect('/draft')
})

module.exports = router
