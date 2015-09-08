function randomstring(L){
    var s= '';
    var randomchar=function(){
        var n= Math.floor(Math.random()*62);
        if(n<10) return n; //1-10
        if(n<36) return String.fromCharCode(n+55); //A-Z
        return String.fromCharCode(n+61); //a-z
    }
    while(s.length< L) s+= randomchar();
    return s;
}
window.begin = function (){
if (window.sessionStorage.getItem("level"))
{
    var level = JSON.parse(dyslexia(window.sessionStorage.getItem("level")));
}
else
    var level=null;
if (window.sessionStorage.getItem("refresh"))
var refresh = dyslexia(window.sessionStorage.getItem("refresh"));
else
var refresh=null;
if (level == null) {$('#minutes').hide();$('#strength').hide();$('#seconds').hide();gameStart();$("#splashscreen").show();}
else {
    flag=1;
    gameStart(level.a, level.b, level.gSize, level.level, level.score, level.lives);
}

if (refresh == 'true') {
clean();
    begin();
}
}
$('.enter_link').click(function() {
        $("#splashscreen").fadeOut(500);
        $("#content-container").show();
        sec = 0;
        flag=1;
        $('#minutes').show();
        $('#seconds').show();
        $('#strength').show();
        
 });
var flag=0,sec;
function stuff(win) {
    clearInterval(time);
    $('#boxes').show();
    $('#mask').fadeIn(1000);
    $('#mask').fadeTo("slow", 0.8);
    if (win == 1) {
        $('#success .window').css("background-color", "rgba(0,255,0,0.5)");
        $('#success').show();
    }
    if (win == 0) {
        $('#boxes .window').css("background-color", "rgba(255,0,0,0.5)");
        $('#failure').show();
        window.removeEventListener('keydown', DOWN, true);
    window.removeEventListener('keyup', UP, true);
        window.sessionStorage.setItem("refresh", dyslexia("true"));
    }
    
}
var animation;

function UP(event){
    user.keyup(event);
}
function DOWN(event){
    user.keydown(event);
}


function clean () {
    cancelAnimationFrame(animation);
    var a = $('#sheet');
    a.empty();

 /*   var parent = document.getElementById('sheet');
    var child = document.getElementById('light');
    parent.removeChild(child);
    child = document.getElementById('canvasMaze');
    parent.removeChild(child);
    child = document.getElementById('notlight');
    parent.removeChild(child);
    child = document.getElementById('canvasMotion');
    parent.removeChild(child);
    console.log(user);
    console.log(enemies[0]);*/
    rectangles.splice(0,rectangles.length);
    delete user;
    user = null;
    enemies.splice(0,enemies.length);
    var a = $('canvas');
    a.remove();
    console.log(enemies.length)
    /*for(i=0;i<a.length;i++)
    {
        var ctx = a[i].getContext("2d");
        ctx.clearRect(0,0,a[i].width,a[i].height);
        /*a[i].remove();
        if(a[i].parent().length!=0){
        a[i]=NULL;
    }
    }*/
}
function dyslexia(string){
    if(string ==null)
        return;
    else{
    return String.fromCharCode.apply(this,string.split('').map(function(a){
        return a.charCodeAt()^255;
    }))}
}
var update_stats = function () {

        // Updating stats
        var sec = parseInt($('#seconds').html(),10);
        sec +=parseInt($('#minutes').html()*60,10);
        var maxTime = (lvl+1)*20;
        score = ( maxTime-sec )*(lvl+1)*10;
        var score1 = (lvl+1)*100;
        score = score>score1?score:score1;
        
        $("#strength").html(score);
        $("#health").html(user.lives);
        $(".max-health").html(8);
        update_healthbar();

    };
    var update_healthbar = function () {

        var health_remaining = $("#health-remaining");
        var health_bar = $("#health-bar");

        var width = (user.lives / 8) * health_bar.width();

        health_remaining.width(width)

    };
function writeLvl(){
    var level = {
                a: a,
                b: b,
                gSize: gSize,
                level: lvl,
                lives: user.lives,
                score: sc + score
            };

            window.sessionStorage.setItem("level", dyslexia(JSON.stringify(level)));
}
$(document).keyup(function (e) {
    if (end == 1) {
        if (e.keyCode == 13 || e.keyCode == 27) {
            $('#success').hide();
            $('#failure').hide();
            if (b < 7) b++;
            if (a < 15) a++;
            if (b == 5) gSize = 50;
            else gSize = 40;
            lvl++;
            writeLvl();
            clean();
            end = 0;
            begin();
        }
    } else if (end == 2) {
        if (e.keyCode == 13 || e.keyCode == 27) {
            $('#success').hide();
            $('#failure').hide();
clean();

            end = 0;
            begin();
        }
    }
});

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
var score, sc , bleh, lvl, end, enemies, canvasMaze, ctxMaze, canvas2, ctx2, gSize, a, b, width, height, W, H, blocks, usableBlocks;
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
var rectangles = [],time;


