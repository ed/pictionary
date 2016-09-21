import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Canvas, SizeOptions, ColorOptions, CanvasButton } from './Canvas'

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

export default WhiteBoard;
