import React, {Component} from 'react';
import GameView from './GameView';
import Login from './Login';
import root from '../reducers';
import { Router, Route, Link, browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';

const store = createStore( 
    root,
    applyMiddleware(thunk)
);

export default class App extends Component {
  render() {
    return(
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={GameView} person={'african_child' + String(Math.random())} />
        </Router>
      </Provider>
    )
  }
}
