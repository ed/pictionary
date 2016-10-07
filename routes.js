import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'
import GameContainer from './src/components/GameContainer'
import GameView from './src/components/GameView'
import 'isomorphic-fetch'

let headers = new Headers();
headers.append('Content-Type', 'application/json');

const roomExists = (nextState, replace, cb) => {
	console.log(window.__PRELOADED_STATE__)
  fetch('http://localhost:3000/roomData/roomList', { 
          headers,
          method: 'GET', 
          mode: 'cors',
          cache: 'default',
  })
  .then(response => response.json())
  .then(rooms => { 
    let room = nextState.params.roomName;
    console.log('fetched rooms' + JSON.stringify(rooms))
    if ( !(room in rooms) ) {
    	console.log('room not found')
      replace({
        pathname: Object.keys(rooms)[0]
      });
    }
    cb();
  })
  .catch(error => {
    // do some error handling here
    console.log(error)
    cb(error);
  })
}

module.exports = (
  <Route path="/" component={GameContainer} >
    <IndexRedirect to='draw_stuff' />
    <Route path=":roomName" component={GameView} />
  </Route>
)
