import React, {Component} from 'react';
import { setSocket, setUserInfo } from '../actions'
import Sidebar from './Sidebar'
import { connect } from 'react-redux';

const socket = io.connect();

const username = 'african_child' + String(Math.random());

class Container extends Component {
  constructor(props) {
    super(props)
    this.props.dispatch(setSocket(socket))
    this.props.dispatch(setUserInfo(username))
    socket.emit('add user', username);
  }

  render() {
    return (
      <div className="container">
        <Sidebar />
        {this.props.children}
      </div>
    )
  }
}

export default connect()(Container)
