import React, {Component} from 'react'
import { newRoom } from '../actions'
import { connect } from 'react-redux'

class CreateRoom extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      roomName: ''
    };
  }

  createRoom() {
    this.props.dispatch(newRoom(this.state.roomName.trim()))
  }

  _onChange(e) {
      this.setState({roomName: e.target.value});
  }

  _onKeyDown(e) {
      if (e.keyCode === 13) {
          if (this.state.roomName.trim().length > 0){
            this.createRoom(); 
          }
          e.preventDefault()             
      }
      if (e.keyCode === 27) this.props.close();
  }

  render() {
    let textBoxStyle = {
      fontSize:'120%',
      color:'#464646',
      paddingBottom: '6px', 
      paddingTop:'10px',
      marginLeft: 0,
      marginRight: 0, 
      paddingRight: 0,
      marginTop: '10px', 
      marginBottom: '10px', 
      borderWidth: '1px', 
      height: '44px',
      width: '100%',
      boxSizing: 'border-box'
    }
    return (
        <div className="container">
        <h1 style={{marginBottom: '10px', fontWeight:'bold'}}>Create a room</h1>
        <div style={{marginBottom: '12px', fontSize:'80%', color:'#c1c1c1'}}> Rooms can be public or private. Create a private room to play with friends or a public room to meet some new ones! </div>
        <span style={{paddingBottom: '10px', fontWeight:'bold', color:'#464646'}}> Name </span>
        <textarea className="message-composer" style={textBoxStyle} value={this.state.roomName} onChange={(e) => this._onChange(e)} onKeyDown={(e) => this._onKeyDown(e)}/>
        <br/>
        <button className="myButton" onClick={() => this.createRoom()}>Create Room</button>
        </div>
    );
  }
}

CreateRoom.contextTypes = {
    router: React.PropTypes.object
}

export default connect()(CreateRoom)