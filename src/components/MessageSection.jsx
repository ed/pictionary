import React, {Component} from 'react'
import { findDOMNode } from 'react-dom';
import MessageComposer from './MessageComposer';
import Message from './Message';

let socket = io.connect();

class MessageSection extends Component { 

  constructor(props) {
    super(props);
    this.state = {
      messages: [] 
    };
    this.user = {
      user: this.props.user,
    };
  }

  componentDidMount() {
    this._scrollToBottom();
    socket.emit('subscribe', 1);
    socket.on('update', msg => 
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
          <MessageComposer artist={this.props.artist} word={this.props.word} user={this.user} threadID={1}/>
        </div>
    );
  }

  displayMessages() {
    let messageDivs = [];
    for (let i = 0; i < this.state.messages.length; i++){
      let message = this.state.messages[i];
      let displayHeader = (i == 0 || this.state.messages[i-1].authorName != message.authorName);
      messageDivs.push(
        <Message
          displayHeader={displayHeader}
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
