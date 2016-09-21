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
      gameInProgress: false,
      artist: 'somestringthatcantpossiblybeguessed',
      players: [],
      word: '',
    }
  }

  componentDidMount() {
    socket.on('update game', (game) => {
      console.log(`game status updated to ${game}`);
      this.setState({
       gameInProgress: game.afoot,
       artist: game.artist,
       players: game.players,
       word: game.word, 
      });
      console.log(this.state);
    });

    socket.on('winner', (winner) => {
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
    if (this.props.person===this.state.artist) {
      alert(`${this.props.person} your word is ${this.state.word}`)
    }
    console.log('current artist: ' + this.state.artist)
    return(
      <div className="social-area">
        <Sidebar socket={socket}/>
        <WhiteBoard socket={socket} user={this.props.person} {...this.state} />
        <MessageSection socket={socket} user={this.props.person} {...this.state} />
      </div>
    )
  }
}
