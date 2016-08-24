import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

class WhiteBoard extends Component {
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
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.clear = this.clear.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.save = this.save.bind(this);
        this.state = {drawing: false, undo: false, color: "#000000", size: 2}
        this.points = [];
        this.hist = [];
        this.redo_hist = [];
    }

    setDrawing() {
        this.setState({drawing: !this.state.drawing});
    }
    setColor(c) {
        this.setState({color: c});
    }
    setSize(s) {
        this.setState({size: s});
    }

    componentDidMount() {
        this.canvas = this.refs.wb;
        this.ctx = this.canvas.getContext('2d');
    }

    onMouseDown(e) {
        var pos = this.xy(e);
        this.setState({undo: false});
        this.redo_hist = [];
        this.ctx.strokeStyle = this.state.color;
        this.ctx.lineWidth = this.state.size;
        this.points.push({
            pos: pos,
            color: this.state.color,
            size: this.state.size 
        });
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        this.setDrawing();
    }


    onMouseMove(e) {
        if (this.state.drawing) {
            var pos = this.xy(e);
            this.points.push({
                pos: pos,
                color: this.state.color,
                size: this.state.size 
            });
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
        }
    };


    onMouseUp(e) {
        if (this.state.drawing) {
            this.onMouseMove(e);
            this.setDrawing();
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

    clear() {
        this.ctx.clearRect(0,0,this.props.width, this.props.height);
        this.points=[];
    }

    undo() {
        if (this.hist.length > 0) {
            this.clear();
            this.redo_hist.push(this.hist[this.hist.length - 1]);
            this.hist.pop()
            this.redraw();
            this.points = [];
            this.setState({undo: true});
        }
    }


    save() {
        var img = this.canvas.toDataURL("image/png");
        document.getElementById('imgwrapper').innerHTML = "<img src='" + img + "'>";
    }

    redo() {
        if (this.redo_hist.length > 0 && this.state.undo == true) {
            this.clear();
            this.hist.push(this.redo_hist[this.redo_hist.length - 1]);
            this.redo_hist.pop()
            this.redraw();
            this.points = [];
        }
    }

    redraw() {
        for (var i = 0; i < this.hist.length; i++) {
            this.points = this.hist[i];
            this.ctx.beginPath();
            this.ctx.moveTo(this.points[0].pos.x, this.points[0].pos.y);
            this.ctx.strokeStyle = this.points[0].color;
            this.ctx.lineWidth = this.points[0].size;
            for (var j = 0; j < this.points.length; j++) {
                this.ctx.strokeStyle = this.points[j].color;
                this.ctx.lineWidth = this.points[j].size;
                this.ctx.lineTo(this.points[j].pos.x, this.points[j].pos.y);
            }
            this.ctx.stroke();
        }
    }

    render() {
        const {width, height, name} = this.props;
        return (
            <div>
            <canvas 
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseOut={this.onMouseUp}
            onMouseUp={this.onMouseUp}
            width={width}
            height={height}
            className={name}
            ref="wb"
            />
            <div className="options" style={{marginBottom:20}}>
            <label htmlFor="">size: </label>
            <input min="1" max="20" type="range" value={this.state.size} onChange={(e) => this.setSize(parseInt(e.target.value))} />
            </div>
            <div className="options" style={{marginBottom:20}}>
            <label htmlFor="">color: </label>
            <input type="color" value={this.state.color} onChange={(e) => this.setColor(e.target.value)} />
            </div>
            <div className="tools" style={{marginBottom:20}}>
            <button className={'clear'} onClick={this.clear}>
            clear
            </button>
            <button className={'undo'} onClick={this.undo}>
            undo
            </button>
            <button className={'redo'} onClick={this.redo}>
            redo
            </button>
            <button className={'save'} onClick={this.save}>
            save
            </button>
            </div>
            <div id="imgwrapper"></div>
            </div>
        )
    }
}

export default WhiteBoard;
