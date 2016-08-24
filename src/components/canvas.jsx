import React, { Component } from 'react';

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
            undo: false
        };
        this.points = [];
        this.hist = [];
        this.redo_hist = [];
    }

    setDrawing() {
        this.setState({drawing: !this.state.drawing});
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');
    }

    startStroke(e) {
        var pos = this.xy(e);
        this.setState({undo: false});
        this.redo_hist = [];
        this.ctx.strokeStyle = this.props.color;
        this.ctx.lineWidth = this.props.size;
        this.points.push({
            pos: pos,
            color: this.props.color,
            size: this.props.size 
        });
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        this.setDrawing();
    }


    drawStroke(e) {
        if (this.state.drawing) {
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


    endStroke(e) {
        if (this.state.drawing) {
            this.drawStroke(e);
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