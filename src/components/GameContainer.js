import React, {Component} from 'react'
import { whoami, addNotification, dismissNotification, setTempUserInfo } from '../actions'
import { connect } from 'react-redux'
import Login from './Login'
import Register from './Register'
import { NotificationStack } from 'react-notification'
import Spinner from './Spinner'

export default class Container extends Component {
  render() {
    return (
      <div className="container">
	    {this.props.children}
      </div>
    )
  }
}
