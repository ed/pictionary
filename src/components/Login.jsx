import React, {Component} from 'react'
import { login } from '../actions'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Form from './Form'


class Login extends Component {

  componentDidMount() {
    if (this.props.authStatus) {
      this.props.dispatch(push('/game'))
    }
  }

  render() {
    const {...props} = this.props;
    return (
      <div className="form-form">
        <h1>login form </h1>
        <Form title="Log in" onSubmit={::this.login} {...props}/>
      </div>
    )
  }
  login(username, password) {
    this.props.dispatch(login(username,password))
  }
}


const mapStateToProps = (state) => {
  return {
    authStatus: state.root.auth.status,
  }
}

export default connect(mapStateToProps)(Login)
