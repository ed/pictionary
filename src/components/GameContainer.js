import React, {Component} from 'react';
import { whoami, addNotification, dismissNotification, setTempUserInfo } from '../actions'
import { connect } from 'react-redux';
import Login from './Login'
import Register from './Register'
import { NotificationStack } from 'react-notification';

class Container extends Component {
  constructor(props) {
    super(props);
  
   this.state = {
      isFetching: true,
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
      //this.props.dispatch(setTempUserInfo())
      this.setState({
        isFetching: false
      })
    }
  }


  render() {
    const { roomStatus, user, cookie, error } = this.props
    const { isFetching } = this.state
    return (
      <div className="container">
      <NotificationStack
          notifications={this.props.notifications.toArray()}
          onDismiss={notification => this.props.dispatch(dismissNotification(notification))}
          barStyleFactory={(ind, style) => {
            return {
              ...style, 
              fontFamily: 'Lato',
              background: '#ffad90',
              borderWidth: '0px',
              height: '30px',
              color: 'white',
              borderRadius: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              top: `${2 + ind * 5}rem`,
              opacity: 0,
              boxShadow: '',
              right: '-100%',
              left: '',
            }
          }
        }
        activeBarStyleFactory={(ind, style) => {
            return {
              ...style, 
              left: '',
              right: '0px',
              top: `${2 + ind * 5}rem`,
              opacity: 1
            }
          }
        }
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
    notifications: state.root.notifications,
    user: state.root.user,
    cookie: state.root.cookie,
    status: state.root.auth.status,
    roomStatus: state.root.rooms.isValid
  }
};

export default connect(
  mapStateToProps,
)(Container)
