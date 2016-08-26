var WebUtils = require('utils/WebUtils');
var MessageUtils = require('utils/MessageUtils');

module.exports = {
  createMessage: function(text, author, currentThreadID) {
    var message = MessageUtils.template(text, author, currentThreadID);
    WebUtils.createMessage(message);
  }
};
