import React, { Component } from 'react'
import { guestLogin, openLogin, logout } from '../actions'
import { isEmpty } from 'lodash'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { NotificationStack } from 'react-notification'
import Spinner from './Spinner'

let icon
try {
  icon = require('../../img/box-32-183014.png').default
} catch (e) {}

class Container extends Component {
  render() {
    let inRoom = false
    if (this.props && this.props.location && this.props.location.pathname) {
      inRoom = true
    }
    const navBackground = inRoom ? '#a7d2cb' : ''
    const navColor = inRoom ? 'white' : 'black'
    return (
      <div
        className="container"
        style={{ height: '100%', display: 'flex', flexFlow: 'column' }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '52px',
            width: '100%',
            background: navBackground
          }}
        >
          <ul
            style={{
              userSelect: 'none',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%'
            }}
          >
            <li
              onClick={() => this.props.dispatch(push('/'))}
              style={{
                color: navColor,
                fontSize: '120%',
                fontWeight: 'bold',
                marginTop: '10px',
                marginLeft: '15px',
                float: 'left'
              }}
            >
              <img style={{ opacity: '.9' }} src={icon} />{' '}
              <span style={{ position: 'absolute', top: '15px', left: '50px' }}>
                {' '}
                ugp{' '}
              </span>
            </li>
          </ul>
        </div>
        <div
          style={{
            paddingTop: '52px',
            height: '100%',
            boxSizing: 'border-box'
          }}
        >
          {this.props.user ? this.props.children : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.root.user,
    authStatus: state.root.auth.status
  }
}

export default connect(mapStateToProps)(Container)
