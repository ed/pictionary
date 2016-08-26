import uuid from 'node-uuid';

var socket = io.connect();

module.exports = {
    unpackMessage: function(message, currentThreadID) {
        return {
            id: message.id,
            threadID: message.threadID,
            authorName: message.authorName,
            text: message.text,
            timestamp: (new Date).toISOString().replace(/z|t/gi,' ').trim()
        };
    },
    createMessage: function(text, author, currentThreadID) {
        var message = {
            id: 'm_'+uuid.v4(),
            threadID: currentThreadID,
            authorName: author,
            text: text,
            timestamp: (new Date).toISOString().replace(/z|t/gi,' ').trim()
        };
        // redis store here
        socket.emit('chat msg', message);
    }
};
