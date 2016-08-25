import React, { Component } from 'react';
import {ActionHistory} from './actionHistory';

export class Canvas extends Component {
    static propTypes = {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        name: React.PropTypes.string,
    };

    static defaultProps = {
        width: 400,
        height: 400,
        name: "canvas",
    };

    constructor(props) {
        super(props);
        this.state = {
            drawing: false, 
            undo: false
        };
        this.points = [];
        this.markHistory = [];
    }

    setDrawing() {
        this.setState({drawing: !this.state.drawing});
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');
        this.clearCanvas = () => this.ctx.clearRect(0,0,this.props.width, this.props.height);
        this.actionHistory = new ActionHistory(this.clearCanvas);
    }

    startStroke(e) {
        var pos = this.xy(e);
        this.curMark = new Mark(this.ctx, this.props.color, this.props.size, pos);
        this.setDrawing();
    }


    drawStroke(e) {
        if (this.state.drawing) {
            var pos = this.xy(e);
            this.curMark.addStroke(pos);
        }
    }


    endStroke(e) {
        if (this.state.drawing) {
            this.drawStroke(e);
            this.setDrawing();
            this.actionHistory.pushAction(this.curMark);
        }
    }

    xy(e) {
        const {top, left} = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - left,
            y: e.clientY - top
        }
    }

    clear() {
      var clear = new ClearAction(this.clearCanvas);
      clear.do();
      this.actionHistory.pushAction(clear);
    }

    undo() {
        this.actionHistory.undoAction();
    }

    save() {
        var img = this.canvas.toDataURL("image/png");
        document.getElementById('imgwrapper').innerHTML = "<img src='" + img + "'>";
    }

    redo() {
        this.actionHistory.redoAction();
    }

    render() {
        const {width, height, name} = this.props;
        return (
            <div>
            <canvas 
            onMouseDown={(e) => this.startStroke(e)}
            onMouseMove={(e) => this.drawStroke(e)}
            onMouseOut={(e) => this.endStroke(e)}
            onMouseUp={(e) => this.endStroke(e)}
            width={width}
            height={height}
            className={name}
            ref={(canvas) => this.canvas = canvas}
            />
            </div>
        )
    }
}

class Mark {
  constructor(ctx, color, size, startPosition) {
      this.ctx = ctx;
      this.color = color;
      this.size = size;
      this.points = [];
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = size;
      this.points.push({
        pos: startPosition,
        color: color,
        size: size 
      });
      this.ctx.beginPath();
      this.ctx.moveTo(startPosition.x, startPosition.y);
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

class ClearAction {
    constructor(clear) {
      this.clear = clear;
    }

    do() {
      this.clear();
    }
}
