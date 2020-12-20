import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'
import GameContainer from './src/components/GameContainer'
import GameView from './src/components/GameView'
import CreateRoom from './src/components/CreateRoom'
import BrowseRooms from './src/components/BrowseRooms'
import Home from './src/components/Home'
import AppContainer from './src/components/AppContainer'

const CreateRoomWrapper = () => (
  <div
    style={{ height: '70%', paddingTop: '100px' }}
    className="popoverContainer"
  >
    <CreateRoom />
  </div>
)

const BrowseRoomsWrapper = () => (
  <div
    style={{ height: '70%', paddingTop: '100px' }}
    className="popoverContainer"
  >
    <BrowseRooms />
  </div>
)

const Container = ({ children }) => <div className="container">{children}</div>

const routes = (
  <Route path="/" component={AppContainer}>
    <IndexRoute component={Home} />
    <Route path="browse" component={BrowseRoomsWrapper} />
    <Route path="new" component={CreateRoomWrapper} />
    <Route path="/:roomName" component={GameView} />
  </Route>
)

export default routes
