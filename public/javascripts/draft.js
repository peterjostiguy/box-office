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
var dollarsLeftElement = document.getElementById('current-user-dollars')
var moviesOwnedElement = document.getElementById('current-user-movies-owned')
var allMoviesDiv = document.getElementById('all-movies')
var allUserTotalDiv = document.getElementById('all-user-total')
var selectLeague = document.getElementById('select-league')

//Global Variables
var movieDatabase
var userDatabase
var currentBidTitle
var currentBidReleaseDate
var currentBid
var draftIsActive
var currentUser
var nextUser

//endBidding on a timer instead of a button?
//movie poster?


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
  var leagues = Object.keys(snapshot.val().leagues)
  for (var i = 0; i < leagues.length; i++) {
    var leagueToAdd = document.createElement('option')
    leagueToAdd.innerHTML = leagues[i]
    selectLeague.appendChild(leagueToAdd)
  }
})

function updateUserTotalHTML(userObject){
  while (allUserTotalDiv.firstChild) {
    allUserTotalDiv.removeChild(allUserTotalDiv.firstChild);
}
  for (var i = 0; i < userKeyArray.length; i++) {
    var userTotalDiv = document.createElement('div')
    userTotalDiv.classList.add('user-total')
    var userTotalName = document.createElement('h4')
    userTotalName.innerHTML = userDatabase[userKeyArray[i]].username
    userTotalDiv.appendChild(userTotalName)
    userTotalDiv.style.margin = ''
    var userTotalTotal = document.createElement('p')
    userTotalTotal.innerHTML = userObject[userKeyArray[i]].dollarsLeft
    userTotalDiv.appendChild(userTotalTotal)
    allUserTotalDiv.appendChild(userTotalDiv)
    var userMovieList = document.createElement('div')
    userMovieList.classList.add('user-movie-list')
    for (var j = 0; j < updatedOwnedMovies.length; j++) {
      if (updatedOwnedMovies[j].owner === userKeyArray[i]) {
        var movieHTMLToAdd = document.createElement('p')
        movieHTMLToAdd.innerHTML = updatedOwnedMovies[j].title
        userMovieList.appendChild(movieHTMLToAdd)
      }
    }
    userTotalDiv.appendChild(userMovieList)
  }
}

function updateMovieHTML(moviesArray){
  while (allMoviesDiv.firstChild) {
    allMoviesDiv.removeChild(allMoviesDiv.firstChild);
}
  for (var i = 0; i < moviesArray.length; i++) {
    var movieDiv = document.createElement('div')
    movieDiv.classList.add('draft-movie')
    movieDiv.addEventListener('click', selectMovie)
    var movieTitle = document.createElement('h4')
    movieTitle.innerHTML = moviesArray[i].title
    movieDiv.appendChild(movieTitle)
    var movieReleaseDate = document.createElement('p')
    movieReleaseDate.innerHTML = moviesArray[i].releaseDate
    movieDiv.appendChild(movieReleaseDate)
    allMoviesDiv.appendChild(movieDiv)
  }
}

function updateMovieList(){
  ref.once('value')
  .then(function(snapshot){
    movieDatabase = snapshot.val().movies
    updatedMovieDB = []
    for (var movie in movieDatabase) {
      if (movieDatabase.hasOwnProperty(movie)) {
        updatedMovieDB.push(movieDatabase[movie])
      }
    }
    updatedUnownedMovieDB = updatedMovieDB.filter(function(movie){
      return !movie.owner
    })
    updatedOwnedMovies = updatedMovieDB.filter(function(movie){
      return movie.owner
    })
    updateMovieHTML(updatedUnownedMovieDB)
  })
}

