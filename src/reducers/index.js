import * as types from '../constants'
import { combineReducers } from 'redux'

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

const root = combineReducers({
  rooms,
  user,
  socket,
  cookie,
  error,
  auth,
  room,
})

export default root
