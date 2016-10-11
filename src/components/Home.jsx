import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setSocket, fetchRooms, logout } from '../actions'
import CreateRoom from './CreateRoom'
import Login from './Login'
import Spinner from './Spinner'
import { Link } from 'react-router';

let socket;

const CreateRoomWrapper = () => (
  <div className="popoverContainer">
    <CreateRoom />
  </div>
)


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomsReceived: false,
    }
  }


  // for cookie login
  componentWillReceiveProps(nextProps) {
    const { status, user, cookie } = this.props
    if (nextProps.status === status && nextProps.user === user && cookie) {
      if (status) {
	socket = io();
	this.props.dispatch(setSocket(socket))
	socket.emit('add user', user);
	this.props.dispatch(fetchRooms()).then(() => this.setState({
	  roomsReceived: true
	}))
      }
    }
  }

  componentDidMount() {
    const { status, user } = this.props
    if (status) {
      socket = io();
      this.props.dispatch(setSocket(socket))
      socket.emit('add user', user);
      this.props.dispatch(fetchRooms()).then(() => this.setState({
	roomsReceived: true
      }))
    }
  }

  render() {
    const { status, user } = this.props;
    return (
      status ?
      <div>
	<button onClick={(e) => this.bye(e)}>log out</button>
	{this.state.roomsReceived ? <CreateRoomWrapper /> : <Spinner />}
      </div>
      :
      <span>
	<Login />
	<div className="redirect">
	  <p> or </p>
	  <Link to='/signup'> sign up </Link>
	</div>
      </span>
    )
  }
  bye(e) {
    e.preventDefault();
    if (confirm('are you sure you want to logout?'))
      this.props.dispatch(logout())
  }

}

const mapStateToProps = (state) => {
  return {
    user: state.root.user,
    cookie: state.root.cookie,
    status: state.root.auth.status,
  }
}

export default connect(mapStateToProps)(Home)
