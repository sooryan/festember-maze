window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

Array.prototype.sortOn = function(key){
    this.sort(function(a, b){
        if(a[key] < b[key]){
            return -1;
        }else if(a[key] > b[key]){
            return 1;
        }
        return 0;
    });
}

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
    usableBlocks = createArray(2 * b + 1, 2 * a + 1);

function drawMaze() {
    //ctxMaze.clearRect(0, 0, width, height);
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
        blocks.push(i + '-' + j);
    }
}

function drawVLines(line) {
    var i = line.x * gSize,
        j1 = line.y1 * gSize
        j2 = line.y2 * gSize;
    rectangles.push(new RectangleObject({
        topleft: new Vec2(i, j1),
        bottomright: new Vec2(i + gSize, j2)
    }));
}

function drawHLines(line) {
    var j = line.y * gSize,
        i1 = line.x1 * gSize
        i2 = line.x2 * gSize;
    rectangles.push(new RectangleObject({
        topleft: new Vec2(i1, j),
        bottomright: new Vec2(i2, j + gSize)
    }));
}

function User() {
    this.x = gSize * 1.5;
    this.y = gSize / 2;
    this.xG = 1;
    this.yG = 0;
    this.color = 'white';
    this.radius = gSize / 4;
    this.speed = gSize / 2;
}
User.prototype = {
    draw: function () {
        ctx2.fillStyle = this.color;
        ctx2.beginPath();
        ctx2.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx2.fill();
    },
    move: function (evt) {
        var keys = [37, 38, 39, 40]
        switch (evt.keyCode) {
            case 37:
                this.x -= this.speed;
                break;
            case 38:
                this.y -= this.speed;
                break;
            case 39:
                this.x += this.speed;
                break;
            case 40:
                this.y += this.speed;
                break;
        }
        if (keys.indexOf(evt.keyCode) != -1) {

            ctx2.clearRect(this.x - gSize, this.y - gSize, 2 * gSize, 2 * gSize);
            if (this.collide(evt.keyCode)) console.log('Collision');
        }
    },
    collide: function (key, collision) {
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
                    this.x += this.speed;
                    break;
                case 38:
                    this.y += this.speed;
                    break;
                case 39:
                    this.x -= this.speed;
                    break;
                case 40:
                    this.y -= this.speed;
                    break;
            }
        }
        return collision;
    }
};

var count = 100;

function start(obj) {

    console.log(user.xG, user.yG);

    var dist = 200;
    /*if (count > 20) dist = (count--) * 10;
    else dist = 200;*/

    var canvas = canvasMaze;
    var ctx = ctxMaze;
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    var light2 = new Lamp({
        position: new Vec2(user.x, user.y),
        radius: 0,
        // samples: 4,
        distance: dist
    });
    var light = new Lamp({
        position: new Vec2(user.x, user.y),
        radius: 0,
        samples: 4,
        distance: dist
    });

    var lighting = new Lighting({
        light: light,
        objects: obj
    });
    lighting.compute(canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    lighting.render(ctx);
    user.draw();
    //requestAnimFrame(start)
    //setInterval(start,60);
}
(function () {
    var updateCanvas = true;
    drawMaze();
    var i, j;
    var mouse = {};
    user = new User();
    window.addEventListener('keydown', function (e) {
        updateCanvas = true;
        user.move(e);
    }, false);

    for (i = 0; i < 2 * b + 1; i++)
    for (j = 0; j < 2 * a + 1; j++) {
        usableBlocks[i][j] = 0;
    };
    blocks.forEach(function (block) {
        var index;
        usableBlocks[block.split('-')[1]][block.split('-')[0]] = 1;
    })
    //initialize();
    var horlines = [],
        verlines = [],
        horfree = [],
        verfree = [];
    var s1 = 0,
        e1 = 0;

    for (i = 0; i < 2 * b + 1; i++) {
        for (j = 0; j < 2 * a + 1; j++)
        if (usableBlocks[i][j] == 1) {
            s1 = j;
            e1 = j;
            while (j < (2 * a + 1) && usableBlocks[i][j] == 1) {
                e1++;
                j++;
            }
            len = e1 - s1;
            if (len >= 2) horlines.push({y:i,x1: s1,x2: e1,len: len});

        }
        else if (usableBlocks[i][j] == 0) {
            s1 = j;
            e1 = j;
            while (j < (2 * a + 1) && usableBlocks[i][j] == 0) {
                e1++;
                j++;
            }
            len = e1 - s1;
            if (len >= 2) horfree.push({y:i,x1: s1,x2: e1,len: len,free: 1});

        }
    }
    for (j = 0; j < 2 * a + 1; j++) {
        for (i = 0; i < 2 * b + 1; i++) {
            if (usableBlocks[i][j] == 1) {
                s1 = i;
                e1 = i;
                while (i < 2 * b + 1 && usableBlocks[i][j] === 1) {
                    e1++;
                    i++;
                }
                len = e1 - s1;
                if (len >= 2) verlines.push({x:j,y1: s1,y2: e1,len: len});
            }
            else if (usableBlocks[i][j] == 0) {
                s1 = i;
                e1 = i;
                while (i < 2 * b + 1 && usableBlocks[i][j] === 0) {
                    e1++;
                    i++;
                }
                len = e1 - s1;
                if (len >= 2) verfree.push({x:j,y1: s1,y2: e1,len: len,free: 1});
            }
        }
    }
    horlines.forEach(function (line) {
        drawHLines(line);
    });
    verlines.forEach(function (line) {
        drawVLines(line);
    });
    verlines.sortOn('len')
    console.log(verlines);
    console.log("verfree: ",verfree);
    console.log("horfree: ",horfree);
    
    var enemies=[];
    var fps = {
    startTime : 0,
    frameNumber : 0,
    getFPS : function(){
        this.frameNumber++;
        var d = new Date().getTime(),
            currentTime = ( d - this.startTime ) / 1000,
            result = Math.floor( ( this.frameNumber / currentTime ) );

        if( currentTime > 1 ){
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        return result;

    }   
};
    function initEnemies(){
        var i,pos;
        var vertical=[];
        /*for(i=0;vertical.length<=a/3;i++)
        {
            pos=Math.floor(Math.random(2*b+1));
            if(vertical.indexOf(pos)){
                verfree.forEach(function(vline){
                    if (pos==vline.x && vline.len>=3 && vline.free==1)
                        vertical.push(vline);
                        vline.free=0;
                })
            }
        }
        //console.log(vertical)
        for(i=0;i<=a/3;i++)
            {*/
                enemies.push(new Enemy(verfree[1]));
                enemies.push(new Enemy(verfree[3]));
                enemies.push(new Enemy(verfree[5]));
                enemies.forEach(function(e){
                    e.draw();
                })

                //}
    }
    initEnemies();
    console.log(enemies);
    var fpsa=document.getElementById('fps');
    function drawLoop() {
        //var time=new Date();
        //console.log(time)
        if (updateCanvas) {
            var count = 0;
            var obj = [];
            for (i = 0; i < rectangles.length; i++) {
                if (Math.abs(rectangles[i].points[0].x - user.x) < 5 * gSize || Math.abs(rectangles[i].points[0].y - user.y) < 5 * gSize) {
                    obj.push(rectangles[i]);
                    count++;
                }
            }
            console.log(count);
            start(obj);
            updateCanvas = !updateCanvas;
        }
        enemies.forEach(function(e){
                    e.move();
                });
        fpsa.innerHTML=fps.getFPS()

        requestAnimFrame(drawLoop);
    }
    drawLoop();

})();