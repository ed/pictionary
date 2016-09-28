import React, {Component} from 'react';
import GameView from './GameView';
import Login from './Login';
import root from '../reducers';
import { Router, Route, IndexRoute, IndexRedirect, Link, browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux'
import 'isomorphic-fetch'
import { setRooms } from '../actions'

import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import 'css/style.css';

import GameContainer from './GameContainer'

const store = createStore( 
    root,
    applyMiddleware(thunk)
);


let headers = new Headers();
headers.append('Content-Type', 'application/json');

const roomExists = (nextState, replace) => {
  let { rooms } = store.getState();
  console.log(rooms)
  let room = nextState.params.roomName;
  if ( !(room in rooms) ) {
    replace({
      pathname: 'draw_stuff'
    });
  }
}


const getRooms = (nextState, replace, callback) => {
  fetch('/roomData/roomList', { 
        headers,
        method: 'GET', 
        mode: 'cors',
        cache: 'default',
    })
    .then(response => response.json())
    .then(rooms => { 
      store.dispatch(setRooms(rooms))
      callback();
    })
    .catch(error => {
      // do some error handling here
      callback(error);
    })
}

export default class App extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      roomsReceived: false
    };
  }

  componentDidMount() {
    fetch('/roomData/roomList', { 
        headers,
        method: 'GET', 
        mode: 'cors',
        cache: 'default',
    })
    .then(response => response.json())
    .then(rooms => { 
      store.dispatch(setRooms(rooms)).then( () => console.log('done'))
    })
    .catch(error => {
      // do some error handling here
      console.log(error)
    })
  }

  render() {
    return(
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={GameContainer} onEnter={getRooms}>
            <IndexRedirect to="draw_stuff" />
            <Route path=":roomName" component={GameView} onEnter={roomExists}/>
          </Route>
        </Router>
      </Provider>
    )
  }
}
