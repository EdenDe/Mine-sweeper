'use strict'

var gTopScores = {
  'Beginner':null,
  'Medium':null,
  'Expert':null
}

function getLocaleStorage() {
  var scores = localStorage.getItem("bestScores")
  if (scores === undefined) return
  gTopScores = JSON.parse(scores)
}


function setLocalStorage() {
  localStorage.setItem("bestScores", JSON.stringify(gTopScores))
}

function checkIfTopScore() {
  var lvlStr = 'Beginner'

  if (gLevel.SIZE === 8) lvlStr = 'Medium'
  else if (gLevel.SIZE === 12) lvlStr = 'Expert'

  if(gGame.secsPassed < gTopScores[lvlStr] || gTopScores[lvlStr] === null){
    gTopScores[lvlStr] = gGame.secsPassed
    setLocalStorage()
  }
}