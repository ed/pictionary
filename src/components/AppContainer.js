import React, {Component} from 'react'
import { whoami, addNotification, dismissNotification, setTempUserInfo } from '../actions'
import { connect } from 'react-redux'
import { NotificationStack } from 'react-notification'
import { push } from 'react-router-redux'
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
      this.props.dispatch(whoami(this.props.location.pathname)).then(() => {
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