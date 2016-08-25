import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MessageComposer from './MessageComposer';
import Message from './Message';
var socket = io.connect();

class MessageSection extends Component{

    constructor(props) {
        super(props);
        this.state = {messages: [] }
    }

    componentDidMount() {
        this._scrollToBottom();
        {/* edward is placeholder for user */}
        socket.emit('add user', 'edward');
        {/* 1 is placeholder for threadID */}
        socket.emit('subscribe', 1);
        socket.on('update', msg => 
                  this.setMessage(msg)
                 );
    }

    render() {
        return (
            <div className="message-section">
                <ul className="message-list" ref="messageList">
                    {this.state.messages}
                </ul>
                <MessageComposer threadID={1}/>
            </div>
        );
    }

    getMessage(message) {
        return (
            <Message
                key={message.id}
                message={message}
            />
        );
    }

    setMessage(msg) {
        var mv = this.state.messages.slice();
        mv.push(this.getMessage(msg));
        this.setState({messages: mv});
    }

    componentDidUpdate() {
        this._scrollToBottom();
    }

    _scrollToBottom() {
        var ul = findDOMNode(this.refs.messageList);
        ul.scrollTop = ul.scrollHeight;
    }

    _onChange() {
        console.log('new message!');
        // socket api call
        // this.setState();
    }

};

export default MessageSection;
