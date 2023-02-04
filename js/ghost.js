'use strict'

const GHOST = 'fas fa-ghost'
const FEAR_COLOR = 'blue'
var gGhosts = []
var gDeadGhosts = []

var gIntervalGhosts

function createGhosts(board) {
    gGhosts = []

    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function createGhost(board) {
    var ghost = {
        location: { i: 3, j: 3 },
        currCellContent: FOOD,
        color: getRandomColor()
    }
    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = getGhostHTML(ghost)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        moveGhost(gGhosts[i])
    }
}

function moveGhost(ghost) {
    const nextLocation = { i: ghost.location.i, j: ghost.location.j }
    const diff = getMoveDiff()

    nextLocation.i += diff.i
    nextLocation.j += diff.j

    var nextCellContent = gBoard[nextLocation.i][nextLocation.j]

    if (nextCellContent === WALL || nextCellContent === GHOST) return

    if (nextCellContent === PACMAN) {
        pacmanMeetsGhost(nextLocation)
        if (gGame.isOn) return
    }

    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    renderCell(ghost.location, ghost.currCellContent)

    ghost.location = nextLocation
    ghost.currCellContent = nextCellContent
    gBoard[ghost.location.i][ghost.location.j] = GHOST

    renderCell(ghost.location, getGhostHTML(ghost))
}

function removeGhost(ghostPos) {
    var inx = gGhosts.findIndex(ghost => ghost.location.i === ghostPos.i && ghost.location.j === ghostPos.j)
    if (inx === -1) return
    gDeadGhosts.push(...gGhosts.splice(inx, 1))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function changeGhostColor(ghosts) {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].style.color = gPacman.isSuper ? FEAR_COLOR : gGhosts[i].color
    }
}

function getGhostHTML(ghost) {
    return `<i class="ghost ${GHOST}" style='color: ${gPacman.isSuper ? FEAR_COLOR : ghost.color}'></i>`
}