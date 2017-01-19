import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Canvas from './Canvas';
import CanvasRemote from './CanvasRemote';
import { connect } from 'react-redux';
import { addNotification } from '../actions'

export class WhiteBoard extends Component {
  startGame() {
    if (this.props.numClients > 1) {
      this.props.socket.emit('start game');
    }
    else {
      this.props.dispatch(addNotification('Not enough players'));
    }
  }

  render() {
    let { winners, user, artist, gameInProgress, turnStatus, displayWinners } = this.props;
    console.log(displayWinners)
    return (
      <div className="whiteboard">
        { gameInProgress ?
          artist === user ?
            <Canvas displayControls={true} key={turnStatus !== 'starting'} />
            :
            <CanvasRemote key={turnStatus !== 'starting'} />
          :
          displayWinners === true ?
            <div className='popoverContainer' style={{fontFamily: ' "Inconsolata", monospace', width: '100%', height: '400px'}}>
              <WinnersDisplay winners={winners} />
            </div>
            :
            <div className="container">
            <StartButton active={true} onClick={() => this.startGame()} />
            </div>
        }
      </div>
      );
  }
}

const WinnersDisplay = ({ winners }) => (
  <ul>
    {winners.map((winner, index) => <Winner key={index} index={index} {...winner} />)}
  </ul>
);

const Winner = ({ name, score, index }) => (
  <li style={{height:'50px', lineHeight: '50px', verticalAlign: 'middle', width: '90%', textAlign: 'center', color: '#414141',
    fontSize: index === 0 ? '250%' : index === 1 ? '220%' : '190%'}}>
    <span style={{verticalAlign: 'middle', fontSize: '130%', color: '#eeb6b7'}}>{index + 1}</span> <span style={{verticalAlign: 'middle'}}>{name} {score}pts</span>
  </li>
);

const StartButton = ({ onClick , active }) => (
    <div className={`startGame${active ? ' active' : ''}`} onClick={onClick}>
      <i id="startGame" className="fa fa-play" aria-hidden="true"></i>
    </div>
);

const mapStateToProps = (state) => {
    return {
        winners: state.root.room.winners,
        displayWinners: state.root.room.displayWinners,
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
