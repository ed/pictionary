import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';


class Chat extends Component {
    constructor(props) {
        super(props);
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this.state = {typing: false};
    }

    render() {
        return(
            <div>
            </div>
        )
    }
}

export default Chat;
