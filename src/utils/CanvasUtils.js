export class ActionHistory {
	constructor(clearCanvas) {
		this.clearCanvas = clearCanvas;
		this.actionList = [];
    this.rawActions = [];
		this.position = 0;
	}

	undoAction(w,h) {
		if( this.position > 0){
			this.position--;
      this.remakeCanvas(w,h);
		}
	}

  remakeCanvas(w,h) {
    this.clearCanvas();
    for (var i = 0; i < this.position; i++){
				var action = this.actionList[i];
				action(w,h);
			}
  }

	pushAction(action) {
		this.actionList = this.actionList.slice(0,this.position);
    this.rawActions = this.rawActions.slice(0,this.position);
		this.actionList.push(action.action);
    this.rawActions.push({
      action: action.command,
      data: action.points
    });
		this.position = this.actionList.length;
	}

	redoAction(w,h) {
		if( this.position < this.actionList.length ){
			var action = this.actionList[this.position];
			action(w,h);
			this.position++;
		}
	}

  clearHistory() {
    this.position = 0;
    this.actionList = [];
  }

  raw() {
    return this.rawActions.slice(0,this.position);
  }
}

export class Mark {
  constructor(canvas, ctx, perm_ctx, color, size, startPosition, points=[]) {
    this.command = 'stroke';
    this.ctx = ctx;
		this.ctx.lineJoin = 'round';
	  this.ctx.lineCap = 'round';
    this.color = color;
    this.size = size;
    this.startPosition = startPosition;
    this.points = points;
		this.perm_ctx = perm_ctx;
		this.canvas = canvas;
    this.action = (w,h,s) => this.reDraw(w,h,s);
  }

  startStroke(w,h){
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.size;
		this.curWidth = w;
		this.curHeight = h;
    this.addStroke(this.startPosition);
  }

	addPoint(pos) {
		this.points.push({
      pos: {x: pos.x/this.curWidth, y: pos.y/this.curHeight},
      color: this.color,
      size: this.size
    });
	}

  addStroke(pos) {
	  this.addPoint(pos);
		this.draw();
  }

	draw(size) {
		let ppts = this.points.map((point) => { return { x: point.pos.x*this.curWidth, y: point.pos.y*this.curHeight } });
		this.ctx.strokeStyle = this.points[0].color;
    this.ctx.lineWidth = size;
		this.ctx.fillStyle = this.points[0].color;
		if (ppts.length < 3) {
			var b = ppts[0];
			this.ctx.beginPath();
			this.ctx.arc(b.x, b.y, this.ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			this.ctx.fill();
			this.ctx.closePath();

			return;
		}

		// Tmp canvas is always cleared up before drawing.
		this.ctx.clearRect(0, 0, this.curWidth, this.curHeight);

		this.ctx.beginPath();
		this.ctx.moveTo(ppts[0].x, ppts[0].y);

		for (var i = 1; i < ppts.length - 2; i++) {
			var c = (ppts[i].x + ppts[i + 1].x) / 2;
			var d = (ppts[i].y + ppts[i + 1].y) / 2;

			this.ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
		}

		// For the last 2 points
		this.ctx.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
		this.ctx.stroke();
	}

  reDraw(width, height, size=this.points[0].size, ctx=this.perm_ctx) {
		this.curWidth = width;
		this.curHeight = height;
    this.draw(size);
		this.perm_ctx.drawImage(this.canvas,0,0);
		this.ctx.clearRect(0,0,width, height);
  }

  scalePoints(width, height) {
    this.points = this.points.map((point) => {
      point.pos.x /= width;
      point.pos.y /= height;
      return point;
    });
    this.data = this.points;
  }
}

export class ClearCanvas {
  constructor(action) {
    this.command = 'clear';
    this.action = action;
    this.data = {};
  }
}
