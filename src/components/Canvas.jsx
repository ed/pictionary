import React, { Component } from 'react'
import { ActionHistory, Mark, ClearCanvas } from '../utils/CanvasUtils'
import { CirclePicker } from 'react-color'
import { connect } from 'react-redux'
import { setRouteLeaveHook, withRouter } from 'react-router'
import Timer, { SmallTimer } from './Timer'

class Canvas extends Component {
  constructor(props) {
    super(props)
    this.state = {
      drawing: false,
      canvasWidth: 0,
      canvasHeight: 0,
      brushColor: '#C45100',
      brushSize: 8
    }
    this.remakeCanvasRemote = () => null
    this.ptsByStroke = {}
    this.drawRemoteLoops = {}
  }

  componentDidMount() {
    this.removeLeaveHook = this.props.router.setRouteLeaveHook(
      this.props.route,
      this.confirmLeave
    )
    this.strokeID = 0
    this.ctx = this.canvas.getContext('2d')
    this.perm_ctx = this.perm_canvas.getContext('2d')
    this.clearCanvas = () =>
      this.perm_ctx.clearRect(
        0,
        0,
        this.state.canvasWidth,
        this.state.canvasHeight
      )
    this.actionHistory = new ActionHistory(this.clearCanvas)
    this.setCanvasSize()

    this.canvas.addEventListener(
      'touchmove',
      (e) => (this.props.canIDraw ? this.updatePosition(this.xy(e)) : null),
      { passive: false }
    )
  }

  componentWillMount() {
    window.addEventListener('resize', () => this.setCanvasSize())
  }

  componentWillUnmount() {
    this.removeLeaveHook()
  }

  confirmLeave() {
    return 'Leaving this page will exit the game. Is that ok?'
  }

  remakeCanvas() {
    this.actionHistory.remakeCanvas(
      this.state.canvasWidth,
      this.state.canvasHeight
    )
  }

  setCanvasSize() {
    if (this.canvas) {
      this.setState(
        {
          canvasHeight: this.canvas.offsetHeight,
          canvasWidth: this.canvas.offsetWidth
        },
        () => this.remakeCanvas()
      )
    } else {
      setTimeout(() => this.setCanvasSize, 1000)
    }
  }

  startStroke(pos) {
    this.curMark = new Mark(
      this.canvas,
      this.ctx,
      this.perm_ctx,
      this.state.brushColor,
      this.state.brushSize,
      this.scalePoint(pos)
    )
    this.curMark.startStroke(this.state.canvasWidth, this.state.canvasHeight)
    this.setState({ drawing: true })
    this.drawInterval = setInterval(() => this.drawStroke(this.state.pos), 10)
    this.props.socket.emit('stroke', { action: 'noop' })
    this.props.socket.emit('stroke', {
      action: 'start',
      pos,
      color: this.state.brushColor,
      size: this.state.brushSize,
      strokeID: this.strokeID
    })
  }

  drawStroke(pos) {
    if (this.state.drawing) {
      let scaledPos = this.scalePoint(pos)
      this.props.socket.emit('stroke', {
        action: 'draw',
        pos,
        strokeID: this.strokeID
      })
      this.curMark.addStroke(scaledPos)
    }
  }

  updatePosition(pos) {
    this.setState({ pos })
  }

