import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Canvas from './Canvas'
import CanvasRemote from './CanvasRemote'
import { connect } from 'react-redux';
import { addNotification } from '../actions'

export class WhiteBoard extends Component {
  startGame() {
    if (this.props.numClients > 1) {
      this.props.socket.emit('start game')
    }
    else {
      this.props.dispatch(addNotification('Not enough players'));
    }
  }

  render() {
    console.log(this.props.artist)
    return (
      <div className="whiteboard">
        { this.props.gameInProgress ?
          this.props.artist === this.props.user ?
            <Canvas key={this.props.turnStatus} />
            :
            <CanvasRemote key={this.props.turnStatus} />
          :
          <div className="container">
          <StartButton active={true} onClick={() => this.startGame()} />
          </div>
        }
      </div>
      );
  }
}

const StartButton = ({ onClick , active }) => (
    <div className={`startGame${active ? ' active' : ''}`} onClick={onClick}>
      <i id="startGame" className="fa fa-play" aria-hidden="true"></i>
    </div>
);

const mapStateToProps = (state) => {
    return {
        turnStatus: state.root.room.game.turnStatus,
        numClients: state.root.room.clients.length,
        user: state.root.user,
        artist: state.root.room.game.artist,
        gameInProgress: state.root.room.game.gameInProgress,
        socket: state.root.socket
    }
};

export default connect(
    mapStateToProps,
)(WhiteBoard)
