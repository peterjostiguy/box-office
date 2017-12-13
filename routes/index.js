var express = require('express');
var router = express.Router();
// var axios = require('axios')
// var GoogleSpreadsheet = require('google-spreadsheet')
// var async = require('async')
//
// var doc = new GoogleSpreadsheet('1L9DhmZlw1yNtk0O4mV0vTdEf92mz63AjTaN8_4BxmpU')
// var sheet
// var currentObject = {}
//
// function updateTotal(movieTitle, totalCell){
//   console.log(movieTitle)
//   var url = 'http://www.theimdbapi.org/api/find/movie?title=justice_league'
//   axios.get(url)
//   .then(function(response){
//     totalCell.value = response.data[0].metadata.gross.slice(0, 12)
//     totalCell.save()
//   })
// }
//
// function updateHTML(cells){
//   sheetData = []
//   for (var i = 0; i < cells.length; i++) {
//     if (i % 7 === 1) {
//       currentObject.owner = cells[i].value
//     }
//     else if (i % 7 === 2){
//       currentObject.title = cells[i].value
//     }
//     else if (i % 7 === 3){
//       currentObject.total = cells[i].value
//     }
//     else if (i % 7 === 0) {
//       sheetData.push(currentObject)
//       currentObject = {}
//     }
//   }
//   colbyArray = sheetData.filter(function(cellValues){
//     return cellValues.owner === "Colby"
//   })
//   brianArray = sheetData.filter(function(cellValues){
//     return cellValues.owner === "Brian"
//   })
//   benArray = sheetData.filter(function(cellValues){
//     return cellValues.owner === "Ben"
//   })
//   peterArray = sheetData.filter(function(cellValues){
//     return cellValues.owner === "Peter"
//   })
//   joeArray = sheetData.filter(function(cellValues){
//     return cellValues.owner === "Joe"
//   })
//   tayArray = sheetData.filter(function(cellValues){
//     return cellValues.owner === "Tay"
//   })
//   erikArray = sheetData.filter(function(cellValues){
//     return cellValues.owner === "Erik"
//   })
//   ericArray = sheetData.filter(function(cellValues){
//     return cellValues.owner === "Eric D"
//   })
//   lizArray = sheetData.filter(function(cellValues){
//     return cellValues.owner === "Liz"
//   })
//   jordanArray = sheetData.filter(function(cellValues){
//     return cellValues.owner === "Jordan"
//   })
//   steveArray = sheetData.filter(function(cellValues){
//     return cellValues.owner === "Steve"
//   })
// }
//
// async.series([
//     function setAuth(step) {
//       var creds = require('../google-generated-creds.json')
//       doc.useServiceAccountAuth(creds, step);
//     },
//     function getInfoAndWorksheets(step) {
//       doc.getInfo(function(err, info) {
//         sheet = info.worksheets[2]
//         step()
//       })
//     },
//     function workingWithCells(step) {
//       var date = new Date().toString()
//       date = date.slice(0, 3)
//       switch (date) {
//         case "Mon":
//           min = 0
//           max = 100
//           break;
//         case "Tue":
//           min = 101
//           max = 200
//           break;
//         case "Wed":
//           min = 201
//           max = 300
//           break;
//         case "Thu":
//           min = 301
//           max = 400
//           break;
//         case "Fri":
//           min = 401
//           max = 500
//           break;
//         case "Sat":
//           min = 501
//           max = 650
//           break;
//         case "Sun":
//           min = 651
//           max = 875
//           break;
//       }
//       sheet.getCells({
//         'min-row': 2,
//         'max-row': 125,
//         'max-col': 7,
//         'return-empty': true
//       }, function(err, cells) {
//         updateHTML(cells)
//         //This needs work for when the list is still short
//         if (max > cells.length) {
//           max = cells.length
//         }
//         for (var i = min; i < max; i++) {
//           if (cells[i].value && i % 7 === 2) {
//             // updateTotal(cells[i].value, cells[i + 2])
//           }
//         }
//         step();
//       });
//     }
//   ], function(err){
//       if( err ) {
//         console.log('Error: '+err);
//       }
//       //Make this work for any team
//       var scoresArray = [colbyArray, joeArray, brianArray, lizArray, peterArray, tayArray, erikArray, ericArray, jordanArray, benArray, steveArray]
//       var sortedArray = scoresArray.sort(function(a,b){
//         var comp1 = Number(a[0].title.replace(/\D/g,''))
//         var comp2 = Number(b[0].title.replace(/\D/g,''))
//         return comp2 - comp1
//       })
//       pageData = {
//         movie: sheetData,
//         owners: sortedArray
//       }
// })


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {message: "Sign In Below"})
})

router.post('/', function(req, res, next) {
  res.send("hi")
})
module.exports = router;
