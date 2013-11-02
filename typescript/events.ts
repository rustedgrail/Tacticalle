///<reference path='tacticalle.s'>
var RAF = requestAnimationFrame.bind(window);

function attachEvents() {
    document.body.addEventListener('keydown', handleKeyPress)    
}

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
function handleKeyPress(e) {
    //console.log(e);    
    if (typeof keyBindings[e.keyCode] === 'function') handleKeyEvent(e)
}

function handleKeyEvent(e) {
    var board = window.Tacticalle.board
    var char = board.currentChar();
    RAF(keyBindings[e.keyCode].bind(null, char, e))
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
function attack() {}
function skill() {}
function defend(char: Character) {
    char.actionPoints -= 10
    char.defense += 1
}