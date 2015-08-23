function stuff(win) {

    var id = $(this);

    $('#mask').fadeIn(1000);
    $('#mask').fadeTo("slow", 0.8);
    if (win == 1) {
        $('#boxes .window').css("background-color", "rgba(0,255,0,0.5)");
    }
    if (win == 0) {
        $('#boxes').html('<div id="dialog" class="window"><h1><b>You shall not pass</b></h1>Enter or Esc to restart</div><div id="mask"></div>')
        $('#boxes .window').css("background-color", "rgba(255,0,0,0.5)");
        window.sessionStorage.setItem("refresh",true);
    }
    setTimeout(function () {
        $('#mask').show();
        $('.window').show();
    }, 10);
}

$(document).keyup(function (e) {
    if (end == 1) {
        if (e.keyCode == 13 || e.keyCode == 27) {
            $('#mask').hide();
            $('.window').hide();
            if (b < 7) b++;
            if (a < 15) a++;
            if (b == 5) gSize = 50;
            else gSize = 40;
            lvl++;
            
            var level = {
                a: a,
                b: b,
                gSize: gSize,
                level: lvl
            };
            window.sessionStorage.setItem("level", JSON.stringify(level));
            location.reload();
            //gameStart(a,b,gSize);
            end = 0;
        }
    } else if (end == 2) {
        if (e.keyCode == 13 || e.keyCode == 27) {
            $('#mask').hide();
            $('.window').hide();
            window.sessionStorage.clear();
            location.reload();
            
            end = 0;
        }
    }
});

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
var lvl,end, enemies, canvasMaze, ctxMaze, canvas2, ctx2, gSize, a, b, width, height, W, H, blocks, usableBlocks;
Array.prototype.sortOn = function (key) {
    this.sort(function (a, b) {
        if (a[key] < b[key]) {
            return -1;
        } else if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    });
}

var Lamp = illuminated.Lamp,
    RectangleObject = illuminated.RectangleObject,
    OpaqueObject = illuminated.OpaqueObject,
    DiscObject = illuminated.DiscObject,
    Vec2 = illuminated.Vec2,
    Lighting = illuminated.Lighting,
    DarkMask = illuminated.DarkMask;
var rectangles = [];


function initialize(A, B, size,l) {

    canvasMaze = document.getElementById('canvasMaze');
    ctxMaze = canvasMaze.getContext('2d');

    //Properties
    gSize = size || 50;
    a = A || 5,
    b = B || 5;
    lvl = l || 0;
    blocks = [],
    usableBlocks = createArray(2 * b + 1, 2 * a + 1);
    //var color = 'darkred';
    width = canvasMaze.width = (a * 2 + 1) * gSize;
    height = canvasMaze.height = (b * 2 + 1) * gSize;
    /*--------------------------CANVAS2--------------------------*/
    canvas2 = document.getElementById('light');
    ctx2 = canvas2.getContext('2d');
    canvas2.width = width;
    canvas2.height = height;
    canvas2 = document.getElementById('canvasMotion');
    ctx2 = canvas2.getContext('2d');
    canvas2.width = width;
    canvas2.height = height;
    ctxMaze.clearRect(0,0,width,height);
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function drawMaze() {
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
        bottomright: new Vec2(i + gSize, j2),
        diffuse: 0.1
    }));
}

function drawHLines(line) {
    var j = line.y * gSize,
        i1 = line.x1 * gSize
        i2 = line.x2 * gSize;
    rectangles.push(new OpaqueObject(new RectangleObject({
        topleft: new Vec2(i1, j),
        bottomright: new Vec2(i2, j + gSize),
        diffuse: 0.1
    }), 1));
}
var bgcol;

function start(obj) {
    var canvas = canvasMaze;
    var ctx = ctxMaze;
    var light = new Lamp({
        position: new Vec2(user.x, user.y),
        color: user.lightColor,
        radius: 0,
        samples: 3,
        distance: user.lightDist
    });
    var lighting = new Lighting({
        light: light,
        objects: obj
    });

    lighting.compute(canvas.width, canvas.height);

    ctx.fillStyle = bgcol;

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    obj.forEach(function (o) {
        ctx.fillStyle = bgcol;
        ctx.beginPath();
        o.path(ctx);
        ctx.fill();
    })
    lighting.render(ctx);

}

