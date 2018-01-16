var saveSheetButton = document.getElementById('save-sheet')
var spreadsheetNumberInput = document.getElementById('spreadsheet-number')

saveSheetButton.addEventListener('click', function(){
  ref.child('draft/isOver').set(false)
  window.location.replace("/")
})
