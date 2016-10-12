import React, {Component} from 'react';
import { whoami } from '../actions'
import { connect } from 'react-redux';
import Login from './Login'
import Register from './Register'
import { Notification } from 'react-notification';

class Container extends Component {
  constructor(props) {
    super(props);
  
   this.state = {
      isFetching: true,
      errorActive: false
    }
  }

  componentDidMount() {
    const { cookie, status, user } = this.props
    if (cookie) {
      this.props.dispatch(whoami()).then(() => {
        this.setState({
          isFetching: false
        })
      })
    }
    else {
      this.setState({
        isFetching: false
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== null) {
      this.setState({errorActive: true})
    }
    else {
      this.setState({errorActive: false})
    }
  }

  render() {
    const { roomStatus, user, cookie, error } = this.props
    const { isFetching } = this.state
    console.log(error)
    return (
      <div className="container">
      <Notification
          isActive={this.state.errorActive}
          message={this.props.error || ""}
          action="close"
          onClick={() =>  this.setState({ errorActive: false })}
        />
      {!this.state.isFetching ?
      roomStatus ?
      <div className="container">
	      {this.props.children}
      </div>
      :
      <Register/>
      :
      null }
      </div>
    )
  }
    
}

const mapStateToProps = (state) => {
  return {
    error: state.root.error,
    user: state.root.user,
    cookie: state.root.cookie,
    status: state.root.auth.status,
    roomStatus: state.root.rooms.isValid
  }
};

export default connect(
  mapStateToProps,
)(Container)
