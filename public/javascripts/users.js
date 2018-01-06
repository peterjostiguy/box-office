var joinButton = document.getElementById('join-league-button')
var leagueDropDown = document.getElementById('league-drop-down')
var clickToJoin = document.getElementById('click-to-join')

var currentUser
var currentUserIsAdmin
var currentUserLeagues

for (var i = 0; i < document.cookie.length; i++) {
  if (document.cookie[i] === '=' && document.cookie[i-1] === 'e'){
    var beginSlice = (i+1)
  }
  else if (document.cookie[i] === ';' && beginSlice) {
    var endSlice = i
    currentUser = document.cookie.slice(beginSlice, endSlice)
    break
  }
  else if (i === document.cookie.length - 1){
    var endSlice = document.cookie.length
  }
  currentUser = document.cookie.slice(beginSlice, endSlice)
}

for (var i = 0; i < document.cookie.length; i++) {
  if (document.cookie[i-1] === 'n'){
    var beginAdminSlice = (i+1)
  }
  else if (document.cookie[i] === ';' && beginAdminSlice) {
    var endAdminSlice = i
    currentUserIsAdmin = document.cookie.slice(beginAdminSlice, endAdminSlice)
    break
  }
  else if (i === document.cookie.length - 1){
    var endAdminSlice = document.cookie.length
  }
  currentUserIsAdmin = document.cookie.slice(beginAdminSlice, endAdminSlice)
}

var currentLeagueDB = firebase.database().ref('leagues')
var currentUserDB = firebase.database().ref('users/' + currentUser)

getUsersLeagues()

function getLeagues(){
  currentLeagueDB.once('value')
  .then(function(snapshot){
    var leagueArray = Object.keys(snapshot.val())
    for (var i = 0; i < leagueArray.length; i++) {
      for (var j = 0; j < currentUserLeagues.length; j++) {
        if (currentUserLeagues[j] === leagueArray[i]) {
          break
        }
        else if (currentUserLeagues[j] !== leagueArray[i] && j === currentUserLeagues.length-1) {
          var leagueToAdd = document.createElement('option')
          leagueToAdd.innerHTML = leagueArray[i]
          leagueDropDown.appendChild(leagueToAdd)
        }
      }
    }
    showJoinElements()
  })
}

function getUsersLeagues(){
  currentUserDB.once('value')
  .then(function(snapshot){
    currentUserLeagues = Object.values(snapshot.val().leagues)
  })
}

function showJoinElements(){
  leagueDropDown.style.display = 'inline'
  clickToJoin.style.display = 'inline'
}

function hideJoinElements(){
  leagueDropDown.style.display = 'none'
  clickToJoin.style.display = 'none'
  joinButton.style.display = 'none'
}

function joinLeague(){
  if (leagueDropDown.value) {
    currentUserDB.child("leagues").push().set(leagueDropDown.value)
    currentLeagueDB.child(leagueDropDown.value).push().set(currentUser)
    hideJoinElements()
  }
}

joinButton.addEventListener('click', getLeagues)
clickToJoin.addEventListener('click', joinLeague)
