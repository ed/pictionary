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

const preloadedState = window.__PRELOADED_STATE__
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
