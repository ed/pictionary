var socket = io.connect();

module.exports = {
    createMessage: function(message) {
        // simulate writing to a database
        var createdMessage = {
            id: message.id,
            threadID: message.threadID,
            authorName: message.authorName,
            text: message.text,
            timestamp: message.timestamp
        };
        // redis store stuff here
        socket.emit('chat msg', message);
    }
}