var draftIsActiveDB = firebase.database().ref('draft')
draftIsActiveDB.on('value', function(snapshot) {
  draftIsActive = snapshot.val().isActive
  draftIsOver = snapshot.val().isOver
  if (!draftIsActive) {
    theWholeDamnPage.style.display = 'none'
    waitingMessage.style.display = 'default'
    if (currentUserIsAdmin === "true") {
      selectLeague.style.display = 'inline'
      startButton.style.display = 'inline'
    }
  }
  else {
    ref.once('value')
    .then(function(snapshot){
      movieDatabase = snapshot.val().movies
      updatedMovieDB = []
      for (var movie in movieDatabase) {
        if (movieDatabase.hasOwnProperty(movie)) {
          updatedMovieDB.push(movieDatabase[movie])
        }
      }
      updatedUnownedMovieDB = updatedMovieDB.filter(function(movie){
        return !movie.owner
      })
      updatedOwnedMovies = updatedMovieDB.filter(function(movie){
        return movie.owner
      })
      userDatabase = snapshot.val().users
      userKeyArray = Object.values(snapshot.val().leagues[selectLeague.value])
    }).then(function(){
      theWholeDamnPage.style.display = 'inline'
      waitingMessage.style.display = 'none'
      startButton.style.display = 'none'
      selectLeague.style.display = 'none'
      draftIsActiveDB.once('value')
      .then(function(snapshot){
        var currentDraftInfo = snapshot.val()
        dollarsLeftElement.innerHTML = currentDraftInfo.users[currentUser].dollarsLeft
        moviesOwnedElement.innerHTML = "Movies Owned: " + currentDraftInfo.users[currentUser].moviesOwned
        //Can remove bid buttons
        if (currentDraftInfo.users[currentUser].moviesOwned >= 10) {
          for (var i = 0; i < bidButtons.length; i++) {
            bidButtons[i].style.display = 'none'
          }
        }
        updateUserTotalHTML(snapshot.val().users)
      })
    })
  }
  if (draftIsOver) {
    window.location.replace("users/donezo")
  }
})

function checkIfActive(){
  firebase.database().ref('/draft/users/' + userKeyArray[currentUserIndex]).once('value')
  .then(function(snapshot){
    if (snapshot.val().dollarsLeft <= 0 || snapshot.val().moviesOwned >= 10) {
      currentUserIndex ++
      if (currentUserIndex >= userKeyArray.length) {
        currentUserIndex = 0
      }
      counter ++
      if (counter > userKeyArray.length) {
        firebase.database().ref('/draft/isActive').set(false)
        firebase.database().ref('/draft/isOver').set(true)
      }
      else {
        checkIfActive()
      }
    }
  })
}

