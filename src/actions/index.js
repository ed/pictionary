import * as types from '../constants'
import 'isomorphic-fetch'
import { push } from 'react-router-redux';

let headers = new Headers();
headers.append('Content-Type', 'application/json');

export const register = (username, password) => {
    return (dispatch) => {
        dispatch({ type: 'SENDING_REQUEST' });
        if (emptyFields({username,password})) {
            // throw err
            const error = new Error('please fill out both fields')
            dispatch({ type: 'REQUEST_FAILURE', error: error.message})
            throw error;
        }
        let body = JSON.stringify(
                {
                    'username': username,
                    'password': password
                });
        console.log(body)
        fetch('/register', { 
            method: 'POST', 
            headers,
            mode: 'cors',
            cache: 'default',
            body 
        })
        .then(response => {
            dispatch({ type: 'REQUEST_SUCCESS' })
        }, error => {
            dispatch({ type: 'REQUEST_FAILURE', error: error.message})
            throw error
        })
    }
}

export const updateGame = (newGameState) => {
    return {
        type: types.UPDATE_GAME,
        newGameState
    }
}

export const updateRoom = (newRoomState) => {
    return {
        type: types.UPDATE_ROOM,
        newRoomState
    }
}

export const setSocket = (socket) => {
    return {
        type: types.SET_SOCKET,
        socket
    }
}

export const setUserInfo = (username) => {
    return {
        type: types.SET_USER_INFO,
        username
    }
}

export const setRooms = (rooms) => {
    return {
        type: types.SET_ROOMS,
        rooms
    }
}

export const fetchRooms = () => {
    return (dispatch) => {
        dispatch({ type: types.REQUEST_ROOMS });
        return fetch('/roomData/roomList', { 
                headers,
                method: 'GET', 
                mode: 'cors',
                cache: 'default',
        })
        .then(response => response.json())
        .then(rooms => { 
          dispatch(setRooms(rooms))
        })
        .catch(error => {
          // do some error handling here
          console.log(error)
        })
    }
}

export const fetchRoomData = (room) => {
    return (dispatch) => {
        return fetch(`/roomData/room/${room}`, { 
                headers,
                method: 'GET', 
                mode: 'cors',
                cache: 'default',
        })
        .then(response => response.json())
        .then(roomData => {
            console.log(roomData)
            if (roomData.error) {
                dispatch(push('/'));
            }
            else {
                dispatch(updateRoom(roomData.room));
            }
        })
        .catch(error => {
          // do some error handling here
          console.log(error)
        })
    }
}

export const newRoom = (room) => {
    return (dispatch) => {
        console.log(room)
        return fetch('/roomData/newRoom', { 
                headers,
                method: 'POST', 
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify({
                    room,
                })
        })
        .then(response => response.json())
        .then(json => { 
            if( !json.error ) {
                dispatch(setRooms(json.rooms))
            }
            else {
                console.log(json.error)
            }
        })
        .catch(error => {
          // do some error handling here
          console.log(error)
        })
    }
}

export const emptyFields = (a) => {
    return Object.keys(a).map(k => a[k] !== '').includes(false)
}

export const resetErrorMessage = () => {
    return {
        type: types.RESET_ERROR_MESSAGE
    }

}
