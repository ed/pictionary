import React, {Component} from 'react'

const socket = io.connect();


export default class SideBar extends Component {
  constructor(props) {
    super(props)
    this.startGame = this.startGame.bind(this)
  }

  startGame() {
    socket.emit('start game')
  }

  render() {
    return (
      <div id="sidebar">
        <a href='#'><div className="sidebarHeader"><span className="headerText">Pretty Pictures</span></div></a>
        <div className="sidebarElementArea">
          <SidebarElement title="draw stuff" startGame={this.startGame}/>
        </div>
      </div>
    );
  }
}


class SidebarElement extends Component {
  render() {
    return (
      <a href="#">
        <div className="sidebarElement">
          <span><i>#</i> {this.props.title}</span>
          <br></br>
          <span onClick={this.props.startGame}><i>#</i> {'start game'}</span>
        </div>
      </a>
    );
  }
}
