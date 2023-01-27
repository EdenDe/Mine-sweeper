'use strict'

const ICONS = {
  FLAG: '<i class="fa fa-flag"></i>',
  EMPTY: ' ',
  MINE: '<div class="bombCandle">  <i class="fa fa-bomb"> </i> </div>',
  EXPLOSION: '<div class="bombCandle">  <i class="fa fa-bomb"> </i>   <div class="candle2__fire "></div></div>',
  HEART: '<i class="fa fa-heart"></i>',
  HINT: '<i onclick="onHintClick(this)" class="fa fa-lightbulb-o"></i>',
  NORMAL: '&#128512;',
  SUPRISED:'&#128558;',
  LOSE: '&#128557;',
  AWESOME: '&#128526;',
  PICKAXE: '<i> &#9935; </i>',
  DONE:'<i> &#10004; </i>'
}

var gStatesSave
var gBoard
var gGame
var gLevel = {
  SIZE: 4,
  MINES: 2,
  HEARTS: 3,
  HINTS: 3
}

function onInit() {
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    heartsUsed: 0,
    hintsUsed: 0,
    safeClicksLeft: 3,
    mode: "firstTurn",
  }

  gBoard = buildBoard(gLevel.SIZE)
  gGame.isOn = true
  renderBoard(gBoard)
  resetHeader()
  getTopScores()
  gStatesSave = {
    boards: [],
    games: []
  }
  toggleButtons(true)
}


function toggleButtons(value) {
  document.querySelector('.btnUndo').hidden = value
  document.querySelector('.btnSafeClick').disabled = value
  document.querySelector('.btnMegaHint').disabled = value
  document.querySelector('.btnExterminator').disabled = value
}

function resetHeader() {
  document.querySelector('.lives').innerHTML = ICONS.HEART.repeat(gLevel.HEARTS - gGame.heartsUsed)
  document.querySelector('.hints').innerHTML = ICONS.HINT.repeat(gLevel.HINTS - gGame.hintsUsed)
  document.querySelector('.smile span').innerHTML = ICONS.NORMAL
  document.querySelector('.btnSafeClick span').innerText = gGame.safeClicksLeft
  document.querySelector('.mines span').innerText = gLevel.MINES
}

function getTopScores() {
  getLocaleStorage()
  var showScores = false
  var strHTML = '<h2> Best scores </h2>'
  for (var score in gTopScores) {
    if (gTopScores[score] != null) {
      showScores = true
      strHTML += `<h3> ${score} : ${gTopScores[score]}</h3>`
    }
  }
  if(showScores) document.querySelector('.topScores').innerHTML = strHTML
 
}

function changeLevel(level, mines) {
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

function startTimer() {
  gTimer = setInterval(() => {
    document.querySelector('.timer span').innerText = gGame.secsPassed++
  }, 1000)
}


function saveStateGame() {
  var copyBoard = JSON.parse(JSON.stringify(gBoard))
  var copyGame = JSON.parse(JSON.stringify(gGame))
  gStatesSave.boards.push(copyBoard)
  gStatesSave.games.push(copyGame)
}

function toggleTheme() {
  document.querySelector(".sun-logo").classList.toggle("animate-sun");
  document.querySelector(".moon-logo").classList.toggle("animate-moon");
  document.querySelector("body").classList.toggle("dark");
}


