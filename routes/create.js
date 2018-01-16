var express = require('express')
var router = express.Router()
var admin = require('firebase-admin')
var GoogleSpreadsheet = require('google-spreadsheet')
var async = require('async')
var serviceAccount = require("../firebase-boxoffice.json")
var ref = require('./firebase.js')

var doc = new GoogleSpreadsheet('1L9DhmZlw1yNtk0O4mV0vTdEf92mz63AjTaN8_4BxmpU')

router.post('/', function(req, res, next) {
  console.log(req.body)

  if (req.cookies.userCode) {
    async.series([
        function setAuth(step) {
          var creds = require('../google-generated-creds.json')
          doc.useServiceAccountAuth(creds, step);
        },
        function getInfoAndWorksheets(step) {
          doc.getInfo(function(err, info) {
            step()
          })
        },
        function managingSheets(step) {
            doc.addWorksheet({
              title: req.body.leagueName
            }, function(err, sheet) {
              sheet.setHeaderRow(['Owner', 'Bought For', 'Movie', 'Total', 'Millions Per Dollar', 'Per Dollar'])
              step()
            });
          }
      ], function(err){
      if( err ) {
        console.log('Error: '+err)
      }
    })
    res.redirect('/')
  }
  else {
    res.redirect('/')
  }
})

module.exports = router
