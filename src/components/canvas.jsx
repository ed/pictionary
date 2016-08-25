import React, { Component } from 'react';
import {ActionHistory, Mark, ClearAction} from './canvasUtils';

export class Canvas extends Component {
    static propTypes = {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        name: React.PropTypes.string,
    };

    static defaultProps = {
        width: 400,
        height: 400,
        name: "canvas",
    };

    constructor(props) {
        super(props);
        this.state = {
            drawing: false, 
        };
        this.markHistory = [];
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');
        this.clearCanvas = () => this.ctx.clearRect(0,0,this.props.width, this.props.height);
        this.actionHistory = new ActionHistory(this.clearCanvas);
    }

    startStroke(e) {
        var pos = this.xy(e);
        this.curMark = new Mark(this.ctx, this.props.color, this.props.size, pos);
        this.curMark.startStroke();
        this.setState({ drawing: true });
    }


    drawStroke(e) {
        if (this.state.drawing) {
            var pos = this.xy(e);
            this.curMark.addStroke(pos);
        }
    }


    endStroke(e) {
        if (this.state.drawing) {
            this.drawStroke(e);
            this.setState({ drawing: false });
            this.actionHistory.pushAction(this.curMark);
        }
    }

    xy(e) {
        const {top, left} = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - left,
            y: e.clientY - top
        }
    }

    clear() {
      var clear = new ClearAction(this.clearCanvas);
      clear.do();
      this.actionHistory.pushAction(clear);
    }

    undo() {
        this.actionHistory.undoAction();
    }

    save() {
        var img = this.canvas.toDataURL("image/png");
        document.getElementById('imgwrapper').innerHTML = "<img src='" + img + "'>";
    }

    redo() {
        this.actionHistory.redoAction();
    }

    render() {
        const {width, height, name} = this.props;
        return (
            <div>
            <canvas 
            onMouseDown={(e) => this.startStroke(e)}
            onMouseMove={(e) => this.drawStroke(e)}
            onMouseOut={(e) => this.endStroke(e)}
            onMouseUp={(e) => this.endStroke(e)}
            width={width}
            height={height}
            className={name}
            ref={(canvas) => this.canvas = canvas}
            />
            </div>
        )
    }
}


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