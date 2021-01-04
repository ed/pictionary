import React, { Component } from 'react'
import { setTempUserInfo } from '../actions'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class GuestLogin extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (!this.props.user) {
      this.addTempUser()
    }
  }

  addTempUser() {
    this.props.dispatch(setTempUserInfo())
  }

  render() {
    return <></>
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.root.user
  }
}

export default connect(mapStateToProps)(GuestLogin)
