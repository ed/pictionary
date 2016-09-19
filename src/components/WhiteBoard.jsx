import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Canvas, SizeOptions, ColorOptions, CanvasButton } from './Canvas'

export class WhiteBoard extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        <Canvas socket={this.props.socket} ref={(canvas) => this.canvas = canvas} user={this.props.user} artist={this.props.artist} />
      </div>
      );
  }
}

export default WhiteBoard;
