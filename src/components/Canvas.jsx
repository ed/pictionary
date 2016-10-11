import React, { Component } from 'react';
import { ActionHistory, Mark, ClearCanvas } from '../utils/CanvasUtils';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';


class Canvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawing: false,
      canvasWidth: 0,
      canvasHeight: 0,
      brushColor: "#C45100", 
      brushSize: 8, 
      guessers: [],
      turnOver: false
    };
    this.remakeCanvasRemote = () => null;
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');    
    this.clearCanvas = () => this.ctx.clearRect(0,0,this.state.canvasWidth, this.state.canvasHeight);
    this.actionHistory = new ActionHistory(this.clearCanvas);
    this.props.socket.on('update canvas', canvasData => this.buildRemoteCanvas(canvasData));
    this.props.socket.on('turn over', guessers => this.setState({
      turnOver: true,
      guessers
    }));
    this.setCanvasSize();
    if (this.props.canvasData) {
      this.buildRemoteCanvas(this.props.canvasData);
    }

    key('ctrl + z', () => this.undo());
    key('ctrl + y', () => this.redo());
    key('ctrl + c', () => this.clear());
  }

  componentWillUnmount() {
    key.unbind('ctrl + z');
    key.unbind('ctrl + y');
    key.unbind('ctrl + c');
    this.props.socket.off('turn over');
    this.props.socket.off('update canvas');
  }

  buildRemoteCanvas(canvasData) {
    this.clearCanvas();
    for (let i = 0; i < canvasData.length; i++) {
      if(canvasData[i].action == 'stroke') {
        let mark = new Mark(this.ctx,null,null,null,canvasData[i].data);
        mark.action(this.state.canvasWidth, this.state.canvasHeight);
      }
      else {
        this.clearCanvas();
      }
    }
    this.remakeCanvasRemote = () => this.buildRemoteCanvas(canvasData);
  }
  
  componentWillMount() {
    window.addEventListener('resize', () => this.setCanvasSize());
  }

  remakeCanvas() {
    if (this.canIDraw){
      this.actionHistory.remakeCanvas(this.state.canvasWidth, this.state.canvasHeight);
    }
    else {
      this.remakeCanvasRemote();
    }
  }

  setCanvasSize(){
    if (this.canvas) {
      this.setState({
        canvasHeight: this.canvas.offsetHeight,
        canvasWidth: this.canvas.offsetWidth
      }, () => this.remakeCanvas());
    }
    else {
      setTimeout(() => this.setCanvasSize, 1000);
    }
  }

  
  startStroke(e) {
    let pos = this.xy(e);
    this.curMark = new Mark(this.ctx, this.state.brushColor, this.state.brushSize, pos);
    this.curMark.startStroke();
    this.setState({ drawing: true });
    e.preventDefault();
  }

  drawStroke(e) {
    if (this.state.drawing) {
      let pos = this.xy(e);
      this.curMark.addStroke(pos);
    }
    e.preventDefault();
  }

  endStroke(e) {
    if (this.state.drawing) {
      this.drawStroke(e);
      this.setState({ drawing: false });
      this.curMark.scalePoints(this.state.canvasWidth, this.state.canvasHeight);
      this.actionHistory.pushAction(this.curMark);
      this.props.socket.emit('client update canvas', this.actionHistory.exportData());
    }
    e.preventDefault();
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
    this.actionHistory.pushAction(new ClearCanvas(() => this.clearCanvas()));
    this.props.socket.emit('client update canvas', this.actionHistory.exportData());
  }

  undo() {
    this.actionHistory.undoAction(this.state.canvasWidth, this.state.canvasHeight);
    this.props.socket.emit('client update canvas', this.actionHistory.exportData());
  }

  save() {
    let img = this.canvas.toDataURL("image/png");
    document.getElementById('imgwrapper').innerHTML = "<img src='" + img + "'>";
  }

  redo() {
    this.actionHistory.redoAction(this.state.canvasWidth, this.state.canvasHeight);
    this.props.socket.emit('client update canvas', this.actionHistory.exportData());
  }

  setBrushColor(color) {
    this.setState({
      brushColor: color.hex
    });
  }

  render() {
    let { canIDraw, isSpectating } = this.props;
    canIDraw = canIDraw && !this.state.turnOver;
    return (
      <div className="canvasContainer">
        <canvas 
        onMouseDown={canIDraw ? (e) => this.startStroke(e) : (e) => e.preventDefault()}
        onMouseMove={canIDraw ? (e) => this.drawStroke(e) : (e) => e.preventDefault()}
        onMouseOut={canIDraw ? (e) => this.endStroke(e) : (e) => e.preventDefault()}
        onMouseUp={canIDraw ? (e) => this.endStroke(e) : (e) => e.preventDefault()}
        className="canvas"
        width={this.state.canvasWidth}
        height={this.state.canvasHeight}
        ref={(canvas) => this.canvas = canvas}
        />
        {isSpectating ? <div className="word"> <span>you're just watching this one but you'll be able to play next round :)</span></div> : null}
        <div className="canvasMessage">
        {
          !this.state.turnOver ?  <div className="timer"> {this.props.timeLeft} </div> 
        : 
          <div className="guesserDisplay"> The word was <span style={{fontWeight:'bold',color: 'orange'}}>{this.props.word}</span>! <br/>
          <span> {this.state.guessers.length > 0 ? <span style={{fontWeight:'bold'}}>{this.state.guessers.join(', ')}</span> : 'No one'} guessed the word </span>
          </div> 
        }
        </div> 
        {canIDraw ? <div className="word"> <span>{this.props.word}</span> </div> : null}
        {canIDraw ? <ArtistOptions 
          color={this.state.brushColor} 
          radius={this.state.brushSize} 
          clear={() => this.clear()} 
          redo={() => this.redo()} 
          undo={() => this.undo()} 
          setBrushColor={(color) => this.setBrushColor(color)}/> 
        : null }
      </div>
      )
    }
}

const mapStateToProps = (state) => {
    let canIDraw = (state.root.user === state.root.room.game.artist);
    let isSpectating = !(state.root.user in state.root.room.game.players);
    return {
        word: state.root.room.game.word,
        artist: state.root.room.game.artist,
        timeLeft: state.root.room.game.timeLeft, 
        canIDraw,
        isSpectating,
        canvasData: state.root.room.game.canvasData,
        socket: state.root.socket,
    }
};

export default connect(
    mapStateToProps,
)(Canvas)


class ArtistOptions extends Component {
  render () {
    return (
      <div className="artistOptions">
        <ColorCircle 
          radius={this.props.radius + 10} 
          color={this.props.color} 
          onColorChange={(color) => this.props.setBrushColor(color)}
        />
        <div className="editOptions">        
          <CanvasButton id="clear" iconName="square-o" onClick={() => this.props.clear()} />
          <CanvasButton id='undo' iconName='undo' onClick={() => this.props.undo()} />
          <CanvasButton id='redo' iconName='repeat' onClick={() => this.props.redo()} />
        </div>
      </div>
    )
  }
}

export const CanvasButton = ({ children, id, onClick, iconName }) => (
    <div className={`option ${id}`} onClick={onClick}>
      <i id={id} className={`fa fa-${iconName}`} aria-hidden="true"></i>
    </div>
);


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