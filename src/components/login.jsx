import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Chat from './chat';
var socket = io.connect();
var uuid = require('node-uuid');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {chat : false, name : "", form: "form"};
        this._handleKeyPress = this._handleKeyPress.bind(this);
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.setState({chat: true, name: e.target.value, form: "form1"});
            socket.emit('add user', e.target.value);
            socket.emit('subscribe', uuid.v4());
        }
    }

    render() {
        return(
            <div>
            <div className={this.state.form}>
            <h3 className="title">suh </h3>
            <input className="username" type="text" maxLength="14" onKeyPress={this._handleKeyPress}/>
            </div>
            { this.state.chat ? <Chat/>  : null }
            </div>
        );
    }
}

export default Login;
