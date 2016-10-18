import React, {Component} from 'react'
import { whoami, addNotification, dismissNotification, setTempUserInfo } from '../actions'
import { connect } from 'react-redux'
import Login from './Login'
import Register from './Register'
import { NotificationStack } from 'react-notification'
import Spinner from './Spinner'

class Container extends Component {
  constructor(props) {
    super(props);
  
   this.state = {
      isFetching: true,
    }
  }

  componentDidMount() {
    const { cookie, authStatus, user } = this.props
    console.log(cookie, authStatus, user)
    if (cookie) {
      this.props.dispatch(whoami()).then(() => {
        this.setState({
          isFetching: false
        })
      })
    }
    else {
      if (!authStatus) this.props.dispatch(setTempUserInfo())
      this.setState({
        isFetching: false
      })
    }
  }


  render() {
    const { roomStatus, user, cookie, error } = this.props
    const { isFetching } = this.state;
    return (
      !isFetching && roomStatus ?
      <div className="container">
	      {this.props.children}
      </div>
      :
      <Spinner />
    )
  }
    
}

const mapStateToProps = (state) => {
  return {
    notifications: state.root.notifications,
    user: state.root.user,
    cookie: state.root.cookie,
    authStatus: state.root.auth.status,
    roomStatus: state.root.rooms.isValid
  }
};

export default connect(
  mapStateToProps,
)(Container)
