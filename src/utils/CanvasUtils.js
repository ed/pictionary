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
		this.actionList.push(action.action);
    this.rawActions.push({
      action: action.command,
      data: action.data
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

  exportData() {
    return this.rawActions.slice(0,this.position);
  }
}

export class Mark {
  constructor(ctx, color, size, startPosition, points=[]) {
    this.command = 'stroke';
    this.ctx = ctx;
    this.color = color;
    this.size = size;
    this.startPosition = startPosition;
    this.points = points
    this.action = (w,h) => this.reDraw(w,h);
  }

  startStroke(){
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.size;
    this.points.push({
      pos: this.startPosition,
      color: this.color,
      size: this.size 
    });
    this.ctx.beginPath();
    this.ctx.moveTo(this.startPosition.x, this.startPosition.y);
  }

  addStroke(pos){
    this.points.push({
      pos: pos,
      color: this.color,
      size: this.size 
    });
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  reDraw(width, height) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].pos.x*width, this.points[0].pos.y*height);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.size;
    for (var j = 0; j < this.points.length; j++) {
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.size;
      this.ctx.lineTo(this.points[j].pos.x*width, this.points[j].pos.y*height);
    }
    this.ctx.stroke();
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
