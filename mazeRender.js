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
canvas3 = document.getElementById('darkness');
ctx3 = canvas3.getContext('2d');
canvas3.width = width;
canvas3.height = height;
var x,y;
/*$('#darkness').mousemove(function () {
    var rect = this.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    lightUp(x, y, 1);
    return false;
});
$('#darkness').mouseup(function () {
    console.log(x,y);
    lightUp(x, y, 0);
    return false;
});*/

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}
//positions of blocks
var blocks = [],
    usableBlocks=createArray(15,32),
    particles = [];

function coinFlip() {
    return Math.random() > .5 ? 1 : -1;
}

function drawMaze() {
    ctxMaze.clearRect(0, 0, width, height);
    var blocks = new Array();
    ctxMaze.strokestyle = "#000000";
    var i;
    /*
    for (i = 0; i < height; i += gSize) {
        ctxMaze.strokeStyle = '#000000';
        ctxMaze.beginPath();
        ctxMaze.lineWidth = 1;
        ctxMaze.moveTo(0, i);
        ctxMaze.lineTo(width, i);
        ctxMaze.stroke();
    }
    for (i = 0; i < width; i += gSize) {
        ctxMaze.strokeStyle = '#000000';
        ctxMaze.beginPath();
        ctxMaze.lineWidth = 1;
        ctxMaze.moveTo(i, 0);
        ctxMaze.lineTo(i, height);
        ctxMaze.stroke();
    }*/
    for (i = 0; i < 2 * a + 1; i += 2) {
        for (var j = 0; j < 2 * b + 1; j += 2) {
            drawRect(i, j);
        };
    };
    var maze = newMaze(a, b);
    var l = maze.length - 1;
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
        blocks.push(i + '-' + j);
        ctxMaze.fillStyle = color;
        ctxMaze.fillRect(i * gSize, j * gSize, gSize, gSize);
        ctxMaze.strokeStyle = '#000000';
        ctxMaze.strokeRect(i * gSize, j * gSize, gSize, gSize);
    }
}

function lightUp(i, j, clear) {
    var fade = 1,
        a = 0;
    i = Math.floor(i / gSize);
    j = Math.floor(j / gSize);
    if (clear == 1) {
        ctx3.clearRect((i - 1) * gSize, (j - 1) * gSize, 3 * gSize, 3 * gSize);
    } else if (clear == 0) {
        ctx3.fillStyle = '#000000';
        ctx3.globalAlpha = 1;
        ctx3.fillRect((i - 1) * gSize, (j - 1) * gSize, 3 * gSize, 3 * gSize);
    }
}

function User() {
    this.x = gSize + 20;
    this.y = 20;
    this.xG = 1;
    this.yG = 0;
    this.color = 'cyan';
    this.radius = gSize / 3;
}
User.prototype = {
    draw: function () {

        ctx2.fillStyle = this.color;
        ctx2.beginPath();
        ctx2.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx2.fill();
        ctx2.stroke();

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
            this.draw();
            console.log(this.x, this.y)
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

function update() {
    console.log(alpha)


    if (fadeIn) {
        alpha += .001;
        if (alpha >= 1) {
            alpha = 1;
            fadeIn = false;
        }
    }

    ctx3.fillStyle = '#000000';
    ctx3.globalAlpha = alpha;
    ctx3.fillRect(0, 0, width, height);
    if (fadeIn) requestAnimationFrame(update);
};