import React, {Component} from 'react';
import Modal from 'react-modal';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

export default class Popover extends Component {

  constructor(props) {
    super(props);

    this.state = {
      active: false
    };
  }

  componentDidMount() {
    key('esc', () => this.handleClose());
  }

  componentWillUnmount() {
    key.unbind('esc')
  }

  handleClose() {
    this.setState({ active: false });
    setTimeout(this.props.close, 150);
  }

  fadeIn() {
    this.setState({ active: true });
  }

  render() {
    let opacity = this.state.active ? 1 : 0;
    let top = this.state.active ? 0 : 50;
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
              backgroundColor   : 'rgba(0, 0, 0, 0)',
            },
          content : {
            position                   : 'absolute',
            top                        : top,
            left                       : '0',
            right                      : '0',
            bottom                     : '0',
            textAlign                  : 'center',
            color                      : '#252525',
                          opacity           ,
              transition        : 'opacity .15s ease-in-out, top .15s ease-in-out',
          }
        }}
        onAfterOpen={() => this.fadeIn()}
        onRequestClose={() => this.handleClose()}
        >
        <div className="closeModal" tabIndex="-1" onClick={() => this.handleClose()} ><i className="ion-ios-close-empty"></i><span style={{ fontSize: '80%', position: 'absolute', top:'38px', left:'22px'}}>esc</span></div>
        <div className="popoverContainer" style={{ height:'70%', paddingTop:'100px'}}>
          {this.props.children}
        </div>
      </Modal>
    );
  }
}
