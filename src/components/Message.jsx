import React, { Component } from 'react';
var ReactPropTypes = React.PropTypes;

const Message = ({ message, displayHeader }) => (
    <div className="message">
        <div style={{width: '20px', height: '1px', display: 'inline-block'}}></div>
        <div className="innerMessage">
            <span className="authorName" style={{color: message.color}}>{message.author}  </span>
            <span className="messageText">{message.text}</span>
        </div>
    </div>
);

export default Message;
