import React, {Component} from 'react'
import Modal from 'react-modal'

export default class Popover extends Component {

  componentDidMount() {
    key('esc', this.props.close);
  }

  componentWillUnmount() {
    key.unbind('esc')
  }

  render() {
    return (
      <Modal 
        isOpen={this.props.isOpen}
        style={{
          content : {
            position                   : 'absolute',
            top                        : '0',
            left                       : '0',
            right                      : '0',
            bottom                     : '0',
            textAlign                  : 'center',
            color                      : '#252525'
          }
        }}
        closeTimeoutMS={2000}
        >
        <div className="closeModal" tabIndex="-1" onClick={this.props.close} ><i className="ion-ios-close-empty"></i></div>
        <div className="popoverContainer">
          {this.props.children}
        </div>
      </Modal>
    );
  }
}