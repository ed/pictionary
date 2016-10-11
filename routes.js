import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'
import GameContainer from './src/components/GameContainer'
import GameView from './src/components/GameView'
import CreateRoom from './src/components/CreateRoom'
import Login from './src/components/Login'
import Register from './src/components/Register'
import BrowseRooms from './src/components/BrowseRooms'
import Home from './src/components/Home'


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
    <IndexRoute component={Home} />
    <Route path='login' component={Login}/>
    <Route path='signup' component={Register}/>
    <Route path="browse" component={BrowseRoomsWrapper} />
    <Route path="create" component={CreateRoomWrapper} />
    <Route path=":roomName" component={GameView} />
    </Route>
)
