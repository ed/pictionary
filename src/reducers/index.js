import * as types from '../constants'
import { combineReducers } from 'redux'
import { OrderedSet } from 'immutable';
import React from 'react'

const assign = Object.assign


const initAuth = {
  sendingRequest: false,
  status: false
}

const initGame = {
  gameInProgress: false,
  artist: 'somestringthatcantpossiblybeguessed',
  players: [],
  word: '',
  canvasData: null
}

const initRoom = {
  clients: [],
  game: initGame
}

function modals(state={openModal: 'NONE'}, action) {
  console.log(action)
  switch (action.type) {
    case types.OPEN_MODAL:
      return { openModal : action.title};
    case types.CLOSE_MODAL:
      return { openModal : 'NONE'};
    default:
      return state;
    }
}

function error(state=null, action) {
  const {type, error} = action
  if (type === types.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }
  return state
}

function cookie(state, action) {
  state = state ? state : false;
  return state;
}

function auth(state=initAuth, action) {
  switch (action.type) {
  case types.SENDING_REQUEST:
    return assign({},state,{sendingRequest: true});
  case types.REQUEST_FAILURE:
    return assign({},state,initAuth)
  case types.REQUEST_SUCCESS:
    return assign({},state,{sendingRequest: false, status: true})
  default:
    return state;
  }
}

function room(state=initRoom, action) {
  switch (action.type) {
  case types.UPDATE_GAME:
    return {
      ...state,
      game: action.newGameState
    }
  case types.UPDATE_ROOM:
    return action.newRoomState
  default:
    return state;
  }
}

function rooms(state={rooms: [], isValid: false, isFetching: false}, action) {
  switch (action.type) {
  case types.SET_ROOMS:
    return {
      isValid: true,
      isFetching: false,
      rooms: action.rooms
    }
  case types.REQUEST_ROOMS:
    return {
      ...state,
      isFetching: true
    }
  default:
    return state;
  }
}

function socket(state=null, action) {
  let socket = state || action.socket;
  switch (action.type) {
  case types.SET_SOCKET:
    return socket
  default:
    return state;
  }
}

function user(state=null, action) {
  switch (action.type) {
  case types.SET_USER_INFO:
    return action.user
  case types.BYE_FELICIA:
    return null
  default:
    return state;
  }
}

let notificationID = 0;
function notifications(state=OrderedSet(), action) {
  switch (action.type) {
  case types.ADD_NOTIFICATION:
    let key = Number(notificationID++)
    return state.add({
      message: action.message,
      key,
      action: <i className="ion-ios-close-empty" aria-hidden="true"></i>,
      actionStyle: {color: 'white', width: '1px', fontSize: '200%'},
      dismissAfter: 3400,
      onClick: (deactivate) => {
        deactivate();
        setTimeout(() => action.removeNotification(key),400);
      }
    })
  case types.REMOVE_NOTIFICATION:
    return state.filter(n => n.key !== action.key)
  case types.DISMISS_NOTIFICATION:
    return state.delete(action.notification)
  default:
    return state;
  }
}

const root = combineReducers({
  modals,
  rooms,
  user,
  socket,
  cookie,
  error,
  auth,
  room,
  notifications
})

export default root
