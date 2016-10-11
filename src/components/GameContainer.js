import React, {Component} from 'react';
import { whoami } from '../actions'
import { connect } from 'react-redux';
import Register from './Register'

class Container extends Component {
  constructor(props) {
    super(props);
  
   this.state = {
      isFetching: true
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

  render() {
    const { roomStatus, user, cookie } = this.props
    const { isFetching } = this.state
    console.log(user, roomStatus, cookie)
    return (
      !this.state.isFetching ?
      roomStatus ?
      <div className="container">
	      {this.props.children}
      </div>
      :
      <Register/>
      :
      null
    )
  }
    
}

const mapStateToProps = (state) => {
  return {
    user: state.root.user,
    cookie: state.root.cookie,
    status: state.root.auth.status,
    roomStatus: state.root.rooms.isValid
  }
};

export default connect(
  mapStateToProps,
)(Container)
