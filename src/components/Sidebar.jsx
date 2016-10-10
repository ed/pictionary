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

  openCreateRooms(e) { 
    this.setState({createRoomOpen: true});
    e.preventDefault(); 
  }

  closeCreateRooms() { this.setState({createRoomOpen: false}); }

  render() {
    const { clients, gameInProgress, players, artist, rooms } = this.props;
    return (
      <div id="sidebar">
        <Link to="/">
          <div className="sidebarHeader">
          <div className="headerText">Pretty Pictures</div>
          <div className="addChannel" onClick={(e) => this.openCreateRooms(e)}> <i className="fa fa-plus-square-o fa-lg"></i> </div>
          <div className="headerUsername">{this.props.user}</div>
          </div>
        </Link>
        <div className="sidebarElementArea">
          {gameInProgress ?
            <div className="container">
            <PlayerHeader />
            {Object.keys(players).map( (player) => <Player key={player} name={player} points={players[player].points} isActive={player===artist}/>)}
            </div>
            :
            <div className="container">
            <PlayerHeader />
            {clients.map( (player) => <Client key={player} name={player} isActive={player===artist}/>)}
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
    user: state.root.user,
    clients: state.root.room.clients,
    gameInProgress: state.root.room.game.gameInProgress,
    rooms: state.root.rooms.rooms,
    players: state.root.room.game.players,
    artist: state.root.room.game.artist
  }
}

export default connect(
  mapStateToProps,
)(SideBar)

const Player = ({ name, points, onClick, isActive }) => (
  <div className={`sidebarElement${ isActive ? " active" : ""}`} onClick={onClick}> 
      <span> {name} </span>
      <br/>
      <span> {points} PTS</span>
  </div>
);

const Client = ({ name, onClick, isActive }) => (
  <div className={`sidebarElement${ isActive ? " active" : ""}`} onClick={onClick}> 
      <span> {name} </span>
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