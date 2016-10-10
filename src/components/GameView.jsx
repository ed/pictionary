import React, {Component} from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { updateRoom, setRooms, updateGame, setSocket, setUserInfo, fetchRoomData } from '../actions'
import MessageSection from './MessageSection';
import Sidebar from './Sidebar';
import WhiteBoard from './WhiteBoard';
import Login from './Login';

class GameView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomDataReceived: false,
      loggingIn: false,
    }
  }

  componentDidMount() {
    this.props.socket.on('update game', (game) => this.updateGame(game) );
    this.props.socket.on('update room', (roomData) => this.updateRoom(roomData) );
    this.props.socket.on('turn over', () =>  alert('turn over'));
    this.props.socket.emit('join room', this.props.params.roomName);
    this.fetchRoomData(this.props.params.roomName);
    this.roomUpdate = setInterval(() => this.props.dispatch(fetchRoomData(this.props.params.roomName)), 1000)
  }

  fetchRoomData(room) {
    this.props.dispatch(fetchRoomData(this.props.params.roomName)).then((res) => {
      console.log(res)
      if (!res.error) {
        this.setState({
          roomDataReceived: true
        });
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.roomUpdate)
    this.props.socket.off('update game');
    this.props.socket.off('update room');
    this.props.socket.off('turn over');
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
      console.log('client change room')
      this.props.socket.emit('join room', nextProps.params.roomName);
      this.fetchRoomData(nextProps.params.roomName)
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
      <div className="spinner">
        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
      </div>
      }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { 
      socket: state.root.socket,
      user: state.root.user
  }
};

export default connect(
    mapStateToProps,
)(GameView)
