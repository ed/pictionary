'use strict';

var DMTManager = require('./DMTManager');

let mainRoom = 'draw_stuff';
let colors = ['#FF0000','#800000','#FFFF00','#808000','#008080','#F08080','#DAF7A6','#581845'];
let users = {};
let rooms = {'room2': [], 'room3' : []};
rooms[mainRoom] = [];

module.exports = (app, io) => {
	let dmtManager = DMTManager(io);

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
      let roomData = {
        game
      }
      console.log(game)
      socket.emit('update room', roomData);
    });

    socket.on('chat msg', (msg) => {
      console.log(`${socket.user} sent ${msg.text} to thread: ${socket.curRoom}`);
      dmtManager.testWinner(socket.curRoom,msg);
      msg['color'] = socket.color;
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
      socket.color = colors[Math.floor(Math.random()*colors.length)];
      socket.join(mainRoom);
      let game = dmtManager.getGame(mainRoom);
      users[username] = {
        socket: socket,
        room: mainRoom
      };
      let roomData = {
        game
      }
      socket.emit('update room', roomData);
    });
    
  });


  app.post('/register', (req, res) => {
    console.log(req.body);
    res.send('hello world');
  });

  app.get('/roomData/roomList', (req, res) => {
    console.log(`rooms: ${rooms}`);
    res.send(rooms);
  });

  app.post('/roomData/newRoom', (req, res) => {
    let roomName = req.body.room;

    if (roomName in rooms) {
      res.send({
      	error: '??'
      })
    }
    else {
      rooms[roomName] = [];
      res.send({
      	rooms
      })
    }
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
}