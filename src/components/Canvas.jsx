import React, { Component } from 'react';
import { ActionHistory, Mark, ClearCanvas } from '../utils/CanvasUtils';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';
import { Circle } from 'react-progressbar.js'


class Canvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawing: false,
      canvasWidth: 0,
      canvasHeight: 0,
      brushColor: "#C45100", 
      brushSize: 8, 
      timeLeft: 0
    };
    this.remakeCanvasRemote = () => null;
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');    
    this.clearCanvas = () => this.ctx.clearRect(0,0,this.state.canvasWidth, this.state.canvasHeight);
    this.actionHistory = new ActionHistory(this.clearCanvas);
    this.props.socket.on('update canvas', canvasData => this.buildRemoteCanvas(canvasData));
    this.setCanvasSize();
    if (this.props.canvasData) {
      this.buildRemoteCanvas(this.props.canvasData);
    }
  }

  componentWillUnmount() {
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
    canIDraw = canIDraw && this.props.turnStatus === 'drawing';
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

        {this.props.turnStatus === 'drawing' ? 
          <div style={{position: 'absolute', top:0, right:'20px', width: '100px', height: '100px'}}>
          <Timer progress={this.props.timeLeft/this.props.timePerTurn} text={this.props.timeLeft}/>
          </div>
          : 
          null
        }
        {this.props.turnStatus === 'starting' ?
        <div style={{position: 'absolute', top:'50%', right:'50%', width: '100px', height: '100px'}}>
          <Timer containerStyle={{border:'4px solid red', borderRadius: '50%'}} color="white" strokeWidth={50} trailWidth={0} progress={1} text={this.props.timeLeft} key={this.props.timeLeft}/>
        </div>
        : null}
        <CanvasMessage turnStatus={this.props.turnStatus} guessers={this.props.guessers} canIDraw={canIDraw} {...this.props} />
        {canIDraw ? 
          <ArtistOptions 
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
    let players = state.root.room.game.players;
    let artist = state.root.room.game.artist;
    let canIDraw = (state.root.user === artist);
    let isSpectating = !(state.root.user in players);
    return {
        guessers: Object.keys(players).filter((player) => players[player].pointsThisTurn > 0 && player !== artist),
        turnStatus: state.root.room.game.turnStatus,
        numPlayers: Object.keys(players).length,
        timePerTurn: state.root.room.game.timePerTurn,
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


const CanvasMessage = ({ canIDraw, guessers, numPlayers, word, artist, turnStatus }) => (
  <div className="canvasMessage">
  {
    turnStatus === 'drawing' || turnStatus === 'starting' ?
      <div style={{pointerEvents: 'auto'}}>  
      { canIDraw ? <span> your turn, <br/> your word is <span style={{fontWeight:'bold',color: 'orange'}}>{word}</span> </span> 
      : 
      <span > <span style={{fontWeight:'bold',color: 'orange'}}>{artist}</span> is drawing {turnStatus === 'starting' ? 'next' : <span> <br/> guess the word using the chat </span> } </span> }
      </div>
    : 
      <div> The word was <span style={{fontWeight:'bold',color: 'orange'}}>{word}</span> <br/>
      <span> { guessers.length > 0 ? 
        <span style={{fontWeight:'bold'}}>{ guessers.length === numPlayers - 1 ? 'everyone' : guessers.join(', ')}</span> : 'No one'} guessed the word!</span>
      </div> 
  }
  </div> 
)

const Timer = ({ progress, text, strokeWidth=6, trailWidth=4, color="#FF3232", containerStyle}) => (
  <div className="timer" style={{display: 'block', position: 'absolute', borderRadius: '50%', width: '50px', margin: 'auto', marginTop: '10px', background:'white', left:0, right:0}}> 
  <Circle
        progress={progress}
        options={{strokeWidth, color, text: { value: text, style: { width:'60%', textAlign: 'center', color: 'grey', position: 'absolute', top: '20%', left: '20%'} }, trailColor: '#eee', trailWidth }}
        initialAnimate={true}
        containerStyle={{ width: '80px', height: '80px', ...containerStyle }}
        containerClassName={'.progressbar'} />
  </div>
)


class ArtistOptions extends Component {

  componentWillUnmount() {
    key.unbind('ctrl + z');
    key.unbind('ctrl + y');
    key.unbind('ctrl + c');
  }

  componentDidMount() {
    key('ctrl + z', () => this.props.undo());
    key('ctrl + y', () => this.props.redo());
    key('ctrl + c', () => this.props.clear());
  }

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