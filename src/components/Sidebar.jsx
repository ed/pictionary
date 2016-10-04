import React, {Component} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import CreateRoom from './CreateRoom'
import Popover from './Popover'


class SideBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() { this.setState({open: true}); }

  closeModal() { this.setState({open: false}); }

  render() {
    const { gameInProgress, players, artist, rooms } = this.props;
    console.log(rooms)
    return (
      <div id="sidebar">
        <div className="sidebarHeader">
        <div className="headerText">Pretty Pictures</div>
        <div className="addChannel" onClick={this.openModal}> <i className="fa fa-plus-square-o fa-lg"></i> </div>
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
        <i className="ion-navicon-round centerIcon" onClick={this.openModal}></i>
      </div>
      <Popover close={this.closeModal} isOpen={this.state.open}>
        <CreateRoom close={this.closeModal}/> 
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
  <Link className={`sidebarElement${ isActive ? " active" : ""}`} to={name} activeClassName="active" onClick={onClick}> 
      <span> {name} </span>
      <br/>
      <span> 3 PTS</span>
  </Link>
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