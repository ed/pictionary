import React, {Component} from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { updateGame, setSocket, setUserInfo } from '../actions'
import MessageSection from './MessageSection';
import Sidebar from './Sidebar';
import WhiteBoard from './WhiteBoard';
import Login from './Login';

const socket = io.connect();

class GameView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomDataReceived: false,
      loggingIn: false,
    }
    this.props.dispatch(setSocket(socket))
    this.props.dispatch(setUserInfo(this.props.route.person))
  }

  componentDidMount() {
    socket.on('update game', (game) => {
      console.log(game)
      this.props.dispatch(updateGame(game))
      this.setState({
       roomDataReceived:true,
      });
    });

    socket.on('round over', (winner) => {
      if (winner == null) {
        alert(`no one guessed the word :(((`);
      }
      else if (winner == this.props.route.person) {
        alert(`neat! you guessed the word!`);
      }
      else{
        alert(`${winner} won the round!`);
      }
    });

    socket.emit('add user', this.props.route.person);
  }

  render() {
    console.log(this.props.data)
    return(
      <div className="container">
      {this.state.loggingIn ? <Login /> : null}
      {this.state.roomDataReceived ?
        <div className="container">
          <WhiteBoard />
          <MessageSection socket={socket}/>
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
    return { 
        data: state,
    }
};

export default connect(
    mapStateToProps,
)(GameView)