var currentBidDB = firebase.database().ref('currentBidder')
currentBidDB.on('value', function(snapshot) {
  var currentBidStatus = snapshot.val()
  if (currentBidStatus) {
    currentUserIndex = currentBidStatus.currentUserIndex
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
  var moviesOwned = moviesOwnedElement.innerHTML.slice(moviesOwnedElement.innerHTML.length - 2)
  if (currentBidStatus.title && Number(moviesOwned) < 10 ) {
    for (var i = 0; i < bidButtons.length; i++) {
      bidButtons[i].style.display = 'inline'
    }
  }
  else {
    for (var i = 0; i < bidButtons.length; i++) {
      bidButtons[i].style.display = 'none'
    }
  }
})

var nextBidderDB = firebase.database().ref('currentBidder/next')
nextBidderDB.on('value', function(snapshot) {
  var nextSelector = snapshot.val()
  var allMovies = document.getElementById('all-movies')
  if (currentUser === nextSelector) {
    updateMovieList()
    allMovies.style.display = 'flex'
    allMovies.style['flex-wrap'] = 'wrap'
  }
  else {
    allMovies.style.display = 'none'
  }
})
//Add event listeners

startButton.addEventListener('click', function(){
  ref.once('value')
  .then(function(snapshot){
    movieDatabase = snapshot.val().movies
    updatedMovieDB = []
    for (var movie in movieDatabase) {
      if (movieDatabase.hasOwnProperty(movie)) {
        updatedMovieDB.push(movieDatabase[movie])
      }
    }
    updatedUnownedMovieDB = updatedMovieDB.filter(function(movie){
      return !movie.owner
    })
    updatedOwnedMovies = updatedMovieDB.filter(function(movie){
      return movie.owner
    })

    userDatabase = snapshot.val().users
    userKeyArray = Object.values(snapshot.val().leagues[selectLeague.value])

    // for (var userKey in userDatabase) {
    //   if (userDatabase.hasOwnProperty(userKey)) {
    //     userKeyArray.push(userKey)
    //   }
    // }
    // console.log(userKeyArray)
  }).then(function(){
    updateMovieHTML(updatedUnownedMovieDB)
    var userObject = {}
    for (var i = 0; i < userKeyArray.length; i++) {
      userObject[userKeyArray[i]] = {
        dollarsLeft: 200,
        moviesOwned: 0
      }
    }
    firebase.database().ref('/draft').set({
      isActive: true,
      isOver: false,
      users: userObject
    })
    currentUserIndex = 0
    nextUser = userDatabase[userKeyArray[currentUserIndex]].username
    firebase.database().ref('currentBidder/').set({
      username: "",
      currentBid: "",
      title: "",
      releaseDate: "",
      next: userKeyArray[currentUserIndex],
      currentUserIndex: currentUserIndex
    })
  })
})

endBiddingButton.addEventListener('click', function(){
  endBidding()
})

for (var i = 0; i < bidButtons.length; i++) {
  bidButtons[i].addEventListener('click', function(){
    bidItUp(this.id)
  })
}

//functions

//I don't think selectMovie() is necessary- just call resetBid
function selectMovie(){
  currentBidTitle = this.childNodes[0].innerHTML
  currentBidReleaseDate = this.childNodes[1].innerHTML
  for (var i = 0; i < bidButtons.length; i++) {
    bidButtons[i].style.display = 'inline'
  }
  resetBid()
}

function resetBid(){
  ref.once('value')
  .then(function(snapshot){
    currentUserIndex = snapshot.val().currentBidder.currentUserIndex
  })
  currentBid = prompt('whatchu want to bid?')
  if (currentBid){
    if (Number(currentBid) > Number(dollarsLeftElement.innerHTML)) {
      currentBid = prompt('Nice try you broke bitch')
    }
    else {
      updateCurrentBid(currentBid)
    }
  }
}

function bidItUp(increase){
  currentBid = Number(currentBidElement.innerHTML)
  currentBid += Number(increase)
  if (Number(dollarsLeftElement.innerHTML) < Number(currentBid)) {
    alert('Ya broke, bitch!')
  }
  else if (Number(moviesOwnedElement.innerHTML) >= 10 ) {
    alert('10 is plenty. Give it a rest.')
  }
  else {
    updateCurrentBid(currentBid)
  }
}

function updateCurrentBid(mostRecentNumber){
  var currentBidder = currentUser
  firebase.database().ref('currentBidder/').set({
    username: currentBidder,
    currentBid: mostRecentNumber,
    title: currentBidTitle,
    releaseDate: currentBidReleaseDate,
    next: "",
    currentUserIndex: currentUserIndex
  })
}

function endBidding(){
  ref.once('value')
  .then(function(snapshot){
    var winningBidder = snapshot.val().currentBidder
    return winningBidder
    currentUserIndex = snapshot.val().currentBidder.currentUserIndex
  })
  .then(function(winningBid){
    firebase.database().ref('movies/' + currentBidTitle).set({
      title: currentBidTitle,
      releaseDate: movieDatabase[currentBidTitle].releaseDate,
      owner: winningBid.username,
      boughtFor: winningBid.currentBid
    })
    currentUserIndex ++
    if (currentUserIndex >= userKeyArray.length) {
      currentUserIndex = 0
    }
    firebase.database().ref('/draft/users/' + winningBid.username).once('value')
    .then(function(snapshot){
      return snapshot.val()
    }).then(function(winningBidderStatus){
      firebase.database().ref('/draft/users/' + winningBid.username).set({
        dollarsLeft: winningBidderStatus.dollarsLeft - winningBid.currentBid,
        moviesOwned: winningBidderStatus.moviesOwned + 1
      })
      counter = 0
    })
    .then(checkIfActive)
    .then(function(){
      firebase.database().ref('currentBidder/').set({
        username: "",
        currentBid: "",
        title: "",
        releaseDate: "",
        next: userKeyArray[currentUserIndex],
        currentUserIndex: currentUserIndex
      })
    })
    .then(function(){
      ref.once('value')
      .then(function(snapshot){
        var nextSelector = snapshot.val().currentBidder
      })
    })
  })
}
