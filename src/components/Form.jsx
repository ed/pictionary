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
      height: '70px',
    }
    const { secondaryTitle, openSecondary, title, sendingRequest } = this.props;
    return (
      <div className="popoverContainer" style={{ textAlign: 'center', height: '75%', width: '80%'}}>
      <h1> {title} </h1>
      <form className="form" onSubmit={this.go.bind(this)}>
      <input ref={(userField) => this.userField = userField} onChange={(e) => this.updateUsername(e)} spellCheck={false} className="message-composer data-box" style={textBoxStyle} placeholder="username"/>
      <input onChange={(e) => this.updatePassword(e)} spellCheck={false} className="message-composer data-box" style={textBoxStyle} type="password" placeholder="password"/>
      <button className="myButton-transparent" style={{ height: '70px', width: '100%', marginTop: '100px' }} type="submit">{ sendingRequest ? <Spinner style={{color: 'white', marginTop: 0}}/> : title }</button>
      </form>
      <h2 style={{ color: '#bdbdbd', paddingTop: '100px', width: '100%', textAlign: 'center', borderBottom: '1px solid #bdbdbd', lineHeight: '0.1em', margin: '10px 0 20px' }}> <span style={{ backgroundColor: 'white', padding: '0 10px'}}> or </span> </h2>
      <button onClick={openSecondary} className="myButton-transparent" style={{ background: '#1e90ff', height: '50px', width: '50%', marginTop: '5px' }} type="submit">{secondaryTitle}</button>
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
