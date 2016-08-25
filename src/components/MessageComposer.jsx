import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
var MessageCreator = require('../actions/MessageActionCreator');


class MessageComposer extends Component {

    constuctor(props) {
        super(props);
        this.state = {text: '', typing: false};
    }

    propTypes: {
        threadID: React.PropTypes.string.isRequired
        user: React.PropTypes.string.isRequired
        socket: PropTypes.object.isRequired
    },

    render() {
        return (
            <textarea
            className="message-composer"
            ref="message-composer"
            name="message"
            value={this.state.text}
            onChange={this._onChange}
            onKeyDown={this._onKeyDown}
            />
        );
    },

    _onChange(e, value) {
        const { socket, user, threadID} = this.props;
        this.setState({text: e.target.value});
        if (e.target.value.length > 0 && !this.state.typing) {
            socket.emit('typing', { user: user.name, room: threadID});
            this.setState({ typing: true});
        }
        if (e.target.value.length === 0 && !this.state.typing) {
            socket.emit('not typing', { user: user.name, room: threadID});
            this.setState({ typing: false});
        }
    },

    _onKeyDown(e) {
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            findDOMNode(this.refs.message-composer).focus(); 
        }
        if (e.keyCode === 13) {
            e.preventDefault();
            var text = this.state.text.trim();
            if (text) {
                MessageCreator.createMessage(text, user, this.props.threadID);
            }
            this.setState({text: ''});
        }
    }
};

module.exports = MessageComposer;
