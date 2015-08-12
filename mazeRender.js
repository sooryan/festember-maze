var Lamp = illuminated.Lamp,
    RectangleObject = illuminated.RectangleObject,
    DiscObject = illuminated.DiscObject,
    Vec2 = illuminated.Vec2,
    Lighting = illuminated.Lighting;
var rectangles = [];
/*--------------------------MAZE--------------------------*/
canvasMaze = document.getElementById('canvasMaze');
ctxMaze = canvasMaze.getContext('2d');

//Properties
var gSize = 40;
var a = 15,
    b = 7;
var color = 'darkred';
width = canvasMaze.width = (a * 2 + 1) * gSize;
height = canvasMaze.height = (b * 2 + 1) * gSize;
/*--------------------------CANVAS2--------------------------*/
canvas2 = document.getElementById('canvasMotion');
ctx2 = canvas2.getContext('2d');
canvas2.width = width;
canvas2.height = height;
/*--------------------------DARKNESS-------------------------*/
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}
//positions of blocks
var blocks = [],
    usableBlocks = createArray(15, 32),
    particles = [];

function coinFlip() {
    return Math.random() > .5 ? 1 : -1;
}

function drawMaze() {
    ctxMaze.clearRect(0, 0, width, height);
    var blocks = new Array();
    var i;
    for (i = 0; i < 2 * a + 1; i += 2) {
        for (var j = 0; j < 2 * b + 1; j += 2) {
            drawRect(i, j);
        };
    };
    var maze = newMaze(a, b);
    maze[0][0][0] = 1;
    maze[b - 1][a - 1][2] = 1;
    for (var i = 0; i < b; i++) {
        for (var j = 0; j < a; j++) {
            if (maze[i][j][0] == 0) {
                drawRect(2 * j + 1, 2 * i);
            }
            if (maze[i][j][1] == 0) {
                drawRect(2 * j + 2, 2 * i + 1);
            }
            if (maze[i][j][2] == 0) {
                drawRect(2 * j + 1, 2 * i + 2);
            }
            if (maze[i][j][3] == 0) {
                drawRect(2 * j, 2 * i + 1);
            }
        }
    }

}

function drawRect(i, j) {

    if (blocks.indexOf(i + '-' + j) == -1) {
        console.log("drawing Rect", i, j);
        blocks.push(i + '-' + j);
    }
}

function drawVLines(line) {
    var i = line[0] * gSize,
        j1 = line[1] * gSize
        j2 = line[2] * gSize;
    rectangles.push(new RectangleObject({
        topleft: new Vec2(i, j1),
        bottomright: new Vec2(i + gSize, j2)
    }));
}

function drawHLines(line) {
    var j = line[0] * gSize,
        i1 = line[1] * gSize
        i2 = line[2] * gSize;
    rectangles.push(new RectangleObject({
        topleft: new Vec2(i1, j),
        bottomright: new Vec2(i2, j + gSize)
    }));
}

function User() {
    this.x = gSize + 20;
    this.y = 20;
    this.xG = 1;
    this.yG = 0;
    this.color = 'white';
    this.radius = gSize / 3;
}
User.prototype = {
    draw: function () {

        ctx2.fillStyle = this.color;
        ctx2.beginPath();
        ctx2.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx2.fill();
        //ctx2.stroke();

    },
    move: function (evt) {
        var keys = [37, 38, 39, 40]
        switch (evt.keyCode) {
            case 37:
                this.x -= 20;
                break;
            case 38:
                this.y -= 20;
                break;
            case 39:
                this.x += 20;
                break;
            case 40:
                this.y += 20;
                break;
        }
        if (keys.indexOf(evt.keyCode) != -1) {
            ctx2.clearRect(0, 0, width, height);
            //this.draw();
            if (this.collide(evt.keyCode)) console.log('Collision');
        }
    },
    collide: function (key) {
        var collision = 0;
        this.xG = Math.floor((this.x + this.radius) / gSize);
        this.yG = Math.floor((this.y + this.radius) / gSize);
        if (blocks.indexOf(this.xG + '-' + this.yG) != -1) collision = 1;
        this.yG = Math.floor((this.y - this.radius) / gSize);
        if (blocks.indexOf(this.xG + '-' + this.yG) != -1) collision = 1;
        this.xG = Math.floor((this.x - this.radius) / gSize);
        this.yG = Math.floor((this.y - this.radius) / gSize);
        if (blocks.indexOf(this.xG + '-' + this.yG) != -1) collision = 1;
        this.yG = Math.floor((this.y + this.radius) / gSize);
        if (blocks.indexOf(this.xG + '-' + this.yG) != -1) collision = 1;
        if (collision) {
            switch (key) {
                case 37:
                    this.x += 20;
                    break;
                case 38:
                    this.y += 20;
                    break;
                case 39:
                    this.x -= 20;
                    break;
                case 40:
                    this.y -= 20;
                    break;
            }
        }
        return collision;
    }
};
var alpha = 0;
var fadeIn = 1;
var count = 100;

function start() {
    var dist;
    if (count > 20) dist = (count--) * 10;
    else dist = 200;
    var canvas = document.getElementById("canvasMaze");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(mouse.mouseX, mouse.mouseY);
    var light = new Lamp({
        position: new Vec2(user.x, user.y),
        radius: 10,
        samples: 5,
        distance: dist
    });

    var lighting = new Lighting({
        light: light,
        objects: rectangles
    });
    lighting.compute(canvas.width, canvas.height);
    ctx.fillStyle = "black";
    setTimeout(function () {}, 100);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    lighting.render(ctx);
    user.draw();
    requestAnimationFrame(start);
}