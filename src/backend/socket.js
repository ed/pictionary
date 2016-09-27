'use strict';
const server = require('./server');

var io = require('socket.io')(server);

module.exports = io;