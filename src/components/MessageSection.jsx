var React = require('react');
var MessageComposer = require('./MessageComposer.react');
var MessageListItem = require('./MessageListItem.react');


function getMessageListItem(message) {
  return (
    <MessageListItem
      key={message.id}
      message={message}
    />
  );
}

var MessageSection = React.createClass({

  componentDidMount: function() {
    this._scrollToBottom();
  },

  render: function() {
    var messageListItems = this.state.messages.map(getMessageListItem);
    return (
      <div className="message-section">
        <ul className="message-list" ref="messageList">
          {messageListItems}
        </ul>
        <MessageComposer threadID={this.state.thread.id}/>
      </div>
    );
  },

  componentDidUpdate: function() {
    this._scrollToBottom();
  },

  _scrollToBottom: function() {
    var ul = this.refs.messageList.getDOMNode();
    ul.scrollTop = ul.scrollHeight;
  },

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = MessageSection;
