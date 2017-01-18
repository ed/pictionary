import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MessageUtils from '../utils/MessageUtils';
import { connect } from 'react-redux';

class MessageComposer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            focused: false,
        };
        this._onChange = this._onChange.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this.messageHistory = [];
        this.currentPos = -1;
    }

    render() {
        let borderColor = '#e9e9e9';
        if(this.state.focused) {
            borderColor = '#bdbdbd';
        }
        return (
            <div id="msg-send">
                <textarea
                  autoFocus={true}
                  style={{marginLeft: 'auto', display: 'block', width: '80%', border: `2px solid ${borderColor}`, background: `${this.props.canChat ? 'inherit' : '#ffe9c1'}`}}
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
    }

    _onKeyDown(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            let text = this.state.text.trim();
            if (text && this.props.canChat) {
                let msg = MessageUtils.createMessage(text, this.props.user);
                this.messageHistory.push(text);
                this.currentPos = this.messageHistory.length;
                this.props.socket.emit('chat msg', msg);
                this.setState({text: ''});
            }
        }
        else if (e.keyCode === 38) {
          e.preventDefault();
          if (this.currentPos > 0) {
            this.currentPos--;
            this.setState({text: this.messageHistory[this.currentPos]});
          }
        }
        else if (e.keyCode === 40) {
          e.preventDefault();
          if (this.currentPos < this.messageHistory.length) {
            let newText;
            if (this.currentPos === this.messageHistory.length - 1) newText = '';
            else newText = this.messageHistory[this.currentPos + 1];
            this.currentPos++;
            this.setState({text: newText});
          }
        }
    }
};

const mapStateToProps = (state) => {
    let noGameGoing = !state.root.room.game.gameInProgress;
    let isPlaying = (state.root.user in state.root.room.game.players);
    let isArtist = (state.root.room.game.artist === state.root.user);
    let turnInProgress = state.root.room.game.turnStatus === 'drawing';
    let canChat = noGameGoing || (isPlaying && state.root.room.game.players[state.root.user].pointsThisTurn == 0 && !isArtist && turnInProgress);
    let placeholder = '';
    if (noGameGoing) {
        placeholder = 'Message room';
    }
    else if (canChat) {
        placeholder = 'Guess the word';
    }
    return {
        user: state.root.user,
        socket: state.root.socket,
        canChat,
        placeholder
    }
};

export default connect(
    mapStateToProps,
)(MessageComposer)
