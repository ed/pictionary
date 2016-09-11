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
      <Canvas ref={(canvas) => this.canvas = canvas} />
      </div>
      );
  }
}

export default WhiteBoard;
