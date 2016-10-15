import React, {Component} from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Link } from 'react-router'

class Home extends Component {

	componentDidMount() {
    if (this.props.authStatus) {
      this.props.dispatch(push('/game'))
    }
  }

	render() {
		return (
			<div className="container" style={{position:'absolute', top: 0, left: 0, right:0, bottom: 0, opacity: '.9', background: 'url(../../img/background.jpg) no-repeat center center fixed', backgroundSize: 'cover'}}>
			<div className="popoverContainer" style={{color: 'white', textAlign: 'center'}}>
				<button className="myButton active" style={{marginBottom: '20px', position: 'relative'}} onClick={() => this.props.dispatch(push('/register'))}>Sign Up</button>
				<br/>
				or
				<br/>
				<button className="myButton active" style={{marginTop: '20px', position: 'relative'}} onClick={() => this.props.dispatch(push('/game'))}>Play</button>
			</div>
			<ul style={{position: 'absolute', left: 0, top: 0, width: '100%'}}>
			  <li><a style={{}} onClick={() => this.props.dispatch(push('/login'))}>Log in</a></li>
			</ul>
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