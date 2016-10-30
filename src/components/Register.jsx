import React, {Component} from 'react';
import { register, openLogin } from '../actions';
import { connect } from 'react-redux';
import Form from './Form';


class Register extends Component {

  render() {
    return (
      <div className="form-form">
        <Form secondaryTitle="Log in" openSecondary={() => this.props.dispatch(openLogin())} title="Sign Up" onSubmit={::this.register}/>
      </div>
    )
  }
  register(username, password) {
    this.props.dispatch(register(username,password));
  }
}

export default connect()(Register);
