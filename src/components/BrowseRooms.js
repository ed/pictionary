import React, {Component} from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchRooms } from '../actions';
import { push } from 'react-router-redux';
import WhiteBoard from './WhiteBoard';
import CanvasViewOnly from './CanvasViewOnly';
import Spinner from './Spinner';

class BrowseRooms extends Component {
	constructor(props) {
	  super(props);

	  this.state = {
	  	isFetching: true,
	  	roomName: '',
	  	hoveredRoom: 'NONE',
      rooms: [],
	  };
	}

	componentDidMount() {
    this.props.dispatch(fetchRooms()).then(() => this.setState({
      isFetching: false,
      rooms: this.filterRooms(this.state.roomName)
    }))
  }

  _onChange(e) {
    this.setState({
      roomName: e.target.value,
      rooms: this.filterRooms(e.target.value)
    });
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

  hoverRoom(room) {
  	this.setState({
  		hoveredRoom: room
  	})
  }

  unHoverRoom() {
  	this.setState({
  		hoveredRoom: 'NONE'
  	})
  }

  filterRooms(roomName) {
  	let prevRoom;
  	let rooms = Object.keys(this.props.rooms).filter((room) => room.startsWith(roomName));
  	return rooms.map( (room) => {
  		let displayBorderTop = true;
  		if ( prevRoom === this.state.hoveredRoom || room === this.state.hoveredRoom ) displayBorderTop = false;
  		prevRoom = room;
  		return <Room
        key={room}
        isHovered={room === this.state.hoveredRoom}
        displayBorderTop={displayBorderTop}
        onMouseOver={() => this.hoverRoom(room)}
        onMouseOut={() => this.unHoverRoom()}
        name={room}
        room={this.props.rooms[room]}
        onClick={this.props.close} />
  	});
  }

	render() {
		const textBoxStyle = {
      fontSize:'120%',
      color:'#464646',
      paddingBottom: '6px',
      paddingTop:'15px',
      marginLeft: 0,
      marginRight: 0,
      paddingRight: 0,
      marginTop: '10px',
      marginBottom: '20px',
      borderWidth: '1px',
      height: '54px',
      width: '100%',
      boxSizing: 'border-box',
      flex: '0 0 auto'
    }
    const { rooms } = this.state;
		return (
			<div className="container">
			  <div className="container" style={{ position: 'relative',display: 'flex',flexDirection: 'column' }}>
				<div style={{marginBottom: '25px'}}>
				  <span><span style={{ fontSize: '200%', fontWeight:'bold' }}>Join a room</span> <button onClick={() => this.props.dispatch(push('/game'))}className="myButton active" style={{marginTop: '5px', padding: '8px 20px', float:'right'}}>Make Channel</button> </span>
				</div>
				  <textarea placeholder='Find a room' spellCheck={false} className="message-composer" style={textBoxStyle} value={this.state.roomName} onChange={(e) => this._onChange(e)} onKeyDown={(e) => this._onKeyDown(e)}/>
          {this.state.isFetching ? <Spinner/> :
  				  <div className="rooms">
  				    { rooms.length > 0 ? rooms : <span>No rooms match <span style={{fontWeight:'bold'}}>{this.state.roomName}</span></span>}
  				  </div>
          }
			  </div>
			</div>
		);
	}
}

const Room = ({ name, room, onClick, onMouseOut, onMouseOver, displayBorderTop, isHovered }) => (
		<Link
		onMouseEnter={onMouseOver}
		onMouseLeave={onMouseOut}
		onClick={onClick}
		to={`/game/r/${name}`}
		className="room"
		style={{
		 borderTop: displayBorderTop? '1px solid #DEDEDE' : isHovered? '' : '1px solid white', paddingLeft: '10px',
		 color:'grey',
		 paddingTop: '8px',
		 paddingBottom: '8px',
		 textDecoration: 'none'
		}}>
			<span style={{color:'#5d5d5d', fontSize:'90%', fontWeight:'bold'}}> {name} </span>
			<div style={{position: 'absolute',top:'30px', left:'10px', width:'100px', height: '80px', border: '1px solid #c5c5c5'}} >
			{room.game.gameInProgress ?
				<CanvasViewOnly canvasData={room.game.canvasData} />
				:
				<i style={{top: 'calc(50% - 7px)', left: 'calc(50% - 5px)', position: 'absolute', color: '#FF8669'}}className={`fa fa-play`} aria-hidden="true"></i>
			}
			</div>
			<div style={{marginTop:'40px',color:'#c5c5c5', float:'right', marginRight: '10px', fontSize: '90%'}}>
			{isHovered ?
				<i style={{color: '#1E90FF', fontSize: '200%'}}className="ion-ios-arrow-thin-right" aria-hidden="true"></i>
				:
				<div className="container">
				<i className="ion-ios-person-outline" aria-hidden="true"></i>
				<span style={{marginLeft:'2px'}}> {room.clients.length} </span>
				</div>
			}
			</div>
		</Link>
)

const mapStateToProps = (state) => {
  return {
  		canvasData: state.root.room.game.canvasData,
      rooms: state.root.rooms.rooms
  }
};

export default connect(
	mapStateToProps,
)(BrowseRooms)
