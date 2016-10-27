import * as types from '../constants'
import 'isomorphic-fetch'
import { push, replace } from 'react-router-redux';

let headers = new Headers();
headers.append('Content-Type', 'application/json');

let saveData = { };

export const redirectLogin = (returnPath) => {
  return (dispatch) => {
      dispatch(replace('/'));
      saveData.returnPath = returnPath;
      console.log(saveData)
  }
}
export const openModal = (title) => {
  return {
    type: types.OPEN_MODAL,
    title
  }
}

export const closeModal = () => {
  return {
    type: types.CLOSE_MODAL
  }
}

export const openSignup = () => {
  return {
    type: types.OPEN_MODAL,
    title: 'signup'
  }
}

export const openLogin = () => {
  return {
    type: types.OPEN_MODAL,
    title: 'login'
  }
}

export const requestFailure = (message) => {
    return (dispatch) => {
        dispatch(addNotification(message));
        return dispatch({
            type: 'REQUEST_FAILURE',
            error: message
        })
    }
}

export const addNotification = (message) => {
    return (dispatch) => {
        return dispatch({
            type: types.ADD_NOTIFICATION,
            message,
            removeNotification: (key) => dispatch(removeNotification(key))
        })
    }
}

export const removeNotification = (key) => {
    return {
        type: types.REMOVE_NOTIFICATION,
        key
    }
}

export const dismissNotification = (notification) => {
    return {
        type: types.DISMISS_NOTIFICATION,
        notification
    }
}


export const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    return response.json().then(err => Promise.reject(err));
  }
}

export const parseJSON = (response) => {
  return response.json()
}

export const onSuccess = (user, nextRoute='/game') => {
  return (dispatch) => {
    dispatch({ type: 'REQUEST_SUCCESS' });
    dispatch({ type: 'SET_USER_INFO', user: user});
    dispatch(setSocket());
    return dispatch(fetchRooms()).then(() => dispatch(replace(nextRoute)))
  }
}


export const whoami = (nextRoute) => {
  return (dispatch) => {
    dispatch({ type: 'SENDING_REQUEST' });
    return fetch('/whoami', {
      method: 'GET',
      headers,
      mode: 'cors',
      credentials: 'include',
      cache: 'no-cache',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(username => {
	        dispatch(onSuccess(username, nextRoute));
      }).catch(error => {
          console.log(error.message)
	        dispatch(requestFailure(error.message))
      });
  }
}

export const logout = () => {
  return (dispatch) => {
    dispatch({ type: 'SENDING_REQUEST' });
    fetch('/logout', {
      method: 'POST',
      headers,
      mode: 'cors',
      credentials: 'include',
      cache: 'no-cache',
    })
      .then(checkStatus)
      .then(() => {
        dispatch({ type: 'REQUEST_FAILURE' });
        dispatch({ type: 'BYE_FELICIA' });
        dispatch(push('/'));
      }).catch(error => {
        dispatch(requestFailure(error.message))
      });
  }
}

export const login  = (username, password) => {
  return (dispatch) => {
    dispatch({ type: 'SENDING_REQUEST' });
    if (emptyFields({username,password})) {
      // throw err
      dispatch({ type: 'REQUEST_FAILURE', error: 'please fill out both fields'})
      throw error;
    }
    fetch('/login', {
      method: 'POST',
      headers,
      mode: 'cors',
      credentials: 'include',
      cache: 'no-cache',
      body: JSON.stringify(
        {
          'username': username,
          'password': password
        })})
      .then(checkStatus)
      .then(() => dispatch(onSuccess(username)))
      .catch(error => {
        console.log(error)
        dispatch(requestFailure(error.message))
      });
  };
};


export const register = (username, password) => {
  return (dispatch) => {
    dispatch({ type: 'SENDING_REQUEST' });
    if (emptyFields({username,password})) {
      // throw err
      return dispatch(requestFailure('Please fill out both fields'))
    }
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    return fetch('/signup', {
      method: 'POST',
      headers,
      mode: 'cors',
      credentials: 'include',
      cache: 'default',
      body: JSON.stringify(
        {
          'username': username,
          'password': password
        })})
      .then(checkStatus)
      .then(() => {
        return dispatch(onSuccess(username));
      }).catch(error => {
        dispatch(setSocket());
        dispatch(requestFailure(error.message))
      });
  };
};

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

export const setSocket = () => {
  let socket = io();
  return {
    type: types.SET_SOCKET,
    socket
  }
}

export const setTempUserInfo = (name) => {
  return (dispatch) => {
    return fetch('/tempUserInfo', {
      method: 'POST',
      headers,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify({
        name
      })
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(json => {
      console.log(json)
      if (json.err) {
        return dispatch(addNotification(json.err));
      }
      else {
        dispatch(setSocket());
        dispatch({ type: 'SET_USER_INFO', user: json.user});
        if (saveData.returnPath) dispatch(push(saveData.returnPath));
        else dispatch(push('/game'));
        return dispatch(fetchRooms());
      }
    });
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
      .then(checkStatus)
      .then(parseJSON)
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
	if (roomData.error) {
	  dispatch(replace('/game'));
	  return {
	    error: true
	  }
	}
	else {
	  dispatch(updateRoom(roomData.room));
	  return {
	    error: false,
	    room: roomData.room
	  }
	}
      })
      .catch(error => {
	// do some error handling here
	console.log(error)
      })
  }
}

export const newRoom = (roomData) => {
  return (dispatch) => {
    console.log(roomData)
    return fetch('/roomData/newRoom', {
      headers,
      method: 'POST',
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify({
	roomName: roomData.name,
	visibility: roomData.visibility
      })
    })
      .then(response => response.json())
      .then(json => {
	if( !json.error ) {
	  dispatch(setRooms(json.rooms))
	  dispatch(push(`/game/r/${json.roomName}`));
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
