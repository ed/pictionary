import React, {Component} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux';

const SideBar = ({ gameInProgress, rooms, players }) => (
  <div id="sidebar">
    <a href='#'><div className="sidebarHeader"><span className="headerText">Pretty Pictures</span></div></a>
    <div className="sidebarElementArea">
      {gameInProgress ?
        <div className="container">
        <PlayerHeader />
        {players.map( (player) => <Player key={player} name={player}/>)}
        </div>
        :
      <div className="container">
      <ChannelHeader />
      {Object.keys(rooms).map( (room) => <Channel key={room} title={room}/>)}
      </div>
    }
    </div>
  </div>
);

const mapStateToProps = (state) => {
  return {
    gameInProgress: state.game.gameInProgress,
    rooms: state.rooms.rooms,
    players: state.game.players
  }
}

export default connect(
  mapStateToProps,
)(SideBar)

const Player = ({ name, onClick }) => (
  <Link className="sidebarElement" to={name} activeClassName="active" onClick={onClick}> 
      <span> {name} </span>
      <br></br>
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