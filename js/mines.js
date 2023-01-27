'use strict'

function setMines(board, pos) {
  for (let i = 0; i < gLevel.MINES;) {

    var randomI = getRandomInt(0, board.length)
    var randomJ = getRandomInt(0, board.length)

    if (randomI === pos.i && randomJ === pos.j) continue
    if (board[randomI][randomJ].isMine) continue

    board[randomI][randomJ].isMine = true
    i++
  }
}

function setMineByUser(elCell, i, j) {
  gLevel.MINES++
  gBoard[i][j].isMine = true
  renderCell(elCell.dataset, ICONS.MINE)
  document.querySelector('p').innerText = 'click on the same button when you are done'
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (!board[i][j].isMine) board[i][j].minesAroundCount = findNegs(board, i, j).filter(neg => board[neg.i][neg.j].isMine).length
    }
  }
}

function findHiddenMines() {
  var mines = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].isMine && !gBoard[i][j].isShown) mines.push(gBoard[i][j])
    }
  }

  return mines
}

function explodeMine(elCell){
  var boom = new Audio('audio/short-explosion.wav')
  elCell.classList.remove('covered')
  elCell.innerHTML = ICONS.EXPLOSION
  boom.play()
  elCell.classList.add('shown')

  setTimeout(()=>{
    elCell.innerHTML = ICONS.MINE
  },5000)
}

function showAllMines() {
  //findHiddenMines().forEach(mine => mine.isShown = true)
  var mines = []

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].isMine && !gBoard[i][j].isShown) mines.push({ i, j })
    }
  }

  var popInterval = setInterval(() => {
    var mine = mines.pop()
    var elCell = document.querySelector(`[data-i="${mine.i}"][data-j="${mine.j}"]`)
    explodeMine(elCell)
    
    if(!mines.length || gGame.isOn) clearInterval(popInterval) 
  }, 500)
}

function onExterminator() {
  var hiddenMines = findHiddenMines()
  var mines = []

  for (var i = 0; i < 3; i++) {
    if (!hiddenMines.length) break
    var mine = hiddenMines.splice(getRandomInt(0, hiddenMines.length), 1)[0]
    mine.isShown = true
    mines.push(mine)
    renderBoard(gBoard)
  }

  gLevel.MINES -= mines.length
  document.querySelector('.mines span').innerText = gLevel.MINES
  document.querySelector('p').innerText = mines.length + ' bombs destroyed'
  //did two fors so the user can see what happened
  gGame.isOn = false
  setTimeout(() => {
    for (var i = 0; i < mines.length; i++) {
      mines[i].isMine = false
      mines[i].isShown = false
    }
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true
  }, 1000)

}





