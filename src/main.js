import React from 'react';
import { render } from 'react-dom';
import root from 'reducers';
import configureStore from 'store';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import routes from '../routes';
import './css/style.css';
import './css/switch.css';
import { OrderedSet } from 'immutable'

let preloadedState = window.__PRELOADED_STATE__
if (preloadedState !== undefined) {
	preloadedState.root.notifications = OrderedSet();
}
const store = configureStore(browserHistory, preloadedState);
const history = syncHistoryWithStore(browserHistory, store);

const component = (
  <Router routes={routes} history={history} />
)

render( 
  <Provider store={store}>
    { component }
  </Provider>,
  document.getElementById('app')
);
