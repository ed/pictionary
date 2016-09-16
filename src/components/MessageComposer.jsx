import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MessageUtils from 'utils/MessageUtils';

class MessageComposer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '', 
            typing: false,
            focused: false
        };
        this._onChange = this._onChange.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }


    render() {
        return (
            <div id="msg-send">
                <textarea
                style={{border: `2px solid ${this.state.focused ? '#bdbdbd' : '#e9e9e9'}`}}
                className="message-composer"
                ref={(messageComposer) => this.messageComposer = messageComposer}
                name="message"
                value={this.state.text}
                onFocus={() => this.setState({focused: true})}
                onBlur={() => this.setState({focused: false})}
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
          if (text) {
            console.log(this.props.user.user)
                MessageUtils.createMessage(text, this.props.user.user, this.props.threadID);
            }
            this.setState({text: ''});
        }
    }
};

MessageComposer.propTypes =  {
        threadID: React.PropTypes.number.isRequired,
};

export default MessageComposer;
