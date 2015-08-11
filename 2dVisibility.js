/*
Inspired by http://ncase.me/sight-and-light/
*/
function Torch(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.clearColor = "#FFFFFF";
    this.walls = [];
    this.hitpoints = [];
}

Torch.prototype = {
    addWalls: function(x1,y1,x2,y2){
        this.walls.push(new Wall(new Point(x1, y1), new Point(x2, y2)));
    },
    start: function () {
        this.update();
        this.draw();
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        user.draw();
    },
    update: function () {
        var mouseX = mouse.mouseX;
        var mouseY = mouse.mouseY;
        this.hitpoints = [];
        // For every wall...
        for (var i = 0; i < this.walls.length; i++) {
            var wall = this.walls[i];
            // Cast a ray to every point of the current wall
            for (var j = 0; j < wall.points.length; j++) {
                var closestPoint;
                if (j == 0) closestPoint = wall.p1;
                if (j == 1) closestPoint = wall.p2;
                var ray = new Wall(new Point(mouseX, mouseY), new Point(closestPoint.x, closestPoint.y));
                var minDistance = ray.length();
                // Check every wall for intersection
                for (var k = 0; k < this.walls.length; k++) {
                    var checkWall = this.walls[k];
                    if (wall != checkWall) {
                        if (checkWall.intersectsWith(ray)) {
                            // If checkWall intersects with our ray we have to check it's intersection point's distance
                            // If the distance is smaller than the current minimum set intersectionPoint as the closest
                            // point and save the distance.
                            var intersectionPoint = checkWall.intersectionPoint(ray);
                            var tempRay = new Wall(new Point(mouseX, mouseY), new Point(intersectionPoint.x, intersectionPoint.y));
                            if (tempRay.length() < minDistance) {
                                closestPoint = intersectionPoint;
                                minDistance = tempRay.length();
                            }
                        }
                    }
                }
                this.hitpoints.push(closestPoint);
            }
        }
    },
    draw: function () {
        this.clear();
        this.context.save();
        // Render all the walls
        this.context.beginPath();
        for (var i = 0; i < this.walls.length; i++) {
            var wall = this.walls[i];
            this.context.moveTo(wall.p1.x, wall.p1.y);
            this.context.lineTo(wall.p2.x, wall.p2.y);
        }
        this.context.stroke();
        // Render cursor's position
        var mouseX = mouse.mouseX;
        var mouseY = mouse.mouseY;
        // Render all the hitpoints
        this.context.strokeStyle = "#FF0000",
        this.context.beginPath();
        for (var i = 0; i < this.hitpoints.length; i++) {
            var hitpoint = this.hitpoints[i];
            this.context.moveTo(mouseX, mouseY);
            this.context.lineTo(hitpoint.x, hitpoint.y);
        }
        this.context.stroke();
        this.context.restore();
    }
}

function Wall(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.points = [p1, p2];

    this.length = function () {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    this.direction = function () {
        var vLength = this.length();
        return new Point((p2.x - p1.x) / vLength, (p2.y - p1.y) / vLength);
    }
    /*
    Lines can be described by some initial vector, v, and a direction vector, d:

    r = v + lambda*d 
    We use one point (a,b) as the initial vector and the difference between them (c-a,d-b) as the direction vector. Likewise for our second line.

    If our two lines intersect, then there must be a point, X, that is reachable by travelling some distance, lambda, along our first line and also reachable by travelling gamma units along our second line. This gives us two simultaneous equations for the coordinates of X:

    X = v1 + lambda*d1 
    X = v2 + gamma *d2
    These equations can be represented in matrix form. We check that the determinant is non-zero to see if the intersection X even exists.

    If there is an intersection, then we must check that the intersection actually lies between both sets of points. If lambda is greater than 1, the intersection is beyond the second point. If lambda is less than 0, the intersection is before the first point.

    Hence, 0<lambda<1 && 0<gamma<1 indicates that the two lines intersect!
    */
    this.intersectsWith = function (wall) {
        var a = this.p1;
        var b = this.p2;
        var c = wall.p1;
        var d = wall.p2;
        var cmp = new Point(c.x - a.x, c.y - a.y);
        var r = new Point(b.x - a.x, b.y - a.y);
        var s = new Point(d.x - c.x, d.y - c.y);

        var cmpxr = cmp.x * r.y - cmp.y * r.x;
        var cmpxs = cmp.x * s.y - cmp.y * s.x;
        var rxs = r.x * s.y - r.y * s.x;
        if (cmpxr == 0) return ((c.x - a.x < 0) != (c.x - b.x < 0)) || ((c.y - a.y < 0) != (c.y - b.y < 0));
        if (rxs == 0) return false;

        var rxsr = 1 / rxs;
        var t = cmpxs * rxsr;
        var u = cmpxr * rxsr;
        return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
    }

    this.intersectionPoint = function (wall) {
        var a = this.p1;
        var b = this.p2;
        var c = wall.p1;
        var d = wall.p2;

        var divider = ((a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x));
        if (divider == 0) return new Point(0, 0);
        var intersectionX = ((a.x * b.y - a.y * b.x) * (c.x - d.x) - (a.x - b.x) * (c.x * d.y - c.y * d.x)) / divider;
        var intersectionY = ((a.x * b.y - a.y * b.x) * (c.y - d.y) - (a.y - b.y) * (c.x * d.y - c.y * d.x)) / divider;

        return new Point(intersectionX, intersectionY);
    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}
