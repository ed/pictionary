import React, { Component } from 'react'
import {
  Router,
  Route,
  IndexRoute,
  Link,
  IndexLink,
  browserHistory
} from 'react-router'

import { connect } from 'react-redux'
import {
  redirectLogin,
  setUserInfo,
  addNotification,
  fetchRoomData,
  setRooms,
  setSocket,
  updateGame,
  updateRoom
} from '../actions'
import MessageSection from './MessageSection'
import Sidebar from './Sidebar'
import WhiteBoard from './WhiteBoard'
import Spinner from './Spinner'

const MediaQuery = require('react-responsive').default

class GameView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomDataReceived: false
    }
  }

  componentDidMount() {
    if (!this.props.user) {
      this.props.dispatch(redirectLogin(this.props.location.pathname))
    } else {
      this.props.socket.emit('add user', this.props.user)
      this.props.socket.on('notification', (text) =>
        this.props.dispatch(addNotification(text))
      )
      this.props.socket.on('update game', (game) => this.updateGame(game))
      this.props.socket.on('update room', (roomData) =>
        this.updateRoom(roomData)
      )
      this.fetchRoomData(this.props.params.roomName)
    }
  }

  fetchRoomData(room) {
    this.props.dispatch(fetchRoomData(room)).then((res) => {
      if (!res.error) {
        this.props.socket.emit('join room', room)
      }
    })
  }

  componentWillUnmount() {
    if (this.props.user) {
      clearInterval(this.roomUpdate)
      this.props.socket.off('update game')
      this.props.socket.off('update room')
    }
  }

  updateRoom(roomData) {
    this.props.dispatch(updateRoom(roomData.curRoom))
    this.props.dispatch(setRooms(roomData.rooms))
    this.setState({
      roomDataReceived: true
    })
  }

  updateGame(game) {
    this.props.dispatch(updateGame(game))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.roomName !== nextProps.params.roomName) {
      this.setState({
        roomDataReceived: false
      })
      this.props.socket.emit('join room', nextProps.params.roomName)
    }
  }

  render() {
    return (
      <div className="container">
        {this.state.roomDataReceived ? (
          <>
            <MediaQuery maxDeviceWidth={1224}>
                <WhiteBoard mobile={true} route={this.props.route} />
                <MessageSection mobile={true} socket={this.props.socket} />
            </MediaQuery>
            <MediaQuery minDeviceWidth={1224}>
                <Sidebar />
                <WhiteBoard route={this.props.route} />
                <MessageSection socket={this.props.socket} />
            </MediaQuery>
          </>
        ) : (
          <Spinner style={{ position: 'absolute', top: '30%', left: '50%' }} />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    socket: state.root.socket,
    user: state.root.user
  }
}

export default connect(mapStateToProps)(GameView)
