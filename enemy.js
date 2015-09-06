function Enemy(line) {
    this.x = line.x * gSize + gSize / 2;
    this.y = line.y1 * gSize + gSize / 2;
    this.y1 = line.y1 * gSize;
    this.y2 = line.y2 * gSize;
    this.xG = line.x;
    this.yG = line.y1;
    this.color = 'black';
    this.speedMag = 1;//(level<2)?2:Math.floor(Math.random() * 4) + 1;
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
        //this.clearCircle(this.x,this.y,this.radius,this.ctx)
        //this.ctx.clearRect(0,0,width,height);
        //.ctx.arc(this.x, y, radius, 0, Math.PI*2, true);
        //this.ctx.clip();
        this.ctx.clearRect(this.x - this.radius-3, this.y - this.radius-3, 2*this.radius+6, 2*this.radius+6);
        this.draw();
    },
    dirchange: function () {
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
    dirchange2: function () {
        if(this.dir.up){
            this.y += 2*this.speedMag;
            this.dir.up = false;
            this.dir.down = true;
        }
        else if(this.dir.down){
            this.y -= this.speedMag;
            this.dir.down = false;
            this.dir.up = true;
        }
        else if(this.dir.right){
            this.x -= this.speedMag;
            this.dir.right = false;
            this.dir.left = true;
        }
        else if(this.dir.left){
            this.x += 2*this.speedMag;
            this.dir.left = false;
            this.dir.right = true;
        }
        
    },
    collide: function () {
        for(var i=0;i<enemies.length;i++){
            e = enemies[i];
            if (e!=this)
            {   
                var dist = Math.sqrt(Math.pow(e.x - this.x, 2) + Math.pow(e.y - this.y, 2));
                if(dist<(e.radius + this.radius))
                {
                    e.dirchange2();
                    this.dirchange2();
                    e.speed.x = -e.speed.x;
                    e.speed.y = -e.speed.y;
                    this.speed.y = -this.speed.y;
                    this.speed.x = -this.speed.x;
                }
            }
        };
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
        if (this.y < gSize * 0.5) {
            this.speed.y = -this.speed.y;
            this.dirchange2()}
        else if (this.y > (2*b+1)*gSize) {
            this.speed.y = -this.speed.y;
            this.dirchange2()}
        if (collision){
            var free = new Array();
            var i = Math.floor(this.x / gSize);
            var j = Math.floor(this.y / gSize);
            if(j<2*b+1)
            if(usableBlocks[j+1][i]==0)
                free.push('down');
            if(j>0)
            if(usableBlocks[j-1][i]==0)
                free.push('up');
            if(i>0)
            if(usableBlocks[j][i-1]==0)
                free.push('left');
            if(j<2*a+1)
            if(usableBlocks[j][i+1]==0)
                free.push('right');
            var dir = free[Math.floor(Math.random()*free.length)];
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