  endStroke(pos) {
    if (this.state.drawing) {
      clearInterval(this.drawInterval)
      this.drawStroke(pos)
      this.setState({ drawing: false })
      this.actionHistory.pushAction(this.curMark)
      this.props.socket.emit('stroke', {
        action: 'end',
        canvasData: this.actionHistory.raw(),
        strokeID: this.strokeID
      })
      this.perm_ctx.drawImage(this.canvas, 0, 0)
      this.ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight)
      this.strokeID++
    }
  }

  scalePoint(pos) {
    return {
      x: pos.x * this.state.canvasWidth,
      y: pos.y * this.state.canvasHeight
    }
  }

  xy(e) {
    const { top, left } = this.canvas.getBoundingClientRect()

    let clientX = e.clientX
    let clientY = e.clientY

    if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX
      clientY = e.changedTouches[0].clientY
    }

    const pos = {
      x: (clientX - left) / this.state.canvasWidth,
      y: (clientY - top) / this.state.canvasHeight
    }
    this.setState({ pos })
    return pos
  }

  clear() {
    this.clearCanvas()
    this.actionHistory.pushAction(new ClearCanvas(() => this.clearCanvas()))
    this.props.socket.emit('update canvas', this.actionHistory.raw())
  }

  undo() {
    this.actionHistory.undoAction(
      this.state.canvasWidth,
      this.state.canvasHeight
    )
    this.props.socket.emit('update canvas', this.actionHistory.raw())
  }

  save() {
    let img = this.canvas.toDataURL('image/png')
    document.getElementById('imgwrapper').innerHTML = "<img src='" + img + "'>"
  }

  redo() {
    this.actionHistory.redoAction(
      this.state.canvasWidth,
      this.state.canvasHeight
    )
    this.props.socket.emit('update canvas', this.actionHistory.raw())
  }

  setBrushColor(color) {
    this.setState({
      brushColor: color.hex
    })
  }

  render() {
    let {
      displayControls,
      turnStatus,
      timeLeft,
      totalTime,
      canIDraw,
      isMobile,
      isSpectating
    } = this.props
    return (
      <div className="canvasContainer">
        <canvas
          className="perm_canvas"
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
          ref={(canvas) => (this.perm_canvas = canvas)}
        />
        <canvas
          onMouseDown={(e) => {
            e.preventDefault()
            canIDraw ? this.startStroke(this.xy(e)) : null
          }}
          onMouseMove={(e) => {
            e.preventDefault()
            canIDraw ? this.updatePosition(this.xy(e)) : null
          }}
          onMouseOut={(e) => {
            e.preventDefault()
            canIDraw ? this.endStroke(this.xy(e)) : null
          }}
          onMouseUp={(e) => {
            e.preventDefault()
            canIDraw ? this.endStroke(this.xy(e)) : null
          }}
          onTouchStart={(e) => {
            canIDraw ? this.startStroke(this.xy(e)) : null
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            canIDraw ? this.endStroke(this.xy(e)) : null
          }}
          onTouchCancel={(e) => {
            e.preventDefault()
            canIDraw ? this.endStroke(this.xy(e)) : null
          }}
          className="tmp_canvas"
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
          ref={(canvas) => (this.canvas = canvas)}
        />
        <CanvasMessage {...this.props} />
        {turnStatus === 'drawing' || (turnStatus === 'starting' && isMobile) ? (
          <div className="timerContainer">
            <SmallTimer
              key={this.props.totalTime}
              progress={timeLeft / totalTime}
              text={parseInt(timeLeft) < 10 ? '0' + timeLeft : timeLeft}
            />
          </div>
        ) : null}
        {turnStatus === 'starting' && !isMobile ? (
          <div className="container" style={{ background: 'red' }}>
            <Timer
              containerStyle={{
                fontSize: '300%',
                width: '300px',
                height: '300px'
              }}
              color="white"
              strokeWidth={50}
              trailWidth={0}
              progress={1}
              text={this.props.timeLeft + 1}
              key={timeLeft}
            />
          </div>
        ) : null}
        {displayControls ? (
          <ArtistOptions
            color={this.state.brushColor}
            radius={this.state.brushSize}
            mobile={isMobile}
            clear={() => this.clear()}
            redo={() => this.redo()}
            undo={() => this.undo()}
            setBrushColor={(color) => this.setBrushColor(color)}
          />
        ) : null}
      </div>
    )
  }
}

Canvas.defaultProps = {
  timeLeft: 0
}

