import { compose, createStore, applyMiddleware, combineReducers } from 'redux'
import root from '../reducers'
import {routerMiddleware, routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';

export default function configureStore (history, initialState) {
  const reducers = combineReducers({
    root,
    routing: routerReducer
  })
  const enhancer = compose(
    applyMiddleware(
      thunk,
      routerMiddleware(history)
    ),
  );
  const store = createStore(reducers, initialState, enhancer);
  return store;
}
