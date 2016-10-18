import React, { Component } from 'react';
import { connect } from 'react-redux'
import { resetErrorMessage } from '../actions'
import Spinner from './Spinner'

class Form extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      username: '',
      password: ''
    };
  }

  componentDidMount() {
    this.props.dispatch(resetErrorMessage())
  }

  updateUsername(e) {
    this.setState({ username: e.target.value })
  }

  updatePassword(e) {
    this.setState({ password: e.target.value })
  }

  render() {
    let textBoxStyle = {
      fontSize:'120%',
      color:'#464646',
      paddingBottom: '6px', 
      paddingTop:'10px',
      marginLeft: 0,
      marginRight: 0, 
      paddingRight: 0,
      marginTop: '10px', 
      borderWidth: '1px', 
      height: '44px',
      width: '100%',
      boxSizing: 'border-box',
    }
    const { error, sendingRequest } = this.props;
    return (
      <div className="popoverContainer" style={{width: '400px', textAlign: 'center'}}>
      <div style={{ fontSize: '200%'}}> {this.props.title}</div>
      <form className="form" onSubmit={this.go.bind(this)}>
      <input ref={(userField) => this.userField = userField} onChange={(e) => this.updateUsername(e)} spellCheck={false} className="message-composer" style={textBoxStyle} placeholder="username"/>
      <input onChange={(e) => this.updatePassword(e)} spellCheck={false} className="message-composer" style={textBoxStyle} placeholder="password"/>
      <button className="myButton active" style={{width: '100%', marginTop: '80px'}} type="submit">{this.props.title}</button>
      </form>
      { sendingRequest ? <Spinner /> : null }
      </div>
      )
  }

  go(e) {
    e.preventDefault();
    this.props.dispatch(resetErrorMessage())
    this.props.onSubmit(this.state.username, this.state.password)
    this.userField.focus()
  }
}


const mapStateToProps = (state) => {
  return {
    sendingRequest: state.root.auth.sendingRequest
  }
}

export default connect(mapStateToProps)(Form)