const mapStateToProps = (state, props) => {
  const players = state.root.room.game.players
  const artist = state.root.room.game.artist
  const turnStatus = state.root.room.game.turnStatus
  const canIDraw = state.root.user === artist && turnStatus === 'drawing'
  const displayControls = props.displayControls && canIDraw
  const isSpectating = !(state.root.user in players)
  return {
    displayControls,
    guessers: Object.keys(players).filter(
      (player) => players[player].pointsThisTurn > 0 && player !== artist
    ),
    turnStatus,
    numPlayers: Object.keys(players).length,
    totalTime: state.root.room.game.totalTime,
    word: state.root.room.game.word,
    artist: state.root.room.game.artist,
    user: state.root.user,
    timeLeft: state.root.room.game.timeLeft,
    canIDraw,
    isSpectating,
    canvasData: state.root.room.game.canvasData,
    socket: state.root.socket
  }
}

export default connect(mapStateToProps)(withRouter(Canvas))

const CanvasMessage = ({
  guessers,
  numPlayers,
  word,
  turnStatus,
  color = '#f7b733'
}) => (
  <div className="canvasMessage">
    {turnStatus === 'drawing' || turnStatus === 'starting' ? (
      <div style={{ pointerEvents: 'auto' }}>
        <span>
          {' '}
          your turn, <br /> your word is{' '}
          <span style={{ fontWeight: 'bold', color }}>{word}</span>{' '}
        </span>
      </div>
    ) : (
      <div>
        <span>
          {' '}
          {guessers.length > 0 ? (
            <span style={{ fontWeight: 'bold' }}>
              {guessers.length === numPlayers - 1
                ? 'everyone'
                : guessers.join(', ')}
            </span>
          ) : (
            'No one'
          )}{' '}
          guessed the word!
        </span>
        <br />
        The word was <span style={{ fontWeight: 'bold', color }}>{word}</span>
      </div>
    )}
  </div>
)

class ArtistOptions extends Component {
  componentWillUnmount() {
    key.unbind('ctrl + z')
    key.unbind('ctrl + y')
    key.unbind('ctrl + c')
    clearInterval(this.drawInterval)
  }

  componentDidMount() {
    key('ctrl + z', () => this.props.undo())
    key('ctrl + y', () => this.props.redo())
    key('ctrl + c', () => this.props.clear())
  }

  render() {
    return (
      <div className="artistOptions">
        <ColorCircle
          radius={this.props.radius + 10}
          color={this.props.color}
          onColorChange={(color) => this.props.setBrushColor(color)}
        />
        <div className="editOptions">
          <CanvasButton
            mobile
            id="clear"
            iconName="square-o"
            onClick={() => this.props.clear()}
          />
          <CanvasButton
            mobile
            id="undo"
            iconName="undo"
            onClick={() => this.props.undo()}
          />
          <CanvasButton
            mobile
            id="redo"
            iconName="repeat"
            onClick={() => this.props.redo()}
          />
        </div>
      </div>
    )
  }
}

export const CanvasButton = ({ mobile, children, id, onClick, iconName }) => (
  <div className={`option ${id}`} onClick={onClick}>
    <i
      id={id}
      className={mobile ? `fa fa-${iconName} fa-xs` : `fa fa-${iconName}`}
      aria-hidden="true"
    ></i>
  </div>
)

export class ColorCircle extends Component {
  constructor(props) {
    super(props)

    this.state = {
      displayColorPicker: false
    }
  }

  toggleColorPicker() {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker
    })
  }

  hideColorPicker() {
    this.setState({
      displayColorPicker: false
    })
  }

  handleChange(color) {
    this.props.onColorChange(color)
    this.hideColorPicker()
  }

  render() {
    let circleStyle = {
      width: this.props.radius,
      height: this.props.radius,
      backgroundColor: this.props.color
    }

    let popoverStyle = {
      position: 'fixed',
      zIndex: '2',
      top: 0,
      left: 0,
      height: 400,
      width: 400
    }

    return (
      <div className="brushOptions">
        <div
          className="colorCircle"
          onClick={() => this.toggleColorPicker()}
          style={circleStyle}
        ></div>
        {this.state.displayColorPicker ? (
          <div>
            <div className="cover" onClick={() => this.hideColorPicker()} />
            <CirclePicker
              className="colorPicker"
              color={this.props.color}
              onChange={(color) => this.handleChange(color)}
            />
          </div>
        ) : null}
      </div>
    )
  }
}
