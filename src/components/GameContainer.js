import React, {Component} from 'react';
import { whoami } from '../actions'
import { connect } from 'react-redux';


class Container extends Component {
  componentDidMount() {
    const { cookie } = this.props
    if (cookie) {
      this.props.dispatch(whoami())
    }
  }

  render() {
    return (
      <div className="container">
	{this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { 
    cookie: state.root.cookie,
  }
};

export default connect(
  mapStateToProps,
)(Container)
