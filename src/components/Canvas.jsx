import React, { Component } from 'react';
import { ActionHistory, Mark } from 'utils/CanvasUtils';
import { CompactPicker } from 'react-color';


const socket = io.connect();

export class Canvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawing: false,
      canvasWidth: 0,
      canvasHeight: 0,
      brushColor: "#C45100", 
      brushSize: 8, 
    };
  }

  componentDidMount() {
    this.setState({
      canvasHeight: this.canvas.offsetHeight,
      canvasWidth: this.canvas.offsetWidth
    });
    this.ctx = this.canvas.getContext('2d');    
    this.clearCanvas = () => this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    this.actionHistory = new ActionHistory(this.clearCanvas);
    socket.emit('subscribe', 1)
    socket.on('update canvas', stroke => {
      const s = Object.values(stroke).map(s => s)
      s.shift()
      this.curMark = new Mark(this.ctx, ...s);
      this.curMark.reDraw.bind(this.curMark);
      this.curMark.reDraw();
      this.actionHistory.pushAction(this.curMark.reDraw.bind(this.curMark));
    })
    socket.on('undo', _ => { this.actionHistory.undoAction() })
    socket.on('redo', _ => { this.actionHistory.redoAction() })
    socket.on('clear', _ => { 
      this.clearCanvas();
      this.actionHistory.pushAction(() => this.clearCanvas())
    });
  }
  
  componentWillMount() {
    window.addEventListener('resize', () => this.setCanvasSize());
  }
  
  setCanvasSize(){
    this.setState({
      canvasHeight: this.canvas.offsetHeight,
      canvasWidth: this.canvas.offsetWidth
    });
    this.actionHistory.remakeCanvas();
  }

  
  startStroke(e) {
    let pos = this.xy(e);
    this.curMark = new Mark(this.ctx, this.state.brushColor, this.state.brushSize, pos);
    this.curMark.startStroke();
    this.setState({ drawing: true });
  }

  drawStroke(e) {
    if (this.state.drawing) {
      let pos = this.xy(e);
      this.curMark.addStroke(pos);
    }
  }

  endStroke(e) {
    if (this.state.drawing) {
      this.drawStroke(e);
      this.setState({ drawing: false });
      this.actionHistory.pushAction(this.curMark.reDraw.bind(this.curMark));
      const stroke = {
        threadID: 1,
        canvas: this.curMark
      }
      socket.emit('new stroke', stroke)
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
    this.clearCanvas();
    this.actionHistory.pushAction(() => this.clearCanvas());
    socket.emit('clear all')
  }

  undo() {
    this.actionHistory.undoAction();
    socket.emit('undo stroke')
  }

  save() {
    let img = this.canvas.toDataURL("image/png");
    document.getElementById('imgwrapper').innerHTML = "<img src='" + img + "'>";
  }

  redo() {
    this.actionHistory.redoAction();
    socket.emit('redo stroke')
  }

  setBrushColor(color) {
    this.setState({
      brushColor: color.hex
    });
  }

  render() {
    const canIDraw = this.props.user===this.props.drawer
    return (
      <div className="canvasContainer">
      <canvas 
      onMouseDown={canIDraw ? (e) => this.startStroke(e) : null}
      onMouseMove={canIDraw ? (e) => this.drawStroke(e) : null}
      onMouseOut={canIDraw ? (e) => this.endStroke(e) : null}
      onMouseUp={canIDraw ? (e) => this.endStroke(e) : null}
      className="canvas"
      width={this.state.canvasWidth}
      height={this.state.canvasHeight}
      ref={(canvas) => this.canvas = canvas}
      />
        <CanvasButton id='save' iconName='arrow-right' onClick={() => this.save()} />      
      <ColorCircle 
        radius={this.state.brushSize + 10} 
        color={this.state.brushColor} 
        onColorChange={(color) => this.setBrushColor(color)}
        />
        <div className="canvasOptions">
          <CanvasButton id="clear" iconName="square-o" onClick={canIDraw ? () => this.clear() : null} />
        <CanvasButton id='undo' iconName='undo' onClick={canIDraw ? () => this.undo() : null} />
        <CanvasButton id='redo' iconName='repeat' onClick={canIDraw ? () => this.redo() : null} />
        </div>
      </div>
      )
  }
}

export class CanvasButton extends Component {
  render() {
    return (
      <div className={`option ${this.props.id}`} onClick={this.props.onClick}>
        <i id={this.props.id} className={`fa fa-${this.props.iconName}`} aria-hidden="true"></i>
      </div>
      );
  }
}


export class ColorCircle extends Component {

  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false,
    };
  }

  toggleColorPicker() {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker
    });
  }

  hideColorPicker() {
    this.setState({
      displayColorPicker: false
    });
  }

  handleChange(color) {
    this.props.onColorChange(color);
    this.hideColorPicker();
  }

  render() {
    let circleStyle = {
      width: this.props.radius, 
      height: this.props.radius, 
      backgroundColor: this.props.color
    };

    let popoverStyle = {
      position: 'fixed',
      zIndex: '2',
      top:0,
      left:0,
      height:400,
      width:400,
    }

    return (
      <div className="brushOptions">
        <div className="colorCircle" onClick={() => this.toggleColorPicker()} style={circleStyle}></div>
        {this.state.displayColorPicker ?
          <div>
          <div className="cover" onClick={() => this.hideColorPicker()}/> 
          <CompactPicker
            className="colorPicker" 
            color={this.props.color} 
            onChange={(color) => this.handleChange(color)}
            />
          </div>
        : null}
      </div>
    );
  }
}


