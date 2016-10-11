import * as types from '../constants'
import 'isomorphic-fetch'
import { push } from 'react-router-redux';

let headers = new Headers();
headers.append('Content-Type', 'application/json');


export const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export const parseJSON = (response) => {
  return response.json()
}

export const onSuccess = (user) => {
  return (dispatch) => {
    dispatch({ type: 'REQUEST_SUCCESS' });
    dispatch({ type: 'SET_USER_INFO', user: user});
    dispatch(setSocket());
    dispatch(fetchRooms());
    dispatch(push('/'));
  }
}


export const whoami = () => {
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
      .then(json => {
	       dispatch({ type: 'REQUEST_SUCCESS' });
           dispatch({ type: 'SET_USER_INFO', user: json});
           dispatch(setSocket());
           dispatch(fetchRooms());
      }).catch(error => {
	       dispatch({ type: 'REQUEST_FAILURE', error: error.message})
	       throw error;
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
        dispatch({ type: 'REQUEST_FAILURE', error: error.message})
        throw error;
      });
  }
}

export const login  = (username, password) => {
  return (dispatch) => {
    dispatch({ type: 'SENDING_REQUEST' });
    if (emptyFields({username,password})) {
      // throw err
      const error = new Error('please fill out both fields')
      dispatch({ type: 'REQUEST_FAILURE', error: error.message})
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
      .then(() => {
        dispatch(onSuccess(username));
      }).catch(error => {
        dispatch({ type: 'REQUEST_FAILURE', error: error.message})
        throw error;
      });
  };
};


export const register = (username, password) => {
  return (dispatch) => {
    dispatch({ type: 'SENDING_REQUEST' });
    if (emptyFields({username,password})) {
      // throw err
      const error = new Error('please fill out both fields')
      dispatch({ type: 'REQUEST_FAILURE', error: error.message})
      throw error;
    }
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    fetch('/signup', { 
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
        dispatch(onSuccess(username));
      }).catch(error => {
        dispatch({ type: 'REQUEST_FAILURE', error: error.message})
        throw error;
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
      .then(checkStatus)
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
	if (roomData.error) {
	  dispatch(push('/'));
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
	  dispatch(push(`/${json.roomName}`));
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
