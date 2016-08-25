import React, { Component } from 'react';


export class SizeOptions extends Component {
    render() {
        return (
            <div className="options" style={{marginBottom:20}}>
            <label htmlFor="">size: </label>
            <input min="1" max="20" type="range" value={this.props.size} onChange={this.props.onChange} />
            </div>
        );
    }
}


export class ColorOptions extends Component {
    render() {
        return (
            <div className="options" style={{marginBottom:20}}>
            <label htmlFor="">color: </label>
            <input type="color" value={this.props.color} onChange={this.props.onChange} />
            </div>
        );
    }
}


export class CanvasButton extends Component {
    render() {
        return (
            <button className={this.props.class} onClick={this.props.onClick}>
            {this.props.text}
            </button>
        );
    }
}