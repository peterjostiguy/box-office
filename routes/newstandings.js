var express = require('express');
var router = express.Router();
var GoogleSpreadsheet = require('google-spreadsheet')
var async = require('async')

var doc = new GoogleSpreadsheet('1L9DhmZlw1yNtk0O4mV0vTdEf92mz63AjTaN8_4BxmpU')
var sheet
var owners = {}

function updateOwnerObject(movieObject){
  if (owners[movieObject.owner]){
    owners[movieObject.owner].push(movieObject)
  }
  else {
    owners[movieObject.owner] = [movieObject]
  }
}

function updateHTML(cells){
  sheetData = []
  for (var i = 0; i < cells.length; i++) {
    if (i % 3 === 0) {
      var currentMovieObject = {}
      currentMovieObject.owner = cells[i].value
    }
    else if (i % 3 === 1){
      currentMovieObject.title = cells[i].value
    }
    else if (i % 3 === 2) {
      updateOwnerObject(currentMovieObject)
    }
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
    function workingWithCells(step) {
      sheet.getCells({
        'min-row': 2,
        //Hard Code last row
        'max-row': 97,
        'max-col': 3,
        'return-empty': true
      }, function(err, cells) {
        updateHTML(cells)
        step()
      })
    }
  ], function(err){
      if( err ) {
        console.log('Error: '+err)
      }
})

router.get('/', function(req, res, next){
  res.render('newstandings', {owners: owners})
})

module.exports = router;
