import React, {Component} from 'react';
import { setSocket, setUserInfo, fetchRooms } from '../actions'
import Sidebar from './Sidebar'
import { connect } from 'react-redux';

let socket;

const username = 'AC' + String(Math.floor(Math.random() * 100));

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomsReceived: false
    };
  }

  componentDidMount() {
    socket = io();
    this.props.dispatch(setSocket(socket))
    this.props.dispatch(setUserInfo(username))
    socket.emit('add user', username);
    this.props.dispatch(fetchRooms()).then(() => this.setState({
      roomsReceived: true
    }))
  }

  render() {
    return (
      <div className="container">
      {this.state.roomsReceived ?
        <div className="container">
        {this.props.children}
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

export default connect()(Container)
