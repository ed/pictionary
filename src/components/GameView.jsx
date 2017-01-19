import React, {Component} from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { addNotification, updateRoom, setRooms, updateGame, setSocket, setUserInfo, fetchRoomData } from '../actions';
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
    }
  }

  componentDidMount() {
    this.props.socket.emit('add user', this.props.user);
    this.props.socket.on('notification', (text) => this.props.dispatch(addNotification(text)));
    this.props.socket.on('update game', (game) => this.updateGame(game) );
    this.props.socket.on('update room', (roomData) => this.updateRoom(roomData) );
    this.fetchRoomData(this.props.params.roomName)
  }

  fetchRoomData(room) {
    this.props.dispatch(fetchRoomData(room)).then((res) => {
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
      {this.state.roomDataReceived ?
        <div className="container">
          <Sidebar />
          <WhiteBoard />
          <MessageSection socket={this.props.socket}/>
        </div>
      :
      <Spinner style={{position: 'absolute', top: '30%', left: '50%'}}/>
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
