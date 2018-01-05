var express = require('express')
var router = express.Router()
var GoogleSpreadsheet = require('google-spreadsheet')
var async = require('async')
var admin = require('firebase-admin')
var serviceAccount = require("../firebase-boxoffice.json")
var ref = require('./firebase.js')

//Why isn't ownerArray populated the first time?
//Add league specificity
//Put free agents somewhere
//Display Release date if no total


var doc = new GoogleSpreadsheet('1L9DhmZlw1yNtk0O4mV0vTdEf92mz63AjTaN8_4BxmpU')
var sheet
var owners = {}
var currentOwner = {movies:[], ownerTotal: 0}
var userCode
var leaderArray = []

function updateOwnerObject(movieObject, userCode){
  if (movieObject.owner === userCode) {
    currentOwner.movies.push(movieObject)
    currentOwner.ownerTotal += Number(movieObject.total)
  }
  else if (owners[movieObject.owner]){
    owners[movieObject.owner].movies.push(movieObject)
  }
  else {
    owners[movieObject.owner] = {movies:[movieObject]}
  }
}

function updateHTML(cells, userCode){
  ownerArray = Object.keys(owners)
  currentOwner = {userName:userCode, movies:[], ownerTotal: 0}
  resetMovies(ownerArray)
  sheetData = []
  for (var i = 0; i < cells.length; i++) {
    if (i % 5 === 0) {
      var currentMovieObject = {}
      currentMovieObject.owner = cells[i].value
    }
    else if (i % 5 === 1){
      currentMovieObject.title = cells[i].value
    }
    else if (i % 5 === 2) {
      currentMovieObject.boughtFor = cells[i].value
    }
    else if (i % 5 === 3) {
      currentMovieObject.total = cells[i].value
    }
    else if (i % 5 === 4) {
      if (Number(cells[i].value)) {
        currentMovieObject.perDollar = Number(cells[i].value)
      }
      updateOwnerObject(currentMovieObject, userCode)
    }
  }
  calculateTotal(ownerArray)
  findLeader(owners, currentOwner, ownerArray)
}

function resetMovies(ownerArray){
  for (var i = 0; i < ownerArray.length; i++) {
    var ownerTotal = 0
    owners[ownerArray[i]].movies = []
  }
}

function calculateTotal(ownerArray){
  for (var i = 0; i < ownerArray.length; i++) {
    var ownerTotal = 0
    for (var j = 0; j < owners[ownerArray[i]].movies.length; j++) {
      ownerTotal += Number(owners[ownerArray[i]].movies[j].total)
    }
    owners[ownerArray[i]].ownerTotal = ownerTotal
  }
}

function findLeader(allOwners, currentOwner, ownerArray){
  leaderArray = []
  for (var i = 0; i < ownerArray.length; i++) {
    if (ownerArray[i] !== "") {
      var leaderObject = {
        username: ownerArray[i],
        total: (allOwners[ownerArray[i]].ownerTotal/1000000).toFixed(2)
      }
      leaderArray.push(leaderObject)
    }
  }
  var leaderObject = {
    username: currentOwner.userName,
    total: (currentOwner.ownerTotal/1000000).toFixed(2)
  }
  leaderArray.push(leaderObject)
  leaderArray.sort(function(a,b){
    return b.total - a.total
  })
}

function stringifyTotals(){
  currentOwner.ownerTotal = currentOwner.ownerTotal.toLocaleString()
  for (var i = 0; i < ownerArray.length; i++) {
    owners[ownerArray[i]].ownerTotal = owners[ownerArray[i]].ownerTotal.toLocaleString()
  }
}

router.get('/', function(req, res, next){
  if (req.cookies.userCode) {
    ref.once('value', function(snapshot){
      var users = snapshot.val().users
      userCode = users[req.cookies.userCode].username
    }).then(function(){
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
              'max-col': 5,
              'return-empty': true
            }, function(err, cells) {
              updateHTML(cells, userCode)
              step()
              stringifyTotals()
              res.render('newstandings', {owners: owners, currentUser: currentOwner, leaders: leaderArray})
            })
          }
        ], function(err){
        if( err ) {
          console.log('Error: '+err)
        }
      })
    })
  }
  else {
    res.redirect('/')
  }
})

module.exports = router
