window.ps = window.ps || {};

ps.Particle = function (pos, angle, speed, life, radius, r,g,b) {
    var colors = ['red', 'blue', 'purple'];
    this.pos = {
        x: pos.x,
        y: pos.y
    };
    this.speed=speed;
    this.vel = {
        x: speed.x * Math.cos(this.toRad(angle)),
        y: speed.y * Math.sin(this.toRad(angle))
    };
    var r = Math.round(Math.random()*255),
        g = Math.round(Math.random()*255),
        b = Math.round(Math.random()*255);
    this.r=r;
    this.g=g;
    this.b=b;
    this.radius = radius;
    //this.life = this.startingLife = life;
    this.originalLife = this.life = life;
    this.originalradius = radius;
    this.alpha = 1;
};

ps.Particle.prototype={
    update :function (dt) {
    this.life -= dt;

    if (this.life > 0) {
        var ageRatio = this.life / this.originalLife;
        this.radius = this.originalradius * ageRatio;
        this.alpha = ageRatio;
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
    }
},
    toRad : function (degrees) {
        return degrees * Math.PI / 180;
    }
};