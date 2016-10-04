import React, {Component} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import CreateRoom from './CreateRoom'
import Popover from './Popover'
import BrowseRooms from './BrowseRooms'


class SideBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      createRoomOpen: false,
      browseRoomsOpen: false
    }
  }

  openBrowseRooms() { this.setState({browseRoomsOpen: true}); }

  closeBrowseRooms() { this.setState({browseRoomsOpen: false}); }

  openCreateRooms() { this.setState({createRoomOpen: true}); }

  closeCreateRooms() { this.setState({createRoomOpen: false}); }

  render() {
    const { gameInProgress, players, artist, rooms } = this.props;
    console.log(rooms)
    return (
      <div id="sidebar">
        <div className="sidebarHeader">
        <div className="headerText">Pretty Pictures</div>
        <div className="addChannel" onClick={() => this.openCreateRooms()}> <i className="fa fa-plus-square-o fa-lg"></i> </div>
        </div>
        <div className="sidebarElementArea">
          {gameInProgress ?
            <div className="container">
            <PlayerHeader />
            {players.map( (player) => <Player key={player} name={player} isActive={player===artist}/>)}
            </div>
            :
          <div className="container">
          <ChannelHeader />
          {Object.keys(rooms).map( (room) => <Channel key={room} title={room}/>)}
          </div>
        }
        </div>
      <div className="channelInterfaceContainer">
        <i className="ion-navicon-round centerIcon" onClick={() => this.openBrowseRooms()}></i>
      </div>
      <Popover close={() => this.closeCreateRooms()} isOpen={this.state.createRoomOpen}>
        <CreateRoom close={() => this.closeCreateRooms()}/> 
      </Popover>

      <Popover close={() => this.closeBrowseRooms()} isOpen={this.state.browseRoomsOpen}>
        <BrowseRooms close={() => this.closeBrowseRooms()} rooms={rooms}/> 
      </Popover>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    gameInProgress: state.game.gameInProgress,
    rooms: state.rooms.rooms,
    players: state.game.players,
    artist: state.game.artist
  }
}

export default connect(
  mapStateToProps,
)(SideBar)

const Player = ({ name, onClick, isActive }) => (
  <div className={`sidebarElement${ isActive ? " active" : ""}`} onClick={onClick}> 
      <span> {name} </span>
      <br/>
      <span> 3 PTS</span>
  </div>
);

const PlayerHeader = ({ addChannel }) => (
  <div className="channelHeader">
    <a href='#'> <div className="channelHeaderText"> PLAYERS </div> </a> 
  </div>
);

const Channel = ({ title, onClick }) => (
  <Link className="sidebarElement" to={title} activeClassName="active" onClick={onClick}> 
      <span><i>#</i> {title}</span>
      <br></br>
  </Link>
);

const ChannelHeader = ({ addChannel }) => (
  <div className="channelHeader">
    <a href='#'> <div className="channelHeaderText"> ROOMS </div> </a> 
    <div className="addChannel" onClick={addChannel}> <i className="fa fa-plus-square-o fa-lg"></i> </div>
  </div>
);