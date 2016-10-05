import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MessageUtils from 'utils/MessageUtils';
import { connect } from 'react-redux';

class MessageComposer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '', 
            typing: false,
            focused: false,
        };
        this._onChange = this._onChange.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    render() {
        let borderColor = '#e9e9e9';
        if(this.state.focused) {
            borderColor = '#bdbdbd';
        }
        return (
            <div id="msg-send">
                <textarea
                style={{border: `2px solid ${borderColor}`, background: `${this.props.canChat ? 'inherit' : '#ffe9c1'}`}}
                className="message-composer"
                ref={(messageComposer) => this.messageComposer = messageComposer}
                name="message"
                value={this.state.text}
                onFocus={() => this.setState({focused: true})}
                onBlur={() => this.setState({focused: false})}
                onChange={this._onChange}
                onKeyDown={this._onKeyDown}
                placeholder={this.props.placeholder}
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
            if (text && this.props.canChat) {
                MessageUtils.createMessage(text, this.props.user, this.props.socket);
                this.setState({text: ''});
            }         
        }
    }
};

const mapStateToProps = (state) => {
    let noGameGoing = !state.room.game.gameInProgress;
    let isPlaying = (state.room.game.players.indexOf(state.user) > -1);
    let isArtist = (state.room.game.artist === state.user);
    let canChat = noGameGoing || (isPlaying && !isArtist);
    let placeholder = '';
    if (noGameGoing) {
        placeholder = 'Message room';
    }
    else if (canChat) {
        placeholder = 'Guess the word';
    }
    return {
        user: state.user,
        socket: state.socket,
        canChat,
        placeholder
    }
};

export default connect(
    mapStateToProps,
)(MessageComposer)
