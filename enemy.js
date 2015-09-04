function Enemy(line) {
    this.x = line.x * gSize + gSize / 2;
    this.y = line.y1 * gSize + gSize / 2;
    this.y1 = line.y1 * gSize;
    this.y2 = line.y2 * gSize;
    this.xG = line.x;
    this.yG = line.y1;
    this.color = 'black';
    this.speedMag = 2;//(level<2)?2:Math.floor(Math.random() * 4) + 1;
    this.radius = gSize / 4;
    this.speed={
        y : this.speedMag,
        x : 0
    };
    this.dir = {
        up: false,
        down: true,
        right: false,
        left: false
    };
    this.canvas = document.getElementById('light');
    this.ctx = this.canvas.getContext('2d');
    console.log(usableBlocks)
}
Enemy.prototype = {
    clearCircle : function(x, y, radius,context)
{
    context.save();
    context.beginPath();
    radius +=3;
    context.arc(x, y, radius, 0, 2*Math.PI, true);
    context.clip();
    context.clearRect(x-radius,y-radius,radius*2,radius*2);
    context.restore();
},

    draw: function () {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
    },
    move: function () {
        this.y += this.speed.y;
        this.x += this.speed.x;
        this.collide();
        this.clearCircle(this.x,this.y,this.radius,this.ctx)
        //this.ctx.clearRect(0,0,width,height);
        //.ctx.arc(this.x, y, radius, 0, Math.PI*2, true);
        //this.ctx.clip();
        //this.ctx.clearRect(this.x - this.radius-3, this.y - this.radius-3, 2*this.radius+6, 2*this.radius+6);
        this.draw();
    },
    dirchange: function (dir) {
        if(this.dir.up){
            this.y += 2*this.speedMag;
            this.dir.up = false;
        }
        else if(this.dir.down){
            this.y -= this.speedMag;
            this.dir.down = false;
        }
        else if(this.dir.right){
            this.x -= this.speedMag;
            this.dir.right = false;
        }
        else if(this.dir.left){
            this.x += 2*this.speedMag;
            this.dir.left = false;
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

        if (collision){
            var free = new Array();
            var i = Math.floor(this.x / gSize);
            var j = Math.floor(this.y / gSize);
            if(usableBlocks[j+1][i]==0)
                free.push('down');
            if(i>0)
            if(usableBlocks[j-1][i]==0)
                free.push('up');
            if(usableBlocks[j][i-1]==0)
                free.push('left');
            if(usableBlocks[j][i+1]==0)
                free.push('right');
            var dir = free[Math.floor(Math.random()*free.length)];
            console.log(i,j,free,dir);
            switch(dir){
                case 'right':
                    this.dirchange();
                    this.speed={
                        x: this.speedMag,
                        y: 0
                    };
                    this.dir.right = true;
                    break;
                case 'left':
                this.dirchange();
                    this.speed={
                        x: -this.speedMag,
                        y: 0
                    };
                    this.dir.left = true;
                    break;
                case 'up':
                this.dirchange();
                    this.speed={
                        y: -this.speedMag,
                        x: 0
                    };
                    this.dir.up = true;
                    break;
                case 'down':
                this.dirchange();
                    this.speed={
                        y: +this.speedMag,
                        x: 0
                    };
                    this.dir.down = true;
                    break;
                
            }
        }
    }
};