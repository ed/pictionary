import React, {Component} from 'react'
import { findDOMNode } from 'react-dom';
import MessageComposer from './MessageComposer';
import Message from './Message';

class MessageSection extends Component { 

  constructor(props) {
    super(props);
    this.state = {
      messages: [] 
    };
  }

  componentDidMount() {
    this._scrollToBottom();
    this.props.socket.on('update chat', msg => 
      this.addMessage(msg)
    );
  }

  render() {
    return (
        <div id="message-section">
          <div className="message-list" ref={(messageList) => this.messageList = messageList}>
            <div className="messageListHeader"></div> 
            {this.displayMessages()}
          </div>
          <MessageComposer />
        </div>
    );
  }

  componentWillUnmount() {
    this.props.socket.off('update chat');
  }

  displayMessages() {
    let messageDivs = [];
    for (let i = 0; i < this.state.messages.length; i++){
      let message = this.state.messages[i];
      messageDivs.push(
        <Message
          key={message.id}
          message={message}
        />
      );
    }
    return messageDivs;
  }

  addMessage(msg) {
    let mv = this.state.messages.slice();
    mv.push(msg);
    this.setState({messages: mv});
  }

  componentDidUpdate() {
    this._scrollToBottom();
  }

  _scrollToBottom() {
    this.messageList.scrollTop = this.messageList.scrollHeight;
  }

  _onChange() {
    console.log('new message!');
    // socket api call
    // this.setState();
  }

};


export default MessageSection;