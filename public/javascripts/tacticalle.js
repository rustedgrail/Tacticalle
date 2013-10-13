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
    console.log(e);
    if (typeof keyBindings[e.keyCode] === 'function')
        RAF(keyBindings[e.keyCode].bind(e));
}

function moveLeft() {
    char.x = Math.max(0, char.x - 50);
    drawBackground();
    drawFigures(char);
}
function moveRight() {
    char.x = Math.min(1200, char.x + 50);
    drawBackground();
    drawFigures(char);
}
function moveUp() {
    char.y = Math.max(200, char.y - 50);
    drawBackground();
    drawFigures(char);
}
function moveDown() {
    char.y = Math.min(600, char.y + 50);
    drawBackground();
    drawFigures(char);
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
    }
    return Character;
})();

var char = new Character(50, 250);

drawBackground();
drawFigures(char);
attachEvents();

function drawBackground() {
    CONTEXT.fillStyle = 'blue';
    CONTEXT.fillRect(0, 0, 1200, 200);
    CONTEXT.fillStyle = 'green';
    CONTEXT.fillRect(0, 200, 1200, 400);
}

function drawFigures(currentChar) {
    CONTEXT.fillStyle = 'black';
    CONTEXT.fillRect(currentChar.x, currentChar.y, 50, 50);
}
//# sourceMappingURL=tacticalle.js.map
