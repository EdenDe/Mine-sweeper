'use strict'

var gTimer
var gCellsChoseMH = []

const MODES = {
  HINT: 'userPickHint',
  PICK_MINES: 'userPickMines',
  REGULAR: 'regular',
  FIRST_TURN: 'firstTurn',
  MEGA_HINT: 'mega hint'
}

function onHintClick(elBolb) {
  if(gGame.mode === MODES.FIRST_TURN){
    document.querySelector('p').innerText = 'you can not use hint before the first turn'
    return
  }
  elBolb.style.color = '#948228'
  elBolb.style.fontSize = '40px'
  elBolb.classList.add('hintChose')

  document.querySelector('p').innerText = 'press on any cell'

  gGame.mode = MODES.HINT
  gGame.hintsUsed++
}

function firstTurn(i, j) {
  gGame.mode = MODES.REGULAR

  setMines(gBoard, { i, j })

  setMinesNegsCount(gBoard)
  toggleButtons(false)
  startTimer()
}

function clickedOnMine() {
  if (!gGame.isOn) return
  var boom = new Audio('audio/short-explosion.wav')
  boom.play()

  var hearts = document.querySelector('.lives')
  hearts.removeChild(hearts.lastChild)
  gGame.heartsUsed++

  if (hearts.childElementCount === 0) gameOver("LOSE")
}

function findInBetweenCells(cellLeft, cellRight) {
  var cells = []
  for (var i = cellLeft.i; i <= cellRight.i; i++) {
    for (var j = cellLeft.j; j <= cellRight.j; j++) {
      cells.push({ i, j })
    }
  }
  return cells
}

function revealCells(cell1, cell2) {
  var cells = []
  if (gGame.mode === MODES.HINT) {
    cells = findNegs(gBoard, cell1.i, cell1.j)
    cells.push({ i: cell1.i, j: cell1.j })

  } else if (gGame.mode === MODES.MEGA_HINT) {
    cells = findInBetweenCells(cell1, cell2)
  }

  var cellsWerentShown = []

  cells.forEach(neg => {
    if (!gBoard[neg.i][neg.j].isShown) {
      cellsWerentShown.push(neg)
      gBoard[neg.i][neg.j].isShown = true
    }
  })
  renderBoard(gBoard)
  gGame.isOn = false

  setTimeout(() => {
    cellsWerentShown.forEach(neg => gBoard[neg.i][neg.j].isShown = false)
    renderBoard(gBoard)
    gGame.mode = MODES.REGULAR
    gGame.isOn = true
  }, 2000)
}

function onCellClicked(elCell, i, j) {
  if (!gGame.isOn) return
  switch (gGame.mode) {
    case MODES.REGULAR:
      document.querySelector('p').innerText = ''
      break
    case MODES.PICK_MINES:
      setMineByUser(elCell, i, j)
      return
    case MODES.FIRST_TURN:
      firstTurn(i, j)
      break
    case MODES.HINT:
      revealCells({ i, j })
      document.querySelector('p').innerText = ''
      document.querySelector('.hintChose').remove()
      return
    case MODES.MEGA_HINT:
      gCellsChoseMH.push({ i, j })
      if (gCellsChoseMH.length === 2) {
        revealCells(gCellsChoseMH[0],gCellsChoseMH[1])
        gCellsChoseMH = []
        document.querySelector('.btnMegaHint').disabled = true
        document.querySelector('p').innerText = ''
        return
      }
      document.querySelector('p').innerText = 'click on any bottom right cell'
      return
    default:
      break
  }

  saveStateGame()

  const cell = gBoard[i][j]
  cell.isShown = true
  gGame.shownCount++
  elCell.disabled = true

  if (cell.isMine) {
    elCell.innerHTML = ICONS.MINE
    clickedOnMine()
  } else {
    elCell.innerText = cell.minesAroundCount
    if (cell.minesAroundCount === 0) expandShown(gBoard, i, j)
  }

  renderBoard(gBoard)
  checkGameOver()
}

function onCellMarked(elCell, i, j) {
  const cell = gBoard[i][j]
  if(cell.isShown)return
  saveStateGame()

  cell.isMarked = !cell.isMarked
  elCell.innerHTML = cell.isMarked ? ICONS.FLAG : ICONS.EMPTY
  gGame.markedCount += cell.isMarked ? 1 : -1

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

      if (gBoard[neg.i][neg.j].minesAroundCount === 0) expandShown(board, neg.i, neg.j)
    }
  })
}

function gameOver(howEnded) {
  if (howEnded === "WIN") checkIfTopScore()
  else showAllMines()

  document.querySelector('.smile span').innerHTML = howEnded === "WIN" ? ICONS.AWESOME : ICONS.LOSE
  clearInterval(gTimer)
  gGame.isOn = false
}

function onSafeClick(elBtn) {
  saveStateGame()
  
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
  elBtn.firstElementChild.innerText = gGame.safeClicksLeft

  if (gGame.safeClicksLeft === 0) {
    elBtn.disabled = true
  }
}

function userCreatesMines() {
  if (gGame.mode === MODES.PICK_MINES) {
    document.querySelector('.btnUserCreate').classList.remove('making')
    document.querySelector('p').innerText = 'now you can start playing'
    setMinesNegsCount(gBoard)
    startTimer()
    renderBoard(gBoard)
    gGame.mode = MODES.REGULAR
    return
  }
  clearInterval(gTimer)
  gLevel.MINES = 0
  document.querySelector('.btnUserCreate').classList.add('making')
  document.querySelector('p').innerText = 'place your mines'
  onInit()
  gGame.mode = MODES.PICK_MINES
}

function onUndo() {
  if(!gGame.isOn) return

  gGame = gStatesSave.games.pop()
  gBoard = gStatesSave.boards.pop()

  renderBoard(gBoard)
  resetHeader()

  if (gStatesSave.games.length === 0 || gStatesSave.boards.length === 0){
   onInit()
  }
}

function onMegaHint() {
  gGame.mode = MODES.MEGA_HINT
  document.querySelector('p').innerText = 'click on any top left cell'
}
