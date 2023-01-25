const MINE = '&#128163;'


function setMines(board,pos) {

  for (let i = 0; i < gLevel.MINES;) {
    
    var randomI = getRandomInt(0,board.length)
    var randomJ = getRandomInt(0,board.length)

    if(randomI === pos.i && randomJ === pos.j)continue
    if(board[randomI][randomJ].isMine) continue

    board[randomI][randomJ].isMine = true  
    i++
  }
}

function setMineByUser(elCell,i,j){
   gLevel.MINES++
    gBoard[i][j].isMine = true
    renderCell(elCell.dataset,MINE)

}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (!board[i][j].isMine) board[i][j].minesAroundCount = findNegs(board, i, j).filter(neg => board[neg.i][neg.j].isMine).length
    }
  }
}




