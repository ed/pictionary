import React, { Component } from 'react';
import { connect } from 'react-redux'
import { resetErrorMessage } from '../actions'
import Spinner from './Spinner'

class Form extends Component {

  componentDidMount() {
    this.props.dispatch(resetErrorMessage())
  }

  render() {
    const { error, sendingRequest } = this.props;
    return (
      <form className="form" onSubmit={this.go.bind(this)}>
	<div className="form-wrapper">
	  <span className="form-item">Username</span>
	  <input ref={(c) => this._username = c} className="form-field" id="username" type="text" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
	</div>
	<div className="form-wrapper">
	  <span className="form-item">Password</span>
	  <input ref={(c) => this._password = c} className="form-field" id="password" type="password" />
	</div>
	<button type="submit">submit</button>
	{ error ? <p style={{ color: '#F92D2A' }}> {error} </p> : null }
	{ sendingRequest ? <Spinner /> : null }
      </form>
    )
  }

  go(e) {
    e.preventDefault();
    this.props.dispatch(resetErrorMessage())
    this.props.onSubmit(this._username.value, this._password.value)
  }
}


const mapStateToProps = (state) => {
  return {
    error: state.root.error,
    sendingRequest: state.root.auth.sendingRequest
  }
}

export default connect(mapStateToProps)(Form)
