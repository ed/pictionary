import React, {Component} from 'react';
import { whoami, addNotification, dismissNotification, setTempUserInfo } from '../actions';
import { connect } from 'react-redux';
import { NotificationStack } from 'react-notification';
import { push } from 'react-router-redux';
import Popover from './PopoverSmall';
import Register from './Register';
import Login from './Login';
import Spinner from './Spinner';

class Container extends Component {
	constructor(props) {
    super(props);

   this.state = {
      isFetching: true,
    }
  }

  componentDidMount() {
    const { cookie, authStatus, user } = this.props
    if (cookie) {
      this.props.dispatch(whoami(this.props.location.pathname)).then(() => {
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
		const { roomStatus, user, cookie, error } = this.props
    const { isFetching } = this.state;
		let popoverContent = null;
		switch(this.props.openModal) {
			case 'signup':
				popoverContent = <Register/>;
				break;
			case 'login':
				popoverContent = <Login/>;
				break;
		}
		console.log(this.props.openModal);
		return (
			!isFetching?
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
								transition: 'all .5s ease-in-out, opacity .8s ease-in-out',
			          opacity: 0,
			          right: '-100%',
			          left: '',
			        }
			      }
			    }
			    activeBarStyleFactory={(ind, style) => {
			        return {
			          ...style,
			          left: '',
			          right: '15px',
			          top: `${2 + ind * 5}rem`,
			          opacity: 1,
								boxShadow: '3px 3px 5px -1px rgba(0,0,0,0.39)'
			        }
			      }
			    }
			    />
					<Popover isOpen={this.props.openModal !== 'NONE'}>
						{popoverContent}
		      </Popover>
			    {this.props.children}
			</div>
			:
			<Spinner />
		)
	}
}

const mapStateToProps = (state) => {
  return {
		openModal: state.root.modals.openModal,
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
