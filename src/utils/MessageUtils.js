import uuid from 'node-uuid';

var socket = io.connect();

module.exports = {
    createMessage: function(text, author, currentThreadID) {
        var message = {
            id: 'm_'+uuid.v4(),
            threadID: currentThreadID,
            authorName: author,
            text: text,
            timestamp: (new Date).toISOString().replace(/z|t/gi,' ').trim()
        };
        socket.emit('chat msg', message);
    }
    // redis store here
}