function initialize(A, B, size, l,s) {
    sec = 0;
    function pad(val) {
        return val > 9 ? val : "0" + val;
    }
    time  = setInterval(function () {
        $("#seconds").html(pad(++sec % 60));
        $("#minutes").html(pad(parseInt(sec / 60, 10)));
    }, 1000);
    var c = $("<div>", {id: "sheet"});
    $("body").append(c);
    var c = $("<canvas>", {id: "canvasMaze"});
    $("#sheet").append(c);
    c = $("<canvas>", {id: "canvasMotion"});
    $("#sheet").append(c);
    c = $("<canvas>", {id: "notlight"});
    $("#sheet").append(c);
    c = $("<canvas>", {id: "light"});
    $("#sheet").append(c);
    canvasMaze = document.getElementById('canvasMaze');
    ctxMaze = canvasMaze.getContext('2d');

    //Properties
    gSize = size || 50;
    if(window.innerWidth>900)
    gSize = gSize*window.innerWidth/1366*0.9;    
    a = A || 6,
    b = B || 5;
    sc = s|0;
    lvl = l || 0;
    blocks = [],
    $("#gScore").html(sc);
    usableBlocks = createArray(2 * b + 1, 2 * a + 1);
    //var color = 'darkred';
    width = canvasMaze.width = (a * 2 + 1) * gSize;
    height = canvasMaze.height = (b * 2 + 1) * gSize;
    $('#stats-container').height(height);
    /*--------------------------CANVAS2--------------------------*/
    canvas2 = document.getElementById('light');
    ctx2 = canvas2.getContext('2d');
    canvas2.width = width;
    canvas2.height = height;
    canvas2 = document.getElementById('notlight');
    ctx2 = canvas2.getContext('2d');
    canvas2.width = width;
    canvas2.height = height;
    canvas2 = document.getElementById('canvasMotion');
    ctx2 = canvas2.getContext('2d');
    canvas2.width = width;
    canvas2.height = height;
    ctxMaze.clearRect(0, 0, width, height);
}
$(document).bind('DOMSubtreeModified', function () {
    //console.log("now there are " + $('canvas').length + " links on this page.");
})

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
function exit(){

    var canvas = document.getElementById('notlight');
    var ctx = canvas.getContext('2d');
    var light = new Lamp({
        position: new Vec2((2*a-.5)*gSize,(2*b+1)*gSize),
        color: user.lightColor,
        radius: 0,
        samples: 3,
        distance: 60    });
    var lighting = new Lighting({
        light: light,
        objects: rectangles
    });

    lighting.compute(canvas.width, canvas.height);
    lighting.render(ctx);
    ctx.fillStyle = bgcol;


}
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

function gameStart(rows, cols, size, l, s, life) {

    window.sessionStorage.setItem("refresh", dyslexia("false"));
    initialize(rows, cols, size, l,s);
    $('#level').html('<h2>Level ' + lvl + '</h2>');

    var fpsa = document.getElementById('fps');
    var updateCanvas = true;
    drawMaze();
    var i, j;
    var mouse = {};
    user = new User();
    user.speed = gSize / 6;
    console.log(user);
    user.lives = life||8;
$('#lives').html(user.lives);
    window.addEventListener('keydown', DOWN, true);
    window.addEventListener('keyup', UP, true);


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

        var i, indices = new Array();
        while (enemies.length <= verfree.length / 3) {
            var index = Math.floor(Math.random() * verfree.length);
            if (index == 0) index = 1;
            if (indices.indexOf(index) == -1) {
                indices.push(index);
                enemies.push(new Enemy(verfree[index]));
            }
        }
        enemies.forEach(function (e) {
            e.draw();
        });

    }
     initEnemies();
    //enemies.push(new Enemy(verfree[1]));
    bgcol = enemies[0].color || black;
    if (bgcol == 'white' || bgcol == '#000') {
        user.color = '#F1DC96';
        user.lightColor = 'black';
    }
    consequences();
    function ekill(e){
    
        e.color = "rgba(0,0,0,0.4)";
        e.ctx.clearRect(e.x - e.radius - 1, e.y - gSize, 2 * e.radius + 2, gSize * 1.5);
        e.draw();
        enemies.splice(enemies.indexOf(e), 1);
        setTimeout(function () {
            e.color = 'black';
            enemies.push(e)
        }, 2000*((lvl+3)/(lvl+1)));
    }
function scorer(){
        
    }
    function ukill(e){
        
        ekill(e);
        user.lives--;
        writeLvl();
        if (user.keys.left) {
            user.x += user.speed;
        } else if (user.keys.up) {
            user.y += user.speed;
        } else if (user.keys.right) {
            user.x -= user.speed;
        } else if (user.keys.down) {
            user.y -= user.speed;
        }
        $('#lives').html(user.lives);
            user.keys = {
                up: false,
                down: false,
                right: false,
                left: false
            };
            if(user.lives==0){
                end = 2;
                cancelAnimationFrame(animation);
                stuff(0);
                window.sessionStorage.clear();
            }
    }
    exit();
    function drawLoop() {
        update_stats();
        if(flag!=0)
        enemies.forEach(function (e) {
            e.move();
        });
        fpsa.innerHTML = fps.getFPS()
        user.move();
        if (user.killTime < 200) {
            user.killTime += 1;
        }
        enemies.forEach(function (e) {
            var dist = Math.sqrt(Math.pow(e.x - user.x, 2) + Math.pow(e.y - user.y, 2));
            if (user.killMode == true) {
                if (dist < user.lightDist) {
                    ekill(e);
                }
                else if (dist < 2 * user.radius) {
                    ukill(e);
                }

            } else {
                if (dist < 2 * user.radius) {
                    ukill(e);
                }
            }

        })
        console.log(enemies.length)
;       animation = requestAnimFrame(drawLoop);

    }
    drawLoop();

};

function reset(){
    window.sessionStorage.clear();
    clean();
    begin();
}
begin();