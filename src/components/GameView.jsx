import React, {Component} from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { updateRoom, setRooms, updateGame, setSocket, setUserInfo, fetchRoomData } from '../actions'
import MessageSection from './MessageSection';
import Sidebar from './Sidebar';
import WhiteBoard from './WhiteBoard';
import Login from './Login';
import Spinner from './Spinner';

class GameView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomDataReceived: false,
      loggingIn: false,
    }
  }

  componentDidMount() {
    this.props.socket.emit('add user', this.props.user)
    this.props.socket.on('update game', (game) => this.updateGame(game) );
    this.props.socket.on('update room', (roomData) => this.updateRoom(roomData) );
    this.fetchRoomData(this.props.params.roomName)
  }

  fetchRoomData(room) {
    this.props.dispatch(fetchRoomData(room)).then((res) => {
      console.log(res)
      if (!res.error) {
        this.props.socket.emit('join room', room);
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.roomUpdate)
    this.props.socket.off('update game');
    this.props.socket.off('update room');
  }

  updateRoom(roomData) {
    this.props.dispatch(updateRoom(roomData.curRoom));
    this.props.dispatch(setRooms(roomData.rooms));
    this.setState({
     roomDataReceived: true,
    });
  }

  updateGame(game) {
    this.props.dispatch(updateGame(game));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.roomName !== nextProps.params.roomName){
      this.setState({
        roomDataReceived: false,
      });
      this.props.socket.emit('join room', nextProps.params.roomName);
    }
  }

  render() {
    return(
      <div className="container">
      {this.state.loggingIn ? <Login /> : null}
      {this.state.roomDataReceived ?
        <div className="container">
          <Sidebar />
          <WhiteBoard />
          <MessageSection socket={this.props.socket}/>
        </div>
      : 
      <Spinner />
      }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return { 
      socket: state.root.socket,
      user: state.root.user
  }
};

export default connect(
    mapStateToProps,
)(GameView)
