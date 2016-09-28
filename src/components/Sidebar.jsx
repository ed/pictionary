import React, {Component} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux';

class SideBar extends Component {
  render() {
    return (
      <div id="sidebar">
        <a href='#'><div className="sidebarHeader"><span className="headerText">Pretty Pictures</span></div></a>
        <div className="sidebarElementArea">
          <ChannelHeader />
          {Object.keys(this.props.rooms).map( (room) => <Channel key={room} title={room}/>)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms.rooms
  }
}

export default connect(
  mapStateToProps,
)(SideBar)

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