import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import { openSignup, closeSignup, openLogin, closeLogin } from '../actions';
import { Link } from 'react-router';
import Popover from './PopoverSmall';
import Register from './Register';
import Login from './Login';

class Home extends Component {

	constructor(props) {
	  super(props);
	}

	componentDidMount() {
    if (this.props.authStatus) {
      this.props.dispatch(replace('/game'));
    }
  }

	render() {
		return (
			<div className="container backgroundImg" style={{position:'absolute', top: 0, left: 0, right:0, bottom: 0, opacity: '.9', backgroundSize: 'cover'}}>
			<div className="popoverContainer" style={{color: 'white', textAlign: 'center'}}>
				<button className="myButton-transparent" style={{marginBottom: '20px', position: 'relative'}} onClick={() => this.props.dispatch(openSignup())}>Sign Up</button>
				<br/>
				or
				<br/>
				<button className="myButton-transparent" style={{marginTop: '20px', position: 'relative'}} onClick={() => this.props.dispatch(push('/guest'))}>Play as guest</button>
			</div>
			<ul style={{position: 'absolute', left: 0, top: 0, width: '100%'}}>
			  <li><a style={{}} onClick={() => this.props.dispatch(openLogin())}>Log in</a></li>
			</ul>

			<Popover isOpen={this.props.signupOpen}>
        <Register/>
      </Popover>

      <Popover isOpen={this.props.loginOpen}>
        <Login />
      </Popover>

			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
		signupOpen: state.root.modals.openModal === 'signup',
		loginOpen: state.root.modals.openModal === 'login',
    authStatus: state.root.auth.status,
  }
}

export default connect(mapStateToProps)(Home)
