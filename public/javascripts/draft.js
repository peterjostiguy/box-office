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

//Globar Variables
var movieDatabase
var userDatabase
var currentBidTitle
var currentBidReleaseDate
var currentBid
var draftIsActive
var currentUser = document.cookie.slice(9)
var currentUserIsAdmin = document.cookie.slice((document.cookie.length - 4))


ref.once('value')
.then(function(snapshot){
  movieDatabase = snapshot.val().movies
  userDatabase = snapshot.val().users
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
    console.log("SHIT SHOULD CHANGE");
    theWholeDamnPage.style.display = 'inline'
    waitingMessage.style.display = 'none'
    startButton.style.display = 'none'
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
    currentTitle.innerHTML = currentBidTitle
    currentBidReleaseDate = currentBidStatus.releaseDate
    currentReleaseDate.innerHTML = currentBidReleaseDate
    currentBidElement.innerHTML = currentBidStatus.currentBid
    if (userDatabase) {
      currentBidderElement.innerHTML = userDatabase[currentBidStatus.username].username
    }
  }
})

//Add event listeners

startButton.addEventListener('click', function(){
  console.log("clicked")
  firebase.database().ref('/draft').set({
    isActive: true
  })
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
  updateCurrentBid()
}

function updateCurrentBid(){
  console.log(currentBidTitle)
  console.log(currentBidReleaseDate)
  var currentBidder = document.cookie.slice(9)

  firebase.database().ref('currentBidder/').set({
    username: currentBidder,
    currentBid: currentBid,
    title: currentBidTitle,
    releaseDate: currentBidReleaseDate
  })
}

function endBidding(){
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
  })

}
