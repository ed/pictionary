import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Canvas, SizeOptions, ColorOptions, CanvasButton } from './canvas'

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
              <SizeOptions size={this.state.size} onChange={(e) => this.setSize(parseInt(e.target.value))} />
              <ColorOptions color={this.state.color} onChange={(e) => this.setColor(e.target.value)} />
              <div className="tools" style={{marginBottom:20}}>
                  <CanvasButton class='clear' text='clear' onClick={() => this.canvas.clear()} />
                  <CanvasButton class='undo' text='undo' onClick={() => this.canvas.undo()} />
                  <CanvasButton class='redo' text='redo' onClick={() => this.canvas.redo()} />
                  <CanvasButton class='save' text='save' onClick={() => this.canvas.save()} />
              </div>
              <div id="imgwrapper"></div>
            </div>
        );
    }
}

export default WhiteBoard;
