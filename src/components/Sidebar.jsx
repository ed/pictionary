import React, {Component} from 'react'
import { Link } from 'react-router'

let rooms = ['draw_stuff', 'room_two'];

export default class SideBar extends Component {
  render() {
    return (
      <div id="sidebar">
        <a href='#'><div className="sidebarHeader"><span className="headerText">Pretty Pictures</span></div></a>
        <div className="sidebarElementArea">
          <ChannelHeader/>
          {rooms.map( (room) => <Channel key={room} title={room}/>)}
        </div>
      </div>
    );
  }
}


class Channel extends Component {
  render() {
    return (
      <Link className="sidebarElement" to={this.props.title} activeClassName="active" onClick={this.props.onClick}> 
          <span><i>#</i> {this.props.title}</span>
          <br></br>
      </Link>
    );
  }
}

class ChannelHeader extends Component {
  render() {
    return (
     <div className="channelHeader">
       <a href='#'> <div className="channelHeaderText"> ROOMS </div> </a> 
       <a href='#'> <div className="addChannel"> <i className="fa fa-plus-square-o fa-lg"></i> </div> </a>
     </div>
    );
  }
}