import React, {Component} from 'react';
import GameView from './GameView';
import Login from './Login';
import root from '../reducers';
import { Router, Route, IndexRoute, IndexRedirect, Link, browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux'
import 'isomorphic-fetch'
import { fetchRooms } from '../actions'

import { Provider } from 'react-redux'
import thunk from 'redux-thunk';

import GameContainer from './GameContainer'

const store = createStore( 
    root,
    applyMiddleware(thunk)
);


let headers = new Headers();
headers.append('Content-Type', 'application/json');

const roomExists = (nextState, replace) => {
  let { rooms } = store.getState();
  let room = nextState.params.roomName;
  if ( !(room in rooms.rooms) ) {
    replace({
      pathname: Object.keys(rooms.rooms)[0]
    });
  }
}


const getRooms = (nextState, replace, callback) => {
  store.dispatch(fetchRooms()).then(() => callback())
}

export default class App extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      roomsReceived: false
    };
  }

  componentDidMount() {
    store.dispatch(fetchRooms()).then(() => this.setState({
      roomsReceived: true
    }))
  }

  render() {
    let indexPath = '';
    if (this.state.roomsReceived) {
      let { rooms } = store.getState();   
      console.log(rooms)   
      let roomList = Object.keys(rooms.rooms);
      indexPath = roomList[0];
    }
    return(
      <div className="container">
      {this.state.roomsReceived ?
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={GameContainer} >
            <IndexRedirect to={indexPath} />
            <Route path=":roomName" component={GameView} onEnter={roomExists}/>
          </Route>
        </Router>
      </Provider>
      : 
      <div className="spinner">
        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
      </div>
    }
      </div>
    )
  }
}
