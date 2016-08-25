import uuid from 'node-uuid';

module.exports = {
  template: function(text, author, currentThreadID) {
    var timestamp = Date.now();
    return {
      id: 'm_'+uuid.v4()+timestamp,
      threadID: currentThreadID,
      authorName: author,
      text: text,
      timestamp: new Date(timestamp)
    };
  }
}
