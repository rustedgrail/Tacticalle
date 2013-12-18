///<reference path='tacticalle.s'>
var RAF = requestAnimationFrame.bind(window);

function attachEvents() {
    document.body.addEventListener('keydown', handleKeyPress)    
}

var DEFAULT = "DEFAULT"
var ATTACK = "ATTACK"
var MOVE = "MOVE"

var currentState = MOVE

var keyBindings = {
    37: moveLeft
    , 38: moveUp
    , 39: moveRight
    , 40: moveDown
    , 65: attack
    , 68: defend
    , 83: skill
    , 87: wait
}
keyBindings[DEFAULT] = function() {
    console.log("Use arrow keys to move")
    console.log("W for wait")
    console.log("A for attack")
    console.log("S for skills")
    console.log("D for defend")
}

var stateMachine = {}
stateMachine[MOVE] = keyBindings
stateMachine[ATTACK] = {
    37: attackLeft
    , 38: attackUp
    , 39: attackRight
    , 40: attackDown
}
stateMachine[ATTACK][DEFAULT] = function() {
    currentState = MOVE
}

function handleKeyPress(e) {
    if (typeof stateMachine[currentState][e.keyCode] === "function") {
        handleKeyEvent(e)
    }
    else {
        stateMachine[currentState][DEFAULT]()
    }
}

function handleKeyEvent(e) {
    var board = window.Tacticalle.board
    var char = board.currentChar();
    RAF(stateMachine[currentState][e.keyCode].bind(null, char, e))
}

function moveChar(char: Character, modX: number, modY: number) {
    var board = window.Tacticalle.board
    var cost = board.getMoveCost(char.x + modX, char.y + modY)
    if (char.actionPoints >= cost) {
        char.x += modX
        char.y += modY
        char.actionPoints -= cost
        board.drawFigures()
    }
}

function moveLeft(char: Character) { moveChar(char, -1, 0) }
function moveRight(char: Character) { moveChar(char, 1, 0) }
function moveUp(char: Character) { moveChar(char, 0, -1) }
function moveDown(char: Character) { moveChar(char, 0, 1) }
function wait(char: Character) {
    if (char.actionPoints < 90) {
        window.Tacticalle.board.nextAction()
    }
    else {
        console.log("Can't wait while your action points are greater than 90! ", char.actionPoints)
    }
}

function attack(char: Character) {
    if (char.actionPoints >= char.attackCost) {
        currentState = ATTACK;
    }
}

function attackDir(char: Character, modX: number, modY: number) {
    var board = window.Tacticalle.board
    var defender = board.getCharAt(char.x + modX, char.y + modY)
    if (defender) {
        char.actionPoints -= char.attackCost
        defender.hp -= Math.max(0, char.attack - defender.defense)
        defender.defense -= char.attack
    }
    currentState = MOVE
    window.Tacticalle.board.drawFigures()
}
function attackLeft(char: Character) { attackDir(char, -1, 0) }
function attackRight(char: Character) { attackDir(char, 1, 0) }
function attackUp(char: Character) { attackDir(char, 0, -1) }
function attackDown(char: Character) { attackDir(char, 0, 1) }
function skill() {}
function defend(char: Character) {
    char.actionPoints -= 10
    char.defense += 1
}