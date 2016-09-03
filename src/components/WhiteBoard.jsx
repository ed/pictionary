import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Canvas, SizeOptions, ColorOptions, CanvasButton } from './Canvas'

export class WhiteBoard extends Component {
  constructor(props){
    super(props);
    this.state = {
      color: "#000000", 
      size: 2
    };
  }

  setColor(c) {
    this.setState({color: c});
  }

  setSize(s) {
    this.setState({size: s});
  }

  render() {
    return (
      <div>
      <Canvas color={this.state.color} size={this.state.size} ref={(canvas) => this.canvas = canvas} />
      <div id="imgwrapper"></div>
      </div>
      );
  }
}

export default WhiteBoard;
