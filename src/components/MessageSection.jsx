import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MessageComposer from './MessageComposer';
import Message from './Message';

class MessageSection extends Component{

  componentDidMount() {
    this._scrollToBottom();
  }

  render() {
    return (
      <div className="message-section">
        <ul className="message-list" ref="messageList">
        </ul>
        <MessageComposer threadID={1}/>
      </div>
    );
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
