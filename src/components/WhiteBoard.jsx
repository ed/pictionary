import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Canvas, { CanvasButton } from './Canvas'
import { connect } from 'react-redux';

export class WhiteBoard extends Component {
  constructor(props){
    super(props);

    this.state = {
      gameStartError: ''
    }
  }

  startGame() {
    if (this.props.numClients > 1) {
      this.props.socket.emit('start game')
    }
    else {
      this.setState({
        gameStartError: 'Not enough players'
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.numClients > 1) {
      this.setState({
        gameStartError: ''
      })
    }
  }

  render() {
    return (
      <div className="whiteboard">
        { this.props.gameInProgress ? 
          <Canvas key={this.props.artist} /> 
          :
          <div className="container">
          <StartButton error={this.state.gameStartError} active={this.props.numClients > 1} onClick={() => this.startGame()} />
          </div>  
        }
      </div>
      );
  }
}

const StartButton = ({ onClick, error, active }) => (
    <div className={`startGame${active ? ' active' : ''}`} onClick={onClick}>
      <i id="startGame" className="fa fa-play" aria-hidden="true"></i>
      {error}
    </div>
);

const mapStateToProps = (state) => {
    return { 
        numClients: state.root.room.clients.length,
        artist: state.root.room.game.artist,
        gameInProgress: state.root.room.game.gameInProgress,
        socket: state.root.socket
    }
};

export default connect(
    mapStateToProps,
)(WhiteBoard)
