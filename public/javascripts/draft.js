var movies = document.getElementsByClassName('draft-movie')
var currentMovieContainer = document.getElementById('current-movie')
var bidButtons = document.getElementsByClassName('bid-button')
var endBiddingButton = document.getElementById('end-bid-button')
var currentTitle = document.getElementById('current-title')
var currentReleaseDate = document.getElementById('current-release-date')
var currentBidderElement = document.getElementById('current-bidder')
var currentBidElement = document.getElementById('current-bid')
var theWholeDamnPage = document.getElementById('the-whole-damn-page')
var waitingMessage = document.getElementById('waiting-message')
var startButton = document.getElementById('start-button')
var nextUserElement = document.getElementById('next-user')

//Globar Variables
var movieDatabase
var userDatabase
var currentBidTitle
var currentBidReleaseDate
var currentBid
var draftIsActive
var currentUser
var currentUserIndex = 0
var nextUser
var timeleft = 10



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

if (currentUserIsAdmin === "true") {
  endBiddingButton.style.display = 'inline'
}

ref.once('value')
.then(function(snapshot){
  movieDatabase = snapshot.val().movies
  userDatabase = snapshot.val().users
  userKeyArray = []
  for (var userKey in userDatabase) {
    if (userDatabase.hasOwnProperty(userKey)) {
      userKeyArray.push(userKey)
    }
  }
  console.log(userKeyArray);
})

var draftIsActiveDB = firebase.database().ref('draft')
draftIsActiveDB.on('value', function(snapshot) {
  draftIsActive = snapshot.val().isActive
  if (!draftIsActive) {
    theWholeDamnPage.style.display = 'none'
    waitingMessage.style.display = 'default'
    if (currentUserIsAdmin === "true") {
      startButton.style.display = 'inline'
    }
  }
  else {
    theWholeDamnPage.style.display = 'inline'
    waitingMessage.style.display = 'none'
    startButton.style.display = 'none'
  }
})

var timerDB = firebase.database().ref('currentTimer')
timerDB.on('value', function(snapshot) {
  var timeleftDB = snapshot.val().timeLeft
  console.log(timeleftDB)
  document.getElementById('countdown-timer').innerHTML = timeleft
  if (timeleftDB <= 0) {
    document.getElementById('countdown-timer').innerHTML = "Gone"
  }
  else if (timeleftDB <= 3) {
    document.getElementById('countdown-timer').innerHTML = "GOING..."
  }
  else if (timeleftDB <= 5){
    document.getElementById('countdown-timer').innerHTML = "Going..."
  }
})


//Remove movies from display if (!owner)
//which means displaying movies from DB, instead of sheet

//Have to delete CurrentBidder from DB before draft starts


//endBidding on a timer instead of a button?

//subtract bid amount from user total
//display all users totals

var currentBidDB = firebase.database().ref('currentBidder')
currentBidDB.on('value', function(snapshot) {
  var currentBidStatus = snapshot.val()
  if (currentBidStatus) {
    currentBidTitle = currentBidStatus.title
    currentTitle.innerHTML = "Current Movie:    " + currentBidTitle
    currentBidReleaseDate = currentBidStatus.releaseDate
    currentReleaseDate.innerHTML = currentBidReleaseDate
    currentBidElement.innerHTML = currentBidStatus.currentBid
    if (userDatabase && currentBidStatus.username) {
      currentBidderElement.innerHTML = "Current Bidder:    " + userDatabase[currentBidStatus.username].username
    }
    else if (userDatabase && !currentBidStatus.username){
      currentBidderElement.innerHTML = currentBidderElement.innerHTML + "  won!"
    }
  }
  if (currentBidStatus.next) {
    nextUserElement.innerHTML = userDatabase[currentBidStatus.next].username + " is up next!"
  }
  else {
    nextUserElement.innerHTML = ""
  }
})

//Add event listeners

startButton.addEventListener('click', function(){
  firebase.database().ref('/draft').set({
    isActive: true
  })
  nextUser = userDatabase[userKeyArray[currentUserIndex]].username
})

endBiddingButton.addEventListener('click', function(){
  endBidding()
})

for (var i = 0; i < movies.length; i++) {
  movies[i].addEventListener('click', selectMovie)
}

for (var i = 0; i < bidButtons.length; i++) {
  bidButtons[i].addEventListener('click', function(){
    bidItUp(this.id)
  })
}

//functions
function selectMovie(){

  currentBidTitle = this.childNodes[3].innerHTML
  currentBidReleaseDate = this.childNodes[1].childNodes[3].innerHTML
  // timeleft = 10
  for (var i = 0; i < bidButtons.length; i++) {
    bidButtons[i].style.display = 'inline'
  }
  var bidTimer = setInterval(function(){
    console.log(timeleft)
    timeleft --
    firebase.database().ref('currentTimer/').set({
      timeLeft: timeleft
    })
    if (timeleft <= 0) {
      clearInterval(bidTimer)
      endBidding()
    }
  }, 1000)
  this.remove()
  resetBid()
}

function resetBid(){
  var startingBid = prompt('whatchu want to bid?')
  currentBid = Number(startingBid)
  updateCurrentBid()
}

function bidItUp(increase){
  currentBid = Number(currentBidElement.innerHTML)
  currentBid += Number(increase)
  timeleft = 10
  console.log(timeleft)
  updateCurrentBid()
}

function updateCurrentBid(){
  var currentBidder = currentUser
  firebase.database().ref('currentBidder/').set({
    username: currentBidder,
    currentBid: currentBid,
    title: currentBidTitle,
    releaseDate: currentBidReleaseDate,
    next: ""
  })
}

function endBidding(){
  currentUserIndex ++
  if (currentUserIndex >= userKeyArray.length) {
    currentUserIndex = 0
  }
  ref.once('value')
  .then(function(snapshot){
    var winningBidder = snapshot.val().currentBidder
    return winningBidder
  })
  .then(function(winningBid){
    firebase.database().ref('movies/' + currentBidTitle).set({
      title: currentBidTitle,
      releaseDate: movieDatabase[currentBidTitle].releaseDate,
      owner: winningBid.username,
      boughtFor: currentBid
    })
    firebase.database().ref('currentBidder/').set({
      username: "",
      currentBid: "",
      title: "",
      releaseDate: "",
      next: userKeyArray[currentUserIndex]
    })
    ref.once('value')
    .then(function(snapshot){
      var nextSelecter = snapshot.val().currentBidder
      console.log("next", nextSelecter.next, userDatabase[nextSelecter.next].username)
    })
  })
}