function gameStart(rows, cols, size,l) {
    window.sessionStorage.setItem("refresh",false);
    initialize(rows, cols, size,l);
    $('#level').html('<h1>level '+lvl+'</h1>');

    var fpsa = document.getElementById('fps');
    var updateCanvas = true;
    drawMaze();
    var i, j;
    var mouse = {};
    user = new User();
    window.addEventListener('keydown', function (e) {
        user.keydown(e);
    }, false);
    window.addEventListener('keyup', function (e) {
        user.keyup(e);

    }, false);


    for (i = 0; i < 2 * b + 1; i++)
    for (j = 0; j < 2 * a + 1; j++) {
        usableBlocks[i][j] = 0;
    };
    blocks.forEach(function (block) {
        var index;
        usableBlocks[block.split('-')[1]][block.split('-')[0]] = 1;
    })
    //    initialize();
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
            if (len >= 2)
            /*if(usableBlocks[i-1][j-1] == 1|| usableBlocks[i+1][j-1] == 1) 
                horlines.push({
                y: i,
                x1: s1,
                x2: e1-1,
                len: len-1
            });
              else
              */
            horlines.push({
                y: i,
                x1: s1,
                x2: e1,
                len: len - 1
            });


        } else if (usableBlocks[i][j] == 0) {
            s1 = j;
            e1 = j;
            while (j < (2 * a + 1) && usableBlocks[i][j] == 0) {
                e1++;
                j++;
            }
            len = e1 - s1;
            if (len >= 2) horfree.push({
                y: i,
                x1: s1,
                x2: e1,
                len: len,
                free: 1
            });

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
                if (len >= 2) if (usableBlocks[i - 1][j - 1] == 1 || usableBlocks[i - 1][j + 1] == 1) verlines.push({
                    x: j,
                    y1: s1,
                    y2: e1 - 1,
                    len: len - 1
                });
                else verlines.push({
                    x: j,
                    y1: s1,
                    y2: e1,
                    len: len
                });

            } else if (usableBlocks[i][j] == 0) {
                s1 = i;
                e1 = i;
                while (i < 2 * b + 1 && usableBlocks[i][j] === 0) {
                    e1++;
                    i++;
                }
                len = e1 - s1;
                if (len >= 2) verfree.push({
                    x: j,
                    y1: s1,
                    y2: e1,
                    len: len - 1,
                    free: 1
                });
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

    enemies = [];

    var fps = {
        startTime: 0,
        frameNumber: 0,
        getFPS: function () {
            this.frameNumber++;
            var d = new Date().getTime(),
                currentTime = (d - this.startTime) / 1000,
                result = Math.floor((this.frameNumber / currentTime));

            if (currentTime > 1) {
                this.startTime = new Date().getTime();
                this.frameNumber = 0;
            }
            return result;

        }
    };

    function initEnemies() {
        
        var i,indices=new Array();
        while(enemies.length<=verfree.length/3)
        {
            var index=Math.floor(Math.random()*verfree.length);
            if (index==0) index=1;
            if(indices.indexOf(index)==-1){
                indices.push(index);
                enemies.push(new Enemy(verfree[index]));
            }
        }
        enemies.forEach(function (e) {
            e.draw();
        });

    }
    initEnemies();
    bgcol = enemies[0].color||black;
    if (bgcol == 'white' || bgcol == '#000') {
        user.color = '#F1DC96';
        user.lightColor = 'black';
    }
    consequences();


    function drawLoop() {

        enemies.forEach(function (e) {
            e.move();
        });
        fpsa.innerHTML = fps.getFPS()
        user.move();
        if (user.killTime < 200) {
            user.killTime += 0.1;
        }
        enemies.forEach(function (e) {
            var dist = Math.sqrt(Math.pow(e.x - user.x, 2) + Math.pow(e.y - user.y, 2));
            if (user.killMode == true) {
                if (dist < user.lightDist) {
                    enemies.splice(enemies.indexOf(e), 1);
                    setTimeout(function () {
                        enemies.push(e)
                    }, 2000);
                }
            } else {
                if (dist < 2 * user.radius) {
                    user.keys = {
                        up: false,
                        down: false,
                        right: false,
                        left: false
                    };

                    end = 2;
                    stuff(0);
                }
            }

        })
        if (end != 2) requestAnimationFrame(drawLoop);
    }
    drawLoop();

};
var level = JSON.parse(window.sessionStorage.getItem("level"));
var refresh = window.sessionStorage.getItem("refresh");
if (level == null) gameStart();
else gameStart(level.a, level.b, level.gSize, level.level);

if(refresh=='true'){
    alert("Didn't your mom teach you to play fair? Back to level 0 for you.");
    window.sessionStorage.clear();
location.reload();}

