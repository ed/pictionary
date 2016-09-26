import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Canvas, { CanvasButton } from './Canvas'
import { connect } from 'react-redux';

export class WhiteBoard extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="whiteboard">
        { this.props.gameInProgress ? 
          <Canvas ref={(canvas) => this.canvas = canvas} {...this.props} /> 
          : 
          <CanvasButton id='startGame' iconName='play' onClick={() => this.props.socket.emit('start game')} />  
        }
      </div>
      );
  }
}

const mapStateToProps = (state) => {
    return { 
        gameInProgress: state.game.gameInProgress,
        socket: state.socket
    }
};

export default connect(
    mapStateToProps,
)(WhiteBoard)
