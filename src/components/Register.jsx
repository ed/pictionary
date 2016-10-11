import React, {Component} from 'react'
import { register } from '../actions'
import { connect } from 'react-redux'
import Form from './Form'


class Register extends Component {

  render() {
    const {...props} = this.props;
    return (
      <div className="form-form">
        <h1> sign up </h1>
        <Form onSubmit={::this.register} {...props}/>
      </div>
    )
  }
  register(username, password) {
    this.props.dispatch(register(username,password))
  }
}

const mapStateToProps = (state) => {
  return {
    data: state,
  }
}

export default connect(mapStateToProps)(Register)
