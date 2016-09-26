import * as types from '../constants'
import 'isomorphic-fetch'

export const register = (username, password) => {
    return (dispatch) => {
        dispatch({ type: 'SENDING_REQUEST' });
        if (emptyFields({username,password})) {
            // throw err
            const error = new Error('please fill out both fields')
            dispatch({ type: 'REQUEST_FAILURE', error: error.message})
            throw error;
        }
        let head = new Headers();
        head.append('Content-Type', 'application/json');
        let body = JSON.stringify(
                {
                    'username': username,
                    'password': password
                });
        console.log(body)
        fetch('/register', { 
            method: 'POST', 
            headers: head,
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

export const setSocket = (socket) => {
    return {
        type: types.SET_SOCKET,
        socket
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
