import React, {Component} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux';
import { fetchRooms } from '../actions'

class BrowseRooms extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	isFetching: true
	  };
	}

	componentDidMount() {
    this.props.dispatch(fetchRooms()).then(() => this.setState({
      isFetching: false
    }))
  }

	render() {
		return (
			<div className="container">
			  {this.state.isFetching ?
			  <div className="spinner">
			    <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
			  </div>
			  : 
			  <div className="container">
			  <ul >
			  	{Object.keys(this.props.rooms).map( (room) => <li  key={room}><Room name={room} onClick={this.props.close} /> </li>)}
			  </ul>
			  </div>
			}
			</div>
		);
	}
}

const Room = ({ name, onClick }) => (
	<div className="room">
		<Link onClick={onClick} to={name}>
			{name}
		</Link>
	</div>
)

export default connect()(BrowseRooms)