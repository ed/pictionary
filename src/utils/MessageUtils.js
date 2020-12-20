const { nanoid } = require('nanoid');

var moment = require('moment');
moment().format();

module.exports = {
    unpackMessage: function(message, currentThreadID) {
        return {
            id: message.id,
            author: message.author,
            text: message.text,
            timestamp: message.timestamp
        };
    },
    createMessage: function(text, author) {
        return {
            id: 'm_'+nanoid(),
            author,
            text: text,
            timestamp: moment(Date.now()).format("h:mm a")
        };
    }
};
