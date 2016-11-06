import React, {Component} from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { addNotification } from '../actions';
import CreateRoom from './CreateRoom';
import Popover from './Popover';
import BrowseRooms from './BrowseRooms';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Notification } from 'react-notification';


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
    const { user, clients, gameInProgress, players, artist, rooms } = this.props;
    return (
      <div id="sidebar">
        <div>
          <div className="sidebarHeader">
          <div className="headerText">Pretty Pictures</div>
          <div className="addChannel" onClick={(e) => this.openCreateRooms(e)}> <i className="fa fa-plus-square-o fa-lg"></i> </div>
          <div className="headerUsername">{user}</div>
          </div>
        </div>
        {this.state.displayDropdown ? <Dropdown />: null }
        <div className="sidebarElementArea">
          {gameInProgress ?
            <div className="container">
            <PlayerHeader onClick={() => this.props.dispatch(addNotification('url copied to clipboard'))}/>
            {Object.keys(players).map( (player) => <Player key={player} user={user} name={player} player={players[player]} isActive={player===artist}/>)}
            </div>
            :
            <div className="container">
            <PlayerHeader onClick={() => this.props.dispatch(addNotification('url copied to clipboard'))}/>
            {clients.map( (player) => <Client key={player} user={user} name={player}/>)}
            </div>
        }
        <CopyToClipboard text={document.URL} >
        <div className="copyLink" style={{width: '80px',  marginTop: '10px',  paddingBottom: '4px', marginLeft: '15px', display: 'block'}} onClick={() => this.props.dispatch(addNotification('url copied to clipboard'))}>
        <span style={{fontWeight: 'bold',}} >+  copy url </span>
        </div>
        </CopyToClipboard>
        </div>

      { this.props.gameInProgress ? <div style={{marginLeft: '15px', fontSize: '120%', marginTop: '20px'}}> Round {this.props.curRound}/{this.props.totalRounds} </div> : null }
      <div className="channelInterfaceContainer">
        <i className="ion-grid centerIcon" onClick={() => this.openBrowseRooms()}></i>
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
    curRound: state.root.room.game.round,
    totalRounds: state.root.room.game.totalRounds,
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


const Player = ({ user, name, player, onClick, isActive }) => (
  <div className={`sidebarElement${ isActive ? " active" : ""}`} onClick={onClick}>
      {player.pointsThisTurn > 0 ? <div style={{background: '#66CCCC', float: 'right', marginTop: '5px', marginRight: '15px', borderRadius: '4px', padding: '1px 10px'}}> {player.pointsThisTurn} </div> : null }
      <span> {name} {user === name ? '(you)' : null} </span>
      <br/>
      <span style={{color: '#66CCCC'}}> {player.points} PTS</span>
  </div>
);


const Client = ({ user, name, onClick, isActive }) => (
  <div className={`sidebarElement${ isActive ? " active" : ""}`} onClick={onClick}>
      <span> {name} {user === name ? '(you)' : null} </span>
  </div>
);


const PlayerHeader = ({ addChannel, onClick }) => (
  <CopyToClipboard text={document.URL} >
  <div className="channelHeader" style={{cursor: 'pointer'}} onClick={onClick}>
    <div className="channelHeaderText"> PLAYERS </div>
  </div>
  </CopyToClipboard>
);
