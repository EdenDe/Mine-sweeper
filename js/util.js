'use strict'

function renderBoard(board) {
  var strHTML = '<table><tbody>'
  
  for (var i = 0; i < board.length; i++) {

    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j]
   
      var data = `data-i="${i}" data-j="${j}" data-minesAround="${cell.minesAroundCount}"`
      var classes = 'cell'
      var insertHTML = ICONS.EMPTY
      if (cell.isShown) {
        classes += ' shown'
        if (cell.minesAroundCount > 0) {
          insertHTML = cell.minesAroundCount
        }
        if (cell.isMine) {
          classes += ' mine'
          insertHTML = ICONS.MINE
        }
      }
      else {
        classes += ' covered'
      }
      if (cell.isMarked){
        insertHTML = ICONS.FLAG
        data = ''
      }

      strHTML += `<td ${data} class=" ${classes}" oncontextmenu="onCellMarked(this,${i},${j})" onclick="onCellClicked(this,${i},${j})">  ${insertHTML}  </td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  document.querySelector('.board').innerHTML = strHTML

  document.querySelectorAll('.cell').forEach(td =>{
    td.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })
  })
  if(gGame.isOn){
  document.querySelectorAll('.cell.covered').forEach(td =>{
    td.addEventListener('mouseenter',changeSmileyToSuprised)
    td.addEventListener('mouseleave',changeSmileyToNormal)
  })}
  
}

function changeSmileyToSuprised(){
  document.querySelector('.smile span').innerHTML = ICONS.SUPRISED
}

function changeSmileyToNormal(){
  document.querySelector('.smile span').innerHTML = ICONS.NORMAL
}


function renderCell(location, value) {
  const elCell = document.querySelector(`[data-i="${location.i}"][data-j="${location.j}"]`)
  elCell.innerHTML = value
}

function getRandomInt(max, min) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min);
}

function findNegs(board, rowIdx, colIdx) {
  var negs = []

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (rowIdx === i && colIdx === j) continue

      negs.push({ i, j })
    }
  }

  return negs
}





