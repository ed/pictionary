import React, {Component} from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Link } from 'react-router'
import Popover from './Popover'
import Register from './Register'
import Login from './Login'

class Home extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	loggingIn: false,
	  	signingUp: false
	  };
	}

	componentDidMount() {
    if (this.props.authStatus) {
      this.props.dispatch(push('/game'))
    }
  }

  openLogin() { this.setState({ loggingIn: true }); }

  closeLogin() { this.setState({ loggingIn: false }); }

  openSignup() { this.setState({ signingUp: true }); }

  closeSignup() { this.setState({ signingUp: false }); }

	render() {
		return (
			<div className="container backgroundImg" style={{position:'absolute', top: 0, left: 0, right:0, bottom: 0, opacity: '.9', backgroundSize: 'cover'}}>
			<div className="popoverContainer" style={{color: 'white', textAlign: 'center'}}>
				<button className="myButton-transparent" style={{marginBottom: '20px', position: 'relative'}} onClick={() => this.openSignup()}>Sign Up</button>
				<br/>
				or
				<br/>
				<button className="myButton-transparent" style={{marginTop: '20px', position: 'relative'}} onClick={() => this.props.dispatch(push('/game'))}>Play</button>
			</div>
			<ul style={{position: 'absolute', left: 0, top: 0, width: '100%'}}>
			  <li><a style={{}} onClick={() => this.openLogin()}>Log in</a></li>
			</ul>

			<Popover close={() => this.closeSignup()} isOpen={this.state.signingUp}>
        <Register close={() => this.closeSignup()}/> 
      </Popover>

      <Popover close={() => this.closeLogin()} isOpen={this.state.loggingIn}>
        <Login close={() => this.closeLogin()} /> 
      </Popover>

			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    authStatus: state.root.auth.status,
  }
}

export default connect(mapStateToProps)(Home)