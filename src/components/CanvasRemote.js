import React, { Component } from 'react';
import { ActionHistory, Mark, ClearCanvas } from '../utils/CanvasUtils';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';
import Timer, { SmallTimer } from './Timer';
const WorkerTimer = require("worker-timer");

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
    this.perm_ctx = this.perm_canvas.getContext('2d');
    this.clearCanvas = () => this.perm_ctx.clearRect(0,0,this.state.canvasWidth, this.state.canvasHeight);
    this.props.socket.on('stroke', point => this.handleStroke(point));
    this.props.socket.on('update canvas', canvasData => this.buildRemoteCanvas(canvasData));
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
    point.strokeID in this.ptsByStroke ? this.ptsByStroke[point.strokeID].pts.push(point) : this.ptsByStroke[point.strokeID] = { pts: [], ended: false };
  }

  startStrokeRemote(point) {
    if ( !(point.strokeID in this.ptsByStroke) ) {
      this.ptsByStroke[point.strokeID] = { pts: [], ended: false };
    }
    this.drawRemoteLoops[point.strokeID] = WorkerTimer.setInterval(() => this.tryStartStroke(point),100);
  }

  tryStartStroke(point) {
    if (this.currentID === point.strokeID && this.ptsByStroke[point.strokeID].pts.length > 0) {
      this.startStroke(point.pos, point.color, point.size);
      WorkerTimer.clearInterval(this.drawRemoteLoops[point.strokeID]);
      this.drawRemoteLoops[point.strokeID] = WorkerTimer.setInterval(() => this.drawRemoteStroke(point.strokeID),10);
    }
  }

  drawRemoteStroke(ID) {
    if (this.ptsByStroke[ID].pts.length > 0) {
      this.drawStroke(this.ptsByStroke[ID].pts[0].pos);
      this.ptsByStroke[ID].pts.shift();
    }
    else if (this.ptsByStroke[ID].ended) {
      this.currentID++;
      this.perm_ctx.drawImage(this.canvas,0,0);
      this.ctx.clearRect(0,0,this.state.canvasWidth, this.state.canvasHeight);
      WorkerTimer.clearInterval(this.drawRemoteLoops[ID]);
    }
  }

  componentWillUnmount() {
    this.props.socket.off('stroke');
    this.props.socket.off('update canvas');
    for (let loop in this.drawRemoteLoops) {
      WorkerTimer.clearInterval(this.drawRemoteLoops[loop]);
    }
  }

  buildRemoteCanvas(canvasData) {
    this.clearCanvas();
    for (let i = 0; i < canvasData.length; i++) {
      if(canvasData[i].action == 'stroke') {
        let mark = new Mark(this.canvas, this.ctx,this.perm_ctx,null,null,null,canvasData[i].data);
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

  setCanvasSize() {
    if (this.canvas) {
      this.setState({
        canvasHeight: this.canvas.offsetHeight,
        canvasWidth: this.canvas.offsetWidth
      },
      () => this.remakeCanvasRemote());
    }
    else {
      setTimeout(() => this.setCanvasSize, 1000);
    }
  }

  startStroke(pos, color, size) {
    this.curMark = new Mark(this.canvas, this.ctx, this.perm_ctx, color, size, this.scalePoint(pos));
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
          className="perm_canvas"
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
          ref={(canvas) => this.perm_canvas = canvas}
          />
        <canvas
          onMouseDown={(e) => { e.preventDefault(); canIDraw ? this.startStroke(this.xy(e)) : null }}
          onMouseMove={(e) => { e.preventDefault(); canIDraw ? this.drawStroke(this.xy(e)) : null }}
          onMouseOut={(e) => { e.preventDefault(); canIDraw ? this.endStroke(this.xy(e)) : null }}
          onMouseUp={(e) => { e.preventDefault(); canIDraw ? this.endStroke(this.xy(e)) : null }}
          className="tmp_canvas"
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
          ref={(canvas) => this.canvas = canvas}
          />
        {isSpectating ? <div className="word"> <span>you're just watching this one but you'll be able to play next round :)</span></div> : null}

        {this.props.turnStatus === 'drawing' ?
          <div style={{position: 'absolute', top:0, right:'20px', width: '100px', height: '100px'}}>
            <SmallTimer key={this.props.totalTime} progress={this.props.timeLeft/this.props.totalTime} text={this.props.timeLeft}/>
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
        totalTime: state.root.room.game.totalTime,
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


const CanvasMessage = ({ guessers, numPlayers, word, artist, turnStatus, color="#f7b733" }) => (
  <div className="canvasMessage">
  {
    turnStatus === 'drawing' || turnStatus === 'starting' ?
      <div style={{pointerEvents: 'auto'}}>
      <span > <span style={{fontWeight:'bold',color}}>{artist}</span> is drawing
      {turnStatus === 'starting' ? ' next' :
      guessers.length === 0 ?
      <span><br/> guess the word using the chat </span>
      :
      <span><br/> someone guessed the word! </span>
      }
      </span></div>
    :
      <div>
      <span> { guessers.length > 0 ?
        <span style={{fontWeight:'bold'}}>{ guessers.length === numPlayers - 1 ? 'everyone' : guessers.join(', ')}</span> : 'No one'} guessed the word!</span>
        <br/>
        The word was <span style={{fontWeight:'bold',color}}>{word}</span>
      </div>
  }
  </div>
)
