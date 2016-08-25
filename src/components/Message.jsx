import React, { Component } from 'react';
var ReactPropTypes = React.PropTypes;

class Message extends Component {
    propTypes: {
        message: ReactPropTypes.object
    };

    render (){
        var message = this.props.message;
        return (
            <li className="message-list-item">
            <h5 className="message-author-name">{message.authorName}</h5>
            <div className="message-time">
            {message.timestamp}
            </div>
            <div className="message-text">{message.text}</div>
            </li>
        );
    }
}

export default Message;
