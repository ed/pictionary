import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Canvas, { CanvasButton } from './Canvas'
import { connect } from 'react-redux';

export class WhiteBoard extends Component {
  constructor(props){
    super(props);
  }

  render() {
    console.log(this.props.gameInProgress)
    return (
      <div className="whiteboard">
        { this.props.gameInProgress ? 
          <Canvas ref={(canvas) => this.canvas = canvas} /> 
          : 
          <CanvasButton id='startGame' iconName='play' onClick={() => this.props.socket.emit('start game')} />  
        }
      </div>
      );
  }
}

const mapStateToProps = (state) => {
    return { 
        gameInProgress: state.room.game.gameInProgress,
        socket: state.socket
    }
};

export default connect(
    mapStateToProps,
)(WhiteBoard)
