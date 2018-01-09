var saveSheetButton = document.getElementById('save-sheet')
var spreadsheetNumberInput = document.getElementById('spreadsheet-number')

saveSheetButton.addEventListener('click', function(){
  var spreadsheetNumber = spreadsheetNumberInput.value
  var draftRef = ref.child('draft')
  // var leagueRef = ref.child('leagues')
  draftRef.once('value')
  .then(function(snapshot){
    league = snapshot.val().league
    leagueRef = ref.child('leagues/'+league)
    leagueRef.once('value', function(snapshot){
      var leagueInfo = snapshot.val()
      leagueInfo.spreadsheetIndex = spreadsheetNumber
      leagueRef.set(leagueInfo)
      window.location.replace("/")
    })
  })
})
