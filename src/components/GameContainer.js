import React, {Component} from 'react'
import { redirectLogin, whoami, addNotification, dismissNotification, setTempUserInfo } from '../actions'
import { connect } from 'react-redux'
import Login from './Login'
import Register from './Register'
import { NotificationStack } from 'react-notification'
import Spinner from './Spinner'

class Container extends Component {

  componentDidMount() {
    const { authStatus, user } = this.props;
    if (!user) {
      this.props.dispatch(redirectLogin(this.props.location.pathname));
    }
  }

  render() {
    return (
      <div className="container">

	     {this.props.user ? this.props.children : null}
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.root.user,
    authStatus: state.root.auth.status,
  }
};

export default connect(
  mapStateToProps,
)(Container)
