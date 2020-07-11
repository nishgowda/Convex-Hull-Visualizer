/*
    @file: convexhull.js
    @author: Nish Gowda
    @date: 07/10/20
    @about: Uses the divide and conquer algorithm to find the convex hull
    of a set of points drawn by the user on the canvas.
*/

$(document).ready(function(){
    let CANVAS = $("#mycanvas");
    let ctx = CANVAS.get(0).getContext("2d");
    let WIDTH = CANVAS.width();
    let HEIGHT = CANVAS.height();

    var points = [];
    var hull = [];
    let enabled = true;

    // Given the hull points and all points, connects the dots between all the 
    // hull points on the canvas.
    function drawConvex(hull, points){
        for (let i = 0; i < points.length; i++){
            point = [points[i].x, points[i].y];
        }
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        for(let i =0; i < hull.length; i ++){
            ctx.beginPath();
            ctx.moveTo(hull[i].x, hull[i].y);
            if (hull[i+1] != null){
                ctx.lineTo(hull[i+1].x, hull[i+1].y);
                ctx.stroke();
            }
            
        }
    }
    // Find the remaining points left inside the convex hull and draw them out on the canvas.
    function drawPoints(hull, points){
        if (!enabled) return;
        let availablePoints = []
        for (let i = 0; i < points.length; i++){
            for (let j = 0; j < hull.length; j++){
                if (points[i] != hull[j]){
                    availablePoints.push(points[i]);
                }
            }
        }

        ctx.fillStyle = "#1E90FF";
        for (let i = 0; i < availablePoints.length; i ++){
            ctx.beginPath();
            ctx.arc(availablePoints[i].x , availablePoints[i].y, 3, 0*Math.PI,1.5*Math.PI)
            ctx.fill()
            setTimeout(function () {
                enabled = true;
              }, 300);
        }
    }
    // Adds points when user clicks on the canvas, calls the convexHull, drawPoints, and drawPoints functions for each click.
    CANVAS.on('mousemove touchmove touchstart mousedown', addPoints);
    function addPoints(e){
        e.preventDefault();
        var offsetX = e.offsetX;
        var offsetY = e.offsetY;
        if (!enabled) return;
        if (e.which != 1) return;

        point = [offsetX, offsetY];
        fillPoint(point);
        points.push({x: point[0], y:point[1]});
        hull = convexHull(points)
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        drawPoints(hull, points);
        drawConvex(hull, points);
    }
    function fillPoint(point){
        ctx.fillStyle = "#1E90FF";
        ctx.beginPath();
        ctx.arc(point[0], point[1], 3, 0, Math.PI * 2, true)
        ctx.fill()
        setTimeout(function () {
            enabled = true;
          }, 300);
        }
    
    // Convex hull monotone chain convex hull algorithm algorithm implementation. 
    function convexHull(points){
        points.sort(compare);
        var L = [];
        for (var i = 0; i < points.length; i++) {
            while (L.length >= 2 && cross(L[L.length - 2], L[L.length - 1], points[i]) <= 0) {
                L.pop();
            }
            L.push(points[i]);
        }
        var U = [];
        for (var i = points.length - 1; i >= 0; i--) {
            while (U.length >= 2 && cross(U[U.length - 2], U[U.length - 1], points[i]) <= 0) {
                U.pop();
            }
            U.push(points[i]);
        }
        L.pop();
        U.pop();
        return L.concat(U);
    }
    function compare(a, b){
        return a.x == b.x ? a.y - b.y : a.x - b.x;
    }

    function cross(a, b, o) {
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    }
});