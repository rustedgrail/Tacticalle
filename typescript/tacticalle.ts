interface Window {
    Tacticalle: any
}

var $ = document.querySelector.bind(document)
var CANVAS = $('canvas')
var CONTEXT = CANVAS.getContext('2d')

class Character {
    public hp: number
    public mp: number
    public speed: number = 5
    public attack: number
    public defence: number
    public magic: number
    public magicDefence: number
    public critical: number
    public fumble: number
    public actionPoints: number
    
    constructor(public x: number, public y: number) {
        this.actionPoints = 0    
    }
    
    nextRound() {
        this.actionPoints += this.speed
    }
}

class Board {
    private chars: Array<Character> = []
    private width: number = 1200 / 50
    private height: number = (600 - 200) / 50
    addChar(newChar: Character) {
        this.chars.push(newChar)
    }
    sortChars() {
        this.chars.sort(function(a, b) {
            return b.actionPoints - a.actionPoints
        })
        console.log(this.chars)
    }
    currentChar() {
        return this.chars[0]
    }
    getChars() {
        this.sortChars()
        return this.chars
    }
    
    nextAction() {
        this.chars.forEach(function(currentChar: Character) {
            currentChar.nextRound()
        })
        this.sortChars()
    }
    
    isValid(x, y) {
        var takenByChar = this.chars.some(function(currentChar) {
            return currentChar.x === x && currentChar.y === y
        })
        return !takenByChar && x >= 0 && x < this.width && y >= 0 && y < this.height
    }
    
    drawFigure(currentChar: Character) {
        CONTEXT.fillStyle = 'black'
        CONTEXT.fillRect(currentChar.x * 50, currentChar.y * 50 + 200, 50, 50)
    }
    
    drawFigures() {
        this.drawBackground()
        this.chars.forEach(this.drawFigure)
    }

    drawBackground() {
        CONTEXT.fillStyle ='blue'
        CONTEXT.fillRect(0, 0, 1200, 200)
        CONTEXT.fillStyle = 'green'
        CONTEXT.fillRect(0, 200, 1200, 400)
    }
}

initializeBoard()

function initializeBoard() {
    window.Tacticalle = {}
    var board = new Board()
    window.Tacticalle.board = board
    board.addChar(new Character(1, 1))
    board.addChar(new Character(22, 1))
    board.drawFigures()
    attachEvents()
}