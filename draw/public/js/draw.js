$(document).ready(function() {
  var canvas, draw, ctx, cir, cir_ctx, cursor, cursorctx;
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
    new_cursor();
    d = new draw();
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mouseup', ev_canvas, false);
    canvas.addEventListener('mouseout', ev_canvas, false);
  }


  $("#wrapper").mouseover(function() {
    $("#colormenu").slideDown('fast');
  });
  $(".controlclear").mouseenter(function() {
    $(".controlclear").css("color", "red")
  });
  $(".controlclear").mouseleave(function() {
    $(".controlclear").css("color", "black")
  });
  $(".controlundo").mouseenter(function() {
    $(".controlundo").css("color", "blue")
  });
  $(".controlundo").mouseleave(function() {
    $(".controlundo").css("color", "black")
  });
  $(".controlredo").mouseenter(function() {
    $(".controlredo").css("color", "yellow")
  });
  $(".controlredo").mouseleave(function() {
    $(".controlredo").css("color", "black")
  });
  $(".controlsave").mouseenter(function() {
    $(".controlsave").css("color", "green")
  });
  $(".controlsave").mouseleave(function() {
    $(".controlsave").css("color", "black")
  });
  $("#colormenu").mouseleave(function() {
    $("#colormenu").slideUp('fast');
  });
  $("#wrapper").on('wheel', function(ev) {
    var delta = ev.originalEvent.deltaY;
    // var delta = (ev.detail<0 || ev.wheelDelta>0) ? 1 : -1;
    if (delta > 0) plus();
    else minus();
    return false;
  });

  document.getElementById('clear').addEventListener('click', function() {
    clear();
    hist = [];
    redo_hist = [];
    points = [];
  }, false);

  document.getElementById('undo').addEventListener('click', function() {
    undo();
    points = [];
  }, false);

  document.getElementById('redo').addEventListener('click', function() {
    redo();
    points = [];
  }, false);
  
  document.getElementById('save').addEventListener('click', function() {
    save();
  }, false);

  $(".colors").click(function() {
    var id = this.id
    color = id;
    cir_ctx.fillStyle = color;
    cir_ctx.fill();
    new_cursor();
  });

  function minus() {
    console.log(thickness)
    if (thickness > 1)
      thickness -= .05;
    else
      thickness = 1
    new_cursor();
  }

function save() {
    img = canvas.toDataURL("image/png");
    document.getElementById('imgwrapper').innerHTML = "<img src='" + img + "'>";
  }

  function plus() {
    console.log(thickness)
    if (thickness < 15)
      thickness += .05;
    else
      thickness = 15;
    new_cursor();
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

    this.mouseup = function(ev) {
      if (d.drawing) {
        d.mousemove(ev);
        d.drawing = false;
        hist.push(points);
        points = []
      }
    };

    this.mouseout = function(ev) {
      d.mouseup(ev);
    }
  }

  function new_cursor() {
    cursor = document.createElement('canvas'),
      cursorctx = cursor.getContext('2d');
    if (thickness > 4) {

      var cursorLeft = cursor.offsetLeft;
      cursorRight = cursor.offsetTop;

      cursor.width = thickness * 2.5;
      cursor.height = thickness * 2.5;

      cursorctx.fillStyle = color;
      cursorctx.arc(thickness, thickness, thickness, 0, 2 * Math.PI, false);
      cursorctx.fill();
      document.body.style.cursor = 'url(' + cursor.toDataURL() + '), auto';
    } else {
      document.body.style.cursor = 'default';
    }

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
