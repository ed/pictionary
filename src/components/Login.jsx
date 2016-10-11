import React, {Component} from 'react'
import { login } from '../actions'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Form from './Form'


class Login extends Component {

  render() {
    const {...props} = this.props;
    return (
      <div className="form-form">
        <h1>login form </h1>
        <Form onSubmit={::this.login} {...props}/>
      </div>
    )
  }
  login(username, password) {
    this.props.dispatch(login(username,password))
  }
}


const mapStateToProps = (state) => {
  return {
    data: state,
  }
}

export default connect(mapStateToProps)(Login)
