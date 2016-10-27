import React, {Component} from 'react'
import { setTempUserInfo } from '../actions'
import { connect } from 'react-redux'
import { Link } from 'react-router'


class GuestLogin extends Component {

  constructor(props) {
    super(props);

    this.addTempUser = this.addTempUser.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.state = {
      name: ''
    }
  }

  addTempUser() {
    this.props.dispatch(setTempUserInfo(this.state.name))
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    })
  }

  render() {
    const { buttonActive } = this.state;
    return (
      <div className="popoverContainer" style={{width: ''}}>
        <h1 style={{marginBottom: '10px', fontWeight:'bold'}}>Enter a screen name</h1>
        <div style={{marginBottom: '12px', fontSize:'80%', color:'#c1c1c1'}}> Your name will be prefixed by 'nerd_' to remind the other players of your unbecoming glasses and very noticeable mouth-breathing tendencies.</div>
        <form onSubmit={(e) => { e.preventDefault(); this.addTempUser(); }} >
        <p style={{verticalAlign: 'middle'}}>
        <label style={{fontSize: '120%', verticalAlign: 'middle', paddingBottom: '20px', paddingRight: '5px'}}>nerd_</label>
        <input onChange={this.onChangeName} placeholder="your name" style={{ height: '50px', paddingTop: '2px', paddingBottom: '10px', display:'inline-block', verticalAlign: 'middle', width: '300px'}} id="textarea" className="message-composer data-box"/>
        </p>
        <button className="myButton blue active"> Go   <i className="ion-android-arrow-forward"></i></button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rooms: state.root.rooms.rooms
  }
}

export default connect(
  mapStateToProps
)(GuestLogin)
