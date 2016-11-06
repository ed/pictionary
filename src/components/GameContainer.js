import React, {Component} from 'react';
import { redirectLogin, openLogin, logout } from '../actions';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Login from './Login';
import Register from './Register';
import { NotificationStack } from 'react-notification';
import Spinner from './Spinner';

let icon;
try {
  icon = require('../../img/box-32-183014.png');
}
catch(e) {}


class Container extends Component {

  componentDidMount() {
    const { authStatus, user } = this.props;
    if (!user) {
      this.props.dispatch(redirectLogin(this.props.location.pathname));
    }
  }

  render() {
    const inRoom = this.props.location.pathname.search('/r/') > -1;
    const navBackground = inRoom ? '#4abdac' : '';
    const navColor = inRoom ? 'white' : 'black';
    return (
      <div className="container" style={{ height: '100%', dispaly: 'flex', flexFlow: 'column'}}>
        <div style={{position: 'absolute', top: 0, left: 0, height: '52px', width: '100%', background: navBackground}}>
        <ul style={{userSelect: 'none', position: 'absolute', left: 0, top: 0, width: '100%'}}>
          <li onClick={() => this.props.dispatch(push('/game'))} style={{color: navColor, fontSize: '120%', fontWeight: 'bold', marginTop: '10px', marginLeft: '15px', float: 'left'}}>
            <img style={{ opacity: '.9' }} src={icon}/> <span style={{ position: 'absolute', top: '15px', left: '50px'}}> ugp </span>
          </li>
          {this.props.authStatus ?
            <li style={{ marginTop: '5px', marginRight: '40px' }}><a style={{ color: navColor, border: '0px' }} onClick={() => this.props.dispatch(logout())}>Log out</a></li>
            :
            <li style={{ marginTop: '5px', marginRight: '40px' }}><a style={{ color: navColor, border: `2px solid ${navColor}` }} onClick={() => this.props.dispatch(openLogin())}>Log in</a></li>
          }
        </ul>
        </div>
        <div style={{paddingTop: '52px', height: '100%', boxSizing: 'border-box'}}>
  	     {this.props.user ? this.props.children : null}
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.root.user,
    authStatus: state.root.auth.status,
  }
};

export default connect(
  mapStateToProps,
)(Container)
