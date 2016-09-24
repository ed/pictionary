import React, {Component} from 'react';
import 'css/style.css';
import MessageSection from './MessageSection';
import Sidebar from './Sidebar';
import WhiteBoard from './WhiteBoard';

const socket = io.connect();

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      roomDataReceived: false,
      gameInProgress: false,
      artist: 'somestringthatcantpossiblybeguessed',
      players: [],
      word: '',
    }
  }

  componentDidMount() {
    socket.on('update game', (game) => {
      this.setState({
       roomDataReceived:true,
       gameInProgress: game.afoot,
       artist: game.artist,
       players: game.players,
       word: game.word, 
       timeLeft: game.timeLeft,
       canvasData: game.canvasData
      });
      console.log(this.state)
    });

    socket.on('round over', (winner) => {
      if (winner == null) {
        alert(`no one guessed the word :(((`);
      }
      else if (winner == this.props.person) {
        alert(`neat! you guessed the word!`);
      }
      else{
        alert(`${winner} won the round!`);
      }
    });

    socket.emit('add user', this.props.person);
  }

  render() {
    console.log(this.state.gameInProgress)
    return(
      <div className="social-area">
      {this.state.roomDataReceived ?
        <div className="social-area">
        <Sidebar socket={socket}/>
        <WhiteBoard socket={socket} user={this.props.person} {...this.state} />
        <MessageSection socket={socket} user={this.props.person} {...this.state} />
        </div>
      : 
      <div className="spinner">
        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
      </div>
      }
      </div>
    )
  }
}
