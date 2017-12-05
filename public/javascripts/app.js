var movies = document.getElementsByClassName('draft-movie')
var currentMovieContainer = document.getElementById('current-movie')
var currentBidElement = document.getElementById('current-bid')
var bidButtons = document.getElementsByClassName('bid-button')

ref.once('value', function(snapshot){
  return snapshot.val()
})
.then(function(data){
  console.log(data);
})



for (var i = 0; i < movies.length; i++) {
  movies[i].addEventListener('click', selectMovie)
}

for (var i = 0; i < bidButtons.length; i++) {
  bidButtons[i].addEventListener('click', function(){
    bidItUp(this.id)
  })
}


function selectMovie(){
  currentMovieContainer.removeChild(currentMovieContainer.firstChild)
  currentMovieContainer.prepend(this)
  resetBid()
}

function resetBid(){
  var startingBid = prompt('whatchu want to bid?')
  currentBidElement.innerHTML = startingBid
}

function bidItUp(increase){
  currentBid = Number(currentBidElement.innerHTML)
  currentBid += Number(increase)
  currentBidElement.innerHTML = currentBid
}
