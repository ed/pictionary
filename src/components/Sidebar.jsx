import React, {Component} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { addNotification } from '../actions'
import CreateRoom from './CreateRoom'
import Popover from './Popover'
import BrowseRooms from './BrowseRooms'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Notification } from 'react-notification'


class SideBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      createRoomOpen: false,
      browseRoomsOpen: false,
      displayDropdown: false
    }
  }

  toggleDropdown() { this.setState({ displayDropdown: !this.state.displayDropdown }); }

  closeDropdown() { this.setState({ displayDropdown: false }); }

  openBrowseRooms() { this.setState({ browseRoomsOpen: true }); }

  closeBrowseRooms() { this.setState({ browseRoomsOpen: false }); }

  openCreateRooms(e) { 
    this.setState({createRoomOpen: true});
    e.stopPropagation(); 
  }

  closeCreateRooms() { this.setState({ createRoomOpen: false }); }

  render() {
    const { clients, gameInProgress, players, artist, rooms } = this.props;
    return (
      <div id="sidebar">
        <div>
          <div className="sidebarHeader">
          <div className="headerText">Pretty Pictures</div>
          <div className="addChannel" onClick={(e) => this.openCreateRooms(e)}> <i className="fa fa-plus-square-o fa-lg"></i> </div>
          <div className="headerUsername">{this.props.user}</div>
          </div>
        </div>
        {this.state.displayDropdown ? <Dropdown />: null }
        <div className="sidebarElementArea">
          {gameInProgress ?
            <div className="container">
            <PlayerHeader />
            {Object.keys(players).map( (player) => <Player key={player} name={player} player={players[player]} isActive={player===artist}/>)}
            </div>
            :
            <div className="container">
            <PlayerHeader />
            {clients.map( (player) => <Client key={player} name={player} isActive={player===artist}/>)}
            </div>
        }
        <CopyToClipboard text={document.URL} >
        <div className="copyLink" style={{width: '73px',  marginTop: '10px', fontSize: '80%',  paddingBottom: '4px', marginLeft: '15px', display: 'block'}} onClick={() => this.props.dispatch(addNotification('url copied to clipboard'))}>
        <i style={{fontSize: '85%',marginBottom: '2px', marginRight: '2px', marginLeft: '2px'}}className="ion-plus-round" aria-hidden="true"></i>  <span style={{fontWeight: 'bold',}} >  Copy link </span>
        </div>
        </CopyToClipboard>
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


const Dropdown = () => (
  <div style={{ borderRadius: '3px', zIndex: 3, width: '200px', height: '500px', position: 'absolute', top: '60px', left: '10px', background: 'white'}}> 
    asdasd
  </div>
)


const Player = ({ name, player, onClick, isActive }) => (
  <div className={`sidebarElement${ isActive ? " active" : ""}`} onClick={onClick}> 
      {player.pointsThisTurn > 0 ? <div style={{float: 'right', marginRight: '15px'}}> +{player.pointsThisTurn} </div> : null }
      <span> {name} </span>
      <br/>
      <span> {player.points} PTS</span>
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