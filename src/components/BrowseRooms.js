import React, {Component} from 'react'
import { Link } from 'react-router'

export default class BrowseRooms extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {
		return (
			<div className="container">
			<ul >
				{Object.keys(this.props.rooms).map( (room) => <li  key={room}><Room name={room} onClick={this.props.close} /> </li>)}
			</ul>
			</div>
		);
	}
}

const Room = ({ name, onClick }) => (
	<div className="room">
		<Link onClick={close} to={name}>
			{name}
		</Link>
	</div>
)