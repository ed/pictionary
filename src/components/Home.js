import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push, replace } from 'react-router-redux'
import { openSignup, closeSignup, openLogin, closeLogin } from '../actions'
import { Link } from 'react-router'

import GuestLogin from './GuestLogin'

class Home extends Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps() {
    if (this.props.user) {
      this.props.dispatch(push('/new'))
    }
  }

  render() {
    return <GuestLogin />
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.root.user
  }
}

export default connect(mapStateToProps)(Home)
