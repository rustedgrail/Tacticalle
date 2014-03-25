var $ = document.querySelector.bind(document);
var CANVAS = $('canvas');
var CONTEXT = CANVAS.getContext('2d');

var Character = (function () {
    function Character(x, y, team) {
        this.x = x;
        this.y = y;
        this.team = team;
        this.hp = 100;
        this.speed = 5;
        this.attack = 200;
        this.defense = 1;
        this.attackCost = 30;
        this.actionPoints = 100;
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
    };
    Board.prototype.currentChar = function () {
        return this.chars[0];
    };
    Board.prototype.getChars = function () {
        this.sortChars();
        return this.chars;
    };
    Board.prototype.getCharAt = function (x, y) {
        return this.chars.gimme(function (c) {
            return c.x === x && c.y === y;
        });
    };

    Board.prototype.removeChar = function (char) {
        this.chars.splice(this.chars.indexOf(char), 1);
        this.checkVictory();
    };

    Board.prototype.checkVictory = function () {
        var team = this.chars[0].team;
        var finished = true;
        this.chars.forEach(function (char) {
            finished = finished && !(char.team != team);
        });
        if (finished) {
            this.endGame();
        }
    };

    Board.prototype.endGame = function () {
        document.write("THE GAME IS OVER!!");
    };

    Board.prototype.nextAction = function () {
        while (this.chars[0].actionPoints < 100) {
            this.chars.forEach(function (currentChar) {
                currentChar.nextRound();
            });
            this.sortChars();
        }
        this.drawFigures();
    };

    Board.prototype.getMoveCost = function (x, y) {
        var takenByChar = this.chars.some(function (currentChar) {
            return currentChar.x === x && currentChar.y === y;
        });
        if (takenByChar || x < 0 || x > this.width || y < 0 || y > this.height) {
            return Number.POSITIVE_INFINITY;
        } else {
            return 10;
        }
    };

    Board.prototype.drawFigure = function (currentChar, index) {
        if (index) {
            CONTEXT.fillStyle = currentChar.team;
        } else {
            CONTEXT.fillStyle = 'black';
            CONTEXT.font = "20px Helvetica";
            CONTEXT.fillText('HP: ' + currentChar.hp, 15, 20);
            CONTEXT.fillText('ATK: ' + currentChar.attack, 15, 40);
            CONTEXT.fillText('DEF: ' + currentChar.defense, 15, 60);
            CONTEXT.fillText('AP: ' + currentChar.actionPoints, 15, 80);
        }
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
    board.addChar(new Character(1, 1, "red"));
    board.addChar(new Character(1, 3, "red"));
    board.addChar(new Character(1, 5, "red"));
    board.addChar(new Character(22, 1, "blue"));
    board.addChar(new Character(22, 3, "blue"));
    board.addChar(new Character(22, 5, "blue"));
    board.drawFigures();
    attachEvents();
}
/// <reference path="tacticalle.ts"/>

Array.prototype.gimme = function (func) {
    if (Array.prototype.find) {
        return this.find(func);
    } else {
        var retVal;
        this.forEach(function (val) {
            if (func(val))
                retVal = val;
        });
        return retVal;
    }
};

var RAF = requestAnimationFrame.bind(window);
RAF(updateController);

function attachEvents() {
    document.body.addEventListener('keydown', handleKeyPress);
}

function scangamepads() {
    var gamepads = navigator.webkitGetGamepads();
    if (gamepads[0]) {
        window.Tacticalle.controller = gamepads[0];
    }
}

function updateController() {
    scangamepads();
    var board = window.Tacticalle.board;
    var char = board.currentChar();
    var controller = window.Tacticalle.controller;
    if (controller) {
        if (controller.buttons[2])
            handleKeyPress({ keyCode: 65 });
        if (controller.buttons[3])
            handleKeyPress({ keyCode: 87 });
        if (controller.buttons[1])
            handleKeyPress({ keyCode: 68 });

        if (controller.axes[0] > .5)
            handleKeyPress({ keyCode: 39 });
        if (controller.axes[0] < -.5)
            handleKeyPress({ keyCode: 37 });
        if (controller.axes[1] > .5)
            handleKeyPress({ keyCode: 40 });
        if (controller.axes[1] < -.5)
            handleKeyPress({ keyCode: 38 });
    }

    RAF(updateController);
}

var DEFAULT = "DEFAULT";
var ATTACK = "ATTACK";
var MOVE = "MOVE";

var currentState = MOVE;

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
keyBindings[DEFAULT] = function () {
    console.log("Use arrow keys to move");
    console.log("W for wait");
    console.log("A for attack");
    console.log("S for skills");
    console.log("D for defend");
};

var stateMachine = {};
stateMachine[MOVE] = keyBindings;
stateMachine[ATTACK] = {
    37: attackLeft,
    38: attackUp,
    39: attackRight,
    40: attackDown
};
stateMachine[ATTACK][DEFAULT] = function () {
    currentState = MOVE;
};

var timeout = null;
function handleKeyPress(e) {
    if (!timeout) {
        if (typeof stateMachine[currentState][e.keyCode] === "function") {
            handleKeyEvent(e);
        } else {
            stateMachine[currentState][DEFAULT]();
        }
    }

    timeout = setTimeout(function () {
        timeout = false;
    }, 150);
}

function handleKeyEvent(e) {
    var board = window.Tacticalle.board;
    var char = board.currentChar();
    RAF(stateMachine[currentState][e.keyCode].bind(null, char, e));
}

function moveChar(char, modX, modY) {
    var board = window.Tacticalle.board;
    var cost = board.getMoveCost(char.x + modX, char.y + modY);
    if (char.actionPoints >= cost) {
        char.x += modX;
        char.y += modY;
        char.actionPoints -= cost;
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
    if (char.actionPoints < 90) {
        window.Tacticalle.board.nextAction();
    } else {
        console.log("Can't wait while your action points are greater than 90! ", char.actionPoints);
    }
}

function attack(char) {
    if (char.actionPoints >= char.attackCost) {
        currentState = ATTACK;
    }
}

function attackDir(char, modX, modY) {
    var board = window.Tacticalle.board;
    var defender = board.getCharAt(char.x + modX, char.y + modY);
    if (defender && char.team != defender.team) {
        char.actionPoints -= char.attackCost;
        defender.hp -= Math.max(0, char.attack - defender.defense);
        if (defender.hp <= 0)
            board.removeChar(defender);
        defender.defense -= char.attack;
    }
    currentState = MOVE;
    window.Tacticalle.board.drawFigures();
}
function attackLeft(char) {
    attackDir(char, -1, 0);
}
function attackRight(char) {
    attackDir(char, 1, 0);
}
function attackUp(char) {
    attackDir(char, 0, -1);
}
function attackDown(char) {
    attackDir(char, 0, 1);
}
function skill() {
}
function defend(char) {
    if (char.actionPoints >= 10) {
        char.actionPoints -= 10;
        char.defense += 1;
        window.Tacticalle.board.drawFigures();
    }
}
