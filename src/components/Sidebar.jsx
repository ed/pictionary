import React, {Component} from 'react'

export default class SideBar extends Component {
  render() {
    return (
      <div id="sidebar">
        <a href='#'><div className="sidebarHeader"><span className="headerText">Pretty Pictures</span></div></a>
        <div className="sidebarElementArea">
          <ChannelHeader/>
          <SidebarElement title="draw stuff" active="true"/>
          <SidebarElement title="thats it :("/>
        </div>
      </div>
    );
  }
}


class SidebarElement extends Component {
  render() {
    return (
      <a href="#"> 
        <div className={`sidebarElement${this.props.active ? ' active' : ''}`} onClick={this.props.onClick}>
          <span><i>#</i> {this.props.title}</span>
          <br></br>
        </div>
      </a>
    );
  }
}

class ChannelHeader extends Component {
  render() {
    return (
     <div className="channelHeader">
       <a href='#'> <div className="channelHeaderText"> CHANNELS </div> </a> 
       <a href='#'> <div className="addChannel"> <i className="fa fa-plus-square-o fa-lg"></i> </div> </a>
     </div>
    );
  }
}