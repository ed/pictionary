import React, { Component } from 'react';
import { ActionHistory, Mark, ClearCanvas } from '../utils/CanvasUtils';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';


export default class CanvasViewOnly extends Component {

  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: 0,
      canvasHeight: 0,
    };
    this.remakeCanvasRemote = () => null;
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.perm_ctx = this.perm_canvas.getContext('2d');
    this.clearCanvas = () => this.perm_ctx.clearRect(0,0,this.state.canvasWidth, this.state.canvasHeight);
    this.setCanvasSize();
    if (this.props.canvasData) {
      this.buildRemoteCanvas(this.props.canvasData);
    }
  }

  buildRemoteCanvas(canvasData) {
    this.clearCanvas();
    for (let i = 0; i < canvasData.length; i++) {
      if(canvasData[i].action == 'stroke') {
        let mark = new Mark(this.canvas, this.ctx,this.perm_ctx,null,null,null,canvasData[i].data);
        mark.action(this.state.canvasWidth, this.state.canvasHeight, 2);
      }
      else {
        this.clearCanvas();
      }
    }
    this.remakeCanvasRemote = () => this.buildRemoteCanvas(canvasData);
  }

  setCanvasSize() {
    if (this.canvas) {
      this.setState({
        canvasHeight: this.canvas.offsetHeight,
        canvasWidth: this.canvas.offsetWidth
      }, () => this.remakeCanvasRemote());
    }
    else {
      setTimeout(() => this.setCanvasSize, 1000);
    }
  }

  render() {
    return (
      <div className="canvasContainer">
      <canvas
        className="perm_canvas"
        width={this.state.canvasWidth}
        height={this.state.canvasHeight}
        ref={(canvas) => this.perm_canvas = canvas}
        />
        <canvas
        className="canvas"
        width={this.state.canvasWidth}
        height={this.state.canvasHeight}
        ref={(canvas) => this.canvas = canvas}
        />
      </div>
      )
    }
}
