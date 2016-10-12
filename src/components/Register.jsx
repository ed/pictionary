import React, {Component} from 'react'
import { register } from '../actions'
import { connect } from 'react-redux'
import Form from './Form'


class Register extends Component {

  render() {
    return (
      <div className="form-form">
        <Form title="Sign Up" onSubmit={::this.register}/>
      </div>
    )
  }
  register(username, password) {
    this.props.dispatch(register(username,password))
  }
}

export default connect()(Register)
