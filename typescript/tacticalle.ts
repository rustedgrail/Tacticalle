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
        this.actionPoints = 100
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
    }
    currentChar() {
        return this.chars[0]
    }
    getChars() {
        this.sortChars()
        return this.chars
    }
    
    nextAction() {
        while (this.chars[0].actionPoints < 100) {
            this.chars.forEach(function(currentChar: Character) {
                currentChar.nextRound()
            })
            this.sortChars()
        }
        this.drawFigures()
    }
    
    getMoveCost(x, y) {
        var takenByChar = this.chars.some(function(currentChar) {
            return currentChar.x === x && currentChar.y === y
        })
        if (takenByChar ||
            x < 0 || x > this.width ||
            y < 0 || y > this.height)
        {
            return Number.POSITIVE_INFINITY
        }
        else {
            return 10;
        }
    }
    
    drawFigure(currentChar: Character, index: number) {
        if (index) {
            CONTEXT.fillStyle = 'black'
        }
        else {
            CONTEXT.fillStyle = 'red'
        }
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