import React, {Component} from 'react';
import GameView from './GameView';
import Login from './Login';
import root from '../reducers';
import { Router, Route, IndexRoute, IndexRedirect, Link, browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux'

import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import 'css/style.css';

import GameContainer from './GameContainer'

const store = createStore( 
    root,
    applyMiddleware(thunk)
);


export default class App extends Component {
  render() {
    return(
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={GameContainer}>
            <IndexRedirect to="/rooms/draw_stuff" />
            <Route path="rooms/:roomName" component={GameView} />
          </Route>
        </Router>
      </Provider>
    )
  }
}
