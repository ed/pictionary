import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';


class Chat extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
            <div className="chatArea">
            <ul className="messages"></ul>
            </div>
            <input className="inputMessage" placeholder="Type here..."/>
            </div>
        )
    }
}

export default Chat;
