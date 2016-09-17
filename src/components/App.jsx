import React from 'react';
import 'css/style.css';
import MessageSection from './MessageSection';
import Sidebar from './Sidebar';
import WhiteBoard from './WhiteBoard';

const socket = io.connect();

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      artist: 'somestringthatcantpossiblybeguessed',
      word: '',
    }
  }

  componentDidMount() {
    socket.emit('add user', this.props.person);
    socket.emit('subscribe', 1);
    socket.on('artist', d => { 
      this.setState({artist: d.user, word: d.word}) 
    })
    socket.on('congrats', w => { 
      alert(`${w} has guessed the word ${this.state.word}!!`)
      this.setState({artist: 'somestringthatcantpossiblybeguessed' , word: ''})})
    socket.on('game over', _ => {
      this.setState({artist: 'somestringthatcantpossiblybeguessed' , word: ''})
    })
  }

  render() {
    if (this.props.person===this.state.artist) {
      alert(`${this.props.person} your word is ${this.state.word}`)
    }
    return(
      <div className="social-area">
        <Sidebar />
        <WhiteBoard user={this.props.person} artist={this.state.artist}/>
        <MessageSection user={this.props.person} artist={this.state.artist} word={this.state.gaming ? this.state.word : ''}/>
      </div>
    )
  }
}
