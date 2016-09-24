import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MessageUtils from 'utils/MessageUtils';

class MessageComposer extends Component {

    constructor(props) {
        super(props);
        let noGameGoing = !this.props.gameInProgress;
        let isPlaying = (this.props.players.indexOf(this.props.user) > -1);
        let isArtist = (this.props.artist === this.props.user);
        let canChat = noGameGoing || (isPlaying && !isArtist);
        this.state = {
            text: '', 
            typing: false,
            focused: false,
            canChat
        };
        this._onChange = this._onChange.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let noGameGoing = !nextProps.gameInProgress;
        let isPlaying = (nextProps.players.indexOf(nextProps.user) > -1);
        let isArtist = (nextProps.artist === nextProps.user);
        let canChat = noGameGoing || (isPlaying && !isArtist);
        this.setState({canChat});
    }

    render() {
        let borderColor = '#e9e9e9';
        if(this.state.focused) {
            borderColor = '#bdbdbd';
        }
        return (
            <div id="msg-send">
                <textarea
                style={{border: `2px solid ${borderColor}`, background: `${this.state.canChat ? 'inherit' : '#ffe9c1'}`}}
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
        if (e.keyCode === 13) {
            e.preventDefault();
            let text = this.state.text.trim();
            if (text && this.state.canChat) {
                MessageUtils.createMessage(text, this.props.user, this.props.socket);
                this.setState({text: ''});
            }         
        }
    }
};

export default MessageComposer;
