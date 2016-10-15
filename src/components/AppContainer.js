import React, {Component} from 'react'
import { dismissNotification } from '../actions'
import { connect } from 'react-redux'
import { NotificationStack } from 'react-notification'
import { push } from 'react-router-redux'

class Container extends Component {
	render() {
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
			    {this.props.children}
			</div>
		)
	}  
}

const mapStateToProps = (state) => {
  return {
    notifications: state.root.notifications,
    authStatus: state.root.auth.status,
  }
};

export default connect(
  mapStateToProps,
)(Container)