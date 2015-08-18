function consequences() {
    var obj = [];
    if (user.collide()) console.log('Collision');
    for (i = 0; i < rectangles.length; i++) {
        if (Math.abs(rectangles[i].points[0].x - user.x) < 5 * gSize || Math.abs(rectangles[i].points[0].y - user.y) < 5 * gSize) {
            obj.push(rectangles[i]);

        }
    }
    start(obj);
    ctx2.clearRect(0, 0, width, height);
    user.draw();

}

function User() {
    this.x = gSize * 1.5;
    this.y = gSize / 2;
    this.xG = 1;
    this.yG = 0;
    this.color = 'white';
    this.keys = {
        up: false,
        down: false,
        right: false,
        left: false
    };

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

    keydown: function (evt) {
        updateCanvas = true;
        if(evt.keyCode==32){
            this.speed=gSize;
            this.color='red';
            user.draw();
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
        if(evt.keyCode==32){
            this.speed=gSize/2;
            this.color='white';
            this.draw();
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
        }
        else if (this.keys.up) {
            this.y -= this.speed;
            consequences();
        }
        else if (this.keys.right) {
            this.x += this.speed;
            consequences();
        }
        else if (this.keys.down) {
            this.y += this.speed;
            consequences();
        }
        if (this.y < gSize * 0.5) this.y = gSize * 0.5;
        else if (this.y >= height - this.radius) {
            end = 1;
            stuff();
        }
        
    },
    collide: function () {
        var collision = 0;
        this.xG = Math.floor((this.x) / gSize);

        this.yG = Math.floor((this.y) / gSize);
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
                //this.keys.left=false;
            } else if (this.keys.up) {
                this.y += this.speed;
                //this.keys.up=false;
            } else if (this.keys.right) {
                this.x -= this.speed;
                //this.keys.right=false;
            } else if (this.keys.down) {
                this.y -= this.speed;
                //this.keys.down=false;
            }

        }
        return collision;
    }
};