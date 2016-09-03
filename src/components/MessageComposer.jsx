import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MessageUtils from 'utils/MessageUtils';

class MessageComposer extends Component {

    propTypes: {
        threadID: React.PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {text: '', typing: false};
        this._onChange = this._onChange.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }


    render() {
        return (
            <div id="msg-send">
                <textarea
                className="message-composer"
                ref={(messageComposer) => this.messageComposer = messageComposer}
                name="message"
                value={this.state.text}
                onChange={this._onChange}
                onKeyDown={this._onKeyDown}
                />
            </div>
        );
    }

    _onChange(e, value) {
        this.setState({text: e.target.value});
        if (e.target.value.length > 0 && !this.state.typing) {
            {/* socket.emit('typing', { user: user.name, room: threadID}); */}
            this.setState({typing: true});
        }
        if (e.target.value.length === 0 && !this.state.typing) {
            {/* socket.emit('not typing', { user: user.name, room: threadID}); */}
            this.setState({typing: false});
        }
    }

    _onKeyDown(e) {
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            this.messageComposer.focus(); 
        }
        if (e.keyCode === 13) {
            e.preventDefault();
            let text = this.state.text.trim();
            let user = {
                name: 'edward',
                id: 1
            }
                ;
            if (text) {
                MessageUtils.createMessage(text, user.name, this.props.threadID);
            }
            this.setState({text: ''});
        }
    }
};

export default MessageComposer;
