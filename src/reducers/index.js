import * as types from '../constants'
import { combineReducers } from 'redux'

const assign = Object.assign


const initAuth = {
    username: '',
    password: '',
    sendingRequest: false,
    loggedIn: false
}

const initGame = {
    gameInProgress: false,
    artist: 'somestringthatcantpossiblybeguessed',
    players: [],
    word: '',
    canvasData: null
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

function auth(state=initAuth, action) {
    switch (action.type) {
        case types.CHANGE_AUTH:
            return assign({},state,{status: action.status})
        case types.SENDING_REQUEST:
            return assign({},state,{sendingRequest: action.bool})
        default:
            return state;
    }
}

function game(state=initGame, action) {
    switch (action.type) {
        case types.UPDATE_GAME:
            return action.newGameState
        default:
            return state;
    }
}

function rooms(state={rooms: [], isFetching: false}, action) {
    switch (action.type) {
        case types.SET_ROOMS:
            return {
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
    switch (action.type) {
        case types.SET_SOCKET:
            return action.socket
        default:
            return state;
    }
}

function user(state=null, action) {
    switch (action.type) {
        case types.SET_USER_INFO:
            return action.username
        default:
            return state;
    }
}

const root = combineReducers({
    rooms,
    user,
    socket,
    error,
    auth,
    game,
})

export default root
