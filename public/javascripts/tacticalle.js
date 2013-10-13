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
    char.x = Math.max(0, Math.min(board.width, char.x + modX));
    char.y = Math.max(0, Math.min(board.height, char.y + modY));
    board.drawBackground();
    board.drawFigure(char);
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
function wait() {
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
        this.width = 1200 / 50 - 1;
        this.height = (600 - 200) / 50 - 1;
    }
    Board.prototype.addChar = function (newChar) {
        this.chars.push(newChar);
    };
    Board.prototype.sortChars = function () {
        this.chars.sort(function (a, b) {
            return a.actionPoints - b.actionPoints;
        });
    };
    Board.prototype.currentChar = function () {
        return this.chars[0];
    };
    Board.prototype.getChars = function () {
        this.sortChars();
        return this.chars;
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
    var char = new Character(1, 1);
    var board = new Board();
    window.Tacticalle.board = board;
    board.addChar(char);
    board.drawFigures();
    attachEvents();
}
//# sourceMappingURL=tacticalle.js.map
