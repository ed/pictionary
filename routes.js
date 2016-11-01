import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'
import GameContainer from './src/components/GameContainer'
import GameView from './src/components/GameView'
import CreateRoom from './src/components/CreateRoom'
import BrowseRooms from './src/components/BrowseRooms'
import Home from './src/components/Home'
import AppContainer from './src/components/AppContainer'
import GuestLogin from  './src/components/GuestLogin'


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

const Container = ({children}) => (
    <div className="container">
        {children}
    </div>
)


module.exports = (
    <Route path='/' component={AppContainer}>
        <IndexRoute component={Home}/>
        <Route path='guest' component={GuestLogin}/>
        <Route path='game' component={GameContainer}>
            <IndexRoute component={CreateRoomWrapper} />
            <Route path='browse' component={BrowseRoomsWrapper} />
            <Route path='r/:roomName' component={GameView} />
        </Route>
    </Route>
)
