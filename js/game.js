'use strict'

const WALL = '<img src="./img/wall.png">'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '<span class="superFood"></span>'
const CHERRY = '<img src="./img/cherry.png">'

const gGame = {
    score: 0,
    isOn: false
}
var gBoard
var gFoodCounter
var gAddCherryIntravel
var gIntervalSuperFood

function init() {
    document.querySelector('.modal').style.display = "none"

    gFoodCounter = {
        numOfFood: 0,
        numOfFoodEaten: 0
    }

    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)

    renderBoard(gBoard, '.board-container')
    gGame.score = 0
    gGame.isOn = true

    updateScore(0)

    gAddCherryIntravel = setInterval(addCherry, 15000)
    gIntervalSuperFood = setInterval(toggleSuperFood, 500)
}

function toggleSuperFood() {
    document.querySelectorAll('.superFood').forEach(superFood => superFood.classList.toggle('hidden'))
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
                continue
            }

            board[i][j] = FOOD
            gFoodCounter.numOfFood++
        }
    }
    board[1][1] = SUPER_FOOD
    board[1][size - 2] = SUPER_FOOD
    board[size - 2][1] = SUPER_FOOD
    board[size - 2][size - 2] = SUPER_FOOD

    //5 because 4 are superfood and one is pacman!
    gFoodCounter.numOfFood -= 5
    return board
}

function updateScore(diff) {
    gGame.score += diff
    const elScore = document.querySelector('span')
    elScore.innerText = gGame.score
}

function gameOver(messege) {
    document.querySelector('.modal').style.display = "block"
    document.querySelector('.modal span').innerText = messege
    gGame.isOn = false

    clearInterval(gIntervalGhosts)
    clearInterval(gAddCherryIntravel)
    clearInterval(gIntervalSuperFood)
}

function addCherry() {
    var pos = getEmptyPos()
    if (!pos) return
    gBoard[pos.i][pos.j] = CHERRY
    renderCell(pos, CHERRY)
}

function getEmptyPos() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j]

            if (gBoard[i][j] === EMPTY) {
                emptyCells.push({ i, j })
            }
        }
    }

    var randonInx = getRandomIntInclusive(emptyCells.length - 1, 0)
    var pos = emptyCells[randonInx]
    return pos
}