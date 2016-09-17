import uuid from 'node-uuid';

var socket = io.connect();
var moment = require('moment');
moment().format();

module.exports = {
    unpackMessage: function(message, currentThreadID) {
        return {
            id: message.id,
            threadID: message.threadID,
            authorName: message.authorName,
            text: message.text,
            timestamp: message.timestamp
        };
    },
    createMessage: function(text, artist, author, currentThreadID, word) {
        var message = {
            id: 'm_'+uuid.v4(),
            threadID: currentThreadID,
            authorName: author,
            text: text,
            timestamp: moment(Date.now()).format("h:mm a")
        };
      // redis store here
      socket.emit('chat msg', message);
      if (word === text && artist !== author) {
        socket.emit('winner', author);
      }

    }
};
