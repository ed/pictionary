import 'isomorphic-fetch'
import { push, replace } from 'react-router-redux'
import * as types from '../constants'

const headers = {
  'Content-Type': 'application/json'
}

const saveData = {}

export const redirectLogin = (curPath) => (dispatch) => {
  dispatch(replace('/'))
  saveData.returnPath = curPath
}

export const openModal = (title) => ({
  type: types.OPEN_MODAL,
  title
})

export const closeModal = () => ({
  type: types.CLOSE_MODAL
})

export const openSignup = () => ({
  type: types.OPEN_MODAL,
  title: 'signup'
})

export const openLogin = () => ({
  type: types.OPEN_MODAL,
  title: 'login'
})

export const addNotification = (message) => (dispatch) =>
  dispatch({
    type: types.ADD_NOTIFICATION,
    message,
    removeNotification: (key) => dispatch(removeNotification(key))
  })

export const requestFailure = (message) => (dispatch) => {
  dispatch(addNotification(message))
  return dispatch({
    type: 'REQUEST_FAILURE',
    error: message
  })
}

export const removeNotification = (key) => ({
  type: types.REMOVE_NOTIFICATION,
  key
})

export const dismissNotification = (notification) => ({
  type: types.DISMISS_NOTIFICATION,
  notification
})

export const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  return response.json().then((err) => Promise.reject(err))
}

export const parseJSON = (response) => response.json()

export const onSuccess = (user) => (dispatch) => {
  dispatch({ type: 'REQUEST_SUCCESS' })
  dispatch({ type: 'SET_USER_INFO', user: user })
  dispatch(setSocket())
  dispatch(closeModal())
  return dispatch(fetchRooms()).then(() => dispatch(returnToSavePath()))
}

export const returnToSavePath = () => (dispatch) => {
  const returnPath = saveData.returnPath || '/new'
  delete saveData.returnPath
  return dispatch(replace(returnPath))
}

export const whoami = (nextRoute) => (dispatch) => {
  dispatch({ type: 'SENDING_REQUEST' })
  return fetch('/whoami', {
    method: 'GET',
    headers,
    mode: 'cors',
    credentials: 'include',
    cache: 'no-cache'
  })
    .then(checkStatus)
    .then(parseJSON)
    .then((username) => {
      dispatch(onSuccess(username, nextRoute))
    })
    .catch((error) => {
      console.log(error.message)
      dispatch(requestFailure(error.message))
    })
}

export const logout = () => (dispatch) => {
  if (!confirm('Are you sure you want to log out?')) return
  dispatch({ type: 'SENDING_REQUEST' })
  fetch('/logout', {
    method: 'POST',
    headers,
    mode: 'cors',
    credentials: 'include',
    cache: 'no-cache'
  })
    .then(checkStatus)
    .then(() => {
      dispatch({ type: 'REQUEST_FAILURE' })
      dispatch({ type: 'BYE_FELICIA' })
      dispatch(push('/'))
    })
    .catch((error) => {
      dispatch(requestFailure(error.message))
    })
}

export const login = (username, password) => (dispatch) => {
  dispatch({ type: 'SENDING_REQUEST' })
  if (emptyFields({ username, password })) {
    return dispatch(requestFailure('Please fill out both fields'))
  }
  fetch('/login', {
    method: 'POST',
    headers,
    mode: 'cors',
    credentials: 'include',
    cache: 'no-cache',
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then(checkStatus)
    .then(() => dispatch(onSuccess(username)))
    .catch((error) => {
      dispatch(requestFailure(error.message))
    })
}

export const register = (username, password) => (dispatch) => {
  dispatch({ type: 'SENDING_REQUEST' })
  if (emptyFields({ username, password })) {
    // throw err
    return dispatch(requestFailure('Please fill out both fields'))
  }
  let myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  return fetch('/signup', {
    method: 'POST',
    headers,
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then(checkStatus)
    .then(() => {
      return dispatch(onSuccess(username))
    })
    .catch((error) => {
      dispatch(setSocket())
      dispatch(requestFailure(error.message))
    })
}

export const updateGame = (newGameState) => ({
  type: types.UPDATE_GAME,
  newGameState
})

export const updateRoom = (newRoomState) => ({
  type: types.UPDATE_ROOM,
  newRoomState
})

export const setSocket = () => {
  let socket = io()
  return {
    type: types.SET_SOCKET,
    socket
  }
}

export const setTempUserInfo = (name) => (dispatch) => {
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
    .then((json) => {
      if (json.err) {
        return dispatch(addNotification(json.err))
      } else {
        dispatch(setSocket())
        console.log('SETTING USER INFO')
        dispatch({ type: 'SET_USER_INFO', user: json.user })
        dispatch(returnToSavePath())
        return dispatch(fetchRooms())
      }
    })
}

export const setRooms = (rooms) => ({
  type: types.SET_ROOMS,
  rooms
})

export const fetchRooms = () => (dispatch) => {
  dispatch({ type: types.REQUEST_ROOMS })
  return fetch('/room/list', {
    headers,
    method: 'GET',
    mode: 'cors',
    cache: 'default'
  })
    .then(checkStatus)
    .then(parseJSON)
    .then((rooms) => {
      dispatch(setRooms(rooms))
    })
    .catch((error) => {
      console.log(error)
    })
}

export const fetchRoomData = (room) => (dispatch) => {
  return fetch(`/room/${room}`, {
    headers,
    method: 'GET',
    mode: 'cors',
    cache: 'default'
  })
    .then((response) => response.json())
    .then((roomData) => {
      if (roomData.error) {
        dispatch(replace('/new'))
        return {
          error: true
        }
      } else {
        console.log(roomData.room)
        dispatch(updateRoom(roomData.room))
        return {
          error: false,
          room: roomData.room
        }
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

export const newRoom = (roomData) => (dispatch) => {
  return fetch('/room/new', {
    headers,
    method: 'POST',
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify({
      roomName: roomData.name,
      visibility: roomData.visibility
    })
  })
    .then((response) => response.json())
    .then((json) => {
      if (!json.error) {
        dispatch(setRooms(json.rooms))
        dispatch(push(`/${json.roomName}`))
      } else {
        console.log(json.error)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

export const emptyFields = (a) =>
  Object.keys(a)
    .map((k) => a[k] !== '')
    .includes(false)

export const resetErrorMessage = () => ({
  type: types.RESET_ERROR_MESSAGE
})
