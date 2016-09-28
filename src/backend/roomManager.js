'use strict';

var io = require('./socket');
var DMTManager = require('./DMTManager');

let mainRoom = 'draw_stuff';
let users = {};
let rooms = {'room2': [], 'room3' : []};
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
    console.log(socket.user + ' moved to room: ' + roomName);
    leaveAllRooms(socket);
    socket.join(roomName);
    socket.curRoom = roomName;
    if (roomName in rooms) {
    	rooms[roomName].push(socket.user);
    }
    let game = dmtManager.getGame(socket.curRoom);
    socket.emit('update game', game);
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
    socket.emit('update game', game);
  });
  
});

const app = require('express')();
const path = require('path');
var bodyParser = require('body-parser');
app.use( bodyParser.json() ); 
app.post('/register', (req, res) => {
	console.log(req.body);
  res.send('hello world');
});
app.get('/roomData/roomList', (req, res) => {
	console.log(`rooms: ${rooms}`);
  res.send(rooms);
});
app.get('/roomData/room/:roomName', (req, res) => {
	console.log(`rooms: ${JSON.stringify(rooms)}`);
	let room = req.params.roomName;
	console.log(room)
	if (room in rooms) {
		res.send(rooms[room]);
	}
	else {
		res.send(null);
	}
  
});
app.post('/roomData/makeRoom', (req, res) => {
	console.log(`rooms: ${rooms}`);
	let roomName = req.room;
	let user = req.user;

  if (roomName in rooms) {
  	rooms[roomName].push(user);
  }
  else {
  	rooms[roomName] = [user];
  }
});

var server = require('http').Server(app);
server.listen(3002);
