import React, {Component} from 'react';
import GameView from './GameView';
import Login from './Login';
import root from '../reducers';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux'
import Sidebar from './Sidebar'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import 'css/style.css';

const store = createStore( 
    root,
    applyMiddleware(thunk)
);

const Container = ({ children }) => {
  return (
    <div className="container">
      <Sidebar />
      {children}
    </div>
  )
}

export default class App extends Component {
  render() {
    return(
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={Container}>
            <IndexRoute component={GameView} person={'african_child' + String(Math.random())} />
            <Route path="games/:curRoom" component={GameView} person={'african_child' + String(Math.random())} />
          </Route>
        </Router>
      </Provider>
    )
  }
}
