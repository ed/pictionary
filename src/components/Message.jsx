import React, { Component } from 'react';
var ReactPropTypes = React.PropTypes;

/**
 * TODO: move hover to react -- add this
 * {!this.props.displayHeader && this.state.hover ? <span className="message-time">{this.props.message.timestamp}</span> : null}
 * to display side timestamp
 */

class Message extends Component {
    render (){
        return (
            <div className="message">
                <div className="leftMessage">
                </div>
                <div className="innerMessage">
                    {this.props.displayHeader ? <MessageHeader message={this.props.message}/> : null}
                    <div className="messageText">{this.props.message.text}</div>
                </div>
            </div>
        );
    }
}

class MessageHeader extends Component {
    render() {
        return (
            <span>
                <span className="authorName">{this.props.message.authorName}  </span> 
                <span className="messageTime">{this.props.message.timestamp}</span>
            </span>
        );
    }
}


export default Message;
