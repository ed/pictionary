import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'
import GameContainer from './src/components/GameContainer'
import GameView from './src/components/GameView'
import CreateRoom from './src/components/CreateRoom'
import Login from './src/components/Login'
import Register from './src/components/Register'
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

const Container = ({children}) => (
    <div className="container">
        {children}
    </div>
)


module.exports = (
    <Route path='/' component={Container}>
        <Route path='login' component={Login}/>
        <IndexRoute component={Register}/>
        <Route path='game' component={GameContainer}>
            <IndexRoute component={CreateRoomWrapper} />
            <Route path='browse' component={BrowseRoomsWrapper} />
            <Route path='r/:roomName' component={GameView} />
        </Route>
    </Route>
)
