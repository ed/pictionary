$(document).ready(function() {
    var canvas, draw, ctx, cir, cir_ctx;
    var points = [];
    var hist = [];
    var redo_hist = [];
    var color = "black";
    var thickness = 5;

    function init() {
        canvas = document.getElementById('main');
        ctx = canvas.getContext("2d");
        cir = document.getElementById('circle');
        cir_ctx = cir.getContext("2d");
        cir_ctx.arc(25, 25, 25, 0, 2 * Math.PI, false);
        cir_ctx.fillStyle = color;
        cir_ctx.fill();
        d = new draw();
        canvas.addEventListener('mousemove', ev_canvas, false);
        canvas.addEventListener('mousedown', ev_canvas, false);
        canvas.addEventListener('mouseup', ev_canvas, false);
        canvas.addEventListener('mouseout', ev_canvas, false);
    }

    $("#colormenu").hide();
    $("#circle").mouseover(function(){
        $("#colormenu").slideDown('slow');
    });
    $("#wrapper").mouseleave(function () {
        $("#colormenu").slideUp('fast');
    });
    $("#wrapper").on('wheel', function(ev) {
        var delta = ev.originalEvent.deltaY;
        if (delta > 0) plus();
        else minus();
        return false;
    });

    document.getElementById('clear').addEventListener('click', function() {
        clear();
        hist = [];
        redo_hist = [];
    }, false);

    document.getElementById('undo').addEventListener('click', function() {
        undo();
        points = [];
    }, false);

    document.getElementById('redo').addEventListener('click', function() {
        redo();
        points = [];
    }, false);

    $(".colors").click(function() {
        var id = this.id
        change_color(id);
        cir_ctx.fillStyle = color;
        cir_ctx.fill();
    });


    function change_color(id) {
        switch (id) {
            case "#bfff00":
                color = "#bfff00";
            break;
            case "#0080ff":
                color = "#0080ff";
            break;
            case "red":
                color = "red";
            break;
            case "yellow":
                color = "yellow";
            break;
            case "#ffbf00":
                color = "#ffbf00";
            break;
            case "black":
                color = "black";
            break;
            case "white":
                color = "white";
            break;
        }
    }

    function minus() {
        if (thickness > 0)
            thickness = thickness - 2;
        else
            thickness = 1;
    }

    function plus() {
        if (thickness < 20)
            thickness = thickness + 2;
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points = [];
    }

    function redraw() {
        for (var i = 0; i < hist.length; i++) {
            points = hist[i];
            ctx.beginPath();
            ctx.moveTo(points[0].pos.x, points[0].pos.y);
            ctx.strokeStyle = points[0].color;
            ctx.lineWidth = points[0].thickness;
            for (var j = 0; j < points.length; j++) {
                pts = points[j];
                ctx.strokeStyle = pts.color;
                ctx.lineWidth = pts.thickness;
                ctx.lineTo(pts.pos.x, pts.pos.y);
            }
            ctx.stroke();
        }
    }

    function undo() {
        if (hist.length > 0) {
            clear();
            redo_hist.push(hist[hist.length - 1]);
            hist.pop()
            redraw();
        }
    }

    function redo() {
        if (redo_hist.length > 0) {
            clear();
            hist.push(redo_hist[redo_hist.length - 1]);
            redo_hist.pop()
            redraw();
        }
    }

    function xy(ev) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: ev.clientX - rect.left,
            y: ev.clientY - rect.top
        }
    }


    function draw() {
        var d = this;
        this.drawing = false;

        this.mousedown = function(ev) {
            var pos = xy(ev);
            ctx.strokeStyle = color;
            ctx.lineWidth = thickness;
            points.push({
                pos: pos,
                color: color,
                thickness: thickness
            });
            ctx.beginPath();
            ctx.moveTo(ev._x, ev._y);
            d.drawing = true;
            last = pos;
        };

        this.mousemove = function(ev) {
            if (d.drawing) {
                var pos = xy(ev);
                points.push({
                    pos: pos,
                    color: color,
                    thickness: thickness
                });
                ctx.lineTo(ev._x, ev._y);
                ctx.stroke();
            }
        };

        this.mouseout = function(ev) {
            if (d.drawing) {
                d.mousemove(ev);
                d.drawing = false;
                hist.push(points);
                points = []
            }
        };

        this.mouseup = function(ev) {
            if (d.drawing) {
                d.mousemove(ev);
                d.drawing = false;
                hist.push(points);
                points = []
            }
        };
    }

    function ev_canvas(ev) {
        if (ev.layerX || ev.layerY == 0) {
            ev._x = ev.layerX;
            ev._y = ev.layerY;
        }

        var func = d[ev.type];
        if (func) {
            func(ev);
        }
    }
    init();
});
