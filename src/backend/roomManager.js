'use strict';

var io = require('./socket');
var DMTManager = require('./DMTManager');

let mainRoom = 'draw stuff';
let users = {};
let rooms = {};
rooms[mainRoom] = [];

let dmtManager = DMTManager();

const usersByRoom = (room) => {
  let sockets = io.sockets.adapter.rooms[room].sockets;
  return Object.keys(sockets).map((socketId) => {
    var clientSocket = io.sockets.connected[socketId];
    return clientSocket.user;
  });
}

const leaveAllRooms = (socket) => {
  for (let room in socket.rooms) {
    socket.leave(room)
  }
}

io.on('connection', (socket) => { 

  socket.on('change room', (roomName) => {
    console.log(socket.username + ' moved to room: ' + id);
    leaveAllRooms(socket);
    socket.join(roomName);
    socket.curRoom = roomName;
  });

  socket.on('chat msg', (msg) => {
    console.log(`${socket.user} sent ${msg.text} to thread: ${socket.curRoom}`);
    dmtManager.testWinner(socket.curRoom,msg);
    io.sockets.in(socket.curRoom).emit('update chat', msg);
  });

  socket.on('client update canvas', (canvasData) => {
    dmtManager.updateGame(socket.curRoom,{canvasData});
    socket.broadcast.to(socket.curRoom).emit('update canvas', canvasData);
  });

  socket.on('start game', () => {
    console.log(`game started in room ${socket.curRoom}`);
    let players = usersByRoom(socket.curRoom);
    dmtManager.newGame(socket.curRoom,players);
  });

  socket.on('add user', (username) => {
    socket.user = username;
    socket.curRoom = mainRoom;
    socket.join(mainRoom);
    let game = dmtManager.getGame(mainRoom);
    users[username] = {
      socket: socket,
      room: mainRoom
    };
    rooms[mainRoom].push(username)
    console.log(rooms)
    socket.emit('update game', game);
  });
});