import React, { Component } from 'react';
import { ActionHistory, Mark, ClearCanvas } from '../utils/CanvasUtils';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';
import { Circle } from 'react-progressbar.js'


class Canvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: 0,
      canvasHeight: 0,
    };
    this.remakeCanvasRemote = () => null;
    this.ptsByStroke = {};
    this.drawRemoteLoops = {};
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.clearCanvas = () => this.ctx.clearRect(0,0,this.state.canvasWidth, this.state.canvasHeight);
    this.props.socket.on('stroke', point => this.handleStroke(point));
    this.props.socket.on('update canvas', canvasData => this.buildRemoteCanvas(canvasData) );
    this.setCanvasSize();
    this.remakeCanvasRemote = () => this.props.canvasData ? this.buildRemoteCanvas(this.props.canvasData) : null;
    this.currentID = 0;
  }

  handleStroke(point) {
    switch(point.action) {
      case 'start':
        return this.startStrokeRemote(point);
      case 'draw':
        return this.addStroke(point);
      case 'end':
        return this.endRemoteStroke(point);
    }
  }

  endRemoteStroke(point) {
    this.ptsByStroke[point.strokeID].ended = true;
  }

  addStroke(point) {
    point.strokeID in this.ptsByStroke ? this.ptsByStroke[point.strokeID].pts.push(point.pos) : this.ptsByStroke[point.strokeID] = { pts: [], ended: false };
  }

  startStrokeRemote(point) {
    if ( !(point.strokeID in this.ptsByStroke) ) {
      this.ptsByStroke[point.strokeID] = { pts: [], ended: false };;
    }
    setTimeout(() => this.startThat(point),100);
  }

  startThat(point) {
    if (this.currentID !== point.strokeID || this.ptsByStroke[point.strokeID].pts.length == 0) {
      return setTimeout(() => this.startThat(point),100);
    }
    this.startStroke(point.pos, point.color, point.size);
    this.drawRemoteLoops[point.strokeID] = setInterval(() => this.drawRemoteStroke(point.strokeID),5);
  }

  drawRemoteStroke(ID) {
    if (this.ptsByStroke[ID].pts.length > 0) {
      this.drawStroke(this.ptsByStroke[ID].pts[0]);
      this.ptsByStroke[ID].pts.shift();
    }
    else if (this.ptsByStroke[ID].ended) {
      this.currentID++;
      clearInterval(this.drawRemoteLoops[ID]);
    }
  }

  componentWillUnmount() {
    this.props.socket.off('stroke');
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
  }

  componentWillMount() {
    window.addEventListener('resize', () => this.setCanvasSize());
  }

  setCanvasSize(){
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

  startStroke(pos, color, size) {
    this.curMark = new Mark(this.ctx, color, size, this.scalePoint(pos));
    this.curMark.startStroke(this.state.canvasWidth, this.state.canvasHeight);
  }

  drawStroke(pos) {
    let scaledPos = this.scalePoint(pos);
    this.curMark.addStroke(scaledPos);
  }

  scalePoint(pos) {
    return { x: pos.x*this.state.canvasWidth, y: pos.y*this.state.canvasHeight };
  }

  render() {
    let { canIDraw, isSpectating } = this.props;
    return (
      <div className="canvasContainer">
        <canvas
        onMouseDown={(e) => { e.preventDefault(); canIDraw ? this.startStroke(this.xy(e)) : null }}
        onMouseMove={(e) => { e.preventDefault(); canIDraw ? this.drawStroke(this.xy(e)) : null }}
        onMouseOut={(e) => { e.preventDefault(); canIDraw ? this.endStroke(this.xy(e)) : null }}
        onMouseUp={(e) => { e.preventDefault(); canIDraw ? this.endStroke(this.xy(e)) : null }}
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
        <div style={{position: 'absolute', top:'25%', right:'50%', width: '300px', height: '300px'}}>
          <Timer containerStyle={{fontSize: '300%', width: '300px', height: '300px'}} color="white" strokeWidth={50} trailWidth={0} progress={1} text={this.props.timeLeft + 1} key={this.props.timeLeft}/>
        </div>
        : null}
        <CanvasMessage turnStatus={this.props.turnStatus} guessers={this.props.guessers} canIDraw={canIDraw} {...this.props} />
      </div>
      )
    }
}

const mapStateToProps = (state) => {
    let players = state.root.room.game.players;
    let artist = state.root.room.game.artist;
    let turnStatus = state.root.room.game.turnStatus;
    let canIDraw = (state.root.user === artist) && turnStatus === 'drawing';
    let isSpectating = !(state.root.user in players);
    return {
        guessers: Object.keys(players).filter((player) => players[player].pointsThisTurn > 0 && player !== artist),
        turnStatus,
        numPlayers: Object.keys(players).length,
        timePerTurn: state.root.room.game.timePerTurn,
        word: state.root.room.game.word,
        artist: state.root.room.game.artist,
        user: state.root.user,
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


const CanvasMessage = ({ guessers, numPlayers, word, artist, turnStatus }) => (
  <div className="canvasMessage">
  {
    turnStatus === 'drawing' || turnStatus === 'starting' ?
      <div style={{pointerEvents: 'auto'}}>
      <span > <span style={{fontWeight:'bold',color: 'orange'}}>{artist}</span> is drawing {turnStatus === 'starting' ? 'next' : <span> <br/> guess the word using the chat </span> } </span>
      </div>
    :
      <div>
      <span> { guessers.length > 0 ?
        <span style={{fontWeight:'bold'}}>{ guessers.length === numPlayers - 1 ? 'everyone' : guessers.join(', ')}</span> : 'No one'} guessed the word!</span>
        <br/>
        The word was <span style={{fontWeight:'bold',color: 'orange'}}>{word}</span>
      </div>
  }
  </div>
)

const Timer = ({ progress, text, strokeWidth=9, trailWidth=10, color="#FF3232", containerStyle}) => (
  <div className="timer" style={{display: 'block', position: 'absolute', borderRadius: '50%', width: '50px', margin: 'auto', marginTop: '10px', background:'white', left:0, right:0}}>
  <Circle
        progress={progress}
        options={{strokeWidth,
          color,
          duration: 1000,
          text: { value: text, style: { width:'60%', textAlign: 'center', color: 'grey', position: 'absolute', top: '20%', left: '20%'} },
          trailColor: '#D6D6D6', trailWidth }}
        initialAnimate={true}
        containerStyle={{ borderRadius: '50%', width: '80px', height: '80px',  ...containerStyle }}
        containerClassName={'.progressbar'} />
  </div>
)