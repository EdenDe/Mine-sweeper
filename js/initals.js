const FLAG = '<i class="fa fa-flag"></i>'
const EMPTY = ' '
const HEART = '<i class="fa fa-heart"></i>'
const HINT = '<i onclick="onHintClick(this)" class="fa fa-lightbulb-o"></i>'
const NORMAL = '&#128512;'
const LOSE = '&#128557;'
const AWESOME = '&#128526;'

var gStatesSave = []
var gBoard
var gLevel = {
  SIZE: 4,
  MINES: 2,
  HEARTS: 3,
  HINTS: 3
}

var gGame 
var gFirstTurn

function onInit() {
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    heartsUsed: 0,
    hintsUsed:0,
    safeClicksLeft: 3,
    hintMode: false,
    userMinesMode: false
  }
  gFirstTurn = true
  gBoard = buildBoard(gLevel.SIZE)
  renderBoard(gBoard)
  resetHeader()
  getTopScores()
  gStatesSave = []
  gGame.isOn = true
  saveStateGame(gBoard)
}

function resetHeader(lives= gLevel.HEARTS, hints =gLevel.HINTS) {
  document.querySelector('.lives').innerHTML = HEART.repeat(lives)
  document.querySelector('.hints').innerHTML = HINT.repeat(hints)
  document.querySelector('.smile span').innerHTML = NORMAL
}

function getTopScores(){
  getLocaleStorage()
  var strHTML = '<h2> Best scores </h2>'
  for(var score in gTopScores){
    if(gTopScores[score]!= null) strHTML+= `<h3> ${score} : ${gTopScores[score]}</h3> `
  }
  document.querySelector('.topScores').innerHTML = strHTML
}

function changeLevel(level,mines) {
  gLevel.SIZE = level
  gLevel.MINES = mines
  onInit()
}


function buildBoard(size) {
  var board = []
  for (var i = 0; i < size; i++) {
    board[i] = []
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
      }
    }
  }

  return board
}

function startTimer(){
  gTimer = setInterval(() => {
    document.querySelector('.timer span').innerText = gGame.secsPassed++
  }, 1000)
}


function saveStateGame(board){
  gStatesSave.push({
    board: [...board],
    game: gGame
  })
}



