import React, { Component } from 'react';
import { ActionHistory, Mark } from 'utils/CanvasUtils';

export class Canvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawing: false,
      canvasWidth: 0,
      canvasHeight: 0, 
    };
    this.markHistory = [];
  }

  componentDidMount() {
    this.setState({
      canvasHeight: this.canvas.offsetWidth,
      canvasWidth: this.canvas.offsetHeight
    });
    this.ctx = this.canvas.getContext('2d');
    this.clearCanvas = () => this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    this.actionHistory = new ActionHistory(this.clearCanvas);
  }

  startStroke(e) {
    var pos = this.xy(e);
    this.curMark = new Mark(this.ctx, this.props.color, this.props.size, pos);
    this.curMark.startStroke();
    this.setState({ drawing: true });
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
      this.setState({ drawing: false });
      this.actionHistory.pushAction(this.curMark.reDraw.bind(this.curMark));
    }
  }

  xy(e) {
    const {top, left} = this.canvas.getBoundingClientRect();
    console.log(top)
    console.log(left)
    return {
      x: e.clientX - left,
      y: e.clientY - top
    }
  }

  clear() {
    this.clearCanvas();
    this.actionHistory.pushAction(() => this.clearCanvas());
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
    return (
      <div className="canvasContainer">
      <canvas 
      onMouseDown={(e) => this.startStroke(e)}
      onMouseMove={(e) => this.drawStroke(e)}
      onMouseOut={(e) => this.endStroke(e)}
      onMouseUp={(e) => this.endStroke(e)}
      className="canvas"
      width={window.innerWidth}
      height={window.innerHeight}
      ref={(canvas) => this.canvas = canvas}
      />
      <div className="options">
      <CanvasButton class='clear' text='clear' onClick={() => this.clear()} />
      <CanvasButton class='undo' text='undo' onClick={() => this.undo()} />
      <CanvasButton class='redo' text='redo' onClick={() => this.redo()} />
      <CanvasButton class='save' text='save' onClick={() => this.save()} />
      </div>
      </div>
      )
  }
}


export class SizeOptions extends Component {
  render() {
    return (
      <div className={this.props.class} style={{marginBottom:20}}>
      <label htmlFor="">size: </label>
      <input min="1" max="20" type="range" value={this.props.size} onChange={this.props.onChange} />
      </div>
      );
  }
}


export class ColorOptions extends Component {
  render() {
    return (
      <div className={this.props.class} style={{marginBottom:20}}>
      <label htmlFor="">color: </label>
      <input type="color" value={this.props.color} onChange={this.props.onChange} />
      </div>
      );
  }
}


export class CanvasButton extends Component {
  render() {
    return (
      <button className={this.props.class} onClick={this.props.onClick}>
      {this.props.text}
      </button>
      );
  }
}
