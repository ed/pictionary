import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

class WhiteBoard extends Component {
    static propTypes = {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        size: React.PropTypes.number,
        name: React.PropTypes.string,
        color: React.PropTypes.string
    };

    static defaultProps = {
        width: 500,
        height: 500,
        size: 2,
        name: "canvas",
        color: "#000"
    };

    constructor(props) {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.drawing = false;
        this.points = [];
        this.hist = [];
    }

    componentDidMount() {
        this.canvas = findDOMNode(this);
        this.ctx = this.canvas.getContext('2d');
    }

    onMouseDown(e) {
        var pos = this.xy(e);
        this.ctx.strokeStyle = this.props.color;
        this.ctx.lineWidth = this.props.size;
        this.points.push({
            pos: pos,
            color: this.props.color,
            size: this.props.size 
        });
        console.log(this.points);
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        this.drawing = true;
    }


    onMouseMove(e) {
        if (this.drawing) {
            var pos = this.xy(e);
            this.points.push({
                pos: pos,
                color: this.props.color,
                size: this.props.size 
            });
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
        }
    };


    onMouseUp(e) {
        if (this.drawing) {
            this.onMouseMove(e);
            this.drawing = false;
            this.hist.push(this.points);
            this.points = []
        }
    };

    xy(e) {
        const {top, left} = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - left,
            y: e.clientY - top
        }
    };

    render() {
        const {width, height, name} = this.props;
        console.log(this.props);
        return (
            <canvas 
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseOut={this.onMouseUp}
            onMouseUp={this.onMouseUp}
            width={width}
            height={height}
            className={name}
            />
        )
    }
}

export default WhiteBoard;
