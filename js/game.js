var gTimer


function onHintClick(elBolb) {
  elBolb.style.color = '#948228'
  elBolb.style.fontSize = '40px'
  elBolb.classList.add('hintChose')

  gGame.hintMode = true
  gGame.hintsUsed++
  saveStateGame()
}

function firstTurn(i, j) {
  gFirstTurn = false

  setMines(gBoard, { i, j })

  setMinesNegsCount(gBoard)
  startTimer()
}


function clickedOnMine() {
  if (!gGame.isOn) return
  var hearts = document.querySelector('.lives')
  hearts.removeChild(hearts.lastChild)
  gGame.heartsUsed++

  if (hearts.childElementCount === 0) gameOver("LOSE")
}

function revealCells(i, j) {
  var negs = findNegs(gBoard, i, j)
  var cellsWerentShown = []
  negs.push({ i, j })
  negs.forEach(neg => {
    if (!gBoard[neg.i][neg.j].isShown) {
      cellsWerentShown.push(neg)
      gBoard[neg.i][neg.j].isShown = true
    }
  })
  renderBoard(gBoard)

  setTimeout(() => {
    cellsWerentShown.forEach(neg => gBoard[neg.i][neg.j].isShown = false)
    renderBoard(gBoard)
    gGame.hintMode = false
    document.querySelector('.hintChose').remove()
  }, 1000)
}

function onCellClicked(elCell, i, j) {
  if (!gGame.isOn) return
  if (gGame.userMinesMode) {
    setMineByUser(elCell, i, j)
    return
  }
  if (gFirstTurn) firstTurn(i, j)
  if (gGame.hintMode) {
    revealCells(i, j)
    return
  }

  const cell = gBoard[i][j]
  cell.isShown = true
  gGame.shownCount++

  if (cell.isMine) {
    elCell.innerHTML = MINE
    clickedOnMine()
  } else {
    elCell.innerText = cell.minesAroundCount
    if (cell.minesAroundCount === 0) expandShown(gBoard, i, j)
    renderBoard(gBoard)
  }

  saveStateGame(gBoard)
  checkGameOver()
}

function onCellMarked(elCell, i, j) {
  const cell = gBoard[i][j]
  cell.isMarked = !cell.isMarked
  elCell.innerHTML = cell.isMarked ? FLAG : EMPTY
  gGame.markedCount += cell.isMarked ? 1 : -1

  saveStateGame()
  checkGameOver()
}

function checkGameOver() {
  if (gGame.markedCount + gGame.heartsUsed === gLevel.MINES
    && gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2) {
    gameOver("WIN")
  }
}

function expandShown(board, i, j) {
  var negs = findNegs(board, i, j)
  negs.push({ i, j })

  negs.forEach(neg => {
    if (!board[neg.i][neg.j].isShown) {
      board[neg.i][neg.j].isShown = true
      gGame.shownCount++

      //renderCell(neg, board[neg.i][neg.j].minesAroundCount)
      if (gBoard[neg.i][neg.j].minesAroundCount === 0) expandShown(board, neg.i, neg.j)
    }
  })
}

function gameOver(howEnded) {
  if (howEnded === "WIN") checkIfTopScore()

  document.querySelector('.smile span').innerHTML = howEnded === "WIN" ? AWESOME : LOSE
  clearInterval(gTimer)
  console.log("Game Over")
}

function onSafeClick(elBtn) {
  var safeCells = []
  for (var i = 0; i < gBoard.length; i++) {

    for (var j = 0; j < gBoard.length; j++) {
      if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) safeCells.push({ i, j })
    }
  }

  const safeCell = safeCells[getRandomInt(0, safeCells.length)]
  const elTd = document.querySelector(`[data-i="${safeCell.i}"][data-j="${safeCell.j}"]`)
  elTd.classList.add('safeMark')
  gGame.safeClicksLeft--
  elBtn.innerText = gGame.safeClicksLeft + " safe clicks"

  if (gGame.safeClicksLeft === 0) {
    elBtn.disabled = true
  }

  setTimeout(() => {
    elTd.classList.remove('safeMark')
  }, 5000);
}


function userCreatesMines() {
  if (gGame.userMinesMode) {
    document.querySelector('.btnUserCreate').innerText = "Manually Create"
    setMinesNegsCount(gBoard)
    startTimer()
    renderBoard(gBoard)
    gGame.userMinesMode = false
    gFirstTurn = false
    return
  }
  gLevel.MINES = 0
  document.querySelector('.btnUserCreate').innerText = "Done, play!"
  onInit()
  gGame.userMinesMode = true
}

// function undo(){
//   game = gStatesSave.pop()
//    gGame = game.game
//    gBoard = game.board
//    renderBoard(gBoard)
//    resetHeader(gLevel.HEARTS- game.game.heartsUsed,gLevel.HINTS - game.game.hintsUsed)
// }

