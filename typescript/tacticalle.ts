var $ = document.querySelector.bind(document)
var CANVAS = $('canvas')
var CONTEXT = CANVAS.getContext('2d')

class Character {
    constructor(public x: number, public y: number) {}
}

var char: Character = new Character(50, 250);

drawBackground()
drawFigures(char)
attachEvents()

function drawBackground() {
    CONTEXT.fillStyle ='blue'
    CONTEXT.fillRect(0, 0, 1200, 200)
    CONTEXT.fillStyle = 'green'
    CONTEXT.fillRect(0, 200, 1200, 400)
}

function drawFigures(currentChar: Character) {
    CONTEXT.fillStyle = 'black'
    CONTEXT.fillRect(currentChar.x, currentChar.y, 50, 50)
}