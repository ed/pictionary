import React, {Component} from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { updateGame, setSocket, setUserInfo } from '../actions'
import MessageSection from './MessageSection';
import Sidebar from './Sidebar';
import WhiteBoard from './WhiteBoard';
import Login from './Login';

class GameView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomDataReceived: false,
      loggingIn: false,
    }
  }

  componentDidMount() {
    this.props.socket.on('update game', (game) => this.updateGame(game) );
    this.props.socket.on('round over', (winner) => this.displayWinner(winner) );
  }

  updateGame(game) {
    console.log(game)
    this.props.dispatch(updateGame(game))
    this.setState({
     roomDataReceived: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.roomName !== nextProps.params.roomName){
      this.setState({
       roomDataReceived: false,
      });
      this.props.socket.emit('change room', nextProps.params.roomName);
    }
  }

  displayWinner(winner) {
    if (winner == null) {
      alert(`no one guessed the word :(((`);
    }
    else if (winner == this.props.user) {
      alert(`neat! you guessed the word!`);
    }
    else{
      alert(`${winner} won the round!`);
    }
  }

  render() {
    return(
      <div className="container">
      {this.state.loggingIn ? <Login /> : null}
      {this.state.roomDataReceived ?
        <div className="container">
          <WhiteBoard />
          <MessageSection socket={this.props.socket}/>
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

const mapStateToProps = (state) => {
  console.log(state);
  return { 
      socket: state.socket,
      user: state.user
  }
};

export default connect(
    mapStateToProps,
)(GameView)
