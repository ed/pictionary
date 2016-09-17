import React from 'react';
import { render } from 'react-dom';
import 'css/style.css';
import MessageSection from './MessageSection';
const socket = io.connect();

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      drawer: 'somestringthatcantpossiblybeguessed',
    }
  }

  componentDidMount() {
    socket.emit('add user', this.props.person);
    socket.emit('subscribe', 1);
    socket.on('drawer', d => { 
      this.setState({drawer: d}) 
    })
  }

  render() {
    if (this.props.person===this.state.drawer)
      alert('your turn to draw!')
    return(
      <MessageSection user={this.props.person} drawer={this.state.drawer} 
        />)
  }
}
