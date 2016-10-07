import React, {Component} from 'react';
import App from './App';
import { Link } from 'react-router';
import { register } from '../actions';
import { connect } from 'react-redux';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      valid: false,
    }
  }

  changePassword(e) {
    e.preventDefault();
    this.setState({password : e.target.value})
  }

  changeUsername(e) {
    e.preventDefault();
    this.setState({username : e.target.value})
  }

  componentDidMount() {
    socket.on('validate user', valid => this.setState({valid: valid}))
  }

  tryLogin(e) {
    e.preventDefault();
    console.log(this.state.username)
    console.log(this.state.password)
  }

  render() {
    return(
      <div id="loginPopout">
        <form onSubmit={(e) => this.tryLogin(e)}>
          <input placeholder="username" onChange={(e) => this.changeUsername(e)} />
          <input type="password" placeholder="password" onChange={(e) => this.changePassword(e)} />
          <button type="submit"> log in </button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    return { 
        data: state,
    }
};

export default connect(
    mapStateToProps,
)(Login)