function Enemy(line) {
    this.x = line.x*gSize+gSize/2;
    this.y = line.y1*gSize+gSize/2;
    this.y1 = line.y1*gSize;
    this.y2 = line.y2*gSize;
    this.xG = line.x;
    this.yG = line.y1;
    this.color = 'red';
    this.radius = gSize / 4;
    this.speed = 1;
    this.canvas = document.getElementById('canvasMotion');
    this.ctx = this.canvas.getContext('2d');
    //console.log(this.canvas);
}
Enemy.prototype = {
    
    draw: function () {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
    },
    move: function () {
        this.y+=this.speed;
        this.collide();
        this.ctx.clearRect(this.x - this.radius, this.y - gSize, 2*this.radius, gSize*1.5);
        this.draw();
    },
    collide: function (key,collision) {
        var collision = 0;
        this.xG = Math.floor(this.x / gSize);

        this.yG = Math.floor((this.y + this.radius) / gSize);
        if (blocks.indexOf(this.xG + '-' + this.yG) != -1) 
            collision = 1;
        
        this.yG = Math.floor((this.y - this.radius) / gSize);
        if (blocks.indexOf(this.xG + '-' + this.yG) != -1) 
            collision = 1;
        
        
        if (collision) 
            this.speed=-this.speed;
    }
};