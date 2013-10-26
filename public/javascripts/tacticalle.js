///<reference path='tacticalle.s'>
var RAF = requestAnimationFrame.bind(window);

function attachEvents() {
    document.body.addEventListener('keydown', handleKeyPress);
}

var keyBindings = {
    37: moveLeft,
    38: moveUp,
    39: moveRight,
    40: moveDown,
    65: attack,
    68: defend,
    83: skill,
    87: wait
};
function handleKeyPress(e) {
    if (typeof keyBindings[e.keyCode] === 'function')
        handleKeyEvent(e);
}

function handleKeyEvent(e) {
    var board = window.Tacticalle.board;
    var char = board.currentChar();
    RAF(keyBindings[e.keyCode].bind(null, char, e));
}

function moveChar(char, modX, modY) {
    var board = window.Tacticalle.board;
    if (board.isValid(char.x + modX, char.y + modY)) {
        char.x += modX;
        char.y += modY;
        board.drawFigures();
    }
}

function moveLeft(char) {
    moveChar(char, -1, 0);
}
function moveRight(char) {
    moveChar(char, 1, 0);
}
function moveUp(char) {
    moveChar(char, 0, -1);
}
function moveDown(char) {
    moveChar(char, 0, 1);
}
function wait(char) {
    char.actionPoints -= 10;
    window.Tacticalle.board.nextAction();
}
function attack() {
}
function skill() {
}
function defend() {
}
var $ = document.querySelector.bind(document);
var CANVAS = $('canvas');
var CONTEXT = CANVAS.getContext('2d');

var Character = (function () {
    function Character(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.actionPoints = 0;
    }
    Character.prototype.nextRound = function () {
        this.actionPoints += this.speed;
    };
    return Character;
})();

var Board = (function () {
    function Board() {
        this.chars = [];
        this.width = 1200 / 50;
        this.height = (600 - 200) / 50;
    }
    Board.prototype.addChar = function (newChar) {
        this.chars.push(newChar);
    };
    Board.prototype.sortChars = function () {
        this.chars.sort(function (a, b) {
            return b.actionPoints - a.actionPoints;
        });
        console.log(this.chars);
    };
    Board.prototype.currentChar = function () {
        return this.chars[0];
    };
    Board.prototype.getChars = function () {
        this.sortChars();
        return this.chars;
    };

    Board.prototype.nextAction = function () {
        this.chars.forEach(function (currentChar) {
            currentChar.nextRound();
        });
        this.sortChars();
    };

    Board.prototype.isValid = function (x, y) {
        var takenByChar = this.chars.some(function (currentChar) {
            return currentChar.x === x && currentChar.y === y;
        });
        return !takenByChar && x >= 0 && x < this.width && y >= 0 && y < this.height;
    };

    Board.prototype.drawFigure = function (currentChar) {
        CONTEXT.fillStyle = 'black';
        CONTEXT.fillRect(currentChar.x * 50, currentChar.y * 50 + 200, 50, 50);
    };

    Board.prototype.drawFigures = function () {
        this.drawBackground();
        this.chars.forEach(this.drawFigure);
    };

    Board.prototype.drawBackground = function () {
        CONTEXT.fillStyle = 'blue';
        CONTEXT.fillRect(0, 0, 1200, 200);
        CONTEXT.fillStyle = 'green';
        CONTEXT.fillRect(0, 200, 1200, 400);
    };
    return Board;
})();

initializeBoard();

function initializeBoard() {
    window.Tacticalle = {};
    var board = new Board();
    window.Tacticalle.board = board;
    board.addChar(new Character(1, 1));
    board.addChar(new Character(22, 1));
    board.drawFigures();
    attachEvents();
}
//# sourceMappingURL=tacticalle.js.map
