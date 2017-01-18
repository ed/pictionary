import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resetErrorMessage } from '../actions';
import Spinner from './Spinner';

class Form extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }

  componentDidMount() {
    this.props.dispatch(resetErrorMessage());
  }

  updateUsername(e) {
    this.setState({ username: e.target.value.slice(0,12) });
  }

  updatePassword(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    let textBoxStyle = {
      height: '70px',
    }
    const { secondaryTitle, openSecondary, title, sendingRequest } = this.props;
    return (
      <div className="popoverContainer" style={{ textAlign: 'center', height: '75%', width: '80%'}}>
      <h1> {title} </h1>
      <form className="form" onSubmit={this.go.bind(this)}>
      <input autoFocus={true} value={this.state.username} ref={(userField) => this.userField = userField} onChange={(e) => this.updateUsername(e)} spellCheck={false} className="message-composer data-box" style={textBoxStyle} placeholder="username"/>
      <input onChange={(e) => this.updatePassword(e)} spellCheck={false} className="message-composer data-box" style={textBoxStyle} type="password" placeholder="password"/>
      <button className="myButton active" style={{ height: '70px', width: '100%', marginTop: '100px' }} type="submit">{ sendingRequest ? <Spinner style={{color: 'white', marginTop: 0}}/> : title }</button>
      </form>
      <h3 style={{ color: '#bdbdbd', paddingTop: '100px', width: '100%', textAlign: 'center', borderBottom: '1px solid #bdbdbd', lineHeight: '0.1em', margin: '10px 0 20px' }}>
      <span style={{ fontSize:'90%', fontWeight: 'normal', backgroundColor: 'white', padding: '0 8px'}}> or </span>
      </h3>
      <button onClick={openSecondary} className="myButton blue active" style={{ background: '#1e90ff', height: '50px', width: '50%', marginTop: '5px' }} type="submit">{secondaryTitle}</button>
      </div>
      )
  }

  go(e) {
    e.preventDefault();
    if (!this.props.sendingRequest) {
      this.props.dispatch(resetErrorMessage());
      this.props.onSubmit(this.state.username, this.state.password);
    }
  }
}


const mapStateToProps = (state) => {
  return {
    sendingRequest: state.root.auth.sendingRequest
  }
}

export default connect(mapStateToProps)(Form)
