function consequences() {
    bleh=0;
    var obj = [];
    user.collide();
    for (i = 0; i < rectangles.length; i++) {
        if (Math.abs(rectangles[i].points[0].x - user.x) < user.lightDist*1.5 || Math.abs(rectangles[i].points[0].y - user.y) < user.lightDist*1.5) {
            obj.push(rectangles[i]);
        }
    }
    if (user.killMode) {
        if (user.killTime > 2) {
            user.killTime -= 10;
            if (user.killTime < 0) user.killTime = 1;
        }
        user.lightDist = 50 * user.killTime * 0.01;
    }


    start(obj);
    ctx2.clearRect(0, 0, width, height);
    user.draw();
}


function User() {
    this.lives = 8;
    this.x = gSize * 1.5;
    this.y = gSize / 2;
    this.xG = 1;
    this.yG = 0;
    this.life = 1;
    this.killMode = false;
    this.killTime = Math.floor(Math.sqrt(a * b)) * gSize *((lvl+1.5)/(lvl+1)) ;
    this.coolOff = false;
    this.color = 'white';
    this.lightColor = '#F1DC96';
    this.lightDist = Math.floor(Math.sqrt(a * b)) * gSize / 2;
    this.keys = {
        up: false,
        down: false,
        right: false,
        left: false
    };

    this.radius = gSize / 4;
    this.speed = gSize / 6;
}
User.prototype = {
    draw: function () {
        ctx2.fillStyle = this.color;
        ctx2.beginPath();
        ctx2.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx2.fill();
    },

    keydown: function (evt) {
        updateCanvas = true;
        if (evt.keyCode == 32) {
            this.killMode = true;
            this.lightColor = 'red';
            this.color = 'rgba(255,255,255,0.7)';
            this.lightDist = 50 * this.killTime * 0.01;
            consequences();

        }
        switch (evt.keyCode) {
            case 37:
                this.keys.left = true;
                break;
            case 38:
                this.keys.up = true;
                break;
            case 39:
                this.keys.right = true;
                break;
            case 40:
                this.keys.down = true;
                break;
        }

    },

    keyup: function (evt) {

        if (evt.keyCode == 32) {
            this.killMode = false;
            this.speed = gSize / 6;
            this.lightColor = '#F1DC96';
            this.color = 'white';
            this.lightDist = Math.floor(Math.sqrt(a * b)) * gSize / 2.5;
            consequences();

        }
        switch (evt.keyCode) {
            case 37:
                this.keys.left = false;
                break;
            case 38:
                this.keys.up = false;
                break;
            case 39:
                this.keys.right = false;
                break;
            case 40:
                this.keys.down = false;
                break;
        }
    },
    move: function (evt) {
        if (this.keys.left) {
            this.x -= this.speed;
            consequences();
        } else if (this.keys.up) {
            this.y -= this.speed;
            consequences();
        } else if (this.keys.right) {
            this.x += this.speed;
            consequences();
        } else if (this.keys.down) {
            this.y += this.speed;
            consequences();
        }
        if (this.y < gSize * 0.5) this.y = gSize * 0.5;
        else if (this.y >= height - this.radius) {
            end = 1;
            stuff(1);
        }

    },
    collide: function () {
        var collision = 0;
        this.xG = Math.floor((this.x+ this.radius) / gSize);

        this.yG = Math.floor((this.y) / gSize);
        if (blocks.indexOf(this.xG + '-' + this.yG) != -1) collision = 1;
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

            if (this.keys.left) {
                this.x += this.speed;
            } else if (this.keys.up) {
                this.y += this.speed;
            } else if (this.keys.right) {
                this.x -= this.speed;
            } else if (this.keys.down) {
                this.y -= this.speed;
            }

        }
        return collision;
    }
};