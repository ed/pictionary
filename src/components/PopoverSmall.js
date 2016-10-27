import React, {Component} from 'react'
import Modal from 'react-modal'
import { closeModal } from '../actions'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'

class Popover extends Component {

  constructor(props) {
    super(props);

    this.state = {
      active: false
    };
    this.fadeIn = this.fadeIn.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    key('esc', () => this.handleClose());
  }

  componentWillUnmount() {
    key.unbind('esc')
  }

  handleClose() {
    this.props.dispatch(closeModal());
  }

  fadeIn() {
    this.setState({ active: true });
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        style={{
          overlay : {
              position          : 'fixed',
              top               : 0,
              left              : 0,
              right             : 0,
              bottom            : 0,
              backgroundColor   : 'rgba(0, 0, 0, .6)',
            },
          content : {
            position                   : 'absolute',
            width: '400px',
            height: '500px',
            top                        : '50%',
            left                       : '50%',
            transform: 'translate(-50%, -50%)',
            textAlign                  : 'center',
            color                      : '#252525',
              transition        : 'opacity .15s ease-in-out, top .15s ease-in-out',
          }
        }}
        onAfterOpen={this.fadeIn}
        onRequestClose={this.handleClose}
        >
          {this.props.children}
      </Modal>
    );
  }
}

export default connect()(Popover);