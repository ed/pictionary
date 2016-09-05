import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MessageComposer from './MessageComposer';
import Message from './Message';
import WhiteBoard from './WhiteBoard'

let socket = io.connect();

class MessageSection extends Component{

    constructor(props) {
        super(props);
        this.state = {messages: [] }
    }

    componentDidMount() {
        this._scrollToBottom();
        {/* edward is placeholder for user */}
        this.user = {
            username: 'edward',
        };
        socket.emit('add user', this.user.username);
        {/* 1 is placeholder for threadID */}
        socket.emit('subscribe', 1);
        socket.on('update', msg => 
                  this.addMessage(msg)
        );
    }

    render() {
        return (
            <div className="social-area">
                <SideBar/>
                <WhiteBoard/>
                <div id="message-section">
                    <div className="message-list" ref={(messageList) => this.messageList = messageList}>
                        <div className="messageListHeader"></div> 
                        {this.displayMessages()}
                    </div>
                    <MessageComposer threadID={1}/>
                </div>
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


export class SideBar extends Component {
    render() {
        return (
            <div id="sidebar">
                <a href='#'><div className="sidebarHeader">Ultra Gaming Platform</div></a>
                <div className="sidebarElementArea">
                <SidebarElement title="draw stuff"/>
                </div>
            </div>
        );
    }
}


class SidebarElement extends Component {
    render() {
        return (
            <a href="#">
                <div className="sidebarElement">
                    <span><i>#</i> {this.props.title}</span>
                </div>
            </a>
        );
    }
}


export default MessageSection;
