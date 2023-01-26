'use strict'

const PACMAN = '<img src="./img/pacman.png" class="pacman">'
var gPacman
var gImgTransform = 'scaleX(1)'
var gNextTimeSuperFood = false

function createPacman(board) {
    gPacman = {
        location: { i: 3, j: 5 },
        isSuper: false,
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {
    const nextLocation = getNextLocation(ev)
    var superFoodTwice = false

    if (!nextLocation) return

    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    switch (nextCell) {
        case WALL:
            return
        case GHOST:
            pacmanMeetsGhost(nextLocation)
            break
        case FOOD:
            gFoodCounter.numOfFoodEaten++
            if (gFoodCounter.numOfFood === gFoodCounter.numOfFoodEaten) {
                gameOver("Game Done")
                return
            }
            updateScore(1)
            break
        case SUPER_FOOD:
            if (gPacman.isSuper) {
                superFoodTwice = true
                break
            }
            gPacman.isSuper = true
            const ghosts = document.querySelectorAll('.ghost')
            changeGhostColor(ghosts)

            setTimeout(() => {
                gPacman.isSuper = false
                gGhosts.push(...gDeadGhosts)
                gDeadGhosts = []

                changeGhostColor(ghosts)
               
            }, 5000)

            break
        case CHERRY:
            updateScore(10)
            break
    }

    if (gNextTimeSuperFood) {
        updateModelDOM(gPacman.location, SUPER_FOOD)
        gNextTimeSuperFood = false

    } else {
        updateModelDOM(gPacman.location, EMPTY)
    }

    gPacman.location = nextLocation
    updateModelDOM(gPacman.location, PACMAN)

    if (superFoodTwice) gNextTimeSuperFood = true

    document.querySelector('.pacman').style.transform = gImgTransform
}

function updateModelDOM(location, content) {
    gBoard[location.i][location.j] = content
    renderCell(location, content)
}

function pacmanMeetsGhost(nextLocation) {
    if (gPacman.isSuper) removeGhost(nextLocation)
    else gameOver("Game Over")
}

function getNextLocation(eventKeyboard) {

    if (gGame.isOn === false) return

    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j,
    }

    switch (eventKeyboard.key) {
        case 'ArrowUp':
            gImgTransform = 'rotate(270deg)'
            nextLocation.i--
            break;
        case 'ArrowDown':
            gImgTransform = 'rotate(90deg)'
            nextLocation.i++
            break;
        case 'ArrowLeft':
            gImgTransform = 'scaleX(-1)'
            nextLocation.j--
            break;
        case 'ArrowRight':
            gImgTransform = 'scaleX(1)'
            nextLocation.j++
            break;
        default:
            return null
    }
    return nextLocation
}