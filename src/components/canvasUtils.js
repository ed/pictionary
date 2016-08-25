export class ActionHistory {
	constructor(clear) {
		this.clear = clear;
		this.list = [];
		this.position = 0;
	}

	undoAction() {
		if( this.position > 0){
			this.clear();
			this.position--;
			for (var i = 0; i < this.position; i++){
				this.list[i].do();
			}
		}
	}

	pushAction(action) {
		this.list = this.list.slice(0,this.position);
		this.list.push(action);
		this.position = this.list.length;
	}

	redoAction() {
		if( this.position < this.list.length ){
			this.list[this.position].do();
			this.position++;
		}
	}
}

export class Mark {
  constructor(ctx, color, size, startPosition) {
    this.ctx = ctx;
    this.color = color;
    this.size = size;
    this.startPosition = startPosition;
    this.points = [];
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

  do() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].pos.x, this.points[0].pos.y);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.size;
    for (var j = 0; j < this.points.length; j++) {
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.size;
      this.ctx.lineTo(this.points[j].pos.x, this.points[j].pos.y);
    }
    this.ctx.stroke();
  }
}

export class ClearAction {
    constructor(clear) {
      this.clear = clear;
    }

    do() {
      this.clear();
    }
}