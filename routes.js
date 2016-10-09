import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'
import GameContainer from './src/components/GameContainer'
import GameView from './src/components/GameView'
import CreateRoom from './src/components/CreateRoom'
import BrowseRooms from './src/components/BrowseRooms'


const CreateRoomWrapper = () => (
  <div className="popoverContainer">
    <CreateRoom />
  </div>
)


const BrowseRoomsWrapper = () => (
  <div className="popoverContainer">
    <BrowseRooms />
  </div>
)


module.exports = (
  <Route path="/" component={GameContainer}>
    <IndexRoute component={CreateRoomWrapper} />
    <Route path="browse" component={BrowseRoomsWrapper} />
    <Route path=":roomName" component={GameView} />
  </Route>
)
